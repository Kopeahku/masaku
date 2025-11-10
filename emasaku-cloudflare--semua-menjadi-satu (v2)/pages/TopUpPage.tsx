import React, { useState, useMemo } from 'react';
import type { ElementType } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    ArrowUpCircleIcon as ArrowUpCircleIconSolid, 
    BanknotesIcon as BanknotesIconSolid, 
    BuildingStorefrontIcon as BuildingStorefrontIconSolid, 
    WalletIcon as WalletIconSolid,
    CheckCircleIcon as CheckCircleIconSolid,
    ExclamationCircleIcon as ExclamationCircleIconSolid,
    ClockIcon as ClockIconSolid,
    ShieldCheckIcon as ShieldCheckIconSolid,
    XMarkIcon as XMarkIconSolid,
    MagnifyingGlassIcon as MagnifyingGlassIconSolid,
    Cog6ToothIcon as Cog6ToothIconSolid,
    TrashIcon as TrashIconSolid,
    PlusCircleIcon as PlusCircleIconSolid,
    ArrowPathIcon as ArrowPathIconSolid
} from '@heroicons/react/24/solid';
import { TransactionType, Transaction, User, TransactionStatus, UserRole, PaymentMethod } from '../types.ts';
import { formatToRupiah, formatDate } from '../utils/formatter.ts';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const ArrowUpCircleIcon = (ArrowUpCircleIconSolid as any).default || ArrowUpCircleIconSolid;
const BanknotesIcon = (BanknotesIconSolid as any).default || BanknotesIconSolid;
const BuildingStorefrontIcon = (BuildingStorefrontIconSolid as any).default || BuildingStorefrontIconSolid;
const WalletIcon = (WalletIconSolid as any).default || WalletIconSolid;
const CheckCircleIcon = (CheckCircleIconSolid as any).default || CheckCircleIconSolid;
const ExclamationCircleIcon = (ExclamationCircleIconSolid as any).default || ExclamationCircleIconSolid;
const ClockIcon = (ClockIconSolid as any).default || ClockIconSolid;
const ShieldCheckIcon = (ShieldCheckIconSolid as any).default || ShieldCheckIconSolid;
const XMarkIcon = (XMarkIconSolid as any).default || XMarkIconSolid;
const MagnifyingGlassIcon = (MagnifyingGlassIconSolid as any).default || MagnifyingGlassIconSolid;
const Cog6ToothIcon = (Cog6ToothIconSolid as any).default || Cog6ToothIconSolid;
const TrashIcon = (TrashIconSolid as any).default || TrashIconSolid;
const PlusCircleIcon = (PlusCircleIconSolid as any).default || PlusCircleIconSolid;
const ArrowPathIcon = (ArrowPathIconSolid as any).default || ArrowPathIconSolid;


interface TopUpPageProps {
  setActivePage: (page: string) => void;
  onRequestTopUp: (type: TransactionType.TOP_UP, amount: number, method: string) => void;
  currentUser: User;
  transactions: Transaction[];
  vaBanks: PaymentMethod[];
  setVaBanks: React.Dispatch<React.SetStateAction<PaymentMethod[]>>;
  eWallets: PaymentMethod[];
  setEWallets: React.Dispatch<React.SetStateAction<PaymentMethod[]>>;
  retailOutlets: PaymentMethod[];
  setRetailOutlets: React.Dispatch<React.SetStateAction<PaymentMethod[]>>;
  onPartnerRegistrationRequest: (formData: any, user: User) => void;
}


export const defaultVaBanks: PaymentMethod[] = [
    { name: 'BCA', logo: 'https://logo.clearbit.com/bca.co.id', accountNumber: '1234567890' },
    { name: 'Mandiri', logo: 'https://logo.clearbit.com/bankmandiri.co.id', accountNumber: '0987654321' },
    { name: 'BRI', logo: 'https://logo.clearbit.com/bri.co.id', accountNumber: '1122334455' },
    { name: 'BNI', logo: 'https://logo.clearbit.com/bni.co.id', accountNumber: '5544332211' },
];

