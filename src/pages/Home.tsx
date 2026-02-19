import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckSquare, Target, Clock, Lightbulb, Settings, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useChecklistStore } from '../store/useChecklistStore';
import { usePrayerStore } from '../store/usePrayerStore';
import { fetchPrayerTimes, prefetchMonthlyPrayerTimes } from '../services/prayerTimesService';
import { getDailyInsight, Insight, getBookmarkedIds, toggleBookmark } from '../services/insightService';
import { getRamadhanDay } from '../utils/dateHelpers';
import CountdownTimer from '../components/CountdownTimer';
import ProgressRing from '../components/ProgressRing';
import InsightCard from '../components/InsightCard';
import { pageVariants, staggerContainer, fadeInUp, scaleIn } from '../utils/animations';

export default function Home() {
  const profile = useAuthStore((s) => s.profile);
  const { todayPrayer, setTodayPrayer, setLoading, setError } = usePrayerStore();
  const { loadToday, completedCount, totalCount } = useChecklistStore();
  const [insight, setInsight] = useState<Insight | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    if (profile) {
      loadToday();
      loadPrayerTimes();
      loadInsight();
      setBookmarks(getBookmarkedIds());
    }
  }, [profile]);

  const loadPrayerTimes = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const data = await fetchPrayerTimes(
        profile.latitude,
        profile.longitude,
        profile.calculationMethod,
        profile.madhab === 'hanafi' ? 1 : 0
      );
      if (data) {
        setTodayPrayer(data);
        const now = new Date();
        prefetchMonthlyPrayerTimes(
          profile.latitude,
          profile.longitude,
          profile.calculationMethod,
          profile.madhab === 'hanafi' ? 1 : 0,
          now.getFullYear(),
          now.getMonth() + 1
        );
      } else {
        setError('Could not load prayer times');
      }
    } catch {
      setError('Network error');
    }
  };

  const loadInsight = async () => {
    if (!profile) return;
    const day = getRamadhanDay(profile.ramadhanStartDate);
    
    // If before Ramadhan, show the first insight as a preview/preparation
    const targetDay = day < 1 ? 1 : day;
    
    try {
      const data = await getDailyInsight(targetDay);
      setInsight(data);
    } catch (error) {
      console.error('Error fetching insight:', error);
    }
  };

  const completed = completedCount();
  const total = totalCount();
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
  const ramadhanDay = profile ? getRamadhanDay(profile.ramadhanStartDate) : 1;

  const handleBookmark = () => {
    if (!insight) return;
    toggleBookmark(insight.id);
    setBookmarks(getBookmarkedIds());
  };

  const handleShare = async () => {
    if (!insight) return;
    const text = `${insight.title}\n\n${insight.translation || insight.content}\n\n— ${insight.source || 'Ramadhan Companion'}`;
    if (navigator.share) {
      await navigator.share({ title: insight.title, text });
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  const quickActions = [
    { to: '/checklist', icon: CheckSquare, label: 'Checklist', color: '#52B788' },
    { to: '/goals', icon: Target, label: 'Goals', color: '#D4A017' },
    { to: '/prayer', icon: Clock, label: 'Schedule', color: '#1B4332' },
    { to: '/insight', icon: Lightbulb, label: 'Insight', color: '#9B59B6' },
  ];

  return (
    <motion.div 
      className="page-container space-y-8 pb-32"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="text-center pt-8 relative"
      >


        <p className="arabic-text text-[#d4a017] text-lg mb-2 opacity-80">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        <h1 className="text-fluid-h1 mb-2">Ramadhan<br/>Kareem</h1>
        <p className="text-sm uppercase tracking-widest text-gray-500 font-medium">
          {ramadhanDay < 1 ? (
             <span className="text-[#1b4332] dark:text-[#52b788] font-bold">
               {1 - ramadhanDay} {(1 - ramadhanDay) === 1 ? 'Day' : 'Days'} Until Ramadhan
             </span>
          ) : (
            <>
              {ramadhanDay} Ramadhan · <span className="text-[#1b4332] dark:text-[#52b788]">{todayPrayer?.hijriDate?.split(' ').slice(-2).join(' ') || '...'}</span>
            </>
          )}
        </p>
      </motion.div>

      {/* Iftar Countdown Hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="glass-card text-center !py-10 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-4 opacity-50">
          <Clock size={20} className="text-[#1b4332] dark:text-white" />
        </div>
        
        {todayPrayer ? (
          (() => {
            const now = new Date();
            const getTargetDate = (timeStr: string) => {
               const [h, m] = timeStr.split(':').map(Number);
               const d = new Date();
               d.setHours(h, m, 0, 0);
               return d;
            };

            const maghrib = getTargetDate(todayPrayer.timings.Maghrib);
            const isha = getTargetDate(todayPrayer.timings.Isha);

            if (now < maghrib) {
               return (
                <CountdownTimer
                  targetTime={todayPrayer.timings.Maghrib}
                  label="Until Iftar"
                  subLabel={`Maghrib at ${todayPrayer.timings.Maghrib}`}
                  onComplete={() => window.location.reload()} 
                />
               );
            } else if (now < isha) {
               return (
                <CountdownTimer
                  targetTime={todayPrayer.timings.Isha}
                  label="Until Isha"
                  subLabel={`Isha at ${todayPrayer.timings.Isha}`}
                  onComplete={() => window.location.reload()}
                />
               );
            } else {
               return (
                 <div className="py-2">
                   <p className="text-xs font-bold tracking-widest uppercase text-[#52B788] mb-4 opacity-80">Finished</p>
                   <h2 className="text-2xl sm:text-3xl font-serif text-[#1b4332] dark:text-white leading-tight">
                     Ramadhan Nights,<br/>Alhamdulillah, Rest Well
                   </h2>
                 </div>
               );
            }
          })()
        ) : (
          <div className="py-8">
            <p className="text-gray-500">Loading prayer times...</p>
          </div>
        )}
      </motion.div>

      {/* Quick Actions - Horizontal Scroll */}
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-4">
        <motion.div variants={fadeInUp} className="flex items-center justify-between px-1">
          <h3 className="text-lg font-bold text-[#1b4332] dark:text-white">Quick Actions</h3>
          <span className="text-xs text-gray-400">Scroll for more →</span>
        </motion.div>
        
        <div className="flex overflow-x-auto gap-4 -mx-6 px-6 pb-4 no-scrollbar snap-x">
          {quickActions.map((item, i) => (
            <Link key={item.to} to={item.to} className="snap-start shrink-0">
              <motion.div
                variants={fadeInUp}
                whileTap={{ scale: 0.95 }}
                className="glass-card w-28 h-28 !p-0 flex flex-col items-center justify-center gap-3 hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
              >
                <div style={{ color: item.color }}>
                 <item.icon size={28} strokeWidth={1.5} />
                </div>
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{item.label}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Today's Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="glass-card !p-6 flex items-center justify-between"
      >
        <div>
          <h3 className="text-lg font-bold text-[#1b4332] dark:text-white mb-1">Daily Ibadah</h3>
          <p className="text-sm text-gray-500 mb-4">{completed} of {total} tasks completed</p>
          <Link
            to="/checklist"
            className="inline-flex items-center gap-1 text-sm font-bold text-[#52b788] hover:text-[#2d6a4f] transition-colors"
          >
            Go to Checklist <ChevronRight size={16} />
          </Link>
        </div>
        <ProgressRing progress={progress} size={80} strokeWidth={6}>
           <span className="text-sm font-bold text-[#1b4332] dark:text-white">{progress}%</span>
        </ProgressRing>
      </motion.div>

      {/* Today's Insight */}
      {insight && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card !p-0 overflow-hidden"
        >
          <div className="bg-[#1b4332]/5 dark:bg-white/5 p-4 border-b border-white/10 flex items-center justify-between">
             <div className="flex items-center gap-2">
               <Lightbulb size={16} className="text-[#d4a017]" />
               <span className="text-xs font-bold uppercase tracking-widest text-[#1b4332] dark:text-white">Daily Insight</span>
             </div>
          </div>
          <div className="p-0">
             <InsightCard
              insight={insight}
              isBookmarked={bookmarks.includes(insight.id)}
              onBookmark={handleBookmark}
              onShare={handleShare}
              compact
            />
          </div>
        </motion.div>
      )}

      {/* Bottom Spacer */}
      <div className="h-4"></div>
    </motion.div>
  );
}
