import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  Waves,
  TrendingUp,
  TrendingDown,
  CloudRain,
  Gauge,
  Activity,
  Droplets,
} from 'lucide-react';
import StatusBadge from '@/components/common/StatusBadge';
import { useAppStore } from '@/store';
import { formatVolume, formatNumber, cn } from '@/utils/format';
import { waterLevelData, rainwaterCollection } from '@/data/mockData';

export default function Storage() {
  const { waterSources } = useAppStore();
  const [selectedReservoir, setSelectedReservoir] = useState('ws001');

  const reservoirs = waterSources.filter((s) => s.type === 'reservoir');
  const currentReservoir = waterSources.find((s) => s.id === selectedReservoir);
  const levelData = waterLevelData[selectedReservoir] || [];

  const totalStorage = reservoirs.reduce((sum, r) => sum + r.currentVolume, 0);
  const totalCapacity = reservoirs.reduce((sum, r) => sum + r.capacity, 0);
  const avgFillRate = ((totalStorage / totalCapacity) * 100).toFixed(1);

  const rainwater = waterSources.find((s) => s.type === 'rainwater');
  const groundwater = waterSources.find((s) => s.type === 'groundwater');

  const levelChartOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      borderColor: 'rgba(14, 165, 233, 0.3)',
      textStyle: { color: '#e2e8f0' },
      formatter: (params: any) => {
        const data = params[0];
        const date = new Date(data.name);
        return `${date.toLocaleDateString('zh-CN')}<br/>水位: ${data.value} 米`;
      },
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
      boundaryGap: false,
      data: levelData.map((d) => d.timestamp),
      axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } },
      axisLabel: {
        color: '#64748b',
        formatter: (value: string) => {
          const date = new Date(value);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        },
      },
    },
    yAxis: {
      type: 'value',
      name: '水位(m)',
      nameTextStyle: { color: '#64748b' },
      axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } },
      axisLabel: { color: '#64748b' },
      splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.1)' } },
    },
    series: [
      {
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { color: '#0ea5e9', width: 2 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(14, 165, 233, 0.4)' },
              { offset: 1, color: 'rgba(14, 165, 233, 0.02)' },
            ],
          },
        },
        data: levelData.map((d) => d.waterLevel),
      },
    ],
  };

  const rainChartOption = {
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
      data: rainwaterCollection.map((d) => d.month),
      axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } },
      axisLabel: { color: '#64748b', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      name: '收集量(万吨)',
      nameTextStyle: { color: '#64748b' },
      axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } },
      axisLabel: { color: '#64748b' },
      splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.1)' } },
    },
    series: [
      {
        type: 'bar',
        barWidth: '50%',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#38bdf8' },
              { offset: 1, color: '#0284c7' },
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
        data: rainwaterCollection.map((d) => d.collection / 10000),
      },
    ],
  };

  const inflowOutflowOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      borderColor: 'rgba(14, 165, 233, 0.3)',
      textStyle: { color: '#e2e8f0' },
    },
    legend: {
      data: ['入库流量', '出库流量'],
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
      data: levelData.map((d) => d.timestamp),
      axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } },
      axisLabel: {
        color: '#64748b',
        formatter: (value: string) => {
          const date = new Date(value);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        },
      },
    },
    yAxis: {
      type: 'value',
      name: '流量(m³/h)',
      nameTextStyle: { color: '#64748b' },
      axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } },
      axisLabel: { color: '#64748b' },
      splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.1)' } },
    },
    series: [
      {
        name: '入库流量',
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { color: '#10b981', width: 2 },
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
        data: levelData.map((d) => d.inflowRate),
      },
      {
        name: '出库流量',
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { color: '#f59e0b', width: 2 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(245, 158, 11, 0.3)' },
              { offset: 1, color: 'rgba(245, 158, 11, 0.02)' },
            ],
          },
        },
        data: levelData.map((d) => d.outflowRate),
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">蓄水监控</h1>
          <p className="text-sm text-slate-400 mt-1">全岛水库水位实时监测与蓄水管理</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Activity className="w-4 h-4" />
            实时刷新
          </button>
          <button className="btn-primary">导出报表</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">总蓄水量</p>
              <p className="text-2xl font-bold text-white mt-2 data-value">
                {formatNumber(totalStorage / 10000, 1)}
                <span className="text-sm font-normal text-slate-400 ml-1">万m³</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ocean-500 to-cyan-500 flex items-center justify-center">
              <Waves className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +3.2%
            </span>
            <span className="text-slate-500">较上周</span>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">平均蓄水率</p>
              <p className="text-2xl font-bold text-white mt-2 data-value">
                {avgFillRate}
                <span className="text-sm font-normal text-slate-400 ml-1">%</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
              <Gauge className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-ocean-500 to-cyan-500"
                style={{ width: `${avgFillRate}%` }}
              />
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">雨水收集量</p>
              <p className="text-2xl font-bold text-white mt-2 data-value">
                {rainwater ? formatNumber(rainwater.currentVolume / 10000, 1) : '0'}
                <span className="text-sm font-normal text-slate-400 ml-1">万m³</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center">
              <CloudRain className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +12.5%
            </span>
            <span className="text-slate-500">本月累计</span>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">地下水补给</p>
              <p className="text-2xl font-bold text-white mt-2 data-value">
                {groundwater ? formatNumber(groundwater.currentVolume) : '0'}
                <span className="text-sm font-normal text-slate-400 ml-1">m³/日</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Droplets className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <StatusBadge status={groundwater?.status || 'normal'} showPulse />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-3">
          <h3 className="section-title">水库列表</h3>
          {reservoirs.map((reservoir) => {
            const fillRate = (reservoir.currentVolume / reservoir.capacity) * 100;
            const isSelected = selectedReservoir === reservoir.id;

            return (
              <div
                key={reservoir.id}
                onClick={() => setSelectedReservoir(reservoir.id)}
                className={cn(
                  'p-4 rounded-xl cursor-pointer transition-all duration-200',
                  isSelected
                    ? 'bg-ocean-500/20 border border-ocean-500/40 shadow-glow'
                    : 'glass-card hover:border-ocean-500/30'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Waves
                      className={cn(
                        'w-5 h-5',
                        isSelected ? 'text-ocean-400' : 'text-slate-400'
                      )}
                    />
                    <span className="font-medium text-white">{reservoir.name}</span>
                  </div>
                  <StatusBadge status={reservoir.status} />
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500">蓄水量</span>
                    <span className="text-slate-300">
                      {formatVolume(reservoir.currentVolume)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
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
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-slate-500">
                      {fillRate.toFixed(1)}%
                    </span>
                    <span className="text-xs text-slate-600">
                      总容 {formatVolume(reservoir.capacity)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title">
                {currentReservoir?.name} - 水位变化趋势
              </h3>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-xs rounded-lg bg-ocean-500/20 text-ocean-400 border border-ocean-500/30">
                  近30天
                </button>
                <button className="px-3 py-1 text-xs rounded-lg text-slate-400 hover:bg-slate-700/50">
                  近90天
                </button>
                <button className="px-3 py-1 text-xs rounded-lg text-slate-400 hover:bg-slate-700/50">
                  近一年
                </button>
              </div>
            </div>
            <div className="h-64">
              <ReactECharts option={levelChartOption} style={{ height: '100%' }} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-5">
              <h3 className="section-title mb-4">出入库流量</h3>
              <div className="h-56">
                <ReactECharts option={inflowOutflowOption} style={{ height: '100%' }} />
              </div>
            </div>

            <div className="glass-card p-5">
              <h3 className="section-title mb-4">雨水收集月度统计</h3>
              <div className="h-56">
                <ReactECharts option={rainChartOption} style={{ height: '100%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-5">
        <h3 className="section-title mb-4">水库详细信息</h3>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>水库名称</th>
                <th>位置</th>
                <th>总容量</th>
                <th>当前水量</th>
                <th>蓄水率</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {reservoirs.map((reservoir) => {
                const fillRate = (reservoir.currentVolume / reservoir.capacity) * 100;
                return (
                  <tr key={reservoir.id}>
                    <td className="font-medium text-white">{reservoir.name}</td>
                    <td className="text-slate-400">{reservoir.location}</td>
                    <td className="text-slate-300">{formatVolume(reservoir.capacity)}</td>
                    <td className="text-slate-300">{formatVolume(reservoir.currentVolume)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full',
                              fillRate > 60 ? 'bg-emerald-500' :
                              fillRate > 30 ? 'bg-amber-500' : 'bg-red-500'
                            )}
                            style={{ width: `${fillRate}%` }}
                          />
                        </div>
                        <span className="text-sm text-slate-300">
                          {fillRate.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={reservoir.status} showPulse />
                    </td>
                    <td>
                      <button className="text-ocean-400 text-sm hover:text-ocean-300">
                        查看详情
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
