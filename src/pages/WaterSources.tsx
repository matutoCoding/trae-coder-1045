import { useState } from 'react';
import {
  Database,
  Waves,
  Droplets,
  CloudRain,
  Mountain,
  Plus,
  Search,
  Filter,
  MapPin,
  Calendar,
  Info,
} from 'lucide-react';
import StatusBadge from '@/components/common/StatusBadge';
import { useAppStore } from '@/store';
import { formatVolume, formatDate, getStatusText, cn } from '@/utils/format';
import type { WaterSource } from '@/types';

const typeIcons: Record<string, React.ElementType> = {
  reservoir: Waves,
  desalination: Droplets,
  rainwater: CloudRain,
  groundwater: Mountain,
};

const typeLabels: Record<string, string> = {
  reservoir: '水库',
  desalination: '海水淡化',
  rainwater: '雨水收集',
  groundwater: '地下水',
};

const typeColors: Record<string, string> = {
  reservoir: 'from-ocean-500 to-cyan-500',
  desalination: 'from-cyan-500 to-teal-500',
  rainwater: 'from-sky-500 to-blue-500',
  groundwater: 'from-amber-500 to-orange-500',
};

export default function WaterSources() {
  const { waterSources } = useAppStore();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<WaterSource | null>(null);

  const filteredSources = waterSources.filter((source) => {
    const matchesType = selectedType === 'all' || source.type === selectedType;
    const matchesSearch =
      source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const typeStats = {
    all: waterSources.length,
    reservoir: waterSources.filter((s) => s.type === 'reservoir').length,
    desalination: waterSources.filter((s) => s.type === 'desalination').length,
    rainwater: waterSources.filter((s) => s.type === 'rainwater').length,
    groundwater: waterSources.filter((s) => s.type === 'groundwater').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">水源台账</h1>
          <p className="text-sm text-slate-400 mt-1">全岛水源信息管理与档案查询</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          新增水源
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Object.entries({ all: '全部', ...typeLabels }).map(([key, label]) => {
          const Icon = key === 'all' ? Database : typeIcons[key];
          const isActive = selectedType === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedType(key)}
              className={cn(
                'p-4 rounded-xl border transition-all duration-200 text-left',
                isActive
                  ? 'bg-ocean-500/20 border-ocean-500/40 shadow-glow'
                  : 'glass-card hover:border-ocean-500/30'
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    isActive
                      ? 'bg-gradient-to-br from-ocean-500 to-cyan-500'
                      : 'bg-slate-700/50'
                  )}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white data-value">
                    {typeStats[key as keyof typeof typeStats]}
                  </p>
                  <p className="text-xs text-slate-400">{label}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索水源名称、位置..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-ocean-500/50 focus:ring-1 focus:ring-ocean-500/30 transition-all"
          />
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <Filter className="w-4 h-4" />
          筛选
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSources.map((source) => {
          const Icon = typeIcons[source.type];
          const fillRate = (source.currentVolume / source.capacity) * 100;

          return (
            <div
              key={source.id}
              onClick={() => setSelectedSource(source)}
              className="glass-card p-5 glass-card-hover cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${typeColors[source.type]} flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-ocean-400 transition-colors">
                      {source.name}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {source.location}
                    </p>
                  </div>
                </div>
                <StatusBadge status={source.status} showPulse />
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-slate-400">蓄水率</span>
                    <span className="text-white font-medium data-value">
                      {fillRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        fillRate > 60
                          ? 'bg-gradient-to-r from-ocean-500 to-cyan-500'
                          : fillRate > 30
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                          : 'bg-gradient-to-r from-red-500 to-rose-500'
                      )}
                      style={{ width: `${fillRate}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-700/30">
                  <div>
                    <p className="text-xs text-slate-500">当前水量</p>
                    <p className="text-sm text-white font-medium mt-0.5">
                      {formatVolume(source.currentVolume)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">总容量</p>
                    <p className="text-sm text-white font-medium mt-0.5">
                      {formatVolume(source.capacity)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-700/30">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Calendar className="w-3 h-3" />
                    建成 {formatDate(source.buildDate)}
                  </div>
                  <button className="text-ocean-400 text-xs flex items-center gap-1 hover:text-ocean-300">
                    <Info className="w-3 h-3" />
                    详情
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedSource && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-lg p-6 animate-slide-up">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${typeColors[selectedSource.type]} flex items-center justify-center`}
                >
                  {(() => {
                    const Icon = typeIcons[selectedSource.type];
                    return <Icon className="w-7 h-7 text-white" />;
                  })()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedSource.name}</h2>
                  <p className="text-sm text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {selectedSource.location}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSource(null)}
                className="text-slate-400 hover:text-white p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <p className="text-xs text-slate-500">水源类型</p>
                  <p className="text-sm text-white font-medium mt-1">
                    {typeLabels[selectedSource.type]}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <p className="text-xs text-slate-500">运行状态</p>
                  <p className="text-sm mt-1">
                    <StatusBadge status={selectedSource.status} showPulse />
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-800/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-slate-400">蓄水情况</span>
                  <span className="text-lg font-bold text-white data-value">
                    {((selectedSource.currentVolume / selectedSource.capacity) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-ocean-500 to-cyan-500"
                    style={{
                      width: `${(selectedSource.currentVolume / selectedSource.capacity) * 100}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-500">
                  <span>当前: {formatVolume(selectedSource.currentVolume)}</span>
                  <span>总容量: {formatVolume(selectedSource.capacity)}</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-800/50">
                <p className="text-sm text-slate-400 mb-2">水源描述</p>
                <p className="text-sm text-slate-300">{selectedSource.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <p className="text-xs text-slate-500">建成日期</p>
                  <p className="text-sm text-white font-medium mt-1">
                    {formatDate(selectedSource.buildDate)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <p className="text-xs text-slate-500">水源编号</p>
                  <p className="text-sm text-white font-medium mt-1 font-mono">
                    {selectedSource.id.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-slate-700/30">
              <button className="btn-primary flex-1">编辑信息</button>
              <button className="btn-secondary flex-1">历史数据</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
