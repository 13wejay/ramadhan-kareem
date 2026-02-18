import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Moon, Sun, Bell, BellOff, Download, Trash2,
  BarChart3, ChevronRight, LogOut, Monitor
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useSettingsStore } from '../store/useSettingsStore';
import Modal from '../components/Modal';

export default function Settings() {
  const navigate = useNavigate();
  const { profile, clearProfile, setProfile } = useAuthStore();
  const { settings, updateSettings, updateNotification } = useSettingsStore();
  const [showReset, setShowReset] = useState(false);
  const [editName, setEditName] = useState(false);
  const [nameValue, setNameValue] = useState(profile?.name || '');

  const handleNameSave = () => {
    if (!nameValue.trim() || !profile) return;
    setProfile({ ...profile, name: nameValue.trim() });
    setEditName(false);
  };

  const handleExport = () => {
    const data: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) data[key] = localStorage.getItem(key);
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ramadhan-companion-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    localStorage.clear();
    clearProfile();
    setShowReset(false);
    navigate('/onboarding');
  };

  const themeOptions: { value: 'light' | 'dark' | 'auto'; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun size={18} /> },
    { value: 'dark', label: 'Dark', icon: <Moon size={18} /> },
    { value: 'auto', label: 'System', icon: <Monitor size={18} /> },
  ];

  return (
    <div className="page-container space-y-10 pb-32">
       {/* Header */}
       <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
         <h1 className="text-fluid-h1 text-4xl mb-4">Settings</h1>
         
         {/* Profile Card */}
         <div 
            onClick={() => setEditName(true)}
            className="glass-card !p-5 flex items-center gap-4 cursor-pointer hover:bg-white/40 transition-colors"
         >
            <div className="w-16 h-16 rounded-full bg-[#1b4332] text-white flex items-center justify-center text-xl font-bold shadow-lg">
               {profile?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1">
               <h3 className="text-lg font-bold text-[#1B4332] dark:text-white">{profile?.name}</h3>
               <p className="text-sm text-gray-500">{profile?.city}, {profile?.country}</p>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
         </div>
      </motion.div>

      {/* Settings Sections */}
      <div className="space-y-8">
        {/* Appearance */}
        <section>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 mb-3">Appearance</h3>
          <div className="glass-panel p-2 flex gap-1">
            {themeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => updateSettings({ theme: opt.value })}
                className={`flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-xl transition-all ${
                  settings.theme === opt.value
                    ? 'bg-white shadow-lg text-[#1b4332]'
                    : 'text-gray-500 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {opt.icon}
                <span className="text-xs font-bold">{opt.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Notifications */}
        <section>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 mb-3">Notifications</h3>
          <div className="glass-panel overflow-hidden">
            {[
              { key: 'suhoor' as const, label: 'Suhoor Reminder' },
              { key: 'fajr' as const, label: 'Fajr Prayer' },
              { key: 'iftarWarning' as const, label: 'Iftar Reminder' },
              { key: 'checklistReminder' as const, label: 'Daily Checklist' },
            ].map((item, i, arr) => (
              <div 
                key={item.key} 
                className={`flex items-center justify-between p-4 ${i !== arr.length - 1 ? 'border-b border-black/5 dark:border-white/5' : ''}`}
              >
                <div className="flex items-center gap-3">
                  {settings.notifications[item.key] ? (
                    <Bell size={20} className="text-[#52B788]" />
                  ) : (
                    <BellOff size={20} className="text-gray-400" />
                  )}
                  <span className="font-medium text-[#1B4332] dark:text-white">{item.label}</span>
                </div>
                <button
                  onClick={() => updateNotification(item.key, !settings.notifications[item.key])}
                  className={`w-12 h-7 rounded-full transition-all relative ${
                    settings.notifications[item.key] ? 'bg-[#52B788]' : 'bg-gray-200 dark:bg-white/10'
                  }`}
                >
                  <motion.div
                    className="w-5 h-5 bg-white rounded-full absolute top-1 shadow-sm"
                    animate={{ left: settings.notifications[item.key] ? '26px' : '4px' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Data Actions */}
        <section>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 mb-3">Data & Privacy</h3>
          <div className="space-y-3">
             <button
               onClick={() => navigate('/summary')}
               className="w-full glass-card !p-4 flex items-center justify-between group hover:bg-white/50 transition-colors"
             >
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-[#52B788]/20 rounded-lg text-[#52B788]"><BarChart3 size={20} /></div>
                   <span className="font-bold text-[#1B4332] dark:text-white">View Summary</span>
                </div>
                <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
             </button>

             <button
               onClick={handleExport}
               className="w-full glass-card !p-4 flex items-center justify-between group hover:bg-white/50 transition-colors"
             >
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-[#D4A017]/20 rounded-lg text-[#D4A017]"><Download size={20} /></div>
                   <span className="font-bold text-[#1B4332] dark:text-white">Export Data</span>
                </div>
                <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        </section>

        <button
          onClick={() => setShowReset(true)}
          className="w-full py-4 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-colors flex items-center justify-center gap-2"
        >
          <LogOut size={18} /> Reset All Data & Sign Out
        </button>
      </div>

      {/* Edit Name Modal */}
      <Modal isOpen={editName} onClose={() => setEditName(false)} title="Edit Name">
        <div className="space-y-6">
          <input
            type="text"
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-lg focus:outline-none focus:border-[#52B788]"
            autoFocus
          />
          <button
            onClick={handleNameSave}
            className="w-full py-4 rounded-2xl bg-[#52B788] text-white font-bold shadow-lg"
          >
            Save Changes
          </button>
        </div>
      </Modal>

      {/* Reset Confirm Modal */}
      <Modal isOpen={showReset} onClose={() => setShowReset(false)} title="Reset Data">
        <div className="space-y-6">
          <div className="flex justify-center mb-4">
             <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
               <Trash2 size={32} className="text-red-500" />
             </div>
          </div>
          <p className="text-center text-gray-500 leading-relaxed">
            Are you sure? This will delete all your progress locally.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowReset(false)}
              className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-600 font-bold"
            >
              Cancel
            </button>
            <button onClick={handleReset} className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-bold shadow-lg shadow-red-500/30">
              Reset Everything
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
