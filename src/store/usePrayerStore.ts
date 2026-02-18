import { create } from 'zustand';
import { CachedPrayerTimes } from '../services/prayerTimesService';

interface PrayerState {
  todayPrayer: CachedPrayerTimes | null;
  isLoading: boolean;
  error: string | null;
  isOffline: boolean;
  setTodayPrayer: (data: CachedPrayerTimes) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setOffline: (offline: boolean) => void;
}

export const usePrayerStore = create<PrayerState>()((set) => ({
  todayPrayer: null,
  isLoading: false,
  error: null,
  isOffline: false,
  setTodayPrayer: (data) => set({ todayPrayer: data, isLoading: false, error: null }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),
  setOffline: (offline) => set({ isOffline: offline }),
}));
