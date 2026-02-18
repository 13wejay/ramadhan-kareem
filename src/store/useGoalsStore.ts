import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { lsGet, lsSet, lsDelete } from '../services/localStorage';
import { STORAGE_KEYS } from '../utils/storageKeys';

export interface Goal {
  id: string;
  title: string;
  category: 'quran' | 'prayer' | 'charity' | 'fasting' | 'personal' | 'custom';
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: string;
  endDate: string;
  isCompleted: boolean;
  milestoneNotified: number[];
  createdAt: string;
}

export interface DailyGoalLog {
  id: string;
  goalId: string;
  date: string;
  valueAdded: number;
  note: string;
  loggedAt: string;
}

interface GoalsState {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'currentValue' | 'isCompleted' | 'milestoneNotified' | 'createdAt'>) => void;
  deleteGoal: (id: string) => void;
  logProgress: (goalId: string, value: number, note?: string) => number | null;
  getGoalLogs: (goalId: string) => DailyGoalLog[];
}

export const useGoalsStore = create<GoalsState>()(
  persist(
    (set, get) => ({
      goals: [],

      addGoal: (goalData) => {
        const goal: Goal = {
          ...goalData,
          id: crypto.randomUUID(),
          currentValue: 0,
          isCompleted: false,
          milestoneNotified: [],
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ goals: [...s.goals, goal] }));
      },

      deleteGoal: (id) => {
        set((s) => ({ goals: s.goals.filter((g) => g.id !== id) }));
        lsDelete(`${STORAGE_KEYS.GOAL_LOGS_PREFIX}${id}`);
      },

      logProgress: (goalId, value, note = '') => {
        const goals = get().goals;
        const goal = goals.find((g) => g.id === goalId);
        if (!goal) return null;

        const newValue = goal.currentValue + value;
        const progress = Math.round((newValue / goal.targetValue) * 100);
        const milestones = [25, 50, 75, 100];
        let newMilestone: number | null = null;

        for (const m of milestones) {
          if (progress >= m && !goal.milestoneNotified.includes(m)) {
            newMilestone = m;
            goal.milestoneNotified.push(m);
          }
        }

        const updatedGoals = goals.map((g) =>
          g.id === goalId
            ? {
                ...g,
                currentValue: newValue,
                isCompleted: newValue >= g.targetValue,
                milestoneNotified: [...goal.milestoneNotified],
              }
            : g
        );
        set({ goals: updatedGoals });

        const logKey = `${STORAGE_KEYS.GOAL_LOGS_PREFIX}${goalId}`;
        const logs = lsGet<DailyGoalLog[]>(logKey) || [];
        logs.push({
          id: crypto.randomUUID(),
          goalId,
          date: new Date().toISOString().split('T')[0],
          valueAdded: value,
          note,
          loggedAt: new Date().toISOString(),
        });
        lsSet(logKey, logs);

        return newMilestone;
      },

      getGoalLogs: (goalId) => {
        return lsGet<DailyGoalLog[]>(`${STORAGE_KEYS.GOAL_LOGS_PREFIX}${goalId}`) || [];
      },
    }),
    { name: 'rc_goals' }
  )
);
