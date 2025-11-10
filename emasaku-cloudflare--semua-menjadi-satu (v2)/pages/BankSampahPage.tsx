import React, { useState, useEffect, useMemo } from 'react';
import type { ElementType } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    ArrowPathIcon as ArrowPathIconSolid, 
    WalletIcon as WalletIconSolid, 
    ClockIcon as ClockIconSolid, 
    CheckCircleIcon as CheckCircleIconSolid, 
    XMarkIcon as XMarkIconSolid 
} from '@heroicons/react/24/solid';
import { User, Transaction, TransactionType, TransactionStatus } from '../types.ts';
import { getWasteTypes, WasteType } from '../services/mockData.ts';
import { formatToRupiah, formatDate } from '../utils/formatter.ts';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const ArrowPathIcon = (ArrowPathIconSolid as any).default || ArrowPathIconSolid;
const WalletIcon = (WalletIconSolid as any).default || WalletIconSolid;
const ClockIcon = (ClockIconSolid as any).default || ClockIconSolid;
const CheckCircleIcon = (CheckCircleIconSolid as any).default || CheckCircleIconSolid;
const XMarkIcon = (XMarkIconSolid as any).default || XMarkIconSolid;


interface BankSampahPageProps {
  setActivePage: (page: string) => void;
  currentUser: User;
  transactions: Transaction[];
  onWasteDepositRequest: (wasteTypeName: string, weight: number, value: number) => void;
}

// Local StatusBadge component
const StatusBadge: React.FC<{ status: TransactionStatus }> = ({ status }) => {
    const baseClasses = "flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full w-fit";
    if (status === TransactionStatus.COMPLETED) {
        return <div className={`${baseClasses} bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400`}><CheckCircleIcon className="w-3 h-3" /> Berhasil</div>;
    }
    if (status === TransactionStatus.PENDING) {
        return <div className={`${baseClasses} bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400`}><ClockIcon className="w-3 h-3" /> Diproses</div>;
    }
    return <div className={`${baseClasses} bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400`}><XMarkIcon className="w-3 h-3" /> Gagal</div>;
};

interface ConfirmationModalProps {
    deposit: { waste: WasteType; weight: number; value: number };
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ deposit, onClose, onConfirm }) => {
    const { waste, weight, value } = deposit;

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-2xl p-6 w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-slate-400"><XMarkIcon className="w-6 h-6" /></button>
                <div className="text-center">
                    <ArrowPathIcon className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <h2 className="text-xl font-bold">Konfirmasi Setoran Sampah</h2>
                </div>
                <div className="my-6 p-4 bg-slate-50 dark:bg-dark-surface/50 rounded-lg space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-text-secondary dark:text-dark-text-secondary">Jenis Sampah</span><span className="font-bold">{waste.name}</span></div>
                    <div className="flex justify-between"><span className="text-text-secondary dark:text-dark-text-secondary">Berat</span><span className="font-bold">{weight} kg</span></div>
                    <div className="flex justify-between font-bold text-lg pt-3 mt-3 border-t"><span>Estimasi Nilai</span><span className="text-green-600 dark:text-green-400">{formatToRupiah(value)}</span></div>
                </div>
                <p className="text-xs text-center text-text-secondary dark:text-dark-text-secondary">Dengan konfirmasi, permintaan setoran akan dikirim ke Admin untuk verifikasi berat dan nilai aktual.</p>
                <button onClick={onConfirm} className="w-full mt-4 bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-lg">Konfirmasi Setoran</button>
            </div>
        </div>
    );
};

