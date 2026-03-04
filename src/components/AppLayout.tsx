import { NavLink, Outlet } from "react-router-dom";
import { Activity, Bell, LayoutDashboard, Settings, Shield, Users, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "대시보드", icon: LayoutDashboard },
  { to: "/users", label: "대상자 관리", icon: Users },
  { to: "/events", label: "이벤트/케이스", icon: Activity },
  { to: "/guardian", label: "보호자 앱", icon: Bell },
  { to: "/policy", label: "정책 관리", icon: Shield },
];

export default function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-sidebar text-sidebar-foreground flex flex-col">
        <div className="p-5 flex items-center gap-3 border-b border-sidebar-border">
          <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Heart className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-sidebar-primary-foreground">AI Care</h1>
            <p className="text-[10px] text-sidebar-foreground/60 tracking-wider uppercase">Companion</p>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-bold">관</div>
            <div>
              <p className="text-xs font-medium">관제센터 운영자</p>
              <p className="text-[10px] text-sidebar-foreground/50">admin@carecompanion.kr</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
