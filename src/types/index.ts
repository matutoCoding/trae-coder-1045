export interface WaterSource {
  id: string;
  name: string;
  type: 'reservoir' | 'desalination' | 'rainwater' | 'groundwater';
  capacity: number;
  currentVolume: number;
  location: string;
  status: 'normal' | 'warning' | 'alarm';
  description: string;
  buildDate: string;
}

export interface WaterLevelRecord {
  id: string;
  reservoirId: string;
  timestamp: string;
  waterLevel: number;
  volume: number;
  inflowRate: number;
  outflowRate: number;
}

export interface DesalinationPlant {
  id: string;
  name: string;
  capacity: number;
  currentOutput: number;
  operatingHours: number;
  energyConsumption: number;
  status: 'running' | 'standby' | 'maintenance' | 'fault';
  efficiency: number;
  waterQuality: number;
}

export interface PressurePoint {
  id: string;
  name: string;
  location: { x: number; y: number };
  pressure: number;
  normalRange: [number, number];
  status: 'normal' | 'low' | 'high';
  lastUpdate: string;
  flowRate: number;
}

export interface ConsumptionRecord {
  id: string;
  date: string;
  residential: number;
  commercial: number;
  tourism: number;
  industrial: number;
  total: number;
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  category: 'pump' | 'valve' | 'filter' | 'meter' | 'generator' | 'other';
  location: string;
  installDate: string;
  lastMaintenance: string;
  nextMaintenance: string;
  status: 'normal' | 'due' | 'overdue';
  runHours: number;
  manufacturer: string;
  model: string;
}

export interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  equipmentName: string;
  type: 'routine' | 'repair' | 'inspection';
  date: string;
  description: string;
  technician: string;
  cost: number;
  status: 'scheduled' | 'in-progress' | 'completed';
}

export interface EmergencyEvent {
  id: string;
  type: 'water_shortage' | 'pipe_break' | 'equipment_failure' | 'water_quality';
  level: 'minor' | 'major' | 'critical';
  description: string;
  location: string;
  startTime: string;
  endTime?: string;
  status: 'pending' | 'processing' | 'resolved';
  handler?: string;
  affectedPopulation?: number;
}

export interface WaterBoat {
  id: string;
  name: string;
  capacity: number;
  currentLoad: number;
  status: 'docked' | 'sailing' | 'loading' | 'unloading';
  currentLocation: string;
  destination?: string;
  eta?: string;
  speed: number;
  crew: number;
}

export interface Alert {
  id: string;
  type: 'warning' | 'alarm' | 'info';
  title: string;
  message: string;
  time: string;
  source: string;
  read: boolean;
}

export interface WaterQualityRecord {
  id: string;
  location: string;
  date: string;
  ph: number;
  turbidity: number;
  chlorine: number;
  hardness: number;
  status: 'pass' | 'fail';
}

export interface SupplyStatistics {
  totalSupply: number;
  totalConsumption: number;
  residentialRatio: number;
  commercialRatio: number;
  tourismRatio: number;
  industrialRatio: number;
  lossRate: number;
  supplyCost: number;
}
