-- Security Fix: Use unique policy names to avoid conflicts

-- 1. Remove the main security vulnerability: anonymous access to calculator results
DROP POLICY IF EXISTS "Anonymous can view anonymous results" ON public.calculadora_resultados;

-- 2. Fix lead creation security
DROP POLICY IF EXISTS "Anyone can create leads" ON public.leads;
DROP POLICY IF EXISTS "Secure lead creation" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users can create leads" ON public.leads;

CREATE POLICY "authenticated_lead_creation_policy" 
ON public.leads 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- 3. Fix calculator insertion security  
DROP POLICY IF EXISTS "Anyone can insert calculator results" ON public.calculadora_resultados;
DROP POLICY IF EXISTS "Secure calculator insertion" ON public.calculadora_resultados;
DROP POLICY IF EXISTS "Authenticated users can insert calculator results" ON public.calculadora_resultados;

CREATE POLICY "authenticated_calculator_insertion_policy" 
ON public.calculadora_resultados 
FOR INSERT 
TO authenticated
WITH CHECK (
  user_id = auth.uid() OR user_id IS NULL
);