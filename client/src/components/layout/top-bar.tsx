import { User } from "lucide-react";
import { useWebSocket } from "@/hooks/use-websocket";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export default function TopBar() {
  const { isConnected } = useWebSocket();

  return (
    <header className="bg-surface border-b border-border px-6 py-4" data-testid="top-bar">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-textPrimary">Dashboard Overview</h2>
          <p className="text-sm text-textMuted">Real-time content moderation monitoring</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className={cn(
            "flex items-center space-x-2 px-3 py-1 rounded-full border",
            isConnected 
              ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800" 
              : "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
          )}>
            <div className={cn(
              "w-2 h-2 rounded-full",
              isConnected ? "bg-success animate-pulse" : "bg-destructive"
            )} />
            <span className={cn(
              "text-sm font-medium",
              isConnected ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"
            )}>
              {isConnected ? "Live" : "Offline"}
            </span>
          </div>
          
          <ThemeToggle />
          
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <User className="text-muted-foreground text-sm" size={16} />
          </div>
        </div>
      </div>
    </header>
  );
}
