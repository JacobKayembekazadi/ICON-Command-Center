import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card } from '@/components/ui/Card';

interface CategoryPieChartProps {
  data: any[];
}

const COLORS = ['#00D9FF', '#3B82F6', '#8B5CF6', '#EC4899', '#10B981'];

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
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#1a1f3a', borderColor: '#2d3548', color: '#fff' }}
            itemStyle={{ color: '#fff' }}
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};
