-- Enhanced security for leads table - require session-based authentication for anonymous users
-- and add proper IP-based rate limiting integration

-- First, drop the existing policy
DROP POLICY IF EXISTS "Secure lead creation with validation" ON public.leads;

-- Create enhanced lead creation policy with session validation and IP rate limiting
CREATE POLICY "Enhanced secure lead creation" 
ON public.leads 
FOR INSERT 
WITH CHECK (
    -- Allow authenticated users (with their own data validation)
    (auth.uid() IS NOT NULL) OR
    -- For anonymous users, require session validation and stricter controls
    (
        auth.uid() IS NULL AND
        -- Basic validation (existing)
        validate_lead_email(email) = true AND
        check_lead_rate_limit(email, 2, 120) = true AND -- Reduced to 2 attempts per 2 hours
        email IS NOT NULL AND
        length(email) >= 5 AND 
        length(email) <= 100 AND
        (name IS NULL OR (length(name) >= 2 AND length(name) <= 100)) AND
        (phone IS NULL OR (length(phone) >= 9 AND length(phone) <= 20)) AND
        -- Enhanced anonymous security checks
        (service_interest IS NULL OR service_interest IN ('gestion_integral', 'asesoramiento_legal', 'mantenimiento')) AND
        length(coalesce(source_tag, '')) <= 50 AND
        -- Prevent suspicious patterns in names/emails
        NOT (
            email ILIKE '%+%+%' OR 
            email ILIKE '%test%test%' OR
            name ILIKE '%test%' OR
            name ILIKE '%spam%' OR
            name ILIKE '%bot%'
        )
    )
);

-- Create function to validate anonymous lead sessions
CREATE OR REPLACE FUNCTION public.validate_anonymous_lead_session(
    p_session_id text,
    p_email text,
    p_source_tag text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Basic session validation
    IF p_session_id IS NULL OR length(p_session_id) < 16 OR length(p_session_id) > 100 THEN
        RETURN FALSE;
    END IF;
    
    -- Check for suspicious patterns
    IF p_email ILIKE '%disposable%' OR 
       p_email ILIKE '%temp%mail%' OR
       p_email ILIKE '%10minutemail%' OR
       p_email ILIKE '%guerrillamail%' THEN
        RETURN FALSE;
    END IF;
    
    -- Log the lead creation attempt for monitoring
    PERFORM log_security_event(
        'anonymous_lead_creation',
        NULL,
        NULL,
        NULL,
        jsonb_build_object(
            'email_domain', split_part(p_email, '@', 2),
            'source_tag', p_source_tag,
            'session_length', length(p_session_id)
        ),
        'low'
    );
    
    RETURN TRUE;
END;
$$;

-- Add trigger to log all lead creations for security monitoring
CREATE OR REPLACE FUNCTION public.log_lead_creation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Log lead creation with basic metadata
    PERFORM log_security_event(
        'lead_created',
        auth.uid(),
        NULL,
        NULL,
        jsonb_build_object(
            'email_domain', split_part(NEW.email, '@', 2),
            'source_tag', NEW.source_tag,
            'service_interest', NEW.service_interest,
            'is_authenticated', auth.uid() IS NOT NULL
        ),
        CASE 
            WHEN auth.uid() IS NULL THEN 'medium'
            ELSE 'low'
        END
    );
    
    RETURN NEW;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS tr_log_lead_creation ON public.leads;
CREATE TRIGGER tr_log_lead_creation
    AFTER INSERT ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION log_lead_creation();

-- Enhanced rate limiting for anonymous leads - stricter limits
CREATE OR REPLACE FUNCTION public.check_anonymous_lead_limits(
    p_email text,
    p_session_id text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    email_domain text;
    domain_count integer;
    recent_count integer;
BEGIN
    -- Extract domain for domain-based limiting
    email_domain := split_part(p_email, '@', 2);
    
    -- Check domain-based rate limiting (max 5 leads per domain per day)
    SELECT COUNT(*) INTO domain_count
    FROM public.leads
    WHERE split_part(email, '@', 2) = email_domain
    AND created_at > NOW() - INTERVAL '24 hours';
    
    IF domain_count >= 5 THEN
        -- Log suspicious domain activity
        PERFORM log_security_event(
            'domain_rate_limit_exceeded',
            NULL,
            NULL,
            NULL,
            jsonb_build_object('domain', email_domain, 'count', domain_count),
            'high'
        );
        RETURN FALSE;
    END IF;
    
    -- Check for rapid submissions (max 3 in last hour across all anonymous users)
    SELECT COUNT(*) INTO recent_count
    FROM public.leads
    WHERE created_at > NOW() - INTERVAL '1 hour'
    AND NOT EXISTS (
        SELECT 1 FROM auth.users u WHERE u.id = leads.id  -- Only count anonymous leads
    );
    
    IF recent_count >= 3 THEN
        PERFORM log_security_event(
            'anonymous_lead_rate_exceeded',
            NULL,
            NULL,
            NULL,
            jsonb_build_object('recent_count', recent_count),
            'high'
        );
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$;

-- Update the lead creation policy to include the new checks
DROP POLICY IF EXISTS "Enhanced secure lead creation" ON public.leads;
CREATE POLICY "Enhanced secure lead creation" 
ON public.leads 
FOR INSERT 
WITH CHECK (
    -- Allow authenticated users (with their own data validation)
    (auth.uid() IS NOT NULL) OR
    -- For anonymous users, require comprehensive validation
    (
        auth.uid() IS NULL AND
        -- Basic validation (existing)
        validate_lead_email(email) = true AND
        check_lead_rate_limit(email, 2, 120) = true AND -- Reduced to 2 attempts per 2 hours
        -- Enhanced anonymous limits
        check_anonymous_lead_limits(email) = true AND
        -- Standard field validation
        email IS NOT NULL AND
        length(email) >= 5 AND 
        length(email) <= 100 AND
        (name IS NULL OR (length(name) >= 2 AND length(name) <= 100)) AND
        (phone IS NULL OR (length(phone) >= 9 AND length(phone) <= 20)) AND
        -- Enhanced anonymous security checks
        (service_interest IS NULL OR service_interest IN ('gestion_integral', 'asesoramiento_legal', 'mantenimiento')) AND
        length(coalesce(source_tag, '')) <= 50 AND
        -- Prevent suspicious patterns in names/emails
        NOT (
            email ILIKE '%+%+%' OR 
            email ILIKE '%test%test%' OR
            name ILIKE '%test%' OR
            name ILIKE '%spam%' OR
            name ILIKE '%bot%' OR
            email ILIKE '%disposable%' OR 
            email ILIKE '%temp%mail%' OR
            email ILIKE '%10minutemail%' OR
            email ILIKE '%guerrillamail%'
        )
    )
);