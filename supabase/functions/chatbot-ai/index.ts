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
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `Eres Ana, la asistente virtual de Liventy Gestión en Bizkaia. Eres amigable, profesional y experta en gestión de alquileres.

EMPRESA: Liventy Gestión - Gestión integral de alquileres en Bilbao y alrededores.

SERVICIOS:
- Gestión completa de alquileres residenciales
- Selección rigurosa de inquilinos 
- Mantenimiento y reparaciones
- Gestión legal y contratos
- Cobros garantizados

INSTRUCCIONES:
- NO repitas saludos si ya estás en una conversación
- Responde consultas sobre gestión de alquileres de forma directa
- Haz referencias a Bilbao, Getxo, Las Arenas cuando sea apropiado
- Si no sabes algo específico, di que te conectarás con un especialista
- NUNCA menciones alquileres turísticos
- Mantén un tono conversacional y profesional
- Da respuestas concisas y útiles

Responde siempre en español.` 
          },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
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

    // Try to save to database if possible
    if (supabaseUrl && supabaseServiceKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        
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

        if (conversation) {
          // Save messages
          await supabase.from('chatbot_messages').insert([
            {
              conversation_id: conversation.id,
              message,
              is_bot: false,
              intent: detectIntent(message)
            },
            {
              conversation_id: conversation.id,
              message: botMessage,
              is_bot: true,
              intent: 'ai_response'
            }
          ]);
        }
      } catch (dbError) {
        console.error('Database error (non-critical):', dbError);
      }
    }

    // Detect redirection
    const redirectionInfo = detectRedirection(message);

    return new Response(JSON.stringify({
      message: botMessage,
      conversationId: conversationId || null,
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