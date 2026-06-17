import { getStatusBgColor, getStatusText, cn } from '@/utils/format';

interface StatusBadgeProps {
  status: string;
  showPulse?: boolean;
  className?: string;
}

export default function StatusBadge({ status, showPulse = false, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'badge inline-flex items-center gap-1.5',
        getStatusBgColor(status),
        className
      )}
    >
      {showPulse && (
        <span
          className={`w-1.5 h-1.5 rounded-full status-pulse ${
            status === 'normal' || status === 'running' || status === 'resolved'
              ? 'bg-emerald-400'
              : status === 'warning' || status === 'due' || status === 'standby' || status === 'pending'
              ? 'bg-amber-400'
              : 'bg-red-400'
          }`}
        />
      )}
      {getStatusText(status)}
    </span>
  );
}
