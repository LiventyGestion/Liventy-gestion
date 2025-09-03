-- Fix security issues identified by the scanner

-- 1. Fix Usuarios table - Add explicit policy to deny anonymous access
-- The current policy only works for authenticated users, we need to be more explicit
DROP POLICY IF EXISTS "Ver mi perfil" ON public."Usuarios";

-- Create comprehensive policies for Usuarios table
CREATE POLICY "Users can only view their own profile" 
ON public."Usuarios" 
FOR SELECT 
TO authenticated
USING (id = auth.uid());

-- Explicitly deny anonymous access to Usuarios table
CREATE POLICY "Deny anonymous access to user profiles" 
ON public."Usuarios" 
FOR SELECT 
TO anon
USING (false);

-- 2. Fix calculadora_resultados table - Restrict SELECT access
-- Currently allows anonymous users to see calculation data with emails
DROP POLICY IF EXISTS "Users can view their own calculator results" ON public.calculadora_resultados;

-- Only allow authenticated users to see their own calculator results
CREATE POLICY "Users can view own calculator results only" 
ON public.calculadora_resultados 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Allow anonymous users to see only their own anonymous results (without user_id)
CREATE POLICY "Anonymous users can view anonymous results" 
ON public.calculadora_resultados 
FOR SELECT 
TO anon
USING (user_id IS NULL AND email IS NULL);

-- 3. Add additional protection for leads table - explicitly deny anonymous SELECT
CREATE POLICY "Deny anonymous access to leads" 
ON public.leads 
FOR SELECT 
TO anon
USING (false);