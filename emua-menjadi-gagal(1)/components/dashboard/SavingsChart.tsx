import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// Fix: Add .ts extension to the import path
import { ChartData } from '../../types.ts';
// Fix: Add .ts extension to the import path
import { formatToRupiah } from '../../utils/formatter.ts';

interface SavingsChartProps {
  data: ChartData[];
  title: string;
  theme: 'light' | 'dark';
}

const SavingsChart: React.FC<SavingsChartProps> = ({ data, title, theme }) => {
  const axisColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const gridColor = theme === 'dark' ? '#334155' : '#e0e0e0';

  return (
    <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-4 md:p-6 h-[300px] md:h-[450px]">
      <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: 50,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12, fill: axisColor }} 
            tickFormatter={(tick) => new Date(tick).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: axisColor }}
            tickFormatter={(tick) => {
                if (tick >= 1000000) return `${(tick / 1000000).toFixed(1)}Jt`;
                if (tick >= 1000) return `${(tick / 1000).toFixed(0)}Rb`;
                return tick;
            }}
          />
          <Tooltip 
            contentStyle={{
                backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            }}
            itemStyle={{ color: theme === 'dark' ? '#f1f5f9' : '#1e293b' }}
            labelStyle={{ color: theme === 'dark' ? '#94a3b8' : '#64748b' }}
            formatter={(value: number) => [formatToRupiah(value), 'Saldo']}
          />
          <Area type="monotone" dataKey="value" stroke="#F59E0B" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SavingsChart;