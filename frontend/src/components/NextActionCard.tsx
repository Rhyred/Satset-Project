import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Clock, Info, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface NextActionProps {
  type: 'info' | 'action' | 'warning' | 'success';
  title: string;
  message: string;
  actionText?: string;
  actionLink?: string;
  onActionClick?: () => void;
}

export const NextActionCard: React.FC<NextActionProps> = ({
  type, title, message, actionText, actionLink, onActionClick
}) => {
  const getConfig = () => {
    switch(type) {
      case 'action': return { icon: AlertCircle, color: 'var(--primary)', bg: 'var(--primary-subtle)', border: 'var(--primary)' };
      case 'warning': return { icon: Clock, color: 'var(--warning)', bg: 'var(--warning-subtle)', border: 'var(--warning)' };
      case 'success': return { icon: CheckCircle, color: 'var(--success)', bg: 'var(--success-subtle)', border: 'var(--success)' };
      default: return { icon: Info, color: 'var(--info)', bg: 'var(--info-subtle)', border: 'var(--info)' };
    }
  };
  const config = getConfig();
  const Icon = config.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="card flex flex-col md:flex-row gap-4 items-start"
      style={{ 
        borderLeft: `4px solid ${config.border}`,
        background: 'var(--surface-0)'
      }}
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: config.bg, color: config.color }}>
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color: config.color }}>{title}</h4>
        <p className="text-secondary text-sm leading-relaxed mb-3">{message}</p>
        
        {actionText && (
          actionLink ? (
            <Link to={actionLink} className="btn btn-sm btn-outline shadow-sm font-semibold" style={{ borderColor: config.border, color: config.color }}>
              {actionText} <ArrowRight size={14} />
            </Link>
          ) : (
            <button onClick={onActionClick} className="btn btn-sm btn-outline shadow-sm font-semibold" style={{ borderColor: config.border, color: config.color }}>
              {actionText} <ArrowRight size={14} />
            </button>
          )
        )}
      </div>
    </motion.div>
  );
};
