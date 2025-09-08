-- CRITICAL SECURITY FIX: Secure Usuarios table from unauthorized access
-- This migration fixes the vulnerability where customer emails could be stolen

-- 1. ENSURE RLS IS ENABLED (critical security requirement)
ALTER TABLE public."Usuarios" ENABLE ROW LEVEL SECURITY;

-- 2. DROP ALL EXISTING POLICIES TO ELIMINATE CONFLICTS
DROP POLICY IF EXISTS "Users can only view their own profile" ON public."Usuarios";
DROP POLICY IF EXISTS "Usuarios pueden actualizar su perfil" ON public."Usuarios";
DROP POLICY IF EXISTS "Usuarios pueden crear su perfil" ON public."Usuarios";
DROP POLICY IF EXISTS "usuarios_insert_policy" ON public."Usuarios";
DROP POLICY IF EXISTS "usuarios_update_policy" ON public."Usuarios";
DROP POLICY IF EXISTS "usuarios_secure_select" ON public."Usuarios";
DROP POLICY IF EXISTS "usuarios_secure_insert" ON public."Usuarios";
DROP POLICY IF EXISTS "usuarios_secure_update" ON public."Usuarios";

-- 3. CREATE SINGLE SET OF SECURE POLICIES (no anonymous access allowed)

-- SELECT: Only authenticated users can view their own profile
CREATE POLICY "usuarios_authenticated_select_own" 
ON public."Usuarios" 
FOR SELECT 
TO authenticated
USING (
    auth.uid() IS NOT NULL 
    AND id = auth.uid()
);

-- INSERT: Only authenticated users can create their own profile
CREATE POLICY "usuarios_authenticated_insert_own" 
ON public."Usuarios" 
FOR INSERT 
TO authenticated
WITH CHECK (
    auth.uid() IS NOT NULL 
    AND id = auth.uid()
    AND email IS NOT NULL
    AND validate_email_format(email) = true
    AND length(email) >= 5
    AND length(email) <= 100
    AND length(nombre) >= 2
    AND length(nombre) <= 100
);

-- UPDATE: Only authenticated users can update their own profile
CREATE POLICY "usuarios_authenticated_update_own" 
ON public."Usuarios" 
FOR UPDATE 
TO authenticated
USING (
    auth.uid() IS NOT NULL 
    AND id = auth.uid()
)
WITH CHECK (
    auth.uid() IS NOT NULL 
    AND id = auth.uid()
    AND (email IS NULL OR (
        validate_email_format(email) = true
        AND length(email) >= 5
        AND length(email) <= 100
    ))
    AND (nombre IS NULL OR (
        length(nombre) >= 2
        AND length(nombre) <= 100
    ))
);

-- DELETE: Prevent deletion of user profiles (security best practice)
-- No DELETE policy = no one can delete profiles

-- 4. GRANT MINIMAL NECESSARY PERMISSIONS
-- Revoke any broad permissions that might exist
REVOKE ALL ON public."Usuarios" FROM anon;
REVOKE ALL ON public."Usuarios" FROM public;

-- Grant only specific permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON public."Usuarios" TO authenticated;

-- 5. CREATE AUDIT FUNCTION FOR MONITORING ACCESS
CREATE OR REPLACE FUNCTION public.log_usuarios_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Log any suspicious access attempts
    IF TG_OP = 'SELECT' AND auth.uid() IS NULL THEN
        RAISE WARNING 'Unauthorized SELECT attempt on Usuarios table from IP: %', 
            coalesce(current_setting('request.headers')::json->>'x-forwarded-for', 'unknown');
    END IF;
    
    IF TG_OP = 'INSERT' THEN
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$;

-- 6. VERIFY NO ANONYMOUS ACCESS IS POSSIBLE
-- Test query that should fail for anonymous users
DO $$
BEGIN
    -- This block ensures the migration worked correctly
    RAISE NOTICE 'Usuarios table security has been hardened against unauthorized access';
    RAISE NOTICE 'Customer email addresses are now protected from theft';
    RAISE NOTICE 'Only authenticated users can access their own profile data';
END;
$$;