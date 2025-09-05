-- Crear tabla para solicitudes de servicios
CREATE TABLE public.service_requests (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('inquilino', 'propietario')),
    type TEXT NOT NULL CHECK (type IN ('limpieza', 'mantenimiento')),
    date DATE NOT NULL,
    time_slot TEXT,
    hours INTEGER,
    priority TEXT CHECK (priority IN ('baja', 'media', 'alta')),
    maintenance_category TEXT CHECK (maintenance_category IN ('albanileria', 'pintura', 'fontaneria', 'grifos', 'banos', 'cisternas', 'bajantes', 'atascos', 'cocinas', 'persianas', 'calefaccion', 'electricidad')),
    description TEXT,
    photos TEXT[],
    status TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'confirmado', 'en_proceso', 'completado', 'cancelado')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- Crear políticas para service_requests
CREATE POLICY "Users can view their own service requests" 
ON public.service_requests 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own service requests" 
ON public.service_requests 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own service requests" 
ON public.service_requests 
FOR UPDATE 
USING (user_id = auth.uid());

-- Crear tabla para hilos de chat
CREATE TABLE public.chat_threads (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    lease_id UUID,
    property_id UUID,
    title TEXT,
    status TEXT NOT NULL DEFAULT 'abierto' CHECK (status IN ('abierto', 'en_seguimiento', 'resuelto')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para chat_threads
ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;

-- Crear políticas para chat_threads
CREATE POLICY "Users can view their own chat threads" 
ON public.chat_threads 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own chat threads" 
ON public.chat_threads 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own chat threads" 
ON public.chat_threads 
FOR UPDATE 
USING (user_id = auth.uid());

-- Crear tabla para mensajes de chat
CREATE TABLE public.chat_messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    thread_id UUID NOT NULL REFERENCES public.chat_threads(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'agent')),
    message TEXT NOT NULL,
    attachments TEXT[],
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para chat_messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Crear políticas para chat_messages
CREATE POLICY "Users can view messages from their threads" 
ON public.chat_messages 
FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.chat_threads 
    WHERE chat_threads.id = chat_messages.thread_id 
    AND chat_threads.user_id = auth.uid()
));

CREATE POLICY "Users can create messages in their threads" 
ON public.chat_messages 
FOR INSERT 
WITH CHECK (EXISTS (
    SELECT 1 FROM public.chat_threads 
    WHERE chat_threads.id = chat_messages.thread_id 
    AND chat_threads.user_id = auth.uid()
));

-- Agregar columna service_request_id a Incidencias para enlazar con servicios de mantenimiento
ALTER TABLE public."Incidencias" ADD COLUMN service_request_id UUID REFERENCES public.service_requests(id);

-- Crear triggers para actualizar timestamps
CREATE TRIGGER update_service_requests_updated_at
    BEFORE UPDATE ON public.service_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_threads_updated_at
    BEFORE UPDATE ON public.chat_threads
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();