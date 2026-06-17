import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/utils/format';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  status?: 'normal' | 'warning' | 'alarm';
  className?: string;
}

export default function StatCard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  trendLabel,
  status = 'normal',
  className,
}: StatCardProps) {
  const statusColors = {
    normal: 'from-ocean-500 to-cyan-500',
    warning: 'from-amber-500 to-orange-500',
    alarm: 'from-red-500 to-rose-500',
  };

  const statusGlow = {
    normal: 'shadow-[0_0_20px_rgba(14,165,233,0.2)]',
    warning: 'shadow-[0_0_20px_rgba(245,158,11,0.2)]',
    alarm: 'shadow-[0_0_20px_rgba(239,68,68,0.2)]',
  };

  return (
    <div
      className={cn(
        'glass-card p-5 glass-card-hover relative overflow-hidden',
        statusGlow[status],
        className
      )}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-ocean-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-400 font-medium">{title}</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-white data-value">
                {value}
              </span>
              {unit && <span className="text-sm text-slate-400">{unit}</span>}
            </div>
          </div>
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${statusColors[status]} flex items-center justify-center shadow-lg`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>

        {trend !== undefined && (
          <div className="mt-4 flex items-center gap-2">
            {trend >= 0 ? (
              <div className="flex items-center gap-1 text-emerald-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-medium">
                  +{trend}%
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-red-400">
                <TrendingDown className="w-4 h-4" />
                <span className="text-xs font-medium">
                  {trend}%
                </span>
              </div>
            )}
            {trendLabel && (
              <span className="text-xs text-slate-500">{trendLabel}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
