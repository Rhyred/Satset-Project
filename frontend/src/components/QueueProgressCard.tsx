import React from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, Monitor } from 'lucide-react';

export interface QueueProgressProps {
  myNumber: string;
  currentNumber: string;
  totalWaiting: number;
  remainingPeople: number;
  counterName: string;
  estimatedWaitMinutes: number;
  progressPercentage: number;
}

export const QueueProgressCard: React.FC<QueueProgressProps> = ({
  myNumber, currentNumber, totalWaiting, remainingPeople, counterName, estimatedWaitMinutes, progressPercentage
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="card flex flex-col p-6"
    >
      <div className="flex flex-col md:flex-row gap-6 mb-8 items-center justify-between">
        <div className="text-center md:text-left flex-1">
          <p className="text-xs font-bold text-tertiary uppercase tracking-wider mb-2">Nomor Anda</p>
          <div className="text-5xl font-black text-primary-color tabular-nums tracking-tighter" style={{ letterSpacing: '-0.05em' }}>
            {myNumber}
          </div>
        </div>
        
        <div className="hidden md:flex flex-col items-center justify-center text-tertiary">
          <div className="w-px h-12 bg-border mb-2" style={{ background: 'var(--border)' }}></div>
          <span className="text-[10px] uppercase font-bold tracking-widest">VS</span>
          <div className="w-px h-12 bg-border mt-2" style={{ background: 'var(--border)' }}></div>
        </div>

        <div className="text-center md:text-right flex-1">
          <p className="text-xs font-bold text-tertiary uppercase tracking-wider mb-2">Saat Ini Dilayani</p>
          <div className="text-4xl font-bold text-secondary tabular-nums">
            {currentNumber}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <span className="text-xs font-bold text-tertiary uppercase">Progres Antrean</span>
          <span className="text-sm font-bold text-primary tabular-nums">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden bg-surface-2">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-primary"
          ></motion.div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 bg-surface-1 rounded-lg p-1 border" style={{ borderColor: 'var(--border)' }}>
        <div className="flex flex-col items-center justify-center p-3 text-center">
          <Clock size={16} className="text-tertiary mb-2" />
          <p className="text-[10px] font-bold text-tertiary uppercase tracking-wider mb-1">Estimasi</p>
          <p className="text-sm font-bold text-primary-color tabular-nums">{estimatedWaitMinutes} Menit</p>
        </div>
        <div className="flex flex-col items-center justify-center p-3 text-center border-l border-r" style={{ borderColor: 'var(--border)' }}>
          <Users size={16} className="text-tertiary mb-2" />
          <p className="text-[10px] font-bold text-tertiary uppercase tracking-wider mb-1">Sisa</p>
          <p className="text-sm font-bold text-primary-color tabular-nums">{remainingPeople} Orang</p>
        </div>
        <div className="flex flex-col items-center justify-center p-3 text-center">
          <Monitor size={16} className="text-tertiary mb-2" />
          <p className="text-[10px] font-bold text-tertiary uppercase tracking-wider mb-1">Loket</p>
          <p className="text-sm font-bold text-primary-color">{counterName}</p>
        </div>
      </div>
    </motion.div>
  );
};
