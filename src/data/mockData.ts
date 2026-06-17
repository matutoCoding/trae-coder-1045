import type {
  WaterSource,
  WaterLevelRecord,
  DesalinationPlant,
  PressurePoint,
  ConsumptionRecord,
  Equipment,
  MaintenanceRecord,
  EmergencyEvent,
  WaterBoat,
  Alert,
  WaterQualityRecord,
  SupplyStatistics,
} from '@/types';

const generateId = (): string => Math.random().toString(36).substring(2, 10);

export const waterSources: WaterSource[] = [
  {
    id: 'ws001',
    name: '东湾水库',
    type: 'reservoir',
    capacity: 5000000,
    currentVolume: 3850000,
    location: '海岛东部',
    status: 'normal',
    description: '主供水水库，总库容500万立方米',
    buildDate: '2010-06-15',
  },
  {
    id: 'ws002',
    name: '西山塘坝',
    type: 'reservoir',
    capacity: 1200000,
    currentVolume: 720000,
    location: '海岛西部',
    status: 'warning',
    description: '备用水源，总库容120万立方米',
    buildDate: '2015-03-20',
  },
  {
    id: 'ws003',
    name: '南海淡化厂',
    type: 'desalination',
    capacity: 20000,
    currentVolume: 18500,
    location: '海岛南部',
    status: 'normal',
    description: '日产能2万吨海水淡化厂',
    buildDate: '2018-09-01',
  },
  {
    id: 'ws004',
    name: '北区雨水收集系统',
    type: 'rainwater',
    capacity: 500000,
    currentVolume: 280000,
    location: '海岛北部',
    status: 'normal',
    description: '雨水收集调蓄池，总容积50万立方米',
    buildDate: '2020-04-10',
  },
  {
    id: 'ws005',
    name: '中心地下水井群',
    type: 'groundwater',
    capacity: 5000,
    currentVolume: 3200,
    location: '海岛中部',
    status: 'warning',
    description: '应急地下水源，日出水量5000吨',
    buildDate: '2008-11-25',
  },
];

const generateWaterLevelData = (reservoirId: string, baseLevel: number, days: number = 30): WaterLevelRecord[] => {
  const data: WaterLevelRecord[] = [];
  let level = baseLevel;
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    level = level + (Math.random() - 0.45) * 0.5;
    level = Math.max(20, Math.min(80, level));
    
    data.push({
      id: generateId(),
      reservoirId,
      timestamp: date.toISOString(),
      waterLevel: parseFloat(level.toFixed(2)),
      volume: parseFloat((level * 60000).toFixed(0)),
      inflowRate: parseFloat((Math.random() * 500 + 200).toFixed(1)),
      outflowRate: parseFloat((Math.random() * 400 + 300).toFixed(1)),
    });
  }
  
  return data;
};

export const waterLevelData: Record<string, WaterLevelRecord[]> = {
  ws001: generateWaterLevelData('ws001', 65),
  ws002: generateWaterLevelData('ws002', 48),
  ws004: generateWaterLevelData('ws004', 55),
};

export const desalinationPlants: DesalinationPlant[] = [
  {
    id: 'dp001',
    name: '南海一期淡化厂',
    capacity: 10000,
    currentOutput: 9200,
    operatingHours: 720,
    energyConsumption: 35000,
    status: 'running',
    efficiency: 92,
    waterQuality: 98.5,
  },
  {
    id: 'dp002',
    name: '南海二期淡化厂',
    capacity: 10000,
    currentOutput: 8800,
    operatingHours: 680,
    energyConsumption: 32000,
    status: 'running',
    efficiency: 88,
    waterQuality: 97.8,
  },
  {
    id: 'dp003',
    name: '北海应急淡化站',
    capacity: 3000,
    currentOutput: 0,
    operatingHours: 45,
    energyConsumption: 1200,
    status: 'standby',
    efficiency: 0,
    waterQuality: 0,
  },
];

