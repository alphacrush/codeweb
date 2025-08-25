import { useEffect, useState } from "react";
import { websocketManager } from "@/lib/websocket";

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);

  useEffect(() => {
    const handleConnected = () => setIsConnected(true);
    const handleDisconnected = () => setIsConnected(false);
    const handleMessage = (data: any) => setLastMessage(data);

    websocketManager.on('connected', handleConnected);
    websocketManager.on('disconnected', handleDisconnected);
    websocketManager.on('analysis_started', handleMessage);
    websocketManager.on('analysis_processing', handleMessage);
    websocketManager.on('analysis_completed', handleMessage);
    websocketManager.on('analysis_failed', handleMessage);

    // Connect if not already connected
    if (!websocketManager.isConnected()) {
      websocketManager.connect();
    }

    return () => {
      websocketManager.off('connected', handleConnected);
      websocketManager.off('disconnected', handleDisconnected);
      websocketManager.off('analysis_started', handleMessage);
      websocketManager.off('analysis_processing', handleMessage);
      websocketManager.off('analysis_completed', handleMessage);
      websocketManager.off('analysis_failed', handleMessage);
    };
  }, []);

  return {
    isConnected,
    lastMessage
  };
}
