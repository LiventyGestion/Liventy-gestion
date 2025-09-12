-- Fix security issue: Prevent anonymous access to customer contact information in leads table

-- Drop existing admin select policy to recreate it with explicit security
DROP POLICY IF EXISTS "leads_admin_select" ON public.leads;

-- Create explicit policy to allow ONLY authenticated admin users to read leads
CREATE POLICY "leads_authenticated_admin_only_select" 
ON public.leads 
FOR SELECT 
USING (
    auth.uid() IS NOT NULL 
    AND EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Log lead access attempts for security monitoring
CREATE OR REPLACE FUNCTION public.log_lead_access()
RETURNS TRIGGER AS $$
BEGIN
    -- Log access attempt to leads table
    PERFORM public.log_security_event(
        'lead_table_access',
        auth.uid(),
        NULL,
        NULL,
        jsonb_build_object(
            'operation', TG_OP,
            'is_authenticated', auth.uid() IS NOT NULL,
            'user_role', CASE 
                WHEN auth.uid() IS NOT NULL THEN (
                    SELECT role FROM public.profiles WHERE id = auth.uid()
                )
                ELSE 'anonymous'
            END
        ),
        CASE 
            WHEN auth.uid() IS NULL THEN 'high'
            ELSE 'low'
        END
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for lead access monitoring
DROP TRIGGER IF EXISTS leads_access_log_trigger ON public.leads;
CREATE TRIGGER leads_access_log_trigger
    AFTER SELECT OR INSERT ON public.leads
    FOR EACH STATEMENT
    EXECUTE FUNCTION public.log_lead_access();