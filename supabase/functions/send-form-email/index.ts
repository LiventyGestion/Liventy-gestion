import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Enhanced security headers with CSP and additional protections
const enhancedCorsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY", 
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
};

interface FormEmailRequest {
  formType: string;
  nombre: string;
  apellidos?: string;
  fullName?: string;
  email: string;
  [key: string]: any;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: enhancedCorsHeaders });
  }

  try {
    console.log('📧 Form email request received');
    
    const formData: FormEmailRequest = await req.json();
    console.log('📋 Form data:', { formType: formData.formType, email: formData.email });

    const { formType, nombre, apellidos, fullName, email, ...otherFields } = formData;

    // Validate required fields
    if (!formType || !email || (!nombre && !fullName)) {
      return new Response(
        JSON.stringify({ error: "Faltan campos obligatorios: formType, email y nombre" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...enhancedCorsHeaders },
        }
      );
    }

    // Parse name for subject
    const displayName = (nombre && apellidos) 
      ? `${nombre} ${apellidos}` 
      : (fullName || nombre || "Sin nombre");

    // Generate subject with pattern: LG | {form_type} | {nombre} {apellidos}
    const subject = `LG | ${formType} | ${displayName}`;

    // Build email body content
    const currentTime = new Date().toLocaleString('es-ES', {
      timeZone: 'Europe/Madrid',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const referrerUrl = otherFields.referrerUrl || 'URL no disponible';

    // Build field summary
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
            ${otherFields.phone ? `<p><strong>Teléfono:</strong> ${otherFields.phone}</p>` : ''}
          </div>

          ${fieldSummary ? `
          <h3 style="color: #1e40af;">Información adicional</h3>
          <div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <pre style="white-space: pre-wrap; font-family: Arial, sans-serif; margin: 0;">${fieldSummary}</pre>
          </div>
          ` : ''}

          <div style="background: #fafafa; padding: 15px; border-radius: 6px; font-size: 14px; color: #64748b;">
            <p><strong>Fecha y hora:</strong> ${currentTime}</p>
            <p><strong>Página de origen:</strong> ${referrerUrl}</p>
            <p><strong>Tipo de formulario:</strong> ${formType}</p>
          </div>
        </div>
      </div>
    `;

    const textBody = `
NUEVA SOLICITUD DESDE LA WEB

Formulario: ${getFormTypeDisplayName(formType)}

DATOS DEL SOLICITANTE:
- Nombre: ${displayName}
- Email: ${email}
${otherFields.phone ? `- Teléfono: ${otherFields.phone}` : ''}

${fieldSummary ? `
INFORMACIÓN ADICIONAL:
${fieldSummary}
` : ''}

INFORMACIÓN TÉCNICA:
- Fecha y hora: ${currentTime}
- Página de origen: ${referrerUrl}
- Tipo de formulario: ${formType}
    `;

    // Send email to company
    console.log('📤 Sending email to contacto@liventygestion.com');
    
    const emailResponse = await resend.emails.send({
      from: "Liventy Gestión <contacto@liventygestion.com>",
      to: ["contacto@liventygestion.com"],
      replyTo: email,
      subject: subject,
      html: htmlBody,
      text: textBody
    });

    console.log("✅ Email sent successfully:", emailResponse);

    // Send confirmation to user if requested
    if (otherFields.sendConfirmation !== false) {
      console.log('📤 Sending confirmation to user');
      
      const confirmationHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Hemos recibido tu solicitud</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Liventy Gestión</p>
          </div>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 0 0 8px 8px;">
            <p>Hola <strong>${displayName}</strong>,</p>
            
            <p>Gracias por contactar con nosotros a través del formulario "<strong>${getFormTypeDisplayName(formType)}</strong>". Hemos recibido tu solicitud correctamente.</p>
            
            <p>Nuestro equipo la revisará y te responderemos en un máximo de <strong>24 horas</strong> en horario laboral.</p>
            
            <div style="background: white; border-left: 4px solid #1e40af; padding: 15px; margin: 20px 0;">
              <p style="margin: 0;"><strong>📞 ¿Necesitas respuesta urgente?</strong></p>
              <p style="margin: 5px 0 0 0;">Llámanos al <strong>+34 944 123 456</strong> o escríbenos por WhatsApp.</p>
            </div>
            
            <p style="margin-top: 30px;">Un saludo,<br>
            <strong>El equipo de Liventy Gestión</strong></p>
            
            <hr style="border: none; height: 1px; background: #e2e8f0; margin: 20px 0;">
            <p style="font-size: 12px; color: #64748b;">
              Liventy Gestión - Gestión integral de alquileres<br>
              contacto@liventygestion.com | +34 944 123 456
            </p>
          </div>
        </div>
      `;

      await resend.emails.send({
        from: "Liventy Gestión <contacto@liventygestion.com>",
        to: [email],
        replyTo: "contacto@liventygestion.com",
        subject: "Hemos recibido tu solicitud — Liventy Gestión",
        html: confirmationHtml,
        text: `Hola ${displayName},\n\nGracias por contactar con nosotros. Hemos recibido tu solicitud correctamente y te responderemos en un máximo de 24 horas.\n\nUn saludo,\nEl equipo de Liventy Gestión\n\ncontacto@liventygestion.com | +34 944 123 456`
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Email enviado correctamente" 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...enhancedCorsHeaders },
    });

  } catch (error: any) {
    console.error("❌ Error in send-form-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Error interno del servidor", 
        details: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...enhancedCorsHeaders },
      }
    );
  }
};

