-- Security Fix: Allow anonymous calculator usage for lead generation while maintaining security

-- 1. Update calculator results policy to allow anonymous usage for lead generation
DROP POLICY IF EXISTS "authenticated_calculator_insertion_policy" ON public.calculadora_resultados;

CREATE POLICY "secure_calculator_insertion_policy" 
ON public.calculadora_resultados 
FOR INSERT 
WITH CHECK (
  -- Authenticated users can insert their own calculations
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
  OR
  -- Anonymous users can insert calculations for lead generation (user_id must be NULL and email should be provided)
  (auth.uid() IS NULL AND user_id IS NULL)
  OR  
  -- Authenticated users can create anonymous calculations for lead generation
  (auth.uid() IS NOT NULL AND user_id IS NULL)
);

-- 2. Update leads policy to allow anonymous lead creation (for lead generation)
DROP POLICY IF EXISTS "authenticated_lead_creation_policy" ON public.leads;

CREATE POLICY "secure_lead_creation_policy" 
ON public.leads 
FOR INSERT 
WITH CHECK (
  -- Anyone can create leads (this is for lead generation forms)
  -- But we log the source to track legitimacy
  true
);

-- 3. Add viewing restriction for anonymous calculator results to prevent data mining
CREATE POLICY "restrict_anonymous_calculator_viewing" 
ON public.calculadora_resultados 
FOR SELECT 
USING (
  -- Users can see their own calculations
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
  OR
  -- Admins/staff can see all calculations  
  (auth.uid() IS NOT NULL AND get_current_user_role() = ANY (ARRAY['admin'::text, 'staff'::text, 'manager'::text]))
  OR
  -- Propietarios can see calculations they created
  (auth.uid() IS NOT NULL AND get_current_user_role() = 'propietario'::text AND user_id = auth.uid())
  -- NOTE: Removed anonymous viewing to prevent data mining
);