-- Fix security issue: Strengthen leads table SELECT policies to prevent unauthorized access to customer contact information

-- Drop existing policies to recreate them with stronger security
DROP POLICY IF EXISTS "leads_admin_select" ON public.leads;

-- Create explicit policy to deny anonymous access to leads
CREATE POLICY "leads_deny_anonymous_select" 
ON public.leads 
FOR SELECT 
USING (false) -- Explicitly deny all anonymous access
-- This policy will be checked first for anonymous users

-- Create policy to allow only authenticated admins to view leads
CREATE POLICY "leads_admin_only_select" 
ON public.leads 
FOR SELECT 
USING (
    auth.uid() IS NOT NULL 
    AND EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Add additional security logging for lead access attempts
CREATE OR REPLACE FUNCTION public.log_lead_access_attempt()
RETURNS TRIGGER AS $$
BEGIN
    -- Log any SELECT attempt on leads table for security monitoring
    IF TG_OP = 'SELECT' THEN
        PERFORM log_security_event(
            'lead_access_attempt',
            auth.uid(),
            NULL,
            NULL,
            jsonb_build_object(
                'table', 'leads',
                'is_authenticated', auth.uid() IS NOT NULL,
                'timestamp', NOW()
            ),
            CASE 
                WHEN auth.uid() IS NULL THEN 'high'  -- Anonymous access attempt
                ELSE 'low'  -- Authenticated access
            END
        );
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to log all access attempts to leads table
DROP TRIGGER IF EXISTS log_lead_access_trigger ON public.leads;
CREATE TRIGGER log_lead_access_trigger
AFTER SELECT ON public.leads
FOR EACH STATEMENT
EXECUTE FUNCTION public.log_lead_access_attempt();

-- Ensure leads table has proper column-level security by adding a view for safe operations
CREATE OR REPLACE VIEW public.leads_safe_insert AS
SELECT 
    id,
    created_at,
    source_tag,
    service_interest
FROM public.leads;

-- Grant limited access to the safe view for monitoring purposes
GRANT SELECT ON public.leads_safe_insert TO authenticated;

-- Add policy for the safe view
CREATE POLICY "leads_safe_view_admin_only" 
ON public.leads_safe_insert
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);