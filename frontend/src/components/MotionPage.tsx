import React from 'react';
import { motion } from 'framer-motion';

interface MotionPageProps {
  children: React.ReactNode;
}

export const MotionPage: React.FC<MotionPageProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ 
        duration: 0.25, 
        ease: [0.16, 1, 0.3, 1] // Apple/Vercel cubic-bezier
      }}
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </motion.div>
  );
};
