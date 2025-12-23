import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { AlertTriangle, Shield, Users, Activity, Database, Lock } from 'lucide-react';

interface SecurityEvent {
  id: string;
  event_type: string;
  user_id: string | null;
  ip_address: string | null;
  severity: string;
  details: any;
  created_at: string;
}

interface SecurityThreat {
  threat_type: string;
  severity: string;
  created_at: string;
  details: any;
}

interface SecurityStats {
  total_events_24h: number;
  critical_events_24h: number;
  active_threats: number;
  blocked_ips: number;
}

const SecurityMonitoringDashboard: React.FC = () => {
  const { user } = useAuth();
  const [recentEvents, setRecentEvents] = useState<SecurityEvent[]>([]);
  const [threats, setThreats] = useState<SecurityThreat[]>([]);
  const [stats, setStats] = useState<SecurityStats>({
    total_events_24h: 0,
    critical_events_24h: 0,
    active_threats: 0,
    blocked_ips: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchSecurityData();
      
      // Refresh data every 30 seconds
      const interval = setInterval(fetchSecurityData, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchSecurityData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch recent security events
      const { data: eventsData, error: eventsError } = await supabase
        .from('security_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (eventsError) throw eventsError;
      setRecentEvents(eventsData || []);

      // Fetch security threats using RPC (no parameters)
      const { data: threatsData, error: threatsError } = await supabase
        .rpc('detect_advanced_security_threats');

      if (threatsError) throw threatsError;
      setThreats((threatsData as SecurityThreat[]) || []);

      // Calculate stats
      const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const criticalCount = eventsData?.filter(
        e => e.severity === 'critical' && e.created_at >= last24h
      ).length || 0;

      // Fetch blocked IPs
      const { count: blockedIPs } = await supabase
        .from('ip_rate_limits')
        .select('*', { count: 'exact', head: true })
        .not('blocked_until', 'is', null)
        .gt('blocked_until', new Date().toISOString());

      setStats({
        total_events_24h: eventsData?.filter(e => e.created_at >= last24h).length || 0,
        critical_events_24h: criticalCount,
        active_threats: threatsData?.length || 0,
        blocked_ips: blockedIPs || 0
      });

    } catch (err: any) {
      console.error('Error fetching security data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  if (user?.role !== 'admin') {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          No tienes permisos para acceder al dashboard de seguridad.
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>Error: {error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Monitoreo de Seguridad</h2>
          <p className="text-muted-foreground">
            Panel de control de amenazas y eventos de seguridad
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Activity className="h-3 w-3 mr-1" />
          Actualizado hace {isLoading ? '...' : '< 30s'}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos (24h)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_events_24h}</div>
            <p className="text-xs text-muted-foreground">
              Total de eventos registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Críticos (24h)</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {stats.critical_events_24h}
            </div>
            <p className="text-xs text-muted-foreground">
              Eventos de severidad crítica
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amenazas Activas</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active_threats}</div>
            <p className="text-xs text-muted-foreground">
              Amenazas detectadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IPs Bloqueadas</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.blocked_ips}</div>
            <p className="text-xs text-muted-foreground">
              IPs temporalmente bloqueadas
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="threats" className="space-y-4">
        <TabsList>
          <TabsTrigger value="threats">Amenazas Detectadas</TabsTrigger>
          <TabsTrigger value="events">Eventos Recientes</TabsTrigger>
        </TabsList>

        <TabsContent value="threats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Amenazas de Seguridad Detectadas</CardTitle>
              <CardDescription>
                Análisis avanzado de patrones sospechosos en las últimas 24 horas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-muted-foreground">Cargando amenazas...</p>
              ) : threats.length === 0 ? (
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    No se han detectado amenazas activas en las últimas 24 horas.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {threats.map((threat, index) => (
                    <Card key={index} className="border-l-4" style={{
                      borderLeftColor: threat.severity === 'critical' ? 'hsl(var(--destructive))' : 
                                      threat.severity === 'high' ? '#f97316' : '#eab308'
                    }}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">
                            {threat.threat_type.replace(/_/g, ' ').toUpperCase()}
                          </CardTitle>
                          <Badge className={getThreatLevelColor(threat.severity)}>
                            {threat.severity}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="text-sm space-y-2">
                        <div>
                          <span className="font-medium">Fecha:</span>{' '}
                          {new Date(threat.created_at).toLocaleString('es-ES')}
                        </div>
                        {threat.details && Object.keys(threat.details).length > 0 && (
                          <details className="text-xs">
                            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                              Detalles
                            </summary>
                            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                              {JSON.stringify(threat.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Eventos de Seguridad Recientes</CardTitle>
              <CardDescription>
                Últimos 50 eventos registrados en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-muted-foreground">Cargando eventos...</p>
              ) : recentEvents.length === 0 ? (
                <p className="text-muted-foreground">No hay eventos registrados.</p>
              ) : (
                <div className="space-y-2">
                  {recentEvents.slice(0, 20).map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start justify-between p-3 rounded-lg border"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={getSeverityColor(event.severity) as any}>
                            {event.severity}
                          </Badge>
                          <span className="font-medium text-sm">
                            {event.event_type.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(event.created_at).toLocaleString('es-ES')}
                          {event.ip_address && ` • IP: ${event.ip_address}`}
                          {event.user_id && ` • User: ${event.user_id.substring(0, 8)}...`}
                        </div>
                        {event.details && Object.keys(event.details).length > 0 && (
                          <details className="text-xs">
                            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                              Detalles
                            </summary>
                            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                              {JSON.stringify(event.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityMonitoringDashboard;