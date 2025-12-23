-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'propietario', 'inquilino');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'inquilino',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create leads table
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  nombre TEXT,
  telefono TEXT,
  mensaje TEXT,
  origen TEXT,
  source_tag TEXT,
  service_interest TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  sale_timing TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create Leads table (capital L - used by unified leads hook)
CREATE TABLE public."Leads" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  origen TEXT NOT NULL,
  nombre TEXT,
  apellidos TEXT,
  email TEXT,
  telefono TEXT,
  mensaje TEXT,
  info_adicional TEXT,
  ubicacion TEXT,
  tipo_propiedad TEXT,
  fecha_disponibilidad TEXT,
  m2 NUMERIC,
  habitaciones INTEGER,
  alquiler_deseado NUMERIC,
  acepta_politica BOOLEAN DEFAULT false,
  acepta_comercial BOOLEAN DEFAULT false,
  acepta_cookies BOOLEAN DEFAULT false,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  page_url TEXT,
  referrer TEXT,
  ip TEXT,
  user_agent TEXT,
  payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public."Leads" ENABLE ROW LEVEL SECURITY;

-- Create solicitudes table
CREATE TABLE public.solicitudes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_servicio TEXT,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  direccion TEXT,
  detalles JSONB,
  tipo_propiedad TEXT,
  ubicacion_propiedad TEXT,
  tamano_propiedad TEXT,
  situacion_actual TEXT,
  servicios_interes TEXT[],
  renta_mensual TEXT,
  timeline TEXT,
  info_adicional TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.solicitudes ENABLE ROW LEVEL SECURITY;

-- Create calculadora_resultados table
CREATE TABLE public.calculadora_resultados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_type TEXT NOT NULL,
  inputs JSONB NOT NULL,
  outputs JSONB NOT NULL,
  email TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.calculadora_resultados ENABLE ROW LEVEL SECURITY;

-- Create chat_threads table
CREATE TABLE public.chat_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lease_id UUID,
  property_id UUID,
  status TEXT DEFAULT 'abierto',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;

-- Create chat_messages table
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID REFERENCES public.chat_threads(id) ON DELETE CASCADE NOT NULL,
  sender_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  sender_role TEXT NOT NULL,
  text TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create service_requests table
CREATE TABLE public.service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'inquilino',
  type TEXT NOT NULL,
  date DATE NOT NULL,
  time_slot TEXT,
  hours INTEGER,
  priority TEXT,
  maintenance_category TEXT,
  description TEXT,
  photos JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'pendiente',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- Create chatbot_conversations table
CREATE TABLE public.chatbot_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  context JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.chatbot_conversations ENABLE ROW LEVEL SECURITY;

-- Create chatbot_messages table
CREATE TABLE public.chatbot_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.chatbot_conversations(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.chatbot_messages ENABLE ROW LEVEL SECURITY;

-- Create security_audit_log table
CREATE TABLE public.security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'low',
  details JSONB DEFAULT '{}'::jsonb,
  user_id UUID,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Create ip_rate_limits table
CREATE TABLE public.ip_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  operation_type TEXT NOT NULL,
  attempt_count INTEGER DEFAULT 1,
  blocked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.ip_rate_limits ENABLE ROW LEVEL SECURITY;

-- Security definer function to check if user has a role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::TEXT
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- Function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_event_type TEXT,
  p_details JSONB,
  p_severity TEXT DEFAULT 'low'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.security_audit_log (event_type, details, severity, user_id)
  VALUES (p_event_type, p_details, p_severity, auth.uid())
  RETURNING id INTO new_id;
  RETURN new_id;
END;
$$;

-- Function to detect advanced security threats (placeholder)
CREATE OR REPLACE FUNCTION public.detect_advanced_security_threats()
RETURNS TABLE (
  threat_type TEXT,
  severity TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  details JSONB
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    event_type as threat_type,
    severity,
    created_at,
    details
  FROM public.security_audit_log
  WHERE severity IN ('high', 'critical')
    AND created_at > NOW() - INTERVAL '24 hours'
  ORDER BY created_at DESC
  LIMIT 50
$$;

-- Function to create service request and incident
CREATE OR REPLACE FUNCTION public.create_service_request_and_incident(
  p_type TEXT,
  p_date DATE,
  p_time_slot TEXT DEFAULT NULL,
  p_hours INTEGER DEFAULT NULL,
  p_priority TEXT DEFAULT NULL,
  p_maint_cat TEXT DEFAULT NULL,
  p_description TEXT DEFAULT ''
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.service_requests (
    user_id, type, date, time_slot, hours, priority, maintenance_category, description
  )
  VALUES (
    auth.uid(), p_type, p_date, p_time_slot, p_hours, p_priority, p_maint_cat, p_description
  )
  RETURNING id INTO new_id;
  RETURN new_id;
END;
$$;

-- Handle new user signup - create profile and assign default role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', ''));
  
  -- Assign default role (inquilino - tenant)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'inquilino');
  
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_threads_updated_at
  BEFORE UPDATE ON public.chat_threads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies

-- Profiles: Users can view all profiles, update own
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User roles: Only admins can manage, users can view own
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Leads: Public insert (anonymous), admin view
CREATE POLICY "Anyone can insert leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view leads" ON public.leads FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Leads (capital): Public insert, admin view
CREATE POLICY "Anyone can insert Leads" ON public."Leads" FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view Leads" ON public."Leads" FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Solicitudes: Public insert, admin view
CREATE POLICY "Anyone can insert solicitudes" ON public.solicitudes FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view solicitudes" ON public.solicitudes FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Calculadora: Public insert, admin view
CREATE POLICY "Anyone can insert calculadora_resultados" ON public.calculadora_resultados FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view calculadora_resultados" ON public.calculadora_resultados FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Chat threads: Users manage own
CREATE POLICY "Users can view own chat threads" ON public.chat_threads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own chat threads" ON public.chat_threads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own chat threads" ON public.chat_threads FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all chat threads" ON public.chat_threads FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Chat messages: Users manage messages in own threads
CREATE POLICY "Users can view messages in own threads" ON public.chat_messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.chat_threads WHERE id = thread_id AND user_id = auth.uid()));
CREATE POLICY "Users can insert messages in own threads" ON public.chat_messages FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.chat_threads WHERE id = thread_id AND user_id = auth.uid()));
CREATE POLICY "Admins can manage all chat messages" ON public.chat_messages FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Service requests: Users manage own
CREATE POLICY "Users can view own service requests" ON public.service_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own service requests" ON public.service_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own service requests" ON public.service_requests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all service requests" ON public.service_requests FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Chatbot conversations: Session-based or user-based access
CREATE POLICY "Anyone can insert chatbot conversations" ON public.chatbot_conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own chatbot conversations" ON public.chatbot_conversations FOR SELECT 
  USING (user_id IS NULL OR auth.uid() = user_id);

-- Chatbot messages
CREATE POLICY "Anyone can insert chatbot messages" ON public.chatbot_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view messages in accessible conversations" ON public.chatbot_messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.chatbot_conversations 
    WHERE id = conversation_id AND (user_id IS NULL OR user_id = auth.uid())
  ));

-- Security audit log: Admins only
CREATE POLICY "Admins can view security logs" ON public.security_audit_log FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "System can insert security logs" ON public.security_audit_log FOR INSERT WITH CHECK (true);

-- IP rate limits: Admins only
CREATE POLICY "Admins can view rate limits" ON public.ip_rate_limits FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "System can manage rate limits" ON public.ip_rate_limits FOR ALL USING (true);