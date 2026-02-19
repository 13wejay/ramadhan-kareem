import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { lsGet, lsSet } from '../services/localStorage';
import { STORAGE_KEYS } from '../utils/storageKeys';
import { getTodayString } from '../utils/dateHelpers';
import { pageVariants } from '../utils/animations';

interface ZikrRecord {
  date: string;
  subhanallah: number;
  alhamdulillah: number;
  allahuakbar: number;
  completed: boolean;
  completedAt: string | null;
}

const PHASES = [
  { key: 'subhanallah', arabic: 'سُبْحَانَ اللَّهِ', latin: 'SubhanAllah', meaning: 'Glory be to Allah', target: 33, color: '#52B788' },
  { key: 'alhamdulillah', arabic: 'الْحَمْدُ لِلَّهِ', latin: 'Alhamdulillah', meaning: 'All praise is due to Allah', target: 33, color: '#D4A017' },
  { key: 'allahuakbar', arabic: 'اللَّهُ أَكْبَرُ', latin: 'Allahu Akbar', meaning: 'Allah is the Greatest', target: 34, color: '#9B59B6' },
] as const;

export default function Zikr() {
  const navigate = useNavigate();
  const today = getTodayString();
  const key = `${STORAGE_KEYS.ZIKR_PREFIX}${today}`;

  const [record, setRecord] = useState<ZikrRecord>(() => {
    const saved = lsGet<ZikrRecord>(key);
    return saved || { date: today, subhanallah: 0, alhamdulillah: 0, allahuakbar: 0, completed: false, completedAt: null };
  });

  const [phase, setPhase] = useState(() => {
    const saved = lsGet<ZikrRecord>(key);
    if (!saved) return 0;
    if (saved.subhanallah < 33) return 0;
    if (saved.alhamdulillah < 33) return 1;
    if (saved.allahuakbar < 34) return 2;
    return 2;
  });

  const [showComplete, setShowComplete] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [flash, setFlash] = useState(false);

  const currentPhase = PHASES[phase];
  const currentCount = record[currentPhase.key as keyof ZikrRecord] as number;
  const total = record.subhanallah + record.alhamdulillah + record.allahuakbar;

  const saveRecord = useCallback((updated: ZikrRecord) => {
    lsSet(key, updated);
    setRecord(updated);
  }, [key]);

  const handleReset = useCallback(() => {
    setShowResetConfirm(true);
  }, []);

  const confirmReset = useCallback(() => {
    const reset: ZikrRecord = { date: today, subhanallah: 0, alhamdulillah: 0, allahuakbar: 0, completed: false, completedAt: null };
    saveRecord(reset);
    setPhase(0);
    setShowComplete(false);
    setShowResetConfirm(false);
    if (navigator.vibrate) navigator.vibrate(50);
  }, [today, saveRecord]);

  const handleTap = useCallback(() => {
    if (record.completed || showResetConfirm) return;

    const phaseKey = currentPhase.key as 'subhanallah' | 'alhamdulillah' | 'allahuakbar';
    const newCount = (record[phaseKey] as number) + 1;
    const updated = { ...record, [phaseKey]: newCount };

    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate(30);

    // Check if phase complete
    if (newCount >= currentPhase.target) {
      setFlash(true);
      setTimeout(() => setFlash(false), 300);

      if (phase < 2) {
        // Move to next phase
        setTimeout(() => setPhase(phase + 1), 500);
      } else {
        // All complete!
        updated.completed = true;
        updated.completedAt = new Date().toISOString();
        setShowComplete(true);
      }
    }

    saveRecord(updated);
  }, [record, phase, currentPhase, saveRecord]);

  // Handle keyboard space
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleTap();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleTap]);

  if (showComplete) {
    return (
      <motion.div
        className="min-h-dvh flex flex-col items-center justify-center bg-gradient-to-b from-[#1B4332] to-[#0D2016] p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Confetti particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            initial={{ y: -20, x: Math.random() * 400 - 200, opacity: 1 }}
            animate={{ y: '100vh', rotate: 720, opacity: 0 }}
            transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 0.5 }}
          >
            {['🌙', '⭐', '✨', '🌿', '💚'][Math.floor(Math.random() * 5)]}
          </motion.div>
        ))}

        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-7xl mb-6"
        >
          🌿
        </motion.span>
        <h1 className="text-3xl font-bold text-white mb-2">MashaAllah!</h1>
        <p className="text-white/60 text-center mb-8">You've completed your Tasbih for today</p>
        <p className="text-6xl font-bold text-[#D4A017] countdown-mono mb-8">{total}</p>

        <div className="flex gap-3 w-full max-w-sm">
          <button
            onClick={() => {
              const reset: ZikrRecord = { date: today, subhanallah: 0, alhamdulillah: 0, allahuakbar: 0, completed: false, completedAt: null };
              saveRecord(reset);
              setPhase(0);
              setShowComplete(false);
            }}
            className="flex-1 py-3 rounded-xl bg-white/10 text-white font-bold tap-target"
          >
            Repeat
          </button>
          <button
            onClick={() => navigate('/checklist')}
            className="flex-1 py-3 rounded-xl bg-[#D4A017] text-[#1B4332] font-bold tap-target"
          >
            Done ✓
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-dvh flex flex-col select-none cursor-pointer"
      style={{ backgroundColor: flash ? `${currentPhase.color}22` : 'transparent' }}
      onClick={handleTap}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={(e) => { e.stopPropagation(); navigate(-1); }}
          className="tap-target w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 text-sm"
        >
          ←
        </button>
        <div className="text-center">
          <p className="text-xs text-gray-400">Total</p>
          <p className="text-lg font-bold text-[#1B4332] dark:text-white countdown-mono">{total} / 100</p>
        </div>
        <div className="w-10" />
      </div>

      {/* Phase indicators */}
      <div className="flex gap-2 px-6">
        {PHASES.map((p, i) => (
          <div key={p.key} className="flex-1">
            <div className={`h-1 rounded-full transition-all ${
              i < phase ? 'bg-[#52B788]' : i === phase ? `bg-[${p.color}]` : 'bg-gray-200 dark:bg-white/10'
            }`} style={i <= phase ? { backgroundColor: p.color } : {}} />
          </div>
        ))}
      </div>

      {/* Main tap area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center"
          >
            <p className="arabic-text text-4xl mb-4" style={{ color: currentPhase.color }}>
              {currentPhase.arabic}
            </p>
            <p className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-1">
              {currentPhase.latin}
            </p>
            <p className="text-xs text-gray-400 mb-8">
              {currentPhase.meaning}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Counter */}
        <motion.div
          key={currentCount}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500 }}
          className="w-32 h-32 rounded-full flex items-center justify-center border-4"
          style={{ borderColor: currentPhase.color }}
        >
          <div className="text-center">
            <span className="text-4xl font-bold countdown-mono" style={{ color: currentPhase.color }}>
              {currentCount}
            </span>
            <span className="text-sm text-gray-400 block">/ {currentPhase.target}</span>
          </div>
        </motion.div>

        <p className="text-xs text-gray-400 mt-8 mb-6">Tap anywhere to count</p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleReset();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-white/10 text-sm font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <span>↺</span>
          <span>Reset Counter</span>
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              setShowResetConfirm(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#1B4332] rounded-2xl p-6 w-full max-w-sm shadow-xl border border-white/10"
            >
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Reset Counter?</h3>
              <p className="text-gray-500 dark:text-gray-300 mb-6">
                This will reset your current progress for today to zero. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white font-medium hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReset}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                >
                  Reset
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
