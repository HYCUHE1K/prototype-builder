import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { careUsers } from "@/data/mockData";
import { MapPin, Phone, Cpu } from "lucide-react";

const statusColor = {
  normal: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  critical: "bg-destructive text-destructive-foreground",
};

export default function UsersPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">대상자 관리</h1>
      <div className="grid grid-cols-2 gap-4">
        {careUsers.map(user => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{user.name} <span className="text-sm font-normal text-muted-foreground">({user.age}세)</span></CardTitle>
                <Badge className={statusColor[user.status]}>
                  {user.status === 'normal' ? '정상' : user.status === 'warning' ? '주의' : '위험'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" /> {user.address}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Cpu className="w-3.5 h-3.5" /> {user.deviceId} · 마지막 활동: {user.lastActive}
              </div>
              <div className="border-t pt-3">
                <p className="text-xs font-medium text-muted-foreground mb-2">보호자</p>
                {user.guardians.map(g => (
                  <div key={g.id} className="flex items-center justify-between text-sm py-1">
                    <span>{g.name} ({g.relation})</span>
                    <span className="flex items-center gap-1 text-muted-foreground text-xs">
                      <Phone className="w-3 h-3" /> {g.phone}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
