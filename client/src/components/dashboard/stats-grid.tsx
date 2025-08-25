import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, BarChart3, AlertTriangle, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SystemStats {
  totalAnalyzed: number;
  flaggedContent: number;
  queueLength: number;
  accuracyRate: number;
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  icon: React.ReactNode;
  testId: string;
}

function StatCard({ title, value, change, changeType, icon, testId }: StatCardProps) {
  return (
    <Card className="shadow-sm" data-testid={testId}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-textMuted">{title}</p>
            <p className="text-2xl font-bold text-textPrimary" data-testid={`${testId}-value`}>
              {value}
            </p>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            {icon}
          </div>
        </div>
        <div className="mt-4 flex items-center space-x-2">
          <span className={`text-sm ${changeType === 'positive' ? 'text-success' : 'text-destructive'}`}>
            {changeType === 'positive' ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {change}
          </span>
          <span className="text-sm text-textMuted">vs last week</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function StatsGrid() {
  const { data: stats, isLoading } = useQuery<SystemStats>({
    queryKey: ['/api/stats'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-surface p-6 rounded-lg border border-border shadow-sm animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-3"></div>
            <div className="h-8 bg-muted rounded w-1/2 mb-4"></div>
            <div className="h-3 bg-muted rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface p-6 rounded-lg border border-border shadow-sm">
          <p className="text-textMuted">No stats available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="stats-grid">
      <StatCard
        title="Total Analyzed"
        value={stats.totalAnalyzed.toLocaleString()}
        change="0%"
        changeType="positive"
        icon={<BarChart3 className="text-primary" size={20} />}
        testId="stat-total-analyzed"
      />
      
      <StatCard
        title="Flagged Content"
        value={stats.flaggedContent.toLocaleString()}
        change="0%"
        changeType="positive"
        icon={<AlertTriangle className="text-destructive" size={20} />}
        testId="stat-flagged-content"
      />
      
      <StatCard
        title="Queue Length"
        value={stats.queueLength.toString()}
        change="0%"
        changeType="positive"
        icon={<Clock className="text-warning" size={20} />}
        testId="stat-queue-length"
      />
      
      <StatCard
        title="Accuracy Rate"
        value={stats.accuracyRate > 0 ? `${(stats.accuracyRate / 100).toFixed(1)}%` : "0%"}
        change="0%"
        changeType="positive"
        icon={<CheckCircle className="text-success" size={20} />}
        testId="stat-accuracy-rate"
      />
    </div>
  );
}
