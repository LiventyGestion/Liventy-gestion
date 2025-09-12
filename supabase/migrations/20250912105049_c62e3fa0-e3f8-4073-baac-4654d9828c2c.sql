-- Create tables for form data storage if they don't exist

-- Create solicitudes table for detailed information requests
CREATE TABLE IF NOT EXISTS public.solicitudes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    telefono TEXT NOT NULL,
    tipo_propiedad TEXT,
    ubicacion_propiedad TEXT,
    tamano_propiedad TEXT,
    situacion_actual TEXT,
    servicios_interes TEXT[],
    renta_mensual TEXT,
    timeline TEXT,
    info_adicional TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update existing leads table structure to match requirements
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='origen') THEN
        ALTER TABLE public.leads ADD COLUMN origen TEXT DEFAULT 'contacto';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='nombre') THEN
        ALTER TABLE public.leads ADD COLUMN nombre TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='telefono') THEN
        ALTER TABLE public.leads ADD COLUMN telefono TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='mensaje') THEN
        ALTER TABLE public.leads ADD COLUMN mensaje TEXT;
    END IF;
END $$;

-- Enable RLS on both tables
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitudes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first
DROP POLICY IF EXISTS "Enhanced secure lead creation" ON public.leads;
DROP POLICY IF EXISTS "solicitudes_anonymous_insert" ON public.solicitudes;

-- Create INSERT policy for solicitudes allowing anonymous users
CREATE POLICY "solicitudes_anonymous_insert" 
ON public.solicitudes 
FOR INSERT 
WITH CHECK (true);

-- Create updated INSERT policy for leads
CREATE POLICY "leads_anonymous_insert_v2" 
ON public.leads 
FOR INSERT 
WITH CHECK (
  email IS NOT NULL AND 
  validate_lead_email(email) = true AND
  length(email) >= 5 AND 
  length(email) <= 100 AND
  (nombre IS NULL OR (length(nombre) >= 2 AND length(nombre) <= 100)) AND
  (telefono IS NULL OR (length(telefono) >= 9 AND length(telefono) <= 20)) AND
  length(COALESCE(origen, '')) <= 50 AND
  NOT (email ILIKE '%+%+%' OR email ILIKE '%test%test%' OR 
       COALESCE(nombre, '') ILIKE '%test%' OR COALESCE(nombre, '') ILIKE '%spam%' OR 
       COALESCE(nombre, '') ILIKE '%bot%' OR email ILIKE '%disposable%' OR 
       email ILIKE '%temp%mail%' OR email ILIKE '%10minutemail%' OR 
       email ILIKE '%guerrillamail%')
);

-- Create updated_at trigger for solicitudes
CREATE TRIGGER update_solicitudes_updated_at
    BEFORE UPDATE ON public.solicitudes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();