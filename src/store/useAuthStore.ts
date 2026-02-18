import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  id: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  calculationMethod: number;
  madhab: 'hanafi' | 'shafii';
  ramadhanStartDate: string;
  createdAt: string;
}

interface AuthState {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  clearProfile: () => void;
  isOnboarded: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
      clearProfile: () => set({ profile: null }),
      isOnboarded: () => get().profile !== null,
    }),
    { name: 'rc_user_profile' }
  )
);
