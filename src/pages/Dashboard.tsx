import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, Heart, Shield, Users, Zap } from "lucide-react";
import { careUsers, careEvents, careCases, measurements } from "@/data/mockData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { motion } from "framer-motion";

const statusColor = {
  normal: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  critical: "bg-destructive text-destructive-foreground",
};

const severityColor = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-warning/20 text-warning border border-warning/30",
  high: "bg-destructive/20 text-destructive border border-destructive/30",
  critical: "bg-destructive text-destructive-foreground",
};

const eventTypeLabel: Record<string, string> = {
  fall: "낙상", inactivity: "무활동", emergency_button: "응급 버튼",
  voice_distress: "음성 SOS", vital_anomaly: "활력징후 이상",
};

const stats = [
  { label: "전체 대상자", value: careUsers.length, icon: Users, color: "text-primary" },
  { label: "활성 이벤트", value: careEvents.filter(e => e.status !== 'resolved').length, icon: AlertTriangle, color: "text-warning" },
  { label: "에스컬레이션", value: careCases.filter(c => c.status === 'escalated_119').length, icon: Zap, color: "text-destructive" },
  { label: "정상 상태", value: careUsers.filter(u => u.status === 'normal').length, icon: Shield, color: "text-success" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">관제 대시보드</h1>
          <p className="text-sm text-muted-foreground">AI Care Companion 실시간 모니터링</p>
        </div>
        <Badge variant="outline" className="gap-1.5 px-3 py-1.5 text-xs">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          실시간 연결됨
        </Badge>
      </div>

      {/* Stats */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <motion.div key={label} variants={item}>
            <Card>
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`p-3 rounded-xl bg-muted ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-3 gap-6">
        {/* Vitals Chart */}
        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="w-4 h-4 text-destructive" />
              활력 징후 (김영순님 - 24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={measurements}>
                <defs>
                  <linearGradient id="spo2Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(210, 80%, 45%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(210, 80%, 45%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" />
                <XAxis dataKey="timestamp" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} domain={[80, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="spo2" stroke="hsl(210, 80%, 45%)" fill="url(#spo2Grad)" name="SpO2 %" />
                <Line type="monotone" dataKey="heartRate" stroke="hsl(0, 72%, 51%)" strokeWidth={2} dot={false} name="심박수" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">대상자 상태</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {careUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.lastActive}</p>
                </div>
                <Badge className={statusColor[user.status]}>
                  {user.status === 'normal' ? '정상' : user.status === 'warning' ? '주의' : '위험'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Active Events */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="w-4 h-4" />
            실시간 이벤트
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {careEvents.map(event => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Badge className={severityColor[event.severity]} variant="secondary">
                    {event.severity === 'critical' ? '긴급' : event.severity === 'high' ? '높음' : event.severity === 'medium' ? '중간' : '낮음'}
                  </Badge>
                  <div>
                    <p className="text-sm font-medium">{event.userName} - {eventTypeLabel[event.type]}</p>
                    <p className="text-xs text-muted-foreground">{event.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-muted-foreground">{event.timestamp}</p>
                  <Badge variant="outline" className="text-[10px] mt-1">
                    {event.status === 'open' ? '대기' : event.status === 'acknowledged' ? '확인됨' : event.status === 'escalated' ? '에스컬레이션' : '해결'}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
