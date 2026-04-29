import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { 
  LayoutDashboard, 
  MapPin, 
  Activity, 
  AlertTriangle, 
  Wrench, 
  Settings,
  Bell,
  User,
  LogOut,
  MonitorPlay,
  FileCheck,
  SearchCode,
  AlertOctagon,
  Signpost,
  BarChart3
} from "lucide-react";
import { cn } from "../lib/utils";

const roleFeatures: Record<string, string[]> = {
  SystemAdmin: ["/", "/outfalls", "/inspection", "/traceability", "/remediation", "/signboard", "/monitoring", "/warnings", "/maintenance", "/analysis", "/system"],
  DataEntry: ["/", "/outfalls", "/inspection", "/traceability", "/signboard"],
  MonitoringAnalyst: ["/", "/outfalls", "/traceability", "/monitoring", "/warnings", "/analysis"],
  RemediationAdmin: ["/", "/outfalls", "/remediation", "/warnings", "/analysis"],
  Supervisor: ["/", "/outfalls", "/inspection", "/remediation", "/monitoring", "/warnings"],
  Maintenance: ["/", "/outfalls", "/signboard", "/monitoring", "/maintenance"],
};

const allNavItems = [
  { name: "首页", path: "/", icon: LayoutDashboard },
  { name: "一口一档", path: "/outfalls", icon: MapPin },
  { name: "排查记录", path: "/inspection", icon: FileCheck },
  { name: "溯源信息", path: "/traceability", icon: SearchCode },
  { name: "整治管理", path: "/remediation", icon: AlertOctagon },
  { name: "标识牌管理", path: "/signboard", icon: Signpost },
  { name: "在线监测", path: "/monitoring", icon: Activity },
  { name: "事件中心", path: "/warnings", icon: AlertTriangle },
  { name: "运维管理", path: "/maintenance", icon: Wrench },
  { name: "数据分析", path: "/analysis", icon: BarChart3 },
  { name: "系统管理", path: "/system", icon: Settings },
];

export default function Layout() {
  const location = useLocation();
  const [currentUser] = useState<any>({
    name: "张三 (系统管理员)",
    role: "SystemAdmin",
    roleName: "系统管理员",
    username: "admin"
  });

  const allowedPaths = roleFeatures[currentUser.role] || [];
  const navItems = allNavItems.filter(item => allowedPaths.includes(item.path));

  const currentNav = navItems.find(item => item.path === location.pathname) || navItems[0];

  return (
    <div className="flex h-screen w-full bg-[#F0F2F5] font-sans text-[#333333]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0056B3] text-white flex flex-col shadow-xl z-20">
        <div className="h-16 flex items-center justify-center border-b border-white/10 px-4">
          <h1 className="text-lg font-bold tracking-wider truncate">铜山区排污口监管系统</h1>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200",
                      isActive
                        ? "bg-white/20 font-medium"
                        : "hover:bg-white/10 text-white/80 hover:text-white"
                    )
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-white/10 space-y-4">
          <Link 
            to="/screen" 
            target="_blank"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-blue-900/20 transition-all"
          >
            <MonitorPlay className="w-4 h-4" />
            可视化大屏
          </Link>
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{currentUser.roleName}</p>
              <p className="text-xs text-white/60 truncate">{currentUser.name.split(' ')[0]}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-[#333333]">
              {currentNav?.name || "页面"}
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer text-[#666666] hover:text-[#0056B3] transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF4D4F] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                3
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
