import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Trophy } from 'lucide-react';
import { useGoalsStore, Goal } from '../store/useGoalsStore';
import GoalCard from '../components/GoalCard';
import Modal from '../components/Modal';
import { scheduleNotification } from '../services/notificationService';
import { pageVariants, staggerContainer, fadeInUp, scaleIn } from '../utils/animations';

const CATEGORIES = ['quran', 'prayer', 'charity', 'fasting', 'personal', 'custom'] as const;

export default function Goals() {
  const { goals, addGoal, deleteGoal, logProgress } = useGoalsStore();
  const [showCreate, setShowCreate] = useState(false);
  const [logModal, setLogModal] = useState<Goal | null>(null);
  const [logValue, setLogValue] = useState('');
  const [logNote, setLogNote] = useState('');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Goal['category']>('quran');
  const [targetValue, setTargetValue] = useState('');
  const [unit, setUnit] = useState('');

  const activeGoals = goals.filter((g) => !g.isCompleted);
  const completedGoals = goals.filter((g) => g.isCompleted);
  
  const completionRate = goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0;

  const handleCreate = () => {
    if (!title.trim() || !targetValue) return;
    addGoal({
      title: title.trim(),
      category,
      targetValue: parseInt(targetValue),
      unit: unit.trim() || 'units',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
    });
    setShowCreate(false);
    setTitle('');
    setTargetValue('');
    setUnit('');
  };

  const handleLog = () => {
    if (!logModal || !logValue) return;
    const milestone = logProgress(logModal.id, parseInt(logValue), logNote);
    if (milestone) {
      scheduleNotification(
        'Goal Progress!',
        `You've reached ${milestone}% of "${logModal.title}"!`,
        100
      );
    }
    setLogModal(null);
    setLogValue('');
    setLogNote('');
  };

  return (
    <motion.div 
      className="page-container space-y-8 pb-32"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
       {/* Header */}
       <motion.div variants={fadeInUp} className="flex items-end justify-between px-2">
        <div>
           <h1 className="text-fluid-h1 text-4xl">Your<br/>Goals</h1>
           <p className="text-sm text-gray-500 font-medium mt-2">
             {activeGoals.length} Active · {completedGoals.length} Done
           </p>
        </div>
        <motion.button 
           variants={scaleIn}
           whileTap={{ scale: 0.9 }}
           onClick={() => setShowCreate(true)}
           className="w-12 h-12 rounded-full bg-[#1b4332] text-white flex items-center justify-center shadow-xl shadow-[#1b4332]/30"
        >
           <Plus size={24} />
        </motion.button>
      </motion.div>

      {/* Summary Hero */}
      {goals.length > 0 && (
        <motion.div 
           variants={scaleIn}
           className="glass-card !p-8 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4a017] to-transparent opacity-50" />
          <Trophy size={32} className="mx-auto text-[#d4a017] mb-3" />
          <h2 className="text-4xl font-light countdown-mono text-[#1B4332] dark:text-white mb-1">{completionRate}%</h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Goals Achieved</p>
        </motion.div>
      )}

      {/* Grid */}
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onLog={() => setLogModal(goal)}
              onDelete={() => deleteGoal(goal.id)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {goals.length === 0 && (
        <motion.div variants={fadeInUp} className="text-center py-20 opacity-50">
          <Target size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-400">Set your first Ramadhan goal</p>
        </motion.div>
      )}

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="New Goal">
        <div className="space-y-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Goal title"
            className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-none focus:ring-2 focus:ring-[#52B788]"
            autoFocus
          />
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Category</p>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs capitalize transition-all font-bold ${
                    category === cat ? 'bg-[#1b4332] text-white shadow-lg' : 'bg-gray-100 dark:bg-white/5 text-gray-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <input
              type="number"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              placeholder="Target"
              min="1"
              className="flex-1 max-w-1/2 px-5 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-none focus:ring-2 focus:ring-[#52B788]"
            />
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="Unit"
              className="flex-1 max-w-1/3 px-5 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-none focus:ring-2 focus:ring-[#52B788]"
            />
          </div>
          <button
            onClick={handleCreate}
            disabled={!title.trim() || !targetValue}
            className="w-full py-4 rounded-2xl bg-[#1b4332] text-white font-bold shadow-xl shadow-[#1b4332]/20 disabled:opacity-50"
          >
            Create Goal
          </button>
        </div>
      </Modal>

      {/* Log Modal */}
      <Modal
        isOpen={!!logModal}
        onClose={() => setLogModal(null)}
        title={`Log ${logModal?.unit || 'Progress'}`}
      >
        <div className="space-y-6 text-center">
          <input
            type="number"
            value={logValue}
            onChange={(e) => setLogValue(e.target.value)}
            placeholder="0"
            min="1"
            className="w-full text-center text-5xl font-light countdown-mono bg-transparent border-b-2 border-gray-200 focus:border-[#d4a017] focus:outline-none py-2"
            autoFocus
          />
          <button
            onClick={handleLog}
            disabled={!logValue}
            className="w-full py-4 rounded-2xl bg-[#d4a017] text-[#1b4332] font-bold shadow-xl shadow-[#d4a017]/20 disabled:opacity-50"
          >
            Update Progress
          </button>
        </div>
      </Modal>
    </motion.div>
  );
}