const generateDesalinationHistory = () => {
  const data: { date: string; output: number; energy: number }[] = [];
  const now = new Date();
  
  for (let i = 14; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      output: Math.floor(Math.random() * 3000 + 16000),
      energy: Math.floor(Math.random() * 10000 + 55000),
    });
  }
  
  return data;
};

export const desalinationHistory = generateDesalinationHistory();

export const pressurePoints: PressurePoint[] = [
  { id: 'pp001', name: '东港加压站', location: { x: 85, y: 20 }, pressure: 0.42, normalRange: [0.35, 0.5], status: 'normal', lastUpdate: new Date().toISOString(), flowRate: 1250 },
  { id: 'pp002', name: '西岛监测点', location: { x: 15, y: 45 }, pressure: 0.38, normalRange: [0.3, 0.45], status: 'normal', lastUpdate: new Date().toISOString(), flowRate: 880 },
  { id: 'pp003', name: '南区调压站', location: { x: 55, y: 75 }, pressure: 0.52, normalRange: [0.35, 0.5], status: 'high', lastUpdate: new Date().toISOString(), flowRate: 1560 },
  { id: 'pp004', name: '北村监测点', location: { x: 35, y: 15 }, pressure: 0.28, normalRange: [0.3, 0.45], status: 'low', lastUpdate: new Date().toISOString(), flowRate: 620 },
  { id: 'pp005', name: '中心水厂出口', location: { x: 50, y: 50 }, pressure: 0.45, normalRange: [0.4, 0.55], status: 'normal', lastUpdate: new Date().toISOString(), flowRate: 2100 },
  { id: 'pp006', name: '东海岸监测点', location: { x: 75, y: 55 }, pressure: 0.41, normalRange: [0.35, 0.5], status: 'normal', lastUpdate: new Date().toISOString(), flowRate: 950 },
  { id: 'pp007', name: '西南角监测点', location: { x: 25, y: 80 }, pressure: 0.36, normalRange: [0.3, 0.45], status: 'normal', lastUpdate: new Date().toISOString(), flowRate: 520 },
  { id: 'pp008', name: '旅游区监测点', location: { x: 70, y: 35 }, pressure: 0.44, normalRange: [0.38, 0.52], status: 'normal', lastUpdate: new Date().toISOString(), flowRate: 1680 },
];

export const generatePressureHistory = () => {
  const data: { time: string; pressure: number; flow: number }[] = [];
  const now = new Date();
  
  for (let i = 24; i >= 0; i--) {
    const time = new Date(now);
    time.setHours(time.getHours() - i);
    data.push({
      time: time.toISOString(),
      pressure: parseFloat((0.38 + Math.random() * 0.12).toFixed(3)),
      flow: Math.floor(Math.random() * 500 + 1800),
    });
  }
  
  return data;
};

export const consumptionRecords: ConsumptionRecord[] = (() => {
  const data: ConsumptionRecord[] = [];
  const now = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const tourismMultiplier = isWeekend ? 1.3 : 1;
    
    const residential = 3500 + Math.random() * 500;
    const commercial = 2800 + Math.random() * 400;
    const tourism = (2000 + Math.random() * 800) * tourismMultiplier;
    const industrial = 1500 + Math.random() * 300;
    const total = residential + commercial + tourism + industrial;
    
    data.push({
      id: generateId(),
      date: date.toISOString().split('T')[0],
      residential: parseFloat(residential.toFixed(1)),
      commercial: parseFloat(commercial.toFixed(1)),
      tourism: parseFloat(tourism.toFixed(1)),
      industrial: parseFloat(industrial.toFixed(1)),
      total: parseFloat(total.toFixed(1)),
    });
  }
  
  return data;
})();

