import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface HealthData {
  status: string;
  services: {
    express: string;
    websocket: string;
    database: string;
    analysisPipeline: string;
  };
  metrics: {
    cpuUsage: number;
    memoryUsage: number;
    connectedClients: number;
  };
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'online':
    case 'connected':
    case 'running':
      return 'bg-success';
    case 'offline':
    case 'disconnected':
    case 'stopped':
      return 'bg-destructive';
    default:
      return 'bg-warning';
  }
}

function getStatusText(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function SystemHealth() {
  const { data: health, isLoading } = useQuery<HealthData>({
    queryKey: ['/api/health'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  if (isLoading) {
    return (
      <Card className="shadow-sm animate-pulse">
        <CardHeader className="border-b border-border">
          <div className="h-6 bg-muted rounded w-1/2"></div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-4 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-1/4"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!health) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="border-b border-border">
          <h3 className="text-lg font-semibold text-textPrimary">System Health</h3>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-textMuted">Health data unavailable</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm" data-testid="system-health">
      <CardHeader className="border-b border-border">
        <h3 className="text-lg font-semibold text-textPrimary">System Health</h3>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {Object.entries(health.services).map(([service, status]) => (
          <div key={service} className="flex items-center justify-between">
            <span className="text-sm font-medium text-textPrimary">
              {service === 'express' ? 'Express Server' :
               service === 'websocket' ? 'WebSocket Connection' :
               service === 'database' ? 'Database (Neon)' :
               service === 'analysisPipeline' ? 'Analysis Pipeline' : service}
            </span>
            <div className="flex items-center space-x-2">
              <div className={cn("w-2 h-2 rounded-full", getStatusColor(status))} />
              <span className={cn(
                "text-sm",
                status.toLowerCase() === 'online' || status.toLowerCase() === 'connected' || status.toLowerCase() === 'running'
                  ? "text-success"
                  : "text-destructive"
              )}>
                {getStatusText(status)}
              </span>
            </div>
          </div>
        ))}
        
        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-textPrimary">CPU Usage</span>
            <span className="text-sm text-textMuted">{health.metrics.cpuUsage}%</span>
          </div>
          <Progress value={health.metrics.cpuUsage} className="mt-2" />
        </div>
        
        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-textPrimary">Memory Usage</span>
            <span className="text-sm text-textMuted">{health.metrics.memoryUsage}%</span>
          </div>
          <Progress value={health.metrics.memoryUsage} className="mt-2" />
        </div>
        
        {health.metrics.connectedClients !== undefined && (
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-sm font-medium text-textPrimary">Connected Clients</span>
            <span className="text-sm text-textMuted">{health.metrics.connectedClients}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
