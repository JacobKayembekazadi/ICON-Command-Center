import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  title, 
  action,
  ...props 
}) => {
  return (
    <div 
      className={cn(
        "bg-[#1a1f3a] border border-[#2d3548] rounded-xl shadow-sm overflow-hidden",
        className
      )} 
      {...props}
    >
      {(title || action) && (
        <div className="px-6 py-4 border-b border-[#2d3548] flex justify-between items-center">
          {title && <h3 className="font-semibold text-lg text-white">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};
