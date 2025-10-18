-- SPRINT 1: CRITICAL SECURITY FIX - Prevent role self-assignment
-- Create separate user_roles system to prevent privilege escalation

-- Step 1: Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'propietario', 'inquilino');

-- Step 2: Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    assigned_by UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Only admins can view roles
CREATE POLICY "Only admins can view roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
);

-- Only admins can assign roles
CREATE POLICY "Only admins can assign roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
);

-- Step 3: Security definer function to check roles (bypasses RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id AND role = _role
    );
$$;

COMMENT ON FUNCTION public.has_role IS 'Checks if a user has a specific role. Uses SECURITY DEFINER to bypass RLS.';

-- Step 4: Helper function to get user's primary role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT role
    FROM public.user_roles
    WHERE user_id = _user_id
    ORDER BY 
        CASE role
            WHEN 'admin' THEN 1
            WHEN 'propietario' THEN 2
            WHEN 'inquilino' THEN 3
        END
    LIMIT 1;
$$;

COMMENT ON FUNCTION public.get_user_role IS 'Returns user primary role with admin > propietario > inquilino precedence.';

-- Step 5: Migrate existing roles from profiles to user_roles
INSERT INTO public.user_roles (user_id, role, assigned_at)
SELECT 
    id,
    role::app_role,
    created_at
FROM public.profiles
WHERE role IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 6: CRITICAL - Replace handle_new_user to NEVER trust client role input
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
    -- ALWAYS assign 'inquilino' role by default
    -- NEVER trust raw_user_meta_data from client for roles
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
        'inquilino' -- HARDCODED - never trust client input for roles
    );
    
    -- Create role entry in separate user_roles table
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'inquilino');
    
    -- Log the user creation for audit purposes
    PERFORM public.log_security_event(
        'user_created',
        NEW.id,
        NULL,
        NULL,
        jsonb_build_object(
            'email', NEW.email,
            'assigned_role', 'inquilino',
            'timestamp', NOW()
        ),
        'low'
    );
    
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.handle_new_user() IS 
'Creates user profile with HARDCODED inquilino role. Roles must be assigned by admins only via admin_update_user_role().';

-- Step 7: Deprecate profiles.role column (keep for backward compatibility)
COMMENT ON COLUMN public.profiles.role IS 
'DEPRECATED: Use user_roles table instead. Kept for backward compatibility only.';

-- Step 8: Update admin_update_user_role to use user_roles table
CREATE OR REPLACE FUNCTION public.admin_update_user_role(p_user_id uuid, p_new_role text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    admin_user_id UUID;
    old_role TEXT;
BEGIN
    -- Verify the caller is an admin using new user_roles table
    IF NOT public.has_role(auth.uid(), 'admin') THEN
        PERFORM public.log_security_event(
            'unauthorized_role_change_attempt',
            auth.uid(),
            NULL,
            NULL,
            jsonb_build_object(
                'target_user_id', p_user_id,
                'attempted_role', p_new_role,
                'timestamp', NOW()
            ),
            'critical'
        );
        
        RAISE EXCEPTION 'No tienes permisos para cambiar roles de usuario';
    END IF;
    
    -- Validate the new role
    IF p_new_role NOT IN ('admin', 'propietario', 'inquilino') THEN
        RAISE EXCEPTION 'Rol inválido: %', p_new_role;
    END IF;
    
    -- Get the old role for logging
    SELECT role::text INTO old_role
    FROM public.user_roles
    WHERE user_id = p_user_id
    LIMIT 1;
    
    -- Delete old role and insert new one
    DELETE FROM public.user_roles WHERE user_id = p_user_id;
    INSERT INTO public.user_roles (user_id, role, assigned_by)
    VALUES (p_user_id, p_new_role::app_role, auth.uid());
    
    -- Update profiles.role for backward compatibility
    UPDATE public.profiles
    SET role = p_new_role
    WHERE id = p_user_id;
    
    -- Update Usuarios.rol if exists
    UPDATE public."Usuarios"
    SET rol = p_new_role
    WHERE id = p_user_id;
    
    -- Log the role change
    PERFORM public.log_security_event(
        'admin_role_change',
        auth.uid(),
        NULL,
        NULL,
        jsonb_build_object(
            'target_user_id', p_user_id,
            'old_role', old_role,
            'new_role', p_new_role,
            'admin_id', auth.uid(),
            'timestamp', NOW()
        ),
        'high'
    );
    
    RETURN TRUE;
END;
$$;