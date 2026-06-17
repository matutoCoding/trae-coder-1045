import { useState } from 'react';
import {
  AlertTriangle,
  Ship,
  Wrench,
  Droplets,
  Clock,
  CloudRain,
  MapPin,
  Phone,
  Users,
  Play,
  CheckCircle,
  XCircle,
  Plus,
  Bell,
  Navigation,
  Anchor,
  FileText,
} from 'lucide-react';
import StatusBadge from '@/components/common/StatusBadge';
import { useAppStore } from '@/store';
import { formatDateTime, getRelativeTime, getEventTypeText, cn } from '@/utils/format';
import type { EmergencyEvent, WaterBoat } from '@/types';

export default function Emergency() {
  const { emergencyEvents, waterBoats, updateEmergencyEvent, addEmergencyEvent, updateWaterBoat } = useAppStore();
  const [activeTab, setActiveTab] = useState<'events' | 'boats' | 'plans'>('events');
  const [selectedEvent, setSelectedEvent] = useState<EmergencyEvent | null>(null);
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [dispatchBoatId, setDispatchBoatId] = useState<string | null>(null);
  const [destination, setDestination] = useState('东港码头');
  const [newEventType, setNewEventType] = useState<'water_shortage' | 'pipe_break' | 'equipment_failure' | 'water_quality'>('water_shortage');
  const [newEventLevel, setNewEventLevel] = useState<'minor' | 'major' | 'critical'>('minor');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');

  const pendingEvents = emergencyEvents.filter((e) => e.status === 'pending');
  const processingEvents = emergencyEvents.filter((e) => e.status === 'processing');
  const resolvedEvents = emergencyEvents.filter((e) => e.status === 'resolved');
  const criticalEvents = emergencyEvents.filter((e) => e.level === 'critical');

  const levelColors: Record<string, string> = {
    minor: 'bg-amber-500',
    major: 'bg-orange-500',
    critical: 'bg-red-500',
  };

  const levelLabels: Record<string, string> = {
    minor: '一般',
    major: '重要',
    critical: '紧急',
  };

  const typeIcons: Record<string, React.ElementType> = {
    water_shortage: Droplets,
    pipe_break: Wrench,
    equipment_failure: Wrench,
    water_quality: Droplets,
  };

  const boatStatusLabels: Record<string, string> = {
    docked: '停靠中',
    sailing: '航行中',
    loading: '装载中',
    unloading: '卸载中',
  };

  const handleEventStatusChange = (id: string, newStatus: string) => {
    updateEmergencyEvent(id, {
      status: newStatus as 'pending' | 'processing' | 'resolved',
      ...(newStatus === 'processing' ? { handler: '调度管理员' } : {}),
      ...(newStatus === 'resolved' ? { endTime: new Date().toISOString() } : {}),
    });
  };

  const handleDispatchBoat = (boatId: string) => {
    const boat = waterBoats.find((b) => b.id === boatId);
    if (!boat) return;
    
    const eta = new Date();
    eta.setHours(eta.getHours() + 6);
    
    const originPort = boat.currentLocation;
    
    updateWaterBoat(boatId, {
      status: 'sailing',
      currentLocation: `从${originPort}出发`,
      destination: destination || '东港码头',
      eta: eta.toISOString(),
    });
    setDispatchBoatId(null);
    setDestination('东港码头');
  };

  const handleSubmitEvent = () => {
    if (!newEventLocation.trim()) {
      alert('请输入事件发生位置');
      return;
    }
    if (!newEventDescription.trim()) {
      alert('请输入事件描述');
      return;
    }

    addEmergencyEvent({
      type: newEventType,
      level: newEventLevel,
      location: newEventLocation,
      description: newEventDescription,
      status: 'pending',
      startTime: new Date().toISOString(),
    });

    resetNewEventForm();
  };

  const resetNewEventForm = () => {
    setShowNewEventModal(false);
    setNewEventType('water_shortage');
    setNewEventLevel('minor');
    setNewEventLocation('');
    setNewEventDescription('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">应急调度</h1>
          <p className="text-sm text-slate-400 mt-1">
            缺水应急、运水船调度、爆管抢修与应急指挥
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewEventModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            上报事件
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">紧急事件</p>
              <p className="text-2xl font-bold text-red-400 mt-2 data-value">
                {criticalEvents.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>

        <div className="glass-card p-5 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">处理中</p>
              <p className="text-2xl font-bold text-amber-400 mt-2 data-value">
                {processingEvents.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Wrench className="w-6 h-6 text-amber-400" />
            </div>
          </div>
        </div>

        <div className="glass-card p-5 border-l-4 border-l-sky-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">运水船</p>
              <p className="text-2xl font-bold text-sky-400 mt-2 data-value">
                {waterBoats.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center">
              <Ship className="w-6 h-6 text-sky-400" />
            </div>
          </div>
        </div>

        <div className="glass-card p-5 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">已解决</p>
              <p className="text-2xl font-bold text-emerald-400 mt-2 data-value">
                {resolvedEvents.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-1">
        <div className="flex p-1 gap-1">
          <button
            onClick={() => setActiveTab('events')}
            className={cn(
              'flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all',
              activeTab === 'events'
                ? 'bg-ocean-500/20 text-ocean-400 border border-ocean-500/30'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            <span className="flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              应急事件
            </span>
          </button>
          <button
            onClick={() => setActiveTab('boats')}
            className={cn(
              'flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all',
              activeTab === 'boats'
                ? 'bg-ocean-500/20 text-ocean-400 border border-ocean-500/30'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            <span className="flex items-center justify-center gap-2">
              <Ship className="w-4 h-4" />
              运水船调度
            </span>
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            className={cn(
              'flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all',
              activeTab === 'plans'
                ? 'bg-ocean-500/20 text-ocean-400 border border-ocean-500/30'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            <span className="flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />
              应急预案
            </span>
          </button>
        </div>
      </div>

      {activeTab === 'events' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="section-title">事件时间线</h3>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 text-xs rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
                    全部 {emergencyEvents.length}
                  </button>
                  <button className="px-3 py-1 text-xs rounded-lg text-slate-400 hover:bg-slate-700/50">
                    未处理 {pendingEvents.length}
                  </button>
                  <button className="px-3 py-1 text-xs rounded-lg text-slate-400 hover:bg-slate-700/50">
                    已解决 {resolvedEvents.length}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {emergencyEvents.map((event, index) => {
                  const TypeIcon = typeIcons[event.type] || AlertTriangle;
                  const isLast = index === emergencyEvents.length - 1;

                  return (
                    <div key={event.id} className="relative flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={cn(
                            'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10',
                            event.status === 'resolved'
                              ? 'bg-emerald-500/20'
                              : event.status === 'processing'
                              ? 'bg-sky-500/20'
                              : 'bg-amber-500/20'
                          )}
                        >
                          <TypeIcon
                            className={cn(
                              'w-5 h-5',
                              event.status === 'resolved'
                                ? 'text-emerald-400'
                                : event.status === 'processing'
                                ? 'text-sky-400'
                                : 'text-amber-400'
                            )}
                          />
                        </div>
                        {!isLast && (
                          <div className="w-0.5 flex-1 bg-slate-700/50 mt-1" />
                        )}
                      </div>

                      <div
                        className="flex-1 pb-4"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-ocean-500/30 transition-all cursor-pointer">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span
                                className={cn(
                                  'px-2 py-0.5 text-xs font-medium rounded-full',
                                  event.level === 'critical'
                                    ? 'bg-red-500/20 text-red-400'
                                    : event.level === 'major'
                                    ? 'bg-orange-500/20 text-orange-400'
                                    : 'bg-amber-500/20 text-amber-400'
                                )}
                              >
                                {levelLabels[event.level]}
                              </span>
                              <span className="text-sm font-medium text-white">
                                {getEventTypeText(event.type)}
                              </span>
                            </div>
                            <StatusBadge status={event.status} showPulse />
                          </div>

                          <p className="text-sm text-slate-300 mb-3">{event.description}</p>

                          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {event.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {getRelativeTime(event.startTime)}
                            </span>
                            {event.handler && (
                              <span className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5" />
                                {event.handler}
                              </span>
                            )}
                            {event.affectedPopulation && (
                              <span className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5" />
                                影响 {event.affectedPopulation} 人
                              </span>
                            )}
                          </div>

                          {event.status === 'pending' && (
                            <div className="mt-3 pt-3 border-t border-slate-700/30 flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEventStatusChange(event.id, 'processing');
                                }}
                                className="flex-1 py-1.5 text-xs rounded-lg bg-sky-500/20 text-sky-400 hover:bg-sky-500/30 flex items-center justify-center gap-1"
                              >
                                <Play className="w-3 h-3" />
                                开始处理
                              </button>
                              <button className="flex-1 py-1.5 text-xs rounded-lg bg-slate-700/50 text-slate-400 hover:bg-slate-600/50">
                                转派
                              </button>
                            </div>
                          )}

                          {event.status === 'processing' && (
                            <div className="mt-3 pt-3 border-t border-slate-700/30 flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEventStatusChange(event.id, 'resolved');
                                }}
                                className="flex-1 py-1.5 text-xs rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 flex items-center justify-center gap-1"
                              >
                                <CheckCircle className="w-3 h-3" />
                                标记解决
                              </button>
                              <button className="flex-1 py-1.5 text-xs rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30">
                                升级
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass-card p-5">
              <h3 className="section-title mb-4">事件详情</h3>
              {selectedEvent ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">事件类型</p>
                    <p className="text-white font-medium">
                      {getEventTypeText(selectedEvent.type)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">事件级别</p>
                    <span
                      className={cn(
                        'px-2 py-1 text-xs font-medium rounded-full',
                        selectedEvent.level === 'critical'
                          ? 'bg-red-500/20 text-red-400'
                          : selectedEvent.level === 'major'
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'bg-amber-500/20 text-amber-400'
                      )}
                    >
                      {levelLabels[selectedEvent.level]}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">发生时间</p>
                    <p className="text-slate-300 text-sm">
                      {formatDateTime(selectedEvent.startTime)}
                    </p>
                  </div>
                  {selectedEvent.endTime && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">结束时间</p>
                      <p className="text-slate-300 text-sm">
                        {formatDateTime(selectedEvent.endTime)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-slate-500 mb-1">发生位置</p>
                    <p className="text-slate-300 text-sm">{selectedEvent.location}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">事件描述</p>
                    <p className="text-slate-300 text-sm">{selectedEvent.description}</p>
                  </div>
                  {selectedEvent.handler && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">处理人</p>
                      <p className="text-slate-300 text-sm">{selectedEvent.handler}</p>
                    </div>
                  )}
                  {selectedEvent.affectedPopulation && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">影响人口</p>
                      <p className="text-slate-300 text-sm">
                        约 {selectedEvent.affectedPopulation} 人
                      </p>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-700/30 space-y-2">
                    <button className="w-full py-2 text-sm rounded-lg bg-ocean-500/20 text-ocean-400 hover:bg-ocean-500/30">
                      查看处理记录
                    </button>
                    <button className="w-full py-2 text-sm rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30">
                      调度资源
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">点击事件查看详情</p>
                </div>
              )}
            </div>

            <div className="glass-card p-5">
              <h3 className="section-title mb-4">快速操作</h3>
              <div className="space-y-2">
                <button className="w-full p-3 text-left rounded-lg bg-slate-800/30 hover:bg-slate-800/50 border border-transparent hover:border-ocean-500/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <Phone className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white">紧急联系</p>
                      <p className="text-xs text-slate-500">应急联络人电话</p>
                    </div>
                  </div>
                </button>
                <button className="w-full p-3 text-left rounded-lg bg-slate-800/30 hover:bg-slate-800/50 border border-transparent hover:border-ocean-500/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-sky-500/20 flex items-center justify-center">
                      <Ship className="w-4 h-4 text-sky-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white">调度运水船</p>
                      <p className="text-xs text-slate-500">应急输水调度</p>
                    </div>
                  </div>
                </button>
                <button className="w-full p-3 text-left rounded-lg bg-slate-800/30 hover:bg-slate-800/50 border border-transparent hover:border-ocean-500/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <Wrench className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white">派单抢修</p>
                      <p className="text-xs text-slate-500">维修人员调度</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'boats' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {waterBoats.map((boat) => (
              <div key={boat.id} className="glass-card p-5 glass-card-hover">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center',
                        boat.status === 'sailing'
                          ? 'bg-sky-500/20'
                          : boat.status === 'docked'
                          ? 'bg-emerald-500/20'
                          : boat.status === 'loading'
                          ? 'bg-amber-500/20'
                          : 'bg-cyan-500/20'
                      )}
                    >
                      <Ship
                        className={cn(
                          'w-6 h-6',
                          boat.status === 'sailing'
                            ? 'text-sky-400'
                            : boat.status === 'docked'
                            ? 'text-emerald-400'
                            : boat.status === 'loading'
                            ? 'text-amber-400'
                            : 'text-cyan-400'
                        )}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{boat.name}</h3>
                      <p className="text-xs text-slate-500">
                        {boatStatusLabels[boat.status]}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">载水量</span>
                      <span className="text-slate-300">
                        {boat.currentLoad} / {boat.capacity} 吨
                      </span>
                    </div>
                    <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-ocean-500 to-cyan-500"
                        style={{ width: `${(boat.currentLoad / boat.capacity) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{boat.currentLocation}</span>
                  </div>

                  {boat.destination && (
                    <div className="flex items-center gap-2 text-xs text-sky-400">
                      <Navigation className="w-3.5 h-3.5" />
                      <span>前往: {boat.destination}</span>
                    </div>
                  )}

                  {boat.eta && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>预计到达: {new Date(boat.eta).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700/30">
                    <div>
                      <p className="text-xs text-slate-500">船速</p>
                      <p className="text-sm text-white">{boat.speed} 节</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">船员</p>
                      <p className="text-sm text-white">{boat.crew} 人</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/30 flex gap-2">
                  {boat.status === 'docked' && (
                    <button
                      onClick={() => {
                        setDispatchBoatId(boat.id);
                        setDestination('东港码头');
                      }}
                      className="flex-1 py-2 text-xs rounded-lg bg-sky-500/20 text-sky-400 hover:bg-sky-500/30"
                    >
                      调度派遣
                    </button>
                  )}
                  {boat.status === 'sailing' && (
                    <button className="flex-1 py-2 text-xs rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30">
                      追踪轨迹
                    </button>
                  )}
                  <button className="flex-1 py-2 text-xs rounded-lg bg-slate-700/50 text-slate-400 hover:bg-slate-600/50">
                    详情
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card p-5">
            <h3 className="section-title mb-4">运水船调度记录</h3>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>船名</th>
                    <th>任务类型</th>
                    <th>出发港</th>
                    <th>目的港</th>
                    <th>载水量</th>
                    <th>出发时间</th>
                    <th>预计到达</th>
                    <th>状态</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-medium text-white">海清一号</td>
                    <td className="text-slate-400">应急供水</td>
                    <td className="text-slate-400">大陆港口</td>
                    <td className="text-slate-400">东港码头</td>
                    <td className="text-slate-300">4800 吨</td>
                    <td className="text-slate-400">2026-06-18 08:00</td>
                    <td className="text-slate-400">2026-06-18 14:30</td>
                    <td>
                      <StatusBadge status="sailing" showPulse />
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium text-white">水韵号</td>
                    <td className="text-slate-400">日常补给</td>
                    <td className="text-slate-400">大陆港口</td>
                    <td className="text-slate-400">西港码头</td>
                    <td className="text-slate-300">7500 吨</td>
                    <td className="text-slate-400">2026-06-17 22:00</td>
                    <td className="text-slate-400">2026-06-18 12:00</td>
                    <td>
                      <StatusBadge status="unloading" showPulse />
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium text-white">润岛号</td>
                    <td className="text-slate-400">应急补水</td>
                    <td className="text-slate-400">大陆港口</td>
                    <td className="text-slate-400">东港码头</td>
                    <td className="text-slate-300">2000 吨</td>
                    <td className="text-slate-400">2026-06-18 10:30</td>
                    <td className="text-slate-400">2026-06-18 16:00</td>
                    <td>
                      <StatusBadge status="loading" showPulse />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: '缺水应急预案',
              description: '当水库蓄水量低于安全线时启动，包括限水措施、运水船调度等',
              level: '三级响应',
              icon: Droplets,
              color: 'from-blue-500 to-cyan-500',
            },
            {
              title: '爆管抢修预案',
              description: '管网破裂事故应急处理流程，包括关阀、抢修、供水替代等',
              level: '二级响应',
              icon: Wrench,
              color: 'from-orange-500 to-amber-500',
            },
            {
              title: '设备故障预案',
              description: '海水淡化设备等关键设备故障时的应急处理流程',
              level: '一级响应',
              icon: Wrench,
              color: 'from-red-500 to-rose-500',
            },
            {
              title: '水质异常预案',
              description: '水质检测异常时的应急响应，包括停水、通知、排查等',
              level: '一级响应',
              icon: Bell,
              color: 'from-purple-500 to-pink-500',
            },
            {
              title: '台风暴雨预案',
              description: '台风暴雨期间的供水保障与雨水收集调度',
              level: '二级响应',
              icon: CloudRain,
              color: 'from-sky-500 to-blue-500',
            },
            {
              title: '电力中断预案',
              description: '电网停电时的供水保障，包括备用发电机启动等',
              level: '三级响应',
              icon: AlertTriangle,
              color: 'from-amber-500 to-yellow-500',
            },
          ].map((plan, index) => {
            const Icon = plan.icon;
            return (
              <div key={index} className="glass-card p-5 glass-card-hover cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-700/50 text-slate-400">
                    {plan.level}
                  </span>
                </div>
                <h3 className="font-semibold text-white mb-2">{plan.title}</h3>
                <p className="text-sm text-slate-400 line-clamp-2">{plan.description}</p>
                <div className="mt-4 pt-4 border-t border-slate-700/30 flex gap-2">
                  <button className="flex-1 py-1.5 text-xs rounded-lg bg-ocean-500/20 text-ocean-400 hover:bg-ocean-500/30">
                    查看详情
                  </button>
                  <button className="flex-1 py-1.5 text-xs rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30">
                    启动预案
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showNewEventModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-lg p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">上报应急事件</h2>
              <button
                onClick={resetNewEventForm}
                className="text-slate-400 hover:text-white p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">事件类型</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(typeIcons).map(([type, Icon]) => (
                    <button
                      key={type}
                      onClick={() => setNewEventType(type as 'water_shortage' | 'pipe_break' | 'equipment_failure' | 'water_quality')}
                      className={cn(
                        'p-3 rounded-lg border transition-all text-left',
                        newEventType === type
                          ? 'bg-ocean-500/20 border-ocean-500/50'
                          : 'bg-slate-800/50 border-slate-700/50 hover:border-ocean-500/50'
                      )}
                    >
                      <Icon className={cn(
                        'w-5 h-5 mb-1',
                        newEventType === type ? 'text-ocean-400' : 'text-slate-400'
                      )} />
                      <p className={cn(
                        'text-sm',
                        newEventType === type ? 'text-white' : 'text-slate-300'
                      )}>{getEventTypeText(type)}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">事件级别</label>
                <div className="flex gap-2">
                  {Object.entries(levelLabels).map(([level, label]) => (
                    <button
                      key={level}
                      onClick={() => setNewEventLevel(level as 'minor' | 'major' | 'critical')}
                      className={cn(
                        'flex-1 py-2 rounded-lg text-sm border transition-all',
                        newEventLevel === level
                          ? level === 'critical'
                            ? 'bg-red-500/30 text-red-400 border-red-500/50'
                            : level === 'major'
                            ? 'bg-orange-500/30 text-orange-400 border-orange-500/50'
                            : 'bg-amber-500/30 text-amber-400 border-amber-500/50'
                          : 'bg-slate-800/30 text-slate-400 border-slate-700/30 hover:border-slate-600/50'
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">发生位置</label>
                <input
                  type="text"
                  value={newEventLocation}
                  onChange={(e) => setNewEventLocation(e.target.value)}
                  placeholder="请输入事件发生位置"
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-ocean-500/50"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">事件描述</label>
                <textarea
                  rows={3}
                  value={newEventDescription}
                  onChange={(e) => setNewEventDescription(e.target.value)}
                  placeholder="请详细描述事件情况..."
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-ocean-500/50 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-slate-700/30">
              <button
                onClick={resetNewEventForm}
                className="btn-secondary flex-1"
              >
                取消
              </button>
              <button
                onClick={handleSubmitEvent}
                className="btn-primary flex-1"
              >
                提交上报
              </button>
            </div>
          </div>
        </div>
      )}

      {dispatchBoatId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-md p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">调度运水船</h2>
              <button
                onClick={() => setDispatchBoatId(null)}
                className="text-slate-400 hover:text-white p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">目的港</label>
                <div className="grid grid-cols-2 gap-2">
                  {['东港码头', '西港码头', '南岛码头', '北村码头'].map((port) => (
                    <button
                      key={port}
                      onClick={() => setDestination(port)}
                      className={cn(
                        'p-3 rounded-lg text-sm text-left transition-all border',
                        destination === port
                          ? 'bg-ocean-500/20 border-ocean-500/50 text-ocean-400'
                          : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-ocean-500/30'
                      )}
                    >
                      <Anchor className="w-4 h-4 mb-1" />
                      {port}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/30">
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                  <Ship className="w-4 h-4 text-sky-400" />
                  <span>{waterBoats.find((b) => b.id === dispatchBoatId)?.name}</span>
                </div>
                <div className="text-xs text-slate-500">
                  预计航行时间约6小时，载水量{waterBoats.find((b) => b.id === dispatchBoatId)?.capacity}吨
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-slate-700/30">
              <button
                onClick={() => setDispatchBoatId(null)}
                className="btn-secondary flex-1"
              >
                取消
              </button>
              <button
                onClick={() => handleDispatchBoat(dispatchBoatId)}
                className="btn-primary flex-1"
              >
                确认调度
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
