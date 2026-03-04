import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { policyBundles, PolicyBundle } from "@/data/mockData";
import { Shield, Clock, ArrowRight, FileCode, Plus } from "lucide-react";

const statusBadge: Record<string, { label: string; color: string }> = {
  draft: { label: "초안", color: "bg-muted text-muted-foreground" },
  active: { label: "활성", color: "bg-success text-success-foreground" },
  archived: { label: "보관", color: "bg-muted text-muted-foreground" },
};

export default function PolicyPage() {
  const [selectedBundle, setSelectedBundle] = useState<PolicyBundle>(policyBundles[0]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">정책 관리</h1>
        <Button className="gap-2"><Plus className="w-4 h-4" /> 새 정책 번들</Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Bundle List */}
        <div className="space-y-3">
          {policyBundles.map(bundle => {
            const st = statusBadge[bundle.status];
            return (
              <Card
                key={bundle.id}
                className={`cursor-pointer transition-all hover:shadow-md ${selectedBundle.id === bundle.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setSelectedBundle(bundle)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <Badge className={st.color}>{st.label}</Badge>
                  </div>
                  <p className="font-medium text-sm">{bundle.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">v{bundle.version} · {bundle.updatedAt}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bundle Detail */}
        <div className="col-span-2">
          <Tabs defaultValue="thresholds">
            <TabsList>
              <TabsTrigger value="thresholds">임계치 ({selectedBundle.thresholds.length})</TabsTrigger>
              <TabsTrigger value="escalation">에스컬레이션 ({selectedBundle.escalationPlan.length})</TabsTrigger>
              <TabsTrigger value="rules">룰 ({selectedBundle.rules.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="thresholds" className="mt-4">
              <Card>
                <CardContent className="p-0">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-3 font-medium">센서</th>
                        <th className="text-left p-3 font-medium">조건</th>
                        <th className="text-left p-3 font-medium">지속시간</th>
                        <th className="text-left p-3 font-medium">심각도</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBundle.thresholds.map(t => (
                        <tr key={t.id} className="border-b hover:bg-muted/20">
                          <td className="p-3 font-medium">{t.metric}</td>
                          <td className="p-3 font-mono text-xs">{t.operator} {t.value}</td>
                          <td className="p-3 text-xs">{t.duration > 0 ? `${t.duration}초` : '즉시'}</td>
                          <td className="p-3">
                            <Badge variant="outline" className={
                              t.severity === 'critical' ? 'border-destructive text-destructive' :
                              t.severity === 'high' ? 'border-warning text-warning' : ''
                            }>
                              {t.severity}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="escalation" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 flex-wrap">
                    {selectedBundle.escalationPlan.map((stage, i) => (
                      <div key={stage.stage} className="flex items-center gap-3">
                        <div className="text-center p-4 rounded-xl border bg-card min-w-[140px]">
                          <p className="text-xs text-muted-foreground mb-1">Stage {stage.stage}</p>
                          <p className="font-bold text-sm">{stage.target}</p>
                          <div className="flex items-center justify-center gap-1 mt-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" /> {stage.timeoutSec}초
                          </div>
                        </div>
                        {i < selectedBundle.escalationPlan.length - 1 && (
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rules" className="mt-4 space-y-3">
              {selectedBundle.rules.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <FileCode className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">등록된 룰이 없습니다</p>
                  </CardContent>
                </Card>
              ) : (
                selectedBundle.rules.map(rule => (
                  <Card key={rule.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{rule.name}</p>
                          <p className="text-xs font-mono text-muted-foreground mt-1 bg-muted p-1.5 rounded">{rule.conditions}</p>
                          <p className="text-xs mt-1">→ <Badge variant="outline" className="text-[10px]">{rule.action}</Badge></p>
                        </div>
                        <Switch checked={rule.enabled} />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
