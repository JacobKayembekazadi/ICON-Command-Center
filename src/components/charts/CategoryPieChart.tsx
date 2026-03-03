import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card } from '@/components/ui/Card';

interface CategoryPieChartProps {
  data: any[];
}

const COLORS = ['#C9A84C', '#8B7435', '#5A4E2A', '#2A2A2A', '#3A3A3A'];

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data }) => {
  return (
    <Card title="Sales by Category" className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ background: '#111111', border: '1px solid #C9A84C', color: '#F5F5F5', borderRadius: 0 }}
            itemStyle={{ color: '#F5F5F5' }}
          />
          <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: '#555555', fontSize: '11px' }} />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};
