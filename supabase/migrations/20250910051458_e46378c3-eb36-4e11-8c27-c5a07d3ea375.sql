-- Security Enhancement: Implement Least Privilege Data Access (Fixed)
-- This migration tightens access controls for sensitive customer data

-- 1. SECURE LEADS DATA ACCESS
-- Replace overly permissive policies with admin-only access

DROP POLICY IF EXISTS "Authorized staff can view leads" ON public.leads;
DROP POLICY IF EXISTS "Only authorized staff can view leads" ON public.leads;
DROP POLICY IF EXISTS "Authorized staff can update leads" ON public.leads;
DROP POLICY IF EXISTS "Only authorized staff can update leads" ON public.leads;

-- Create admin-only policies for leads (highly sensitive customer data)
CREATE POLICY "leads_admin_select" 
ON public.leads 
FOR SELECT 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role = 'admin'
    )
);

CREATE POLICY "leads_admin_update" 
ON public.leads 
FOR UPDATE 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role = 'admin'
    )
);

-- 2. SECURE FINANCIAL CALCULATION DATA ACCESS
-- Remove overly broad staff access to customer financial data

DROP POLICY IF EXISTS "Admins can view all calculations" ON public.calculadora_resultados;
DROP POLICY IF EXISTS "Only authenticated users can view calculations" ON public.calculadora_resultados;
DROP POLICY IF EXISTS "Propietarios can view own calculations" ON public.calculadora_resultados;
DROP POLICY IF EXISTS "Users can view own calculations" ON public.calculadora_resultados;

-- Create secure policies: users see own data, admins see all
CREATE POLICY "calculadora_user_own_data" 
ON public.calculadora_resultados 
FOR SELECT 
TO authenticated
USING (
    user_id = auth.uid() 
    OR EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role = 'admin'
    )
);

-- 3. SIMPLIFY AND SECURE CHATBOT CONVERSATION ACCESS
-- Replace complex policies with clear ownership-based access

DROP POLICY IF EXISTS "chatbot_conversations_secure_select" ON public.chatbot_conversations;
DROP POLICY IF EXISTS "chatbot_conversations_secure_update" ON public.chatbot_conversations;

-- Create simplified, secure chatbot policies
CREATE POLICY "chatbot_conversations_secure_select_v2" 
ON public.chatbot_conversations 
FOR SELECT 
TO authenticated
USING (
    -- Users can see their own conversations
    user_id = auth.uid()
    OR 
    -- Admins can see all conversations
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role = 'admin'
    )
);

-- For anonymous users, keep existing secure insert policy but add time restriction
CREATE POLICY "chatbot_conversations_secure_select_anonymous" 
ON public.chatbot_conversations 
FOR SELECT 
TO anon
USING (
    user_id IS NULL 
    AND validate_chatbot_session_access(session_id) = true 
    AND created_at >= (NOW() - INTERVAL '2 hours')  -- Restrict to 2 hours instead of 24
);

CREATE POLICY "chatbot_conversations_secure_update_v2" 
ON public.chatbot_conversations 
FOR UPDATE 
TO authenticated
USING (
    -- Users can update their own conversations
    user_id = auth.uid()
    OR 
    -- Admins can update any conversation
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role = 'admin'
    )
)
WITH CHECK (
    (user_id IS NULL OR user_id = auth.uid()) 
    AND session_id IS NOT NULL 
    AND length(session_id) >= 10
    AND (user_email IS NULL OR validate_email_format(user_email) = true)
);

-- 4. ADD AUDIT LOGGING FOR SENSITIVE DATA MODIFICATIONS
-- Create audit logging function for data modifications (not SELECT as it's not supported)

CREATE OR REPLACE FUNCTION public.log_sensitive_data_modifications()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    -- Log modifications to sensitive tables
    IF TG_TABLE_NAME IN ('leads', 'calculadora_resultados', 'chatbot_conversations') THEN
        -- Log the modification attempt (this will appear in Postgres logs)
        RAISE NOTICE 'Sensitive data modification: Table=%, User=%, Operation=%, Time=%', 
            TG_TABLE_NAME, 
            COALESCE(auth.uid()::text, 'anonymous'), 
            TG_OP, 
            now();
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$function$;

-- Create audit triggers for sensitive tables (INSERT, UPDATE, DELETE only)
DROP TRIGGER IF EXISTS audit_leads_modifications ON public.leads;
CREATE TRIGGER audit_leads_modifications
    BEFORE INSERT OR UPDATE OR DELETE ON public.leads
    FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_data_modifications();

DROP TRIGGER IF EXISTS audit_calculadora_modifications ON public.calculadora_resultados;
CREATE TRIGGER audit_calculadora_modifications
    BEFORE INSERT OR UPDATE OR DELETE ON public.calculadora_resultados
    FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_data_modifications();

DROP TRIGGER IF EXISTS audit_chatbot_modifications ON public.chatbot_conversations;
CREATE TRIGGER audit_chatbot_modifications
    BEFORE INSERT OR UPDATE OR DELETE ON public.chatbot_conversations
    FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_data_modifications();