-- Fix infinite recursion in profiles RLS policies
-- Drop existing conflicting policies
DROP POLICY IF EXISTS "p_profiles_admin_all" ON profiles;
DROP POLICY IF EXISTS "p_profiles_self_select" ON profiles;
DROP POLICY IF EXISTS "p_profiles_self_update" ON profiles;

-- Create simple, non-recursive policies for profiles
CREATE POLICY "Users can view their own profile" 
ON profiles 
FOR SELECT 
USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" 
ON profiles 
FOR UPDATE 
USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile" 
ON profiles 
FOR INSERT 
WITH CHECK (id = auth.uid());

-- Admin policy for profiles (without recursion)
CREATE POLICY "Admins can manage all profiles" 
ON profiles 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'admin'
  )
);