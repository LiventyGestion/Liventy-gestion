-- SPRINT 2: Update RLS policies to use has_role() security definer function
-- This prevents recursive RLS issues and ensures proper role checking

-- ============================================
-- Update Leads table policies
-- ============================================
DROP POLICY IF EXISTS "Leads_admin_select" ON public.leads;
DROP POLICY IF EXISTS "Leads_admin_update" ON public.leads;
DROP POLICY IF EXISTS "Leads_admin_delete" ON public.leads;

CREATE POLICY "Leads_admin_select"
ON public.leads
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Leads_admin_update"
ON public.leads
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Leads_admin_delete"
ON public.leads
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- Update calculadora_resultados policies
-- ============================================
DROP POLICY IF EXISTS "calculadora_secure_select" ON public.calculadora_resultados;

CREATE POLICY "calculadora_secure_select"
ON public.calculadora_resultados
FOR SELECT
TO authenticated
USING (
    (user_id = auth.uid()) OR 
    public.has_role(auth.uid(), 'admin')
);

-- ============================================
-- Update chatbot_conversations policies
-- ============================================
DROP POLICY IF EXISTS "chatbot_conversations_secure_select_v4" ON public.chatbot_conversations;
DROP POLICY IF EXISTS "chatbot_conversations_secure_update_v2" ON public.chatbot_conversations;
DROP POLICY IF EXISTS "chatbot_conversations_secure_delete" ON public.chatbot_conversations;

CREATE POLICY "chatbot_conversations_secure_select_v5"
ON public.chatbot_conversations
FOR SELECT
TO authenticated
USING (
    (user_id = auth.uid()) OR 
    public.has_role(auth.uid(), 'admin') OR
    (auth.role() = 'service_role')
);

CREATE POLICY "chatbot_conversations_secure_update_v3"
ON public.chatbot_conversations
FOR UPDATE
TO authenticated
USING (
    (user_id = auth.uid()) OR 
    public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
    ((user_id IS NULL) OR (user_id = auth.uid())) AND 
    (session_id IS NOT NULL) AND 
    (length(session_id) >= 10) AND 
    ((user_email IS NULL) OR (validate_email_format(user_email) = true))
);

CREATE POLICY "chatbot_conversations_secure_delete_v2"
ON public.chatbot_conversations
FOR DELETE
TO authenticated
USING (
    public.has_role(auth.uid(), 'admin') OR 
    (auth.role() = 'service_role')
);

-- ============================================
-- Update chatbot_messages policies
-- ============================================
DROP POLICY IF EXISTS "chatbot_messages_secure_select_v4" ON public.chatbot_messages;

CREATE POLICY "chatbot_messages_secure_select_v5"
ON public.chatbot_messages
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM chatbot_conversations c
        WHERE c.id = chatbot_messages.conversation_id AND (
            (c.user_id = auth.uid()) OR 
            public.has_role(auth.uid(), 'admin') OR
            (auth.role() = 'service_role')
        )
    )
);

-- ============================================
-- Update chatbot_context policies
-- ============================================
DROP POLICY IF EXISTS "Only admins can create context" ON public.chatbot_context;
DROP POLICY IF EXISTS "Only admins can read context" ON public.chatbot_context;
DROP POLICY IF EXISTS "Only admins can update context" ON public.chatbot_context;

CREATE POLICY "Only admins can create context v2"
ON public.chatbot_context
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can read context v2"
ON public.chatbot_context
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update context v2"
ON public.chatbot_context
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- Update security_audit_log policies
-- ============================================
DROP POLICY IF EXISTS "Only admins can view security audit logs" ON public.security_audit_log;

CREATE POLICY "Only admins can view security audit logs v2"
ON public.security_audit_log
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- Update lead_rate_limits policies
-- ============================================
DROP POLICY IF EXISTS "Only admins can view rate limits" ON public.lead_rate_limits;

CREATE POLICY "Only admins can view rate limits v2"
ON public.lead_rate_limits
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- Update solicitudes policies
-- ============================================
DROP POLICY IF EXISTS "solicitudes_admin_select" ON public.solicitudes;

CREATE POLICY "solicitudes_admin_select_v2"
ON public.solicitudes
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- Update Leads (old table) policies
-- ============================================
DROP POLICY IF EXISTS "Leads_admin_delete" ON public."Leads";
DROP POLICY IF EXISTS "Leads_admin_select" ON public."Leads";
DROP POLICY IF EXISTS "Leads_admin_update" ON public."Leads";

CREATE POLICY "Leads_admin_delete_v2"
ON public."Leads"
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Leads_admin_select_v2"
ON public."Leads"
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Leads_admin_update_v2"
ON public."Leads"
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- Update service_requests, chat_threads, availability policies
-- ============================================
DROP POLICY IF EXISTS "p_avail_upd_admin" ON public.availability;
CREATE POLICY "p_avail_upd_admin_v2"
ON public.availability
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "p_sr_select" ON public.service_requests;
DROP POLICY IF EXISTS "p_sr_update" ON public.service_requests;

CREATE POLICY "p_sr_select_v2"
ON public.service_requests
FOR SELECT
TO authenticated
USING (
    (user_id = auth.uid()) OR 
    public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "p_sr_update_v2"
ON public.service_requests
FOR UPDATE
TO authenticated
USING (
    (user_id = auth.uid()) OR 
    public.has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "p_threads_select" ON public.chat_threads;
DROP POLICY IF EXISTS "p_threads_update" ON public.chat_threads;

CREATE POLICY "p_threads_select_v2"
ON public.chat_threads
FOR SELECT
TO authenticated
USING (
    (user_id = auth.uid()) OR 
    public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "p_threads_update_v2"
ON public.chat_threads
FOR UPDATE
TO authenticated
USING (
    (user_id = auth.uid()) OR 
    public.has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "p_msgs_select" ON public.chat_messages;

CREATE POLICY "p_msgs_select_v2"
ON public.chat_messages
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM chat_threads t
        WHERE t.id = chat_messages.thread_id AND (
            (t.user_id = auth.uid()) OR 
            public.has_role(auth.uid(), 'admin')
        )
    )
);

DROP POLICY IF EXISTS "p_incidents_select_by_sr" ON public."Incidencias";

CREATE POLICY "p_incidents_select_by_sr_v2"
ON public."Incidencias"
FOR SELECT
TO authenticated
USING (
    (EXISTS (
        SELECT 1
        FROM "Propiedades" prop
        WHERE (prop.id = "Incidencias".propiedad_id) AND (prop.usuario_id = auth.uid())
    )) OR 
    (EXISTS (
        SELECT 1
        FROM service_requests sr
        WHERE (sr.id = "Incidencias".service_request_id) AND (sr.user_id = auth.uid())
    )) OR 
    public.has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "p_incidents_insert" ON public."Incidencias";

CREATE POLICY "p_incidents_insert_v2"
ON public."Incidencias"
FOR INSERT
TO authenticated
WITH CHECK (
    (EXISTS (
        SELECT 1
        FROM "Propiedades" prop
        WHERE (prop.id = "Incidencias".propiedad_id) AND (prop.usuario_id = auth.uid())
    )) OR 
    public.has_role(auth.uid(), 'admin')
);