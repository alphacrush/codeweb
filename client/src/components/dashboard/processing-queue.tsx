import { useQuery } from "@tanstack/react-query";
import { Settings, Clock } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface QueueItem {
  id: string;
  contentType: string;
  status: string;
  createdAt: string;
}

export default function ProcessingQueue() {
  const { data: queue, isLoading } = useQuery<QueueItem[]>({
    queryKey: ['/api/queue'],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  return (
    <Card className="shadow-sm" data-testid="processing-queue">
      <CardHeader className="border-b border-border">
        <h3 className="text-lg font-semibold text-textPrimary">Processing Queue</h3>
        <p className="text-sm text-textMuted">Real-time processing status</p>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 border border-border rounded-lg animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-2 bg-muted rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : !queue?.length ? (
          <p className="text-textMuted text-sm">No items in processing queue</p>
        ) : (
          <div className="space-y-3">
            {queue.slice(0, 3).map((item, index) => (
              <div
                key={item.id}
                className="flex items-center space-x-3 p-3 border border-border rounded-lg"
                data-testid={`queue-item-${item.id}`}
              >
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  {index === 0 ? (
                    <Settings className="text-primary animate-spin" size={16} />
                  ) : (
                    <Clock className="text-primary" size={16} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-textPrimary">
                    {item.contentType.charAt(0).toUpperCase() + item.contentType.slice(1)} Analysis #{item.id.slice(-4)}
                  </p>
                  {index === 0 ? (
                    <Progress value={75} className="mt-2" />
                  ) : (
                    <p className="text-xs text-textMuted">Waiting in queue...</p>
                  )}
                </div>
                <span className="text-xs text-textMuted">
                  {index === 0 ? "75%" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
