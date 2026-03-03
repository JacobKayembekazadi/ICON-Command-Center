import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface RevenueChartProps {
  data: any[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  return (
    <div style={{ background: '#111111', border: '1px solid #1A1A1A', padding: '20px 24px' }}>
      <p style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#555555', borderLeft: '1px solid #C9A84C', paddingLeft: '12px', marginBottom: '20px' }}>Revenue Trend (90 Days)</p>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#C9A84C" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#444444"
            tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            tick={{ fontSize: 11, fill: '#444444' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#444444"
            tickFormatter={(value) => `$${value}`}
            tick={{ fontSize: 11, fill: '#444444' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ background: '#111111', border: '1px solid #C9A84C', color: '#F5F5F5', borderRadius: 0 }}
            formatter={(value: number) => [formatCurrency(value), 'Revenue']}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
          />
          <Area 
            type="monotone" 
            dataKey="amount" 
            stroke="#C9A84C"
            strokeWidth={1.5}
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
