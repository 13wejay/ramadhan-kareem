import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore, UserProfile } from '../store/useAuthStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { getCurrentLocation } from '../services/locationService';
import { requestNotificationPermission } from '../services/notificationService';
import { ChevronRight, ArrowRight, MapPin, Bell } from 'lucide-react';

const CALCULATION_METHODS = [
  { id: 1, name: 'Univ. of Islamic Sciences, Karachi' },
  { id: 2, name: 'Islamic Society of North America (ISNA)' },
  { id: 3, name: 'Muslim World League' },
  { id: 4, name: 'Umm Al-Qura University, Makkah' },
  { id: 5, name: 'Egyptian General Authority of Survey' },
  { id: 20, name: 'Kementerian Agama RI (Indonesia)' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const setProfile = useAuthStore((s) => s.setProfile);
  const updateSettings = useSettingsStore((s) => s.updateSettings);

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [method, setMethod] = useState(3);
  const [madhab, setMadhab] = useState<'hanafi' | 'shafii'>('shafii');
  const [ramadhanStart, setRamadhanStart] = useState('2026-02-18'); // Default to today/soon
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState('');

  const handleLocation = async () => {
    setLocLoading(true);
    setLocError('');
    try {
      const loc = await getCurrentLocation();
      setLat(loc.latitude);
      setLng(loc.longitude);
      setStep(4);
    } catch {
      setLocError('Could not get location. Please enter manually.');
    }
    setLocLoading(false);
  };

  const handleFinish = () => {
    const profile: UserProfile = {
      id: crypto.randomUUID(),
      name,
      city,
      country,
      latitude: lat,
      longitude: lng,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      calculationMethod: method,
      madhab,
      ramadhanStartDate: ramadhanStart,
      createdAt: new Date().toISOString(),
    };
    setProfile(profile);
    updateSettings({});
    navigate('/home');
  };

  const nextStep = () => setStep((s) => s + 1);

  const slideVariants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
  };

  return (
    <div className="min-h-dvh flex flex-col page-container !pt- safe-area-top">
      {/* Progress bar */}
      <div className="w-full max-w-sm mx-auto mb-8 flex gap-2 justify-center pt-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i <= step ? 'w-6 bg-[#52B788]' : 'w-1.5 bg-black/10 dark:bg-white/10'
            }`}
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full"
          >
            {/* Step 0: Splash */}
            {step === 0 && (
              <div className="text-center space-y-8 py-10">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="text-8xl relative z-10 drop-shadow-2xl"
                >
                  🌙
                </motion.div>
                
                <div className="glass-card !bg-white/40 !border-white/50 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="arabic-text text-xl text-[#d4a017] mb-4"
                    >
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </motion.p>
                    <motion.h1
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="text-3xl font-bold text-[#1B4332] dark:text-white mb-2"
                    >
                      Ramadhan<br/>Companion
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="text-sm text-gray-500 dark:text-gray-300 uppercase tracking-widest"
                    >
                      Your spiritual journey begins here
                    </motion.p>
                </div>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextStep}
                  className="w-full py-4 rounded-2xl bg-[#1b4332] text-white font-bold text-lg shadow-xl shadow-[#1b4332]/30 flex items-center justify-center gap-2 group"
                >
                  Begin <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            )}

            {/* Step 1: Welcome */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                   <h2 className="text-3xl font-bold text-[#1B4332] dark:text-white mb-2">Welcome</h2>
                   <p className="text-gray-500">Make the most of this blessed month</p>
                </div>
                
                <div className="grid gap-4">
                  {[
                    { icon: '✓', title: 'Track Ibadah', desc: 'Daily checklist & habits' },
                    { icon: '🕌', title: 'Prayer Times', desc: 'Accurate global schedule' },
                    { icon: '🌱', title: 'Set Goals', desc: 'Quran, Fasting & more' },
                  ].map((f, i) => (
                    <motion.div 
                      key={f.title} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-card flex items-center gap-4 !p-4"
                    >
                      <span className="text-2xl w-10 h-10 flex items-center justify-center bg-[#52B788]/20 rounded-full">{f.icon}</span>
                      <div className="text-left">
                        <p className="font-bold text-[#1B4332] dark:text-white">{f.title}</p>
                        <p className="text-xs text-gray-500">{f.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <button onClick={nextStep} className="w-full mt-8 py-4 rounded-2xl bg-[#52B788] text-white font-bold shadow-lg shadow-[#52B788]/30">
                  Continue
                </button>
              </div>
            )}

            {/* Step 2: Name */}
            {step === 2 && (
              <div className="space-y-6 text-center">
                <h2 className="text-2xl font-bold text-[#1B4332] dark:text-white">What shall we call you?</h2>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-6 py-5 rounded-2xl bg-white/50 dark:bg-black/20 backdrop-blur-md border border-white/40 text-center text-xl font-medium focus:ring-2 focus:ring-[#52B788] focus:outline-none placeholder:text-gray-400 text-[#1B4332] dark:text-white"
                  autoFocus
                />
                <button
                  onClick={nextStep}
                  disabled={!name.trim()}
                  className="w-full py-4 rounded-2xl bg-[#1b4332] text-white font-bold shadow-lg disabled:opacity-50 disabled:shadow-none"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 3: Location */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                   <h2 className="text-2xl font-bold text-[#1B4332] dark:text-white mb-2">Your Location</h2>
                   <p className="text-sm text-gray-500">Required for accurate prayer times</p>
                </div>
                
                <button
                  onClick={handleLocation}
                  disabled={locLoading}
                  className="w-full py-4 rounded-2xl bg-[#52B788] text-white font-bold shadow-lg shadow-[#52B788]/30 flex items-center justify-center gap-2"
                >
                  {locLoading ? <span className="animate-pulse">Locating...</span> : <><MapPin size={20} /> Use Current Location</>}
                </button>
                
                {locError && <p className="text-red-500 text-xs text-center bg-red-50 p-2 rounded-lg">{locError}</p>}
                
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300/30"></div></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-white/50 px-2 text-gray-400">Or enter manually</span></div>
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full px-5 py-4 rounded-2xl bg-white/50 dark:bg-black/20 border-none focus:ring-2 focus:ring-[#52B788] text-[#1B4332] dark:text-white"
                  />
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Country"
                    className="w-full px-5 py-4 rounded-2xl bg-white/50 dark:bg-black/20 border-none focus:ring-2 focus:ring-[#52B788] text-[#1B4332] dark:text-white"
                  />
                </div>
                <button
                  onClick={() => setStep(4)}
                  disabled={(!city.trim() || !country.trim()) && lat === 0}
                  className="w-full py-4 rounded-2xl bg-[#1b4332] text-white font-bold shadow-lg disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 4: Method */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="text-center mb-2">
                   <h2 className="text-2xl font-bold text-[#1B4332] dark:text-white">Calculation Method</h2>
                </div>
                
                <div className="glass-panel max-h-64 overflow-y-auto custom-scrollbar p-2 space-y-1">
                  {CALCULATION_METHODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center justify-between group ${
                        method === m.id
                          ? 'bg-[#1b4332] text-white shadow-md'
                          : 'hover:bg-black/5 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {m.name}
                      {method === m.id && <ChevronRight size={16} />}
                    </button>
                  ))}
                </div>

                <div className="glass-panel p-1 flex mt-4">
                  <button
                    onClick={() => setMadhab('shafii')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${madhab === 'shafii' ? 'bg-white shadow text-[#1B4332]' : 'text-gray-400'}`}
                  >
                    Shafi'i / Maliki / Hanbali
                  </button>
                  <button
                    onClick={() => setMadhab('hanafi')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${madhab === 'hanafi' ? 'bg-white shadow text-[#1B4332]' : 'text-gray-400'}`}
                  >
                    Hanafi
                  </button>
                </div>
                
                <button onClick={nextStep} className="w-full mt-4 py-4 rounded-2xl bg-[#52B788] text-white font-bold shadow-lg shadow-[#52B788]/30">
                  Confirm Settings
                </button>
              </div>
            )}

            {/* Step 5: Ramadhan Start */}
            {step === 5 && (
              <div className="space-y-6 text-center">
                <h2 className="text-2xl font-bold text-[#1B4332] dark:text-white">Start Date 🌙</h2>
                <p className="text-sm text-gray-500">When does Ramadhan start for you?</p>
                
                <div className="glass-card flex items-center justify-center p-4">
                   <input
                    type="date"
                    value={ramadhanStart}
                    onChange={(e) => setRamadhanStart(e.target.value)}
                    className="bg-transparent text-2xl font-bold text-[#1B4332] dark:text-white outline-none text-center w-full"
                  />
                </div>

                <button onClick={nextStep} className="w-full py-4 rounded-2xl bg-[#1b4332] text-white font-bold shadow-lg">
                  Next Step
                </button>
              </div>
            )}

            {/* Step 6: Notifications */}
            {step === 6 && (
              <div className="space-y-6 text-center">
                 <div className="w-20 h-20 mx-auto rounded-full bg-[#52B788]/10 flex items-center justify-center mb-4">
                    <Bell size={40} className="text-[#52B788]" />
                 </div>
                <h2 className="text-2xl font-bold text-[#1B4332] dark:text-white">Stay Connected</h2>
                <p className="text-sm text-gray-500">Get reminders for prayers, suhoor, and daily deeds.</p>
                
                <button
                  onClick={async () => {
                    await requestNotificationPermission();
                    nextStep();
                  }}
                  className="w-full py-4 rounded-2xl bg-[#52B788] text-white font-bold shadow-lg shadow-[#52B788]/30"
                >
                  Enable Notifications
                </button>
                <button
                  onClick={nextStep}
                  className="text-sm text-gray-400 hover:text-gray-600 font-medium"
                >
                  Maybe Later
                </button>
              </div>
            )}

            {/* Step 7: Done */}
            {step === 7 && (
              <div className="text-center space-y-8 py-10">
                <div className="glass-card !bg-white/60 p-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#d4a017]"></div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-6xl mb-4"
                    >
                      ✨
                    </motion.div>
                    <h2 className="text-2xl font-bold text-[#1B4332] dark:text-white mb-2">
                      Ramadhan Mubarak,<br/>{name}!
                    </h2>
                    <p className="text-sm text-gray-500">
                      May this blessed month bring you peace and barakah.
                    </p>
                </div>
                
                <button
                  onClick={handleFinish}
                  className="w-full py-4 rounded-2xl bg-[#1b4332] text-white font-bold text-lg shadow-xl shadow-[#1b4332]/30 hover:bg-[#2d6a4f] transition-colors"
                >
                  Start My Journey 🌙
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
