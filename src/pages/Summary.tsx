import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useGoalsStore } from '../store/useGoalsStore';
import { lsGet, lsKeys } from '../services/localStorage';
import { STORAGE_KEYS } from '../utils/storageKeys';

interface ZikrRecord {
  subhanallah: number;
  alhamdulillah: number;
  allahuakbar: number;
}

interface ChecklistRecord {
  items: { id: string; completed: boolean; customData?: { value: number } | null }[];
}

export default function Summary() {
  const profile = useAuthStore((s) => s.profile);
  const { goals } = useGoalsStore();

  const stats = useMemo(() => {
    // Checklist stats
    const checklistKeys = lsKeys(STORAGE_KEYS.CHECKLIST_PREFIX);
    let totalPrayers = 0;
    let daysFasted = 0;
    let quranPages = 0;

    for (const key of checklistKeys) {
      const record = lsGet<ChecklistRecord>(key);
      if (!record) continue;
      const items = record.items || [];

      const prayerIds = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'tarawih'];
      totalPrayers += items.filter((i) => prayerIds.includes(i.id) && i.completed).length;

      const suhoor = items.find((i) => i.id === 'suhoor');
      const fajr = items.find((i) => i.id === 'fajr');
      if (suhoor?.completed || fajr?.completed) daysFasted++;

      const quranItem = items.find((i) => i.id === 'quran');
      if (quranItem?.customData) quranPages += quranItem.customData.value || 0;
    }

    // Zikr stats
    const zikrKeys = lsKeys(STORAGE_KEYS.ZIKR_PREFIX);
    let totalZikr = 0;
    for (const key of zikrKeys) {
      const record = lsGet<ZikrRecord>(key);
      if (record) totalZikr += (record.subhanallah || 0) + (record.alhamdulillah || 0) + (record.allahuakbar || 0);
    }

    const goalsAchieved = goals.filter((g) => g.isCompleted).length;

    return { totalPrayers, daysFasted, quranPages, totalZikr, goalsAchieved, totalGoals: goals.length, daysTracked: checklistKeys.length };
  }, [goals]);

  const statCards = [
    { icon: '🌙', label: 'Days Fasted', value: stats.daysFasted, color: '#D4A017' },
    { icon: '🕌', label: 'Prayers Completed', value: stats.totalPrayers, color: '#52B788' },
    { icon: '📖', label: 'Quran Pages', value: stats.quranPages, color: '#1B4332' },
    { icon: '🎯', label: 'Goals Achieved', value: `${stats.goalsAchieved}/${stats.totalGoals}`, color: '#9B59B6' },
    { icon: '📿', label: 'Total Zikr', value: stats.totalZikr, color: '#E67E22' },
    { icon: '📋', label: 'Days Tracked', value: stats.daysTracked, color: '#3498DB' },
  ];

  return (
    <div className="page-container space-y-5">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <span className="text-5xl block mb-2">🌙</span>
        <h1 className="text-xl font-bold text-[#1B4332] dark:text-white">Ramadhan Summary</h1>
        <p className="text-xs text-gray-400">{profile?.name}'s Journey</p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card text-center py-5"
          >
            <span className="text-3xl block mb-2">{stat.icon}</span>
            <p className="text-2xl font-bold countdown-mono" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Share */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={async () => {
          const text = `🌙 My Ramadhan Summary\n\n📅 ${stats.daysFasted} days fasted\n🕌 ${stats.totalPrayers} prayers completed\n📖 ${stats.quranPages} Quran pages read\n📿 ${stats.totalZikr} Zikr counted\n🎯 ${stats.goalsAchieved}/${stats.totalGoals} goals achieved\n\n— Ramadhan Companion`;
          if (navigator.share) {
            await navigator.share({ title: 'My Ramadhan Summary', text });
          } else {
            await navigator.clipboard.writeText(text);
          }
        }}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white font-bold tap-target"
      >
        📤 Share Summary
      </motion.button>

      <div className="text-center">
        <Link to="/home" className="text-xs text-[#52B788] font-semibold">← Back to Home</Link>
      </div>
    </div>
  );
}