export const monthlyConsumption = [
  { month: '1月', total: 285000, residential: 105000, commercial: 84000, tourism: 56000, industrial: 40000 },
  { month: '2月', total: 268000, residential: 98000, commercial: 78000, tourism: 52000, industrial: 40000 },
  { month: '3月', total: 295000, residential: 108000, commercial: 86000, tourism: 61000, industrial: 40000 },
  { month: '4月', total: 320000, residential: 112000, commercial: 92000, tourism: 75000, industrial: 41000 },
  { month: '5月', total: 365000, residential: 118000, commercial: 102000, tourism: 102000, industrial: 43000 },
  { month: '6月', total: 410000, residential: 125000, commercial: 115000, tourism: 125000, industrial: 45000 },
  { month: '7月', total: 455000, residential: 132000, commercial: 128000, tourism: 148000, industrial: 47000 },
  { month: '8月', total: 480000, residential: 138000, commercial: 135000, tourism: 158000, industrial: 49000 },
  { month: '9月', total: 420000, residential: 128000, commercial: 118000, tourism: 128000, industrial: 46000 },
  { month: '10月', total: 385000, residential: 122000, commercial: 108000, tourism: 108000, industrial: 47000 },
  { month: '11月', total: 325000, residential: 115000, commercial: 95000, tourism: 75000, industrial: 40000 },
  { month: '12月', total: 298000, residential: 108000, commercial: 88000, tourism: 62000, industrial: 40000 },
];

export const equipment: Equipment[] = [
  {
    id: 'eq001',
    name: '1号海水淡化泵',
    type: '高压泵',
    category: 'pump',
    location: '南海淡化厂',
    installDate: '2018-09-01',
    lastMaintenance: '2026-04-15',
    nextMaintenance: '2026-07-15',
    status: 'normal',
    runHours: 12560,
    manufacturer: '格兰富',
    model: 'CRN150-10',
  },
  {
    id: 'eq002',
    name: '2号海水淡化泵',
    type: '高压泵',
    category: 'pump',
    location: '南海淡化厂',
    installDate: '2018-09-01',
    lastMaintenance: '2026-03-20',
    nextMaintenance: '2026-06-20',
    status: 'due',
    runHours: 13200,
    manufacturer: '格兰富',
    model: 'CRN150-10',
  },
  {
    id: 'eq003',
    name: '反渗透膜组A',
    type: '过滤设备',
    category: 'filter',
    location: '南海淡化厂',
    installDate: '2022-05-10',
    lastMaintenance: '2026-01-10',
    nextMaintenance: '2026-07-10',
    status: 'normal',
    runHours: 8900,
    manufacturer: '陶氏化学',
    model: 'BW30-400',
  },
  {
    id: 'eq004',
    name: '东港加压泵组',
    type: '加压泵',
    category: 'pump',
    location: '东港加压站',
    installDate: '2019-08-20',
    lastMaintenance: '2026-02-28',
    nextMaintenance: '2026-05-28',
    status: 'overdue',
    runHours: 15680,
    manufacturer: '凯泉泵业',
    model: 'KQSN200',
  },
  {
    id: 'eq005',
    name: '主输水管道阀门',
    type: '电动阀门',
    category: 'valve',
    location: '中心水厂',
    installDate: '2017-11-15',
    lastMaintenance: '2026-04-01',
    nextMaintenance: '2026-10-01',
    status: 'normal',
    runHours: 24000,
    manufacturer: '纽威阀门',
    model: 'Z941H-16C',
  },
  {
    id: 'eq006',
    name: '水质在线监测仪',
    type: '监测设备',
    category: 'meter',
    location: '中心水厂',
    installDate: '2021-03-08',
    lastMaintenance: '2026-05-08',
    nextMaintenance: '2026-08-08',
    status: 'normal',
    runHours: 6500,
    manufacturer: '哈希',
    model: 'CL17',
  },
  {
    id: 'eq007',
    name: '备用发电机组',
    type: '发电机',
    category: 'generator',
    location: '南海淡化厂',
    installDate: '2019-01-25',
    lastMaintenance: '2026-06-01',
    nextMaintenance: '2026-12-01',
    status: 'normal',
    runHours: 1200,
    manufacturer: '康明斯',
    model: 'KTA38-G5',
  },
  {
    id: 'eq008',
    name: '活性炭过滤系统',
    type: '过滤设备',
    category: 'filter',
    location: '中心水厂',
    installDate: '2020-07-12',
    lastMaintenance: '2025-12-20',
    nextMaintenance: '2026-06-20',
    status: 'due',
    runHours: 18500,
    manufacturer: '漂莱特',
    model: 'GAC-830',
  },
];

