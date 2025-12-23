-- Create enums for the new Leads schema
CREATE TYPE public.lead_source AS ENUM ('contact_form', 'owners_form', 'tenants_form', 'chatbot');
CREATE TYPE public.persona_tipo AS ENUM ('propietario', 'inquilino', 'empresa');
CREATE TYPE public.estado_vivienda AS ENUM ('Reformado', 'Buen estado', 'A actualizar', 'Obra nueva');
CREATE TYPE public.canal_preferido AS ENUM ('llamada', 'whatsapp', 'email');
CREATE TYPE public.lead_status AS ENUM ('new', 'qualified', 'contacted', 'scheduled', 'closed');

-- Drop the old Leads table and recreate with new schema
-- First backup data if needed, then drop
DROP TABLE IF EXISTS public."Leads";

-- Create new unified Leads table with exact order specified
CREATE TABLE public."Leads" (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  source lead_source NOT NULL,
  page TEXT,
  persona_tipo persona_tipo,
  nombre TEXT,
  telefono TEXT,
  email TEXT,
  municipio TEXT,
  barrio TEXT,
  m2 NUMERIC,
  habitaciones INTEGER,
  estado_vivienda estado_vivienda,
  fecha_disponible DATE,
  presupuesto_renta NUMERIC,
  canal_preferido canal_preferido,
  franja_horaria TEXT,
  comentarios TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  consent BOOLEAN DEFAULT false,
  status lead_status NOT NULL DEFAULT 'new'
);

-- Enable RLS
ALTER TABLE public."Leads" ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Admins can view all Leads"
ON public."Leads"
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can insert Leads"
ON public."Leads"
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can update Leads"
ON public."Leads"
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for common queries
CREATE INDEX idx_leads_status ON public."Leads"(status);
CREATE INDEX idx_leads_source ON public."Leads"(source);
CREATE INDEX idx_leads_created_at ON public."Leads"(created_at DESC);