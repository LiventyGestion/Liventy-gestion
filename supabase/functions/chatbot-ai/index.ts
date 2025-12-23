import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.0";
import { Resend } from "npm:resend@2.0.0";

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
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const n8nWebhookUrl = Deno.env.get('N8N_WEBHOOK_URL');

    console.log('🔑 API Keys check:', {
      openai: !!openAIApiKey,
      supabase: !!supabaseUrl,
      service: !!supabaseServiceKey,
      resend: !!resendApiKey,
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

        // Create lead and send email if qualified AND has consent
        if (leadInfo.isQualified && userContext?.consent === true) {
          const leadData = buildLeadData(conversation, leadInfo, userContext);
          
          // Save to unified Leads table
          const leadId = await createLead(supabase, leadData);
          
          // Send notification email
          if (resendApiKey && leadId) {
            await sendLeadNotificationEmail(resendApiKey, leadData, leadId);
          }
          
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

FLUJOS DE CAPTURA DE DATOS:

A) PROPIETARIO (prioridad alta):
   Datos a capturar en orden:
   1. municipio (dónde está la vivienda)
   2. m2 (superficie en metros cuadrados)
   3. habitaciones (número)
   4. estado_vivienda (Reformado / Buen estado / A actualizar / Obra nueva)
   5. fecha_disponible (cuándo estará disponible)
   6. nombre, telefono, email (datos de contacto)
   7. consent (confirmar aceptación de política de privacidad)
   
   Explica proceso y ofrece valoración gratuita.

B) INQUILINO:
   Datos a capturar en orden:
   1. municipio (zona donde busca)
   2. barrio (opcional, más específico)
   3. habitaciones (número que necesita)
   4. presupuesto_renta (rango de precio mensual)
   5. nombre, telefono, email (datos de contacto)
   6. consent (confirmar aceptación de política de privacidad)
   
   Explica requisitos de solvencia y ofrece alertas de viviendas.

C) EMPRESA:
   Datos: municipio, fechas, nº personas, presupuesto, nombre, telefono, email, consent.