export const maintenanceRecords: MaintenanceRecord[] = [
  { id: 'mr001', equipmentId: 'eq002', equipmentName: '2号海水淡化泵', type: 'routine', date: '2026-06-20', description: '定期维护保养，更换密封件', technician: '张工', cost: 2500, status: 'scheduled' },
  { id: 'mr002', equipmentId: 'eq004', equipmentName: '东港加压泵组', type: 'repair', date: '2026-06-18', description: '轴承异响，需更换轴承', technician: '李工', cost: 5800, status: 'in-progress' },
  { id: 'mr003', equipmentId: 'eq008', equipmentName: '活性炭过滤系统', type: 'routine', date: '2026-06-25', description: '活性炭更换，系统清洗', technician: '王工', cost: 12000, status: 'scheduled' },
  { id: 'mr004', equipmentId: 'eq001', equipmentName: '1号海水淡化泵', type: 'inspection', date: '2026-06-10', description: '季度巡检，运行正常', technician: '张工', cost: 500, status: 'completed' },
  { id: 'mr005', equipmentId: 'eq005', equipmentName: '主输水管道阀门', type: 'routine', date: '2026-04-01', description: '阀门润滑密封检查', technician: '赵工', cost: 800, status: 'completed' },
  { id: 'mr006', equipmentId: 'eq003', equipmentName: '反渗透膜组A', type: 'inspection', date: '2026-05-15', description: '膜通量检测，性能良好', technician: '王工', cost: 1200, status: 'completed' },
];

export const emergencyEvents: EmergencyEvent[] = [
  {
    id: 'ee001',
    type: 'pipe_break',
    level: 'major',
    description: '南区主输水管道破裂，预计影响3000户居民用水',
    location: '南区调压站附近',
    startTime: '2026-06-17T08:30:00',
    status: 'processing',
    handler: '李调度',
    affectedPopulation: 3000,
  },
  {
    id: 'ee002',
    type: 'water_shortage',
    level: 'minor',
    description: '北村片区水压偏低，高层住户用水困难',
    location: '北村片区',
    startTime: '2026-06-16T14:20:00',
    status: 'processing',
    handler: '张调度',
    affectedPopulation: 500,
  },
  {
    id: 'ee003',
    type: 'equipment_failure',
    level: 'critical',
    description: '2号淡化高压泵故障，产水量下降约50%',
    location: '南海淡化厂',
    startTime: '2026-06-15T10:15:00',
    endTime: '2026-06-16T18:00:00',
    status: 'resolved',
    handler: '王工程师',
  },
  {
    id: 'ee004',
    type: 'water_quality',
    level: 'minor',
    description: '东海岸监测点浊度略有超标，已加强监测',
    location: '东海岸片区',
    startTime: '2026-06-14T09:00:00',
    endTime: '2026-06-14T16:30:00',
    status: 'resolved',
    handler: '陈化验员',
  },
];

export const waterBoats: WaterBoat[] = [
  {
    id: 'wb001',
    name: '海清一号',
    capacity: 5000,
    currentLoad: 4800,
    status: 'sailing',
    currentLocation: '距海岛25海里',
    destination: '海岛东港码头',
    eta: '2026-06-18T14:30:00',
    speed: 12,
    crew: 8,
  },
  {
    id: 'wb002',
    name: '海清二号',
    capacity: 3000,
    currentLoad: 0,
    status: 'docked',
    currentLocation: '海岛东港码头',
    speed: 15,
    crew: 6,
  },
  {
    id: 'wb003',
    name: '水韵号',
    capacity: 8000,
    currentLoad: 7500,
    status: 'unloading',
    currentLocation: '海岛西港码头',
    eta: '2026-06-18T12:00:00',
    speed: 10,
    crew: 12,
  },
  {
    id: 'wb004',
    name: '润岛号',
    capacity: 2000,
    currentLoad: 2000,
    status: 'loading',
    currentLocation: '大陆港口',
    destination: '海岛东港码头',
    speed: 18,
    crew: 5,
  },
];

