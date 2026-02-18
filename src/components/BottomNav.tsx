import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Check, Target, Clock, Lightbulb, Settings } from 'lucide-react';

const navItems = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/checklist', icon: Check, label: 'Checklist' },
  { path: '/goals', icon: Target, label: 'Goals' },
  { path: '/prayer', icon: Clock, label: 'Prayer' },
  { path: '/insight', icon: Lightbulb, label: 'Insight' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function BottomNav() {
  return (
    <nav className="fixed z-50 bottom-8 left-1/2 -translate-x-1/2">
      <div className="flex items-center gap-1 p-2 rounded-full glass-panel !border-opacity-40 !bg-opacity-80 shadow-2xl">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="relative p-3 rounded-full transition-all duration-300 hover:bg-white/10 dark:hover:bg-white/5 group"
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-[#1b4332] dark:bg-white rounded-full z-0"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                
                <div className="relative z-10 flex items-center justify-center">
                  <item.icon
                    size={24}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={`transition-colors duration-300 ${
                      isActive 
                        ? 'text-white dark:text-[#050505]' 
                        : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200'
                    }`}
                  />
                </div>

                {/* Tooltip on hover (desktop) */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden md:block">
                  {item.label}
                </div>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
