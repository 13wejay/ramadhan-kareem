import { create } from 'zustand';
import { lsGet, lsSet } from '../services/localStorage';
import { STORAGE_KEYS } from '../utils/storageKeys';
import { getTodayString } from '../utils/dateHelpers';
import { DEFAULT_CHECKLIST_ITEMS } from '../data/defaultChecklist';

export interface ChecklistItemRecord {
  id: string;
  label: string;
  icon: string;
  completed: boolean;
  completedAt: string | null;
  customData: { value: number; unit: string } | null;
  isCustom: boolean;
  order: number;
}

export interface DailyChecklistRecord {
  date: string;
  items: ChecklistItemRecord[];
}

interface ChecklistState {
  todayRecord: DailyChecklistRecord | null;
  loadToday: () => void;
  toggleItem: (itemId: string) => void;
  updateItemData: (itemId: string, value: number, unit: string) => void;
  addCustomItem: (label: string, icon: string) => void;
  removeCustomItem: (itemId: string) => void;
  renameCustomItem: (itemId: string, newLabel: string) => void;
  completedCount: () => number;
  totalCount: () => number;
}

function getOrCreateTodayRecord(): DailyChecklistRecord {
  const today = getTodayString();
  const key = `${STORAGE_KEYS.CHECKLIST_PREFIX}${today}`;
  const existing = lsGet<DailyChecklistRecord>(key);
  if (existing && existing.date === today) return existing;

  const customItems = lsGet<ChecklistItemRecord[]>(STORAGE_KEYS.CUSTOM_ITEMS) || [];
  const items: ChecklistItemRecord[] = [
    ...DEFAULT_CHECKLIST_ITEMS.map((item, i) => ({
      ...item,
      completed: false,
      completedAt: null,
      customData: null,
      isCustom: false,
      order: i,
    })),
    ...customItems.map((item, i) => ({
      ...item,
      completed: false,
      completedAt: null,
      order: DEFAULT_CHECKLIST_ITEMS.length + i,
    })),
  ];

  const record: DailyChecklistRecord = { date: today, items };
  lsSet(key, record);
  return record;
}

function saveRecord(record: DailyChecklistRecord): void {
  const key = `${STORAGE_KEYS.CHECKLIST_PREFIX}${record.date}`;
  lsSet(key, record);
}

export const useChecklistStore = create<ChecklistState>()((set, get) => ({
  todayRecord: null,

  loadToday: () => {
    const record = getOrCreateTodayRecord();
    set({ todayRecord: record });
  },

  toggleItem: (itemId) => {
    const record = get().todayRecord;
    if (!record) return;
    const updated = {
      ...record,
      items: record.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              completed: !item.completed,
              completedAt: !item.completed ? new Date().toISOString() : null,
            }
          : item
      ),
    };
    saveRecord(updated);
    set({ todayRecord: updated });
  },

  updateItemData: (itemId, value, unit) => {
    const record = get().todayRecord;
    if (!record) return;
    const updated = {
      ...record,
      items: record.items.map((item) =>
        item.id === itemId
          ? { ...item, customData: { value, unit }, completed: true, completedAt: new Date().toISOString() }
          : item
      ),
    };
    saveRecord(updated);
    set({ todayRecord: updated });
  },

  addCustomItem: (label, icon) => {
    const custom = lsGet<ChecklistItemRecord[]>(STORAGE_KEYS.CUSTOM_ITEMS) || [];
    const newItem: ChecklistItemRecord = {
      id: `custom_${Date.now()}`,
      label,
      icon,
      completed: false,
      completedAt: null,
      customData: null,
      isCustom: true,
      order: custom.length + DEFAULT_CHECKLIST_ITEMS.length,
    };
    custom.push(newItem);
    lsSet(STORAGE_KEYS.CUSTOM_ITEMS, custom);

    const record = get().todayRecord;
    if (record) {
      const updated = { ...record, items: [...record.items, newItem] };
      saveRecord(updated);
      set({ todayRecord: updated });
    }
  },

  removeCustomItem: (itemId) => {
    // 1. Remove from local storage custom items template
    const custom = lsGet<ChecklistItemRecord[]>(STORAGE_KEYS.CUSTOM_ITEMS) || [];
    const newCustom = custom.filter((i) => i.id !== itemId);
    lsSet(STORAGE_KEYS.CUSTOM_ITEMS, newCustom);

    // 2. Remove from today's record
    const record = get().todayRecord;
    if (record) {
      const updated = {
        ...record,
        items: record.items.filter((i) => i.id !== itemId),
      };
      saveRecord(updated);
      set({ todayRecord: updated });
    }
  },

  renameCustomItem: (itemId, newLabel) => {
     // 1. Update in local storage
     const custom = lsGet<ChecklistItemRecord[]>(STORAGE_KEYS.CUSTOM_ITEMS) || [];
     const newCustom = custom.map(i => i.id === itemId ? { ...i, label: newLabel } : i);
     lsSet(STORAGE_KEYS.CUSTOM_ITEMS, newCustom);

     // 2. Update in today's record
     const record = get().todayRecord;
     if (record) {
       const updated = {
         ...record,
         items: record.items.map(i => i.id === itemId ? { ...i, label: newLabel } : i),
       };
       saveRecord(updated);
       set({ todayRecord: updated });
     }
  },

  completedCount: () => get().todayRecord?.items.filter((i) => i.completed).length || 0,
  totalCount: () => get().todayRecord?.items.length || 0,
}));
