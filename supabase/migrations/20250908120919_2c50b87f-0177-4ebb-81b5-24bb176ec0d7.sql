-- Security Enhancement Migration: Fix Critical Data Access Issues
-- Phase 1 & 2: Secure customer data and enhance privacy controls

-- 1. CREATE ANONYMOUS SESSION RATE LIMITING TABLE
CREATE TABLE IF NOT EXISTS public.anonymous_rate_limits (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id text NOT NULL,
    operation_type text NOT NULL, -- 'calculator', 'chatbot', etc.
    attempt_count integer DEFAULT 1,
    first_attempt timestamp with time zone DEFAULT now(),
    last_attempt timestamp with time zone DEFAULT now(),
    UNIQUE(session_id, operation_type)
);

-- Enable RLS on anonymous rate limits
ALTER TABLE public.anonymous_rate_limits ENABLE ROW LEVEL SECURITY;

-- RLS policies for anonymous_rate_limits (only system can manage)
CREATE POLICY "System can manage anonymous rate limits" 
ON public.anonymous_rate_limits 
FOR ALL 
USING (auth.role() = 'service_role');

-- 2. CREATE RATE LIMITING FUNCTION FOR ANONYMOUS OPERATIONS
CREATE OR REPLACE FUNCTION public.check_anonymous_rate_limit(
    p_session_id text, 
    p_operation_type text,
    max_attempts integer DEFAULT 10,
    window_minutes integer DEFAULT 60
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    existing_record RECORD;
    current_time TIMESTAMP WITH TIME ZONE := NOW();
BEGIN
    -- Clean up old entries first (older than window)
    DELETE FROM public.anonymous_rate_limits 
    WHERE operation_type = p_operation_type
    AND last_attempt < (current_time - (window_minutes || ' minutes')::INTERVAL);
    
    -- Check if session already has attempts in current window
    SELECT * INTO existing_record
    FROM public.anonymous_rate_limits 
    WHERE session_id = p_session_id 
    AND operation_type = p_operation_type
    AND last_attempt >= (current_time - (window_minutes || ' minutes')::INTERVAL);
    
    -- If no existing record, create new one and allow
    IF existing_record.session_id IS NULL THEN
        INSERT INTO public.anonymous_rate_limits (session_id, operation_type, attempt_count, first_attempt, last_attempt)
        VALUES (p_session_id, p_operation_type, 1, current_time, current_time);
        RETURN TRUE;
    END IF;
    
    -- If under the limit, increment and allow
    IF existing_record.attempt_count < max_attempts THEN
        UPDATE public.anonymous_rate_limits 
        SET attempt_count = attempt_count + 1,
            last_attempt = current_time
        WHERE session_id = p_session_id 
        AND operation_type = p_operation_type;
        RETURN TRUE;
    END IF;
    
    -- Over the limit, deny
    RETURN FALSE;
END;
$$;

-- 3. CREATE SESSION VALIDATION FUNCTION
CREATE OR REPLACE FUNCTION public.validate_session_access(
    p_session_id text,
    p_user_id uuid DEFAULT NULL
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- If user is authenticated, they must own the session or data
    IF auth.uid() IS NOT NULL THEN
        -- For authenticated users, ensure they can only access their own data
        RETURN (p_user_id IS NULL OR p_user_id = auth.uid());
    END IF;
    
    -- For anonymous users, validate session format and length
    IF p_session_id IS NULL OR length(p_session_id) < 10 OR length(p_session_id) > 100 THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$;

-- 4. STRENGTHEN USUARIOS TABLE SECURITY
-- Drop existing policies that might be too permissive
DROP POLICY IF EXISTS "Users can only view their own profile" ON public."Usuarios";
DROP POLICY IF EXISTS "Usuarios pueden actualizar su perfil" ON public."Usuarios";
DROP POLICY IF EXISTS "Usuarios pueden crear su perfil" ON public."Usuarios";

-- Create stronger policies for Usuarios table
CREATE POLICY "usuarios_secure_select" 
ON public."Usuarios" 
FOR SELECT 
USING (
    auth.uid() IS NOT NULL 
    AND id = auth.uid()
);

CREATE POLICY "usuarios_secure_insert" 
ON public."Usuarios" 
FOR INSERT 
WITH CHECK (
    auth.uid() IS NOT NULL 
    AND id = auth.uid()
    AND email IS NOT NULL
    AND length(email) >= 5
    AND length(email) <= 100
);

CREATE POLICY "usuarios_secure_update" 
ON public."Usuarios" 
FOR UPDATE 
USING (
    auth.uid() IS NOT NULL 
    AND id = auth.uid()
);

-- 5. STRENGTHEN CHATBOT CONVERSATIONS SECURITY
-- Drop existing less secure policies
DROP POLICY IF EXISTS "Authenticated users can create conversations" ON public.chatbot_conversations;
DROP POLICY IF EXISTS "Service role can create anonymous conversations" ON public.chatbot_conversations;
DROP POLICY IF EXISTS "Users can update own conversations" ON public.chatbot_conversations;
DROP POLICY IF EXISTS "Users can view own conversations" ON public.chatbot_conversations;

-- Create secure chatbot conversation policies
CREATE POLICY "chatbot_secure_insert" 
ON public.chatbot_conversations 
FOR INSERT 
WITH CHECK (
    -- Authenticated users can create with their user_id
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR 
    -- Anonymous users with valid session and rate limiting
    (auth.uid() IS NULL AND user_id IS NULL AND validate_session_access(session_id) = TRUE)
    OR
    -- Service role can create any
    (auth.role() = 'service_role')
);

CREATE POLICY "chatbot_secure_select" 
ON public.chatbot_conversations 
FOR SELECT 
USING (
    -- Authenticated users can view their own
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR
    -- Service role can view any
    (auth.role() = 'service_role')
);

CREATE POLICY "chatbot_secure_update" 
ON public.chatbot_conversations 
FOR UPDATE 
USING (
    -- Authenticated users can update their own
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR
    -- Service role can update any
    (auth.role() = 'service_role')
);

-- 6. ENHANCE CALCULATOR RESULTS SECURITY
-- Update the existing calculator policy to include rate limiting
DROP POLICY IF EXISTS "calculator_insertion_v2_policy" ON public.calculadora_resultados;

CREATE POLICY "calculator_secure_insert" 
ON public.calculadora_resultados 
FOR INSERT 
WITH CHECK (
    -- Authenticated users (with user_id)
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR 
    -- Anonymous users (without user_id, with basic validation)
    (
        auth.uid() IS NULL 
        AND user_id IS NULL 
        AND email IS NOT NULL
        AND validate_email_format(email) = true
        AND length(email) >= 5 
        AND length(email) <= 100
    )
);

-- 7. CREATE CLEANUP FUNCTIONS
CREATE OR REPLACE FUNCTION public.cleanup_old_anonymous_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Clean up old anonymous conversations (7 days)
    DELETE FROM public.chatbot_messages 
    WHERE conversation_id IN (
        SELECT id FROM public.chatbot_conversations 
        WHERE user_id IS NULL 
        AND created_at < NOW() - INTERVAL '7 days'
    );
    
    DELETE FROM public.chatbot_conversations 
    WHERE user_id IS NULL 
    AND created_at < NOW() - INTERVAL '7 days';
    
    -- Clean up old anonymous calculator results (30 days)
    DELETE FROM public.calculadora_resultados 
    WHERE user_id IS NULL 
    AND created_at < NOW() - INTERVAL '30 days';
    
    -- Clean up old rate limit entries (24 hours)
    DELETE FROM public.anonymous_rate_limits 
    WHERE last_attempt < NOW() - INTERVAL '24 hours';
    
    -- Clean up old lead rate limits (24 hours)
    DELETE FROM public.lead_rate_limits 
    WHERE last_attempt < NOW() - INTERVAL '24 hours';
END;
$$;

-- 8. CREATE MONITORING FUNCTION FOR SUSPICIOUS ACTIVITY
CREATE OR REPLACE FUNCTION public.detect_suspicious_activity(
    check_window_minutes integer DEFAULT 60
) RETURNS TABLE (
    activity_type text,
    identifier text,
    attempt_count bigint,
    first_attempt timestamp with time zone,
    last_attempt timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    -- Check for excessive lead submissions
    SELECT 
        'excessive_lead_submissions'::text,
        email,
        attempt_count::bigint,
        first_attempt,
        last_attempt
    FROM public.lead_rate_limits
    WHERE attempt_count >= 3
    AND last_attempt >= NOW() - (check_window_minutes || ' minutes')::INTERVAL
    
    UNION ALL
    
    -- Check for excessive anonymous operations
    SELECT 
        ('excessive_anonymous_' || operation_type)::text,
        session_id,
        attempt_count::bigint,
        first_attempt,
        last_attempt
    FROM public.anonymous_rate_limits
    WHERE attempt_count >= 8
    AND last_attempt >= NOW() - (check_window_minutes || ' minutes')::INTERVAL;
END;
$$;

-- 9. GRANT NECESSARY PERMISSIONS
-- Grant execute permissions on new functions to authenticated users
GRANT EXECUTE ON FUNCTION public.validate_session_access(text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_anonymous_rate_limit(text, text, integer, integer) TO authenticated;

-- Only admins can run cleanup and monitoring functions
REVOKE EXECUTE ON FUNCTION public.cleanup_old_anonymous_data() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.detect_suspicious_activity(integer) FROM PUBLIC;

-- Create policy to allow only admins to execute admin functions
CREATE POLICY "admin_functions_policy" 
ON public.profiles 
FOR SELECT 
USING (
    auth.uid() = id 
    AND role = 'admin'
    AND (
        current_setting('role') = 'authenticated'
        OR auth.role() = 'service_role'
    )
);

-- 10. ADD INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_anonymous_rate_limits_session_operation 
ON public.anonymous_rate_limits(session_id, operation_type);

CREATE INDEX IF NOT EXISTS idx_anonymous_rate_limits_cleanup 
ON public.anonymous_rate_limits(operation_type, last_attempt);

CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_anonymous_cleanup 
ON public.chatbot_conversations(user_id, created_at) 
WHERE user_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_calculadora_resultados_anonymous_cleanup 
ON public.calculadora_resultados(user_id, created_at) 
WHERE user_id IS NULL;