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
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory.slice(-10), // Last 10 messages
          { role: 'user', content: message }
        ],
        max_tokens: 500,
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
    return new Response(JSON.stringify({ 
      error: 'Lo siento, estoy experimentando dificultades técnicas. Un agente especializado de Liventy Gestión se pondrá en contacto contigo pronto.',
      fallback: true
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function buildSystemPrompt(contextData: any[], conversation: any) {
  const companyInfo = contextData.find(c => c.topic === 'company_info')?.context_data;
  const services = contextData.find(c => c.topic === 'services')?.context_data;
  const faqs = contextData.find(c => c.topic === 'faqs')?.context_data;

  return `Eres Ana, la asistente virtual de Liventy Gestión, una empresa especializada en gestión integral de alquileres en Bizkaia, País Vasco.

INFORMACIÓN DE LA EMPRESA:
- Nombre: ${companyInfo?.name || 'Liventy Gestión'}
- Ubicación: ${companyInfo?.location || 'Bizkaia, País Vasco'}
- Servicios: ${companyInfo?.services?.join(', ') || 'gestión integral de alquileres'}
- Público objetivo: propietarios de viviendas en alquiler
- Áreas de cobertura: ${companyInfo?.areas?.join(', ') || 'Bilbao y alrededores'}

SERVICIOS DETALLADOS:
${services ? Object.entries(services).map(([key, value]) => `- ${key}: ${value}`).join('\n') : 'Gestión completa de alquileres'}

CONTEXTO DEL USUARIO:
- Tipo: ${conversation?.user_type || 'desconocido'}
- Nombre: ${conversation?.user_name || 'no proporcionado'}
- Historial de conversación disponible

INSTRUCCIONES IMPORTANTES:
1. NUNCA inventes información sobre precios, tarifas o servicios específicos
2. Si no sabes algo, di claramente: "En este momento no dispongo de esa información. Un agente especializado de Liventy Gestión se pondrá en contacto contigo pronto."
3. Usa un lenguaje profesional, claro y cercano
4. Haz referencias locales a Bizkaia cuando sea relevante (barrios, metro, municipios)
5. NUNCA menciones servicios turísticos o precios por noche
6. Enfócate en propietarios de viviendas residenciales
7. Detecta si el usuario necesita ser redirigido a alguna sección específica
8. Mantén respuestas concisas pero informativas
9. Si detectas que el usuario quiere contratar servicios, recopilar datos o hacer gestiones específicas, indícalo claramente

RESPONDE SIEMPRE en español, de forma profesional y útil.`;
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