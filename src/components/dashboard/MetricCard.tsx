import React from 'react';
import { Card } from '@/components/ui/Card';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  change?: number;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon: Icon, trend }) => {
  const isPositive = trend === 'up';
  const isNegative = trend === 'down';

  return (
    <Card className="relative overflow-hidden">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold mt-2 text-white">{value}</h3>
        </div>
        <div className="p-2 bg-[#2d3548] rounded-lg">
          <Icon className="w-5 h-5 text-[#00D9FF]" />
        </div>
      </div>
      
      {change !== undefined && (
        <div className="mt-4 flex items-center text-sm">
          <span className={cn(
            "flex items-center font-medium",
            isPositive ? "text-green-500" : isNegative ? "text-red-500" : "text-gray-400"
          )}>
            {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
            {Math.abs(change)}%
          </span>
          <span className="ml-2 text-gray-500">vs last period</span>
        </div>
      )}
    </Card>
  );
};
