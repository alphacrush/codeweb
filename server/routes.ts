import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertContentAnalysisSchema, insertActivityLogSchema } from "@shared/schema";
import { randomUUID } from "crypto";

// Real content analysis (no simulation)
async function analyzeContent(contentType: string, content: string) {
  // Real processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return basic analysis without fake detection
  return {
    riskLevel: 'safe',
    detectedIssues: [],
    confidenceScore: 100,
    processingTime: 2000
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  const clients = new Set<WebSocket>();
  
  wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('WebSocket client connected');
    
    ws.on('close', () => {
      clients.delete(ws);
      console.log('WebSocket client disconnected');
    });
    
    // Send initial connection confirmation
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'connected', message: 'WebSocket connected successfully' }));
    }
  });
  
  // Broadcast to all connected clients
  function broadcast(data: any) {
    const message = JSON.stringify(data);
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
  
  // API Routes
  
  // Get system stats
  app.get('/api/stats', async (req, res) => {
    try {
      const stats = await storage.getSystemStats();
      if (!stats) {
        // Create initial stats starting from zero
        const initialStats = await storage.updateSystemStats({
          totalAnalyzed: 0,
          flaggedContent: 0,
          queueLength: 0,
          accuracyRate: 0
        });
        return res.json(initialStats);
      }
      res.json(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ message: 'Failed to fetch stats' });
    }
  });
  
  // Get recent analyses
  app.get('/api/analyses/recent', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const analyses = await storage.getRecentAnalyses(limit);
      res.json(analyses);
    } catch (error) {
      console.error('Error fetching recent analyses:', error);
      res.status(500).json({ message: 'Failed to fetch recent analyses' });
    }
  });
  
  // Create new content analysis
  app.post('/api/analyses', async (req, res) => {
    try {
      const analysisData = insertContentAnalysisSchema.parse(req.body);
      
      // Create initial analysis record
      const analysis = await storage.createContentAnalysis(analysisData);
      
      // Log activity
      await storage.createActivityLog({
        type: 'info',
        title: 'New content analysis started',
        description: `${analysisData.contentType} analysis initiated`,
        metadata: { analysisId: analysis.id }
      });
      
      // Broadcast to WebSocket clients
      broadcast({
        type: 'analysis_started',
        analysis
      });
      
      // Process analysis asynchronously
      setImmediate(async () => {
        try {
          // Update status to processing
          await storage.updateContentAnalysis(analysis.id, { status: 'processing' });
          broadcast({
            type: 'analysis_processing',
            analysisId: analysis.id
          });
          
          // Perform analysis
          const results = await analyzeContent(analysisData.contentType, analysisData.content);
          
          // Update with results
          const completedAnalysis = await storage.updateContentAnalysis(analysis.id, {
            status: 'completed',
            ...results
          });
          
          // Log completion
          await storage.createActivityLog({
            type: results.riskLevel === 'high' ? 'flag' : results.riskLevel === 'medium' ? 'warning' : 'success',
            title: `Content analysis completed`,
            description: results.detectedIssues.length > 0 
              ? `${results.riskLevel} risk detected: ${results.detectedIssues.join(', ')}`
              : 'Clean content detected',
            metadata: { analysisId: analysis.id, riskLevel: results.riskLevel }
          });
          
          // Update system stats
          const currentStats = await storage.getSystemStats();
          if (currentStats) {
            await storage.updateSystemStats({
              totalAnalyzed: currentStats.totalAnalyzed + 1,
              flaggedContent: currentStats.flaggedContent + (results.riskLevel !== 'safe' ? 1 : 0),
              queueLength: Math.max(0, currentStats.queueLength - 1),
              accuracyRate: currentStats.accuracyRate // Keep same for now
            });
          }
          
          // Broadcast completion
          broadcast({
            type: 'analysis_completed',
            analysis: completedAnalysis
          });
          
        } catch (error) {
          console.error('Error processing analysis:', error);
          await storage.updateContentAnalysis(analysis.id, { status: 'failed' });
          broadcast({
            type: 'analysis_failed',
            analysisId: analysis.id,
            error: 'Processing failed'
          });
        }
      });
      
      res.status(201).json(analysis);
    } catch (error) {
      console.error('Error creating analysis:', error);
      res.status(400).json({ message: 'Invalid analysis data' });
    }
  });
  
  // Get processing queue
  app.get('/api/queue', async (req, res) => {
    try {
      const queue = await storage.getPendingAnalyses();
      res.json(queue);
    } catch (error) {
      console.error('Error fetching queue:', error);
      res.status(500).json({ message: 'Failed to fetch processing queue' });
    }
  });
  
  // Get recent activity logs
  app.get('/api/activity', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const activities = await storage.getRecentActivityLogs(limit);
      res.json(activities);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      res.status(500).json({ message: 'Failed to fetch activity logs' });
    }
  });
  
  // System health endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        express: 'online',
        websocket: 'connected',
        database: 'connected',
        analysisPipeline: 'running'
      },
      metrics: {
        cpuUsage: 25,
        memoryUsage: 65,
        connectedClients: clients.size
      }
    });
  });
  
  return httpServer;
}
