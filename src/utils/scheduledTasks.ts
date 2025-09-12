import { SecurityMonitor } from './securityMonitor';

/**
 * Utility for managing scheduled security tasks
 */
export class ScheduledTasks {
  private static intervals: Map<string, number> = new Map();

  /**
   * Start automated security cleanup job
   * Runs every 24 hours by default
   */
  static startSecurityCleanup(intervalHours: number = 24) {
    const intervalMs = intervalHours * 60 * 60 * 1000;
    
    const runCleanup = async () => {
      try {
        console.log('🧹 Starting scheduled security cleanup...');
        await SecurityMonitor.runAutomatedCleanup();
        console.log('✅ Scheduled security cleanup completed');
      } catch (error) {
        console.error('❌ Scheduled security cleanup failed:', error);
        // Log the failure but don't stop the schedule
        try {
          await SecurityMonitor.logSecurityEvent(
            'scheduled_cleanup_failure',
            { error: error instanceof Error ? error.message : 'Unknown error' },
            'medium'
          );
        } catch (logError) {
          console.error('Failed to log cleanup failure:', logError);
        }
      }
    };

    // Run immediately on start
    runCleanup();

    // Schedule recurring runs
    const interval = setInterval(runCleanup, intervalMs) as unknown as number;
    this.intervals.set('security-cleanup', interval);

    console.log(`📅 Security cleanup scheduled to run every ${intervalHours} hours`);
  }

  /**
   * Start security monitoring job
   * Scans for suspicious activities every hour by default
   */
  static startSecurityMonitoring(intervalMinutes: number = 60) {
    const intervalMs = intervalMinutes * 60 * 1000;
    
    const runMonitoring = async () => {
      try {
        console.log('🔍 Running scheduled security scan...');
        const activities = await SecurityMonitor.scanSuspiciousActivity(60);
        
        // Log high-priority activities
        const highPriorityActivities = activities.filter(
          activity => activity.severity === 'high' || activity.severity === 'critical'
        );

        if (highPriorityActivities.length > 0) {
          console.warn(`⚠️ Found ${highPriorityActivities.length} high-priority security issues`);
          
          // Log each high-priority issue
          for (const activity of highPriorityActivities) {
            await SecurityMonitor.logSecurityEvent(
              'scheduled_scan_alert',
              {
                activity_type: activity.activity_type,
                identifier: activity.identifier,
                attempt_count: activity.attempt_count,
                severity: activity.severity,
                recommendation: activity.recommendation
              },
              activity.severity as 'high' | 'critical'
            );
          }
        } else {
          console.log('✅ No high-priority security issues found');
        }
      } catch (error) {
        console.error('❌ Scheduled security monitoring failed:', error);
      }
    };

    // Run immediately on start
    runMonitoring();

    // Schedule recurring runs
    const interval = setInterval(runMonitoring, intervalMs) as unknown as number;
    this.intervals.set('security-monitoring', interval);

    console.log(`📊 Security monitoring scheduled to run every ${intervalMinutes} minutes`);
  }

  /**
   * Start performance optimization job
   * Optimizes database indices and cleans up unnecessary data
   */
  static startPerformanceOptimization(intervalHours: number = 168) { // Weekly by default
    const intervalMs = intervalHours * 60 * 60 * 1000;
    
    const runOptimization = async () => {
      try {
        console.log('⚡ Starting scheduled performance optimization...');
        
        // Run security cleanup as part of performance optimization
        await SecurityMonitor.runAutomatedCleanup();
        
        // Log the optimization
        await SecurityMonitor.logSecurityEvent(
          'scheduled_performance_optimization',
          { 
            optimization_time: new Date().toISOString(),
            triggered_by: 'scheduled_task'
          },
          'low'
        );
        
        console.log('✅ Scheduled performance optimization completed');
      } catch (error) {
        console.error('❌ Scheduled performance optimization failed:', error);
      }
    };

    // Schedule recurring runs (don't run immediately for performance tasks)
    const interval = setInterval(runOptimization, intervalMs) as unknown as number;
    this.intervals.set('performance-optimization', interval);

    console.log(`⚡ Performance optimization scheduled to run every ${intervalHours} hours`);
  }

  /**
   * Stop a specific scheduled task
   */
  static stopTask(taskName: string) {
    const interval = this.intervals.get(taskName);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(taskName);
      console.log(`⏹️ Stopped scheduled task: ${taskName}`);
    } else {
      console.warn(`⚠️ Task not found: ${taskName}`);
    }
  }

  /**
   * Stop all scheduled tasks
   */
  static stopAllTasks() {
    for (const [taskName, interval] of this.intervals.entries()) {
      clearInterval(interval);
      console.log(`⏹️ Stopped scheduled task: ${taskName}`);
    }
    this.intervals.clear();
    console.log('⏹️ All scheduled tasks stopped');
  }

  /**
   * Get status of all scheduled tasks
   */
  static getTaskStatus(): Record<string, boolean> {
    const status: Record<string, boolean> = {};
    for (const taskName of this.intervals.keys()) {
      status[taskName] = true;
    }
    return status;
  }

  /**
   * Initialize all default security tasks
   * Call this once when your application starts
   */
  static initializeSecurityTasks(options: {
    cleanupIntervalHours?: number;
    monitoringIntervalMinutes?: number;
    performanceIntervalHours?: number;
  } = {}) {
    const {
      cleanupIntervalHours = 24,
      monitoringIntervalMinutes = 60,
      performanceIntervalHours = 168
    } = options;

    console.log('🚀 Initializing scheduled security tasks...');

    this.startSecurityCleanup(cleanupIntervalHours);
    this.startSecurityMonitoring(monitoringIntervalMinutes);
    this.startPerformanceOptimization(performanceIntervalHours);

    console.log('✅ All scheduled security tasks initialized');

    // Return cleanup function
    return () => this.stopAllTasks();
  }
}