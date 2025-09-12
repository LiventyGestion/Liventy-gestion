import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FormNotificationRequest {
  type: 'lead' | 'solicitud';
  data: any;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data }: FormNotificationRequest = await req.json();

    let subject = "";
    let htmlContent = "";

    if (type === 'lead') {
      subject = `Nuevo Lead - ${data.origen}`;
      htmlContent = `
        <h2>Nuevo Lead Recibido</h2>
        <p><strong>Origen:</strong> ${data.origen}</p>
        <p><strong>Nombre:</strong> ${data.nombre || 'No especificado'}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Teléfono:</strong> ${data.telefono || 'No especificado'}</p>
        <p><strong>Mensaje:</strong> ${data.mensaje || 'No especificado'}</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
      `;
    } else if (type === 'solicitud') {
      subject = `Nueva Solicitud Detallada`;
      htmlContent = `
        <h2>Nueva Solicitud Detallada</h2>
        <p><strong>Nombre:</strong> ${data.nombre}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Teléfono:</strong> ${data.telefono}</p>
        <p><strong>Tipo de Propiedad:</strong> ${data.tipo_propiedad || 'No especificado'}</p>
        <p><strong>Ubicación:</strong> ${data.ubicacion_propiedad || 'No especificado'}</p>
        <p><strong>Tamaño:</strong> ${data.tamano_propiedad || 'No especificado'}</p>
        <p><strong>Situación Actual:</strong> ${data.situacion_actual || 'No especificado'}</p>
        <p><strong>Servicios de Interés:</strong> ${data.servicios_interes?.join(', ') || 'No especificado'}</p>
        <p><strong>Renta Mensual:</strong> ${data.renta_mensual || 'No especificado'}</p>
        <p><strong>Timeline:</strong> ${data.timeline || 'No especificado'}</p>
        <p><strong>Información Adicional:</strong> ${data.info_adicional || 'No especificado'}</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
      `;
    }

    // Send notification email to company
    const emailResponse = await resend.emails.send({
      from: "Liventy Gestión <no-reply@liventygestion.com>",
      to: ["contacto@liventygestion.com"],
      subject: subject,
      html: htmlContent,
    });

    console.log("Notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in form-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);