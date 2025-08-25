import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, FileText, Image, Video, Music, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useContentAnalysis } from "@/hooks/use-content-analysis";
import { cn } from "@/lib/utils";

interface ContentAnalysis {
  id: string;
  contentType: string;
  content: string;
  status: string;
  riskLevel?: string;
  detectedIssues: string[];
  confidenceScore?: number;
  createdAt: string;
}

const contentTypes = [
  { id: 'text', label: 'Text', icon: FileText },
  { id: 'image', label: 'Image', icon: Image },
  { id: 'video', label: 'Video', icon: Video },
  { id: 'audio', label: 'Audio', icon: Music },
];

function getRiskLevelColor(riskLevel?: string) {
  switch (riskLevel) {
    case 'high': return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200';
    case 'safe': return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200';
  }
}

function getRiskLevelIcon(riskLevel?: string) {
  switch (riskLevel) {
    case 'high': return <AlertTriangle className="text-destructive" size={16} />;
    case 'medium': return <AlertTriangle className="text-warning" size={16} />;
    case 'safe': return <CheckCircle className="text-success" size={16} />;
    default: return <Clock className="text-muted-foreground" size={16} />;
  }
}

export default function ContentAnalysisPanel() {
  const [selectedContentType, setSelectedContentType] = useState('text');
  const [content, setContent] = useState('');
  const { analyzeContent, isAnalyzing } = useContentAnalysis();

  const { data: recentAnalyses, isLoading } = useQuery<ContentAnalysis[]>({
    queryKey: ['/api/analyses/recent'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const handleAnalyze = () => {
    if (!content.trim()) return;
    
    analyzeContent({
      contentType: selectedContentType,
      content: content.trim()
    });
    
    setContent('');
  };

  return (
    <Card className="lg:col-span-2 shadow-sm" data-testid="content-analysis-panel">
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-textPrimary">Content Analysis</h3>
          <Button 
            onClick={handleAnalyze}
            disabled={!content.trim() || isAnalyzing}
            data-testid="button-new-analysis"
          >
            <Plus size={16} className="mr-2" />
            New Analysis
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-2">Content Type</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {contentTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedContentType(type.id)}
                    className={cn(
                      "px-3 py-2 text-sm border rounded-lg transition-colors flex items-center justify-center space-x-2",
                      selectedContentType === type.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-accent"
                    )}
                    data-testid={`content-type-${type.id}`}
                  >
                    <Icon size={16} />
                    <span>{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-2">Content Input</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="resize-none"
              rows={4}
              placeholder="Paste content here for analysis..."
              data-testid="input-content"
            />
          </div>
          
          <Button 
            onClick={handleAnalyze}
            disabled={!content.trim() || isAnalyzing}
            className="w-full"
            data-testid="button-analyze-content"
          >
            {isAnalyzing ? (
              <>
                <Clock size={16} className="mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <FileText size={16} className="mr-2" />
                Analyze Content
              </>
            )}
          </Button>
        </div>
        
        <div className="border-t border-border pt-6">
          <h4 className="text-sm font-semibold text-textPrimary mb-4">Recent Analysis Results</h4>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-3 bg-muted rounded-lg animate-pulse">
                  <div className="h-4 bg-muted-foreground/20 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted-foreground/20 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : !recentAnalyses?.length ? (
            <p className="text-textMuted text-sm">No recent analyses available</p>
          ) : (
            <div className="space-y-3" data-testid="recent-analyses">
              {recentAnalyses.slice(0, 3).map((analysis) => (
                <div
                  key={analysis.id}
                  className="flex items-center justify-between p-3 bg-accent rounded-lg"
                  data-testid={`analysis-result-${analysis.id}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-background rounded-lg flex items-center justify-center">
                      {getRiskLevelIcon(analysis.riskLevel)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-textPrimary">
                        {analysis.contentType.charAt(0).toUpperCase() + analysis.contentType.slice(1)} Analysis
                      </p>
                      <p className="text-xs text-textMuted">
                        {analysis.detectedIssues.length > 0 
                          ? `Detected: ${analysis.detectedIssues.join(', ')}`
                          : analysis.status === 'completed' 
                            ? 'Clean content detected'
                            : 'Processing...'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {analysis.riskLevel && (
                      <Badge 
                        variant="secondary" 
                        className={getRiskLevelColor(analysis.riskLevel)}
                      >
                        {analysis.riskLevel === 'safe' ? 'Safe' : 
                         analysis.riskLevel === 'medium' ? 'Medium Risk' : 'High Risk'}
                      </Badge>
                    )}
                    <span className="text-xs text-textMuted">
                      {new Date(analysis.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
