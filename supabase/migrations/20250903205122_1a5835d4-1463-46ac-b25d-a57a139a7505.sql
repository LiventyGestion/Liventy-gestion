-- Create chatbot conversation tables for memory and learning

-- Conversations table to group related messages
CREATE TABLE public.chatbot_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT NOT NULL,
  user_type TEXT CHECK (user_type IN ('propietario', 'inquilino', 'general')),
  user_name TEXT,
  user_phone TEXT,
  user_email TEXT,
  context JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Individual messages within conversations
CREATE TABLE public.chatbot_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.chatbot_conversations(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_bot BOOLEAN NOT NULL DEFAULT false,
  intent TEXT,
  sentiment TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Context and knowledge base for continuous learning
CREATE TABLE public.chatbot_context (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic TEXT NOT NULL,
  context_data JSONB NOT NULL,
  frequency_used INTEGER DEFAULT 1,
  effectiveness_score DECIMAL(3,2) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.chatbot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_context ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations
CREATE POLICY "Users can view their own conversations" 
ON public.chatbot_conversations 
FOR SELECT 
USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Anyone can create conversations" 
ON public.chatbot_conversations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own conversations" 
ON public.chatbot_conversations 
FOR UPDATE 
USING (user_id = auth.uid() OR user_id IS NULL);

-- RLS Policies for messages
CREATE POLICY "Users can view messages from their conversations" 
ON public.chatbot_messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.chatbot_conversations 
    WHERE id = conversation_id 
    AND (user_id = auth.uid() OR user_id IS NULL)
  )
);

CREATE POLICY "Anyone can create messages" 
ON public.chatbot_messages 
FOR INSERT 
WITH CHECK (true);

-- RLS Policies for context (publicly readable for bot learning)
CREATE POLICY "Everyone can read context" 
ON public.chatbot_context 
FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated users can create context" 
ON public.chatbot_context 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update context" 
ON public.chatbot_context 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Create indexes for better performance
CREATE INDEX idx_chatbot_conversations_session_id ON public.chatbot_conversations(session_id);
CREATE INDEX idx_chatbot_conversations_user_id ON public.chatbot_conversations(user_id);
CREATE INDEX idx_chatbot_messages_conversation_id ON public.chatbot_messages(conversation_id);
CREATE INDEX idx_chatbot_messages_created_at ON public.chatbot_messages(created_at);
CREATE INDEX idx_chatbot_context_topic ON public.chatbot_context(topic);

-- Create triggers for updated_at
CREATE TRIGGER update_chatbot_conversations_updated_at
BEFORE UPDATE ON public.chatbot_conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chatbot_context_updated_at
BEFORE UPDATE ON public.chatbot_context
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial context data for Liventy Gestión
INSERT INTO public.chatbot_context (topic, context_data) VALUES
('company_info', '{
  "name": "Liventy Gestión",
  "location": "Bizkaia, País Vasco",
  "services": ["gestión integral de alquileres", "selección de inquilinos", "mantenimiento", "gestión legal", "cobros garantizados"],
  "target": "propietarios de viviendas en alquiler",
  "areas": ["Bilbao", "Getxo", "Las Arenas", "Algorta", "Sopela", "Berango", "Urduliz", "Mungia", "Metro Bilbao"]
}'),
('services', '{
  "gestion_integral": "Nos encargamos de todo: búsqueda de inquilinos, gestión de contratos, cobros, mantenimiento y incidencias",
  "seleccion_inquilinos": "Verificación rigurosa: ingresos, referencias laborales, historial crediticio y garantías",
  "mantenimiento": "Red de profesionales de confianza para resolver incidencias rápidamente",
  "gestion_legal": "Contratos, inventarios, fianzas y documentación oficial digitalizada",
  "cobros_garantizados": "Garantizamos el pago puntual y optimizamos la rentabilidad"
}'),
('faqs', '{
  "rentabilidad": "Optimizamos precios de mercado y garantizamos cobros puntuales",
  "inquilinos": "Selección rigurosa con verificación completa de solvencia",
  "mantenimiento": "Gestión completa con red de profesionales de confianza",
  "legal": "Gestión integral de contratos y documentación oficial",
  "tarifas": "Tarifas transparentes y competitivas según necesidades"
}'),
('redirections', '{
  "valorar_piso": "/herramientas?calc=precio",
  "propietario_contact": "/contacto?tipo=propietario", 
  "empresa_contact": "/contacto?tipo=empresa",
  "area_clientes": "/area-clientes/login",
  "incidencias": "/area-clientes/login",
  "simulador": "/herramientas?calc=rental"
}');