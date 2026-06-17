import { create } from 'zustand';
import type {
  WaterSource,
  DesalinationPlant,
  PressurePoint,
  Equipment,
  EmergencyEvent,
  WaterBoat,
  Alert,
  ConsumptionRecord,
} from '@/types';
import {
  waterSources as initialWaterSources,
  desalinationPlants as initialPlants,
  pressurePoints as initialPressurePoints,
  equipment as initialEquipment,
  emergencyEvents as initialEvents,
  waterBoats as initialBoats,
  alerts as initialAlerts,
  consumptionRecords as initialConsumption,
} from '@/data/mockData';

interface AppState {
  waterSources: WaterSource[];
  desalinationPlants: DesalinationPlant[];
  pressurePoints: PressurePoint[];
  equipment: Equipment[];
  emergencyEvents: EmergencyEvent[];
  waterBoats: WaterBoat[];
  alerts: Alert[];
  consumptionRecords: ConsumptionRecord[];
  sidebarCollapsed: boolean;
  currentTime: string;
  
  toggleSidebar: () => void;
  markAlertAsRead: (id: string) => void;
  markAllAlertsAsRead: () => void;
  updateEmergencyEvent: (id: string, updates: Partial<EmergencyEvent>) => void;
  addEmergencyEvent: (event: Omit<EmergencyEvent, 'id'>) => void;
  updateWaterBoat: (id: string, updates: Partial<WaterBoat>) => void;
  setCurrentTime: (time: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  waterSources: initialWaterSources,
  desalinationPlants: initialPlants,
  pressurePoints: initialPressurePoints,
  equipment: initialEquipment,
  emergencyEvents: initialEvents,
  waterBoats: initialBoats,
  alerts: initialAlerts,
  consumptionRecords: initialConsumption,
  sidebarCollapsed: false,
  currentTime: new Date().toISOString(),

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  markAlertAsRead: (id) =>
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === id ? { ...a, read: true } : a)),
    })),

  markAllAlertsAsRead: () =>
    set((state) => ({
      alerts: state.alerts.map((a) => ({ ...a, read: true })),
    })),

  updateEmergencyEvent: (id, updates) =>
    set((state) => ({
      emergencyEvents: state.emergencyEvents.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    })),

  addEmergencyEvent: (event) =>
    set((state) => ({
      emergencyEvents: [
        { ...event, id: Math.random().toString(36).substring(2, 10) },
        ...state.emergencyEvents,
      ],
    })),

  updateWaterBoat: (id, updates) =>
    set((state) => ({
      waterBoats: state.waterBoats.map((b) =>
        b.id === id ? { ...b, ...updates } : b
      ),
    })),

  setCurrentTime: (time) => set({ currentTime: time }),
}));
