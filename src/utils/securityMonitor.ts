import { supabase } from '@/integrations/supabase/client';

export interface SecuritySummary {
  recent_events: Array<{
    event_type: string;
    severity: string;
    created_at: string;
    details: any;
  }>;
  rate_limit_status: Array<{
    email: string;
    attempt_count: number;
    last_attempt: string;
  }>;
  anonymous_activity: Array<{
    session_id: string;
    operation_type: string;
    attempt_count: number;
    last_attempt: string;
  }>;
  summary_generated_at: string;
}

export interface SuspiciousActivity {
  activity_type: string;
  identifier: string;
  attempt_count: number;
  first_attempt: string;
  last_attempt: string;
  severity: string;
  recommendation: string;
}

export class SecurityMonitor {
  /**
   * Get a comprehensive security summary for the last 24 hours
   */
  static async getSecuritySummary(): Promise<SecuritySummary> {
    const { data, error } = await supabase.functions.invoke('security-monitor', {
      body: {
        action: 'get_security_summary'
      }
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error);

    return data.data;
  }

  /**
   * Scan for suspicious activities in the specified time window
   */
  static async scanSuspiciousActivity(windowMinutes: number = 60): Promise<SuspiciousActivity[]> {
    const { data, error } = await supabase.functions.invoke('security-monitor', {
      body: {
        action: 'scan_suspicious_activity',
        params: { window_minutes: windowMinutes }
      }
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error);

    return data.data.suspicious_activities;
  }

  /**
   * Check IP rate limit status for a specific operation
   */
  static async checkIpRateLimit(
    ipAddress: string, 
    operationType: string, 
    options: {
      maxAttempts?: number;
      windowMinutes?: number;
      blockDurationMinutes?: number;
    } = {}
  ) {
    const { data, error } = await supabase.functions.invoke('security-monitor', {
      body: {
        action: 'check_ip_rate_limit',
        params: {
          ip_address: ipAddress,
          operation_type: operationType,
          max_attempts: options.maxAttempts || 50,
          window_minutes: options.windowMinutes || 60,
          block_duration_minutes: options.blockDurationMinutes || 60
        }
      }
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error);

    return data.data.rate_limit_check;
  }

  /**
   * Manually trigger security cleanup
   */
  static async runSecurityCleanup(): Promise<{ cleanup_completed: boolean }> {
    const { data, error } = await supabase.functions.invoke('security-monitor', {
      body: {
        action: 'run_security_cleanup'
      }
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error);

    return data.data;
  }

  /**
   * Run automated security cleanup (can be called by cron jobs)
   */
  static async runAutomatedCleanup() {
    const { data, error } = await supabase.functions.invoke('automated-security-cleanup', {
      body: {}
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error);

    return data;
  }

  /**
   * Log a custom security event
   */
  static async logSecurityEvent(
    eventType: string,
    details: any,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'low'
  ) {
    const { error } = await supabase.rpc('log_security_event', {
      p_event_type: eventType,
      p_details: details,
      p_severity: severity
    });

    if (error) throw error;
  }

  /**
   * Get security recommendations based on current threats
   */
  static getSecurityRecommendations(activities: SuspiciousActivity[]): string[] {
    const recommendations = new Set<string>();

    activities.forEach(activity => {
      recommendations.add(activity.recommendation);
      
      // Add general recommendations based on severity
      if (activity.severity === 'critical') {
        recommendations.add('Consider implementing emergency response procedures');
      }
      if (activity.severity === 'high') {
        recommendations.add('Increase monitoring frequency for the next 24 hours');
      }
    });

    // Add general security best practices
    if (activities.length > 0) {
      recommendations.add('Review access logs for unusual patterns');
      recommendations.add('Ensure all security patches are up to date');
    }

    return Array.from(recommendations);
  }

  /**
   * Calculate overall security score based on recent activities
   */
  static calculateSecurityScore(activities: SuspiciousActivity[]): {
    score: number;
    level: 'excellent' | 'good' | 'moderate' | 'poor' | 'critical';
    description: string;
  } {
    let score = 100;

    activities.forEach(activity => {
      switch (activity.severity) {
        case 'critical':
          score -= 25;
          break;
        case 'high':
          score -= 15;
          break;
        case 'medium':
          score -= 8;
          break;
        case 'low':
          score -= 3;
          break;
      }
    });

    score = Math.max(0, score);

    let level: 'excellent' | 'good' | 'moderate' | 'poor' | 'critical';
    let description: string;

    if (score >= 90) {
      level = 'excellent';
      description = 'Your security posture is excellent with minimal threats detected.';
    } else if (score >= 75) {
      level = 'good';
      description = 'Your security is good with only minor issues detected.';
    } else if (score >= 50) {
      level = 'moderate';
      description = 'Some security concerns detected that should be addressed.';
    } else if (score >= 25) {
      level = 'poor';
      description = 'Multiple security issues detected. Immediate attention required.';
    } else {
      level = 'critical';
      description = 'Critical security threats detected. Emergency response recommended.';
    }

    return { score, level, description };
  }
}