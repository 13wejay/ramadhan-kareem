import { useState, useRef } from 'react';
import { Insight } from '../services/insightService';
import { motion } from 'framer-motion';
import { Bookmark, BookmarkCheck, Share2, Quote, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import ShareInsightCard, { typeColors, typeLabels } from './ShareInsightCard';
import { createPortal } from 'react-dom';

interface InsightCardProps {
  insight: Insight;
  isBookmarked: boolean;
  onBookmark: () => void;
  onShare?: () => void; // Legacy text share
  compact?: boolean;
}

export default function InsightCard({ insight, isBookmarked, onBookmark, onShare, compact }: InsightCardProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  const handleGenerateImage = async (action: 'share' | 'download') => {
    if (!shareRef.current) return;
    setIsGenerating(true);

    try {
      // Wait a moment for fonts/images
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(shareRef.current, {
        scale: 1, // Already high res 1080x1920
        useCORS: true,
        backgroundColor: '#f8f6f0',
      });

      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Failed to generate image');

      const file = new File([blob], `ramadhan-insight-${insight.id}.png`, { type: 'image/png' });

      if (action === 'share' && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: insight.title,
          text: `🌙 Daily Insight: ${insight.title}\n\nShared via Ramadhan Companion`,
          files: [file],
        });
      } else {
        // Fallback to download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ramadhan-insight-${insight.id}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error('Image generation failed', e);
      // Fallback to text share if image fails and it was a share action
      if (action === 'share' && onShare) onShare();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* Hidden container for image generation - Rendered via Portal to ensure it exists in DOM but off-screen */}
      {createPortal(
        <div style={{ position: 'absolute', top: '-10000px', left: '-10000px' }}>
          <ShareInsightCard ref={shareRef} insight={insight} />
        </div>,
        document.body
      )}

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
        <div className="flex items-center justify-between p-6 bg-white/40 dark:bg-black/20 border-t border-white/10 mt-auto relative">
          <button
            onClick={onBookmark}
            disabled={isGenerating}
            className="flex items-center gap-3 px-6 py-3 rounded-full hover:bg-white/50 transition-colors text-base font-bold text-[#1B4332] dark:text-white"
          >
            {isBookmarked ? <BookmarkCheck size={20} className="text-[#52B788]" /> : <Bookmark size={20} />}
            {isBookmarked ? 'Saved' : 'Save'}
          </button>
          
          <div className="flex items-center gap-3">
            {/* Download Button */}
            <button
               onClick={() => handleGenerateImage('download')}
               disabled={isGenerating}
               className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/50 transition-colors text-[#1B4332] dark:text-white"
               title="Save to Device"
            >
               <Download size={20} />
            </button>

            {/* Share Button (Direct) */}
            <button
              onClick={() => handleGenerateImage('share')}
              disabled={isGenerating}
              className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/50 transition-colors text-[#1B4332] dark:text-white relative"
              title="Share Insight"
            >
              {isGenerating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, ease: 'linear', duration: 1 }}
                  className="w-5 h-5 border-2 border-[#1B4332] border-t-transparent rounded-full"
                />
              ) : (
                <Share2 size={20} />
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
