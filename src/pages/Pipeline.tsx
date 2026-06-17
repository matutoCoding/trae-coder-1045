import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  Gauge,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  MapPin,
  Activity,
  Droplets,
  Layers,
} from 'lucide-react';
import StatusBadge from '@/components/common/StatusBadge';
import { useAppStore } from '@/store';
import { formatNumber, getStatusText, cn } from '@/utils/format';
import { generatePressureHistory } from '@/data/mockData';

const pressureHistoryData = generatePressureHistory();

export default function Pipeline() {
  const { pressurePoints } = useAppStore();
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);

  const normalCount = pressurePoints.filter((p) => p.status === 'normal').length;
  const lowCount = pressurePoints.filter((p) => p.status === 'low').length;
  const highCount = pressurePoints.filter((p) => p.status === 'high').length;
  const totalFlow = pressurePoints.reduce((sum, p) => sum + p.flowRate, 0);

  const selectedPointData = pressurePoints.find((p) => p.id === selectedPoint);

  const pressureChartOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      borderColor: 'rgba(14, 165, 233, 0.3)',
      textStyle: { color: '#e2e8f0' },
      formatter: (params: any) => {
        const data = params[0];
        const time = new Date(data.name);
        return `${time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}<br/>压力: ${data.value} MPa`;
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
      data: pressureHistoryData.map((d) => d.time),
      axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } },
      axisLabel: {
        color: '#64748b',
        formatter: (value: string) => {
          const date = new Date(value);
          return `${date.getHours()}:00`;
        },
      },
    },
    yAxis: {
      type: 'value',
      name: '压力(MPa)',
      nameTextStyle: { color: '#64748b' },
      min: 0.2,
      max: 0.6,
      axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } },
      axisLabel: { color: '#64748b' },
      splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.1)' } },
    },
    series: [
      {
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { color: '#06b6d4', width: 2 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(6, 182, 212, 0.4)' },
              { offset: 1, color: 'rgba(6, 182, 212, 0.02)' },
            ],
          },
        },
        markLine: {
          silent: true,
          lineStyle: { color: '#f59e0b', type: 'dashed' },
          data: [
            { yAxis: 0.5, label: { show: true, position: 'end', formatter: '高限', color: '#f59e0b' } },
            { yAxis: 0.3, label: { show: true, position: 'end', formatter: '低限', color: '#f97316' } },
          ],
        },
        data: pressureHistoryData.map((d) => d.pressure),
      },
    ],
  };

  const flowChartOption = {
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
      boundaryGap: false,
      data: pressureHistoryData.map((d) => d.time),
      axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } },
      axisLabel: {
        color: '#64748b',
        formatter: (value: string) => {
          const date = new Date(value);
          return `${date.getHours()}:00`;
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
        data: pressureHistoryData.map((d) => d.flow),
      },
    ],
  };

  const getPointColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-emerald-500';
      case 'low':
        return 'bg-orange-500';
      case 'high':
        return 'bg-red-500';
      default:
        return 'bg-slate-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">管网配送</h1>
          <p className="text-sm text-slate-400 mt-1">管网压力流量实时监控与爆管预警</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Activity className="w-4 h-4" />
            实时监测
          </button>
          <button className="btn-primary">爆管预警</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">监测点数量</p>
              <p className="text-2xl font-bold text-white mt-2 data-value">
                {pressurePoints.length}
                <span className="text-sm font-normal text-slate-400 ml-1">个</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ocean-500 to-cyan-500 flex items-center justify-center">
              <Gauge className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-emerald-400 text-sm">正常 {normalCount}</span>
            <span className="text-orange-400 text-sm">偏低 {lowCount}</span>
            <span className="text-red-400 text-sm">偏高 {highCount}</span>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">平均压力</p>
              <p className="text-2xl font-bold text-white mt-2 data-value">
                {pressurePoints.reduce((s, p) => s + p.pressure, 0) / pressurePoints.length? 0.42 : 0}
                <span className="text-sm font-normal text-slate-400 ml-1">MPa</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              正常范围
            </span>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">总输水量</p>
              <p className="text-2xl font-bold text-white mt-2 data-value">
                {formatNumber(totalFlow)}
                <span className="text-sm font-normal text-slate-400 ml-1">m³/h</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Droplets className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +4.2%
            </span>
            <span className="text-slate-500">较昨日</span>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">管网漏损率</p>
              <p className="text-2xl font-bold text-white mt-2 data-value">
                6.9
                <span className="text-sm font-normal text-slate-400 ml-1">%</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-emerald-400 flex items-center gap-1">
              <TrendingDown className="w-4 h-4" />
              -0.5%
            </span>
            <span className="text-slate-500">较上月</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">管网压力分布</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs text-slate-400">正常</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-xs text-slate-400">偏低</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-xs text-slate-400">偏高</span>
              </div>
            </div>
          </div>

          <div className="relative h-96 rounded-xl bg-slate-800/30 overflow-hidden border border-slate-700/30">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(14, 165, 233, 0.05)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />

              <path d="M 15 45 Q 30 30 50 50 T 85 55" fill="none" stroke="rgba(14, 165, 233, 0.3)" strokeWidth="1.5" />
              <path d="M 35 15 Q 45 35 50 50" fill="none" stroke="rgba(14, 165, 233, 0.3)" strokeWidth="1.5" />
              <path d="M 75 20 Q 65 40 50 50" fill="none" stroke="rgba(14, 165, 233, 0.3)" strokeWidth="1.5" />
              <path d="M 25 80 Q 40 65 50 50" fill="none" stroke="rgba(14, 165, 233, 0.3)" strokeWidth="1.5" />
              <path d="M 85 75 Q 70 60 50 50" fill="none" stroke="rgba(14, 165, 233, 0.3)" strokeWidth="1.5" />

              <circle cx="50" cy="50" r="3" fill="#0ea5e9" className="animate-pulse" />
              <text x="50" y="45" textAnchor="middle" fill="#94a3b8" fontSize="3">水厂</text>
            </svg>

            {pressurePoints.map((point) => (
              <div
                key={point.id}
                onClick={() => setSelectedPoint(point.id)}
                className={cn(
                  'absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125',
                  selectedPoint === point.id && 'z-10'
                )}
                style={{ left: `${point.location.x}%`, top: `${point.location.y}%` }}
              >
                <div className="relative">
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full border-2 border-white/30 status-pulse',
                      getPointColor(point.status)
                    )}
                  />
                  {selectedPoint === point.id && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 p-2 glass-card text-center">
                      <p className="text-xs font-medium text-white">{point.name}</p>
                      <p className="text-xs text-ocean-400 font-mono">{point.pressure} MPa</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card p-5">
            <h3 className="section-title mb-4">压力监测点</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {pressurePoints.map((point) => (
                <div
                  key={point.id}
                  onClick={() => setSelectedPoint(point.id)}
                  className={cn(
                    'p-3 rounded-lg cursor-pointer transition-all duration-200',
                    selectedPoint === point.id
                      ? 'bg-ocean-500/20 border border-ocean-500/40'
                      : 'bg-slate-800/30 border border-transparent hover:border-ocean-500/30'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'w-2.5 h-2.5 rounded-full',
                          getPointColor(point.status)
                        )}
                      />
                      <span className="text-sm text-white font-medium">{point.name}</span>
                    </div>
                    <StatusBadge status={point.status} />
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-lg font-bold text-cyan-400 data-value">
                      {point.pressure}
                      <span className="text-xs font-normal text-slate-500 ml-1">MPa</span>
                    </span>
                    <span className="text-xs text-slate-500">
                      流量 {point.flowRate} m³/h
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedPointData && (
            <div className="glass-card p-5">
              <h3 className="section-title mb-4">{selectedPointData.name}</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">当前压力</span>
                  <span className="text-sm text-white font-medium">
                    {selectedPointData.pressure} MPa
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">正常范围</span>
                  <span className="text-sm text-slate-300">
                    {selectedPointData.normalRange[0]} - {selectedPointData.normalRange[1]} MPa
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">瞬时流量</span>
                  <span className="text-sm text-white font-medium">
                    {selectedPointData.flowRate} m³/h
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">最后更新</span>
                  <span className="text-sm text-slate-300 text-right">
                    {new Date(selectedPointData.lastUpdate).toLocaleTimeString('zh-CN')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">24小时压力趋势</h3>
            <Layers className="w-5 h-5 text-ocean-400" />
          </div>
          <div className="h-56">
            <ReactECharts option={pressureChartOption} style={{ height: '100%' }} />
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">24小时流量趋势</h3>
            <Droplets className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="h-56">
            <ReactECharts option={flowChartOption} style={{ height: '100%' }} />
          </div>
        </div>
      </div>

      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-title">爆管预警记录</h3>
          <button className="text-sm text-ocean-400 hover:text-ocean-300">
            查看全部
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>预警编号</th>
                <th>位置</th>
                <th>类型</th>
                <th>级别</th>
                <th>发生时间</th>
                <th>处理状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-mono text-slate-300">PG20260618001</td>
                <td className="text-slate-300">南区调压站附近</td>
                <td className="text-slate-400">压力异常偏高</td>
                <td>
                  <span className="text-amber-400 text-sm">一般</span>
                </td>
                <td className="text-slate-400">2026-06-18 10:15</td>
                <td>
                  <StatusBadge status="processing" />
                </td>
                <td>
                  <button className="text-ocean-400 text-sm hover:text-ocean-300">
                    处理
                  </button>
                </td>
              </tr>
              <tr>
                <td className="font-mono text-slate-300">PG20260617002</td>
                <td className="text-slate-300">北村监测点</td>
                <td className="text-slate-400">压力持续偏低</td>
                <td>
                  <span className="text-orange-400 text-sm">重要</span>
                </td>
                <td className="text-slate-400">2026-06-17 14:30</td>
                <td>
                  <StatusBadge status="processing" />
                </td>
                <td>
                  <button className="text-ocean-400 text-sm hover:text-ocean-300">
                    处理
                  </button>
                </td>
              </tr>
              <tr>
                <td className="font-mono text-slate-300">PG20260616003</td>
                <td className="text-slate-300">东海岸监测点</td>
                <td className="text-slate-400">流量异常波动</td>
                <td>
                  <span className="text-emerald-400 text-sm">一般</span>
                </td>
                <td className="text-slate-400">2026-06-16 09:45</td>
                <td>
                  <StatusBadge status="resolved" />
                </td>
                <td>
                  <button className="text-ocean-400 text-sm hover:text-ocean-300">
                    详情
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
