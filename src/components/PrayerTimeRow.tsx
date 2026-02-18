import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface PrayerTimeRowProps {
  name: string;
  arabicName: string;
  time: string;
  isNext: boolean;
  isPast: boolean;
  icon: string;
}

export default function PrayerTimeRow({ name, arabicName, time, isNext, isPast }: PrayerTimeRowProps) {
  return (
    <div className="relative flex items-center gap-4 pl-4">
      {/* Timeline Line */}
      <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-black/5 dark:bg-white/10 -z-10" />

      {/* Timeline Node */}
      <div 
        className={`w-6 h-6 rounded-full border-4 transition-all duration-500 z-10 box-content ${
          isNext 
            ? 'border-[#52B788] bg-white dark:bg-[#1b4332] scale-125 shadow-[0_0_0_4px_rgba(82,183,136,0.2)]' 
            : isPast 
              ? 'border-[#1b4332] dark:border-white/20 bg-[#1b4332] dark:bg-white/20' 
              : 'border-gray-200 dark:border-white/10 bg-white dark:bg-black/20'
        }`}
      />

      {/* Card */}
      <motion.div
        layout
        className={`flex-1 flex items-center gap-4 px-5 py-4 rounded-3xl transition-all duration-500 ${
          isNext
            ? 'glass-card bg-[#52B788]/10 border-[#52B788]/20 shadow-lg'
            : isPast
              ? 'bg-transparent opacity-60 grayscale'
              : 'glass-panel'
        }`}
      >
        {/* Icon */}
        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
            isNext ? 'bg-[#52B788] text-white' : 'bg-black/5 dark:bg-white/5 text-gray-400'
          }`}
        >
          <Clock size={18} />
        </div>

        {/* Name */}
        <div className="flex-1">
          <p className={`text-sm font-bold ${isNext ? 'text-[#1B4332] dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
            {name}
          </p>
          <p className="arabic-text text-sm opacity-50" style={{ lineHeight: '1' }}>
            {arabicName}
          </p>
        </div>

        {/* Time */}
        <div className="text-right">
          <p className={`text-lg font-light countdown-mono ${isNext ? 'text-[#1B4332] dark:text-white font-bold' : 'text-gray-600 dark:text-gray-300'}`}>
            {time}
          </p>
          {isNext && (
            <motion.span 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-[10px] font-bold text-[#52B788] uppercase tracking-widest block"
            >
              Next
            </motion.span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
