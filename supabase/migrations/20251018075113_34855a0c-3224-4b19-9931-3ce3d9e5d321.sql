-- SPRINT 3: Additional validations and privacy improvements (FIXED)

-- ============================================
-- JSONB Field Validation
-- ============================================

-- Function to validate JSONB size
CREATE OR REPLACE FUNCTION public.validate_jsonb_size(data JSONB, max_size INTEGER DEFAULT 100000)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
    -- Check size in bytes
    IF pg_column_size(data) > max_size THEN
        RETURN FALSE;
    END IF;
    RETURN TRUE;
END;
$$;

COMMENT ON FUNCTION public.validate_jsonb_size IS 'Validates JSONB field size to prevent DoS attacks';

-- Add CHECK constraints to calculadora_resultados
ALTER TABLE public.calculadora_resultados
DROP CONSTRAINT IF EXISTS check_inputs_size;

ALTER TABLE public.calculadora_resultados
ADD CONSTRAINT check_inputs_size 
CHECK (validate_jsonb_size(inputs, 50000));

ALTER TABLE public.calculadora_resultados
DROP CONSTRAINT IF EXISTS check_outputs_size;

ALTER TABLE public.calculadora_resultados
ADD CONSTRAINT check_outputs_size 
CHECK (validate_jsonb_size(outputs, 50000));

-- Add CHECK constraints to chatbot_conversations
ALTER TABLE public.chatbot_conversations
DROP CONSTRAINT IF EXISTS check_context_size;

ALTER TABLE public.chatbot_conversations
ADD CONSTRAINT check_context_size 
CHECK (validate_jsonb_size(context, 50000));

-- Add CHECK constraints to chatbot_messages
ALTER TABLE public.chatbot_messages
DROP CONSTRAINT IF EXISTS check_metadata_size;

ALTER TABLE public.chatbot_messages
ADD CONSTRAINT check_metadata_size 
CHECK (validate_jsonb_size(metadata, 50000));

-- ============================================
-- Phone Number Validation
-- ============================================

