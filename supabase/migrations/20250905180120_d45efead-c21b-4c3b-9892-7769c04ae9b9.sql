-- Fix infinite recursion by completely removing recursive policies
-- Drop ALL existing policies on profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;  
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;

-- Create simple, non-recursive policies
CREATE POLICY "Enable read access for users to their own profile" 
ON profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Enable update access for users to their own profile" 
ON profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Enable insert access for users to their own profile" 
ON profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);