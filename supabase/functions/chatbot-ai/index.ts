import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, sessionId, conversationId, userContext } = await req.json();

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!openAIApiKey || !supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get or create conversation
    let conversation;
    if (conversationId) {
      const { data } = await supabase
        .from('chatbot_conversations')
        .select('*')
        .eq('id', conversationId)
        .single();
      conversation = data;
    } else {
      const { data, error } = await supabase
        .from('chatbot_conversations')
        .insert({
          session_id: sessionId,
          user_type: userContext?.userType || 'general',
          user_name: userContext?.name,
          user_phone: userContext?.phone,
          user_email: userContext?.email,
          context: userContext || {}
        })
        .select()
        .single();
      
      if (error) throw error;
      conversation = data;
    }

    // Save user message
    await supabase
      .from('chatbot_messages')
      .insert({
        conversation_id: conversation.id,
        message,
        is_bot: false,
        intent: detectIntent(message),
        metadata: { timestamp: new Date().toISOString() }
      });

    // Get conversation history
    const { data: messageHistory } = await supabase
      .from('chatbot_messages')
      .select('*')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true })
      .limit(20);

    // Get context knowledge
    const { data: contextData } = await supabase
      .from('chatbot_context')
      .select('*');

    // Build system prompt with Liventy context
    const systemPrompt = buildSystemPrompt(contextData, conversation);

    // Build conversation history for OpenAI
    const conversationHistory = messageHistory?.map(msg => ({
      role: msg.is_bot ? 'assistant' : 'user',
      content: msg.message
    })) || [];

    // Detect redirection intent
    const redirectionInfo = detectRedirection(message, contextData);

    // Call OpenAI API
    console.log('Calling OpenAI with message:', message);
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory.slice(-10), // Last 10 messages
          { role: 'user', content: message }
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const aiResponse = await response.json();
    let botMessage = aiResponse.choices[0].message.content;

    // Add redirection info if detected
    if (redirectionInfo) {
      botMessage += `\n\n${redirectionInfo.explanation}`;
    }

    // Save bot response
    const { data: savedMessage, error: saveError } = await supabase
      .from('chatbot_messages')
      .insert({
        conversation_id: conversation.id,
        message: botMessage,
        is_bot: true,
        intent: redirectionInfo?.intent || 'general',
        metadata: { 
          timestamp: new Date().toISOString(),
          redirection: redirectionInfo
        }
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving bot message:', saveError);
    }

    // Update conversation context
    await supabase
      .from('chatbot_conversations')
      .update({
        context: {
          ...conversation.context,
          lastInteraction: new Date().toISOString(),
          messageCount: (conversation.context?.messageCount || 0) + 1
        }
      })
      .eq('id', conversation.id);

    return new Response(JSON.stringify({
      message: botMessage,
      conversationId: conversation.id,
      redirection: redirectionInfo,
      intent: detectIntent(message)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chatbot-ai function:', error);
    
    // Better error handling - try to give more specific responses
    let errorMessage = "Para esa información específica, te conectaré con uno de nuestros especialistas que te podrá dar todos los detalles.";
    
    if (error.message.includes('OpenAI')) {
      console.error('OpenAI API Error:', error);
      errorMessage = "Disculpa, déjame conectar con nuestro sistema de información para darte una respuesta más precisa. Mientras tanto, ¿hay algo específico sobre gestión de alquileres que te gustaría saber?";
    } else if (error.message.includes('Supabase')) {
      console.error('Database Error:', error);
      errorMessage = "Hay un pequeño retraso en nuestro sistema. ¿Podrías repetirme tu consulta en un momento? Mientras tanto, puedo ayudarte con información general sobre nuestros servicios.";
    }
    
    return new Response(JSON.stringify({ 
      message: errorMessage,
      fallback: true,
      intent: 'error_recovery'
    }), {
      status: 200, // Return 200 so frontend handles it as a normal response
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function buildSystemPrompt(contextData: any[], conversation: any) {
  const companyInfo = contextData.find(c => c.topic === 'company_info')?.context_data;
  const services = contextData.find(c => c.topic === 'services')?.context_data;
  const faqs = contextData.find(c => c.topic === 'faqs')?.context_data;

  return `Eres Ana, la asistente virtual de Liventy Gestión. Eres amigable, profesional y muy conocedora del negocio inmobiliario en Bizkaia.

INFORMACIÓN DE LA EMPRESA:
- Nombre: ${companyInfo?.name || 'Liventy Gestión'}
- Ubicación: ${companyInfo?.location || 'Bizkaia, País Vasco'}
- Servicios: ${companyInfo?.services?.join(', ') || 'gestión integral de alquileres'}
- Público objetivo: propietarios de viviendas en alquiler
- Áreas de cobertura: ${companyInfo?.areas?.join(', ') || 'Bilbao y alrededores'}

SERVICIOS DETALLADOS:
${services ? Object.entries(services).map(([key, value]) => `- ${key}: ${value}`).join('\n') : 'Gestión completa de alquileres'}

PREGUNTAS FRECUENTES QUE PUEDES RESPONDER:
${faqs ? Object.entries(faqs).map(([key, value]) => `- ${key}: ${value}`).join('\n') : 'Información general disponible'}

CONTEXTO DEL USUARIO ACTUAL:
- Tipo: ${conversation?.user_type || 'visitante web'}
- Nombre: ${conversation?.user_name || 'no proporcionado'}
- Mensajes en conversación: ${conversation?.context?.messageCount || 0}

PERSONALIDAD Y ESTILO:
- Mantén un tono profesional pero cálido y cercano
- Responde como si fueras un experto inmobiliario local
- Usa saludos naturales y muestra interés genuino
- Haz preguntas de seguimiento cuando sea apropiado
- Menciona barrios y zonas de Bilbao cuando sea relevante (Casco Viejo, Abando, Las Arenas, Getxo, etc.)

CAPACIDADES:
- Responder dudas sobre gestión de alquileres
- Explicar nuestros servicios en detalle
- Orientar sobre valoración de propiedades
- Ayudar con el proceso de contratación
- Derivar a secciones específicas de la web
- Agendar citas y contactos

REGLAS IMPORTANTES:
1. NUNCA inventes precios, tarifas específicas o datos exactos que no tengas
2. Si no sabes algo específico, di: "Para esa información específica, te conectaré con uno de nuestros especialistas que te podrá dar todos los detalles"
3. Mantén conversaciones naturales - no seas robótico
4. NUNCA menciones alquileres turísticos o vacacionales
5. Enfócate en alquileres residenciales de larga duración
6. Si detectas intención de redirigir, hazlo de forma natural

EJEMPLOS DE RESPUESTAS NATURALES:
- Para saludo: "¡Hola! Soy Ana de Liventy Gestión. Me alegra conocerte. ¿En qué puedo ayudarte hoy?"
- Para dudas: "Te entiendo perfectamente. Es una pregunta muy común entre propietarios en Bilbao..."
- Para derivación: "Te voy a conectar con nuestro especialista que te podrá dar toda la información detallada..."

Responde siempre en español, de forma natural y conversacional.`;
}

function detectIntent(message: string): string {
  const messageLower = message.toLowerCase();
  
  if (messageLower.includes('valorar') || messageLower.includes('precio') || messageLower.includes('cuánto vale')) {
    return 'property_valuation';
  }
  if (messageLower.includes('propietario') || messageLower.includes('tengo un piso') || messageLower.includes('alquilar mi')) {
    return 'owner_inquiry';
  }
  if (messageLower.includes('inquilino') || messageLower.includes('busco piso')) {
    return 'tenant_inquiry';
  }
  if (messageLower.includes('contacto') || messageLower.includes('llamar') || messageLower.includes('email')) {
    return 'contact_request';
  }
  if (messageLower.includes('cita') || messageLower.includes('reunión') || messageLower.includes('agendar')) {
    return 'appointment_request';
  }
  if (messageLower.includes('incidencia') || messageLower.includes('problema') || messageLower.includes('reparación')) {
    return 'incident_report';
  }
  if (messageLower.includes('área cliente') || messageLower.includes('login') || messageLower.includes('entrar')) {
    return 'client_area_access';
  }
  if (messageLower.includes('empresa') || messageLower.includes('corporativo')) {
    return 'business_inquiry';
  }
  
  return 'general';
}

function detectRedirection(message: string, contextData: any[]): any {
  const redirections = contextData.find(c => c.topic === 'redirections')?.context_data;
  const messageLower = message.toLowerCase();
  
  if (messageLower.includes('valorar') || messageLower.includes('precio') || messageLower.includes('cuánto vale')) {
    return {
      intent: 'property_valuation',
      url: redirections?.valorar_piso || '/herramientas?calc=precio',
      explanation: '💡 Puedes usar nuestra herramienta de valoración automática aquí: /herramientas?calc=precio',
      action: 'redirect'
    };
  }
  
  if (messageLower.includes('simulador') || messageLower.includes('calcular rentabilidad')) {
    return {
      intent: 'rental_simulator',
      url: redirections?.simulador || '/herramientas?calc=rental',
      explanation: '📊 Usa nuestro simulador de rentabilidad: /herramientas?calc=rental',
      action: 'redirect'
    };
  }
  
  if (messageLower.includes('propietario') && (messageLower.includes('contacto') || messageLower.includes('información'))) {
    return {
      intent: 'owner_contact',
      url: redirections?.propietario_contact || '/contacto?tipo=propietario',
      explanation: '📞 Formulario de contacto para propietarios: /contacto?tipo=propietario',
      action: 'redirect'
    };
  }
  
  if (messageLower.includes('empresa') || messageLower.includes('corporativo')) {
    return {
      intent: 'business_contact',
      url: redirections?.empresa_contact || '/contacto?tipo=empresa',
      explanation: '🏢 Contacto empresarial: /contacto?tipo=empresa',
      action: 'redirect'
    };
  }
  
  if (messageLower.includes('área') && messageLower.includes('cliente') || messageLower.includes('login') || messageLower.includes('acceso')) {
    return {
      intent: 'client_area',
      url: redirections?.area_clientes || '/area-clientes/login',
      explanation: '🔐 Área de clientes: /area-clientes/login',
      action: 'redirect'
    };
  }
  
  if (messageLower.includes('incidencia') || messageLower.includes('problema técnico')) {
    return {
      intent: 'incident_report',
      url: redirections?.incidencias || '/area-clientes/login',
      explanation: '⚠️ Para reportar incidencias, accede al área de clientes: /area-clientes/login',
      action: 'redirect'
    };
  }
  
  return null;
}