import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Database,
  Waves,
  Droplets,
  Gauge,
  Users,
  Wrench,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Anchor,
} from 'lucide-react';
import { useAppStore } from '@/store';

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: '首页概览', icon: LayoutDashboard },
  { path: '/water-sources', label: '水源台账', icon: Database },
  { path: '/storage', label: '蓄水监控', icon: Waves },
  { path: '/desalination', label: '淡化生产', icon: Droplets },
  { path: '/pipeline', label: '管网配送', icon: Gauge },
  { path: '/consumption', label: '用水管理', icon: Users },
  { path: '/maintenance', label: '设备维保', icon: Wrench },
  { path: '/emergency', label: '应急调度', icon: AlertTriangle },
];

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  return (
    <aside
      className={`h-screen bg-slate-900/80 backdrop-blur-xl border-r border-ocean-500/20 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-ocean-500/20">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ocean-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
            <Anchor className="w-6 h-6 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white whitespace-nowrap">
                海岛水务调度系统
              </span>
              <span className="text-[10px] text-ocean-400 whitespace-nowrap">
                Island Water Dispatch
              </span>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? 'bg-ocean-500/20 text-ocean-400 nav-item-active'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`
                  }
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110`}
                  />
                  {!sidebarCollapsed && (
                    <span className="text-sm font-medium whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-2 border-t border-ocean-500/20">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">收起菜单</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
