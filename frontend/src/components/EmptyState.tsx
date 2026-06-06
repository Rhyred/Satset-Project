import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  message: string;
  actionText?: string;
  actionLink?: string;
  onActionClick?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  message,
  actionText,
  actionLink,
  onActionClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto fade-in">
      {/* Subtle Illustration Background */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary opacity-10 rounded-full blur-xl transform scale-150"></div>
        <div className="relative w-20 h-20 rounded-full bg-surface-1 flex items-center justify-center border-4 border-surface-0 shadow-sm z-10 text-primary">
          <Icon size={36} strokeWidth={1.5} />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-primary-color mb-2">{title}</h3>
      <p className="text-secondary text-base mb-8 leading-relaxed">
        {message}
      </p>
      
      {actionText && (
        actionLink ? (
          <Link to={actionLink} className="btn btn-primary px-6 shadow-md hover:-translate-y-0.5 transition-transform">
            {actionText}
          </Link>
        ) : (
          <button onClick={onActionClick} className="btn btn-primary px-6 shadow-md hover:-translate-y-0.5 transition-transform">
            {actionText}
          </button>
        )
      )}
    </div>
  );
};
