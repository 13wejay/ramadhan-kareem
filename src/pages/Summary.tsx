import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Moon, Sun, BookOpen, Target, Activity, Calendar, 
  Share2, ChevronLeft, UtensilsCrossed 
} from 'lucide-react';
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
    { icon: UtensilsCrossed, label: 'Days Fasted', value: stats.daysFasted, color: '#D4A017', bg: 'bg-[#D4A017]/10' },
    { icon: Sun, label: 'Prayers Done', value: stats.totalPrayers, color: '#52B788', bg: 'bg-[#52B788]/10' },
    { icon: BookOpen, label: 'Quran Pages', value: stats.quranPages, color: '#1B4332', bg: 'bg-[#1B4332]/10' },
    { icon: Target, label: 'Goals Hit', value: `${stats.goalsAchieved}/${stats.totalGoals}`, color: '#9B59B6', bg: 'bg-[#9B59B6]/10' },
    { icon: Activity, label: 'Total Zikr', value: stats.totalZikr, color: '#E67E22', bg: 'bg-[#E67E22]/10' },
    { icon: Calendar, label: 'Days Tracked', value: stats.daysTracked, color: '#3498DB', bg: 'bg-[#3498DB]/10' },
  ];

  return (
    <div className="page-container space-y-8 pb-32">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-center pt-8 relative"
      >
        <Link 
          to="/home" 
          className="absolute top-8 left-0 w-12 h-12 glass-panel flex items-center justify-center text-[#1b4332] dark:text-white hover:bg-white/50 transition-colors"
        >
          <ChevronLeft size={24} />
        </Link>
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#1b4332] to-[#2d6a4f] flex items-center justify-center text-4xl shadow-xl mb-4">
          🌙
        </div>
        <h1 className="text-3xl font-bold text-[#1B4332] dark:text-white mb-1">Ramadhan Summary</h1>
        <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">{profile?.name}'s Journey</p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card flex flex-col items-center justify-center text-center !p-6 hover:scale-[1.02] transition-transform"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${stat.bg}`} style={{ color: stat.color }}>
              <stat.icon size={28} />
            </div>
            <p className="text-3xl font-bold countdown-mono mb-1" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
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
        className="w-full py-5 rounded-3xl bg-[#1B4332] text-white font-bold text-lg shadow-xl shadow-[#1B4332]/30 flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform"
      >
        <Share2 size={20} /> Share Summary
      </motion.button>
    </div>
  );
}
