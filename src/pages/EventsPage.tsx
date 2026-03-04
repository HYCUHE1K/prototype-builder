import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { careEvents, careCases, alerts } from "@/data/mockData";
import { ArrowRight, Clock, Phone, MessageSquare, Bell } from "lucide-react";

const severityColor: Record<string, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-warning/20 text-warning",
  high: "bg-destructive/20 text-destructive",
  critical: "bg-destructive text-destructive-foreground",
};

const caseStatusLabel: Record<string, { label: string; color: string }> = {
  open: { label: "대기", color: "bg-muted text-muted-foreground" },
  in_progress: { label: "처리중", color: "bg-info/20 text-info" },
  escalated_119: { label: "119 출동", color: "bg-destructive text-destructive-foreground" },
  resolved: { label: "해결", color: "bg-success text-success-foreground" },
};

const channelIcon = { push: Bell, sms: MessageSquare, call: Phone };

export default function EventsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">이벤트 / 케이스</h1>

      <Tabs defaultValue="cases">
        <TabsList>
          <TabsTrigger value="cases">케이스 ({careCases.length})</TabsTrigger>
          <TabsTrigger value="events">이벤트 ({careEvents.length})</TabsTrigger>
          <TabsTrigger value="alerts">알림 이력 ({alerts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="cases" className="space-y-4 mt-4">
          {careCases.map(c => {
            const st = caseStatusLabel[c.status];
            const caseAlerts = alerts.filter(a => a.caseId === c.id);
            return (
              <Card key={c.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{c.userName} - 케이스 #{c.id.toUpperCase()}</CardTitle>
                    <Badge className={st.color}>{st.label}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    <Clock className="w-3 h-3" /> 생성: {c.createdAt} · 갱신: {c.updatedAt} · 이벤트 {c.events.length}건
                  </div>

                  {/* Escalation Timeline */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {caseAlerts.map((alert, i) => {
                      const ChIcon = channelIcon[alert.channel];
                      return (
                        <div key={alert.id} className="flex items-center gap-2">
                          <div className={`px-3 py-2 rounded-lg border text-xs ${
                            alert.status === 'timeout' ? 'border-destructive/30 bg-destructive/5' :
                            alert.status === 'ack' ? 'border-success/30 bg-success/5' :
                            alert.status === 'sent' ? 'border-warning/30 bg-warning/5' :
                            'border-border bg-muted/30'
                          }`}>
                            <div className="flex items-center gap-1.5 mb-1">
                              <ChIcon className="w-3 h-3" />
                              <span className="font-medium">Stage {alert.stage}</span>
                            </div>
                            <p className="text-muted-foreground">{alert.target}</p>
                            <Badge variant="outline" className="text-[9px] mt-1">
                              {alert.status === 'timeout' ? '미응답' : alert.status === 'ack' ? '확인' : alert.status === 'sent' ? '발송' : '대기'}
                            </Badge>
                          </div>
                          {i < caseAlerts.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground" />}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="events" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium">시각</th>
                    <th className="text-left p-3 font-medium">대상자</th>
                    <th className="text-left p-3 font-medium">유형</th>
                    <th className="text-left p-3 font-medium">심각도</th>
                    <th className="text-left p-3 font-medium">설명</th>
                    <th className="text-left p-3 font-medium">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {careEvents.map(e => (
                    <tr key={e.id} className="border-b hover:bg-muted/20 transition-colors">
                      <td className="p-3 font-mono text-xs">{e.timestamp}</td>
                      <td className="p-3">{e.userName}</td>
                      <td className="p-3">{e.type}</td>
                      <td className="p-3"><Badge className={severityColor[e.severity]} variant="secondary">{e.severity}</Badge></td>
                      <td className="p-3 text-xs text-muted-foreground max-w-xs truncate">{e.description}</td>
                      <td className="p-3"><Badge variant="outline">{e.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="mt-4 space-y-2">
          {alerts.map(a => {
            const ChIcon = channelIcon[a.channel];
            return (
              <div key={a.id} className="flex items-center gap-4 p-4 rounded-lg border bg-card">
                <ChIcon className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{a.message}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">→ {a.target} · {a.sentAt}</p>
                </div>
                <Badge variant="outline">{a.status}</Badge>
              </div>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
