import React, { useState, useEffect } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    BanknotesIcon as BanknotesIconSolid, 
    ChevronDownIcon as ChevronDownIconSolid, 
    ClockIcon as ClockIconSolid, 
    CheckCircleIcon as CheckCircleIconSolid, 
    ExclamationCircleIcon as ExclamationCircleIconSolid,
    ArrowPathIcon as ArrowPathIconSolid,
    XMarkIcon as XMarkIconSolid,
    UserCircleIcon as UserCircleIconSolid,
    BuildingLibraryIcon as BuildingLibraryIconSolid,
    WalletIcon as WalletIconSolid,
    DevicePhoneMobileIcon as DevicePhoneMobileIconSolid,
    BuildingStorefrontIcon as BuildingStorefrontIconSolid
} from '@heroicons/react/24/solid';
import { formatToRupiah } from '../utils/formatter.ts';
import { Transaction, TransactionStatus, TransactionType, User } from '../types.ts';
import { getTransactionsForUser } from '../services/mockData.ts';
import { defaultRetailOutlets } from './TopUpPage.tsx';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const BanknotesIcon = (BanknotesIconSolid as any).default || BanknotesIconSolid;
const ChevronDownIcon = (ChevronDownIconSolid as any).default || ChevronDownIconSolid;
const ClockIcon = (ClockIconSolid as any).default || ClockIconSolid;
const CheckCircleIcon = (CheckCircleIconSolid as any).default || CheckCircleIconSolid;
const ExclamationCircleIcon = (ExclamationCircleIconSolid as any).default || ExclamationCircleIconSolid;
const ArrowPathIcon = (ArrowPathIconSolid as any).default || ArrowPathIconSolid;
const XMarkIcon = (XMarkIconSolid as any).default || XMarkIconSolid;
const UserCircleIcon = (UserCircleIconSolid as any).default || UserCircleIconSolid;
const BuildingLibraryIcon = (BuildingLibraryIconSolid as any).default || BuildingLibraryIconSolid;
const WalletIcon = (WalletIconSolid as any).default || WalletIconSolid;
const DevicePhoneMobileIcon = (DevicePhoneMobileIconSolid as any).default || DevicePhoneMobileIconSolid;
const BuildingStorefrontIcon = (BuildingStorefrontIconSolid as any).default || BuildingStorefrontIconSolid;


interface TarikSaldoPageProps {
  setActivePage: (page: string) => void;
  onRequestWithdrawal: (type: TransactionType.WITHDRAWAL, amount: number, method: string) => void;
  currentUser: User;
  initialTab?: 'bank' | 'ewallet' | 'retail';
}

interface SavedAccount {
    id: number;
    bank: string;
    number: string;
    holder: string;
}

interface SavedEWallet {
    id: number;
    provider: string;
    number: string;
    holder: string;
}

interface RetailOutlet {
    name: string;
    logo: string;
}

const initialSavedAccounts: SavedAccount[] = [
    { id: 1, bank: 'BCA', number: '**** **** 1234', holder: 'Budi Santoso' },
    { id: 2, bank: 'Mandiri', number: '**** **** 5678', holder: 'Budi Santoso' },
];

const initialEWallets: SavedEWallet[] = [
    { id: 1, provider: 'GoPay', number: '0812****7890', holder: 'Budi Santoso' },
    { id: 2, provider: 'OVO', number: '0812****7890', holder: 'Budi Santoso' },
];

const StatusBadge: React.FC<{ status: TransactionStatus }> = ({ status }) => {
    const baseClasses = "flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full w-fit";
    if (status === TransactionStatus.COMPLETED) {
        return <div className={`${baseClasses} bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400`}><CheckCircleIcon className="w-3 h-3" /> Berhasil</div>;
    }
    if (status === TransactionStatus.PENDING) {
        return <div className={`${baseClasses} bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400`}><ArrowPathIcon className="w-3 h-3 animate-spin" /> Diproses</div>;
    }
    return <div className={`${baseClasses} bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400`}><ExclamationCircleIcon className="w-3 h-3" /> Gagal</div>;
};

