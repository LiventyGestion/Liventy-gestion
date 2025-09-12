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
  console.log('⏰ Security Cron Job function called');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: enhancedCorsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get request details for logging
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'cron-job';
    const userAgent = req.headers.get('user-agent') || 'supabase-cron';
    
    console.log('🔄 Starting cron-triggered security operations...');

    // 1. Run automated cleanup
    console.log('🧹 Running security cleanup...');
    const { error: cleanupError } = await supabase.rpc('schedule_security_cleanup');
    if (cleanupError) {
      console.error('❌ Cleanup error:', cleanupError);
      throw cleanupError;
    }

    // 2. Scan for suspicious activities
    console.log('🔍 Scanning for suspicious activities...');
    const { data: suspiciousData, error: scanError } = await supabase
      .rpc('detect_advanced_suspicious_activity', { check_window_minutes: 60 });
    
    if (scanError) {
      console.error('❌ Suspicious activity scan error:', scanError);
      throw scanError;
    }

    // 3. Log high-priority issues
    const highPriorityIssues = (suspiciousData || []).filter(
      (activity: any) => activity.severity === 'high' || activity.severity === 'critical'
    );

    if (highPriorityIssues.length > 0) {
      console.warn(`⚠️ Found ${highPriorityIssues.length} high-priority security issues`);
      
      // Log each high-priority issue
      for (const issue of highPriorityIssues) {
        await supabase.rpc('log_security_event', {
          p_event_type: 'cron_security_alert',
          p_ip_address: clientIP,
          p_user_agent: userAgent,
          p_details: {
            activity_type: issue.activity_type,
            identifier: issue.identifier,
            attempt_count: issue.attempt_count,
            severity: issue.severity,
            recommendation: issue.recommendation,
            detected_at: new Date().toISOString()
          },
          p_severity: issue.severity
        });
      }
    }

    // 4. Log successful cron job completion
    await supabase.rpc('log_security_event', {
      p_event_type: 'cron_security_job_completed',
      p_ip_address: clientIP,
      p_user_agent: userAgent,
      p_details: {
        cleanup_completed: true,
        suspicious_activities_found: (suspiciousData || []).length,
        high_priority_issues: highPriorityIssues.length,
        execution_time: new Date().toISOString()
      },
      p_severity: 'low'
    });

    console.log('✅ Cron security job completed successfully');

    const response = {
      success: true,
      message: 'Security cron job completed successfully',
      execution_time: new Date().toISOString(),
      results: {
        cleanup_completed: true,
        suspicious_activities_scanned: true,
        total_suspicious_activities: (suspiciousData || []).length,
        high_priority_issues: highPriorityIssues.length,
        issues: highPriorityIssues
      }
    };

    return new Response(JSON.stringify(response), {
      headers: { ...enhancedCorsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Cron Security Job Error:', error);
    
    // Log error event
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );
      
      await supabase.rpc('log_security_event', {
        p_event_type: 'cron_security_job_error',
        p_ip_address: req.headers.get('x-forwarded-for') || 'cron-job',
        p_user_agent: req.headers.get('user-agent') || 'supabase-cron',
        p_details: { 
          error: error.message,
          execution_time: new Date().toISOString()
        },
        p_severity: 'high'
      });
    } catch (logError) {
      console.error('Failed to log cron error:', logError);
    }

    return new Response(JSON.stringify({
      success: false,
      error: 'Cron security job failed',
      details: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...enhancedCorsHeaders, 'Content-Type': 'application/json' },
    });
  }
});