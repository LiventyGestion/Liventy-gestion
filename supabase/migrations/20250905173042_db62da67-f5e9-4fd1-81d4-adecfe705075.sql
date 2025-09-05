-- =============== TIPOS ===============
CREATE TYPE public.priority_level AS ENUM ('baja','media','alta');
CREATE TYPE public.maintenance_category AS ENUM (
  'albanileria','pintura','fontaneria','grifos','banos','cisternas','bajantes','atascos',
  'cocinas','persianas','calefaccion','electricidad_general'
);
CREATE TYPE public.thread_status AS ENUM ('abierto','en_seguimiento','resuelto');
CREATE TYPE public.incident_status AS ENUM ('pendiente','en_curso','resuelta','cancelada');

-- =============== PROFILES ===============
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT CHECK (role IN ('inquilino','propietario','admin')) DEFAULT 'inquilino',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Migrar solo usuarios que existen en auth.users
INSERT INTO public.profiles (id, full_name, role, created_at)
SELECT u.id, u.nombre, u.rol, now()
FROM public."Usuarios" u
INNER JOIN auth.users au ON u.id = au.id
ON CONFLICT (id) DO NOTHING;

-- =============== SERVICE_REQUESTS ===============
-- Eliminar tabla anterior si existe
DROP TABLE IF EXISTS public.service_requests CASCADE;

CREATE TABLE public.service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('inquilino','propietario')) NOT NULL,
  type TEXT CHECK (type IN ('limpieza','mantenimiento')) NOT NULL,
  date DATE NOT NULL,
  time_slot TEXT,
  hours INT CHECK (hours > 0) DEFAULT 1,
  priority priority_level,
  maintenance_category maintenance_category,
  description TEXT,
  photos JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'pendiente',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============== CHAT TABLES ===============
-- Eliminar tablas anteriores de chat si existen
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.chat_threads CASCADE;

CREATE TABLE public.chat_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lease_id UUID,
  property_id UUID,
  status thread_status DEFAULT 'abierto',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.chat_threads(id) ON DELETE CASCADE,
  sender_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  sender_role TEXT,
  text TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============== AVAILABILITY ===============
CREATE TABLE public.availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type TEXT CHECK (service_type IN ('limpieza','mantenimiento')) NOT NULL,
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============== ACTUALIZAR INCIDENCIAS ===============
ALTER TABLE public."Incidencias" 
ADD COLUMN IF NOT EXISTS service_request_id UUID REFERENCES public.service_requests(id);

-- =============== ÍNDICES ===============
CREATE INDEX IF NOT EXISTS idx_service_requests_user ON public.service_requests(user_id, type, date);
CREATE INDEX IF NOT EXISTS idx_incidents_sr ON public."Incidencias"(service_request_id);
CREATE INDEX IF NOT EXISTS idx_chat_threads_user ON public.chat_threads(user_id, status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_thread ON public.chat_messages(thread_id, created_at);
CREATE INDEX IF NOT EXISTS idx_availability_date ON public.availability(date, service_type);