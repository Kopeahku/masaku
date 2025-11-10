import React from 'react';
// Fix: Add .ts extension to the import path
import { formatToRupiah } from '../../utils/formatter.ts';
import { 
    WalletIcon as WalletIconOutline, 
    EyeIcon as EyeIconOutline, 
    EyeSlashIcon as EyeSlashIconOutline 
} from '@heroicons/react/24/outline';
// Fix: Add guard for heroicons
import { 
    PencilIcon as PencilIconSolid, 
    FlagIcon as FlagIconSolid 
} from '@heroicons/react/24/solid';
// Fix: Add .ts extension to the import path
import { SavingsGoal } from '../../types.ts';

// Fix: Add guard for heroicons
const PencilIcon = (PencilIconSolid as any).default || PencilIconSolid;
const FlagIcon = (FlagIconSolid as any).default || FlagIconSolid;
const WalletIcon = (WalletIconOutline as any).default || WalletIconOutline;
const EyeIcon = (EyeIconOutline as any).default || EyeIconOutline;
const EyeSlashIcon = (EyeSlashIconOutline as any).default || EyeSlashIconOutline;


interface TotalBalanceCardProps {
  balance: number;
  userName: string;
  savingsGoal: SavingsGoal | null;
  isBalanceVisible: boolean;
  onToggleVisibility: () => void;
  onEditGoal: () => void;
  showSavingsGoal?: boolean;
}

const TotalBalanceCard: React.FC<TotalBalanceCardProps> = ({ 
  balance, 
  userName, 
  savingsGoal, 
  isBalanceVisible, 
  onToggleVisibility,
  onEditGoal,
  showSavingsGoal = true
}) => {
  const progress = savingsGoal ? Math.min((balance / savingsGoal.targetAmount) * 100, 100) : 0;
  
  return (
    <div className="bg-gradient-to-br from-gold-light via-gold-DEFAULT to-gold-dark text-white rounded-xl shadow-lg p-4">
      {/* Balance Info */}
      <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-medium text-white/90">Total Saldo Anda</h2>
            <button onClick={onToggleVisibility} className="text-white/70 hover:text-white transition-colors" aria-label={isBalanceVisible ? 'Sembunyikan saldo' : 'Tampilkan saldo'}>
                {isBalanceVisible ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
          <WalletIcon className="w-7 h-7 text-white/50" />
      </div>
      <p className="text-2xl md:text-3xl font-bold h-10 flex items-center">
        {isBalanceVisible ? formatToRupiah(balance) : 'Rp ••••••••'}
      </p>
      <p className="text-xs text-white/90">Selamat datang kembali, {userName}!</p>

      {/* Savings Goal Progress */}
      {showSavingsGoal && (savingsGoal ? (
        <div className="mt-4 border-t border-white/20 pt-3">
            <div className="flex justify-between items-center mb-1">
              <p className="text-xs font-semibold text-white">{savingsGoal.name}</p>
              <button onClick={onEditGoal} className="text-white/70 hover:text-white transition-colors p-1 -m-1" aria-label="Ubah target tabungan">
                <PencilIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="w-full bg-white/30 rounded-full h-1.5">
              <div 
                  className="bg-white h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-white/90 mt-1 text-right">
              {isBalanceVisible ? formatToRupiah(balance) : 'Rp ••••••••'} / {formatToRupiah(savingsGoal.targetAmount)}
            </p>
        </div>
      ) : (
        <div className="mt-4 border-t border-white/20 pt-3 text-center">
            <p className="text-xs text-white/80 mb-2">Anda belum punya target tabungan.</p>
            <button
                onClick={onEditGoal}
                className="bg-amber-900/80 hover:bg-amber-900 text-white text-xs font-bold py-1.5 px-4 rounded-full transition-colors flex items-center gap-1.5 mx-auto"
            >
                <FlagIcon className="w-3 h-3"/>
                Buat Target
            </button>
        </div>
      ))}
    </div>
  );
};

export default TotalBalanceCard;