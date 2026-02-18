import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Sparkles, Heart } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { getDailyInsight, getBookmarkedInsights, getBookmarkedIds, toggleBookmark, Insight } from '../services/insightService';
import { getRamadhanDay } from '../utils/dateHelpers';
import InsightCard from '../components/InsightCard';

export default function DailyInsight() {
  const profile = useAuthStore((s) => s.profile);
  const [dailyInsight, setDailyInsight] = useState<Insight | null>(null);
  const [bookmarkedInsights, setBookmarkedInsights] = useState<Insight[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [showBookmarks, setShowBookmarks] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    if (!profile) return;
    const day = getRamadhanDay(profile.ramadhanStartDate);
    const insight = await getDailyInsight(day);
    setDailyInsight(insight);
    setBookmarks(getBookmarkedIds());
    const saved = await getBookmarkedInsights();
    setBookmarkedInsights(saved);
  };

  const handleBookmark = (insightId: string) => {
    toggleBookmark(insightId);
    setBookmarks(getBookmarkedIds());
    getBookmarkedInsights().then(setBookmarkedInsights);
  };

  const handleShare = async (insight: Insight) => {
    const text = `${insight.title}\n\n${insight.translation || insight.content}\n\n— ${insight.source || 'Ramadhan Companion'}`;
    if (navigator.share) {
      await navigator.share({ title: insight.title, text });
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="page-container space-y-8 pb-32">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between px-2">
        <div>
           <h1 className="text-fluid-h1 text-4xl">Daily<br/>Insight</h1>
           <p className="text-sm text-gray-500 font-medium mt-2">Spiritual nourishment</p>
        </div>
        <div className="bg-black/5 dark:bg-white/10 p-1 rounded-full flex">
          <button
            onClick={() => setShowBookmarks(false)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${!showBookmarks ? 'bg-white shadow-md text-[#1b4332]' : 'text-gray-400'}`}
          >
            <Sparkles size={18} />
          </button>
          <button
            onClick={() => setShowBookmarks(true)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${showBookmarks ? 'bg-white shadow-md text-[#d4a017]' : 'text-gray-400'}`}
          >
            <Heart size={18} />
          </button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {!showBookmarks ? (
          <motion.div
            key="daily"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {dailyInsight ? (
              <InsightCard
                insight={dailyInsight}
                isBookmarked={bookmarks.includes(dailyInsight.id)}
                onBookmark={() => handleBookmark(dailyInsight.id)}
                onShare={() => handleShare(dailyInsight)}
              />
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-400">Loading insight...</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="saved"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {bookmarkedInsights.length === 0 ? (
              <div className="text-center py-20 opacity-50">
                <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-400">No saved insights yet</p>
              </div>
            ) : (
              bookmarkedInsights.map((insight) => (
                <InsightCard
                  key={insight.id}
                  insight={insight}
                  isBookmarked={true}
                  onBookmark={() => handleBookmark(insight.id)}
                  onShare={() => handleShare(insight)}
                  compact
                />
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
