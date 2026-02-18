import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { Check, ChevronRight } from 'lucide-react';

interface ChecklistItemProps {
  id: string;
  label: string;
  completed: boolean;
  onToggle: () => void;
  onAction?: () => void;
  actionLabel?: string;
  customData?: { value: number; label: string } | null;
}

const itemIcons: Record<string, ReactNode> = {
  prayer: <span className="text-lg">🕌</span>,
  quran: <span className="text-lg">📖</span>,
  dhikr: <span className="text-lg">📿</span>,
  charity: <span className="text-lg">🤝</span>,
  fasting: <span className="text-lg">🌙</span>,
  tarawih: <span className="text-lg">🕌</span>,
  water: <span className="text-lg">💧</span>,
};

export default function ChecklistItem({
  id,
  label,
  completed,
  onToggle,
  onAction,
  customData,
}: ChecklistItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`group relative flex items-center gap-4 px-5 py-4 rounded-3xl transition-all duration-300 ${
        completed
          ? 'bg-white/20 dark:bg-white/5 backdrop-blur-sm'
          : 'glass-panel hover:bg-white/80 active:scale-[0.98]'
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm ${
          completed
            ? 'bg-[#52B788] text-white rotate-0'
            : 'bg-white dark:bg-black/20 text-transparent border border-black/5 dark:border-white/10 hover:border-[#52B788] rotate-12 hover:rotate-0'
        }`}
      >
         <Check size={16} strokeWidth={4} className={completed ? 'opacity-100' : 'opacity-0'} />
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center" onClick={onToggle}>
        <span
          className={`text-base font-semibold transition-colors duration-300 ${
            completed ? 'text-gray-400 line-through decoration-2 decoration-[#52B788]/50' : 'text-[#1B4332] dark:text-white'
          }`}
        >
          {label}
        </span>
        {customData && (
          <span className="text-xs font-bold text-[#52B788] uppercase tracking-wide">
            {customData.value} {customData.label}
          </span>
        )}
      </div>

      {/* Action (Chevron) */}
      {onAction && !completed && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAction();
          }}
          className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-[#52B788]/10 hover:text-[#52B788] transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </motion.div>
  );
}