const BankSampahPage: React.FC<BankSampahPageProps> = ({ setActivePage, currentUser, transactions, onWasteDepositRequest }) => {
    const [wasteTypes, setWasteTypes] = useState<WasteType[]>([]);
    const [loading, setLoading] = useState(true);
    const [weights, setWeights] = useState<Record<string, string>>({});
    const [confirmingDeposit, setConfirmingDeposit] = useState<{ waste: WasteType; weight: number; value: number } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const types = await getWasteTypes();
            setWasteTypes(types);
            setLoading(false);
        };
        fetchData();
    }, []);

    const { totalEarnings, depositHistory } = useMemo(() => {
        const history = transactions.filter(tx => tx.userId === currentUser.id && tx.type === TransactionType.WASTE_DEPOSIT);
        const earnings = history
            .filter(tx => tx.status === TransactionStatus.COMPLETED)
            .reduce((sum, tx) => sum + tx.amount, 0);
        return { totalEarnings: earnings, depositHistory: history };
    }, [transactions, currentUser.id]);

    const handleWeightChange = (id: string, value: string) => {
        setWeights(prev => ({ ...prev, [id]: value }));
    };

    const handleDeposit = (waste: WasteType) => {
        const weight = parseFloat(weights[waste.id] || '0');
        if (weight <= 0) {
            alert('Harap masukkan berat sampah yang valid.');
            return;
        }
        const value = weight * waste.pricePerKg;
        setConfirmingDeposit({ waste, weight, value });
    };

    const handleConfirmDeposit = () => {
        if (confirmingDeposit) {
            onWasteDepositRequest(confirmingDeposit.waste.name, confirmingDeposit.weight, confirmingDeposit.value);
            setWeights(prev => ({ ...prev, [confirmingDeposit.waste.id]: '' }));
            setConfirmingDeposit(null);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
            {confirmingDeposit && <ConfirmationModal deposit={confirmingDeposit} onClose={() => setConfirmingDeposit(null)} onConfirm={handleConfirmDeposit} />}
            {/* Header */}
            <div className="flex items-center">
                <button
                    onClick={() => setActivePage('Dashboard')}
                    className="p-2 -m-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-4"
                >
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3">
                    <ArrowPathIcon className="w-8 h-8 text-green-500" />
                    <h1 className="text-2xl font-bold">Bank Sampah</h1>
                </div>
            </div>

            {/* Total Earnings */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl shadow-lg p-6 flex items-center justify-between">
                <div>
                    <p className="text-sm text-green-100">Total Pendapatan dari Sampah</p>
                    <p className="text-4xl font-bold my-1">{formatToRupiah(totalEarnings)}</p>
                </div>
                <WalletIcon className="w-10 h-10 text-white/50" />
            </div>

            {/* Deposit Form */}
            <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6">
                <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary mb-4">Setor Sampah Anda</h2>
                {loading ? (
                    <div className="text-center py-8"><p>Memuat jenis sampah...</p></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {wasteTypes.map(waste => {
                            const Icon = (waste.icon as any).default || waste.icon;
                            const weight = parseFloat(weights[waste.id] || '0');
                            const value = weight * waste.pricePerKg;

                            return (
                                <div key={waste.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full"><Icon className="w-6 h-6 text-text-secondary dark:text-dark-text-secondary"/></div>
                                        <div>
                                            <h3 className="font-bold">{waste.name}</h3>
                                            <p className="text-xs font-semibold text-green-600 dark:text-green-400">{formatToRupiah(waste.pricePerKg)} / kg</p>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={weights[waste.id] || ''}
                                            onChange={(e) => handleWeightChange(waste.id, e.target.value)}
                                            placeholder="0"
                                            className="w-full p-2 pr-10 border rounded-md"
                                        />
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-text-secondary">kg</span>
                                    </div>
                                    <p className="text-sm text-center">Estimasi Nilai: <span className="font-bold">{formatToRupiah(value)}</span></p>
                                    <button onClick={() => handleDeposit(waste)} className="w-full bg-primary text-white text-sm font-bold py-2 rounded-md">Setor</button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Deposit History */}
            <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6">
                <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary mb-4">Riwayat Setoran</h2>
                {depositHistory.length > 0 ? (
                    <ul className="divide-y divide-slate-200 dark:divide-slate-700 max-h-60 overflow-y-auto pr-2">
                        {depositHistory.map(tx => (
                            <li key={tx.id} className="py-3 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-text-primary dark:text-dark-text-primary">{tx.description}</p>
                                    <p className="text-xs text-text-secondary dark:text-dark-text-secondary">{formatDate(tx.date)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-green-600 dark:text-green-400">+{formatToRupiah(tx.amount)}</p>
                                    <StatusBadge status={tx.status} />
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-sm text-text-secondary dark:text-dark-text-secondary py-4">Belum ada riwayat setoran sampah.</p>
                )}
            </div>

        </div>
    );
};

export default BankSampahPage;