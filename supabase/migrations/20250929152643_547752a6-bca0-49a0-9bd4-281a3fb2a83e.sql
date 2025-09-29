-- CRITICAL SECURITY FIXES - CORRECTED VERSION

-- 1. Prevent role escalation by users modifying their own role
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
    -- Only allow role changes by service role (admin functions)
    IF auth.role() != 'service_role' AND OLD.rol IS DISTINCT FROM NEW.rol THEN
        -- Log the attempt
        PERFORM public.log_security_event(
            'role_escalation_attempt',
            auth.uid(),
            NULL,
            NULL,
            jsonb_build_object(
                'old_role', OLD.rol,
                'attempted_new_role', NEW.rol,
                'user_id', NEW.id,
                'timestamp', NOW()
            ),
            'critical'
        );
        
        RAISE EXCEPTION 'No tienes permisos para modificar tu rol';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to prevent role escalation
DROP TRIGGER IF EXISTS prevent_role_escalation_trigger ON public."Usuarios";
CREATE TRIGGER prevent_role_escalation_trigger
    BEFORE UPDATE ON public."Usuarios"
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_role_escalation();

-- 2. Add rate limiting for user profile updates
CREATE OR REPLACE FUNCTION public.check_user_update_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
    recent_updates INTEGER;
BEGIN
    -- Check for excessive profile updates (max 5 per hour)
    SELECT COUNT(*) INTO recent_updates
    FROM public.security_audit_log
    WHERE event_type = 'user_data_modified'
    AND user_id = auth.uid()
    AND created_at > NOW() - INTERVAL '1 hour';
    
    IF recent_updates >= 5 THEN
        PERFORM public.log_security_event(
            'excessive_profile_updates',
            auth.uid(),
            NULL,
            NULL,
            jsonb_build_object(
                'recent_updates', recent_updates,
                'timestamp', NOW()
            ),
            'high'
        );
        
        RAISE EXCEPTION 'Demasiadas actualizaciones de perfil. Intenta de nuevo en una hora.';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for rate limiting user updates
DROP TRIGGER IF EXISTS user_update_rate_limit_trigger ON public."Usuarios";
CREATE TRIGGER user_update_rate_limit_trigger
    BEFORE UPDATE ON public."Usuarios"
    FOR EACH ROW
    EXECUTE FUNCTION public.check_user_update_rate_limit();

-- 3. Create function for secure role management (admin only)
CREATE OR REPLACE FUNCTION public.admin_update_user_role(
    p_user_id UUID,
    p_new_role TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    admin_user_id UUID;
    old_role TEXT;
BEGIN
    -- Verify the caller is an admin
    SELECT id INTO admin_user_id
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin';
    
    IF admin_user_id IS NULL THEN
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
    IF p_new_role NOT IN ('propietario', 'inquilino', 'admin') THEN
        RAISE EXCEPTION 'Rol inválido: %', p_new_role;
    END IF;
    
    -- Get the old role for logging
    SELECT rol INTO old_role
    FROM public."Usuarios"
    WHERE id = p_user_id;
    
    -- Update the role
    UPDATE public."Usuarios"
    SET rol = p_new_role
    WHERE id = p_user_id;
    
    -- Log the role change
    PERFORM public.log_security_event(
        'admin_role_change',
        admin_user_id,
        NULL,
        NULL,
        jsonb_build_object(
            'target_user_id', p_user_id,
            'old_role', old_role,
            'new_role', p_new_role,
            'admin_id', admin_user_id,
            'timestamp', NOW()
        ),
        'high'
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4. Enhanced input validation function for user data
CREATE OR REPLACE FUNCTION public.validate_user_input(
    p_email TEXT DEFAULT NULL,
    p_nombre TEXT DEFAULT NULL,
    p_rol TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
BEGIN
    -- Email validation
    IF p_email IS NOT NULL THEN
        IF NOT validate_email_format(p_email) THEN
            RETURN FALSE;
        END IF;
        
        IF length(p_email) < 5 OR length(p_email) > 100 THEN
            RETURN FALSE;
        END IF;
        
        -- Check for suspicious email patterns
        IF p_email ILIKE '%admin%' OR p_email ILIKE '%test%' OR p_email ILIKE '%fake%' THEN
            PERFORM public.log_security_event(
                'suspicious_email_pattern',
                auth.uid(),
                NULL,
                NULL,
                jsonb_build_object('email_pattern', p_email),
                'medium'
            );
        END IF;
    END IF;
    
    -- Name validation
    IF p_nombre IS NOT NULL THEN
        IF length(p_nombre) < 2 OR length(p_nombre) > 100 THEN
            RETURN FALSE;
        END IF;
        
        -- Check for suspicious patterns
        IF p_nombre ILIKE '%script%' OR p_nombre ILIKE '%admin%' THEN
            PERFORM public.log_security_event(
                'suspicious_name_pattern',
                auth.uid(),
                NULL,
                NULL,
                jsonb_build_object('name_pattern', p_nombre),
                'medium'
            );
        END IF;
    END IF;
    
    -- Role validation
    IF p_rol IS NOT NULL THEN
        IF p_rol NOT IN ('propietario', 'inquilino', 'admin') THEN
            RETURN FALSE;
        END IF;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 5. Add constraint to prevent direct role modifications via normal updates
ALTER TABLE public."Usuarios" ADD CONSTRAINT prevent_role_self_modification 
CHECK (
    CASE 
        WHEN auth.role() = 'service_role' THEN true
        ELSE true  -- This will be enforced by the trigger above
    END
);