-- Phone number validation function
CREATE OR REPLACE FUNCTION public.validate_phone_format(phone TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
    -- Allow international format: +[country code][number]
    -- Allow common separators: spaces, dashes, parentheses
    RETURN phone ~ '^[+]?[0-9\s\-\(\)]{9,20}$';
END;
$$;

COMMENT ON FUNCTION public.validate_phone_format IS 'Validates phone number format with international support';

-- Update leads RLS policy to include phone validation
DROP POLICY IF EXISTS "leads_secure_insert" ON public.leads;

CREATE POLICY "leads_secure_insert"
ON public.leads
FOR INSERT
WITH CHECK (
    (email IS NOT NULL) 
    AND (validate_lead_email(email) = true)
    AND ((length(email) >= 5) AND (length(email) <= 100))
    AND (check_lead_rate_limit(email, 3, 60) = true)
    AND ((nombre IS NULL) OR ((length(nombre) >= 2) AND (length(nombre) <= 100)))
    AND ((telefono IS NULL) OR (
        (length(telefono) >= 9) 
        AND (length(telefono) <= 20)
        AND (validate_phone_format(telefono) = true)
    ))
    AND ((phone IS NULL) OR (
        (length(phone) >= 9) 
        AND (length(phone) <= 20)
        AND (validate_phone_format(phone) = true)
    ))
);

-- Update solicitudes RLS policy to include phone validation
DROP POLICY IF EXISTS "solicitudes_secure_insert" ON public.solicitudes;

CREATE POLICY "solicitudes_secure_insert"
ON public.solicitudes
FOR INSERT
WITH CHECK (
    (email IS NOT NULL) 
    AND (validate_lead_email(email) = true)
    AND ((length(email) >= 5) AND (length(email) <= 100))
    AND ((length(nombre) >= 2) AND (length(nombre) <= 100))
    AND ((length(telefono) >= 9) AND (length(telefono) <= 20))
    AND (validate_phone_format(telefono) = true)
    AND (check_lead_rate_limit(email, 2, 120) = true)
);

-- Update old Leads table RLS policy
DROP POLICY IF EXISTS "Leads_secure_insert" ON public."Leads";

CREATE POLICY "Leads_secure_insert"
ON public."Leads"
FOR INSERT
WITH CHECK (
    (email IS NOT NULL) 
    AND (validate_lead_email(email) = true)
    AND ((length(email) >= 5) AND (length(email) <= 100))
    AND ((nombre IS NULL) OR ((length(nombre) >= 2) AND (length(nombre) <= 100)))
    AND ((apellidos IS NULL) OR ((length(apellidos) >= 2) AND (length(apellidos) <= 100)))
    AND ((telefono IS NULL) OR (
        (length(telefono) >= 9) 
        AND (length(telefono) <= 20)
        AND (validate_phone_format(telefono) = true)
    ))
    AND (check_anonymous_lead_limits(email) = true)
);

-- ============================================
-- Privacy & GDPR - Anonymization
-- ============================================

-- Function to anonymize old leads (GDPR compliance)
CREATE OR REPLACE FUNCTION public.anonymize_old_leads()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    total_anonymized INTEGER := 0;
    leads_count INTEGER;
    old_leads_count INTEGER;
BEGIN
    -- Hash IP addresses and anonymize PII for leads table (90+ days)
    WITH updated AS (
        UPDATE public.leads
        SET 
            ip = CASE 
                WHEN ip IS NOT NULL AND ip NOT LIKE 'anon_%' 
                THEN 'anon_' || md5(ip) 
                ELSE ip 
            END,
            user_agent = CASE 
                WHEN user_agent IS NOT NULL AND user_agent != 'anonymized' 
                THEN 'anonymized' 
                ELSE user_agent 
            END,
            referrer = NULL,
            page_url = NULL,
            utm_source = CASE WHEN utm_source IS NOT NULL THEN 'anonymized' ELSE NULL END,
            utm_medium = CASE WHEN utm_medium IS NOT NULL THEN 'anonymized' ELSE NULL END,
            utm_campaign = CASE WHEN utm_campaign IS NOT NULL THEN 'anonymized' ELSE NULL END,
            utm_term = NULL,
            utm_content = NULL
        WHERE created_at < NOW() - INTERVAL '90 days'
        AND (
            (ip IS NOT NULL AND ip NOT LIKE 'anon_%') OR
            (user_agent IS NOT NULL AND user_agent != 'anonymized') OR
            referrer IS NOT NULL OR
            page_url IS NOT NULL OR
            utm_term IS NOT NULL OR
            utm_content IS NOT NULL
        )
        RETURNING id
    )
    SELECT COUNT(*) INTO leads_count FROM updated;
    
    total_anonymized := leads_count;
    
    -- Anonymize old Leads table
    WITH updated AS (
        UPDATE public."Leads"
        SET 
            ip = CASE 
                WHEN ip IS NOT NULL AND ip NOT LIKE 'anon_%' 
                THEN 'anon_' || md5(ip) 
                ELSE ip 
            END,
            user_agent = CASE 
                WHEN user_agent IS NOT NULL AND user_agent != 'anonymized' 
                THEN 'anonymized' 
                ELSE user_agent 
            END,
            referrer = NULL,
            page_url = NULL,
            utm_source = CASE WHEN utm_source IS NOT NULL THEN 'anonymized' ELSE NULL END,
            utm_medium = CASE WHEN utm_medium IS NOT NULL THEN 'anonymized' ELSE NULL END,
            utm_campaign = CASE WHEN utm_campaign IS NOT NULL THEN 'anonymized' ELSE NULL END,
            utm_term = NULL,
            utm_content = NULL
        WHERE created_at < NOW() - INTERVAL '90 days'
        AND (
            (ip IS NOT NULL AND ip NOT LIKE 'anon_%') OR
            (user_agent IS NOT NULL AND user_agent != 'anonymized') OR
            referrer IS NOT NULL OR
            page_url IS NOT NULL OR
            utm_term IS NOT NULL OR
            utm_content IS NOT NULL
        )
        RETURNING id
    )
    SELECT COUNT(*) INTO old_leads_count FROM updated;
    
    total_anonymized := total_anonymized + old_leads_count;
    
    -- Log anonymization
    IF total_anonymized > 0 THEN
        PERFORM public.log_security_event(
            'leads_anonymized',
            NULL,
            NULL,
            NULL,
            jsonb_build_object(
                'anonymized_count', total_anonymized,
                'leads_table', leads_count,
                'old_leads_table', old_leads_count,
                'timestamp', NOW()
            ),
            'low'
        );
    END IF;
    
    RETURN total_anonymized;
END;
$$;

COMMENT ON FUNCTION public.anonymize_old_leads IS 'GDPR compliance: Anonymizes PII in leads older than 90 days';

-- Update schedule_security_cleanup to include anonymization
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
    
    DELETE FROM public.ip_rate_limits 
    WHERE last_attempt < NOW() - INTERVAL '24 hours'
    AND blocked_until IS NULL;
    
    -- Clean up old security audit logs (keep 90 days)
    DELETE FROM public.security_audit_log 
    WHERE created_at < NOW() - INTERVAL '90 days';
    
    -- GDPR compliance: Anonymize old leads
    PERFORM public.anonymize_old_leads();
    
    -- Log cleanup completion
    PERFORM public.log_security_event(
        'automated_cleanup_completed',
        NULL,
        NULL,
        NULL,
        jsonb_build_object('cleanup_time', NOW()),
        'low'
    );
END;
$$;

COMMENT ON FUNCTION public.schedule_security_cleanup IS 'Scheduled cleanup including GDPR anonymization';