import React from 'react';
// Fix: Add .ts extension to the import path
import { Transaction, TransactionType } from '../../types.ts';
// Fix: Add .ts extension to the import path
import { formatToRupiah, formatDate } from '../../utils/formatter.ts';
import { 
    ArrowDownCircleIcon as ArrowDownCircleIconOutline, 
    ArrowUpCircleIcon as ArrowUpCircleIconOutline, 
    BanknotesIcon as BanknotesIconOutline, 
    GiftIcon as GiftIconOutline, 
    BuildingStorefrontIcon as BuildingStorefrontIconOutline, 
    ArrowPathIcon as ArrowPathIconOutline, 
    SparklesIcon as SparklesIconOutline 
} from '@heroicons/react/24/outline';

const ArrowDownCircleIcon = (ArrowDownCircleIconOutline as any).default || ArrowDownCircleIconOutline;
const ArrowUpCircleIcon = (ArrowUpCircleIconOutline as any).default || ArrowUpCircleIconOutline;
const BanknotesIcon = (BanknotesIconOutline as any).default || BanknotesIconOutline;
const GiftIcon = (GiftIconOutline as any).default || GiftIconOutline;
const BuildingStorefrontIcon = (BuildingStorefrontIconOutline as any).default || BuildingStorefrontIconOutline;
const ArrowPathIcon = (ArrowPathIconOutline as any).default || ArrowPathIconOutline;
const SparklesIcon = (SparklesIconOutline as any).default || SparklesIconOutline;

interface TransactionListProps {
  transactions: Transaction[];
  title: string;
  onUserClick?: (userId: string) => void;
}

const TransactionIcon: React.FC<{ type: TransactionType }> = ({ type }) => {
    switch (type) {
        case TransactionType.SAVINGS:
        case TransactionType.TOP_UP: {
            return <ArrowUpCircleIcon className="w-6 h-6 text-green-500" />;
        }
        case TransactionType.WASTE_DEPOSIT: {
            return <ArrowPathIcon className="w-6 h-6 text-green-500" />;
        }
        case TransactionType.CONTRIBUTION: {
            return <BanknotesIcon className="w-6 h-6 text-blue-500" />;
        }
        case TransactionType.DONATION: {
            return <GiftIcon className="w-6 h-6 text-purple-500" />;
        }
        case TransactionType.WITHDRAWAL: {
            return <ArrowDownCircleIcon className="w-6 h-6 text-red-500" />;
        }
        case TransactionType.SALE: {
            return <BuildingStorefrontIcon className="w-6 h-6 text-cyan-500" />;
        }
        case TransactionType.PARTNER_REGISTRATION_REQUEST: {
            return <BuildingStorefrontIcon className="w-6 h-6 text-indigo-500" />;
        }
        case TransactionType.LAUNDRY_PAYOUT: {
            return <SparklesIcon className="w-6 h-6 text-violet-500" />;
        }
        default: {
            return <BanknotesIcon className="w-6 h-6 text-gray-500" />; // Fallback icon
        }
    }
};

const TransactionList: React.FC<TransactionListProps> = ({ transactions, title, onUserClick }) => {
  const handleUserClick = (e: React.MouseEvent, userId: string) => {
    if (!onUserClick) return;
    e.preventDefault();
    onUserClick(userId);
  };

  return (
    <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-4 flex-shrink-0">{title}</h3>
      {transactions.length > 0 ? (
          <div className="space-y-3 overflow-y-auto flex-1 -mr-2 pr-2">
            {transactions.map((t) => {
              const isRegistration = t.type === TransactionType.PARTNER_REGISTRATION_REQUEST;
              const isExpense = !isRegistration && [TransactionType.WITHDRAWAL, TransactionType.DONATION, TransactionType.CONTRIBUTION].includes(t.type);
              const amountColor = isExpense ? 'text-red-500' : 'text-green-500';
              const amountPrefix = isExpense ? '-' : '+';

              const mainText = onUserClick ? t.userName : t.description;
              const secondaryText = onUserClick ? t.description : formatDate(t.date);

              return (
                <div key={t.id} className="flex items-center space-x-3">
                  <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full flex-shrink-0">
                    <TransactionIcon type={t.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    {onUserClick ? (
                      <button onClick={(e) => handleUserClick(e, t.userId)} className="font-bold text-sm text-left hover:underline text-text-primary dark:text-dark-text-primary truncate">
                        {mainText}
                      </button>
                    ) : (
                      <p className="font-bold text-sm text-text-primary dark:text-dark-text-primary truncate">{mainText}</p>
                    )}
                    <p className="text-xs text-text-secondary dark:text-dark-text-secondary truncate">{secondaryText}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                      {!isRegistration ? (
                          <p className={`font-bold text-sm ${amountColor}`}>
                              {amountPrefix}{formatToRupiah(t.amount)}
                          </p>
                      ) : (
                          <p className="font-bold text-sm text-indigo-500">
                              Registrasi
                          </p>
                      )}
                      {onUserClick && (
                          <p className="text-xs text-text-secondary dark:text-dark-text-secondary">{formatDate(t.date)}</p>
                      )}
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Tidak ada transaksi ditemukan.</p>
        </div>
      )}
    </div>
  );
};

export default TransactionList;