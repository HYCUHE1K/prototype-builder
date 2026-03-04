import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { alerts, careUsers, measurements } from "@/data/mockData";
import { Bell, Check, Heart, Phone, ThermometerSun, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";
import { motion, AnimatePresence } from "framer-motion";

export default function GuardianPage() {
  const [ackAlerts, setAckAlerts] = useState<Set<string>>(new Set());
  const user = careUsers[0]; // 김영순
  const myAlerts = alerts.filter(a => a.userId === 'u2' || a.userId === 'u3'); // show some

  const handleAck = (id: string) => {
    setAckAlerts(prev => new Set(prev).add(id));
  };

  const recentMeasurements = measurements.slice(-8);
  const latest = measurements[measurements.length - 1];

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">보호자 앱</h1>
        <p className="text-sm text-muted-foreground">김민수님 (김영순님의 보호자)</p>
      </div>

      {/* Parent Status */}
      <Card className="border-success/30">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-lg">{user.name}</h2>
              <p className="text-xs text-muted-foreground">{user.age}세 · {user.address}</p>
            </div>
            <Badge className="bg-success text-success-foreground">정상</Badge>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Heart className="w-4 h-4 mx-auto mb-1 text-destructive" />
              <p className="text-lg font-bold">{latest.heartRate}</p>
              <p className="text-[10px] text-muted-foreground">심박수</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Activity className="w-4 h-4 mx-auto mb-1 text-primary" />
              <p className="text-lg font-bold">{latest.spo2}%</p>
              <p className="text-[10px] text-muted-foreground">SpO2</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <ThermometerSun className="w-4 h-4 mx-auto mb-1 text-warning" />
              <p className="text-lg font-bold">{latest.temperature}°</p>
              <p className="text-[10px] text-muted-foreground">체온</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mini Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">오늘 활력징후 추이</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={recentMeasurements}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" />
              <XAxis dataKey="timestamp" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 9 }} />
              <Line type="monotone" dataKey="heartRate" stroke="hsl(0, 72%, 51%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="spo2" stroke="hsl(210, 80%, 45%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Alerts */}
      <div>
        <h2 className="text-base font-bold mb-3 flex items-center gap-2">
          <Bell className="w-4 h-4" /> 알림
        </h2>
        <AnimatePresence>
          {myAlerts.map(alert => {
            const isAcked = ackAlerts.has(alert.id);
            return (
              <motion.div
                key={alert.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border mb-3 ${isAcked ? 'border-success/30 bg-success/5' : 'border-warning/30 bg-warning/5'}`}
              >
                <p className="text-sm font-medium">{alert.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{alert.sentAt}</p>
                <div className="flex gap-2 mt-3">
                  {!isAcked ? (
                    <>
                      <Button size="sm" onClick={() => handleAck(alert.id)} className="gap-1">
                        <Check className="w-3 h-3" /> 확인 완료
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1">
                        <Phone className="w-3 h-3" /> 직접 연락
                      </Button>
                    </>
                  ) : (
                    <Badge className="bg-success/20 text-success">✓ 확인 완료</Badge>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
