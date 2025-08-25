import { useQuery } from "@tanstack/react-query";
import { Flag, AlertTriangle, CheckCircle, Settings } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ActivityLog {
  id: string;
  type: string;
  title: string;
  description: string;
  createdAt: string;
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'flag': return <Flag className="text-destructive" size={16} />;
    case 'warning': return <AlertTriangle className="text-warning" size={16} />;
    case 'success': return <CheckCircle className="text-success" size={16} />;
    case 'info': return <Settings className="text-primary" size={16} />;
    default: return <Settings className="text-muted-foreground" size={16} />;
  }
}

function getActivityBgColor(type: string) {
  switch (type) {
    case 'flag': return 'bg-red-100 dark:bg-red-950';
    case 'warning': return 'bg-yellow-100 dark:bg-yellow-950';
    case 'success': return 'bg-green-100 dark:bg-green-950';
    case 'info': return 'bg-blue-100 dark:bg-blue-950';
    default: return 'bg-gray-100 dark:bg-gray-950';
  }
}

function formatTimeAgo(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

export default function RecentActivity() {
  const { data: activities, isLoading } = useQuery<ActivityLog[]>({
    queryKey: ['/api/activity'],
    refetchInterval: 15000, // Refresh every 15 seconds
  });

  return (
    <Card className="shadow-sm" data-testid="recent-activity">
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-textPrimary">Recent Activity</h3>
          <Button variant="ghost" size="sm" data-testid="button-view-all">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start space-x-4 p-4 rounded-lg animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-full mb-1"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : !activities?.length ? (
          <p className="text-textMuted">No recent activity</p>
        ) : (
          <div className="space-y-4">
            {activities.slice(0, 4).map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-4 p-4 hover:bg-accent rounded-lg transition-colors"
                data-testid={`activity-${activity.id}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getActivityBgColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-textPrimary">{activity.title}</p>
                  <p className="text-sm text-textMuted">{activity.description}</p>
                  <p className="text-xs text-textMuted mt-1">{formatTimeAgo(activity.createdAt)}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs bg-muted hover:bg-muted/80"
                  data-testid={`button-review-${activity.id}`}
                >
                  Review
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
