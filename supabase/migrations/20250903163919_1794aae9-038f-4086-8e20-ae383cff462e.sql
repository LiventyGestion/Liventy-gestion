-- Fix security issue: Restrict access to leads table to authorized users only
-- Keep INSERT policy permissive for calculator functionality, but restrict SELECT/UPDATE

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can view leads" ON public.leads;
DROP POLICY IF EXISTS "Anyone can update existing leads" ON public.leads;

-- Create restrictive policies that only allow authorized roles to access lead data
CREATE POLICY "Only authorized staff can view leads" 
ON public.leads 
FOR SELECT 
USING (
  -- Only users with admin, staff, or manager roles can view leads
  get_current_user_role() IN ('admin', 'staff', 'manager', 'propietario')
);

CREATE POLICY "Only authorized staff can update leads" 
ON public.leads 
FOR UPDATE 
USING (
  -- Only users with admin, staff, or manager roles can update leads
  get_current_user_role() IN ('admin', 'staff', 'manager', 'propietario')
);

-- Keep the INSERT policy as-is since calculators need to create leads anonymously
-- The "Anyone can create leads" policy remains unchanged for calculator functionality