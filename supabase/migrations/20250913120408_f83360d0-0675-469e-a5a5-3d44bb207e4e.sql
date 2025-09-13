-- CRITICAL SECURITY FIXES - Phase 1C: Fix remaining tables and rate limits
-- Fix ip_rate_limits access
DROP POLICY IF EXISTS "System can manage IP rate limits" ON public.ip_rate_limits;

CREATE POLICY "ip_rate_limits_service_only" 
ON public.ip_rate_limits 
FOR ALL 
USING (auth.role() = 'service_role');

-- Enhanced calculadora_resultados security
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
    AND length(email) BETWEEN 5 AND 100
    AND check_anonymous_rate_limit(
      COALESCE(inputs->>'session_id', 'anonymous'), 
      'calculator', 
      10, 
      60
    ) = true
  )
);