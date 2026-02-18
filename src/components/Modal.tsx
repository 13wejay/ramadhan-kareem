import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-[20%] max-w-sm mx-auto z-50 glass-card !p-0 overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/10">
              <h3 className="text-lg font-bold text-[#1B4332] dark:text-white">{title}</h3>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-white/10 hover:bg-gray-200 transition-colors"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>
            
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
