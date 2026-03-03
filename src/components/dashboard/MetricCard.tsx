import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  change?: number;
  icon?: any;
  trend?: 'up' | 'down' | 'neutral';
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, trend }) => {
  const isPositive = trend === 'up';
  const isNegative = trend === 'down';

  return (
    <div style={{ background: '#111111', border: '1px solid #1A1A1A', borderTop: '1px solid #C9A84C', paddingTop: '16px', padding: '16px' }}>
      <p style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#555555', marginBottom: '8px' }}>
        {title}
      </p>
      <h3 style={{ fontSize: '2.25rem', fontWeight: 300, color: '#F5F5F5', fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>
        {value}
      </h3>
      {change !== undefined && (
        <div className="mt-2 flex items-center" style={{ fontSize: '12px' }}>
          <span className={cn(
            "flex items-center",
            isPositive ? "text-green-500" : isNegative ? "text-red-500" : "text-[#555555]"
          )}>
            {isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
            {Math.abs(change)}%
          </span>
          <span className="ml-2" style={{ color: '#444444' }}>vs last period</span>
        </div>
      )}
    </div>
  );
};
