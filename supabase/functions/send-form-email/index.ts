import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";

// Enhanced security headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
};

interface LeadEmailRequest {
  formType: string;
  leadId?: string;
  source?: string;
  persona_tipo?: string;
  nombre?: string;
  telefono?: string;
  email?: string;
  municipio?: string;
  barrio?: string;
  m2?: number;
  habitaciones?: number;
  estado_vivienda?: string;
  fecha_disponible?: string;
  presupuesto_renta?: number;
  canal_preferido?: string;
  franja_horaria?: string;
  comentarios?: string;
  page?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  // Legacy fields for backward compatibility
  fullName?: string;
  apellidos?: string;
  phone?: string;
  message?: string;
  [key: string]: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('📧 Form email request received');
    
    const data: LeadEmailRequest = await req.json();
    console.log('📋 Form data:', { formType: data.formType, email: data.email });

    // Handle lead notification format
    if (data.formType === 'lead_notification') {
      return await handleLeadNotification(data);
    }
    
    // Handle legacy form format for backward compatibility
    return await handleLegacyForm(data);

  } catch (error: any) {
    console.error("❌ Error in send-form-email function:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

async function handleLeadNotification(data: LeadEmailRequest): Promise<Response> {
  const {
    leadId,
    persona_tipo,
    nombre,
    telefono,
    email,
    municipio,
    barrio,
    m2,
    habitaciones,
    estado_vivienda,
    fecha_disponible,
    presupuesto_renta,
    canal_preferido,
    franja_horaria,
    comentarios,
    page,
    source,
    utm_source,
    utm_medium,
    utm_campaign
  } = data;

  // Build subject: [Lead {persona_tipo}] {municipio} — {nombre} {telefono}
  const personaTipoLabel = getPersonaTipoLabel(persona_tipo);
  const municipioText = municipio || 'Sin ubicación';
  const nombreText = nombre || 'Sin nombre';
  const telefonoText = telefono || '';
  
  const subject = `[Lead ${personaTipoLabel}] ${municipioText} — ${nombreText} ${telefonoText}`.trim();

  // Build admin panel link
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
      <div style="background: linear-gradient(135deg, #E67E0F 0%, #F59E0B 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">🎯 Nuevo Lead</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 18px;">${personaTipoLabel}</p>
      </div>
      
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 0 0 8px 8px;">
        
        <!-- Datos de contacto -->
        <h2 style="color: #E67E0F; margin-top: 0; border-bottom: 2px solid #E67E0F; padding-bottom: 8px;">📞 Datos de contacto</h2>
        <table style="width: 100%; margin-bottom: 20px;">
          <tr><td style="padding: 8px 0; font-weight: bold; width: 140px;">Nombre:</td><td style="padding: 8px 0;">${nombre || '-'}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Teléfono:</td><td style="padding: 8px 0;">${telefono ? `<a href="tel:${telefono}" style="color: #E67E0F;">${telefono}</a>` : '-'}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td style="padding: 8px 0;">${email ? `<a href="mailto:${email}" style="color: #E67E0F;">${email}</a>` : '-'}</td></tr>
          ${canal_preferido ? `<tr><td style="padding: 8px 0; font-weight: bold;">Canal preferido:</td><td style="padding: 8px 0;">${canal_preferido}</td></tr>` : ''}
          ${franja_horaria ? `<tr><td style="padding: 8px 0; font-weight: bold;">Franja horaria:</td><td style="padding: 8px 0;">${franja_horaria}</td></tr>` : ''}
        </table>

        <!-- Datos del inmueble -->
        <h2 style="color: #E67E0F; border-bottom: 2px solid #E67E0F; padding-bottom: 8px;">🏠 Datos del inmueble</h2>
        <table style="width: 100%; margin-bottom: 20px;">
          <tr><td style="padding: 8px 0; font-weight: bold; width: 140px;">Municipio:</td><td style="padding: 8px 0;">${municipio || '-'}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Barrio:</td><td style="padding: 8px 0;">${barrio || '-'}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Superficie:</td><td style="padding: 8px 0;">${m2 ? `${m2} m²` : '-'}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Habitaciones:</td><td style="padding: 8px 0;">${habitaciones || '-'}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Estado:</td><td style="padding: 8px 0;">${estado_vivienda || '-'}</td></tr>
          ${fecha_disponible ? `<tr><td style="padding: 8px 0; font-weight: bold;">Disponible:</td><td style="padding: 8px 0;">${fecha_disponible}</td></tr>` : ''}
          ${presupuesto_renta ? `<tr><td style="padding: 8px 0; font-weight: bold;">Renta estimada:</td><td style="padding: 8px 0;">${presupuesto_renta} €/mes</td></tr>` : ''}
        </table>

        ${comentarios ? `
        <!-- Comentarios -->
        <h2 style="color: #E67E0F; border-bottom: 2px solid #E67E0F; padding-bottom: 8px;">💬 Comentarios</h2>
        <div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #E67E0F;">
          <p style="margin: 0; white-space: pre-wrap;">${comentarios}</p>
        </div>
        ` : ''}

        <!-- CTA Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="${adminLink}" style="display: inline-block; background: #E67E0F; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
            📋 Ver ficha del lead
          </a>
        </div>

        <!-- Metadata -->
        <div style="background: #f1f5f9; padding: 15px; border-radius: 6px; font-size: 12px; color: #64748b;">
          <p style="margin: 4px 0;"><strong>Fecha:</strong> ${currentTime}</p>
          <p style="margin: 4px 0;"><strong>Página origen:</strong> ${page || 'No especificada'}</p>
          <p style="margin: 4px 0;"><strong>Fuente:</strong> ${source || 'No especificada'}</p>
          ${utm_source ? `<p style="margin: 4px 0;"><strong>UTM Source:</strong> ${utm_source}</p>` : ''}
          ${utm_medium ? `<p style="margin: 4px 0;"><strong>UTM Medium:</strong> ${utm_medium}</p>` : ''}
          ${utm_campaign ? `<p style="margin: 4px 0;"><strong>UTM Campaign:</strong> ${utm_campaign}</p>` : ''}
          ${leadId ? `<p style="margin: 4px 0;"><strong>Lead ID:</strong> ${leadId}</p>` : ''}
        </div>
      </div>
    </div>
  `;

  const textBody = `
NUEVO LEAD - ${personaTipoLabel}
================================

DATOS DE CONTACTO:
- Nombre: ${nombre || '-'}
- Teléfono: ${telefono || '-'}
- Email: ${email || '-'}
${canal_preferido ? `- Canal preferido: ${canal_preferido}` : ''}
${franja_horaria ? `- Franja horaria: ${franja_horaria}` : ''}

DATOS DEL INMUEBLE:
- Municipio: ${municipio || '-'}
- Barrio: ${barrio || '-'}
- Superficie: ${m2 ? `${m2} m²` : '-'}
- Habitaciones: ${habitaciones || '-'}
- Estado: ${estado_vivienda || '-'}
${fecha_disponible ? `- Disponible: ${fecha_disponible}` : ''}
${presupuesto_renta ? `- Renta estimada: ${presupuesto_renta} €/mes` : ''}

${comentarios ? `COMENTARIOS:\n${comentarios}\n` : ''}

Ver ficha: ${adminLink}

---
Fecha: ${currentTime}
Página origen: ${page || 'No especificada'}
${leadId ? `Lead ID: ${leadId}` : ''}
  `;

  console.log('📤 Sending lead notification email');
  
  const emailResponse = await resend.emails.send({
    from: "Liventy Gestión <contacto@liventygestion.com>",
    to: ["contacto@liventygestion.com"],
    replyTo: email || undefined,
    subject: subject,
    html: htmlBody,
    text: textBody
  });

  console.log("✅ Lead notification email sent:", emailResponse);

  return new Response(JSON.stringify({ success: true, message: "Email enviado correctamente" }), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders }
  });
}

async function handleLegacyForm(data: LeadEmailRequest): Promise<Response> {
  const { formType, nombre, apellidos, fullName, email, phone, ...otherFields } = data;

  if (!formType || !email || (!nombre && !fullName)) {
    return new Response(
      JSON.stringify({ error: "Faltan campos obligatorios: formType, email y nombre" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  const displayName = (nombre && apellidos) 
    ? `${nombre} ${apellidos}` 
    : (fullName || nombre || "Sin nombre");

  const subject = getLegacyEmailSubject(formType, displayName);

  const currentTime = new Date().toLocaleString('es-ES', {
    timeZone: 'Europe/Madrid',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const fieldSummary = Object.entries(otherFields)
    .filter(([key, value]) => key !== 'referrerUrl' && value !== undefined && value !== null && value !== '')
    .map(([key, value]) => {
      const fieldName = getFieldDisplayName(key);
      const fieldValue = Array.isArray(value) ? value.join(', ') : String(value);
      return `${fieldName}: ${fieldValue}`;
    })
    .join('\n');

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Nueva solicitud desde la web</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Formulario: ${getFormTypeDisplayName(formType)}</p>
      </div>
      
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 0 0 8px 8px;">
        <h2 style="color: #1e40af; margin-top: 0;">Datos del solicitante</h2>
        <div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <p><strong>Nombre:</strong> ${displayName}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Teléfono:</strong> ${phone}</p>` : ''}
        </div>

        ${fieldSummary ? `
        <h3 style="color: #1e40af;">Información adicional</h3>
        <div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <pre style="white-space: pre-wrap; font-family: Arial, sans-serif; margin: 0;">${fieldSummary}</pre>
        </div>
        ` : ''}

        <div style="background: #fafafa; padding: 15px; border-radius: 6px; font-size: 14px; color: #64748b;">
          <p><strong>Fecha y hora:</strong> ${currentTime}</p>
          <p><strong>Tipo de formulario:</strong> ${formType}</p>
        </div>
      </div>
    </div>
  `;

  console.log('📤 Sending legacy form email');
  
  const emailResponse = await resend.emails.send({
    from: "Liventy Gestión <contacto@liventygestion.com>",
    to: ["contacto@liventygestion.com"],
    replyTo: email,
    subject: subject,
    html: htmlBody
  });

  console.log("✅ Legacy email sent:", emailResponse);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders }
  });
}

function getPersonaTipoLabel(tipo?: string): string {
  switch (tipo) {
    case 'propietario': return 'Propietario';
    case 'inquilino': return 'Inquilino';
    case 'empresa': return 'Empresa';
    default: return 'Contacto';
  }
}

function getLegacyEmailSubject(formType: string, displayName: string): string {
  switch (formType) {
    case 'contacto':
    case 'contacto_general':
      return `Nuevo contacto – ${displayName}`;
    case 'solicitud':
    case 'captacion_propietarios':
      return `Nueva solicitud – ${displayName}`;
    case 'guia':
    case 'lead_magnet':
      return `Descarga guía – ${displayName}`;
    default:
      return `Nuevo envío (${formType}) – ${displayName}`;
  }
}

function getFormTypeDisplayName(formType: string): string {
  const formTypes: Record<string, string> = {
    contacto_general: "Contacto General",
    captacion_propietarios: "Captación Propietarios",
    solicitud_empresas: "Solicitud Empresas",
    lead_magnet: "Lead Magnet - Guía Gratuita"
  };
  return formTypes[formType] || formType;
}

function getFieldDisplayName(key: string): string {
  const fieldNames: Record<string, string> = {
    phone: "Teléfono",
    message: "Mensaje",
    municipio: "Municipio",
    barrio: "Barrio",
    m2: "Metros cuadrados",
    habitaciones: "Habitaciones"
  };
  return fieldNames[key] || key;
}

serve(handler);
