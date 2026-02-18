import { motion } from 'framer-motion';
import { TrendingUp, Trash2, BookOpen, Heart, Coins, Moon, Star, Pencil } from 'lucide-react';
import { Goal } from '../store/useGoalsStore';

interface GoalCardProps {
  goal: Goal;
  onLog: () => void;
  onDelete: () => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  quran: <BookOpen size={20} className="text-[#52B788]" />,
  prayer: <Star size={20} className="text-[#D4A017]" />,
  charity: <Coins size={20} className="text-[#E67E22]" />,
  fasting: <Moon size={20} className="text-[#9B59B6]" />,
  personal: <Heart size={20} className="text-[#E74C3C]" />,
  custom: <Pencil size={20} className="text-[#3498DB]" />,
};

const categoryColors: Record<string, string> = {
  quran: '#52B788',
  prayer: '#D4A017',
  charity: '#E67E22',
  fasting: '#9B59B6',
  personal: '#E74C3C',
  custom: '#3498DB',
};

export default function GoalCard({ goal, onLog, onDelete }: GoalCardProps) {
  const progress = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
  const color = categoryColors[goal.category] || '#6B7280';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`glass-card !p-6 flex flex-col justify-between group ${goal.isCompleted ? 'border-[#52B788]/50 shadow-[0_0_20px_rgba(82,183,136,0.1)]' : ''}`}
    >
      <div className="flex items-start justify-between mb-6">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
          style={{ backgroundColor: `${color}15`, color }}
        >
          {categoryIcons[goal.category] || <Star size={24} />}
        </div>
        <div className="text-right">
          <span className="text-xs font-bold uppercase tracking-widest opacity-50" style={{ color }}>
            {goal.category}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-[#1B4332] dark:text-white leading-tight mb-2">{goal.title}</h3>
        <div className="flex items-baseline gap-2">
           <span className="text-3xl font-light countdown-mono" style={{ color }}>
             {goal.currentValue}
           </span>
           <span className="text-sm text-gray-500 font-medium">/ {goal.targetValue} {goal.unit}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden mb-8">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ backgroundColor: color }}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-auto">
        {!goal.isCompleted ? (
           <button
             onClick={onLog}
             className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-white/50 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10 transition-colors text-base font-bold text-[#1B4332] dark:text-white border border-white/20 shadow-sm"
           >
             <TrendingUp size={18} /> Log
           </button>
        ) : (
           <div className="flex-1 py-4 text-center text-sm font-bold text-[#52B788] bg-[#52B788]/10 rounded-xl border border-[#52B788]/20">
             Completed!
           </div>
        )}
        
        <button
          onClick={onDelete}
          className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </motion.div>
  );
}
