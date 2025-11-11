import React, { useState, useEffect, useMemo } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    BanknotesIcon as BanknotesIconSolid, 
    ClockIcon as ClockIconSolid,
    XMarkIcon as XMarkIconSolid,
    ShieldCheckIcon as ShieldCheckIconSolid,
    CheckCircleIcon as CheckCircleIconSolid
} from '@heroicons/react/24/solid';
import { Iuran, Transaction, TransactionType, TransactionStatus } from '../types.ts';
import { getIuranList } from '../services/mockData.ts';
import { formatToRupiah, formatDate } from '../utils/formatter.ts';
import { getTransactionsForUser } from '../services/mockData.ts';
import { User } from '../types.ts';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const BanknotesIcon = (BanknotesIconSolid as any).default || BanknotesIconSolid;
const ClockIcon = (ClockIconSolid as any).default || ClockIconSolid;
const XMarkIcon = (XMarkIconSolid as any).default || XMarkIconSolid;
const ShieldCheckIcon = (ShieldCheckIconSolid as any).default || ShieldCheckIconSolid;
const CheckCircleIcon = (CheckCircleIconSolid as any).default || CheckCircleIconSolid;


interface IuranPageProps {
  setActivePage: (page: string) => void;
  onRequestIuranPayment: (amount: number, description: string, method: string) => void;
  onAddNotification: (title: string, message: string) => void;
  currentUser: User; // Add currentUser to props
}

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
    iuran: Iuran;
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ iuran, onClose, onConfirm }) => {
    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-2xl p-6 w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-slate-400"><XMarkIcon className="w-6 h-6" /></button>
                <div className="text-center">
                    <ShieldCheckIcon className="w-12 h-12 text-primary dark:text-gold-light mx-auto mb-3" />
                    <h2 className="text-xl font-bold">Konfirmasi Pembayaran</h2>
                </div>
                <div className="my-6 p-4 bg-slate-50 dark:bg-dark-surface/50 rounded-lg space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-text-secondary dark:text-dark-text-secondary">Pembayaran</span><span className="font-bold">{iuran.title}</span></div>
                    <div className="flex justify-between font-bold text-lg pt-3 mt-3 border-t"><span>Total</span><span className="text-primary dark:text-gold-light">{formatToRupiah(iuran.amount)}</span></div>
                </div>
                <p className="text-xs text-center text-text-secondary dark:text-dark-text-secondary">Pembayaran akan menggunakan Saldo EmaSaku dan memerlukan verifikasi admin.</p>
                <button onClick={onConfirm} className="w-full mt-4 bg-gradient-to-br from-gold-light to-gold-dark text-white font-bold py-3 px-4 rounded-lg">Bayar & Ajukan Verifikasi</button>
            </div>
        </div>
    );
};


const IuranPage: React.FC<IuranPageProps> = ({ setActivePage, onRequestIuranPayment, currentUser }) => {
    const [iuranList, setIuranList] = useState<Iuran[]>([]);
    const [history, setHistory] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIuran, setSelectedIuran] = useState<Iuran | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [iurans, transactions] = await Promise.all([
                getIuranList(),
                getTransactionsForUser(currentUser.id)
            ]);
            setIuranList(iurans);
            setHistory(transactions.filter(tx => tx.type === TransactionType.CONTRIBUTION));
            setLoading(false);
        };
        fetchData();
    }, [currentUser.id]);
    
    const handlePay = (iuran: Iuran) => {
        setSelectedIuran(iuran);
    };

    const handleConfirmPayment = () => {
        if (selectedIuran) {
            onRequestIuranPayment(selectedIuran.amount, selectedIuran.title, 'Saldo EmaSaku');
            setSelectedIuran(null); // Close modal
        }
    };
    
    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            {selectedIuran && <ConfirmationModal iuran={selectedIuran} onClose={() => setSelectedIuran(null)} onConfirm={handleConfirmPayment} />}
            <div className="flex items-center mb-6">
                <button
                    onClick={() => setActivePage('Dashboard')}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-4"
                >
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3">
                    <BanknotesIcon className="w-8 h-8 text-primary dark:text-gold-light" />
                    <h1 className="text-2xl font-bold">Bayar Iuran</h1>
                </div>
            </div>
            
            {loading ? (
                 <div className="flex justify-center items-center h-64">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Active Bills */}
                    <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary mb-4">Tagihan Aktif</h2>
                        <div className="space-y-3">
                            {iuranList.map(iuran => (
                                <div key={iuran.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                                    <div>
                                        <h3 className="font-bold text-text-primary dark:text-dark-text-primary">{iuran.title}</h3>
                                        <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Jatuh Tempo: {formatDate(iuran.dueDate)}</p>
                                    </div>
                                    <div className="flex sm:flex-col items-end gap-2 sm:gap-0 mt-2 sm:mt-0 sm:text-right">
                                        <p className="font-bold text-lg text-primary dark:text-gold-light">{formatToRupiah(iuran.amount)}</p>
                                        <button onClick={() => handlePay(iuran)} className="px-4 py-1.5 bg-primary text-white text-sm font-semibold rounded-lg">Bayar Sekarang</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Payment History */}
                    <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary mb-4 flex items-center gap-2">
                            <ClockIcon className="w-6 h-6 text-text-secondary dark:text-dark-text-secondary"/>
                            Riwayat Pembayaran
                        </h2>
                        {history.length > 0 ? (
                            <ul className="divide-y divide-slate-200 dark:divide-slate-700 max-h-60 overflow-y-auto pr-2">
                                {history.map(tx => (
                                    <li key={tx.id} className="py-3 flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-text-primary dark:text-dark-text-primary">{tx.description}</p>
                                            <p className="text-xs text-text-secondary dark:text-dark-text-secondary">{formatDate(tx.date)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-red-500">{formatToRupiah(tx.amount)}</p>
                                            <StatusBadge status={tx.status}/>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-sm text-text-secondary dark:text-dark-text-secondary py-4">Belum ada riwayat pembayaran iuran.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default IuranPage;