const AddAccountModal: React.FC<{
    onClose: () => void;
    onSave: (account: Omit<SavedAccount, 'id'>) => void;
    currentUser: User;
}> = ({ onClose, onSave, currentUser }) => {
    const [bank, setBank] = useState('');
    const [number, setNumber] = useState('');
    const [holder, setHolder] = useState(currentUser.name);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!bank || !number || !holder) {
            alert('Harap isi semua kolom.');
            return;
        }
        onSave({ bank, number, holder });
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-2xl p-6 w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-slate-400"><XMarkIcon className="w-6 h-6" /></button>
                <h2 className="text-xl font-bold mb-4">Tambah Rekening Baru</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1">Nama Bank</label>
                        <select value={bank} onChange={e => setBank(e.target.value)} className="w-full p-2 border rounded-md" required>
                            <option value="" disabled>Pilih Bank</option>
                            <option value="BCA">BCA</option>
                            <option value="Mandiri">Bank Mandiri</option>
                            <option value="BRI">BRI</option>
                            <option value="BNI">BNI</option>
                            <option value="CIMB">CIMB Niaga</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm mb-1">Nomor Rekening</label>
                        <div className="relative">
                            <BuildingLibraryIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="number" value={number} onChange={e => setNumber(e.target.value)} className="w-full pl-10 p-2 border rounded-md" required />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm mb-1">Nama Pemilik Rekening</label>
                        <div className="relative">
                            <UserCircleIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" value={holder} onChange={e => setHolder(e.target.value)} className="w-full pl-10 p-2 border rounded-md" required />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 rounded-md text-sm font-semibold">Batal</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold">Simpan Rekening</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AddEWalletModal: React.FC<{
    onClose: () => void;
    onSave: (ewallet: Omit<SavedEWallet, 'id'>) => void;
    currentUser: User;
}> = ({ onClose, onSave, currentUser }) => {
    const [provider, setProvider] = useState('');
    const [number, setNumber] = useState('');
    const [holder, setHolder] = useState(currentUser.name);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!provider || !number || !holder) {
            alert('Harap isi semua kolom.');
            return;
        }
        onSave({ provider, number, holder });
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-2xl p-6 w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-slate-400"><XMarkIcon className="w-6 h-6" /></button>
                <h2 className="text-xl font-bold mb-4">Tambah E-Wallet Baru</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1">Penyedia E-Wallet</label>
                        <select value={provider} onChange={e => setProvider(e.target.value)} className="w-full p-2 border rounded-md" required>
                            <option value="" disabled>Pilih E-Wallet</option>
                            <option value="GoPay">GoPay</option>
                            <option value="OVO">OVO</option>
                            <option value="DANA">DANA</option>
                            <option value="ShopeePay">ShopeePay</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm mb-1">Nomor HP Terdaftar</label>
                        <div className="relative">
                            <DevicePhoneMobileIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="tel" value={number} onChange={e => setNumber(e.target.value)} className="w-full pl-10 p-2 border rounded-md" required />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm mb-1">Nama Pemilik Akun</label>
                        <div className="relative">
                            <UserCircleIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" value={holder} onChange={e => setHolder(e.target.value)} className="w-full pl-10 p-2 border rounded-md" required />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 rounded-md text-sm font-semibold">Batal</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold">Simpan E-Wallet</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ConfirmationModal: React.FC<{
    onClose: () => void;
    onConfirm: () => void;
    amount: number;
    adminFee: number;
    method: 'bank' | 'ewallet' | 'retail';
    destination: SavedAccount | SavedEWallet | RetailOutlet | undefined;
    token?: string | null;
}> = ({ onClose, onConfirm, amount, adminFee, method, destination, token }) => (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm animate-fade-in">
        <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-2xl p-6 w-full max-w-md relative">
            <button onClick={onClose} className="absolute top-3 right-3 text-slate-400"><XMarkIcon className="w-6 h-6" /></button>
            <h2 className="text-xl font-bold text-center mb-4">Konfirmasi Penarikan</h2>
            <div className="my-4 p-4 bg-slate-50 dark:bg-dark-surface/50 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between"><span>Jumlah Penarikan</span><span className="font-semibold">{formatToRupiah(amount)}</span></div>
                <div className="flex justify-between"><span>Biaya Admin</span><span className="font-semibold">{formatToRupiah(adminFee)}</span></div>
                <div className="flex justify-between font-bold text-base pt-2 border-t mt-2"><span>Total Saldo Terpotong</span><span className="text-gold-dark dark:text-gold-light">{formatToRupiah(amount + adminFee)}</span></div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-dark-surface/50 rounded-lg space-y-2 text-sm">
                <p className="font-bold">Tujuan</p>
                {method === 'bank' && destination && 'bank' in destination && <p>{destination.bank} - {destination.number} <br/>a/n {destination.holder}</p>}
                {method === 'ewallet' && destination && 'provider' in destination && <p>{destination.provider} - {destination.number} <br/>a/n {destination.holder}</p>}
                {method === 'retail' && destination && 'name' in destination && <p>Tarik tunai di <strong>{destination.name}</strong></p>}
            </div>
            {method === 'retail' && token && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/50 rounded-lg text-center">
                    <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">Tunjukkan kode ini ke kasir:</p>
                    <p className="text-3xl font-bold tracking-widest text-blue-600 dark:text-blue-400 my-2">{token}</p>
                </div>
            )}
            <button onClick={onConfirm} className="w-full mt-6 bg-gradient-to-br from-gold-light to-gold-dark text-white font-bold py-3 px-4 rounded-lg">
                {method === 'retail' && !token ? 'Dapatkan Kode Penarikan' : 'Ajukan Penarikan Dana'}
            </button>
        </div>
    </div>
);


