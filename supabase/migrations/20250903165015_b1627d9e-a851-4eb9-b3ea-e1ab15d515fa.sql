-- Fix security issues - Handle existing policies correctly

-- 1. Fix Usuarios table policies
-- Drop all existing SELECT policies first
DROP POLICY IF EXISTS "Ver mi perfil" ON public."Usuarios";
DROP POLICY IF EXISTS "Users can only view their own profile" ON public."Usuarios";

-- Create comprehensive SELECT policies for Usuarios table
CREATE POLICY "authenticated_users_own_profile_only" 
ON public."Usuarios" 
FOR SELECT 
TO authenticated
USING (id = auth.uid());

CREATE POLICY "deny_anonymous_user_access" 
ON public."Usuarios" 
FOR SELECT 
TO anon
USING (false);

-- 2. Fix calculadora_resultados table
-- Drop existing permissive SELECT policy
DROP POLICY IF EXISTS "Users can view their own calculator results" ON public.calculadora_resultados;

-- Create restrictive SELECT policies for calculator results
CREATE POLICY "auth_users_own_calc_results" 
ON public.calculadora_resultados 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "anon_users_no_personal_data" 
ON public.calculadora_resultados 
FOR SELECT 
TO anon
USING (user_id IS NULL AND email IS NULL);

-- 3. Add protection for leads table against anonymous access
CREATE POLICY "deny_anon_leads_access" 
ON public.leads 
FOR SELECT 
TO anon
USING (false);