import { useState, useEffect } from 'react';
import { getSecondsUntil } from '../utils/dateHelpers';

interface CountdownTimerProps {
  targetTime: string;
  label: string;
  subLabel?: string;
}

export default function CountdownTimer({ targetTime, label, subLabel }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{ h: string; m: string; s: string } | null>(null);

  useEffect(() => {
    const update = () => {
      const seconds = getSecondsUntil(targetTime);
      if (seconds <= 0) {
        setTimeLeft(null);
        return;
      }
      const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
      const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
      const s = Math.floor(seconds % 60).toString().padStart(2, '0');
      setTimeLeft({ h, m, s });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  if (!timeLeft) return null;

  return (
    <div className="text-center">
      <p className="text-xs font-bold tracking-widest uppercase text-[#52B788] mb-2 opacity-80">{label}</p>
      
      <div className="flex items-center justify-center gap-2 sm:gap-4 text-[#1B4332] dark:text-white">
        <div className="flex flex-col items-center">
          <span className="text-5xl sm:text-6xl font-light countdown-mono leading-none tracking-tighter shadow-green-glow">
            {timeLeft.h}
          </span>
          <span className="text-[10px] uppercase tracking-widest opacity-40 mt-1">Hrs</span>
        </div>
        <span className="text-3xl sm:text-4xl opacity-30 font-light -mt-4">:</span>
        <div className="flex flex-col items-center">
          <span className="text-5xl sm:text-6xl font-light countdown-mono leading-none tracking-tighter">
            {timeLeft.m}
          </span>
          <span className="text-[10px] uppercase tracking-widest opacity-40 mt-1">Min</span>
        </div>
        <span className="text-3xl sm:text-4xl opacity-30 font-light -mt-4">:</span>
        <div className="flex flex-col items-center">
          <span className="text-5xl sm:text-6xl font-light countdown-mono leading-none tracking-tighter">
            {timeLeft.s}
          </span>
          <span className="text-[10px] uppercase tracking-widest opacity-40 mt-1">Sec</span>
        </div>
      </div>

      {subLabel && (
        <p className="text-sm text-gray-500 mt-3 font-medium tracking-wide">
          {subLabel}
        </p>
      )}
    </div>
  );
}
