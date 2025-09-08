-- Security Fix: Secure Lead Creation with Rate Limiting and Validation
-- This addresses the critical security vulnerability in lead_creation_v2_policy

-- Step 1: Drop the insecure policy that allows unrestricted lead creation
DROP POLICY IF EXISTS "lead_creation_v2_policy" ON public.leads;

-- Step 2: Add rate limiting table for lead submissions
CREATE TABLE IF NOT EXISTS public.lead_rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier TEXT NOT NULL, -- email or IP address
    attempts INTEGER DEFAULT 1,
    window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on rate limiting table
ALTER TABLE public.lead_rate_limits ENABLE ROW LEVEL SECURITY;

-- Step 3: Create rate limiting function for leads
CREATE OR REPLACE FUNCTION public.check_lead_rate_limit(
    p_email TEXT,
    max_attempts INTEGER DEFAULT 3,
    window_minutes INTEGER DEFAULT 60
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_attempts INTEGER := 0;
    window_start TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Clean up old entries first
    DELETE FROM public.lead_rate_limits 
    WHERE created_at < NOW() - (window_minutes || ' minutes')::INTERVAL;
    
    -- Check current attempts for this email in the time window
    SELECT COALESCE(SUM(attempts), 0), MIN(window_start)
    INTO current_attempts, window_start
    FROM public.lead_rate_limits 
    WHERE identifier = p_email 
    AND created_at >= NOW() - (window_minutes || ' minutes')::INTERVAL;
    
    -- If under the limit, allow and record attempt
    IF current_attempts < max_attempts THEN
        INSERT INTO public.lead_rate_limits (identifier, attempts, window_start)
        VALUES (p_email, 1, COALESCE(window_start, NOW()))
        ON CONFLICT (identifier) 
        DO UPDATE SET 
            attempts = lead_rate_limits.attempts + 1,
            created_at = NOW();
        RETURN TRUE;
    END IF;
    
    -- Over the limit
    RETURN FALSE;
END;
$$;

-- Step 4: Enhanced email validation function
CREATE OR REPLACE FUNCTION public.validate_lead_email(p_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check basic email format
    IF NOT validate_email_format(p_email) THEN
        RETURN FALSE;
    END IF;
    
    -- Check for common spam patterns
    IF p_email ILIKE '%test%@%' 
       OR p_email ILIKE '%spam%@%'
       OR p_email ILIKE '%fake%@%'
       OR LENGTH(p_email) > 100 THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$;

-- Step 5: Create secure lead creation policies
CREATE POLICY "Secure lead creation with validation" 
ON public.leads 
FOR INSERT 
WITH CHECK (
    -- Validate email format
    validate_lead_email(email) = true
    -- Check rate limiting (3 submissions per hour per email)
    AND check_lead_rate_limit(email, 3, 60) = true
    -- Ensure required fields are present and reasonable
    AND email IS NOT NULL 
    AND LENGTH(email) >= 5
    AND LENGTH(email) <= 100
    AND (name IS NULL OR (LENGTH(name) >= 2 AND LENGTH(name) <= 100))
    AND (phone IS NULL OR (LENGTH(phone) >= 9 AND LENGTH(phone) <= 20))
);

-- Step 6: Admin/Staff can view leads (keep existing policy)
-- This policy should already exist, but ensure it's properly configured
CREATE POLICY "Authorized staff can view leads" 
ON public.leads 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'staff', 'manager', 'propietario')
    )
);

-- Step 7: Admin/Staff can update leads (keep existing policy)
CREATE POLICY "Authorized staff can update leads" 
ON public.leads 
FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'staff', 'manager', 'propietario')
    )
);

-- Step 8: Create cleanup function for old rate limit entries
CREATE OR REPLACE FUNCTION public.cleanup_old_lead_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    DELETE FROM public.lead_rate_limits 
    WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$;

-- Step 9: Add unique constraint to prevent duplicate rate limit entries per time window
CREATE UNIQUE INDEX IF NOT EXISTS idx_lead_rate_limits_identifier_window 
ON public.lead_rate_limits (identifier, DATE_TRUNC('hour', created_at));

-- Step 10: Add RLS policies for rate limiting table (admin access only)
CREATE POLICY "Only admins can view rate limits" 
ON public.lead_rate_limits 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role = 'admin'
    )
);

CREATE POLICY "System can manage rate limits" 
ON public.lead_rate_limits 
FOR ALL 
USING (auth.role() = 'service_role');

-- Add helpful comment
COMMENT ON FUNCTION public.check_lead_rate_limit IS 'Rate limiting function for lead submissions - max 3 per hour per email';
COMMENT ON FUNCTION public.validate_lead_email IS 'Enhanced email validation with spam pattern detection';
COMMENT ON TABLE public.lead_rate_limits IS 'Rate limiting tracking for lead form submissions';