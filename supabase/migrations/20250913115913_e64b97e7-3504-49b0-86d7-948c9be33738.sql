-- CRITICAL SECURITY FIXES - Phase 1B: Fix other sensitive tables
-- Fix Leads table (uppercase)
DROP POLICY IF EXISTS "admin_select" ON public."Leads";
DROP POLICY IF EXISTS "web_anon_insert" ON public."Leads";

CREATE POLICY "Leads_admin_select" 
ON public."Leads" 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Leads_admin_update" 
ON public."Leads" 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Leads_admin_delete" 
ON public."Leads" 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Leads_secure_insert" 
ON public."Leads" 
FOR INSERT 
WITH CHECK (
  email IS NOT NULL 
  AND validate_lead_email(email) = true 
  AND length(email) BETWEEN 5 AND 100
  AND (nombre IS NULL OR length(nombre) BETWEEN 2 AND 100)
  AND (telefono IS NULL OR length(telefono) BETWEEN 9 AND 20)
  AND check_anonymous_lead_limits(email) = true
);

-- Fix solicitudes table
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

CREATE POLICY "solicitudes_secure_insert" 
ON public.solicitudes 
FOR INSERT 
WITH CHECK (
  email IS NOT NULL 
  AND validate_lead_email(email) = true 
  AND length(email) BETWEEN 5 AND 100
  AND length(nombre) BETWEEN 2 AND 100
  AND length(telefono) BETWEEN 9 AND 20
  AND check_lead_rate_limit(email, 2, 120) = true
);