-- =============== HABILITAR RLS ===============
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;

-- =============== POLÍTICAS PROFILES ===============
DROP POLICY IF EXISTS p_profiles_self_select ON public.profiles;
CREATE POLICY p_profiles_self_select ON public.profiles
FOR SELECT USING ( 
    id = auth.uid() 
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin') 
);

DROP POLICY IF EXISTS p_profiles_self_update ON public.profiles;
CREATE POLICY p_profiles_self_update ON public.profiles
FOR UPDATE USING ( id = auth.uid() );

DROP POLICY IF EXISTS p_profiles_admin_all ON public.profiles;
CREATE POLICY p_profiles_admin_all ON public.profiles
FOR ALL USING ( 
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin') 
);

-- =============== POLÍTICAS SERVICE_REQUESTS ===============
DROP POLICY IF EXISTS p_sr_select ON public.service_requests;
CREATE POLICY p_sr_select ON public.service_requests
FOR SELECT USING ( 
    user_id = auth.uid() 
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin') 
);

DROP POLICY IF EXISTS p_sr_insert ON public.service_requests;
CREATE POLICY p_sr_insert ON public.service_requests
FOR INSERT WITH CHECK ( user_id = auth.uid() );

DROP POLICY IF EXISTS p_sr_update ON public.service_requests;
CREATE POLICY p_sr_update ON public.service_requests
FOR UPDATE USING ( 
    user_id = auth.uid() 
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin') 
);

-- =============== POLÍTICAS CHAT_THREADS ===============
DROP POLICY IF EXISTS p_threads_select ON public.chat_threads;
CREATE POLICY p_threads_select ON public.chat_threads
FOR SELECT USING ( 
    user_id = auth.uid() 
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin') 
);

DROP POLICY IF EXISTS p_threads_insert ON public.chat_threads;
CREATE POLICY p_threads_insert ON public.chat_threads
FOR INSERT WITH CHECK ( user_id = auth.uid() );

DROP POLICY IF EXISTS p_threads_update ON public.chat_threads;
CREATE POLICY p_threads_update ON public.chat_threads
FOR UPDATE USING ( 
    user_id = auth.uid() 
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin') 
);

-- =============== POLÍTICAS CHAT_MESSAGES ===============
DROP POLICY IF EXISTS p_msgs_select ON public.chat_messages;
CREATE POLICY p_msgs_select ON public.chat_messages
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.chat_threads t
        WHERE t.id = chat_messages.thread_id
        AND (
            t.user_id = auth.uid()
            OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
        )
    )
);

DROP POLICY IF EXISTS p_msgs_insert ON public.chat_messages;
CREATE POLICY p_msgs_insert ON public.chat_messages
FOR INSERT WITH CHECK (
    -- Mensaje del propio usuario en su hilo
    (sender_user_id = auth.uid() AND EXISTS (
        SELECT 1 FROM public.chat_threads t 
        WHERE t.id = thread_id AND t.user_id = auth.uid()
    ))
    -- o mensajes creados por el backend con service_role
    OR auth.role() = 'service_role'
);

-- =============== POLÍTICAS AVAILABILITY ===============
DROP POLICY IF EXISTS p_avail_select ON public.availability;
CREATE POLICY p_avail_select ON public.availability
FOR SELECT USING ( auth.uid() IS NOT NULL );

DROP POLICY IF EXISTS p_avail_upd_admin ON public.availability;
CREATE POLICY p_avail_upd_admin ON public.availability
FOR ALL USING ( 
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin') 
);

-- =============== TRIGGER PARA AUTO-CREAR PROFILE ===============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
        COALESCE(NEW.raw_user_meta_data ->> 'role', 'inquilino')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Crear trigger si no existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();