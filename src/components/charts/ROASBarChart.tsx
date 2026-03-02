import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card } from '@/components/ui/Card';

interface ROASBarChartProps {
  data: any[];
}

export const ROASBarChart: React.FC<ROASBarChartProps> = ({ data }) => {
  return (
    <Card title="ROAS by Platform" className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d3548" vertical={false} />
          <XAxis 
            dataKey="platform" 
            stroke="#6b7280" 
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#6b7280" 
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            cursor={{ fill: '#2d3548', opacity: 0.4 }}
            contentStyle={{ backgroundColor: '#1a1f3a', borderColor: '#2d3548', color: '#fff' }}
          />
          <Bar dataKey="roas" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.roas > 4 ? '#10B981' : entry.roas > 2.5 ? '#F59E0B' : '#EF4444'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
