import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ContentAnalysis() {
  return (
    <div className="flex-1 p-6" data-testid="content-analysis-page">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-textPrimary">Content Analysis</h2>
          <p className="text-textMuted">Advanced content analysis tools and settings</p>
        </CardHeader>
        <CardContent>
          <p className="text-textMuted">Content analysis page - Coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
}
