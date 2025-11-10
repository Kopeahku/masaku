import React from 'react';
// Fix: Add .ts extension to the import path
import { SavingsGoal } from '../../types.ts';
// Fix: Add .ts extension to the import path
import { formatToRupiah, formatDate } from '../../utils/formatter.ts';
// Fix: Add guard for heroicons
import { 
    FlagIcon as FlagIconSolid, 
    PencilIcon as PencilIconSolid, 
    TrophyIcon as TrophyIconSolid 
} from '@heroicons/react/24/solid';

// Fix: Add guard for heroicons
const FlagIcon = (FlagIconSolid as any).default || FlagIconSolid;
const PencilIcon = (PencilIconSolid as any).default || PencilIconSolid;
const TrophyIcon = (TrophyIconSolid as any).default || TrophyIconSolid;

interface SavingsGoalTrackerProps {
  goal: SavingsGoal | null;
  currentAmount: number;
  onSetGoal: () => void;
  isBalanceVisible: boolean;
}

const SavingsGoalTracker: React.FC<SavingsGoalTrackerProps> = ({ goal, currentAmount, onSetGoal, isBalanceVisible }) => {
  if (!goal) {
    return (
      <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6 text-center flex flex-col items-center justify-center h-full">
        <FlagIcon className="w-12 h-12 text-amber-500/50 mb-4" />
        <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary">Anda belum punya tujuan tabungan.</h3>
        <p className="text-text-secondary dark:text-dark-text-secondary mb-4">Menetapkan tujuan dapat meningkatkan motivasi menabung Anda!</p>
        <button
          onClick={onSetGoal}
          className="bg-gradient-to-r from-gold-light to-gold-dark hover:opacity-90 transition-opacity text-white font-bold py-2 px-4 rounded-lg"
        >
          Buat Tujuan Sekarang
        </button>
      </div>
    );
  }

  const progress = Math.min((currentAmount / goal.targetAmount) * 100, 100);
  const isCompleted = progress >= 100;

  return (
    <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6 relative h-full">
       {isCompleted && (
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
            <TrophyIcon className="w-5 h-5"/>
            <span>Tercapai!</span>
        </div>
       )}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary">{goal.name}</h3>
          {goal.targetDate && <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Target: {formatDate(goal.targetDate)}</p>}
        </div>
        <button onClick={onSetGoal} className="text-text-secondary dark:text-dark-text-secondary hover:text-amber-600 dark:hover:text-amber-400 p-2 rounded-full transition-colors">
            <PencilIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 my-2">
        <div
          className={`h-4 rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-gradient-to-r from-gold-light to-gold-dark'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-sm font-medium">
        <span className="text-text-primary dark:text-dark-text-primary">{isBalanceVisible ? formatToRupiah(currentAmount) : 'Rp ••••••••'}</span>
        <span className="text-text-secondary dark:text-dark-text-secondary">{formatToRupiah(goal.targetAmount)}</span>
      </div>
       <div className="text-right text-sm font-bold text-gold-dark mt-1">
          {progress.toFixed(1)}%
       </div>
    </div>
  );
};

export default SavingsGoalTracker;