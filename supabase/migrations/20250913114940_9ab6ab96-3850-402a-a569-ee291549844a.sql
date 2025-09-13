-- CRITICAL SECURITY FIXES - Phase 1A: Fix leads table access
DROP POLICY IF EXISTS "leads_admin_only_access" ON public.leads;
DROP POLICY IF EXISTS "leads_admin_update" ON public.leads;
DROP POLICY IF EXISTS "leads_anonymous_insert_v2" ON public.leads;

-- Restrict leads table to admin-only access
CREATE POLICY "leads_admin_select" 
ON public.leads 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "leads_admin_update" 
ON public.leads 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "leads_admin_delete" 
ON public.leads 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Controlled anonymous insert with enhanced security
CREATE POLICY "leads_secure_insert" 
ON public.leads 
FOR INSERT 
WITH CHECK (
  email IS NOT NULL 
  AND validate_lead_email(email) = true 
  AND length(email) BETWEEN 5 AND 100
  AND check_lead_rate_limit(email, 3, 60) = true
  AND (nombre IS NULL OR length(nombre) BETWEEN 2 AND 100)
  AND (telefono IS NULL OR length(telefono) BETWEEN 9 AND 20)
);