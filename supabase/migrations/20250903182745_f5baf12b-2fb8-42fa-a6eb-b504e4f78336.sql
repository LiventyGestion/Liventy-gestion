-- Security Fix: Remove only the vulnerable policies and replace them

-- 1. Fix the main security issue: Remove anonymous access to calculator results
DROP POLICY IF EXISTS "Anonymous can view anonymous results" ON public.calculadora_resultados;

-- 2. Remove overly permissive lead creation (replace with authenticated-only)
DROP POLICY IF EXISTS "Anyone can create leads" ON public.leads;
CREATE POLICY "Secure lead creation" 
ON public.leads 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- 3. Remove overly permissive calculator insertion
DROP POLICY IF EXISTS "Anyone can insert calculator results" ON public.calculadora_resultados;
CREATE POLICY "Secure calculator insertion" 
ON public.calculadora_resultados 
FOR INSERT 
TO authenticated
WITH CHECK (
  -- User can insert their own calculations
  user_id = auth.uid() 
  OR 
  -- Allow inserting anonymous calculations for lead generation, but user must be authenticated
  user_id IS NULL
);

-- The existing viewing policies for Usuarios and restrictive policies for leads are already secure
-- so we don't need to modify them