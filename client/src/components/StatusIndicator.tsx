import React from 'react';

interface StatusIndicatorProps {
  isActive: boolean;
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  isActive,
  label,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div
          className={`${sizeClasses[size]} rounded-full ${
            isActive ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        {isActive && (
          <div
            className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-green-500 animate-ping opacity-75`}
          />
        )}
      </div>
      <span
        className={`font-medium ${
          isActive ? 'text-green-400' : 'text-red-400'
        }`}
      >
        {label}
      </span>
    </div>
  );
};