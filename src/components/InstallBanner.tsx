import { useState, useEffect } from 'react';
import { lsGet, lsSet } from '../services/localStorage';
import { STORAGE_KEYS } from '../utils/storageKeys';
import { motion, AnimatePresence } from 'framer-motion';

export default function InstallBanner() {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const dismissed = lsGet<boolean>(STORAGE_KEYS.INSTALL_DISMISSED);
    if (dismissed) return;

    const visitCount = (lsGet<number>(STORAGE_KEYS.VISIT_COUNT) || 0) + 1;
    lsSet(STORAGE_KEYS.VISIT_COUNT, visitCount);

    if (visitCount < 2) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    setShow(false);
  };

  const handleDismiss = () => {
    lsSet(STORAGE_KEYS.INSTALL_DISMISSED, true);
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed bottom-20 inset-x-4 z-50 max-w-md mx-auto"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="rounded-2xl p-4 bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white shadow-xl">
            <div className="flex items-start gap-3">
              <span className="text-3xl">🌙</span>
              <div className="flex-1">
                <h3 className="font-bold text-sm">Install Ramadhan Companion</h3>
                <p className="text-xs text-white/70 mt-0.5">
                  Get quick access from your home screen. Works offline too!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handleInstall}
                className="flex-1 tap-target py-2 rounded-lg bg-[#D4A017] text-[#1B4332] text-xs font-bold hover:bg-[#F0C850] transition-colors"
              >
                Install App
              </button>
              <button
                onClick={handleDismiss}
                className="tap-target px-3 py-2 rounded-lg text-white/50 text-xs hover:text-white transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
