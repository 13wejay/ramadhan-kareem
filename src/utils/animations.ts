import { Variants } from 'framer-motion';

// Standard transition — fast, eased, no spring bounce
export const transition = {
  type: 'tween',
  ease: [0.25, 0.1, 0.25, 1],
  duration: 0.25,
} as const;

// Gentler transition for layout changes
export const layoutTransition = {
  type: 'tween',
  ease: [0.25, 0.1, 0.25, 1],
  duration: 0.2,
} as const;

// Page transitions
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      ...transition,
      staggerChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
    },
  },
};

// Container that staggers its children
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

// Simple fade in up for items
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 12 },
  hidden: { opacity: 0, y: 12 },
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
    transition: { duration: 0.15 } 
  },
};

// Scale in for cards/modals
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.96 },
  hidden: { opacity: 0, scale: 0.96 },
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
    scale: 0.96,
    transition: { duration: 0.15 } 
  },
};

// List item animations — transform-only (GPU composited, no reflow)
export const listItemVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: layoutTransition 
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.12 } 
  },
};
