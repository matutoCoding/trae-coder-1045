import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  Users,
  Home,
  Building2,
  Sun,
  Factory,
  TrendingUp,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
} from 'lucide-react';
import { useAppStore } from '@/store';
import { formatNumber, cn } from '@/utils/format';
import { monthlyConsumption, consumptionRecords } from '@/data/mockData';

export default function Consumption() {
  const { consumptionRecords: dailyRecords } = useAppStore();
  const [viewMode, setViewMode] = useState<'monthly' | 'daily'>('monthly');
  const [selectedMonth, setSelectedMonth] = useState(6);

  const totalAnnual = monthlyConsumption.reduce((sum, m) => sum + m.total, 0);
  const avgMonthly = totalAnnual / 12;
  const peakMonth = monthlyConsumption.reduce((max, m) => (m.total > max.total ? m : max), monthlyConsumption[0]);

  const pieOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      borderColor: 'rgba(14, 165, 233, 0.3)',
      textStyle: { color: '#e2e8f0' },
      formatter: '{b}: {c} 万吨 ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: { color: '#94a3b8' },
      itemGap: 12,
    },
    series: [
      {
        name: '用水量',
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#0f172a',
          borderWidth: 2,
        },
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            color: '#e2e8f0',
          },
        },
        data: [
          { value: 36.5, name: '居民用水', itemStyle: { color: '#0ea5e9' } },
          { value: 28.2, name: '商业用水', itemStyle: { color: '#06b6d4' } },
          { value: 22.8, name: '旅游用水', itemStyle: { color: '#10b981' } },
          { value: 12.5, name: '工业用水', itemStyle: { color: '#f59e0b' } },
        ],
      },
    ],
  };

  const barOption = {
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
      data: monthlyConsumption.map((m) => m.month),
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
        type: 'bar',
        stack: 'total',
        barWidth: '50%',
        itemStyle: { color: '#0ea5e9' },
        data: monthlyConsumption.map((m) => m.residential / 10000),
      },
      {
        name: '商业用水',
        type: 'bar',
        stack: 'total',
        itemStyle: { color: '#06b6d4' },
        data: monthlyConsumption.map((m) => m.commercial / 10000),
      },
      {
        name: '旅游用水',
        type: 'bar',
        stack: 'total',
        itemStyle: { color: '#10b981' },
        data: monthlyConsumption.map((m) => m.tourism / 10000),
      },
      {
        name: '工业用水',
        type: 'bar',
        stack: 'total',
        itemStyle: { color: '#f59e0b' },
        data: monthlyConsumption.map((m) => m.industrial / 10000),
      },
    ],
  };

  const trendOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      borderColor: 'rgba(14, 165, 233, 0.3)',
      textStyle: { color: '#e2e8f0' },
    },
    legend: {
      data: ['日用水量', '月度平均'],
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
      data: dailyRecords.map((r) => r.date.slice(5)),
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
        name: '日用水量',
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
              { offset: 0, color: 'rgba(14, 165, 233, 0.3)' },
              { offset: 1, color: 'rgba(14, 165, 233, 0.02)' },
            ],
          },
        },
        data: dailyRecords.map((r) => (r.total / 10000).toFixed(1)),
      },
      {
        name: '月度平均',
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { color: '#f59e0b', type: 'dashed', width: 1 },
        data: dailyRecords.map(() => (avgMonthly / 30).toFixed(1)),
      },
    ],
  };

  const categoryCards = [
    {
      title: '居民用水',
      value: 36.5,
      unit: '%',
      icon: Home,
      color: 'from-ocean-500 to-cyan-500',
      volume: '333',
      volumeUnit: '万吨/年',
    },
    {
      title: '商业用水',
      value: 28.2,
      unit: '%',
      icon: Building2,
      color: 'from-cyan-500 to-teal-500',
      volume: '257',
      volumeUnit: '万吨/年',
    },
    {
      title: '旅游用水',
      value: 22.8,
      unit: '%',
      icon: Sun,
      color: 'from-emerald-500 to-teal-500',
      volume: '208',
      volumeUnit: '万吨/年',
    },
    {
      title: '工业用水',
      value: 12.5,
      unit: '%',
      icon: Factory,
      color: 'from-amber-500 to-orange-500',
      volume: '114',
      volumeUnit: '万吨/年',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">用水管理</h1>
          <p className="text-sm text-slate-400 mt-1">居民用水计量、旅游旺季调度与用水统计分析</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            2026年度
          </button>
          <button className="btn-primary">用水统计</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">年度总用水量</p>
              <p className="text-2xl font-bold text-white mt-2 data-value">
                {formatNumber(totalAnnual / 10000, 1)}
                <span className="text-sm font-normal text-slate-400 ml-1">万吨</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ocean-500 to-cyan-500 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +6.8%
            </span>
            <span className="text-slate-500">较去年</span>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">月均用水量</p>
              <p className="text-2xl font-bold text-white mt-2 data-value">
                {formatNumber(avgMonthly / 10000, 1)}
                <span className="text-sm font-normal text-slate-400 ml-1">万吨</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-500"
                style={{ width: '75%' }}
              />
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">用水峰值月</p>
              <p className="text-2xl font-bold text-white mt-2 data-value">
                {peakMonth.month}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-amber-400">{formatNumber(peakMonth.total / 10000, 1)} 万吨</span>
            <span className="text-slate-500 ml-2">旅游旺季</span>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">人均日用水</p>
              <p className="text-2xl font-bold text-white mt-2 data-value">
                128
                <span className="text-sm font-normal text-slate-400 ml-1">升</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <PieChart className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-emerald-400">达标</span>
            <span className="text-slate-500">国家标准 180L</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">月度用水趋势</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('monthly')}
                className={cn(
                  'px-3 py-1 text-xs rounded-lg',
                  viewMode === 'monthly'
                    ? 'bg-ocean-500/20 text-ocean-400 border border-ocean-500/30'
                    : 'text-slate-400 hover:bg-slate-700/50'
                )}
              >
                月度
              </button>
              <button
                onClick={() => setViewMode('daily')}
                className={cn(
                  'px-3 py-1 text-xs rounded-lg',
                  viewMode === 'daily'
                    ? 'bg-ocean-500/20 text-ocean-400 border border-ocean-500/30'
                    : 'text-slate-400 hover:bg-slate-700/50'
                )}
              >
                近30天
              </button>
            </div>
          </div>
          <div className="h-72">
            <ReactECharts
              option={viewMode === 'monthly' ? barOption : trendOption}
              style={{ height: '100%' }}
            />
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="section-title mb-4">用水结构占比</h3>
          <div className="h-64">
            <ReactECharts option={pieOption} style={{ height: '100%' }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categoryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="glass-card p-5 glass-card-hover">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-white data-value">
                  {card.value}
                  <span className="text-sm font-normal text-slate-400">{card.unit}</span>
                </span>
              </div>
              <p className="text-sm text-slate-300 font-medium">{card.title}</p>
              <p className="text-xs text-slate-500 mt-1">
                {card.volume} {card.volumeUnit}
              </p>
              <div className="mt-3 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${card.color}`}
                  style={{ width: `${card.value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">旅游旺季用水对比</h3>
          </div>
          <div className="space-y-4">
            {[
              { month: '7月', tourism: 14.8, residential: 13.2, ratio: '52.9%' },
              { month: '8月', tourism: 15.8, residential: 13.8, ratio: '53.4%' },
              { month: '6月', tourism: 12.5, residential: 12.5, ratio: '50.0%' },
              { month: '5月', tourism: 10.2, residential: 11.8, ratio: '46.4%' },
              { month: '9月', tourism: 12.8, residential: 12.8, ratio: '50.0%' },
              { month: '10月', tourism: 10.8, residential: 12.2, ratio: '47.0%' },
            ].map((item) => (
              <div key={item.month} className="p-3 rounded-lg bg-slate-800/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{item.month}</span>
                  <span className="text-xs text-amber-400">旅游占比 {item.ratio}</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">旅游用水</span>
                      <span className="text-emerald-400">{item.tourism} 万吨</span>
                    </div>
                    <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${(item.tourism / 16) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">居民用水</span>
                      <span className="text-ocean-400">{item.residential} 万吨</span>
                    </div>
                    <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-ocean-500"
                        style={{ width: `${(item.residential / 16) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">居民用水计量</h3>
            <button className="text-sm text-ocean-400 hover:text-ocean-300">
              查看详情
            </button>
          </div>
          <div className="space-y-4">
            {[
              { area: '东港区', households: 1280, avgUsage: 135, trend: '+2.3%' },
              { area: '西岛区', households: 850, avgUsage: 128, trend: '-1.2%' },
              { area: '南城区', households: 2100, avgUsage: 142, trend: '+3.5%' },
              { area: '北村区', households: 620, avgUsage: 115, trend: '+0.8%' },
              { area: '中心区', households: 1560, avgUsage: 125, trend: '-0.5%' },
              { area: '旅游度假区', households: 450, avgUsage: 280, trend: '+12.5%' },
            ].map((item) => (
              <div
                key={item.area}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-ocean-500/20 flex items-center justify-center">
                    <Home className="w-5 h-5 text-ocean-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{item.area}</p>
                    <p className="text-xs text-slate-500">{item.households} 户</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-cyan-400 data-value">
                    {item.avgUsage}
                    <span className="text-xs font-normal text-slate-500 ml-1">L/户·日</span>
                  </p>
                  <p
                    className={cn(
                      'text-xs',
                      item.trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
                    )}
                  >
                    {item.trend} 较上月
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-5">
        <h3 className="section-title mb-4">每日用水记录</h3>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>日期</th>
                <th>居民用水</th>
                <th>商业用水</th>
                <th>旅游用水</th>
                <th>工业用水</th>
                <th>总计</th>
                <th>环比</th>
              </tr>
            </thead>
            <tbody>
              {dailyRecords.slice(0, 10).map((record, index) => {
                const prev = dailyRecords[index + 1];
                const change = prev
                  ? (((record.total - prev.total) / prev.total) * 100).toFixed(1)
                  : '0';
                return (
                  <tr key={record.id}>
                    <td className="text-slate-300">{record.date}</td>
                    <td className="text-slate-400">{record.residential.toFixed(0)} m³</td>
                    <td className="text-slate-400">{record.commercial.toFixed(0)} m³</td>
                    <td className="text-slate-400">{record.tourism.toFixed(0)} m³</td>
                    <td className="text-slate-400">{record.industrial.toFixed(0)} m³</td>
                    <td className="text-white font-medium">{record.total.toFixed(0)} m³</td>
                    <td>
                      <span
                        className={cn(
                          'text-sm',
                          parseFloat(change) >= 0 ? 'text-red-400' : 'text-emerald-400'
                        )}
                      >
                        {parseFloat(change) >= 0 ? '+' : ''}
                        {change}%
                      </span>
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
