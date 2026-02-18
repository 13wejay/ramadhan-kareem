import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { getDayName, getTodayString } from '../utils/dateHelpers';
import { lsGet, lsKeys } from '../services/localStorage';
import { STORAGE_KEYS } from '../utils/storageKeys';
import { DailyChecklistRecord } from '../store/useChecklistStore';

interface DayData {
  date: string;
  label: string;
  completed: number;
  total: number;
  percentage: number;
}

export default function WeeklyChart() {
  const data = useMemo<DayData[]>(() => {
    const days: DayData[] = [];
    const today = new Date();
    
    // Last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const key = `${STORAGE_KEYS.CHECKLIST_PREFIX}${dateStr}`;
      const record = lsGet<DailyChecklistRecord>(key);
      
      const total = record?.items.length || 0;
      const completed = record?.items.filter(item => item.completed).length || 0;
      
      days.push({
        date: dateStr,
        label: i === 0 ? 'Today' : getDayName(dateStr).slice(0, 3), // Mon, Tue...
        completed,
        total,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      });
    }
    return days;
  }, []);

  const topPercentage = Math.max(...data.map(d => d.percentage));
  const avgPercentage = Math.round(data.reduce((acc, curr) => acc + curr.percentage, 0) / 7);
  const greatDays = data.filter(d => d.percentage >= 80).length;
  const totalTasks = data.reduce((acc, curr) => acc + curr.completed, 0);

  return (
    <div className="glass-card !p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold text-[#1B4332] dark:text-white uppercase tracking-wider opacity-80">Weekly Consistency</h3>
          <p className="text-xs text-gray-500 mt-1">Last 7 days performance</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-light countdown-mono text-[#1B4332] dark:text-white">{avgPercentage}%</span>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Avg</p>
        </div>
      </div>

      <div className="flex items-end justify-between gap-2 h-32">
        {data.map((day, i) => (
          <div key={day.date} className="flex-1 flex flex-col items-center gap-2 group">
            {/* Bar container */}
            <div className="w-full relative rounded-full bg-white/20 dark:bg-white/5 overflow-hidden" style={{ height: '100%' }}>
              
              {/* Filled portion */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 rounded-full"
                initial={{ height: 0 }}
                animate={{ height: `${day.percentage}%` }}
                transition={{ duration: 1, delay: i * 0.1, type: 'spring' }}
                style={{
                  background: day.percentage >= 80 
                    ? 'linear-gradient(to top, #52B788, #88D8B0)' 
                    : day.percentage >= 50 
                      ? 'linear-gradient(to top, #D4A017, #F0C850)' 
                      : 'linear-gradient(to top, #9CA3AF, #D1D5DB)',
                  opacity: 0.8
                }}
              />
            </div>

            {/* Day label */}
            <span className={`text-[10px] font-bold tracking-wider ${day.label === 'Today' ? 'text-[#1B4332] dark:text-white' : 'text-gray-400'}`}>
              {day.label.charAt(0)}
            </span>
          </div>
        ))}
      </div>
      
      {/* Stats footer */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/20">
         <div>
            <span className="text-xs text-gray-500 uppercase tracking-widest">Great Days</span>
            <p className="text-lg font-bold text-[#1B4332] dark:text-white">{greatDays} <span className="text-xs font-normal text-gray-400">/ 7</span></p>
         </div>
         <div>
            <span className="text-xs text-gray-500 uppercase tracking-widest">Total Tasks</span>
            <p className="text-lg font-bold text-[#1B4332] dark:text-white">{totalTasks}</p>
         </div>
      </div>
    </div>
  );
}