const TarikSaldoPage: React.FC<TarikSaldoPageProps> = ({ setActivePage, onRequestWithdrawal, currentUser, initialTab }) => {
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState<'bank' | 'ewallet' | 'retail'>(initialTab || 'bank');
    const [selectedAccountId, setSelectedAccountId] = useState<string>('');
    const [selectedEWalletId, setSelectedEWalletId] = useState<string>('');
    const [selectedRetailId, setSelectedRetailId] = useState<string>('');
    const [withdrawalHistory, setWithdrawalHistory] = useState<Transaction[]>([]);
    const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>(initialSavedAccounts);
    const [savedEWallets, setSavedEWallets] = useState<SavedEWallet[]>(initialEWallets);
    const [savedRetailOutlets] = useState<RetailOutlet[]>(defaultRetailOutlets);
    const [isAddAccountModalOpen, setAddAccountModalOpen] = useState(false);
    const [isAddEWalletModalOpen, setAddEWalletModalOpen] = useState(false);
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    const adminFee = 2500;
    const totalWithdrawal = Number(amount) > 0 ? Number(amount) + adminFee : 0;
    const amountReceived = Number(amount);

    useEffect(() => {
        const fetchHistory = async () => {
            const allTx = await getTransactionsForUser(currentUser.id);
            setWithdrawalHistory(allTx.filter(tx => tx.type === TransactionType.WITHDRAWAL));
        };
        fetchHistory();
    }, [currentUser.id]);

    const handleOpenConfirmModal = () => {
        if (isSubmitDisabled) return;
        if (method === 'retail') {
            // Generate token only when confirming in the modal for the first time
            if (!token) {
                 setToken(`TK${Math.floor(100000 + Math.random() * 900000)}`);
            }
        } else {
            setToken(null);
        }
        setConfirmModalOpen(true);
    };

    const handleConfirm = () => {
        let withdrawalMethod = '';
        if (method === 'bank') {
            const account = savedAccounts.find(acc => acc.id === Number(selectedAccountId));
            withdrawalMethod = `Ke ${account?.bank} (${account?.number})`;
        } else if (method === 'ewallet') {
            const ewallet = savedEWallets.find(ew => ew.id === Number(selectedEWalletId));
            withdrawalMethod = `Ke ${ewallet?.provider} (${ewallet?.number})`;
        } else { // retail
            const outlet = savedRetailOutlets.find(r => r.name === selectedRetailId);
            withdrawalMethod = `Tarik Tunai di ${outlet?.name} (Kode: ${token})`;
        }
        onRequestWithdrawal(TransactionType.WITHDRAWAL, Number(amount), withdrawalMethod);
        setConfirmModalOpen(false);
        setAmount('');
        setToken(null);
    };

    const handleAccountSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === 'new') {
            setAddAccountModalOpen(true);
            setSelectedAccountId('');
        } else {
            setSelectedAccountId(e.target.value);
        }
    };
    
    const handleEWalletSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === 'new') {
            setAddEWalletModalOpen(true);
            setSelectedEWalletId('');
        } else {
            setSelectedEWalletId(e.target.value);
        }
    };
    
    const handleSaveNewAccount = (account: Omit<SavedAccount, 'id'>) => {
        const newAccount = { id: Date.now(), ...account };
        setSavedAccounts(prev => [...prev, newAccount]);
        setSelectedAccountId(String(newAccount.id));
        setAddAccountModalOpen(false);
    };

    const handleSaveNewEWallet = (ewallet: Omit<SavedEWallet, 'id'>) => {
        const newEWallet = { id: Date.now(), ...ewallet };
        setSavedEWallets(prev => [...prev, newEWallet]);
        setSelectedEWalletId(String(newEWallet.id));
        setAddEWalletModalOpen(false);
    };

    const quickAmounts = [50000, 100000, 250000, 500000];

    const isSubmitDisabled = !amount || Number(amount) <= 0 || (method === 'bank' ? !selectedAccountId : method === 'ewallet' ? !selectedEWalletId : !selectedRetailId);

    const getDestination = () => {
        if (method === 'bank') return savedAccounts.find(a => a.id === Number(selectedAccountId));
        if (method === 'ewallet') return savedEWallets.find(e => e.id === Number(selectedEWalletId));
        if (method === 'retail') return savedRetailOutlets.find(r => r.name === selectedRetailId);
        return undefined;
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            {isAddAccountModalOpen && (
                <AddAccountModal
                    onClose={() => setAddAccountModalOpen(false)}
                    onSave={handleSaveNewAccount}
                    currentUser={currentUser}
                />
            )}
            {isAddEWalletModalOpen && (
                <AddEWalletModal
                    onClose={() => setAddEWalletModalOpen(false)}
                    onSave={handleSaveNewEWallet}
                    currentUser={currentUser}
                />
            )}
            {isConfirmModalOpen && (
                <ConfirmationModal
                    onClose={() => { setConfirmModalOpen(false); setToken(null); }}
                    onConfirm={handleConfirm}
                    amount={Number(amount)}
                    adminFee={adminFee}
                    method={method}
                    destination={getDestination()}
                    token={token}
                />
            )}
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
                    <BanknotesIcon className="w-8 h-8 text-red-500" />
                    <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">
                        Tarik Saldo
                    </h1>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Withdrawal Form */}
                <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6 space-y-4">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
                            Jumlah Penarikan (Rp)
                        </label>
                        <div className="relative">
                            <BanknotesIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-dark-text-secondary" />
                            <input
                                type="number"
                                id="amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0"
                                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-gold-DEFAULT focus:outline-none bg-white dark:bg-slate-800 dark:border-slate-600 font-semibold text-lg"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {quickAmounts.map(qa => (
                            <button
                                key={qa}
                                onClick={() => setAmount(String(qa))}
                                className="px-2 py-1.5 border border-slate-300 dark:border-slate-600 rounded-md text-sm font-semibold text-text-secondary dark:text-dark-text-secondary hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                {qa / 1000}rb
                            </button>
                        ))}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-2">Tujuan Penarikan</label>
                        <div className="grid grid-cols-3 gap-2 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                            <button onClick={() => setMethod('bank')} className={`flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-md transition-colors ${method === 'bank' ? 'bg-primary text-white shadow' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`}><BuildingLibraryIcon className="w-5 h-5"/> Bank</button>
                            <button onClick={() => setMethod('ewallet')} className={`flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-md transition-colors ${method === 'ewallet' ? 'bg-primary text-white shadow' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`}><WalletIcon className="w-5 h-5"/> E-Wallet</button>
                            <button onClick={() => setMethod('retail')} className={`flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-md transition-colors ${method === 'retail' ? 'bg-primary text-white shadow' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`}><BuildingStorefrontIcon className="w-5 h-5"/> Gerai</button>
                        </div>
                    </div>

                    {method === 'bank' && (
                        <div className="relative animate-fade-in">
                            <select 
                                value={selectedAccountId}
                                onChange={handleAccountSelectionChange}
                                className="w-full pl-4 pr-8 py-2.5 border rounded-md focus:ring-2 focus:ring-gold-DEFAULT focus:outline-none bg-white dark:bg-slate-800 dark:border-slate-600 appearance-none font-medium"
                            >
                                <option value="" disabled>Pilih Rekening Tujuan</option>
                                {savedAccounts.map(acc => (
                                    <option key={acc.id} value={acc.id}>{acc.bank} - {acc.number}</option>
                                ))}
                                <option value="new">Tambah Rekening Baru...</option>
                            </select>
                            <ChevronDownIcon className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-dark-text-secondary pointer-events-none"/>
                        </div>
                    )}
                    
                    {method === 'ewallet' && (
                         <div className="relative animate-fade-in">
                            <select 
                                value={selectedEWalletId}
                                onChange={handleEWalletSelectionChange}
                                className="w-full pl-4 pr-8 py-2.5 border rounded-md focus:ring-2 focus:ring-gold-DEFAULT focus:outline-none bg-white dark:bg-slate-800 dark:border-slate-600 appearance-none font-medium"
                            >
                                <option value="" disabled>Pilih E-Wallet Tujuan</option>
                                {savedEWallets.map(ew => (
                                    <option key={ew.id} value={ew.id}>{ew.provider} - {ew.number}</option>
                                ))}
                                <option value="new">Tambah E-Wallet Baru...</option>
                            </select>
                            <ChevronDownIcon className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-dark-text-secondary pointer-events-none"/>
                        </div>
                    )}

                    {method === 'retail' && (
                         <div className="relative animate-fade-in">
                            <select 
                                value={selectedRetailId}
                                onChange={e => setSelectedRetailId(e.target.value)}
                                className="w-full pl-4 pr-8 py-2.5 border rounded-md focus:ring-2 focus:ring-gold-DEFAULT focus:outline-none bg-white dark:bg-slate-800 dark:border-slate-600 appearance-none font-medium"
                            >
                                <option value="" disabled>Pilih Gerai Penarikan</option>
                                {savedRetailOutlets.map(r => (
                                    <option key={r.name} value={r.name}>{r.name}</option>
                                ))}
                            </select>
                            <ChevronDownIcon className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-dark-text-secondary pointer-events-none"/>
                        </div>
                    )}

                    {Number(amount) > 0 && (
                        <div className="p-4 bg-slate-50 dark:bg-dark-surface/50 rounded-lg space-y-2 text-sm animate-fade-in">
                            <h4 className="font-bold mb-2 text-text-primary dark:text-dark-text-primary">Rincian Penarikan</h4>
                            <div className="flex justify-between">
                                <span className="text-text-secondary dark:text-dark-text-secondary">Jumlah Penarikan</span>
                                <span className="font-semibold text-text-primary dark:text-dark-text-primary">{formatToRupiah(amountReceived)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-secondary dark:text-dark-text-secondary">Biaya Admin</span>
                                <span className="font-semibold text-text-primary dark:text-dark-text-primary">{formatToRupiah(adminFee)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-base pt-2 border-t border-slate-200 dark:border-slate-700 mt-2">
                                <span className="text-text-primary dark:text-dark-text-primary">Total Saldo Terpotong</span>
                                <span className="text-gold-dark dark:text-gold-light">{formatToRupiah(totalWithdrawal)}</span>
                            </div>
                        </div>
                    )}
                    
                    <button
                        onClick={handleOpenConfirmModal}
                        disabled={isSubmitDisabled}
                        className="w-full mt-2 bg-gradient-to-br from-gold-light to-gold-dark text-white font-bold py-3 px-4 rounded-lg transition-opacity hover:opacity-90 disabled:from-slate-300 disabled:to-slate-400 disabled:text-slate-500 disabled:cursor-not-allowed"
                    >
                        Lanjutkan
                    </button>
                </div>
                
                {/* Withdrawal History */}
                <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-4 flex items-center gap-2">
                        <ClockIcon className="w-6 h-6 text-text-secondary dark:text-dark-text-secondary" />
                        Riwayat & Status Penarikan
                    </h3>
                    <ul className="divide-y divide-slate-200 dark:divide-slate-700 max-h-96 overflow-y-auto pr-2">
                        {withdrawalHistory.map(item => (
                            <li key={item.id} className="py-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-text-primary dark:text-dark-text-primary">{formatToRupiah(item.amount)}</p>
                                        <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{item.description || item.method || `Ke ${item.userName}`}</p>
                                    </div>
                                    <StatusBadge status={item.status} />
                                </div>
                                <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1 text-right">
                                    {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TarikSaldoPage;