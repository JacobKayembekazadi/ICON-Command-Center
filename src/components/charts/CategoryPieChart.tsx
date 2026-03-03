import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface CategoryPieChartProps {
  data: any[];
}

const COLORS = ['#C9A84C', '#8B7435', '#5A4E2A', '#3A3A3A', '#2A2A2A', '#4A4A4A'];

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div style={{ background: '#111111', border: '1px solid #1A1A1A', padding: '20px 24px' }}>
      <p style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#555555', borderLeft: '1px solid #C9A84C', paddingLeft: '12px', marginBottom: '20px' }}>
        Sales by Category
      </p>
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((_: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#111111', border: '1px solid #C9A84C', color: '#F5F5F5', borderRadius: 0 }}
              itemStyle={{ color: '#F5F5F5' }}
              formatter={(value: any, name: any) => [value + ' SKUs', name]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{ color: '#555555', fontSize: '11px', paddingTop: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
