import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Activity, Clock, TrendingUp, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SecurityMonitor, type SecuritySummary, type SuspiciousActivity } from '@/utils/securityMonitor';
import { useToast } from '@/hooks/use-toast';

const SecurityDashboard = () => {
  const [summary, setSummary] = useState<SecuritySummary | null>(null);
  const [suspiciousActivities, setSuspiciousActivities] = useState<SuspiciousActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const loadSecurityData = async () => {
    try {
      setLoading(true);
      const [summaryData, activitiesData] = await Promise.all([
        SecurityMonitor.getSecuritySummary(),
        SecurityMonitor.scanSuspiciousActivity(60)
      ]);
      
      setSummary(summaryData);
      setSuspiciousActivities(activitiesData);
    } catch (error) {
      console.error('Failed to load security data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load security data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSecurityData();
    setRefreshing(false);
    toast({
      title: 'Refreshed',
      description: 'Security data has been updated'
    });
  };

  const handleCleanup = async () => {
    try {
      await SecurityMonitor.runSecurityCleanup();
      toast({
        title: 'Cleanup Complete',
        description: 'Security cleanup has been performed successfully'
      });
      await loadSecurityData();
    } catch (error) {
      console.error('Cleanup failed:', error);
      toast({
        title: 'Cleanup Failed',
        description: 'Failed to perform security cleanup',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    loadSecurityData();
  }, []);

  const securityScore = SecurityMonitor.calculateSecurityScore(suspiciousActivities);
  const recommendations = SecurityMonitor.getSecurityRecommendations(suspiciousActivities);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getScoreColor = (level: string) => {
    switch (level) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'moderate': return 'text-yellow-600';
      case 'poor': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Security Dashboard
          </h1>
          <p className="text-muted-foreground">Monitor and manage application security</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleCleanup} variant="outline">
            <Activity className="h-4 w-4 mr-2" />
            Run Cleanup
          </Button>
        </div>
      </div>

      {/* Security Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Security Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className={`text-4xl font-bold ${getScoreColor(securityScore.level)}`}>
              {securityScore.score}/100
            </div>
            <div>
              <Badge variant={securityScore.level === 'excellent' || securityScore.level === 'good' ? 'default' : 'destructive'}>
                {securityScore.level.toUpperCase()}
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">
                {securityScore.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Suspicious Activities</p>
                <p className="text-2xl font-bold">{suspiciousActivities.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Recent Events</p>
                <p className="text-2xl font-bold">{summary?.recent_events.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Rate Limited IPs</p>
                <p className="text-2xl font-bold">{summary?.rate_limit_status.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Anonymous Sessions</p>
                <p className="text-2xl font-bold">{summary?.anonymous_activity.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Suspicious Activities */}
      {suspiciousActivities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Suspicious Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suspiciousActivities.map((activity, index) => (
                <Alert key={index}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{activity.activity_type}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.identifier} - {activity.attempt_count} attempts
                        </p>
                        <p className="text-sm mt-1">{activity.recommendation}</p>
                      </div>
                      <Badge variant={getSeverityColor(activity.severity)}>
                        {activity.severity}
                      </Badge>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Security Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Recent Security Events */}
      {summary && summary.recent_events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Security Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {summary.recent_events.slice(0, 10).map((event, index) => (
                <div key={index} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <p className="font-medium text-sm">{event.event_type}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant={getSeverityColor(event.severity)}>
                    {event.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SecurityDashboard;