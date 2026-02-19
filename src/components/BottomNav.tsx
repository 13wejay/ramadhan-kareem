import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Check, Target, Clock, Lightbulb, Settings } from 'lucide-react';
import { transition } from '../utils/animations';

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
    <>
      <svg width="0" height="0" className="absolute block">
        <defs>
          <filter id="gooey-nav">
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
          </filter>
        </defs>
      </svg>
      
      <nav className="fixed z-50 bottom-8 left-1/2 -translate-x-1/2 w-max">
        {/* The glass container needs to be separate or outside the filter if we don't want the container itself to be gooey, 
            but for the pill to be gooey with the items, they need to be together. 
            However, usually gooey effect is applied to a wrapper of the moving parts. 
            Here we will apply a subtle different approach: 
            The pill and the icons will be inside a container that has the filter, 
            BUT strict gooey requires backgrounds to merge. 
            Let's try a cleaner approach first: "Jelly" physics on the pill and "Elastic" scaling on icons.
            The SVG filter above is kept for potential advanced use, but let's try pure Framer Motion physics first as it's cleaner for this UI.
            
            Actually, let's use the layoutId transition for the "Liquid" feel.
        */}
        <div className="flex items-center gap-1 p-2 rounded-full glass-panel !border-opacity-40 !bg-opacity-80 shadow-2xl backdrop-blur-xl">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative p-3 rounded-full transition-colors duration-300 hover:bg-white/10 dark:hover:bg-white/5 group"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-[#1b4332] dark:bg-white rounded-full z-0"
                      transition={transition}
                      style={{ borderRadius: 9999 }}
                    />
                  )}
                  
                  <div className="relative z-10 flex items-center justify-center">
                    <motion.div
                        animate={isActive ? { scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] } : { scale: 1, rotate: 0 }}
                        transition={{ 
                            duration: 0.4, 
                            type: 'spring' as const, 
                            stiffness: 400, 
                            damping: 17 
                        }}
                    >
                        <item.icon
                        size={24}
                        strokeWidth={isActive ? 2.5 : 2}
                        className={`transition-colors duration-300 ${
                            isActive 
                            ? 'text-white dark:text-[#050505]' 
                            : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200'
                        }`}
                        />
                    </motion.div>
                  </div>

                  {/* Tooltip on hover (desktop) */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    whileHover={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden md:block"
                  >
                    {item.label}
                  </motion.div>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
