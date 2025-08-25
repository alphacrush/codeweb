import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/use-websocket";
import StatsGrid from "@/components/dashboard/stats-grid";
import ContentAnalysisPanel from "@/components/dashboard/content-analysis-panel";
import ProcessingQueue from "@/components/dashboard/processing-queue";
import SystemHealth from "@/components/dashboard/system-health";
import RecentActivity from "@/components/dashboard/recent-activity";

export default function Dashboard() {
  const { lastMessage } = useWebSocket();
  const queryClient = useQueryClient();

  // Handle real-time updates
  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.type) {
        case 'analysis_started':
        case 'analysis_completed':
        case 'analysis_failed':
          // Invalidate relevant queries to refresh data
          queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
          queryClient.invalidateQueries({ queryKey: ['/api/analyses/recent'] });
          queryClient.invalidateQueries({ queryKey: ['/api/queue'] });
          queryClient.invalidateQueries({ queryKey: ['/api/activity'] });
          break;
      }
    }
  }, [lastMessage, queryClient]);

  return (
    <div className="flex-1 p-6 space-y-6" data-testid="dashboard-page">
      <StatsGrid />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ContentAnalysisPanel />
        
        <div className="space-y-6">
          <ProcessingQueue />
          <SystemHealth />
        </div>
      </div>
      
      <RecentActivity />
    </div>
  );
}
