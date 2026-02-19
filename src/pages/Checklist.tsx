import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useChecklistStore } from '../store/useChecklistStore';
import { useNavigate } from 'react-router-dom';
import ChecklistItem from '../components/ChecklistItem';
import Modal from '../components/Modal';
import WeeklyChart from '../components/WeeklyChart';
import { pageVariants, fadeInUp, scaleIn } from '../utils/animations';

export default function Checklist() {
  const navigate = useNavigate();
  const { 
    todayRecord, toggleItem, updateItemData, 
    loadToday, // Import loadToday
    addCustomItem, removeCustomItem, renameCustomItem,
    completedCount, totalCount 
  } = useChecklistStore();
  
  // Load data on mount
  useEffect(() => {
    loadToday();
  }, []);
  
  const [quranModal, setQuranModal] = useState(false);
  const [quranPages, setQuranPages] = useState('');
  
  const [customModal, setCustomModal] = useState(false);
  const [customLabel, setCustomLabel] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  const completed = completedCount();
  const total = totalCount();
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const handleQuranSave = () => {
    if (!quranPages) return;
    updateItemData('quran', parseInt(quranPages), 'pages');
    setQuranModal(false);
    setQuranPages('');
  };

  const handleCustomSubmit = () => {
    if (!customLabel.trim()) return;
    
    if (editId) {
      renameCustomItem(editId, customLabel.trim());
    } else {
      addCustomItem(customLabel.trim(), '✅');
    }
    
    setCustomModal(false);
    setCustomLabel('');
    setEditId(null);
  };

  const openCustomModal = (item?: { id: string; label: string }) => {
    if (item) {
      setEditId(item.id);
      setCustomLabel(item.label);
    } else {
      setEditId(null);
      setCustomLabel('');
    }
    setCustomModal(true);
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
           <h1 className="text-fluid-h1 text-4xl">Checklist</h1>
           <p className="text-sm text-gray-500 font-medium">Track your spiritual habits</p>
        </div>
        <div className="text-right">
           <span className="text-3xl font-light countdown-mono text-[#52B788]">{progress}%</span>
           <p className="text-xs text-gray-400 uppercase tracking-widest">Done</p>
        </div>
      </motion.div>

      {/* Weekly Graph */}
      <motion.div variants={fadeInUp} transition={{ delay: 0.1 }}>
        <WeeklyChart />
      </motion.div>

      {/* Items List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">Today's Goals</h3>
        <AnimatePresence mode="sync" initial={false}>
          {todayRecord?.items.map((item) => (
            <ChecklistItem
              key={item.id}
              id={item.id}
              label={item.label}
              completed={item.completed}
              customData={item.customData ? { value: item.customData.value, label: item.customData.unit } : null}
              onToggle={() => {
                if (item.id === 'quran' && !item.completed) {
                  setQuranModal(true);
                } else if (item.id === 'zikr' && !item.completed) {
                  navigate('/zikr');
                } else {
                  toggleItem(item.id);
                }
              }}
              onAction={
                item.id === 'quran'
                  ? () => setQuranModal(true)
                  : item.id === 'zikr'
                    ? () => navigate('/zikr')
                    : undefined
              }
              onDelete={item.isCustom ? () => removeCustomItem(item.id) : undefined}
              onEdit={item.isCustom ? () => openCustomModal(item) : undefined}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Add Custom Item FAB */}
      <motion.button
        variants={scaleIn}
        whileTap={{ scale: 0.95 }}
        onClick={() => openCustomModal()}
        className="fixed bottom-28 right-6 w-14 h-14 rounded-full bg-[#1b4332] text-white flex items-center justify-center shadow-2xl shadow-[#1b4332]/40 z-40 hover:bg-[#2d6a4f] transition-colors"
      >
        <Plus size={24} />
      </motion.button>

      {/* Modals */}
      <Modal isOpen={quranModal} onClose={() => setQuranModal(false)} title="📖 Reading">
        <div className="space-y-6 text-center">
          <p className="text-gray-500">How many pages did you read?</p>
          <input
            type="number"
            value={quranPages}
            onChange={(e) => setQuranPages(e.target.value)}
            className="w-full text-center text-4xl font-light countdown-mono bg-transparent border-b-2 border-gray-200 focus:border-[#52B788] focus:outline-none py-2"
            autoFocus
            placeholder="0"
          />
          <button
            onClick={handleQuranSave}
            className="w-full py-4 rounded-2xl bg-[#52B788] text-white font-bold shadow-lg shadow-[#52B788]/30"
          >
            Save Progress
          </button>
        </div>
      </Modal>

      <Modal isOpen={customModal} onClose={() => setCustomModal(false)} title={editId ? "Edit Habit" : "New Habit"}>
        <div className="space-y-6">
          <input
            type="text"
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            placeholder="Goal name..."
            className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-none focus:ring-2 focus:ring-[#52B788]"
            autoFocus
          />
          <button
            onClick={handleCustomSubmit}
            disabled={!customLabel.trim()}
            className="w-full py-4 rounded-2xl bg-[#1b4332] text-white font-bold shadow-lg disabled:opacity-50"
          >
            {editId ? "Update Habit" : "Add Habit"}
          </button>
        </div>
      </Modal>
    </motion.div>
  );
}
