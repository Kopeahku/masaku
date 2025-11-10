import React, { useState, useMemo } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    BuildingStorefrontIcon as BuildingStorefrontIconSolid,
    ClipboardDocumentCheckIcon as ClipboardDocumentCheckIconSolid,
    ClockIcon as ClockIconSolid,
    CheckCircleIcon as CheckCircleIconSolid,
    XCircleIcon as XCircleIconSolid
} from '@heroicons/react/24/solid';
import { User, Transaction, TransactionType } from '../types.ts';
import { formatToRupiah, formatDate } from '../utils/formatter.ts';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const BuildingStorefrontIcon = (BuildingStorefrontIconSolid as any).default || BuildingStorefrontIconSolid;
const ClipboardDocumentCheckIcon = (ClipboardDocumentCheckIconSolid as any).default || ClipboardDocumentCheckIconSolid;
const ClockIcon = (ClockIconSolid as any).default || ClockIconSolid;
const CheckCircleIcon = (CheckCircleIconSolid as any).default || CheckCircleIconSolid;
const XCircleIcon = (XCircleIconSolid as any).default || XCircleIconSolid;


interface RetailPartnerDashboardPageProps {
  setActivePage: (page: string) => void;
  currentUser: User;
  transactions: Transaction[];
  onProcessRetailTopUp: (paymentCode: string, amount: number) => Promise<{ success: boolean, message: string }>;
}

const RetailPartnerDashboardPage: React.FC<RetailPartnerDashboardPageProps> = ({ 
    setActivePage, 
    currentUser, 
    transactions,
    onProcessRetailTopUp
}) => {
    const [paymentCode, setPaymentCode] = useState('');
    const [amount, setAmount] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [processResult, setProcessResult] = useState<{ success: boolean; message: string } | null>(null);

    const partnerPayoutHistory = useMemo(() => {
        return transactions.filter(tx => 
            tx.userId === currentUser.id && tx.type === TransactionType.RETAIL_PAYOUT
        );
    }, [transactions, currentUser.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!paymentCode.trim() || !amount.trim() || Number(amount) <= 0) {
            alert("Harap isi Kode Pembayaran dan Jumlah Setoran dengan benar.");
            return;
        }
        setIsProcessing(true);
        setProcessResult(null);
        const result = await onProcessRetailTopUp(paymentCode.toUpperCase(), Number(amount));
        setProcessResult(result);
        setIsProcessing(false);
        if (result.success) {
            setPaymentCode('');
            setAmount('');
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
            {/* Header */}
            <div className="flex items-center">
                <button
                    onClick={() => setActivePage('Profile')}
                    className="p-2 -m-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-4"
                >
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3">
                    <BuildingStorefrontIcon className="w-8 h-8 text-green-500" />
                    <h1 className="text-2xl font-bold">Dasbor Mitra Retail</h1>
                </div>
            </div>

            {/* Process Top Up Card */}
            <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6">
                <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                    <ClipboardDocumentCheckIcon className="w-6 h-6 text-primary dark:text-gold-light" />
                    Proses Top Up Anggota
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="text" 
                        value={paymentCode}
                        onChange={e => setPaymentCode(e.target.value)}
                        placeholder="Masukkan Kode Pembayaran"
                        className="w-full p-3 border rounded-md font-mono tracking-widest text-lg"
                    />
                    <input
                        type="number"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder="Masukkan Jumlah Setoran (Rp)"
                        className="w-full p-3 border rounded-md text-lg"
                    />
                    <button 
                        type="submit"
                        disabled={isProcessing}
                        className="w-full bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold py-3 rounded-lg disabled:from-slate-400 disabled:to-slate-500"
                    >
                        {isProcessing ? 'Memproses...' : 'Proses Top Up'}
                    </button>
                </form>
                {processResult && (
                    <div className={`mt-4 p-3 rounded-md text-sm font-semibold flex items-center gap-2 ${processResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {processResult.success ? <CheckCircleIcon className="w-5 h-5" /> : <XCircleIcon className="w-5 h-5" />}
                        {processResult.message}
                    </div>
                )}
            </div>
            
            {/* Payout History */}
            <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6">
                 <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                    <ClockIcon className="w-6 h-6 text-text-secondary" />
                    Riwayat Komisi
                </h2>
                {partnerPayoutHistory.length > 0 ? (
                    <ul className="divide-y divide-slate-200 dark:divide-slate-700 max-h-60 overflow-y-auto pr-2">
                        {partnerPayoutHistory.map(tx => (
                            <li key={tx.id} className="py-3 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{tx.description}</p>
                                    <p className="text-xs text-text-secondary">{formatDate(tx.date)}</p>
                                </div>
                                <p className="font-bold text-green-600 dark:text-green-400">+{formatToRupiah(tx.amount)}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-sm text-text-secondary py-4">Belum ada riwayat komisi.</p>
                )}
            </div>
        </div>
    );
};

export default RetailPartnerDashboardPage;