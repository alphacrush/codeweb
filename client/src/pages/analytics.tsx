import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Analytics() {
  return (
    <div className="flex-1 p-6" data-testid="analytics-page">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-textPrimary">Analytics</h2>
          <p className="text-textMuted">Detailed analytics and reporting</p>
        </CardHeader>
        <CardContent>
          <p className="text-textMuted">Analytics page - Coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
}
