import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.0";

// Enhanced security headers with CSP and additional protections
const enhancedCorsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:",
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

serve(async (req) => {
  console.log('🔒 Security Monitor function called');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: enhancedCorsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
      throw new Error('Missing Supabase configuration');
    }

    // ==================== ADMIN AUTHENTICATION ====================
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.log('❌ No authorization header provided');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Unauthorized: No authorization header provided' 
      }), {
        status: 401,
        headers: { ...enhancedCorsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create a client with the user's auth token to verify identity
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    
    if (authError || !user) {
      console.log('❌ Invalid or expired token');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Unauthorized: Invalid or expired token' 
      }), {
        status: 401,
        headers: { ...enhancedCorsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use service role client for admin check
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user has admin role
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (roleError || !roleData) {
      console.log('❌ User is not an admin:', user.id);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Forbidden: Admin access required' 
      }), {
        status: 403,
        headers: { ...enhancedCorsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ Admin authenticated:', user.id);
    // ==================== END AUTHENTICATION ====================

    // Get request details for IP tracking
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    
    // Parse request
    const requestBody = await req.json();
    const { action, params = {} } = requestBody;

    let result = {};

    switch (action) {
      case 'scan_suspicious_activity':
        const { data: suspiciousData, error: suspiciousError } = await supabase
          .rpc('detect_advanced_suspicious_activity', { 
            check_window_minutes: params.window_minutes || 60 
          });

        if (suspiciousError) throw suspiciousError;

        // Log security scan
        await supabase.rpc('log_security_event', {
          p_event_type: 'security_scan_performed',
          p_ip_address: clientIP,
          p_user_agent: userAgent,
          p_details: { 
            window_minutes: params.window_minutes || 60, 
            results_count: suspiciousData?.length || 0,
            performed_by: user.id 
          },
          p_severity: 'low'
        });

        result = { suspicious_activities: suspiciousData || [] };
        break;

      case 'check_ip_rate_limit':
        if (!params.ip_address || !params.operation_type) {
          throw new Error('Missing required parameters: ip_address, operation_type');
        }

        const { data: rateLimitData, error: rateLimitError } = await supabase
          .rpc('check_ip_rate_limit', {
            p_ip_address: params.ip_address,
            p_operation_type: params.operation_type,
            max_attempts: params.max_attempts || 50,
            window_minutes: params.window_minutes || 60,
            block_duration_minutes: params.block_duration_minutes || 60
          });

        if (rateLimitError) throw rateLimitError;
        result = { rate_limit_check: rateLimitData };
        break;

      case 'run_security_cleanup':
        const { error: cleanupError } = await supabase.rpc('schedule_security_cleanup');
        if (cleanupError) throw cleanupError;

        await supabase.rpc('log_security_event', {
          p_event_type: 'manual_security_cleanup',
          p_ip_address: clientIP,
          p_user_agent: userAgent,
          p_details: { triggered_by: user.id },
          p_severity: 'low'
        });

        result = { cleanup_completed: true };
        break;

      case 'get_security_summary':
        // Get recent security events
        const { data: recentEvents, error: eventsError } = await supabase
          .from('security_audit_log')
          .select('event_type, severity, created_at, details')
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
          .order('created_at', { ascending: false })
          .limit(50);

        if (eventsError) throw eventsError;

        // Get rate limit status
        const { data: rateLimitStatus, error: rlError } = await supabase
          .from('lead_rate_limits')
          .select('email, attempt_count, last_attempt')
          .gte('last_attempt', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour
          .order('attempt_count', { ascending: false })
          .limit(10);

        if (rlError) throw rlError;

        // Get anonymous activity
        const { data: anonActivity, error: anonError } = await supabase
          .from('anonymous_rate_limits')
          .select('session_id, operation_type, attempt_count, last_attempt')
          .gte('last_attempt', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour
          .order('attempt_count', { ascending: false })
          .limit(10);

        if (anonError) throw anonError;

        result = {
          recent_events: recentEvents || [],
          rate_limit_status: rateLimitStatus || [],
          anonymous_activity: anonActivity || [],
          summary_generated_at: new Date().toISOString()
        };
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    // Log successful operation
    await supabase.rpc('log_security_event', {
      p_event_type: `security_monitor_${action}`,
      p_ip_address: clientIP,
      p_user_agent: userAgent,
      p_details: { action, success: true, performed_by: user.id },
      p_severity: 'low'
    });

    return new Response(JSON.stringify({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...enhancedCorsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Security Monitor Error:', error);
    
    // Log error event
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );
      
      await supabase.rpc('log_security_event', {
        p_event_type: 'security_monitor_error',
        p_ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        p_user_agent: req.headers.get('user-agent') || 'unknown',
        p_details: { error: error.message },
        p_severity: 'medium'
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...enhancedCorsHeaders, 'Content-Type': 'application/json' },
    });
  }
});