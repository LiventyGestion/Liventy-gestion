-- =============== HABILITAR RLS ===============
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Incidencias" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;

-- =============== POLÍTICAS PARA PROFILES ===============
DROP POLICY IF EXISTS p_profiles_self_select ON public.profiles;
CREATE POLICY p_profiles_self_select ON public.profiles
FOR SELECT USING ( 
  id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin') 
);

DROP POLICY IF EXISTS p_profiles_self_update ON public.profiles;
CREATE POLICY p_profiles_self_update ON public.profiles
FOR UPDATE USING ( id = auth.uid() );

DROP POLICY IF EXISTS p_profiles_admin_all ON public.profiles;
CREATE POLICY p_profiles_admin_all ON public.profiles
FOR ALL USING ( 
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin') 
);

-- =============== POLÍTICAS PARA SERVICE_REQUESTS ===============
DROP POLICY IF EXISTS p_sr_select ON public.service_requests;
CREATE POLICY p_sr_select ON public.service_requests
FOR SELECT USING ( 
  user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role='admin') 
);

DROP POLICY IF EXISTS p_sr_insert ON public.service_requests;
CREATE POLICY p_sr_insert ON public.service_requests
FOR INSERT WITH CHECK ( user_id = auth.uid() );

DROP POLICY IF EXISTS p_sr_update ON public.service_requests;
CREATE POLICY p_sr_update ON public.service_requests
FOR UPDATE USING ( 
  user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role='admin') 
);

-- =============== POLÍTICAS PARA INCIDENCIAS ===============
DROP POLICY IF EXISTS p_incidents_select_by_sr ON public."Incidencias";
CREATE POLICY p_incidents_select_by_sr ON public."Incidencias"
FOR SELECT USING (
  -- Puede ver si es propietario de la propiedad relacionada
  EXISTS (
    SELECT 1 FROM public."Propiedades" prop 
    WHERE prop.id = "Incidencias".propiedad_id 
    AND prop.usuario_id = auth.uid()
  ) OR
  -- O si la incidencia viene de una service request propia
  EXISTS (
    SELECT 1 FROM public.service_requests sr
    WHERE sr.id = "Incidencias".service_request_id
    AND sr.user_id = auth.uid()
  ) OR
  -- O si es admin
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role='admin')
);

-- Permitir inserción solo a propietarios de la propiedad o admins
DROP POLICY IF EXISTS p_incidents_insert ON public."Incidencias";
CREATE POLICY p_incidents_insert ON public."Incidencias"
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public."Propiedades" prop 
    WHERE prop.id = "Incidencias".propiedad_id 
    AND prop.usuario_id = auth.uid()
  ) OR
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role='admin')
);

-- =============== POLÍTICAS PARA CHAT_THREADS ===============
DROP POLICY IF EXISTS p_threads_select ON public.chat_threads;
CREATE POLICY p_threads_select ON public.chat_threads
FOR SELECT USING ( 
  user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role='admin') 
);

DROP POLICY IF EXISTS p_threads_insert ON public.chat_threads;
CREATE POLICY p_threads_insert ON public.chat_threads
FOR INSERT WITH CHECK ( user_id = auth.uid() );

DROP POLICY IF EXISTS p_threads_update ON public.chat_threads;
CREATE POLICY p_threads_update ON public.chat_threads
FOR UPDATE USING ( 
  user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role='admin') 
);

-- =============== POLÍTICAS PARA CHAT_MESSAGES ===============
DROP POLICY IF EXISTS p_msgs_select ON public.chat_messages;
CREATE POLICY p_msgs_select ON public.chat_messages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.chat_threads t
    WHERE t.id = chat_messages.thread_id
    AND (t.user_id = auth.uid() OR 
         EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role='admin'))
  )
);

DROP POLICY IF EXISTS p_msgs_insert ON public.chat_messages;
CREATE POLICY p_msgs_insert ON public.chat_messages
FOR INSERT WITH CHECK (
  -- Mensaje del propio usuario en su hilo
  (sender_user_id = auth.uid() AND 
   EXISTS (SELECT 1 FROM public.chat_threads t 
           WHERE t.id = thread_id AND t.user_id = auth.uid())) OR
  -- O mensajes creados por el backend con service_role
  auth.role() = 'service_role'
);

-- =============== POLÍTICAS PARA AVAILABILITY ===============
DROP POLICY IF EXISTS p_avail_select ON public.availability;
CREATE POLICY p_avail_select ON public.availability
FOR SELECT USING ( auth.uid() IS NOT NULL );

DROP POLICY IF EXISTS p_avail_upd_admin ON public.availability;
CREATE POLICY p_avail_upd_admin ON public.availability
FOR ALL USING ( 
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role='admin') 
);