export const alerts: Alert[] = [
  { id: 'a001', type: 'alarm', title: '南区管道压力异常偏高', message: '南区调压站压力达到0.52MPa，超出正常范围', time: '2026-06-18T10:15:00', source: '管网监测系统', read: false },
  { id: 'a002', type: 'alarm', title: '北村片区水压不足', message: '北村监测点压力降至0.28MPa，低于正常值', time: '2026-06-18T09:45:00', source: '管网监测系统', read: false },
  { id: 'a003', type: 'warning', title: '西山塘坝水位偏低', message: '当前蓄水量仅为总库容的60%，请关注', time: '2026-06-18T08:00:00', source: '蓄水监测系统', read: false },
  { id: 'a004', type: 'warning', title: '东港加压泵维保超期', message: '东港加压泵组已超过维保期限，请尽快安排', time: '2026-06-17T16:30:00', source: '设备管理系统', read: true },
  { id: 'a005', type: 'info', title: '运水船即将抵达', message: '水韵号将于2小时后抵达西港码头', time: '2026-06-18T10:00:00', source: '调度系统', read: true },
  { id: 'a006', title: '水质检测达标', type: 'info', message: '本周全岛水质检测全部合格', time: '2026-06-17T14:00:00', source: '水质监测系统', read: true },
];

export const waterQualityRecords: WaterQualityRecord[] = [
  { id: 'wq001', location: '中心水厂出水口', date: '2026-06-18', ph: 7.2, turbidity: 0.8, chlorine: 0.6, hardness: 120, status: 'pass' },
  { id: 'wq002', location: '东港区', date: '2026-06-18', ph: 7.1, turbidity: 0.9, chlorine: 0.5, hardness: 115, status: 'pass' },
  { id: 'wq003', location: '西岛区', date: '2026-06-18', ph: 7.3, turbidity: 0.7, chlorine: 0.7, hardness: 125, status: 'pass' },
  { id: 'wq004', location: '南城区', date: '2026-06-18', ph: 7.0, turbidity: 1.2, chlorine: 0.6, hardness: 118, status: 'pass' },
  { id: 'wq005', location: '北村区', date: '2026-06-18', ph: 7.2, turbidity: 0.6, chlorine: 0.5, hardness: 122, status: 'pass' },
  { id: 'wq006', location: '旅游度假区', date: '2026-06-18', ph: 7.1, turbidity: 0.5, chlorine: 0.8, hardness: 110, status: 'pass' },
];

export const supplyStatistics: SupplyStatistics = {
  totalSupply: 9800000,
  totalConsumption: 9120000,
  residentialRatio: 36.5,
  commercialRatio: 28.2,
  tourismRatio: 22.8,
  industrialRatio: 12.5,
  lossRate: 6.9,
  supplyCost: 4.5,
};

export const rainwaterCollection = [
  { month: '1月', collection: 12000, capacity: 500000 },
  { month: '2月', collection: 18000, capacity: 500000 },
  { month: '3月', collection: 35000, capacity: 500000 },
  { month: '4月', collection: 58000, capacity: 500000 },
  { month: '5月', collection: 82000, capacity: 500000 },
  { month: '6月', collection: 95000, capacity: 500000 },
  { month: '7月', collection: 78000, capacity: 500000 },
  { month: '8月', collection: 65000, capacity: 500000 },
  { month: '9月', collection: 72000, capacity: 500000 },
  { month: '10月', collection: 48000, capacity: 500000 },
  { month: '11月', collection: 25000, capacity: 500000 },
  { month: '12月', collection: 15000, capacity: 500000 },
];
