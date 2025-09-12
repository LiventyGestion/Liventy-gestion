-- Security Fix: Restrict lead data access to authenticated admins only

-- Drop and recreate the leads SELECT policy with explicit restrictions
DROP POLICY IF EXISTS "leads_admin_select" ON public.leads;

-- Create strict policy: ONLY authenticated admin users can read leads table
CREATE POLICY "leads_admin_only_access" 
ON public.leads 
FOR SELECT 
USING (
    -- Must be authenticated
    auth.uid() IS NOT NULL 
    -- Must be admin role
    AND EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Add function to validate lead data access
CREATE OR REPLACE FUNCTION public.validate_lead_access()
RETURNS BOOLEAN AS $$
BEGIN
    -- Return false if user is not authenticated
    IF auth.uid() IS NULL THEN
        PERFORM public.log_security_event(
            'unauthorized_lead_access_attempt',
            NULL,
            NULL,
            NULL,
            jsonb_build_object('timestamp', NOW()),
            'critical'
        );
        RETURN FALSE;
    END IF;
    
    -- Check if user is admin
    IF NOT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    ) THEN
        PERFORM public.log_security_event(
            'non_admin_lead_access_attempt',
            auth.uid(),
            NULL,
            NULL,
            jsonb_build_object('timestamp', NOW()),
            'high'
        );
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;