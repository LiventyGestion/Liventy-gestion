import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

serve(async (req) => {
  console.log('📊 Export Leads CSV function called');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Get auth token from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('❌ No authorization header');
      return new Response(JSON.stringify({ error: 'No autorizado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify user is admin using anon key first
    const supabaseAnon = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } }
    });
    
    const { data: { user }, error: userError } = await supabaseAnon.auth.getUser();
    
    if (userError || !user) {
      console.error('❌ User auth error:', userError);
      return new Response(JSON.stringify({ error: 'No autorizado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if user is admin
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (roleError || !roleData) {
      console.error('❌ User is not admin:', roleError);
      return new Response(JSON.stringify({ error: 'Acceso denegado. Solo administradores.' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ Admin verified:', user.email);

    // Fetch all leads with service role
    const { data: leads, error: leadsError } = await supabase
      .from('Leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (leadsError) {
      console.error('❌ Error fetching leads:', leadsError);
      throw leadsError;
    }

    console.log(`📋 Found ${leads?.length || 0} leads`);

    // CSV headers in the exact order specified
    const headers = [
      'id',
      'created_at',
      'source',
      'page',
      'persona_tipo',
      'nombre',
      'telefono',
      'email',
      'municipio',
      'barrio',
      'm2',
      'habitaciones',
      'estado_vivienda',
      'fecha_disponible',
      'presupuesto_renta',
      'canal_preferido',
      'franja_horaria',
      'comentarios',
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'consent',
      'status'
    ];

    // Helper function to escape CSV fields
    const escapeCSV = (value: any): string => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    // Build CSV content
    let csv = headers.join(',') + '\n';

    for (const lead of leads || []) {
      const row = headers.map(header => escapeCSV(lead[header]));
      csv += row.join(',') + '\n';
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `leads_export_${timestamp}.csv`;

    console.log('✅ CSV generated successfully');

    return new Response(csv, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    console.error('💥 Export error:', error);
    return new Response(JSON.stringify({ 
      error: 'Error al exportar leads',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
