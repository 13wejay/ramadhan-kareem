import { Insight } from '../services/insightService';
import { motion } from 'framer-motion';
import { Bookmark, BookmarkCheck, Share2, Quote } from 'lucide-react';

interface InsightCardProps {
  insight: Insight;
  isBookmarked: boolean;
  onBookmark: () => void;
  onShare?: () => void;
  compact?: boolean;
}

const typeColors: Record<string, string> = {
  hadith: '#D4A017',
  quran: '#52B788',
  names_of_allah: '#9B59B6',
  seerah: '#3498DB',
  ramadhan_fact: '#E67E22',
  dua: '#1B4332',
  quote: '#6B7280',
};

const typeLabels: Record<string, string> = {
  hadith: 'Hadith',
  quran: 'Quran',
  names_of_allah: 'Divine Name',
  seerah: 'Seerah',
  ramadhan_fact: 'Did You Know?',
  dua: "Daily Du'a",
  quote: 'Quote',
};

export default function InsightCard({ insight, isBookmarked, onBookmark, onShare, compact }: InsightCardProps) {
  return (
    <motion.div
      layout
      className={`glass-card !p-0 overflow-hidden group ${!compact ? 'min-h-[60vh] flex flex-col' : ''}`}
    >
      {/* Editorial Header */}
      <div className="relative p-8 pb-4">
         <span
          className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-white mb-4 shadow-sm"
          style={{ backgroundColor: typeColors[insight.type] || '#6B7280' }}
        >
          {typeLabels[insight.type] || insight.type}
        </span>
        <h3 className={`font-serif font-bold text-[#1B4332] dark:text-white leading-tight ${compact ? 'text-2xl' : 'text-4xl'}`}>
          {insight.title}
        </h3>
      </div>

      {/* Content Body */}
      <div className="p-8 pt-2 flex-1 relative">
        {insight.arabicText && (
          <div className="mb-10 relative mt-4">
            <Quote size={48} className="absolute -top-4 -left-4 text-[#52B788]/10 rotate-180" />
            <p className="arabic-text-right text-3xl text-[#1B4332] dark:text-[#F0C850] relative z-10 leading-loose">
              {insight.arabicText}
            </p>
          </div>
        )}

        {insight.transliteration && (
          <p className="text-base italic font-serif text-gray-500 mb-6 pl-6 border-l-4 border-[#D4A017]/30">
            {insight.transliteration}
          </p>
        )}

        {insight.translation && (
          <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed font-serif mb-6">
            "{insight.translation}"
          </p>
        )}

        {!compact && insight.content && (
          <div className="prose prose-lg dark:prose-invert max-w-none mb-8 text-gray-600 dark:text-gray-300 leading-relaxed">
             <p>{insight.content}</p>
          </div>
        )}

        {insight.source && (
          <p className="text-sm font-bold text-[#1B4332] dark:text-white uppercase tracking-widest opacity-60">
            — {insight.source}
          </p>
        )}

        {!compact && insight.reflection && (
          <div className="mt-10 p-6 rounded-3xl bg-[#52B788]/5 border border-[#52B788]/10">
            <h4 className="flex items-center gap-2 text-xs font-bold text-[#52B788] uppercase tracking-widest mb-3">
              <span className="w-2 h-2 rounded-full bg-[#52B788]" /> Reflection
            </h4>
            <p className="text-base text-gray-600 dark:text-gray-300 leading-loose italic">
              {insight.reflection}
            </p>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between p-6 bg-white/40 dark:bg-black/20 border-t border-white/10 mt-auto">
        <button
          onClick={onBookmark}
          className="flex items-center gap-3 px-6 py-3 rounded-full hover:bg-white/50 transition-colors text-base font-bold text-[#1B4332] dark:text-white"
        >
          {isBookmarked ? <BookmarkCheck size={20} className="text-[#52B788]" /> : <Bookmark size={20} />}
          {isBookmarked ? 'Saved' : 'Save'}
        </button>
        {onShare && (
          <button
            onClick={onShare}
            className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/50 transition-colors text-[#1B4332] dark:text-white"
          >
            <Share2 size={20} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
