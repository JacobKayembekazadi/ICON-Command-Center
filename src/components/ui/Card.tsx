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
      className={cn("overflow-hidden", className)}
      style={{ background: '#111111', border: '1px solid #1A1A1A' }}
      {...props}
    >
      {(title || action) && (
        <div className="px-6 pt-6 pb-0 flex justify-between items-center mb-6">
          {title && (
            <h3
              style={{
                fontSize: '11px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#555555',
                borderLeft: '1px solid #C9A84C',
                paddingLeft: '12px',
              }}
            >
              {title}
            </h3>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6 pt-0">
        {children}
      </div>
    </div>
  );
};
