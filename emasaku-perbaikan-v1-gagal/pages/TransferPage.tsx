import React, { useState, useEffect, useMemo } from 'react';
import {
    ArrowLeftIcon as ArrowLeftIconSolid,
    ArrowsRightLeftIcon as ArrowsRightLeftIconSolid,
    UserCircleIcon as UserCircleIconSolid,
    MagnifyingGlassIcon as MagnifyingGlassIconSolid,
    XMarkIcon as XMarkIconSolid,
    ShieldCheckIcon as ShieldCheckIconSolid
} from '@heroicons/react/24/solid';
import { User, TransactionType } from '../types.ts';
import { formatToRupiah } from '../utils/formatter.ts';
import { getAllUsers } from '../services/mockData.ts';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const ArrowsRightLeftIcon = (ArrowsRightLeftIconSolid as any).default || ArrowsRightLeftIconSolid;
const UserCircleIcon = (UserCircleIconSolid as any).default || UserCircleIconSolid;
const MagnifyingGlassIcon = (MagnifyingGlassIconSolid as any).default || MagnifyingGlassIconSolid;
const XMarkIcon = (XMarkIconSolid as any).default || XMarkIconSolid;
const ShieldCheckIcon = (ShieldCheckIconSolid as any).default || ShieldCheckIconSolid;


interface TransferPageProps {
  setActivePage: (page: string) => void;
  currentUser: User;
  onTransfer: (recipient: User, amount: number, note: string) => void;
  currentBalance: number;
}

interface ConfirmationModalProps {
    onClose: () => void;
    onConfirm: () => void;
    recipient: User | null;
    amount: string;
    note: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ onClose, onConfirm, recipient, amount, note }) => (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm animate-fade-in">
        <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-2xl p-6 w-full max-w-md relative">
             <button onClick={onClose} className="absolute top-3 right-3 text-slate-400"><XMarkIcon className="w-6 h-6" /></button>
             <div className="text-center">
                <ShieldCheckIcon className="w-12 h-12 text-primary dark:text-gold-light mx-auto mb-3" />
                <h2 className="text-xl font-bold">Konfirmasi Transfer</h2>
             </div>
             <div className="my-6 p-4 bg-slate-50 dark:bg-dark-surface/50 rounded-lg space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-text-secondary dark:text-dark-text-secondary">Penerima</span><span className="font-bold flex items-center gap-2"><img src={recipient?.avatarUrl} className="w-5 h-5 rounded-full"/>{recipient?.name}</span></div>
                <div className="flex justify-between border-t pt-3 mt-3"><span className="text-text-secondary dark:text-dark-text-secondary">Jumlah Transfer</span><span className="font-bold">{formatToRupiah(Number(amount))}</span></div>
                {note && <div className="flex justify-between"><span className="text-text-secondary dark:text-dark-text-secondary">Catatan</span><span className="font-semibold italic">"{note}"</span></div>}
                <div className="flex justify-between font-bold text-lg pt-3 mt-3 border-t"><span>Total</span><span className="text-primary dark:text-gold-light">{formatToRupiah(Number(amount))}</span></div>
             </div>
             <button onClick={onConfirm} className="w-full bg-gradient-to-br from-gold-light to-gold-dark text-white font-bold py-3 px-4 rounded-lg">Konfirmasi & Kirim</button>
        </div>
    </div>
);