// Helper functions
function getFormTypeDisplayName(formType: string): string {
  const formTypes: Record<string, string> = {
    contacto_general: "Contacto General",
    captacion_propietarios: "Captación Propietarios", 
    solicitud_empresas: "Solicitud Empresas",
    calculadora_precio: "Calculadora de Precio",
    incidencia: "Incidencia",
    servicio_mantenimiento: "Servicio de Mantenimiento",
    servicio_limpieza: "Servicio de Limpieza",
    consulta_area: "Consulta Área Cliente",
    herramientas_precio: "Herramientas - Calculadora de Precio",
    herramientas_rentabilidad: "Herramientas - Calculadora de Rentabilidad",
    herramientas_comparador: "Herramientas - Comparador",
    lead_magnet: "Lead Magnet - Guía Gratuita"
  };
  
  return formTypes[formType] || formType;
}

function getFieldDisplayName(key: string): string {
  const fieldNames: Record<string, string> = {
    phone: "Teléfono",
    message: "Mensaje", 
    barrio: "Barrio",
    metros: "Metros cuadrados",
    habitaciones: "Habitaciones",
    banos: "Baños",
    estado: "Estado",
    ingresosMensuales: "Ingresos mensuales",
    gastosMensuales: "Gastos mensuales", 
    comision: "Comisión (%)",
    diasVacios: "Días vacíos al año",
    precioCompra: "Precio de compra",
    alquilerLargo: "Alquiler largo plazo",
    alquilerTemporal: "Alquiler temporal",
    ocupacionTemporal: "Ocupación temporal (%)",
    gastosLargo: "Gastos largo plazo",
    gastosTemporal: "Gastos temporal",
    availableHours: "Horas disponibles",
    category: "Categoría",
    priority: "Prioridad",
    description: "Descripción",
    hours: "Horas solicitadas",
    timeSlot: "Franja horaria",
    date: "Fecha",
    selectedDate: "Fecha seleccionada",
    serviceInterests: "Servicios de interés",
    timeline: "Plazo estimado",
    propertyType: "Tipo de propiedad",
    location: "Ubicación",
    budget: "Presupuesto",
    urgency: "Urgencia"
  };
  
  return fieldNames[key] || key;
}

serve(handler);