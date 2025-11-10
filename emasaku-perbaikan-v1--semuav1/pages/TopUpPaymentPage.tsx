import React from 'react';
// Fix: Add guard for heroicons
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    ShieldCheckIcon as ShieldCheckIconSolid 
} from '@heroicons/react/24/solid';
import { TransactionType } from '../types.ts';
import { formatToRupiah } from '../utils/formatter.ts';

// Fix: Add guard for heroicons
const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const ShieldCheckIcon = (ShieldCheckIconSolid as any).default || ShieldCheckIconSolid;

interface TopUpPaymentPageProps {
  setActivePage: (page: string) => void;
  amount: number;
  method: string;
  onConfirmTopUp: (type: TransactionType.TOP_UP, amount: number, method: string) => void;
}

const TopUpPaymentPage: React.FC<TopUpPaymentPageProps> = ({ setActivePage, amount, method, onConfirmTopUp }) => {
    const adminFee = 1000;
    const totalPayment = amount + adminFee;

    const handleConfirm = () => {
        onConfirmTopUp(TransactionType.TOP_UP, amount, method);
        // Modal sukses akan muncul sebagai overlay. Setelah ditutup,
    };
    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
             {/* Header */}
            <div className="flex items-center mb-6">
                <button
                onClick={() => setActivePage('Top Up')}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-4"
                aria-label="Kembali ke Top Up"
                >
                <ArrowLeftIcon className="w-6 h-6 text-text-primary dark:text-dark-text-primary" />
                </button>
                <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">
                    Instruksi Pembayaran
                </h1>
            </div>

            <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6">
                 <div className="text-center">
                    <ShieldCheckIcon className="w-12 h-12 text-primary dark:text-gold-light mx-auto mb-3" />
                    <h2 className="text-xl font-bold">Selesaikan Pembayaran Anda</h2>
                </div>
            </div>

        </div>
    );
};
export default TopUpPaymentPage;