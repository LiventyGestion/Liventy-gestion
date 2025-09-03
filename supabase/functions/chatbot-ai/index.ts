import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('🤖 Chatbot AI function called');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    console.log('📩 Request body:', requestBody);
    
    const { message, sessionId, conversationId, userContext } = requestBody;

    if (!message) {
      throw new Error('No message provided');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    console.log('🔑 API Keys check:', {
      openai: !!openAIApiKey,
      supabase: !!supabaseUrl,
      service: !!supabaseServiceKey
    });

    if (!openAIApiKey) {
      console.error('❌ Missing OpenAI API Key');
      // Return a basic response without AI
      return new Response(JSON.stringify({
        message: getBasicResponse(message),
        conversationId: null,
        intent: 'basic_fallback'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Try OpenAI call
    console.log('🧠 Calling OpenAI...');
    
    // Get conversation history if available
    let conversationHistory = [];
    let conversation = null;
    
    if (supabaseUrl && supabaseServiceKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        
        // Get or create conversation
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
              session_id: sessionId || `session_${Date.now()}`,
              user_type: userContext?.userType || 'general',
              user_name: userContext?.name,
              user_phone: userContext?.phone,
              user_email: userContext?.email,
              context: userContext || {}
            })
            .select()
            .single();
          
          if (!error) conversation = data;
        }

        // Get conversation history
        if (conversation) {
          const { data: messageHistory } = await supabase
            .from('chatbot_messages')
            .select('*')
            .eq('conversation_id', conversation.id)
            .order('created_at', { ascending: true })
            .limit(10); // Last 10 messages

          if (messageHistory && messageHistory.length > 0) {
            conversationHistory = messageHistory.map(msg => ({
              role: msg.is_bot ? 'assistant' : 'user',
              content: msg.message
            }));
          }
        }
      } catch (dbError) {
        console.error('Database error (non-critical):', dbError);
      }
    }

    console.log('💭 Conversation history length:', conversationHistory.length);
    
    const systemPrompt = buildSystemPrompt(conversation, userContext);
    
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
          ...conversationHistory, // Include conversation history
          { role: 'user', content: message }
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    console.log('📡 OpenAI Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI Error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log('✅ OpenAI Success');
    
    const botMessage = aiResponse.choices[0].message.content;

    // Save to database and update conversation
    if (conversation && supabaseUrl && supabaseServiceKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        
        // Extract lead information from message
        const leadInfo = extractLeadInfo(message, botMessage, conversation);
        
        // Save messages
        await supabase.from('chatbot_messages').insert([
          {
            conversation_id: conversation.id,
            message,
            is_bot: false,
            intent: detectIntent(message),
            metadata: { leadInfo }
          },
          {
            conversation_id: conversation.id,
            message: botMessage,
            is_bot: true,
            intent: 'ai_response'
          }
        ]);

        // Update conversation context with new information
        const updatedContext = {
          ...conversation.context,
          lastMessage: message,
          lastIntent: detectIntent(message),
          messageCount: (conversation.context?.messageCount || 0) + 1,
          leadScore: calculateLeadScore(conversation, message),
          ...leadInfo
        };

        await supabase
          .from('chatbot_conversations')
          .update({ 
            context: updatedContext,
            user_type: leadInfo.userType || conversation.user_type,
            user_name: leadInfo.name || conversation.user_name,
            user_phone: leadInfo.phone || conversation.user_phone,
            user_email: leadInfo.email || conversation.user_email
          })
          .eq('id', conversation.id);

        // Create lead if qualified
        if (leadInfo.isQualified) {
          await createLead(supabase, conversation, leadInfo);
        }

      } catch (dbError) {
        console.error('Database error (non-critical):', dbError);
      }
    }

    // Detect redirection
    const redirectionInfo = detectRedirection(message);

    return new Response(JSON.stringify({
      message: botMessage,
      conversationId: conversation?.id || conversationId || null,
      redirection: redirectionInfo,
      intent: detectIntent(message)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 Function error:', error);
    
    // Always return a helpful response
    return new Response(JSON.stringify({ 
      message: getBasicResponse(await req.json().then(body => body.message).catch(() => 'hola')),
      fallback: true,
      intent: 'error_recovery'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getBasicResponse(message: string): string {
  const messageLower = message.toLowerCase();
  
  if (messageLower.includes('hola') || messageLower.includes('hello') || messageLower === '') {
    return "Soy Ana de Liventy Gestión. Me alegra saludarte. Nos especializamos en gestión integral de alquileres en Bilbao y alrededores. ¿En qué puedo ayudarte hoy?";
  }
  
  if (messageLower.includes('propietario') || messageLower.includes('tengo un piso') || messageLower.includes('alquilar mi')) {
    return "Perfecto, eres propietario. En Liventy Gestión nos encargamos de todo: desde encontrar inquilinos de calidad hasta gestionar cobros y mantenimiento. ¿Te gustaría saber más sobre nuestros servicios?";
  }
  
  if (messageLower.includes('precio') || messageLower.includes('valorar') || messageLower.includes('cuánto vale')) {
    return "Te ayudo con la valoración. Tenemos herramientas para calcular el valor de tu propiedad en el mercado actual de Bilbao. ¿Te gustaría hacer una valoración inicial?";
  }
  
  if (messageLower.includes('contacto') || messageLower.includes('teléfono') || messageLower.includes('email')) {
    return "Te ayudo con el contacto. Puedes llamarnos, escribirnos por WhatsApp o rellenar nuestro formulario web. ¿Qué prefieres?";
  }
  
  return "Entiendo tu consulta. En Liventy Gestión somos especialistas en gestión de alquileres en Bizkaia. Para darte la mejor respuesta, ¿podrías contarme un poco más sobre lo que necesitas?";
}

function detectIntent(message: string): string {
  const messageLower = message.toLowerCase();
  
  if (messageLower.includes('valorar') || messageLower.includes('precio')) return 'property_valuation';
  if (messageLower.includes('propietario')) return 'owner_inquiry';
  if (messageLower.includes('inquilino')) return 'tenant_inquiry';
  if (messageLower.includes('contacto')) return 'contact_request';
  if (messageLower.includes('hola') || messageLower.includes('hello')) return 'greeting';
  
  return 'general';
}

function detectRedirection(message: string): any {
  const messageLower = message.toLowerCase();
  
  if (messageLower.includes('valorar') || messageLower.includes('precio')) {
    return {
      intent: 'property_valuation',
      url: '/herramientas?calc=precio',
      explanation: '💡 Puedes usar nuestra herramienta de valoración automática',
      action: 'redirect'
    };
  }
  
  if (messageLower.includes('simulador')) {
    return {
      intent: 'rental_simulator', 
      url: '/herramientas?calc=rental',
      explanation: '📊 Usa nuestro simulador de rentabilidad',
      action: 'redirect'
    };
  }
  
  if (messageLower.includes('contacto')) {
    return {
      intent: 'contact',
      url: '/contacto?tipo=propietario',
      explanation: '📞 Formulario de contacto',
      action: 'redirect'
    };
  }
  
  return null;
}

function buildSystemPrompt(conversation: any, userContext: any): string {
  const userName = conversation?.user_name || userContext?.name || 'usuario';
  const userType = conversation?.user_type || userContext?.userType || 'general';
  const messageCount = conversation?.context?.messageCount || 0;
  const leadScore = conversation?.context?.leadScore || 0;
  const lastIntent = conversation?.context?.lastIntent || 'unknown';
  
  let contextInfo = '';
  if (messageCount > 0) {
    contextInfo = `
CONTEXTO DE LA CONVERSACIÓN:
- Usuario: ${userName}
- Tipo: ${userType} 
- Mensajes intercambiados: ${messageCount}
- Intención anterior: ${lastIntent}
- Puntuación de lead: ${leadScore}/10
- Información capturada: ${JSON.stringify(conversation?.context || {})}`;
  }

  return `Eres Ana, la asistente virtual de Liventy Gestión en Bizkaia. Eres amigable, profesional y experta en gestión de alquileres.

EMPRESA: Liventy Gestión - Gestión integral de alquileres en Bilbao y alrededores.

SERVICIOS:
- Gestión completa de alquileres residenciales
- Selección rigurosa de inquilinos 
- Mantenimiento y reparaciones
- Gestión legal y contratos
- Cobros garantizados

${contextInfo}

INSTRUCCIONES DE MEMORIA Y CONTINUIDAD:
- RECUERDA toda la información anterior de la conversación
- Haz referencia a lo que ya has hablado con el usuario
- Continúa el hilo de la conversación de forma natural
- Si el usuario te ha dado información personal, úsala apropiadamente
- Construye sobre las respuestas anteriores

CAPTURA DE INFORMACIÓN PARA LEADS:
- Identifica si es propietario, inquilino o empresa
- Obtén nombre, teléfono, email cuando sea natural
- Detecta ubicación de la propiedad (barrio, municipio)
- Identifica el tipo de servicio que necesita
- Evalúa nivel de interés e intención de compra

INSTRUCCIONES GENERALES:
- NO repitas saludos si ya estás en una conversación
- Responde de forma directa y conversacional
- Haz referencias a Bilbao, Getxo, Las Arenas cuando sea apropiado
- Si no sabes algo específico, di que te conectarás con un especialista
- NUNCA menciones alquileres turísticos
- Mantén un tono conversacional y profesional

Responde siempre en español manteniendo la continuidad de la conversación.`;
}

function extractLeadInfo(userMessage: string, botMessage: string, conversation: any): any {
  const messageLower = userMessage.toLowerCase();
  const leadInfo: any = {};
  
  // Extract contact information
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  const phoneRegex = /(\+34|0034|34)?[\s\-]?[6789]\d{8}/g;
  
  const emailMatch = userMessage.match(emailRegex);
  const phoneMatch = userMessage.match(phoneRegex);
  
  if (emailMatch) leadInfo.email = emailMatch[0];
  if (phoneMatch) leadInfo.phone = phoneMatch[0];
  
  // Extract user type
  if (messageLower.includes('propietario') || messageLower.includes('tengo un piso') || messageLower.includes('mi propiedad')) {
    leadInfo.userType = 'propietario';
    leadInfo.isQualified = true;
  } else if (messageLower.includes('inquilino') || messageLower.includes('busco piso')) {
    leadInfo.userType = 'inquilino';
  } else if (messageLower.includes('empresa') || messageLower.includes('corporativo')) {
    leadInfo.userType = 'empresa';
    leadInfo.isQualified = true;
  }
  
  // Extract location information
  const locations = ['bilbao', 'getxo', 'las arenas', 'algorta', 'sopela', 'berango', 'urduliz', 'mungia', 'barakaldo', 'santurtzi'];
  for (const location of locations) {
    if (messageLower.includes(location)) {
      leadInfo.location = location;
      break;
    }
  }
  
  // Extract service interest
  if (messageLower.includes('valorar') || messageLower.includes('tasación')) {
    leadInfo.serviceInterest = 'valoración';
    leadInfo.isQualified = true;
  } else if (messageLower.includes('gestión') || messageLower.includes('alquilar')) {
    leadInfo.serviceInterest = 'gestión_integral';
    leadInfo.isQualified = true;
  } else if (messageLower.includes('mantenimiento') || messageLower.includes('reparaciones')) {
    leadInfo.serviceInterest = 'mantenimiento';
  }
  
  // Extract timing
  if (messageLower.includes('urgente') || messageLower.includes('pronto') || messageLower.includes('ya')) {
    leadInfo.timing = 'inmediato';
    leadInfo.isQualified = true;
  } else if (messageLower.includes('próximo mes') || messageLower.includes('en breve')) {
    leadInfo.timing = 'corto_plazo';
  }
  
  return leadInfo;
}

function calculateLeadScore(conversation: any, message: string): number {
  let score = 0;
  const messageLower = message.toLowerCase();
  const context = conversation?.context || {};
  
  // User type scoring
  if (context.userType === 'propietario') score += 3;
  if (context.userType === 'empresa') score += 2;
  
  // Contact info provided
  if (context.email || context.phone) score += 2;
  if (context.email && context.phone) score += 1;
  
  // Service interest
  if (context.serviceInterest === 'gestión_integral') score += 3;
  if (context.serviceInterest === 'valoración') score += 2;
  
  // Engagement level
  const messageCount = context.messageCount || 0;
  if (messageCount > 3) score += 1;
  if (messageCount > 5) score += 1;
  
  // Urgency indicators
  if (messageLower.includes('urgente') || messageLower.includes('pronto')) score += 1;
  if (context.timing === 'inmediato') score += 2;
  
  // Location in service area
  if (context.location) score += 1;
  
  return Math.min(score, 10); // Cap at 10
}

async function createLead(supabase: any, conversation: any, leadInfo: any) {
  try {
    const leadData = {
      name: conversation.user_name || leadInfo.name || 'Usuario desde chatbot',
      email: conversation.user_email || leadInfo.email || '',
      phone: conversation.user_phone || leadInfo.phone || '',
      service_interest: leadInfo.serviceInterest || 'consulta_general',
      source_tag: 'chatbot_ai',
      utm_source: 'chatbot',
      utm_medium: 'chat',
      utm_campaign: 'ai_assistant',
      utm_content: conversation.user_type || 'general'
    };
    
    const { data, error } = await supabase
      .from('leads')
      .insert(leadData);
      
    if (error) {
      console.error('Error creating lead:', error);
    } else {
      console.log('✅ Lead created successfully');
    }
  } catch (error) {
    console.error('Error in createLead function:', error);
  }
}