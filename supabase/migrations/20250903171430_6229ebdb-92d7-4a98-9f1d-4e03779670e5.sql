-- Add missing sale_timing column to leads table
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS sale_timing text;

-- Add missing columns to calculadora_resultados table
ALTER TABLE public.calculadora_resultados 
ADD COLUMN IF NOT EXISTS lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS tool text,
ADD COLUMN IF NOT EXISTS utm_source text,
ADD COLUMN IF NOT EXISTS utm_medium text, 
ADD COLUMN IF NOT EXISTS utm_campaign text,
ADD COLUMN IF NOT EXISTS utm_term text,
ADD COLUMN IF NOT EXISTS utm_content text,
ADD COLUMN IF NOT EXISTS source_tag text;

-- Update existing tool_type column to tool if needed (rename)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'calculadora_resultados' 
        AND column_name = 'tool_type'
        AND table_schema = 'public'
    ) THEN
        -- Copy data from tool_type to tool if tool column is empty
        UPDATE public.calculadora_resultados 
        SET tool = tool_type 
        WHERE tool IS NULL AND tool_type IS NOT NULL;
        
        -- Drop the old tool_type column
        ALTER TABLE public.calculadora_resultados DROP COLUMN tool_type;
    END IF;
END $$;

-- Drop existing RLS policies on calculadora_resultados to recreate them properly
DROP POLICY IF EXISTS "Anyone can insert calculator results" ON public.calculadora_resultados;
DROP POLICY IF EXISTS "Users can view own calculator results only" ON public.calculadora_resultados;
DROP POLICY IF EXISTS "Anonymous users can view anonymous results" ON public.calculadora_resultados;
DROP POLICY IF EXISTS "auth_users_own_calc_results" ON public.calculadora_resultados;
DROP POLICY IF EXISTS "anon_users_no_personal_data" ON public.calculadora_resultados;

-- Create proper RLS policies for calculadora_resultados
-- Anyone can insert calculator results
CREATE POLICY "Anyone can insert calculator results"
ON public.calculadora_resultados
FOR INSERT
WITH CHECK (true);

-- Propietarios can view their own calculations when logged in
CREATE POLICY "Propietarios can view own calculations"
ON public.calculadora_resultados
FOR SELECT
TO authenticated
USING (
    user_id = auth.uid() AND 
    get_current_user_role() = 'propietario'
);

-- Admins can view all calculations
CREATE POLICY "Admins can view all calculations"
ON public.calculadora_resultados
FOR SELECT
TO authenticated
USING (
    get_current_user_role() = ANY (ARRAY['admin'::text, 'staff'::text, 'manager'::text])
);

-- Users can view their own calculations regardless of role
CREATE POLICY "Users can view own calculations"
ON public.calculadora_resultados
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Anonymous users can still view anonymous results (no user_id)
CREATE POLICY "Anonymous can view anonymous results"
ON public.calculadora_resultados
FOR SELECT
USING (user_id IS NULL);

-- Add constraints to ensure data integrity
ALTER TABLE public.leads 
ADD CONSTRAINT check_service_interest 
CHECK (service_interest IS NULL OR service_interest IN ('alquiler', 'venta', 'indiferente'));

ALTER TABLE public.leads 
ADD CONSTRAINT check_sale_timing 
CHECK (sale_timing IS NULL OR sale_timing IN ('urgente', '2_4m', '4m_plus', 'informativo'));

ALTER TABLE public.calculadora_resultados 
ADD CONSTRAINT check_tool_type 
CHECK (tool IS NULL OR tool IN ('precio', 'rentabilidad', 'comparador'));