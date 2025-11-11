import React, { useState, useMemo } from 'react';
import type { ElementType } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    ArrowPathIcon as ArrowPathIconSolid,
    CurrencyDollarIcon as CurrencyDollarIconSolid,
    CheckCircleIcon as CheckCircleIconSolid,
    ClockIcon as ClockIconSolid,
    XMarkIcon as XMarkIconSolid
} from '@heroicons/react/24/solid';
import { ScaleIcon as ScaleIconOutline } from '@heroicons/react/24/outline';
import { User, Transaction, TransactionType, TransactionStatus } from '../types.ts';
import { formatToRupiah, formatDate } from '../utils/formatter.ts';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const ArrowPathIcon = (ArrowPathIconSolid as any).default || ArrowPathIconSolid;
const CurrencyDollarIcon = (CurrencyDollarIconSolid as any).default || CurrencyDollarIconSolid;
const CheckCircleIcon = (CheckCircleIconSolid as any).default || CheckCircleIconSolid;
const ClockIcon = (ClockIconSolid as any).default || ClockIconSolid;
const XMarkIcon = (XMarkIconSolid as any).default || XMarkIconSolid;
const ScaleIcon = (ScaleIconOutline as any).default || ScaleIconOutline;

interface MitraSampahDashboardPageProps {
  setActivePage: (page: string) => void;
  currentUser: User;
  transactions: Transaction[];
  onApproveDeposit: (transactionId: string) => void; 
}

const StatCard: React.FC<{ title: string, value: string | number, icon: React.ElementType }> = ({ title, value, icon: IconComponent }) => {
    const Icon = (IconComponent as any).default || IconComponent;
    return (
        <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-4 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
                <Icon className="w-7 h-7 text-primary dark:text-gold-light" />
            </div>
            <div>
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{title}</p>
                <p className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">{value}</p>
            </div>
        </div>
    );
};

const DepositCard: React.FC<{
    deposit: Transaction, 
    isPending: boolean, 
    onApproveDeposit: (transactionId: string) => void
}> = ({ deposit, isPending, onApproveDeposit }) => {
    return (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-semibold text-text-secondary dark:text-dark-text-secondary">{formatDate(deposit.date)}</p>
                    <p className="font-bold text-text-primary dark:text-dark-text-primary">{deposit.userName}</p>
                </div>
                <span className="text-lg font-bold text-primary dark:text-gold-light">{formatToRupiah(deposit.amount)}</span>
            </div>
            <div className="my-2 py-2 border-y border-slate-200 dark:border-slate-700">
                <p className="text-sm">{deposit.description}</p>
            </div>
            {isPending && (
                 <button onClick={() => onApproveDeposit(deposit.id)} className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-bold py-2 rounded-md flex items-center justify-center gap-1">
                    <CheckCircleIcon className="w-4 h-4" />
                    Verifikasi & Setujui
                </button>
            )}
        </div>
    );
};

const MitraSampahDashboardPage: React.FC<MitraSampahDashboardPageProps> = ({ 
    setActivePage, 
    currentUser, 
    transactions,
    onApproveDeposit
}) => {
    const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

    const { pendingDeposits, completedDeposits, stats } = useMemo(() => {
        const allDeposits = transactions.filter(tx => tx.type === TransactionType.WASTE_DEPOSIT);
        const pending = allDeposits.filter(tx => tx.status === TransactionStatus.PENDING);
        const completed = allDeposits.filter(tx => tx.status === TransactionStatus.COMPLETED);

        let totalWeight = 0;
        completed.forEach(tx => {
            const match = tx.description.match(/(\d+(\.\d+)?)\s*kg/i);
            if (match && match[1]) {
                totalWeight += parseFloat(match[1]);
            }
        });
        
        const totalValue = completed.reduce((acc, tx) => acc + tx.amount, 0);

        return {
            pendingDeposits: pending,
            completedDeposits: completed,
            stats: {
                totalWeight: `${totalWeight.toFixed(1)} kg`,
                totalValue: formatToRupiah(totalValue),
                pendingCount: pending.length.toString()
            }
        };
    }, [transactions]);

    return (
        <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
            {/* Header */}
            <div className="flex items-center">
                <button
                    onClick={() => setActivePage('Dasbor Mitra')}
                    className="p-2 -m-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-4"
                >
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3">
                    <ArrowPathIcon className="w-8 h-8 text-green-500" />
                    <h1 className="text-2xl font-bold">Dasbor Mitra Bank Sampah</h1>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Total Nilai Terkumpul" value={stats.totalValue} icon={CurrencyDollarIcon} />
                <StatCard title="Total Berat Terkumpul" value={stats.totalWeight} icon={ScaleIcon} />
                <StatCard title="Perlu Verifikasi" value={stats.pendingCount} icon={ClockIcon} />
            </div>
            
            {/* Tabs */}
            <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-4">
                <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 mb-4">
                    <button onClick={() => setActiveTab('pending')} className={`py-2 text-sm font-bold rounded-md transition-colors ${activeTab === 'pending' ? 'bg-gradient-to-br from-gold-light to-gold-dark text-white shadow' : 'text-text-secondary dark:text-dark-text-secondary hover:bg-slate-200 dark:hover:bg-slate-700'}`}>Perlu Verifikasi ({pendingDeposits.length})</button>
                    <button onClick={() => setActiveTab('completed')} className={`py-2 text-sm font-bold rounded-md transition-colors ${activeTab === 'completed' ? 'bg-gradient-to-br from-gold-light to-gold-dark text-white shadow' : 'text-text-secondary dark:text-dark-text-secondary hover:bg-slate-200 dark:hover:bg-slate-700'}`}>Riwayat Selesai</button>
                </div>
                
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                    {activeTab === 'pending' && (
                        pendingDeposits.length > 0 ? pendingDeposits.map(deposit => 
                            <DepositCard 
                                key={deposit.id} 
                                deposit={deposit} 
                                isPending={true}
                                onApproveDeposit={onApproveDeposit}
                            />)
                        : <p className="text-center text-sm text-text-secondary py-8">Tidak ada setoran yang perlu diverifikasi.</p>
                    )}
                    {activeTab === 'completed' && (
                        completedDeposits.length > 0 ? completedDeposits.map(deposit => 
                            <DepositCard 
                                key={deposit.id} 
                                deposit={deposit} 
                                isPending={false}
                                onApproveDeposit={onApproveDeposit}
                            />)
                        : <p className="text-center text-sm text-text-secondary py-8">Belum ada riwayat setoran yang selesai.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// Fix: Add default export to resolve the import error in App.tsx
export default MitraSampahDashboardPage;