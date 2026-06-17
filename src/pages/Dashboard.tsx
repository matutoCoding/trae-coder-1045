import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  Droplets,
  Waves,
  Gauge,
  Users,
  AlertTriangle,
  Wrench,
  Ship,
  Activity,
  ArrowRight,
  Zap,
} from 'lucide-react';
import StatCard from '@/components/cards/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import { useAppStore } from '@/store';
import { formatNumber, formatVolume, getRelativeTime, getEventTypeText, cn } from '@/utils/format';
import { supplyStatistics, monthlyConsumption, desalinationHistory } from '@/data/mockData';

export default function Dashboard() {
  const { emergencyEvents, waterSources, waterBoats, alerts, equipment } = useAppStore();
  const [activeEvents, setActiveEvents] = useState(emergencyEvents.filter(e => e.status !== 'resolved'));
  const [alarmCount, setAlarmCount] = useState(alerts.filter(a => !a.read).length);

  const totalStorage = waterSources
    .filter(s => s.type === 'reservoir')
    .reduce((sum, s) => sum + s.currentVolume, 0);
  const totalCapacity = waterSources
    .filter(s => s.type === 'reservoir')
    .reduce((sum, s) => sum + s.capacity, 0);
  const storageRate = ((totalStorage / totalCapacity) * 100).toFixed(1);

  const totalDesalination = waterSources
    .filter(s => s.type === 'desalination')
    .reduce((sum, s) => sum + s.currentVolume, 0);

  const overdueEquipment = equipment.filter(e => e.status === 'overdue').length;
  const dueEquipment = equipment.filter(e => e.status === 'due').length;

  const supplyChartOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      borderColor: 'rgba(14, 165, 233, 0.3)',
      textStyle: { color: '#e2e8f0' },
    },
    legend: {
      data: ['居民用水', '商业用水', '旅游用水', '工业用水'],
      textStyle: { color: '#94a3b8' },
      top: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: monthlyConsumption.map((d) => d.month),
      axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } },
      axisLabel: { color: '#64748b' },
    },
    yAxis: {
      type: 'value',
      name: '用水量(万吨)',
      nameTextStyle: { color: '#64748b' },
      axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } },
      axisLabel: { color: '#64748b' },
      splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.1)' } },
    },
    series: [
      {
        name: '居民用水',
        type: 'line',
        stack: 'Total',
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(14, 165, 233, 0.4)' },
              { offset: 1, color: 'rgba(14, 165, 233, 0.05)' },
            ],
          },
        },
        lineStyle: { color: '#0ea5e9', width: 2 },
        itemStyle: { color: '#0ea5e9' },
        data: monthlyConsumption.map((d) => d.residential / 10000),
      },
      {
        name: '商业用水',
        type: 'line',
        stack: 'Total',
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(6, 182, 212, 0.4)' },
              { offset: 1, color: 'rgba(6, 182, 212, 0.05)' },
            ],
          },
        },
        lineStyle: { color: '#06b6d4', width: 2 },
        itemStyle: { color: '#06b6d4' },
        data: monthlyConsumption.map((d) => d.commercial / 10000),
      },
      {
        name: '旅游用水',
        type: 'line',
        stack: 'Total',
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(16, 185, 129, 0.4)' },
              { offset: 1, color: 'rgba(16, 185, 129, 0.05)' },
            ],
          },
        },
        lineStyle: { color: '#10b981', width: 2 },
        itemStyle: { color: '#10b981' },
        data: monthlyConsumption.map((d) => d.tourism / 10000),
      },
      {
        name: '工业用水',
        type: 'line',
        stack: 'Total',
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(245, 158, 11, 0.4)' },
              { offset: 1, color: 'rgba(245, 158, 11, 0.05)' },
            ],
          },
        },
        lineStyle: { color: '#f59e0b', width: 2 },
        itemStyle: { color: '#f59e0b' },
        data: monthlyConsumption.map((d) => d.industrial / 10000),
      },
    ],
  };

  const desalinationChartOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      borderColor: 'rgba(14, 165, 233, 0.3)',
      textStyle: { color: '#e2e8f0' },
    },
    legend: {
      data: ['产水量', '能耗'],
      textStyle: { color: '#94a3b8' },
      top: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: desalinationHistory.map((d) => d.date.slice(5)),
      axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } },
      axisLabel: { color: '#64748b' },
    },
    yAxis: [
      {
        type: 'value',
        name: '产水量(吨)',
        nameTextStyle: { color: '#64748b' },
        axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } },
        axisLabel: { color: '#64748b' },
        splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.1)' } },
      },
      {
        type: 'value',
        name: '能耗(kWh)',
        nameTextStyle: { color: '#64748b' },
        axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } },
        axisLabel: { color: '#64748b' },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: '产水量',
        type: 'bar',
        barWidth: '40%',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#0ea5e9' },
              { offset: 1, color: '#0284c7' },
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
        data: desalinationHistory.map((d) => d.output),
      },
      {
        name: '能耗',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        lineStyle: { color: '#f59e0b', width: 2 },
        itemStyle: { color: '#f59e0b' },
        data: desalinationHistory.map((d) => d.energy),
      },
    ],
  };

  const levelColors: Record<string, string> = {
    minor: 'bg-amber-500',
    major: 'bg-orange-500',
    critical: 'bg-red-500',
  };

  const boatStatusColors: Record<string, string> = {
    docked: 'text-emerald-400',
    sailing: 'text-sky-400',
    loading: 'text-amber-400',
    unloading: 'text-cyan-400',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">调度总览</h1>
          <p className="text-sm text-slate-400 mt-1">海岛淡水供应调度系统实时监控</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <div className="w-2 h-2 rounded-full bg-emerald-500 status-pulse" />
            <span className="text-sm text-emerald-400">系统运行正常</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="总蓄水量"
          value={formatNumber(totalStorage / 10000, 1)}
          unit="万m³"
          icon={Waves}
          trend={2.5}
          trendLabel="较昨日"
          status={parseFloat(storageRate) > 60 ? 'normal' : 'warning'}
        />
        <StatCard
          title="日产水量"
          value={formatNumber(totalDesalination)}
          unit="吨/日"
          icon={Droplets}
          trend={5.2}
          trendLabel="较上周"
          status="normal"
        />
        <StatCard
          title="管网压力"
          value="0.42"
          unit="MPa"
          icon={Gauge}
          trend={-1.8}
          trendLabel="较昨日"
          status="normal"
        />
        <StatCard
          title="日用水量"
          value={formatNumber(supplyStatistics.totalConsumption / 365 / 10000, 1)}
          unit="万吨"
          icon={Users}
          trend={3.4}
          trendLabel="较上周"
          status="normal"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">用水趋势分析</h3>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-xs rounded-lg bg-ocean-500/20 text-ocean-400 border border-ocean-500/30">
                月度
              </button>
              <button className="px-3 py-1 text-xs rounded-lg text-slate-400 hover:bg-slate-700/50">
                季度
              </button>
              <button className="px-3 py-1 text-xs rounded-lg text-slate-400 hover:bg-slate-700/50">
                年度
              </button>
            </div>
          </div>
          <div className="h-72">
            <ReactECharts option={supplyChartOption} style={{ height: '100%' }} />
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">应急事件</h3>
            <span className="text-xs text-slate-400">
              进行中 {activeEvents.length} 件
            </span>
          </div>
          <div className="space-y-3 max-h-72 overflow-y-auto">
            {activeEvents.slice(0, 4).map((event) => (
              <div
                key={event.id}
                className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-ocean-500/30 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 status-pulse ${levelColors[event.level]}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-200 truncate">
                        {getEventTypeText(event.type)}
                      </p>
                      <StatusBadge status={event.status} />
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {event.description}
                    </p>
                    <p className="text-xs text-slate-600 mt-2">
                      {getRelativeTime(event.startTime)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-ocean-400 hover:text-ocean-300 flex items-center justify-center gap-1">
            查看全部 <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">海水淡化产量</h3>
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <div className="h-64">
            <ReactECharts option={desalinationChartOption} style={{ height: '100%' }} />
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">运水船状态</h3>
            <Ship className="w-5 h-5 text-ocean-400" />
          </div>
          <div className="space-y-3">
            {waterBoats.map((boat) => (
              <div
                key={boat.id}
                className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-ocean-500/20 flex items-center justify-center">
                      <Ship className="w-5 h-5 text-ocean-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">{boat.name}</p>
                      <p className="text-xs text-slate-500">{boat.currentLocation}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium ${boatStatusColors[boat.status]}`}>
                    {boat.status === 'docked' && '停靠中'}
                    {boat.status === 'sailing' && '航行中'}
                    {boat.status === 'loading' && '装载中'}
                    {boat.status === 'unloading' && '卸载中'}
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>载水量</span>
                    <span>{boat.currentLoad} / {boat.capacity} 吨</span>
                  </div>
                  <div className="progress-bar h-1.5">
                    <div
                      className="progress-fill bg-gradient-to-r from-ocean-500 to-cyan-500"
                      style={{ width: `${(boat.currentLoad / boat.capacity) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">设备状态</h3>
            <Wrench className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-sm text-slate-300">正常运行</span>
              </div>
              <span className="text-lg font-bold text-emerald-400 data-value">
                {equipment.filter(e => e.status === 'normal').length}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-sm text-slate-300">待维保</span>
              </div>
              <span className="text-lg font-bold text-amber-400 data-value">
                {dueEquipment}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500 status-pulse" />
                <span className="text-sm text-slate-300">维保超期</span>
              </div>
              <span className="text-lg font-bold text-red-400 data-value">
                {overdueEquipment}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-700/30">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">设备总数</span>
              <span className="text-white font-semibold">{equipment.length} 台</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">水库蓄水状态</h3>
          </div>
          <div className="space-y-4">
            {waterSources.filter(s => s.type === 'reservoir').map((source) => {
              const rate = (source.currentVolume / source.capacity) * 100;
              return (
                <div key={source.id} className="p-3 rounded-lg bg-slate-800/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Waves className="w-4 h-4 text-ocean-400" />
                      <span className="text-sm font-medium text-slate-200">{source.name}</span>
                    </div>
                    <StatusBadge status={source.status} showPulse />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-500',
                            rate > 60 ? 'bg-gradient-to-r from-ocean-500 to-cyan-500' :
                            rate > 30 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                            'bg-gradient-to-r from-red-500 to-rose-500'
                          )}
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-white data-value">
                        {rate.toFixed(1)}%
                      </span>
                      <p className="text-xs text-slate-500">
                        {formatVolume(source.currentVolume)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">最新告警</h3>
            <span className="text-xs text-red-400">{alarmCount} 条未读</span>
          </div>
          <div className="space-y-3">
            {alerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  'p-3 rounded-lg border transition-colors cursor-pointer',
                  !alert.read
                    ? 'bg-ocean-500/5 border-ocean-500/20'
                    : 'bg-slate-800/30 border-slate-700/30'
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'w-2 h-2 rounded-full mt-1.5 flex-shrink-0',
                      alert.type === 'alarm' ? 'bg-red-500 status-pulse' :
                      alert.type === 'warning' ? 'bg-amber-500' : 'bg-sky-500'
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-200">{alert.title}</p>
                      <span className="text-xs text-slate-500 whitespace-nowrap ml-2">
                        {getRelativeTime(alert.time)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{alert.message}</p>
                    <p className="text-xs text-slate-600 mt-1">来源：{alert.source}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
