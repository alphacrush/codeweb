import { Link, useLocation } from "wouter";
import { Shield, BarChart3, Search, List, PieChart, Settings } from "lucide-react";
import { useWebSocket } from "@/hooks/use-websocket";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Content Analysis", href: "/analysis", icon: Search },
  { name: "Processing Queue", href: "/queue", icon: List },
  { name: "Analytics", href: "/analytics", icon: PieChart },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { isConnected } = useWebSocket();

  return (
    <aside className="w-64 bg-surface border-r border-border flex flex-col" data-testid="sidebar">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="text-primary-foreground text-sm" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-textPrimary">ContentGuard</h1>
            <p className="text-xs text-textMuted">Moderation Dashboard</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-textMuted hover:bg-accent hover:text-textPrimary"
                  )}
                  data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Icon className="text-sm" size={16} />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className={cn(
          "flex items-center space-x-3 p-3 rounded-lg border",
          isConnected 
            ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800" 
            : "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
        )}>
          <div className={cn(
            "w-2 h-2 rounded-full",
            isConnected ? "bg-success animate-pulse" : "bg-destructive"
          )} />
          <div>
            <p className={cn(
              "text-sm font-medium",
              isConnected ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"
            )}>
              Server {isConnected ? "Online" : "Offline"}
            </p>
            <p className={cn(
              "text-xs",
              isConnected ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            )}>
              WebSocket {isConnected ? "Connected" : "Disconnected"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
