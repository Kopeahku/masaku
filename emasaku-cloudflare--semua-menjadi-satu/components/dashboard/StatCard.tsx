import React from 'react';
// Fix: Add .ts extension to the import path
import { StatCardData } from '../../types.ts';

interface StatCardProps {
  data: StatCardData;
}

const StatCard: React.FC<StatCardProps> = ({ data }) => {
  const { title, value } = data;
  const Icon = (data.icon as any).default || data.icon;

  return (
    <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-4 md:p-6 flex items-center space-x-4 transition hover:shadow-lg hover:-translate-y-1">
      <div className="bg-amber-100 dark:bg-amber-900/50 p-3 rounded-full">
        <Icon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
      </div>
      <div>
        <p className="text-sm text-text-secondary dark:text-dark-text-secondary font-medium">{title}</p>
        <p className="text-xl md:text-2xl font-bold text-text-primary dark:text-dark-text-primary">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
