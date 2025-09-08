-- Security Fix: Secure Lead Creation with Rate Limiting and Validation
-- This addresses the critical security vulnerability in lead_creation_v2_policy

-- Step 1: Drop the insecure policy that allows unrestricted lead creation
DROP POLICY IF EXISTS "lead_creation_v2_policy" ON public.leads;

-- Step 2: Add rate limiting table for lead submissions
CREATE TABLE IF NOT EXISTS public.lead_rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    attempt_count INTEGER DEFAULT 1,
    first_attempt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_attempt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
    existing_record RECORD;
    current_time TIMESTAMP WITH TIME ZONE := NOW();
BEGIN
    -- Clean up old entries first (older than window)
    DELETE FROM public.lead_rate_limits 
    WHERE last_attempt < (current_time - (window_minutes || ' minutes')::INTERVAL);
    
    -- Check if email already has attempts in current window
    SELECT * INTO existing_record
    FROM public.lead_rate_limits 
    WHERE email = p_email 
    AND last_attempt >= (current_time - (window_minutes || ' minutes')::INTERVAL);
    
    -- If no existing record, create new one and allow
    IF existing_record.email IS NULL THEN
        INSERT INTO public.lead_rate_limits (email, attempt_count, first_attempt, last_attempt)
        VALUES (p_email, 1, current_time, current_time);
        RETURN TRUE;
    END IF;
    
    -- If under the limit, increment and allow
    IF existing_record.attempt_count < max_attempts THEN
        UPDATE public.lead_rate_limits 
        SET attempt_count = attempt_count + 1,
            last_attempt = current_time
        WHERE email = p_email;
        RETURN TRUE;
    END IF;
    
    -- Over the limit, deny
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

-- Step 5: Create secure lead creation policy
CREATE POLICY "Secure lead creation with validation" 
ON public.leads 
FOR INSERT 
WITH CHECK (
    -- Validate email format and check for spam
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

-- Step 6: Admin/Staff can view leads (replace existing policy)
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

-- Step 7: Admin/Staff can update leads (replace existing policy)
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
    WHERE last_attempt < NOW() - INTERVAL '24 hours';
END;
$$;

-- Step 9: Add index for better performance
CREATE INDEX IF NOT EXISTS idx_lead_rate_limits_email_time 
ON public.lead_rate_limits (email, last_attempt);

-- Step 10: Add RLS policies for rate limiting table
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

-- Add helpful comments
COMMENT ON FUNCTION public.check_lead_rate_limit IS 'Rate limiting function for lead submissions - max 3 per hour per email';
COMMENT ON FUNCTION public.validate_lead_email IS 'Enhanced email validation with spam pattern detection';
COMMENT ON TABLE public.lead_rate_limits IS 'Rate limiting tracking for lead form submissions - prevents spam and abuse';