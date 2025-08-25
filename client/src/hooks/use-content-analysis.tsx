import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useContentAnalysis() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async (data: { contentType: string; content: string }) => {
      const response = await apiRequest('POST', '/api/analyses', data);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/analyses/recent'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/queue'] });
      
      toast({
        title: "Analysis Started",
        description: "Content analysis has been queued for processing.",
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: "Failed to start content analysis. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    analyzeContent: analyzeMutation.mutate,
    isAnalyzing: analyzeMutation.isPending,
  };
}
