import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  padding = 'md'
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div
      className={`
        bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 
        rounded-xl shadow-2xl shadow-slate-900/20 
        ${paddingClasses[padding]} ${className}
      `}
    >
      {children}
    </div>
  );
};