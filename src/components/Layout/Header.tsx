import { useState, useEffect } from 'react';
import { Bell, User, Settings, Search, Clock } from 'lucide-react';
import { useAppStore } from '@/store';
import { formatDateTime, getRelativeTime } from '@/utils/format';

export default function Header() {
  const { alerts, markAlertAsRead, markAllAlertsAsRead } = useAppStore();
  const [showAlerts, setShowAlerts] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = alerts.filter((a) => !a.read).length;

  const alertTypeColors: Record<string, string> = {
    alarm: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-sky-500',
  };

  return (
    <header className="h-16 bg-slate-900/60 backdrop-blur-xl border-b border-ocean-500/20 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-slate-400">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-mono">
            {currentTime.toLocaleString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm">
          <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs">
            系统运行正常
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">在线设备 28/30</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="搜索..."
            className="w-64 pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-ocean-500/50 focus:ring-1 focus:ring-ocean-500/30 transition-all"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showAlerts && (
            <div className="absolute right-0 top-full mt-2 w-80 glass-card shadow-xl z-50 animate-slide-up">
              <div className="p-4 border-b border-ocean-500/20 flex items-center justify-between">
                <h3 className="font-semibold text-slate-200">告警通知</h3>
                <button
                  onClick={markAllAlertsAsRead}
                  className="text-xs text-ocean-400 hover:text-ocean-300"
                >
                  全部已读
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {alerts.slice(0, 5).map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => markAlertAsRead(alert.id)}
                    className={`p-4 border-b border-slate-700/30 cursor-pointer hover:bg-slate-800/30 transition-colors ${
                      !alert.read ? 'bg-ocean-500/5' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                          alertTypeColors[alert.type]
                        } ${
                          alert.type === 'alarm' ? 'status-pulse' : ''
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200">
                          {alert.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {alert.message}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          {getRelativeTime(alert.time)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-ocean-500/20">
                <button className="w-full text-center text-sm text-ocean-400 hover:text-ocean-300">
                  查看全部告警
                </button>
              </div>
            </div>
          )}
        </div>

        <button className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors">
          <Settings className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-700/50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ocean-500 to-cyan-500 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-slate-200">调度管理员</p>
            <p className="text-xs text-slate-500">admin@island-water</p>
          </div>
        </div>
      </div>
    </header>
  );
}
