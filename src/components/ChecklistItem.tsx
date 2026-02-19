import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { listItemVariants } from '../utils/animations';

interface ChecklistItemProps {
  id: string;
  label: string;
  completed: boolean;
  onToggle: () => void;
  onAction?: () => void;
  actionLabel?: string;
  customData?: { value: number; label: string } | null;
  onDelete?: () => void;
  onEdit?: () => void;
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
  onDelete,
  onEdit,
}: ChecklistItemProps) {
  return (
    <motion.div
      layout
      variants={listItemVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`group relative flex items-center gap-5 px-6 py-5 rounded-3xl transition-all duration-300 ${
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
        className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${
          completed
            ? 'bg-[#52B788] text-white rotate-0'
            : 'bg-white dark:bg-black/20 text-transparent border border-black/5 dark:border-white/10 hover:border-[#52B788] rotate-12 hover:rotate-0'
        }`}
      >
         <Check size={20} strokeWidth={4} className={completed ? 'opacity-100' : 'opacity-0'} />
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center" onClick={onToggle}>
        <span
          className={`text-lg font-semibold transition-colors duration-300 ${
            completed ? 'text-gray-400 line-through decoration-2 decoration-[#52B788]/50' : 'text-[#1B4332] dark:text-white'
          }`}
        >
          {label}
        </span>
        {customData && (
          <span className="text-xs font-bold text-[#52B788] uppercase tracking-wide mt-1">
            {customData.value} {customData.label}
          </span>
        )}
      </div>

      {/* Custom Actions (Edit/Delete) */}
      {(onEdit || onDelete) && !completed && (
        <div className="flex items-center gap-1">
           {onEdit && (
             <button
               onClick={(e) => {
                 e.stopPropagation();
                 onEdit();
               }}
               className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
             >
               <span className="sr-only">Edit</span>
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
             </button>
           )}
           {onDelete && (
             <button
               onClick={(e) => {
                 e.stopPropagation();
                 onDelete();
               }}
               className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
             >
               <span className="sr-only">Delete</span>
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
             </button>
           )}
        </div>
      )}

      {/* Action (Chevron) - Only show if NO custom actions to avoid clutter */}
      {onAction && !completed && !onEdit && !onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAction();
          }}
          className="w-12 h-12 rounded-full flex items-center justify-center text-gray-400 hover:bg-[#52B788]/10 hover:text-[#52B788] transition-colors"
        >
          <ChevronRight size={24} />
        </button>
      )}
    </motion.div>
  );
}
