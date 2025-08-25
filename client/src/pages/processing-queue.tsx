import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ProcessingQueue() {
  return (
    <div className="flex-1 p-6" data-testid="processing-queue-page">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-textPrimary">Processing Queue</h2>
          <p className="text-textMuted">Manage and monitor content processing queue</p>
        </CardHeader>
        <CardContent>
          <p className="text-textMuted">Processing queue page - Coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
}
