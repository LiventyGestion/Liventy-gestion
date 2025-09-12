-- Create unified Leads table with complete structure
CREATE TABLE IF NOT EXISTS public."Leads" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  origen text,                            -- "contacto" | "solicitud" | "guia" | etc.
  nombre text,
  apellidos text,
  email text,
  telefono text,
  mensaje text,
  info_adicional text,
  
  -- Property data (from property forms)
  ubicacion text,
  tipo_propiedad text,
  m2 numeric,
  habitaciones integer,
  alquiler_deseado numeric,
  fecha_disponibilidad date,
  
  -- Consent checkboxes (all boolean)
  acepta_politica boolean DEFAULT false,
  acepta_comercial boolean DEFAULT false,
  acepta_cookies boolean DEFAULT false,
  
  -- Marketing/tracking fields
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  page_url text,
  referrer text,
  ip text,
  user_agent text,
  
  -- Additional fields
  payload jsonb,                           -- raw form data for backup
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public."Leads" ENABLE ROW LEVEL SECURITY;

-- Create INSERT policy for anonymous users (public web forms)
CREATE POLICY "web_anon_insert" ON public."Leads"
FOR INSERT 
TO anon 
WITH CHECK (true);

-- Create SELECT policy for admin users only
CREATE POLICY "admin_select" ON public."Leads"
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_origen ON public."Leads"(origen);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public."Leads"(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public."Leads"(created_at);

-- Grant permissions
GRANT INSERT ON public."Leads" TO anon;
GRANT SELECT ON public."Leads" TO authenticated;