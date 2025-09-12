-- Enhanced Security Features: Automated cleanup scheduling and monitoring

-- Create security audit log table for enhanced monitoring
CREATE TABLE IF NOT EXISTS public.security_audit_log (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL,
    user_id UUID,
    ip_address TEXT,
    user_agent TEXT,
    details JSONB,
    severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'low',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on security audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view security audit logs
CREATE POLICY "Only admins can view security audit logs" 
ON public.security_audit_log 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- System can insert audit logs
CREATE POLICY "System can insert audit logs" 
ON public.security_audit_log 
FOR INSERT 
WITH CHECK (true);

-- Create enhanced security monitoring function
CREATE OR REPLACE FUNCTION public.log_security_event(
    p_event_type TEXT,
    p_user_id UUID DEFAULT NULL,
    p_ip_address TEXT DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_details JSONB DEFAULT '{}',
    p_severity TEXT DEFAULT 'low'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.security_audit_log (
        event_type, 
        user_id, 
        ip_address, 
        user_agent, 
        details, 
        severity
    ) VALUES (
        p_event_type,
        p_user_id,
        p_ip_address,
        p_user_agent,
        p_details,
        p_severity
    );
END;
$$;

-- Enhanced suspicious activity detection with more details
CREATE OR REPLACE FUNCTION public.detect_advanced_suspicious_activity(check_window_minutes integer DEFAULT 60)
RETURNS TABLE(
    activity_type text, 
    identifier text, 
    attempt_count bigint, 
    first_attempt timestamp with time zone, 
    last_attempt timestamp with time zone,
    severity text,
    recommendation text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    -- Critical: Multiple failed login attempts
    SELECT 
        'excessive_lead_submissions'::text,
        lr.email,
        lr.attempt_count::bigint,
        lr.first_attempt,
        lr.last_attempt,
        CASE 
            WHEN lr.attempt_count >= 5 THEN 'critical'
            WHEN lr.attempt_count >= 3 THEN 'high'
            ELSE 'medium'
        END::text as severity,
        'Block IP and review email for potential spam/bot activity'::text as recommendation
    FROM public.lead_rate_limits lr
    WHERE lr.attempt_count >= 3
    AND lr.last_attempt >= NOW() - (check_window_minutes || ' minutes')::INTERVAL
    
    UNION ALL
    
    -- High: Excessive anonymous operations
    SELECT 
        ('excessive_anonymous_' || arl.operation_type)::text,
        arl.session_id,
        arl.attempt_count::bigint,
        arl.first_attempt,
        arl.last_attempt,
        CASE 
            WHEN arl.attempt_count >= 15 THEN 'critical'
            WHEN arl.attempt_count >= 10 THEN 'high'
            ELSE 'medium'
        END::text as severity,
        'Monitor session for bot activity and consider temporary block'::text as recommendation
    FROM public.anonymous_rate_limits arl
    WHERE arl.attempt_count >= 8
    AND arl.last_attempt >= NOW() - (check_window_minutes || ' minutes')::INTERVAL
    
    UNION ALL
    
    -- Critical: Recent security events
    SELECT 
        sal.event_type,
        COALESCE(sal.user_id::text, sal.ip_address, 'unknown'),
        1::bigint,
        sal.created_at,
        sal.created_at,
        sal.severity,
        CASE sal.event_type
            WHEN 'unauthorized_access' THEN 'Investigate user account and consider suspension'
            WHEN 'suspicious_data_access' THEN 'Review access patterns and validate user legitimacy'
            WHEN 'rate_limit_exceeded' THEN 'Monitor for continued abuse and consider IP blocking'
            ELSE 'Review event details and take appropriate action'
        END::text as recommendation
    FROM public.security_audit_log sal
    WHERE sal.severity IN ('high', 'critical')
    AND sal.created_at >= NOW() - (check_window_minutes || ' minutes')::INTERVAL;
END;
$$;

-- Create automated cleanup scheduling function
CREATE OR REPLACE FUNCTION public.schedule_security_cleanup()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Clean up old anonymous data (7 days for conversations, 30 days for calculator)
    PERFORM public.cleanup_old_anonymous_conversations();
    PERFORM public.cleanup_old_anonymous_results();
    
    -- Clean up old rate limit entries (24 hours)
    DELETE FROM public.anonymous_rate_limits 
    WHERE last_attempt < NOW() - INTERVAL '24 hours';
    
    DELETE FROM public.lead_rate_limits 
    WHERE last_attempt < NOW() - INTERVAL '24 hours';
    
    -- Clean up old security audit logs (keep 90 days)
    DELETE FROM public.security_audit_log 
    WHERE created_at < NOW() - INTERVAL '90 days';
    
    -- Log cleanup completion
    PERFORM public.log_security_event(
        'automated_cleanup_completed',
        NULL,
        NULL,
        NULL,
        '{"cleanup_time": "' || NOW()::text || '"}'::jsonb,
        'low'
    );
END;
$$;

-- Create index for better performance on security audit log
CREATE INDEX IF NOT EXISTS idx_security_audit_log_event_type ON public.security_audit_log(event_type);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_severity ON public.security_audit_log(severity);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_created_at ON public.security_audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_id ON public.security_audit_log(user_id);

-- Enhanced IP-based rate limiting table
CREATE TABLE IF NOT EXISTS public.ip_rate_limits (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    ip_address TEXT NOT NULL,
    operation_type TEXT NOT NULL,
    attempt_count INTEGER NOT NULL DEFAULT 1,
    first_attempt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    last_attempt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    blocked_until TIMESTAMP WITH TIME ZONE,
    UNIQUE(ip_address, operation_type)
);

-- Enable RLS on IP rate limits
ALTER TABLE public.ip_rate_limits ENABLE ROW LEVEL SECURITY;

-- System can manage IP rate limits
CREATE POLICY "System can manage IP rate limits" 
ON public.ip_rate_limits 
FOR ALL 
USING (true);

-- IP-based rate limiting function
CREATE OR REPLACE FUNCTION public.check_ip_rate_limit(
    p_ip_address TEXT,
    p_operation_type TEXT,
    max_attempts INTEGER DEFAULT 50,
    window_minutes INTEGER DEFAULT 60,
    block_duration_minutes INTEGER DEFAULT 60
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    existing_record RECORD;
    current_time TIMESTAMP WITH TIME ZONE := NOW();
    result JSONB;
BEGIN
    -- Check if IP is currently blocked
    SELECT * INTO existing_record
    FROM public.ip_rate_limits 
    WHERE ip_address = p_ip_address 
    AND operation_type = p_operation_type
    AND blocked_until IS NOT NULL 
    AND blocked_until > current_time;
    
    IF existing_record.ip_address IS NOT NULL THEN
        RETURN jsonb_build_object(
            'allowed', false,
            'reason', 'ip_blocked',
            'blocked_until', existing_record.blocked_until,
            'retry_after', EXTRACT(EPOCH FROM (existing_record.blocked_until - current_time))
        );
    END IF;
    
    -- Clean up old entries first
    DELETE FROM public.ip_rate_limits 
    WHERE operation_type = p_operation_type
    AND last_attempt < (current_time - (window_minutes || ' minutes')::INTERVAL)
    AND blocked_until IS NULL;
    
    -- Check current attempts
    SELECT * INTO existing_record
    FROM public.ip_rate_limits 
    WHERE ip_address = p_ip_address 
    AND operation_type = p_operation_type
    AND last_attempt >= (current_time - (window_minutes || ' minutes')::INTERVAL);
    
    -- If no existing record, create new one and allow
    IF existing_record.ip_address IS NULL THEN
        INSERT INTO public.ip_rate_limits (ip_address, operation_type, attempt_count, first_attempt, last_attempt)
        VALUES (p_ip_address, p_operation_type, 1, current_time, current_time);
        RETURN jsonb_build_object('allowed', true, 'attempts_remaining', max_attempts - 1);
    END IF;
    
    -- If under the limit, increment and allow
    IF existing_record.attempt_count < max_attempts THEN
        UPDATE public.ip_rate_limits 
        SET attempt_count = attempt_count + 1,
            last_attempt = current_time
        WHERE ip_address = p_ip_address 
        AND operation_type = p_operation_type;
        RETURN jsonb_build_object('allowed', true, 'attempts_remaining', max_attempts - existing_record.attempt_count - 1);
    END IF;
    
    -- Over the limit, block IP
    UPDATE public.ip_rate_limits 
    SET blocked_until = current_time + (block_duration_minutes || ' minutes')::INTERVAL,
        last_attempt = current_time
    WHERE ip_address = p_ip_address 
    AND operation_type = p_operation_type;
    
    -- Log security event
    PERFORM public.log_security_event(
        'ip_rate_limit_exceeded',
        NULL,
        p_ip_address,
        NULL,
        jsonb_build_object('operation_type', p_operation_type, 'attempt_count', existing_record.attempt_count + 1),
        'high'
    );
    
    RETURN jsonb_build_object(
        'allowed', false,
        'reason', 'rate_limit_exceeded',
        'blocked_until', current_time + (block_duration_minutes || ' minutes')::INTERVAL,
        'retry_after', block_duration_minutes * 60
    );
END;
$$;