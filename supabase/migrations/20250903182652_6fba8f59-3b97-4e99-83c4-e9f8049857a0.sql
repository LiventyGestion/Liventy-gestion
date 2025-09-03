-- Security Fix: Tighten RLS policies to prevent data exposure

-- 1. Fix leads table policies - Remove overly permissive anonymous access
DROP POLICY IF EXISTS "Anyone can create leads" ON public.leads;
DROP POLICY IF EXISTS "Deny anonymous access to leads" ON public.leads;

-- Create secure lead creation policy - only authenticated users can create leads
DROP POLICY IF EXISTS "Authenticated users can create leads" ON public.leads;
CREATE POLICY "Authenticated users can create leads" 
ON public.leads 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Keep existing policies for viewing/updating by authorized staff

-- 2. Fix calculadora_resultados - Remove anonymous viewing to prevent business intelligence leakage
DROP POLICY IF EXISTS "Anonymous can view anonymous results" ON public.calculadora_resultados;

-- Replace with secure viewing policy
DROP POLICY IF EXISTS "Only authenticated users can view calculations" ON public.calculadora_resultados;
CREATE POLICY "Only authenticated users can view calculations" 
ON public.calculadora_resultados 
FOR SELECT 
TO authenticated
USING (
  -- Users can see their own calculations
  user_id = auth.uid() 
  OR 
  -- Admins can see all calculations
  get_current_user_role() = ANY (ARRAY['admin'::text, 'staff'::text, 'manager'::text])
  OR
  -- Propietarios can see calculations they created or anonymous ones
  (get_current_user_role() = 'propietario'::text AND (user_id = auth.uid() OR user_id IS NULL))
);

-- 3. Fix Usuarios table - Consolidate conflicting SELECT policies
DROP POLICY IF EXISTS "Deny anonymous access to user profiles" ON public."Usuarios";
DROP POLICY IF EXISTS "deny_anonymous_user_access" ON public."Usuarios";
DROP POLICY IF EXISTS "authenticated_users_own_profile_only" ON public."Usuarios";

-- Create single clear policy for user profile access
CREATE POLICY "Users can only view their own profile" 
ON public."Usuarios" 
FOR SELECT 
TO authenticated
USING (id = auth.uid());

-- 4. Secure calculator results insertion
DROP POLICY IF EXISTS "Anyone can insert calculator results" ON public.calculadora_resultados;

-- Create secure insertion policy
CREATE POLICY "Authenticated users can insert calculator results" 
ON public.calculadora_resultados 
FOR INSERT 
TO authenticated
WITH CHECK (
  -- User can insert their own calculations
  user_id = auth.uid() 
  OR 
  -- Allow inserting anonymous calculations (user_id = NULL) for lead generation
  (user_id IS NULL AND auth.uid() IS NOT NULL)
);