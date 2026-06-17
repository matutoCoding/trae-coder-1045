import { useState } from 'react';
import {
  Wrench,
  Settings,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Plus,
  Search,
  Filter,
  FileText,
  Zap,
  CircleDot,
} from 'lucide-react';
import StatusBadge from '@/components/common/StatusBadge';
import { useAppStore } from '@/store';
import { formatDate, getEquipmentCategoryText, getStatusText, cn } from '@/utils/format';
import { maintenanceRecords } from '@/data/mockData';

const categoryIcons: Record<string, React.ElementType> = {
  pump: Zap,
  valve: Settings,
  filter: CircleDot,
  meter: Gauge,
  generator: Zap,
  other: Wrench,
};

import { Gauge } from 'lucide-react';

export default function Maintenance() {
  const { equipment } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'equipment' | 'maintenance'>('equipment');

  const totalEquipment = equipment.length;
  const normalCount = equipment.filter((e) => e.status === 'normal').length;
  const dueCount = equipment.filter((e) => e.status === 'due').length;
  const overdueCount = equipment.filter((e) => e.status === 'overdue').length;

  const filteredEquipment = equipment.filter((eq) => {
    const matchesCategory = selectedCategory === 'all' || eq.category === selectedCategory;
    const matchesSearch =
      eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['all', 'pump', 'valve', 'filter', 'meter', 'generator', 'other'];
  const categoryLabels: Record<string, string> = {
    all: '全部',
    pump: '泵类',
    valve: '阀门',
    filter: '过滤设备',
    meter: '仪表',
    generator: '发电设备',
    other: '其他',
  };

  const maintenanceTypeLabels: Record<string, string> = {
    routine: '例行维保',
    repair: '故障维修',
    inspection: '巡检',
  };

  const getDaysUntilMaintenance = (nextDate: string) => {
    const next = new Date(nextDate);
    const today = new Date();
    const diff = Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">设备维保</h1>
          <p className="text-sm text-slate-400 mt-1">设备档案管理、维保计划与记录</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <FileText className="w-4 h-4" />
            维保报表
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            新增设备
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">设备总数</p>
              <p className="text-2xl font-bold text-white mt-2 data-value">
                {totalEquipment}
                <span className="text-sm font-normal text-slate-400 ml-1">台</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ocean-500 to-cyan-500 flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-emerald-400">运行 {normalCount}</span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-400">待保 {dueCount}</span>
            <span className="text-slate-600">|</span>
            <span className="text-red-400">超期 {overdueCount}</span>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">本月维保</p>
              <p className="text-2xl font-bold text-white mt-2 data-value">
                {dueCount + overdueCount}
                <span className="text-sm font-normal text-slate-400 ml-1">台次</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                style={{ width: `${((dueCount + overdueCount) / totalEquipment) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">已完成</p>
              <p className="text-2xl font-bold text-emerald-400 mt-2 data-value">
                {maintenanceRecords.filter((r) => r.status === 'completed').length}
                <span className="text-sm font-normal text-slate-400 ml-1">项</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-500">
            本月维保完成率 {((maintenanceRecords.filter(r => r.status === 'completed').length / maintenanceRecords.length) * 100).toFixed(0)}%
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">进行中</p>
              <p className="text-2xl font-bold text-sky-400 mt-2 data-value">
                {maintenanceRecords.filter((r) => r.status === 'in-progress').length}
                <span className="text-sm font-normal text-slate-400 ml-1">项</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-500">
            预计今日完成 2 项
          </div>
        </div>
      </div>

      <div className="glass-card p-1">
        <div className="flex p-1 gap-1">
          <button
            onClick={() => setActiveTab('equipment')}
            className={cn(
              'flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all',
              activeTab === 'equipment'
                ? 'bg-ocean-500/20 text-ocean-400 border border-ocean-500/30'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            <span className="flex items-center justify-center gap-2">
              <Settings className="w-4 h-4" />
              设备列表
            </span>
          </button>
          <button
            onClick={() => setActiveTab('maintenance')}
            className={cn(
              'flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all',
              activeTab === 'maintenance'
                ? 'bg-ocean-500/20 text-ocean-400 border border-ocean-500/30'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            <span className="flex items-center justify-center gap-2">
              <Wrench className="w-4 h-4" />
              维保记录
            </span>
          </button>
        </div>
      </div>

      {activeTab === 'equipment' && (
        <>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition-all',
                    selectedCategory === cat
                      ? 'bg-ocean-500/20 text-ocean-400 border border-ocean-500/30'
                      : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-transparent'
                  )}
                >
                  {categoryLabels[cat]}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索设备..."
                  className="pl-9 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-ocean-500/50 w-48"
                />
              </div>
              <button className="btn-secondary flex items-center gap-2 py-2">
                <Filter className="w-4 h-4" />
                筛选
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredEquipment.map((eq) => {
              const Icon = categoryIcons[eq.category] || Wrench;
              const daysUntil = getDaysUntilMaintenance(eq.nextMaintenance);
              const isOverdue = daysUntil < 0;
              const isDueSoon = daysUntil >= 0 && daysUntil <= 7;

              return (
                <div
                  key={eq.id}
                  className="glass-card p-4 glass-card-hover cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center',
                          eq.status === 'normal'
                            ? 'bg-emerald-500/20'
                            : eq.status === 'due'
                            ? 'bg-amber-500/20'
                            : 'bg-red-500/20'
                        )}
                      >
                        <Icon
                          className={cn(
                            'w-5 h-5',
                            eq.status === 'normal'
                              ? 'text-emerald-400'
                              : eq.status === 'due'
                              ? 'text-amber-400'
                              : 'text-red-400'
                          )}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">{eq.name}</p>
                        <p className="text-xs text-slate-500">{eq.type}</p>
                      </div>
                    </div>
                    <StatusBadge status={eq.status} showPulse />
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">位置</span>
                      <span className="text-slate-300">{eq.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">运行时长</span>
                      <span className="text-slate-300">{eq.runHours} 小时</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">上次维保</span>
                      <span className="text-slate-300">{formatDate(eq.lastMaintenance)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">下次维保</span>
                      <span
                        className={cn(
                          isOverdue ? 'text-red-400' : isDueSoon ? 'text-amber-400' : 'text-slate-300'
                        )}
                      >
                        {formatDate(eq.nextMaintenance)}
                        {isOverdue && ` (超期${Math.abs(daysUntil)}天)`}
                        {isDueSoon && !isOverdue && ` (还有${daysUntil}天)`}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-700/30 flex gap-2">
                    <button className="flex-1 py-1.5 text-xs rounded-lg bg-ocean-500/20 text-ocean-400 hover:bg-ocean-500/30">
                      安排维保
                    </button>
                    <button className="flex-1 py-1.5 text-xs rounded-lg bg-slate-700/50 text-slate-400 hover:bg-slate-600/50">
                      详情
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeTab === 'maintenance' && (
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">维保记录</h3>
            <button className="text-sm text-ocean-400 hover:text-ocean-300 flex items-center gap-1">
              <Plus className="w-4 h-4" />
              新增记录
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>设备名称</th>
                  <th>维保类型</th>
                  <th>日期</th>
                  <th>描述</th>
                  <th>技术人员</th>
                  <th>费用</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="font-medium text-white">{record.equipmentName}</td>
                    <td>
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          record.type === 'routine'
                            ? 'bg-ocean-500/20 text-ocean-400'
                            : record.type === 'repair'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-emerald-500/20 text-emerald-400'
                        )}
                      >
                        {maintenanceTypeLabels[record.type]}
                      </span>
                    </td>
                    <td className="text-slate-400">{record.date}</td>
                    <td className="text-slate-300 max-w-xs truncate">{record.description}</td>
                    <td className="text-slate-400">{record.technician}</td>
                    <td className="text-slate-300">¥{record.cost.toLocaleString()}</td>
                    <td>
                      <StatusBadge status={record.status} />
                    </td>
                    <td>
                      <button className="text-ocean-400 text-sm hover:text-ocean-300">
                        查看
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="section-title mb-4">即将到期维保</h3>
          <div className="space-y-3">
            {equipment
              .filter((eq) => eq.status !== 'normal')
              .sort((a, b) => new Date(a.nextMaintenance).getTime() - new Date(b.nextMaintenance).getTime())
              .slice(0, 5)
              .map((eq) => {
                const daysUntil = getDaysUntilMaintenance(eq.nextMaintenance);
                const Icon = categoryIcons[eq.category] || Wrench;

                return (
                  <div
                    key={eq.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center',
                          daysUntil < 0 ? 'bg-red-500/20' : 'bg-amber-500/20'
                        )}
                      >
                        <Icon
                          className={cn(
                            'w-5 h-5',
                            daysUntil < 0 ? 'text-red-400' : 'text-amber-400'
                          )}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{eq.name}</p>
                        <p className="text-xs text-slate-500">{eq.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={cn(
                          'text-sm font-medium',
                          daysUntil < 0 ? 'text-red-400' : 'text-amber-400'
                        )}
                      >
                        {daysUntil < 0
                          ? `超期 ${Math.abs(daysUntil)} 天`
                          : `还有 ${daysUntil} 天`}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatDate(eq.nextMaintenance)}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="section-title mb-4">设备类型分布</h3>
          <div className="space-y-4">
            {['pump', 'valve', 'filter', 'meter', 'generator', 'other'].map((cat) => {
              const count = equipment.filter((e) => e.category === cat).length;
              const percentage = (count / totalEquipment) * 100;
              const Icon = categoryIcons[cat] || Wrench;

              return (
                <div key={cat} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-ocean-400" />
                      <span className="text-sm text-slate-300">
                        {categoryLabels[cat]}
                      </span>
                    </div>
                    <span className="text-sm text-white font-medium">
                      {count} 台 ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-ocean-500 to-cyan-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
