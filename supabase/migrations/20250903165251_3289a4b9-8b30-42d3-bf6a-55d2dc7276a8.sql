-- Fix conflicting RLS policies on leads table
-- Remove duplicate policy that's causing security confusion
DROP POLICY IF EXISTS "deny_anon_leads_access" ON public.leads;

-- Ensure we have the correct policies in place
-- Keep the properly named policy for anonymous access denial
-- (This should already exist from previous migrations)

-- Verify and recreate the staff access policy if needed
DO $$
BEGIN
    -- Check if the staff access policy exists, if not create it
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'leads' 
        AND policyname = 'Only authorized staff can view leads'
    ) THEN
        CREATE POLICY "Only authorized staff can view leads" 
        ON public.leads 
        FOR SELECT 
        TO authenticated
        USING (get_current_user_role() = ANY (ARRAY['admin'::text, 'staff'::text, 'manager'::text, 'propietario'::text]));
    END IF;

    -- Check if the anonymous denial policy exists, if not create it
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'leads' 
        AND policyname = 'Deny anonymous access to leads'
    ) THEN
        CREATE POLICY "Deny anonymous access to leads" 
        ON public.leads 
        FOR SELECT 
        TO anon
        USING (false);
    END IF;
END
$$;