export const formatNumber = (num: number, decimals: number = 0): string => {
  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const formatVolume = (volume: number): string => {
  if (volume >= 10000) {
    return `${formatNumber(volume / 10000, 1)} 万m³`;
  }
  return `${formatNumber(volume)} m³`;
};

export const formatFlowRate = (rate: number): string => {
  if (rate >= 1000) {
    return `${formatNumber(rate / 1000, 2)} 万m³/日`;
  }
  return `${formatNumber(rate, 1)} m³/日`;
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const formatDateTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getRelativeTime = (dateStr: string): string => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '刚刚';
  if (diffMins < 60) return `${diffMins} 分钟前`;
  if (diffHours < 24) return `${diffHours} 小时前`;
  if (diffDays < 7) return `${diffDays} 天前`;
  return formatDate(dateStr);
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'normal':
    case 'running':
    case 'resolved':
    case 'pass':
    case 'completed':
      return 'text-emerald-400';
    case 'warning':
    case 'due':
    case 'standby':
    case 'pending':
      return 'text-amber-400';
    case 'alarm':
    case 'overdue':
    case 'fault':
    case 'critical':
    case 'fail':
    case 'high':
      return 'text-red-400';
    case 'low':
      return 'text-orange-400';
    case 'processing':
    case 'in-progress':
    case 'sailing':
    case 'loading':
    case 'unloading':
      return 'text-sky-400';
    default:
      return 'text-slate-400';
  }
};

export const getStatusBgColor = (status: string): string => {
  switch (status) {
    case 'normal':
    case 'running':
    case 'resolved':
    case 'pass':
    case 'completed':
    case 'docked':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'warning':
    case 'due':
    case 'standby':
    case 'pending':
    case 'scheduled':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'alarm':
    case 'overdue':
    case 'fault':
    case 'critical':
    case 'fail':
    case 'high':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'low':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'processing':
    case 'in-progress':
    case 'sailing':
    case 'loading':
    case 'unloading':
      return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
    default:
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }
};

export const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    normal: '正常',
    warning: '预警',
    alarm: '告警',
    running: '运行中',
    standby: '待机',
    maintenance: '维护中',
    fault: '故障',
    low: '偏低',
    high: '偏高',
    pending: '待处理',
    processing: '处理中',
    resolved: '已解决',
    minor: '一般',
    major: '重要',
    critical: '紧急',
    docked: '停靠',
    sailing: '航行中',
    loading: '装载中',
    unloading: '卸载中',
    due: '待维保',
    overdue: '超期',
    scheduled: '已计划',
    'in-progress': '进行中',
    completed: '已完成',
    pass: '合格',
    fail: '不合格',
    routine: '例行',
    repair: '维修',
    inspection: '巡检',
    reservoir: '水库',
    desalination: '海水淡化',
    rainwater: '雨水收集',
    groundwater: '地下水',
  };
  return statusMap[status] || status;
};

export const getEventTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    water_shortage: '缺水事件',
    pipe_break: '管道破裂',
    equipment_failure: '设备故障',
    water_quality: '水质异常',
  };
  return typeMap[type] || type;
};

export const getEquipmentCategoryText = (category: string): string => {
  const map: Record<string, string> = {
    pump: '泵类',
    valve: '阀门',
    filter: '过滤设备',
    meter: '仪表',
    generator: '发电设备',
    other: '其他',
  };
  return map[category] || category;
};

export const cn = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};
