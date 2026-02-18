import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'en' | 'id' | 'ar';
  checklistResetAt: 'midnight' | 'fajr';
  tarawihRakat: 8 | 20;
  notifications: {
    suhoor: boolean;
    fajr: boolean;
    dhuhr: boolean;
    asr: boolean;
    iftarWarning: boolean;
    iftar: boolean;
    isha: boolean;
    checklistReminder: boolean;
    goalMilestone: boolean;
    dailyInsight: boolean;
  };
  notificationMinutesBefore: number;
}

const defaultSettings: AppSettings = {
  theme: 'light',
  language: 'en',
  checklistResetAt: 'midnight',
  tarawihRakat: 20,
  notifications: {
    suhoor: true,
    fajr: true,
    dhuhr: false,
    asr: false,
    iftarWarning: true,
    iftar: true,
    isha: false,
    checklistReminder: true,
    goalMilestone: true,
    dailyInsight: true,
  },
  notificationMinutesBefore: 10,
};

interface SettingsState {
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  updateNotification: (key: keyof AppSettings['notifications'], value: boolean) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (partial) =>
        set((s) => ({ settings: { ...s.settings, ...partial } })),
      updateNotification: (key, value) =>
        set((s) => ({
          settings: {
            ...s.settings,
            notifications: { ...s.settings.notifications, [key]: value },
          },
        })),
      resetSettings: () => set({ settings: defaultSettings }),
    }),
    { name: 'rc_settings' }
  )
);
