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
          <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
          <XAxis 
            dataKey="platform" 
            stroke="#444444"
            tick={{ fontSize: 11, fill: '#444444' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#444444"
            tick={{ fontSize: 11, fill: '#444444' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            cursor={{ fill: '#1A1A1A' }}
            contentStyle={{ background: '#111111', border: '1px solid #C9A84C', color: '#F5F5F5', borderRadius: 0 }}
          />
          <Bar dataKey="roas" radius={[0, 0, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.roas > 4 ? '#C9A84C' : entry.roas > 2.5 ? '#8B7435' : '#333333'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