export const defaultEWallets: PaymentMethod[] = [
    { name: 'GoPay', logo: 'https://logo.clearbit.com/go-pay.co.id', accountNumber: '081234567890' },
    { name: 'OVO', logo: 'https://logo.clearbit.com/ovo.id', accountNumber: '081234567891' },
    { name: 'DANA', logo: 'https://logo.clearbit.com/dana.id', accountNumber: '081234567892' },
];

export const defaultRetailOutlets: PaymentMethod[] = [
    { name: 'Indomaret', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Logo_Indomaret.png', accountNumber: '' },
    { name: 'Alfamart', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/ALFAMART_LOGO_BARU.png/600px-ALFAMART_LOGO_BARU.png', accountNumber: '' },
];


const StatusBadge: React.FC<{ status: TransactionStatus }> = ({ status }) => {
    const baseClasses = "flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full w-fit";
    if (status === TransactionStatus.COMPLETED) {
        return <div className={`${baseClasses} bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400`}><CheckCircleIcon className="w-3 h-3" /> Berhasil</div>;
    }
    if (status === TransactionStatus.PENDING) {
        return <div className={`${baseClasses} bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400`}><ClockIcon className="w-3 h-3" /> Diproses</div>;
    }
    return <div className={`${baseClasses} bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400`}><ExclamationCircleIcon className="w-3 h-3" /> Gagal</div>;
};

const RetailRegistrationModal: React.FC<{
    onClose: () => void;
    onRegister: (formData: any) => void;
    currentUser: User;
}> = ({ onClose, onRegister, currentUser }) => {
    const [formData, setFormData] = useState({
        businessName: '',
        ownerName: currentUser.name,
        address: '',
        phone: currentUser.whatsapp || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onRegister(formData);
    };

    return (
         <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-2xl p-6 w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-slate-400"><XMarkIcon className="w-6 h-6" /></button>
                <div className="text-center">
                    <BuildingStorefrontIcon className="w-12 h-12 text-primary dark:text-gold-light mx-auto mb-3" />
                    <h2 className="text-xl font-bold">Daftar Jadi Gerai Retail</h2>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-1">Daftarkan usaha Anda untuk menjadi titik pembayaran EmaSaku.</p>
                </div>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <input type="text" name="businessName" placeholder="Nama Usaha / Toko" value={formData.businessName} onChange={handleChange} className="w-full p-2 border rounded-md" required />
                    <input type="text" name="ownerName" placeholder="Nama Pemilik" value={formData.ownerName} onChange={handleChange} className="w-full p-2 border rounded-md" required />
                    <textarea name="address" placeholder="Alamat Lengkap Usaha" value={formData.address} onChange={handleChange} className="w-full p-2 border rounded-md" rows={3} required></textarea>
                    <input type="tel" name="phone" placeholder="Nomor Telepon / WA" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded-md" required />
                    <button type="submit" className="w-full bg-gradient-to-br from-gold-light to-gold-dark text-white font-bold py-3 px-4 rounded-lg">Kirim Pendaftaran</button>
                </form>
            </div>
        </div>
    );
};

const EditMethodsModal: React.FC<{
    onClose: () => void;
    onSave: (newVaBanks: PaymentMethod[], newEWallets: PaymentMethod[], newRetailOutlets: PaymentMethod[]) => void;
    initialVaBanks: PaymentMethod[];
    initialEWallets: PaymentMethod[];
    initialRetail: PaymentMethod[];
}> = ({ onClose, onSave, initialVaBanks, initialEWallets, initialRetail }) => {
    const [editableVaBanks, setEditableVaBanks] = useState([...initialVaBanks]);
    const [editableEWallets, setEditableEWallets] = useState([...initialEWallets]);
    const [editableRetail, setEditableRetail] = useState([...initialRetail]);

    const handleUpdate = (type: 'va' | 'ewallet' | 'retail', index: number, field: 'name' | 'accountNumber', value: string) => {
        const setters = {
            va: setEditableVaBanks,
            ewallet: setEditableEWallets,
            retail: setEditableRetail,
        };
        const states = {
            va: editableVaBanks,
            ewallet: editableEWallets,
            retail: editableRetail,
        };
        
        const newItems = [...states[type]];
        newItems[index] = { ...newItems[index], [field]: value };
        setters[type](newItems as any);
    };
    
    const handleImageUpload = (type: 'va' | 'ewallet' | 'retail', index: number, file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
             const setters = { va: setEditableVaBanks, ewallet: setEditableEWallets, retail: setEditableRetail };
             const states = { va: editableVaBanks, ewallet: editableEWallets, retail: editableRetail };
             
             const newItems = [...states[type]];
             newItems[index].logo = base64String;
             setters[type](newItems as any);
        };
        reader.readAsDataURL(file);
    };
    
    const handleAdd = (type: 'va' | 'ewallet' | 'retail') => {
         const setters = { va: setEditableVaBanks, ewallet: setEditableEWallets, retail: setEditableRetail };
         const states = { va: editableVaBanks, ewallet: editableEWallets, retail: editableRetail };
         setters[type]([...states[type], { name: '', logo: '', accountNumber: '' }] as any);
    }
    
    const handleDelete = (type: 'va' | 'ewallet' | 'retail', index: number) => {
         const setters = { va: setEditableVaBanks, ewallet: setEditableEWallets, retail: setEditableRetail };
         const states = { va: editableVaBanks, ewallet: editableEWallets, retail: editableRetail };
         setters[type](states[type].filter((_, i) => i !== index) as any);
    }

    const handleReset = () => {
        if (window.confirm('Anda yakin ingin mengembalikan metode pembayaran ke pengaturan default?')) {
            setEditableVaBanks(defaultVaBanks);
            setEditableEWallets(defaultEWallets);
            setEditableRetail(defaultRetailOutlets);
        }
    }

    const renderEditorSection = (title: string, methods: PaymentMethod[], type: 'va' | 'ewallet' | 'retail') => (
        <div>
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            <div className="space-y-2">
                {methods.map((method, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2 border rounded-md items-center">
                        <input type="text" placeholder="Nama" value={method.name} onChange={(e) => handleUpdate(type, index, 'name', e.target.value)} className="w-full p-2 border rounded-md" />
                        <input type="text" placeholder="No. Rekening/VA" value={method.accountNumber} onChange={(e) => handleUpdate(type, index, 'accountNumber', e.target.value)} className="w-full p-2 border rounded-md" disabled={type === 'retail'}/>
                        <div className="flex items-center gap-2">
                            <label htmlFor={`logo-upload-${type}-${index}`} className="flex-grow text-center cursor-pointer p-2 border rounded-md text-sm bg-slate-100 hover:bg-slate-200">
                                Pilih Logo
                            </label>
                            <input id={`logo-upload-${type}-${index}`} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && handleImageUpload(type, index, e.target.files[0])}/>
                            {method.logo && <img src={method.logo} alt="logo" className="w-8 h-8 object-contain"/>}
                            <button onClick={() => handleDelete(type, index)} className="p-2 text-red-500"><TrashIcon className="w-5 h-5"/></button>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={() => handleAdd(type)} className="mt-2 text-sm font-semibold text-primary flex items-center gap-1"><PlusCircleIcon className="w-5 h-5"/> Tambah Metode Baru</button>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-2xl p-6 w-full max-w-3xl relative flex flex-col max-h-[90vh]">
                <button onClick={onClose} className="absolute top-3 right-3 text-slate-400"><XMarkIcon className="w-6 h-6" /></button>
                <h2 className="text-xl font-bold mb-4">Ubah Metode Pembayaran</h2>
                <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                    {renderEditorSection('Virtual Account Bank', editableVaBanks, 'va')}
                    {renderEditorSection('E-Wallet', editableEWallets, 'ewallet')}
                    {renderEditorSection('Gerai Retail', editableRetail, 'retail')}
                </div>
                <div className="flex-shrink-0 flex justify-between items-center pt-4 mt-4 border-t">
                    <button onClick={handleReset} className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-800"><ArrowPathIcon className="w-5 h-5"/> Reset ke Default</button>
                    <div className="flex gap-2">
                        <button onClick={onClose} className="px-4 py-2 bg-slate-200 rounded-md">Batal</button>
                        <button onClick={() => onSave(editableVaBanks, editableEWallets, editableRetail)} className="px-4 py-2 bg-primary text-white rounded-md">Simpan</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface ConfirmationModalProps {
    onClose: () => void;
    onConfirm: () => void;
    amount: string;
    category: 'Virtual Account Bank' | 'Gerai Retail' | 'E-Wallet' | null;
    method: string | null;
    allMethods: PaymentMethod[];
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    onClose,
    onConfirm,
    amount,
    category,
    method,
    allMethods
}) => {
    const totalPayment = Number(amount) + 1000; // Mock admin fee
    const selectedMethodDetails = allMethods.find(m => m.name === method);
    const isRetailPayment = category === 'Gerai Retail';
    const paymentCode = `EMSK${Math.floor(100000 + Math.random() * 900000)}`;

    return (
         <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-2xl p-6 w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-slate-400"><XMarkIcon className="w-6 h-6" /></button>
                <div className="text-center">
                    <ShieldCheckIcon className="w-12 h-12 text-primary dark:text-gold-light mx-auto mb-3" />
                    <h2 className="text-xl font-bold">Selesaikan Pembayaran</h2>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-1">Lakukan pembayaran untuk mengajukan permintaan Top Up.</p>
                </div>

                <div className="my-6 p-4 bg-slate-50 dark:bg-dark-surface/50 rounded-lg text-center">
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Total Pembayaran</p>
                    <p className="text-4xl font-bold text-gold-dark dark:text-gold-light tracking-tight">{formatToRupiah(totalPayment)}</p>
                </div>
                
                <div>
                    <h3 className="font-bold text-lg mb-3">Instruksi</h3>
                    {isRetailPayment ? (
                        <ol className="space-y-4 text-sm text-text-secondary dark:text-dark-text-secondary">
                            <li className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-primary text-white font-bold rounded-full flex items-center justify-center text-xs">1</div>
                                <p>Pergi ke gerai <strong className="text-text-primary dark:text-dark-text-primary">{method}</strong> terdekat.</p>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-primary text-white font-bold rounded-full flex items-center justify-center text-xs">2</div>
                                <p>Sampaikan kepada kasir ingin melakukan pembayaran untuk <strong className="text-text-primary dark:text-dark-text-primary">EmaSaku</strong>.</p>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-primary text-white font-bold rounded-full flex items-center justify-center text-xs">3</div>
                                <p>Berikan kode pembayaran berikut kepada kasir: <br/> <strong className="text-lg text-text-primary dark:text-dark-text-primary tracking-widest">{paymentCode}</strong></p>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-primary text-white font-bold rounded-full flex items-center justify-center text-xs">4</div>
                                <p>Setelah berhasil, klik tombol "Konfirmasi Top Up" di bawah ini.</p>
                            </li>
                        </ol>
                    ) : (
                        <ol className="space-y-4 text-sm text-text-secondary dark:text-dark-text-secondary">
                            <li className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-primary text-white font-bold rounded-full flex items-center justify-center text-xs">1</div>
                                <p>Lakukan transfer ke <span className="font-semibold text-text-primary dark:text-dark-text-primary">{selectedMethodDetails?.name}</span> di nomor rekening/VA: <br/> <strong className="text-lg text-text-primary dark:text-dark-text-primary">{selectedMethodDetails?.accountNumber}</strong></p>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-primary text-white font-bold rounded-full flex items-center justify-center text-xs">2</div>
                                <p>Setelah berhasil, klik tombol <span className="font-semibold text-text-primary dark:text-dark-text-primary">"Konfirmasi Top Up"</span> di bawah ini.</p>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-primary text-white font-bold rounded-full flex items-center justify-center text-xs">3</div>
                                <p>Admin akan memverifikasi pembayaran Anda. Mohon tunggu notifikasi selanjutnya.</p>
                            </li>
                        </ol>
                    )}
                </div>

                <button onClick={onConfirm} className="w-full mt-6 bg-gradient-to-br from-gold-light to-gold-dark text-white font-bold py-3 px-4 rounded-lg">
                    Konfirmasi Top Up
                </button>
            </div>
        </div>
    );
};

const TopUpPage: React.FC<TopUpPageProps> = ({ 
    setActivePage, 
    onRequestTopUp, 
    currentUser, 
    transactions,
    vaBanks,
    setVaBanks,
    eWallets,
    setEWallets,
    retailOutlets,
    setRetailOutlets,
    onPartnerRegistrationRequest
}) => {
    const [amount, setAmount] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<'Virtual Account Bank' | 'Gerai Retail' | 'E-Wallet' | null>(null);
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isRetailRegistrationModalOpen, setRetailRegistrationModalOpen] = useState(false);
    const [isRegistrationSubmitted, setIsRegistrationSubmitted] = useState(false);

    const topUpHistory = useMemo(() => {
        const history = transactions
            .filter(tx => tx.userId === currentUser.id && tx.type === TransactionType.TOP_UP);

        if (!searchTerm.trim()) {
            return history;
        }

        const lowercasedTerm = searchTerm.toLowerCase();
        return history.filter(tx =>
            tx.amount.toString().includes(lowercasedTerm) ||
            (tx.method && tx.method.toLowerCase().includes(lowercasedTerm)) ||
            tx.status.toLowerCase().includes(lowercasedTerm)
        );
    }, [transactions, currentUser.id, searchTerm]);

    const handleCategorySelect = (category: 'Virtual Account Bank' | 'Gerai Retail' | 'E-Wallet') => {
        setSelectedCategory(category);
        setSelectedMethod(null);
    };

    const handleSubMethodSelect = (method: string) => {
        setSelectedMethod(method);
    };

    const handleOpenConfirmModal = () => {
        setIsConfirmModalOpen(true);
    };

    const handleFinalConfirm = () => {
        onRequestTopUp(TransactionType.TOP_UP, Number(amount), selectedMethod!);
        setIsConfirmModalOpen(false);
        // Reset form after submission
        setAmount('');
        setSelectedCategory(null);
        setSelectedMethod(null);
    };
    
    const handleSaveMethods = (newVaBanks: PaymentMethod[], newEWallets: PaymentMethod[], newRetailOutlets: PaymentMethod[]) => {
        setVaBanks(newVaBanks);
        setEWallets(newEWallets);
        setRetailOutlets(newRetailOutlets);
        setEditModalOpen(false);
    };
    
    const handleSubmitRegistration = (formData: any) => {
        onPartnerRegistrationRequest(formData, currentUser);
        setRetailRegistrationModalOpen(false);
        setIsRegistrationSubmitted(true);
    };

    const quickAmounts = [50000, 100000, 250000, 500000];
    
    const paymentCategories = [
        { name: 'Virtual Account Bank', icon: BanknotesIcon, key: 'Virtual Account Bank' as const },
        { name: 'Gerai Retail', icon: BuildingStorefrontIcon, key: 'Gerai Retail' as const },
        { name: 'E-Wallet', icon: WalletIcon, key: 'E-Wallet' as const },
    ];
    
    const canEdit = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.DEVELOPER;
    
    return (
        <div className="max-w-2xl mx-auto animate-fade-in space-y-4">
            {isConfirmModalOpen && <ConfirmationModal 
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleFinalConfirm}
                amount={amount}
                category={selectedCategory}
                method={selectedMethod}
                allMethods={[...vaBanks, ...eWallets, ...retailOutlets]}
            />}
            {isEditModalOpen && (
                <EditMethodsModal 
                    onClose={() => setEditModalOpen(false)}
                    onSave={handleSaveMethods}
                    initialVaBanks={vaBanks}
                    initialEWallets={eWallets}
                    initialRetail={retailOutlets}
                />
            )}
            {isRetailRegistrationModalOpen && (
                <RetailRegistrationModal
                    onClose={() => setRetailRegistrationModalOpen(false)}
                    onRegister={handleSubmitRegistration}
                    currentUser={currentUser}
                />
            )}
            {isRegistrationSubmitted && (
                <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-2xl p-6 w-full max-w-sm relative text-center">
                        <CheckCircleIcon className="w-16 h-16 mx-auto text-green-500 mb-4" />
                        <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">Pendaftaran Terkirim!</h2>
                        <p className="text-text-secondary dark:text-dark-text-secondary mt-2">
                            Terima kasih! Permintaan Anda untuk menjadi mitra gerai retail telah berhasil dikirim.
                        </p>
                        <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-1">
                            Tim kami akan meninjau pengajuan Anda. Anda akan menerima notifikasi setelah pendaftaran disetujui.
                        </p>
                        <button
                            onClick={() => setIsRegistrationSubmitted(false)}
                            className="w-full mt-6 bg-gradient-to-br from-gold-light to-gold-dark text-white font-bold py-2 px-6 rounded-lg transition-colors"
                        >
                            Baik, Mengerti
                        </button>
                    </div>
                </div>
            )}
            {/* Header */}
            <div className="flex items-center">
                <button
                    onClick={() => setActivePage('Dashboard')}
                    className="p-2 -m-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-4"
                    aria-label="Kembali ke Dasbor"
                >
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-2">
                    <ArrowUpCircleIcon className="w-8 h-8 text-green-500" />
                    <h1 className="text-2xl font-bold">Isi Saldo</h1>
                </div>
            </div>

            {/* Amount Card */}
            <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6">
                <label className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Jumlah Top Up</label>
                <div className="flex items-center mt-1">
                    <span className="text-3xl font-bold text-text-primary dark:text-dark-text-primary">Rp</span>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0"
                        className="w-full bg-transparent text-3xl font-bold text-text-primary dark:text-dark-text-primary border-none focus:ring-0"
                    />
                </div>
                <div className="grid grid-cols-4 gap-2 mt-4">
                    {quickAmounts.map(qa => (
                        <button
                            key={qa}
                            onClick={() => setAmount(String(qa))}
                            className={`px-2 py-1.5 border rounded-md text-sm font-semibold transition-colors ${Number(amount) === qa ? 'bg-primary/10 text-primary border-primary' : 'border-slate-300 dark:border-slate-600 text-text-secondary dark:text-dark-text-secondary hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                        >
                           {formatToRupiah(qa)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold">Pilih Metode Pembayaran</h3>
                    {canEdit && <button onClick={() => setEditModalOpen(true)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><Cog6ToothIcon className="w-5 h-5"/></button>}
                </div>
                <div className="space-y-3">
                    {paymentCategories.map(cat => {
                        const Icon = (cat.icon as any).default || cat.icon;
                        return (
                            <div key={cat.key}>
                                <button
                                    onClick={() => handleCategorySelect(cat.key)}
                                    className={`w-full flex items-center gap-3 p-4 border-2 rounded-lg text-left transition-all ${selectedCategory === cat.key ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'}`}
                                >
                                    <Icon className="w-6 h-6 text-primary dark:text-gold-light" />
                                    <span className="font-semibold">{cat.name}</span>
                                </button>
                                {selectedCategory === 'Virtual Account Bank' && cat.key === 'Virtual Account Bank' && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 mt-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg animate-fade-in">
                                        {vaBanks.map(bank => (
                                            <button
                                                key={bank.name}
                                                onClick={() => handleSubMethodSelect(bank.name)}
                                                className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg transition-colors ${selectedMethod === bank.name ? 'border-primary bg-primary/10' : 'border-transparent bg-white dark:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500'}`}
                                            >
                                                <img src={bank.logo} alt={`${bank.name} logo`} className="h-8 object-contain" />
                                                <span className="text-xs font-semibold mt-2 text-text-secondary dark:text-dark-text-secondary">{bank.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                                 {selectedCategory === 'Gerai Retail' && cat.key === 'Gerai Retail' && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4 mt-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg animate-fade-in">
                                        {retailOutlets.map(outlet => (
                                            <button
                                                key={outlet.name}
                                                onClick={() => handleSubMethodSelect(outlet.name)}
                                                className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg transition-colors h-24 ${selectedMethod === outlet.name ? 'border-primary bg-primary/10' : 'border-transparent bg-white dark:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500'}`}
                                            >
                                                <img src={outlet.logo} alt={`${outlet.name} logo`} className="h-8 object-contain" />
                                                <span className="text-xs font-semibold mt-2 text-text-secondary dark:text-dark-text-secondary">{outlet.name}</span>
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setRetailRegistrationModalOpen(true)}
                                            className="flex flex-col items-center justify-center p-3 border-2 border-dashed rounded-lg transition-colors h-24 border-slate-300 dark:border-slate-600 hover:border-primary hover:bg-primary/5 text-slate-500 dark:text-slate-400"
                                        >
                                            <PlusCircleIcon className="h-8 w-8" />
                                            <span className="text-xs font-semibold mt-2 text-center">Daftar Jadi Gerai</span>
                                        </button>
                                    </div>
                                )}
                                {selectedCategory === 'E-Wallet' && cat.key === 'E-Wallet' && (
                                    <div className="grid grid-cols-3 gap-2 p-4 mt-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg animate-fade-in">
                                        {eWallets.map(wallet => (
                                            <button
                                                key={wallet.name}
                                                onClick={() => handleSubMethodSelect(wallet.name)}
                                                className={`flex items-center justify-center p-3 border-2 rounded-lg transition-colors h-16 ${selectedMethod === wallet.name ? 'border-primary bg-primary/10' : 'border-transparent bg-white dark:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500'}`}
                                            >
                                                <img src={wallet.logo} alt={`${wallet.name} logo`} className="h-6 w-auto object-contain" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            
            <button
                onClick={handleOpenConfirmModal}
                disabled={!amount || Number(amount) < 10000 || !selectedMethod}
                className="w-full bg-gradient-to-br from-gold-light to-gold-dark text-white font-bold py-3 px-4 rounded-lg transition-opacity hover:opacity-90 disabled:from-slate-300 disabled:to-slate-400 disabled:text-slate-500 disabled:cursor-not-allowed"
            >
                Top Up Sekarang
            </button>


            {/* History Card */}
            <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <ClockIcon className="w-5 h-5 text-text-secondary dark:text-dark-text-secondary" />
                    Riwayat & Status Top Up
                </h3>
                 <div className="relative mb-4">
                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari riwayat (cth: 100000, GoPay, berhasil)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-background dark:bg-dark-background focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                    />
                </div>
                {transactions.filter(tx => tx.userId === currentUser.id && tx.type === TransactionType.TOP_UP).length > 0 ? (
                    <ul className="divide-y divide-slate-200 dark:divide-slate-700 max-h-60 overflow-y-auto pr-2">
                        {topUpHistory.map(item => (
                            <li key={item.id} className="py-3 flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-text-primary dark:text-dark-text-primary">{formatToRupiah(item.amount)}</p>
                                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{item.method}</p>
                                    <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1">{formatDate(item.date)}</p>
                                </div>
                                <StatusBadge status={item.status} />
                            </li>
                        ))}
                    </ul>
                ) : (
                     <p className="text-center text-sm text-text-secondary dark:text-dark-text-secondary py-4">
                        {searchTerm ? 'Tidak ada hasil ditemukan.' : 'Belum ada riwayat top up.'}
                    </p>
                )}
            </div>
        </div>
    );
};

export default TopUpPage;
