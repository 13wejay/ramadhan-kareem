import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAuthStore } from './store/useAuthStore';
import { useSettingsStore } from './store/useSettingsStore';
import BottomNav from './components/BottomNav';
import InstallBanner from './components/InstallBanner';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Checklist from './pages/Checklist';
import Goals from './pages/Goals';
import PrayerSchedule from './pages/PrayerSchedule';
import DailyInsight from './pages/DailyInsight';
import Zikr from './pages/Zikr';
import Settings from './pages/Settings';
import Summary from './pages/Summary';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isOnboarded = useAuthStore((s) => s.isOnboarded());
  if (!isOnboarded) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

export default function App() {
  const isOnboarded = useAuthStore((s) => s.isOnboarded());
  const theme = useSettingsStore((s) => s.settings.theme);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  const showNav = isOnboarded;

  return (
    <div className="min-h-dvh relative overflow-hidden">
      {/* Global Animated Background */}
      <div className="liquid-bg">
        <div className="liquid-blob blob-1" />
        <div className="liquid-blob blob-2" />
        <div className="liquid-blob blob-3" />
      </div>

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/checklist" element={<ProtectedRoute><Checklist /></ProtectedRoute>} />
          <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
          <Route path="/prayer" element={<ProtectedRoute><PrayerSchedule /></ProtectedRoute>} />
          <Route path="/insight" element={<ProtectedRoute><DailyInsight /></ProtectedRoute>} />
          <Route path="/zikr" element={<ProtectedRoute><Zikr /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/summary" element={<ProtectedRoute><Summary /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to={isOnboarded ? '/home' : '/onboarding'} replace />} />
        </Routes>
      </AnimatePresence>
      {showNav && <BottomNav />}
      {showNav && <InstallBanner />}
    </div>
  );
}
