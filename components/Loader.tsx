import React from 'react';
import { motion } from 'motion/react';
import { AgriLensLogoIcon } from './Icons';

interface LoaderProps {
  title?: string;
  subtitle?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  title = "Analyzing Crop...",
  subtitle = "Consulting AgriLens AI Intelligence"
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <div className="relative">
        {/* Outer rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 rounded-full border-4 border-emerald-100 dark:border-emerald-900/30 border-t-emerald-600 dark:border-t-emerald-500"
        />
        
        {/* Inner pulsing logo */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <AgriLensLogoIcon className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
        </motion.div>

        {/* Scanning line */}
        <motion.div
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] z-10"
        />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 text-center"
      >
        <h3 className="text-xl font-black text-olive-900 dark:text-gray-100 tracking-tight">{title}</h3>
        <p className="text-olive-600 dark:text-gray-400 font-medium mt-2">{subtitle}</p>
      </motion.div>
    </div>
  );
};
