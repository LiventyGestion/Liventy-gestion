import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.0";

// Enhanced security headers
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
  console.log('🧹 Automated Security Cleanup function called');
  
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

    // Get request details for logging
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    
    console.log('🔄 Starting automated security cleanup...');

    // Run the comprehensive cleanup function
    const { error: cleanupError } = await supabase.rpc('schedule_security_cleanup');
    
    if (cleanupError) {
      console.error('❌ Cleanup error:', cleanupError);
      throw cleanupError;
    }

    console.log('✅ Security cleanup completed successfully');

    // Log the cleanup event
    await supabase.rpc('log_security_event', {
      p_event_type: 'automated_security_cleanup',
      p_ip_address: clientIP,
      p_user_agent: userAgent,
      p_details: { 
        cleanup_time: new Date().toISOString(),
        triggered_by: user.id
      },
      p_severity: 'low'
    });

    // Get cleanup statistics
    const { data: recentCleanupEvents, error: statsError } = await supabase
      .from('security_audit_log')
      .select('created_at, details')
      .eq('event_type', 'automated_cleanup_completed')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
      .order('created_at', { ascending: false })
      .limit(5);

    return new Response(JSON.stringify({
      success: true,
      message: 'Security cleanup completed successfully',
      cleanup_time: new Date().toISOString(),
      recent_cleanups: recentCleanupEvents || [],
      next_recommended_cleanup: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
    }), {
      headers: { ...enhancedCorsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Automated Cleanup Error:', error);
    
    // Log error event
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );
      
      await supabase.rpc('log_security_event', {
        p_event_type: 'automated_cleanup_error',
        p_ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        p_user_agent: req.headers.get('user-agent') || 'unknown',
        p_details: { error: error.message },
        p_severity: 'high'
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    return new Response(JSON.stringify({
      success: false,
      error: 'Cleanup failed',
      details: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...enhancedCorsHeaders, 'Content-Type': 'application/json' },
    });
  }
});