IMPORTANTE SOBRE CONSENTIMIENTO:
- Antes de guardar datos, SIEMPRE pregunta si acepta la política de privacidad
- Sin consentimiento explícito ("sí acepto", "de acuerdo", "acepto"), NO se guardan datos

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
  const leadInfo: any = { ...conversation?.context, ...userContext };
  
  // Extract email
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emailMatch = userMessage.match(emailRegex);
  if (emailMatch) leadInfo.email = emailMatch[0].toLowerCase();
  
  // Extract phone (Spanish format)
  const phoneRegex = /(?:\+34|0034|34)?[\s\-]?[6-9][\d\s\-]{7,11}/g;
  const phoneMatch = userMessage.match(phoneRegex);
  if (phoneMatch) {
    leadInfo.telefono = phoneMatch[0].replace(/[\s\-\+]/g, '').replace(/^(34|0034)/, '');
  }
  
  // Extract name
  const nameMatch = userMessage.match(/me llamo\s+(\w+)/i) || 
                    userMessage.match(/soy\s+(\w+)/i) ||
                    userMessage.match(/mi nombre es\s+(\w+)/i);
  if (nameMatch) leadInfo.nombre = nameMatch[1];
  
  // User type detection
  if (m.includes('propietario') || m.includes('tengo un piso') || m.includes('mi propiedad') || m.includes('tengo una casa') || m.includes('mi vivienda')) {
    leadInfo.persona_tipo = 'propietario';
    leadInfo.isQualified = true;
  } else if (m.includes('inquilino') || m.includes('busco piso') || m.includes('busco casa') || m.includes('alquilar un')) {
    leadInfo.persona_tipo = 'inquilino';
  } else if (m.includes('empresa') || m.includes('corporativo') || m.includes('trabajadores')) {
    leadInfo.persona_tipo = 'empresa';
    leadInfo.isQualified = true;
  }
  
  // Location - Bizkaia municipalities
  const bizkaiaLocations = ['bilbao', 'getxo', 'las arenas', 'algorta', 'sopela', 'berango', 
    'barakaldo', 'santurtzi', 'portugalete', 'erandio', 'leioa', 'basauri', 'durango',
    'galdakao', 'amorebieta', 'gernika', 'bermeo', 'mungia', 'derio', 'loiu', 'sondika'];
  for (const loc of bizkaiaLocations) {
    if (m.includes(loc)) {
      leadInfo.municipio = loc.charAt(0).toUpperCase() + loc.slice(1);
      leadInfo.inBizkaia = true;
      break;
    }
  }
  
  // Extract barrio
  const barrioMatch = m.match(/barrio\s+(?:de\s+)?(\w+)/i) || m.match(/en\s+(deusto|san ignacio|indautxu|abando|santutxu|rekalde|basurto|zorroza|otxarkoaga|txurdinaga)/i);
  if (barrioMatch) leadInfo.barrio = barrioMatch[1].charAt(0).toUpperCase() + barrioMatch[1].slice(1);
  
  // Extract m2
  const m2Match = userMessage.match(/(\d+)\s*(?:m2|m²|metros)/i);
  if (m2Match) leadInfo.m2 = parseInt(m2Match[1]);
  
  // Extract habitaciones
  const habMatch = userMessage.match(/(\d+)\s*(?:habitacion|dormitorio|cuarto)/i);
  if (habMatch) leadInfo.habitaciones = parseInt(habMatch[1]);
  
  // Extract presupuesto_renta
  const rentaMatch = userMessage.match(/(\d+)\s*(?:€|euros?|eur)/i) || 
                     userMessage.match(/presupuesto\s*(?:de\s*)?(\d+)/i) ||
                     userMessage.match(/hasta\s*(\d+)/i);
  if (rentaMatch) leadInfo.presupuesto_renta = parseInt(rentaMatch[1]);
  
  // Extract estado_vivienda
  if (m.includes('reformad')) leadInfo.estado_vivienda = 'Reformado';
  else if (m.includes('buen estado')) leadInfo.estado_vivienda = 'Buen estado';
  else if (m.includes('actualizar') || m.includes('reformar')) leadInfo.estado_vivienda = 'A actualizar';
  else if (m.includes('obra nueva') || m.includes('nuevo')) leadInfo.estado_vivienda = 'Obra nueva';
  
  // Extract fecha_disponible
  const fechaMatch = userMessage.match(/disponible\s+(?:desde\s+|a partir de\s+)?(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i) ||
                     userMessage.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/);
  if (fechaMatch) {
    // Convert to YYYY-MM-DD format
    const parts = fechaMatch[1].split(/[\/\-]/);
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[2].length === 2 ? '20' + parts[2] : parts[2];
      leadInfo.fecha_disponible = `${year}-${month}-${day}`;
    }
  }
  
  // Check for consent
  if (m.includes('acepto') || m.includes('de acuerdo') || m.includes('sí, acepto') || m.includes('conforme')) {
    leadInfo.consentGiven = true;
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
  
  // Check if we have enough data to qualify as lead
  const hasContact = leadInfo.email || leadInfo.telefono;
  const hasLocation = leadInfo.municipio;
  if (hasContact && hasLocation && leadInfo.persona_tipo) {
    leadInfo.isQualified = true;
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
  
  // Property details
  if (leadInfo.m2) score += 1;
  if (leadInfo.habitaciones) score += 1;
  
  // Engagement
  const messageCount = conversation?.context?.messageCount || 0;
  if (messageCount > 3) score += 1;
  
  return Math.min(score, 10);
}

function buildLeadData(conversation: any, leadInfo: any, userContext: any): any {
  // Map persona_tipo to valid enum value
  let personaTipo: 'propietario' | 'inquilino' | 'empresa' | null = null;
  if (leadInfo.persona_tipo === 'propietario') personaTipo = 'propietario';
  else if (leadInfo.persona_tipo === 'inquilino') personaTipo = 'inquilino';
  else if (leadInfo.persona_tipo === 'empresa') personaTipo = 'empresa';
  
  // Map canal_preferido to valid enum value
  let canalPreferido: 'llamada' | 'whatsapp' | 'email' | null = null;
  if (leadInfo.canal_preferido === 'llamada') canalPreferido = 'llamada';
  else if (leadInfo.canal_preferido === 'whatsapp') canalPreferido = 'whatsapp';
  else if (leadInfo.canal_preferido === 'email') canalPreferido = 'email';
  
  // Map estado_vivienda to valid enum value
  let estadoVivienda: 'Reformado' | 'Buen estado' | 'A actualizar' | 'Obra nueva' | null = null;
  if (leadInfo.estado_vivienda === 'Reformado') estadoVivienda = 'Reformado';
  else if (leadInfo.estado_vivienda === 'Buen estado') estadoVivienda = 'Buen estado';
  else if (leadInfo.estado_vivienda === 'A actualizar') estadoVivienda = 'A actualizar';
  else if (leadInfo.estado_vivienda === 'Obra nueva') estadoVivienda = 'Obra nueva';
  
  // Build lead data in EXACT order matching schema
  return {
    // 1. source (required)
    source: 'chatbot' as const,
    
    // 2. page (current page)
    page: userContext?.page || '/',
    
    // 3. persona_tipo (based on flow)
    persona_tipo: personaTipo,
    
    // 4. Contact info
    nombre: leadInfo.nombre?.trim() || null,
    telefono: leadInfo.telefono?.replace(/[\s\-\+\(\)]/g, '').replace(/^(34|0034)/, '') || null,
    email: leadInfo.email?.trim().toLowerCase() || null,
    
    // 5. Location
    municipio: leadInfo.municipio?.trim() || null,
    barrio: leadInfo.barrio?.trim() || null,
    
    // 6. Property data
    m2: leadInfo.m2 ? Number(leadInfo.m2) : null,
    habitaciones: leadInfo.habitaciones ? Number(leadInfo.habitaciones) : null,
    estado_vivienda: estadoVivienda,
    fecha_disponible: leadInfo.fecha_disponible || null,
    presupuesto_renta: leadInfo.presupuesto_renta ? Number(leadInfo.presupuesto_renta) : null,
    
    // 7. Contact preferences
    canal_preferido: canalPreferido,
    franja_horaria: leadInfo.franja_horaria || null,
    
    // 8. Comments
    comentarios: `Chatbot conversation ID: ${conversation?.id}. Score: ${leadInfo.leadScore || 0}. Interés: ${leadInfo.service_interest || 'consulta general'}`,
    
    // 9. UTM tracking
    utm_source: userContext?.utm_source || 'chatbot',
    utm_medium: userContext?.utm_medium || 'chat',
    utm_campaign: userContext?.utm_campaign || 'ai_assistant',
    
    // 10. Consent (REQUIRED - only save if true)
    consent: true,
    
    // 11. Status (defaults to 'new')
    status: 'new'
  };
}

async function createLead(supabase: any, leadData: any): Promise<string | null> {
  try {
    // CRITICAL: Only save if consent is true
    if (leadData.consent !== true) {
      console.log('⚠️ Lead not saved: consent not given');
      return null;
    }
    
    const { data, error } = await supabase
      .from('Leads')
      .insert(leadData)
      .select('id')
      .single();
      
    if (error) {
      console.error('❌ Error creating lead:', error);
      return null;
    }
    
    console.log('✅ Lead created successfully in unified Leads table:', data?.id);
    return data?.id || null;
  } catch (error) {
    console.error('Error in createLead function:', error);
    return null;
  }
}

async function sendLeadNotificationEmail(resendApiKey: string, leadData: any, leadId: string): Promise<void> {
  try {
    const resend = new Resend(resendApiKey);
    
    // Build subject: [Chatbot] {persona_tipo} — {municipio} — {nombre}
    const personaTipoLabel = leadData.persona_tipo 
      ? leadData.persona_tipo.charAt(0).toUpperCase() + leadData.persona_tipo.slice(1)
      : 'Contacto';
    const municipio = leadData.municipio || 'Sin ubicación';
    const nombre = leadData.nombre || 'Sin nombre';
    
    const subject = `[Chatbot] ${personaTipoLabel} — ${municipio} — ${nombre}`;
    
    const adminLink = `https://liventygestion.com/admin/leads`;
    
    const currentTime = new Date().toLocaleString('es-ES', {
      timeZone: 'Europe/Madrid',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">🤖 Nuevo Lead desde Chatbot</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 18px;">${personaTipoLabel}</p>
        </div>
        
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 0 0 8px 8px;">
          
          <h2 style="color: #7C3AED; margin-top: 0; border-bottom: 2px solid #7C3AED; padding-bottom: 8px;">📞 Datos de contacto</h2>
          <table style="width: 100%; margin-bottom: 20px;">
            <tr><td style="padding: 8px 0; font-weight: bold; width: 140px;">Nombre:</td><td style="padding: 8px 0;">${leadData.nombre || '-'}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Teléfono:</td><td style="padding: 8px 0;">${leadData.telefono ? `<a href="tel:${leadData.telefono}" style="color: #7C3AED;">${leadData.telefono}</a>` : '-'}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td style="padding: 8px 0;">${leadData.email ? `<a href="mailto:${leadData.email}" style="color: #7C3AED;">${leadData.email}</a>` : '-'}</td></tr>
          </table>

          <h2 style="color: #7C3AED; border-bottom: 2px solid #7C3AED; padding-bottom: 8px;">🏠 Datos del inmueble</h2>
          <table style="width: 100%; margin-bottom: 20px;">
            <tr><td style="padding: 8px 0; font-weight: bold; width: 140px;">Municipio:</td><td style="padding: 8px 0;">${leadData.municipio || '-'}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Barrio:</td><td style="padding: 8px 0;">${leadData.barrio || '-'}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Superficie:</td><td style="padding: 8px 0;">${leadData.m2 ? `${leadData.m2} m²` : '-'}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Habitaciones:</td><td style="padding: 8px 0;">${leadData.habitaciones || '-'}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Estado:</td><td style="padding: 8px 0;">${leadData.estado_vivienda || '-'}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Disponible:</td><td style="padding: 8px 0;">${leadData.fecha_disponible || '-'}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Presupuesto:</td><td style="padding: 8px 0;">${leadData.presupuesto_renta ? `${leadData.presupuesto_renta} €/mes` : '-'}</td></tr>
          </table>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${adminLink}" style="display: inline-block; background: #7C3AED; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
              📋 Ver ficha del lead
            </a>
          </div>

          <div style="background: #f1f5f9; padding: 15px; border-radius: 6px; font-size: 12px; color: #64748b;">
            <p style="margin: 4px 0;"><strong>Fecha:</strong> ${currentTime}</p>
            <p style="margin: 4px 0;"><strong>Página origen:</strong> ${leadData.page}</p>
            <p style="margin: 4px 0;"><strong>Lead ID:</strong> ${leadId}</p>
          </div>
        </div>
      </div>
    `;

    console.log('📤 Sending chatbot lead notification email');
    
    await resend.emails.send({
      from: "Liventy Gestión <contacto@liventygestion.com>",
      to: ["contacto@liventygestion.com"],
      replyTo: leadData.email || undefined,
      subject: subject,
      html: htmlBody
    });

    console.log("✅ Chatbot lead notification email sent");
  } catch (error) {
    console.error('❌ Error sending lead notification email:', error);
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
    } else {
      console.log('✅ Webhook sent successfully');
    }
  } catch (error) {
    console.error('Error sending to webhook:', error);
  }
}
