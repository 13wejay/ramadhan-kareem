import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, CalendarDays, WifiOff } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { usePrayerStore } from '../store/usePrayerStore';
import { fetchPrayerTimes } from '../services/prayerTimesService';
import PrayerTimeRow from '../components/PrayerTimeRow';
import { getSecondsUntil } from '../utils/dateHelpers';

const PRAYER_LIST = [
  { key: 'Imsak', name: 'Imsak', arabicName: 'إمساك' },
  { key: 'Fajr', name: 'Fajr', arabicName: 'الفجر' },
  { key: 'Sunrise', name: 'Sunrise', arabicName: 'الشروق' },
  { key: 'Dhuhr', name: 'Dhuhr', arabicName: 'الظهر' },
  { key: 'Asr', name: 'Asr', arabicName: 'العصر' },
  { key: 'Maghrib', name: 'Maghrib', arabicName: 'المغرب' },
  { key: 'Isha', name: 'Isha', arabicName: 'العشاء' },
] as const;

export default function PrayerSchedule() {
  const profile = useAuthStore((s) => s.profile);
  const { todayPrayer, isLoading, error, setTodayPrayer, setLoading, setError } = usePrayerStore();

  useEffect(() => {
    if (!profile) return;
    if (todayPrayer) return; // already loaded from Home
    loadPrayer();
  }, [profile]);

  const loadPrayer = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const data = await fetchPrayerTimes(
        profile.latitude,
        profile.longitude,
        profile.calculationMethod,
        profile.madhab === 'hanafi' ? 1 : 0
      );
      if (data) setTodayPrayer(data);
      else setError('Could not load prayer times');
    } catch {
      setError('Network error. Showing cached data if available.');
    }
  };

  const getTimeStatus = (timeStr: string, nextPrayerKey: string | null, currentKey: string) => {
    if (currentKey === nextPrayerKey) return 'next';
    const seconds = getSecondsUntil(timeStr);
    return seconds < 0 || seconds > 86000 ? 'past' : 'future'; // approximate logic, handled better by comparison
  };

  const getNextPrayer = (): string | null => {
    if (!todayPrayer) return null;
    const timings = todayPrayer.timings;
    for (const p of PRAYER_LIST) {
      const time = timings[p.key as keyof typeof timings];
      if (getSecondsUntil(time) > 0) return p.key;
    }
    return null; // All passed (next day)
  };

  const nextPrayer = getNextPrayer();

  return (
    <div className="page-container space-y-8 pb-32">
       {/* Header */}
       <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between px-2">
        <div>
           <h1 className="text-fluid-h1 text-4xl">Prayer<br/>Schedule</h1>
           {todayPrayer && (
             <p className="text-sm text-gray-500 font-medium mt-2 flex items-center gap-2">
               <CalendarDays size={14} /> {todayPrayer.hijriDate}
             </p>
           )}
        </div>
        {profile && (
          <div className="text-right">
             <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 text-xs font-semibold">
               <MapPin size={10} /> {profile.city}
             </div>
          </div>
        )}
      </motion.div>

      {/* Error */}
      {error && (
        <div className="glass-panel !bg-red-500/10 !border-red-500/20 p-4 rounded-2xl flex items-center gap-3">
          <WifiOff size={18} className="text-red-500" />
          <p className="text-sm text-red-500 font-medium">{error}</p>
        </div>
      )}

      {/* Timeline */}
      {todayPrayer && (
        <div className="space-y-4 relative">
           
           {/* Timeline Line Vertical Background - handled in Row comp but we can add global line if needed. Row comp is better for segments. */}

          {PRAYER_LIST.map((prayer, i) => {
            const time = todayPrayer.timings[prayer.key as keyof typeof todayPrayer.timings];
            const isNext = prayer.key === nextPrayer;
            const seconds = getSecondsUntil(time);
            // Logic: if it's next, it's next. If not next, check if it's passed (-ve seconds).
            const isPast = !isNext && seconds <= 0 && seconds > -86400; // Passed today
            
            return (
              <motion.div
                key={prayer.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <PrayerTimeRow
                  name={prayer.name}
                  arabicName={prayer.arabicName}
                  time={time}
                  isNext={isNext}
                  isPast={isPast}
                  icon=""
                />
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
