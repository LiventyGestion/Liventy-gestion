import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// Brand configuration
const BRAND = {
  name: "Liventy Gestión",
  phone: "944 397 330",
  email: "contacto@liventygestion.com",
  coverage: ["Bizkaia", "Álava", "Gipuzkoa", "Cantabria", "Norte de Burgos"],
  coverageMain: "Bizkaia"
};

// Intent classification
type ChatIntent = "OWNER_PROSPECT" | "TENANT_PROSPECT" | "COMPANY" | "PRICING" | "PROCESS" | "LEGAL_FAQ" | "COVERAGE" | "SUPPORT" | "GREETING" | "OTHER";

serve(async (req) => {
  console.log('🤖 Chatbot AI function called');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    console.log('📩 Request body:', requestBody);
    
    const { message, sessionId, conversationId, intent: providedIntent, userContext } = requestBody;

    if (!message) {
      throw new Error('No message provided');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const n8nWebhookUrl = Deno.env.get('N8N_WEBHOOK_URL');

    console.log('🔑 API Keys check:', {
      openai: !!openAIApiKey,
      supabase: !!supabaseUrl,
      service: !!supabaseServiceKey,
      n8n: !!n8nWebhookUrl
    });

    if (!openAIApiKey) {
      console.error('❌ Missing OpenAI API Key');
      return new Response(JSON.stringify({
        message: getBasicResponse(message),
        conversationId: null,
        intent: 'basic_fallback'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Detect intent
    const detectedIntent = providedIntent || detectIntent(message);
    console.log('🎯 Detected intent:', detectedIntent);

    // Get conversation history if available
    let conversationHistory: any[] = [];
    let conversation: any = null;
    
    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      try {
        if (conversationId) {
          const { data } = await supabase
            .from('chatbot_conversations')
            .select('*')
            .eq('id', conversationId);
          
          if (data && data.length > 0) {
            const conv = data[0];
            if (conv.user_id === null && conv.session_id !== sessionId) {
              console.error('🚨 Security: Unauthorized conversation access');
              throw new Error('Unauthorized access to conversation');
            }
            conversation = conv;
          }
        } else {
          const { data, error } = await supabase
            .from('chatbot_conversations')
            .insert({
              session_id: sessionId || `session_${Date.now()}`,
              context: {
                userType: userContext?.userType || 'general',
                ...userContext
              }
            })
            .select()
            .single();
          
          if (!error) conversation = data;
        }

        if (conversation) {
          const { data: messageHistory } = await supabase
            .from('chatbot_messages')
            .select('*')
            .eq('conversation_id', conversation.id)
            .order('created_at', { ascending: true })
            .limit(10);

          if (messageHistory && messageHistory.length > 0) {
            conversationHistory = messageHistory.map(msg => ({
              role: msg.role === 'user' ? 'user' : 'assistant',
              content: msg.content
            }));
          }
        }
      } catch (dbError) {
        console.error('Database error (non-critical):', dbError);
      }
    }

    console.log('💭 Conversation history length:', conversationHistory.length);
    
    const systemPrompt = buildSystemPrompt(conversation, userContext, detectedIntent);
    
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
          ...conversationHistory,
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

    // Extract lead info from conversation
    const leadInfo = extractLeadInfo(message, botMessage, conversation, userContext);
    const leadScore = calculateLeadScore(conversation, message, leadInfo);
    
    // Save to database
    if (conversation && supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      try {
        // Save messages
        await supabase.from('chatbot_messages').insert([
          {
            conversation_id: conversation.id,
            content: message,
            role: 'user',
            metadata: { intent: detectedIntent, leadInfo }
          },
          {
            conversation_id: conversation.id,
            content: botMessage,
            role: 'assistant',
            metadata: { intent: 'ai_response' }
          }
        ]);

        // Update conversation context
        const updatedContext = {
          ...conversation.context,
          lastMessage: message,
          lastIntent: detectedIntent,
          messageCount: (conversation.context?.messageCount || 0) + 1,
          leadScore,
          ...leadInfo
        };

        await supabase
          .from('chatbot_conversations')
          .update({ context: updatedContext })
          .eq('id', conversation.id);

        // Create lead and send to webhook if qualified and has consent
        if (leadInfo.isQualified && userContext?.consent) {
          const leadData = buildLeadData(conversation, leadInfo, userContext);
          
          // Save to Supabase leads
          await createLead(supabase, leadData);
          
          // Send to n8n webhook if configured
          if (n8nWebhookUrl) {
            await sendToWebhook(n8nWebhookUrl, leadData);
          }
        }

      } catch (dbError) {
        console.error('Database error (non-critical):', dbError);
      }
    }

    // Detect redirection
    const redirectionInfo = detectRedirection(message, detectedIntent);
    
    // Determine if we need consent or should show CTAs
    const requiresConsent = leadInfo.isQualified && !userContext?.consent;
    const showCTAs = ['OWNER_PROSPECT', 'COMPANY'].includes(detectedIntent) || leadScore >= 4;

    return new Response(JSON.stringify({
      message: botMessage,
      conversationId: conversation?.id || conversationId || null,
      redirection: redirectionInfo,
      intent: detectedIntent,
      leadInfo,
      leadScore,
      requiresConsent,
      showCTAs
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 Function error:', error);
    
    let fallbackMessage = "Entiendo tu consulta. Para asistencia inmediata, puedes llamarnos al 944 397 330 o escribirnos por WhatsApp.";
    
    try {
      const body = await req.clone().json();
      fallbackMessage = getBasicResponse(body.message || '');
    } catch {}
    
    return new Response(JSON.stringify({ 
      message: fallbackMessage,
      fallback: true,
      intent: 'error_recovery'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function detectIntent(message: string): ChatIntent {
  const m = message.toLowerCase();
  
  // Owner prospect (priority)
  if (m.includes('propietario') || m.includes('tengo un piso') || m.includes('tengo una casa') || 
      m.includes('mi propiedad') || m.includes('alquilar mi') || m.includes('tengo un local')) {
    return 'OWNER_PROSPECT';
  }
  
  // Tenant prospect
  if (m.includes('inquilino') || m.includes('busco piso') || m.includes('busco casa') || 
      m.includes('alquilar un') || m.includes('necesito piso')) {
    return 'TENANT_PROSPECT';
  }
  
  // Company/Corporate
  if (m.includes('empresa') || m.includes('corporativo') || m.includes('temporal') || 
      m.includes('trabajadores') || m.includes('empleados')) {
    return 'COMPANY';
  }
  
  // Pricing
  if (m.includes('precio') || m.includes('tarifa') || m.includes('coste') || 
      m.includes('cuánto') || m.includes('cuanto cuesta')) {
    return 'PRICING';
  }
  
  // Process
  if (m.includes('cómo') || m.includes('proceso') || m.includes('funciona') || 
      m.includes('trabajáis') || m.includes('pasos')) {
    return 'PROCESS';
  }
  
  // Legal FAQ
  if (m.includes('contrato') || m.includes('legal') || m.includes('ley') || 
      m.includes('derecho') || m.includes('fianza')) {
    return 'LEGAL_FAQ';
  }
  
  // Coverage
  if (m.includes('zona') || m.includes('cobertura') || m.includes('dónde') || 
      m.includes('municipio') || m.includes('bizkaia') || m.includes('bilbao')) {
    return 'COVERAGE';
  }
  
  // Support
  if (m.includes('problema') || m.includes('incidencia') || m.includes('ayuda') || 
      m.includes('urgente') || m.includes('contacto')) {
    return 'SUPPORT';
  }
  
  // Greeting
  if (m.includes('hola') || m.includes('buenos') || m.includes('buenas') || 
      m.includes('hello') || m.includes('hi') || m === '') {
    return 'GREETING';
  }
  
  return 'OTHER';
}

function getBasicResponse(message: string): string {
  const intent = detectIntent(message);
  
  switch (intent) {
    case 'GREETING':
      return `¡Hola! Soy Ana de ${BRAND.name}. Gestiono alquileres en ${BRAND.coverageMain} y provincias limítrofes. ¿En qué puedo ayudarte?`;
    
    case 'OWNER_PROSPECT':
      return "Perfecto, eres propietario. Nuestro proceso:\n• Valoración en 48h\n• Difusión multicanal\n• Firma digital\n• Gestión mensual\n\n¿Te gustaría una valoración gratuita o agendar una llamada?";
    
    case 'TENANT_PROSPECT':
      return "¡Hola! Para alquilar necesitas:\n• Solvencia demostrable\n• DNI/NIE\n• Contrato o justificante de ingresos\n• Últimas nóminas\n\n¿Quieres que te avisemos cuando haya pisos en tu zona?";
    
    case 'PRICING':
      return "Nuestras tarifas:\n• Start: 1 mensualidad + IVA\n• Full: 8% mensual + IVA (mín. 80€)\n• Corporate: 10% mensual\n• Home (larga): 500€ + IVA\n\nNota: seguimiento del cobro ≠ garantía de pago; garantías mediante pólizas externas.";
    
    case 'COVERAGE':
      return `Cubrimos ${BRAND.coverage.join(', ')}. Disponibilidad presencial cuando sea necesario en Bizkaia.`;
    
    case 'PROCESS':
      return "Nuestro proceso:\n1. Valoración inicial (48h)\n2. Preparación y fotos profesionales\n3. Difusión multicanal\n4. Selección rigurosa de inquilinos\n5. Firma digital del contrato\n6. Gestión mensual completa\n\n¿Quieres saber más sobre algún paso?";
    
    default:
      return `Entiendo tu consulta. Para darte la mejor respuesta, ¿podrías contarme más? También puedes llamarnos al ${BRAND.phone}.`;
  }
}

function detectRedirection(message: string, intent: ChatIntent): any {
  const m = message.toLowerCase();
  
  if (m.includes('valorar') || m.includes('tasación') || m.includes('precio de mi')) {
    return {
      intent: 'property_valuation',
      url: '/herramientas?calc=precio',
      explanation: 'Calcula el valor de tu propiedad',
      action: 'redirect'
    };
  }
  
  if (m.includes('simulador') || m.includes('rentabilidad')) {
    return {
      intent: 'rental_simulator', 
      url: '/herramientas?calc=rental',
      explanation: 'Simula tu rentabilidad',
      action: 'redirect'
    };
  }
  
  if (intent === 'OWNER_PROSPECT' && (m.includes('más info') || m.includes('servicios'))) {
    return {
      intent: 'owner_services',
      url: '/propietarios',
      explanation: 'Ver servicios para propietarios',
      action: 'redirect'
    };
  }
  
  if (intent === 'TENANT_PROSPECT') {
    return {
      intent: 'tenant_services',
      url: '/inquilinos',
      explanation: 'Ver información para inquilinos',
      action: 'redirect'
    };
  }
  
  return null;
}

function buildSystemPrompt(conversation: any, userContext: any, intent: ChatIntent): string {
  const userName = userContext?.name || 'usuario';
  const userType = userContext?.userType || 'general';
  const messageCount = conversation?.context?.messageCount || 0;
  const isOutsideHours = userContext?.isOutsideHours || false;
  
  let contextInfo = '';
  if (messageCount > 0) {
    contextInfo = `
CONTEXTO CONVERSACIÓN:
- Usuario: ${userName}
- Tipo: ${userType}
- Mensajes: ${messageCount}
- Intención actual: ${intent}
- Info capturada: ${JSON.stringify(conversation?.context || {})}`;
  }

  const outsideHoursNote = isOutsideHours ? `
NOTA: Estamos fuera de horario laboral. Recoge los datos del usuario y confirma que le contactaremos en <2 horas laborables>.` : '';

  return `Eres Ana, asistente virtual de ${BRAND.name} en ${BRAND.coverageMain}. 
Misión: resolver dudas, reducir fricción y convertir visitas en leads cualificados.
Si no resuelves o el usuario lo pide, agenda una llamada.

ESTILO:
- Claro, cercano y profesional
- Respuestas cortas (máx 3 frases + bullets)
- No prometas rentas ni plazos garantizados; usa estimaciones
- Si escriben en euskera/inglés, responde en ese idioma

CONTACTO:
- Teléfono: ${BRAND.phone}
- Email: ${BRAND.email}

SERVICIOS:
- Gestión integral de alquileres residenciales
- Alquiler de larga duración
- Alquiler de temporada (empresas)
- Selección rigurosa de inquilinos
- Mantenimiento y reparaciones
- Gestión legal y contratos

TARIFAS:
- Start: 1 mensualidad + IVA
- Full: 8% mensual + IVA (mín. 80€)
- Corporate: 10% mensual o por proyecto
- Home (larga): 500€ + IVA
Nota: seguimiento del cobro ≠ garantía de pago; garantías mediante pólizas externas.

COBERTURA: ${BRAND.coverage.join(', ')}. Disponibilidad presencial en Bizkaia.

${contextInfo}
${outsideHoursNote}

FLUJOS:
A) PROPIETARIO (prioridad): Pregunta municipio, m², habitaciones, estado, fecha. Explica proceso. Ofrece valoración gratis y llamada 15'.
B) INQUILINO: Requisitos solvencia + documentación. Ofrece alertas (nombre, email, teléfono, zonas, rango precio).
C) EMPRESA: Fechas, nº personas, ubicación, presupuesto.

ESCALADO (si no resuelves o lo piden):
- Solicita: nombre, teléfono (ES 9 dígitos), email, municipio, franja horaria, canal preferido
- Slots: hoy 17-19h / mañana 10-12h
- Confirma: "Te contactaremos en <2 horas laborables"

DIFERENCIAL: "Selección rigurosa, contratos claros, incidencias trazadas y reporting mensual."

IMPORTANTE:
- NUNCA menciones alquileres turísticos (no los gestionamos)
- Si falta dato clave, propón opciones cerradas
- Mantén continuidad de la conversación`;
}

function extractLeadInfo(userMessage: string, botMessage: string, conversation: any, userContext: any): any {
  const m = userMessage.toLowerCase();
  const leadInfo: any = { ...userContext };
  
  // Extract email
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emailMatch = userMessage.match(emailRegex);
  if (emailMatch) leadInfo.email = emailMatch[0];
  
  // Extract phone
  const phoneRegex = /(?:\+34|0034|34)?[\s\-]?[6-9][\d\s\-]{7,11}/g;
  const phoneMatch = userMessage.match(phoneRegex);
  if (phoneMatch) leadInfo.telefono = phoneMatch[0].replace(/[\s\-]/g, '');
  
  // Extract name (simple heuristic)
  const nameMatch = userMessage.match(/me llamo\s+(\w+)/i) || userMessage.match(/soy\s+(\w+)/i);
  if (nameMatch) leadInfo.nombre = nameMatch[1];
  
  // User type
  if (m.includes('propietario') || m.includes('tengo un piso') || m.includes('mi propiedad')) {
    leadInfo.persona_tipo = 'propietario';
    leadInfo.isQualified = true;
  } else if (m.includes('inquilino') || m.includes('busco piso')) {
    leadInfo.persona_tipo = 'inquilino';
  } else if (m.includes('empresa') || m.includes('corporativo')) {
    leadInfo.persona_tipo = 'empresa';
    leadInfo.isQualified = true;
  }
  
  // Location - Bizkaia
  const bizkaiaLocations = ['bilbao', 'getxo', 'las arenas', 'algorta', 'sopela', 'berango', 
    'barakaldo', 'santurtzi', 'portugalete', 'erandio', 'leioa', 'basauri', 'durango'];
  for (const loc of bizkaiaLocations) {
    if (m.includes(loc)) {
      leadInfo.municipio = loc.charAt(0).toUpperCase() + loc.slice(1);
      leadInfo.inBizkaia = true;
      break;
    }
  }
  
  // Service interest
  if (m.includes('valorar') || m.includes('tasación')) {
    leadInfo.service_interest = 'valoración';
    leadInfo.isQualified = true;
  } else if (m.includes('gestión') || m.includes('alquilar')) {
    leadInfo.service_interest = 'gestión_integral';
    leadInfo.isQualified = true;
  }
  
  // Timing
  if (m.includes('urgente') || m.includes('ya') || m.includes('pronto') || m.includes('esta semana')) {
    leadInfo.timing = 'inmediato';
    leadInfo.availableWithin30Days = true;
  } else if (m.includes('próximo mes') || m.includes('en breve')) {
    leadInfo.timing = 'corto_plazo';
    leadInfo.availableWithin30Days = true;
  }
  
  return leadInfo;
}

function calculateLeadScore(conversation: any, message: string, leadInfo: any): number {
  let score = 0;
  
  // Owner scoring (priority)
  if (leadInfo.persona_tipo === 'propietario') score += 3;
  if (leadInfo.persona_tipo === 'empresa') score += 2;
  
  // Bizkaia location +2
  if (leadInfo.inBizkaia) score += 2;
  
  // Available within 30 days +2
  if (leadInfo.availableWithin30Days) score += 2;
  
  // Full management interest +2
  if (leadInfo.service_interest === 'gestión_integral') score += 2;
  
  // Contact info
  if (leadInfo.email || leadInfo.telefono) score += 1;
  if (leadInfo.email && leadInfo.telefono) score += 1;
  
  // Engagement
  const messageCount = conversation?.context?.messageCount || 0;
  if (messageCount > 3) score += 1;
  
  return Math.min(score, 10);
}

function buildLeadData(conversation: any, leadInfo: any, userContext: any): any {
  return {
    nombre: leadInfo.nombre || conversation?.context?.userName || 'Usuario chatbot',
    email: leadInfo.email || '',
    telefono: leadInfo.telefono || '',
    persona_tipo: leadInfo.persona_tipo || 'general',
    municipio: leadInfo.municipio || '',
    service_interest: leadInfo.service_interest || 'consulta_general',
    comentarios: `Conversación chatbot ID: ${conversation?.id}`,
    utm_source: userContext?.utm_source || 'chatbot',
    utm_medium: userContext?.utm_medium || 'chat',
    utm_campaign: userContext?.utm_campaign || 'ai_assistant',
    page: userContext?.page || '/',
    consent: userContext?.consent || false,
    score: leadInfo.leadScore || 0,
    source_tag: 'chatbot_ai'
  };
}

async function createLead(supabase: any, leadData: any) {
  try {
    const { data, error } = await supabase
      .from('leads')
      .insert({
        nombre: leadData.nombre,
        email: leadData.email,
        telefono: leadData.telefono,
        service_interest: leadData.service_interest,
        source_tag: leadData.source_tag,
        utm_source: leadData.utm_source,
        utm_medium: leadData.utm_medium,
        utm_campaign: leadData.utm_campaign,
        mensaje: leadData.comentarios
      });
      
    if (error) {
      console.error('Error creating lead:', error);
    } else {
      console.log('✅ Lead created successfully');
    }
  } catch (error) {
    console.error('Error in createLead function:', error);
  }
}

async function sendToWebhook(webhookUrl: string, leadData: any) {
  try {
    console.log('📤 Sending to n8n webhook:', webhookUrl);
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData),
    });
    
    if (!response.ok) {
      console.error('❌ Webhook error:', response.status);
      // Fallback: Could send email notification here
    } else {
      console.log('✅ Webhook sent successfully');
    }
  } catch (error) {
    console.error('Error sending to webhook:', error);
    // Fallback: Could send email notification here
  }
}
