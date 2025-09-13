-- CRITICAL SECURITY FIXES - Phase 1: Database Security

-- 1. Fix leads table RLS - Restrict to admin access only
DROP POLICY IF EXISTS "leads_admin_only_access" ON public.leads;
DROP POLICY IF EXISTS "leads_admin_update" ON public.leads;
DROP POLICY IF EXISTS "leads_anonymous_insert_v2" ON public.leads;

CREATE POLICY "leads_admin_only_select" 
ON public.leads 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "leads_admin_only_update" 
ON public.leads 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "leads_admin_only_delete" 
ON public.leads 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Keep controlled anonymous insert with enhanced validation
CREATE POLICY "leads_controlled_anonymous_insert" 
ON public.leads 
FOR INSERT 
WITH CHECK (
  email IS NOT NULL 
  AND validate_lead_email(email) = true 
  AND length(email) >= 5 
  AND length(email) <= 100
  AND check_lead_rate_limit(email, 3, 60) = true
  AND (nombre IS NULL OR (length(nombre) >= 2 AND length(nombre) <= 100))
  AND (telefono IS NULL OR (length(telefono) >= 9 AND length(telefono) <= 20))
  AND length(COALESCE(origen, '')) <= 50
  AND NOT (
    email ~~* '%+%+%' OR email ~~* '%test%test%' OR 
    COALESCE(nombre, '') ~~* '%test%' OR COALESCE(nombre, '') ~~* '%spam%' OR 
    COALESCE(nombre, '') ~~* '%bot%' OR email ~~* '%disposable%' OR 
    email ~~* '%temp%mail%' OR email ~~* '%10minutemail%' OR 
    email ~~* '%guerrillamail%'
  )
);

-- 2. Fix Leads table (uppercase) - Make admin-only except for controlled inserts
DROP POLICY IF EXISTS "admin_select" ON public."Leads";
DROP POLICY IF EXISTS "web_anon_insert" ON public."Leads";

CREATE POLICY "Leads_admin_only_select" 
ON public."Leads" 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Leads_admin_only_update" 
ON public."Leads" 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Leads_admin_only_delete" 
ON public."Leads" 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Controlled insert for website forms with enhanced validation
CREATE POLICY "Leads_controlled_insert" 
ON public."Leads" 
FOR INSERT 
WITH CHECK (
  email IS NOT NULL 
  AND validate_lead_email(email) = true 
  AND length(email) >= 5 
  AND length(email) <= 100
  AND (nombre IS NULL OR (length(nombre) >= 2 AND length(nombre) <= 100))
  AND (telefono IS NULL OR (length(telefono) >= 9 AND length(telefono) <= 20))
  AND check_anonymous_lead_limits(email) = true
);

-- 3. Fix solicitudes table - Add admin access
DROP POLICY IF EXISTS "solicitudes_anonymous_insert" ON public.solicitudes;

CREATE POLICY "solicitudes_admin_select" 
ON public.solicitudes 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "solicitudes_admin_update" 
ON public.solicitudes 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "solicitudes_admin_delete" 
ON public.solicitudes 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Controlled insert with rate limiting and validation
CREATE POLICY "solicitudes_controlled_insert" 
ON public.solicitudes 
FOR INSERT 
WITH CHECK (
  email IS NOT NULL 
  AND validate_lead_email(email) = true 
  AND length(email) >= 5 
  AND length(email) <= 100
  AND length(nombre) >= 2 
  AND length(nombre) <= 100
  AND length(telefono) >= 9 
  AND length(telefono) <= 20
  AND check_lead_rate_limit(email, 2, 120) = true
);

-- 4. Restrict ip_rate_limits access to service role only
DROP POLICY IF EXISTS "System can manage IP rate limits" ON public.ip_rate_limits;

CREATE POLICY "ip_rate_limits_service_only" 
ON public.ip_rate_limits 
FOR ALL 
USING (auth.role() = 'service_role');

-- 5. Enhanced chatbot security - ensure proper session validation
DROP POLICY IF EXISTS "chatbot_conversations_secure_select_v4" ON public.chatbot_conversations;

CREATE POLICY "chatbot_conversations_secure_select_v5" 
ON public.chatbot_conversations 
FOR SELECT 
USING (
  -- Authenticated users can only see their own conversations
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) 
  OR 
  -- Admins can see all conversations
  (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ))
  OR 
  -- Service role access
  (auth.role() = 'service_role')
);

-- 6. Enhanced calculadora_resultados security
DROP POLICY IF EXISTS "calculadora_user_own_data" ON public.calculadora_resultados;
DROP POLICY IF EXISTS "calculator_secure_insert" ON public.calculadora_resultados;

CREATE POLICY "calculadora_secure_select" 
ON public.calculadora_resultados 
FOR SELECT 
USING (
  -- Users can see their own data
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) 
  OR 
  -- Admins can see all data
  (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ))
);

CREATE POLICY "calculadora_secure_insert" 
ON public.calculadora_resultados 
FOR INSERT 
WITH CHECK (
  -- Authenticated users creating their own records
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) 
  OR 
  -- Anonymous users with proper validation and rate limiting
  (
    auth.uid() IS NULL 
    AND user_id IS NULL 
    AND email IS NOT NULL 
    AND validate_email_format(email) = true 
    AND length(email) >= 5 
    AND length(email) <= 100
    AND check_anonymous_rate_limit(
      COALESCE(inputs->>'session_id', 'anonymous'), 
      'calculator', 
      10, 
      60
    ) = true
  )
);

-- 7. Create security monitoring trigger for sensitive operations
CREATE OR REPLACE FUNCTION public.log_sensitive_data_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Log access to sensitive customer data
    IF TG_TABLE_NAME IN ('leads', 'Leads', 'solicitudes', 'calculadora_resultados') THEN
        PERFORM public.log_security_event(
            'sensitive_data_access',
            auth.uid(),
            NULL,
            NULL,
            jsonb_build_object(
                'table', TG_TABLE_NAME,
                'operation', TG_OP,
                'is_admin', EXISTS(
                    SELECT 1 FROM public.profiles 
                    WHERE id = auth.uid() AND role = 'admin'
                ),
                'timestamp', NOW()
            ),
            CASE 
                WHEN auth.uid() IS NULL THEN 'medium'
                WHEN EXISTS(
                    SELECT 1 FROM public.profiles 
                    WHERE id = auth.uid() AND role = 'admin'
                ) THEN 'low'
                ELSE 'high'
            END
        );
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create triggers for monitoring sensitive data access
CREATE TRIGGER sensitive_data_access_leads
    AFTER SELECT OR INSERT OR UPDATE OR DELETE ON public.leads
    FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_data_access();

CREATE TRIGGER sensitive_data_access_Leads
    AFTER SELECT OR INSERT OR UPDATE OR DELETE ON public."Leads"
    FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_data_access();

CREATE TRIGGER sensitive_data_access_solicitudes
    AFTER SELECT OR INSERT OR UPDATE OR DELETE ON public.solicitudes
    FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_data_access();

CREATE TRIGGER sensitive_data_access_calculadora
    AFTER SELECT OR INSERT OR UPDATE OR DELETE ON public.calculadora_resultados
    FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_data_access();