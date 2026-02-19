import { Variants } from 'framer-motion';

// Standard transition physics
export const transition = {
  type: 'spring',
  stiffness: 200,
  damping: 20,
} as const;

// Gentler transition for layout changes
export const layoutTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
} as const;

// Page transitions
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ...transition,
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.2,
    },
  },
};

// Container that staggers its children
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Simple fade in up for items
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  hidden: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition 
  },
  show: { 
    opacity: 1, 
    y: 0,
    transition
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: 0.2 } 
  },
};

// Scale in for cards/modals
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  hidden: { opacity: 0, scale: 0.9 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition 
  },
  show: { 
    opacity: 1, 
    scale: 1,
    transition 
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: { duration: 0.2 } 
  },
};

// List item animations (for Reorder or massive lists)
export const listItemVariants: Variants = {
  initial: { opacity: 0, height: 0, marginBottom: 0 },
  animate: { 
    opacity: 1, 
    height: 'auto', 
    marginBottom: 12, // matches space-y-3 roughly (12px)
    transition: layoutTransition 
  },
  exit: { 
    opacity: 0, 
    height: 0, 
    marginBottom: 0,
    transition: { duration: 0.2 } 
  },
};
