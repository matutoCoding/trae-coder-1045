import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  Droplets,
  Zap,
  Activity,
  Gauge,
  TrendingUp,
  Settings,
  Clock,
  Play,
  Pause,
  AlertTriangle,
} from 'lucide-react';
import StatusBadge from '@/components/common/StatusBadge';
import { useAppStore } from '@/store';
import { formatNumber, cn } from '@/utils/format';
import { desalinationHistory } from '@/data/mockData';

export default function Desalination() {
  const { desalinationPlants } = useAppStore();
  const [selectedPlant, setSelectedPlant] = useState('dp001');

  const totalOutput = desalinationPlants.reduce((sum, p) => sum + p.currentOutput, 0);
  const totalCapacity = desalinationPlants.reduce((sum, p) => sum + p.capacity, 0);
  const totalEnergy = desalinationPlants.reduce((sum, p) => sum + p.energyConsumption, 0);
  const avgEfficiency =
    desalinationPlants.filter((p) => p.status === 'running').reduce((sum, p) => sum + p.efficiency, 0) /
    Math.max(desalinationPlants.filter((p) => p.status === 'running').length, 1);

  const currentPlant = desalinationPlants.find((p) => p.id === selectedPlant);

  const outputChartOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      borderColor: 'rgba(14, 165, 233, 0.3)',
      textStyle: { color: '#e2e8f0' },
    },
    legend: {
      data: ['产水量', '产能利用率'],
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
        name: '利用率(%)',
        nameTextStyle: { color: '#64748b' },
        max: 100,
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
              { offset: 0, color: '#06b6d4' },
              { offset: 1, color: '#0891b2' },
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
        data: desalinationHistory.map((d) => d.output),
      },
      {
        name: '产能利用率',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        lineStyle: { color: '#f59e0b', width: 2 },
        itemStyle: { color: '#f59e0b' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(245, 158, 11, 0.2)' },
              { offset: 1, color: 'rgba(245, 158, 11, 0)' },
            ],
          },
        },
        data: desalinationHistory.map((d) => ((d.output / 20000) * 100)),
      },
    ],
  };

  const energyChartOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      borderColor: 'rgba(14, 165, 233, 0.3)',
      textStyle: { color: '#e2e8f0' },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: desalinationHistory.map((d) => d.date.slice(5)),
      axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } },
      axisLabel: { color: '#64748b' },
    },
    yAxis: {
      type: 'value',
      name: '能耗(kWh)',
      nameTextStyle: { color: '#64748b' },
      axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } },
      axisLabel: { color: '#64748b' },
      splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.1)' } },
    },
    series: [
      {
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: '#10b981', width: 2 },
        itemStyle: { color: '#10b981' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
              { offset: 1, color: 'rgba(16, 185, 129, 0.02)' },
            ],
          },
        },
        data: desalinationHistory.map((d) => d.energy),
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">淡化生产</h1>
          <p className="text-sm text-slate-400 mt-1">海水淡化生产监控与能耗管理</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">生产计划</button>
          <button className="btn-primary">调度指令</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">日产水量</p>
              <p className="text-2xl font-bold text-white mt-2 data-value">
                {formatNumber(totalOutput)}
                <span className="text-sm font-normal text-slate-400 ml-1">吨</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
              <Droplets className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +5.8%
            </span>
            <span className="text-slate-500">较昨日</span>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">产能利用率</p>
              <p className="text-2xl font-bold text-white mt-2 data-value">
                {((totalOutput / totalCapacity) * 100).toFixed(1)}
                <span className="text-sm font-normal text-slate-400 ml-1">%</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ocean-500 to-cyan-500 flex items-center justify-center">
              <Gauge className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-500"
                style={{ width: `${(totalOutput / totalCapacity) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">日耗电量</p>
              <p className="text-2xl font-bold text-white mt-2 data-value">
                {formatNumber(totalEnergy)}
                <span className="text-sm font-normal text-slate-400 ml-1">kWh</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-red-400 flex items-center gap-1">
              -2.3%
            </span>
            <span className="text-slate-500">较昨日</span>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">平均能效比</p>
              <p className="text-2xl font-bold text-white mt-2 data-value">
                {avgEfficiency.toFixed(1)}
                <span className="text-sm font-normal text-slate-400 ml-1">%</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <StatusBadge status={avgEfficiency > 85 ? 'normal' : 'warning'} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3">
          <h3 className="section-title">淡化设备</h3>
          {desalinationPlants.map((plant) => {
            const isSelected = selectedPlant === plant.id;
            const utilization = (plant.currentOutput / plant.capacity) * 100;

            return (
              <div
                key={plant.id}
                onClick={() => setSelectedPlant(plant.id)}
                className={cn(
                  'p-4 rounded-xl cursor-pointer transition-all duration-200',
                  isSelected
                    ? 'bg-cyan-500/15 border border-cyan-500/40 shadow-glow'
                    : 'glass-card hover:border-cyan-500/30'
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center',
                        plant.status === 'running'
                          ? 'bg-emerald-500/20'
                          : plant.status === 'standby'
                          ? 'bg-amber-500/20'
                          : plant.status === 'maintenance'
                          ? 'bg-sky-500/20'
                          : 'bg-red-500/20'
                      )}
                    >
                      <Settings
                        className={cn(
                          'w-5 h-5',
                          plant.status === 'running'
                            ? 'text-emerald-400'
                            : plant.status === 'standby'
                            ? 'text-amber-400'
                            : plant.status === 'maintenance'
                            ? 'text-sky-400'
                            : 'text-red-400'
                        )}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-white">{plant.name}</p>
                      <StatusBadge status={plant.status} showPulse />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mt-3 pt-3 border-t border-slate-700/30">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">产水量</span>
                    <span className="text-slate-300">
                      {formatNumber(plant.currentOutput)} / {formatNumber(plant.capacity)} 吨/日
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        plant.status === 'running'
                          ? 'bg-gradient-to-r from-cyan-500 to-teal-500'
                          : 'bg-slate-600'
                      )}
                      style={{ width: `${utilization}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>运行 {plant.operatingHours} 小时</span>
                    <span>{utilization.toFixed(0)}%</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-3 pt-3 border-t border-slate-700/30">
                  {plant.status === 'running' ? (
                    <button className="flex-1 py-1.5 text-xs rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 flex items-center justify-center gap-1">
                      <Pause className="w-3 h-3" />
                      暂停
                    </button>
                  ) : (
                    <button className="flex-1 py-1.5 text-xs rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 flex items-center justify-center gap-1">
                      <Play className="w-3 h-3" />
                      启动
                    </button>
                  )}
                  <button className="flex-1 py-1.5 text-xs rounded-lg bg-slate-700/50 text-slate-400 hover:bg-slate-600/50">
                    详情
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title">产水量趋势</h3>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-xs rounded-lg bg-ocean-500/20 text-ocean-400 border border-ocean-500/30">
                  近15天
                </button>
                <button className="px-3 py-1 text-xs rounded-lg text-slate-400 hover:bg-slate-700/50">
                  近30天
                </button>
                <button className="px-3 py-1 text-xs rounded-lg text-slate-400 hover:bg-slate-700/50">
                  近90天
                </button>
              </div>
            </div>
            <div className="h-72">
              <ReactECharts option={outputChartOption} style={{ height: '100%' }} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-5">
              <h3 className="section-title mb-4">能耗趋势</h3>
              <div className="h-48">
                <ReactECharts option={energyChartOption} style={{ height: '100%' }} />
              </div>
            </div>

            <div className="glass-card p-5">
              <h3 className="section-title mb-4">
                {currentPlant?.name} 详细参数
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <p className="text-xs text-slate-500">当前产水</p>
                    <p className="text-lg font-bold text-cyan-400 mt-1 data-value">
                      {formatNumber(currentPlant?.currentOutput || 0)}
                      <span className="text-xs font-normal text-slate-500 ml-1">吨/日</span>
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <p className="text-xs text-slate-500">设计产能</p>
                    <p className="text-lg font-bold text-white mt-1 data-value">
                      {formatNumber(currentPlant?.capacity || 0)}
                      <span className="text-xs font-normal text-slate-500 ml-1">吨/日</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <p className="text-xs text-slate-500">运行时间</p>
                    <p className="text-lg font-bold text-white mt-1 flex items-center gap-1">
                      <Clock className="w-4 h-4 text-ocean-400" />
                      {currentPlant?.operatingHours}
                      <span className="text-xs font-normal text-slate-500">小时</span>
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <p className="text-xs text-slate-500">能效比</p>
                    <p className="text-lg font-bold text-emerald-400 mt-1 data-value">
                      {currentPlant?.efficiency || 0}
                      <span className="text-xs font-normal text-slate-500 ml-1">%</span>
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-slate-500">水质达标率</p>
                    <p className="text-sm font-medium text-emerald-400">
                      {currentPlant?.waterQuality || 0}%
                    </p>
                  </div>
                  <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                      style={{ width: `${currentPlant?.waterQuality || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-title">生产运行记录</h3>
          <button className="text-sm text-ocean-400 hover:text-ocean-300">
            查看全部
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>设备名称</th>
                <th>日期</th>
                <th>产水量(吨)</th>
                <th>耗电量(kWh)</th>
                <th>能效比</th>
                <th>水质</th>
                <th>运行时长</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              {desalinationPlants.map((plant) => (
                <tr key={plant.id}>
                  <td className="font-medium text-white">{plant.name}</td>
                  <td className="text-slate-400">2026-06-18</td>
                  <td className="text-slate-300">{formatNumber(plant.currentOutput)}</td>
                  <td className="text-slate-300">{formatNumber(plant.energyConsumption)}</td>
                  <td className="text-emerald-400">{plant.efficiency}%</td>
                  <td className="text-cyan-400">{plant.waterQuality}%</td>
                  <td className="text-slate-300">{plant.operatingHours}h</td>
                  <td>
                    <StatusBadge status={plant.status} showPulse />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
