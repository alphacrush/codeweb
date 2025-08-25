import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Settings() {
  return (
    <div className="flex-1 p-6" data-testid="settings-page">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-textPrimary">Settings</h2>
          <p className="text-textMuted">Configure system settings and preferences</p>
        </CardHeader>
        <CardContent>
          <p className="text-textMuted">Settings page - Coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
}