const TransferPage: React.FC<TransferPageProps> = ({ setActivePage, currentUser, onTransfer, currentBalance }) => {
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [recipient, setRecipient] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            const users = await getAllUsers();
            // Filter out the current user from the list of possible recipients
            setAllUsers(users.filter(u => u.id !== currentUser.id));
        };
        fetchUsers();
    }, [currentUser.id]);

    const filteredUsers = useMemo(() => {
        if (!searchTerm) return [];
        return allUsers.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.whatsapp && user.whatsapp.includes(searchTerm))
        ).slice(0, 5); // Limit results for performance
    }, [searchTerm, allUsers]);

    const handleSelectRecipient = (user: User) => {
        setRecipient(user);
        setSearchTerm(''); // Clear search after selection
    };
    
    const handleConfirm = () => {
        if (recipient && amount) {
            onTransfer(recipient, Number(amount), note);
            setConfirmModalOpen(false);
        }
    };
    
    const isTransferDisabled = !recipient || !amount || Number(amount) <= 0 || Number(amount) > currentBalance;
    const quickAmounts = [50000, 100000, 250000, 500000];

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            {isConfirmModalOpen && <ConfirmationModal 
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={handleConfirm}
                recipient={recipient}
                amount={amount}
                note={note}
            />}
            {/* Header */}
            <div className="flex items-center mb-6">
                <button
                    onClick={() => setActivePage('Dashboard')}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-4"
                    aria-label="Kembali ke Dasbor"
                >
                    <ArrowLeftIcon className="w-6 h-6 text-text-primary dark:text-dark-text-primary" />
                </button>
                <div className="flex items-center gap-3">
                    <ArrowsRightLeftIcon className="w-8 h-8 text-blue-500" />
                    <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">
                        Transfer Dana
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Transfer Form */}
                <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6 space-y-4">
                    <div className="text-center border-b pb-3 mb-3">
                        <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Saldo Anda</p>
                        <p className="text-3xl font-bold text-primary dark:text-gold-light">{formatToRupiah(currentBalance)}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Cari Penerima</label>
                        <div className="relative">
                            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                            <input
                                type="text"
                                placeholder="Cari nama atau nomor WA..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 p-2 border rounded-md"
                            />
                        </div>
                        {searchTerm && (
                            <ul className="mt-2 border rounded-md max-h-40 overflow-y-auto">
                                {filteredUsers.map(user => (
                                    <li key={user.id}>
                                        <button onClick={() => handleSelectRecipient(user)} className="w-full flex items-center gap-3 p-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700">
                                            <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full" />
                                            <div>
                                                <p className="text-sm font-bold">{user.name}</p>
                                                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">{user.whatsapp}</p>
                                            </div>
                                        </button>
                                    </li>
                                ))}
                                {filteredUsers.length === 0 && <li className="p-2 text-center text-sm text-slate-500">Pengguna tidak ditemukan.</li>}
                            </ul>
                        )}
                    </div>
                    
                    {recipient && (
                        <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg flex items-center justify-between animate-fade-in">
                            <div className="flex items-center gap-3">
                                <img src={recipient.avatarUrl} alt={recipient.name} className="w-10 h-10 rounded-full" />
                                <div>
                                    <p className="text-sm font-bold">{recipient.name}</p>
                                    <p className="text-xs text-text-secondary dark:text-dark-text-secondary">{recipient.whatsapp}</p>
                                </div>
                            </div>
                            <button onClick={() => setRecipient(null)} className="text-red-500 hover:text-red-700"><XMarkIcon className="w-5 h-5"/></button>
                        </div>
                    )}

                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Jumlah Transfer (Rp)</label>
                        <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" className="w-full p-2 border rounded-md font-semibold text-lg" />
                        <div className="grid grid-cols-4 gap-2 mt-2">
                            {quickAmounts.map(qa => (
                                <button key={qa} onClick={() => setAmount(String(qa))} className="p-1 border rounded text-xs">{formatToRupiah(qa).replace(',00', '')}</button>
                            ))}
                        </div>
                    </div>

                     <div>
                        <label htmlFor="note" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Catatan (Opsional)</label>
                        <input type="text" id="note" value={note} onChange={e => setNote(e.target.value)} placeholder="Untuk bayar..." className="w-full p-2 border rounded-md"/>
                    </div>
                </div>
                
                {/* Summary */}
                <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6 h-fit">
                    <h3 className="text-lg font-semibold mb-4 border-b pb-3">Ringkasan</h3>
                    <div className="space-y-2 text-sm">
                         <div className="flex justify-between"><span>Penerima</span><span className="font-bold text-right">{recipient ? recipient.name : '-'}</span></div>
                         <div className="flex justify-between"><span>Jumlah</span><span className="font-bold">{formatToRupiah(Number(amount))}</span></div>
                         <div className="flex justify-between"><span>Biaya Admin</span><span className="font-bold text-green-600 dark:text-green-400">Gratis</span></div>
                         <div className="flex justify-between font-bold text-base pt-3 mt-3 border-t"><span>Total</span><span className="text-primary dark:text-gold-light">{formatToRupiah(Number(amount))}</span></div>
                    </div>
                     <button
                        onClick={() => setConfirmModalOpen(true)}
                        disabled={isTransferDisabled}
                        className="w-full mt-6 bg-gradient-to-br from-gold-light to-gold-dark text-white font-bold py-3 rounded-lg transition-opacity hover:opacity-90 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed"
                    >
                        Lanjutkan
                    </button>
                    {Number(amount) > currentBalance && <p className="text-xs text-red-500 text-center mt-2">Saldo tidak mencukupi.</p>}
                </div>
            </div>
        </div>
    );
};

export default TransferPage;