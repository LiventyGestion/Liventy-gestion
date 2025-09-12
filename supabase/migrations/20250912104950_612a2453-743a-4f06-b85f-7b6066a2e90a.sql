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
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS origen TEXT DEFAULT 'contacto',
ADD COLUMN IF NOT EXISTS nombre TEXT,
ADD COLUMN IF NOT EXISTS telefono TEXT,
ADD COLUMN IF NOT EXISTS mensaje TEXT;

-- Enable RLS on both tables
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitudes ENABLE ROW LEVEL SECURITY;

-- Create INSERT policies for anonymous users
CREATE POLICY IF NOT EXISTS "solicitudes_anonymous_insert" 
ON public.solicitudes 
FOR INSERT 
WITH CHECK (true);

-- Update leads insert policy to allow anonymous access
DROP POLICY IF EXISTS "Enhanced secure lead creation" ON public.leads;

CREATE POLICY "leads_anonymous_insert_v2" 
ON public.leads 
FOR INSERT 
WITH CHECK (
  -- Validate email format and basic data
  (email IS NOT NULL) AND 
  (validate_lead_email(email) = true) AND
  (length(email) >= 5) AND 
  (length(email) <= 100) AND
  ((nombre IS NULL) OR (length(nombre) >= 2 AND length(nombre) <= 100)) AND
  ((telefono IS NULL) OR (length(telefono) >= 9 AND length(telefono) <= 20)) AND
  (length(COALESCE(origen, '')) <= 50) AND
  -- Basic spam protection
  (NOT (email ~~* '%+%+%' OR email ~~* '%test%test%' OR 
        COALESCE(nombre, '') ~~* '%test%' OR COALESCE(nombre, '') ~~* '%spam%' OR 
        COALESCE(nombre, '') ~~* '%bot%' OR email ~~* '%disposable%' OR 
        email ~~* '%temp%mail%' OR email ~~* '%10minutemail%' OR 
        email ~~* '%guerrillamail%'))
);

-- Create updated_at trigger for solicitudes
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER IF NOT EXISTS update_solicitudes_updated_at
    BEFORE UPDATE ON public.solicitudes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();