import React, { useState, useMemo } from 'react';
import type { ElementType } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    SquaresPlusIcon as SquaresPlusIconSolid,
    DevicePhoneMobileIcon as DevicePhoneMobileIconSolid,
    WifiIcon as WifiIconSolid,
    BoltIcon as BoltIconSolid,
    WalletIcon as WalletIconSolid,
    ShieldCheckIcon as ShieldCheckIconSolid,
    TvIcon as TvIconSolid,
    PuzzlePieceIcon as PuzzlePieceIconSolid,
    SparklesIcon as SparklesIconSolid,
    BeakerIcon as BeakerIconSolid,
    XMarkIcon as XMarkIconSolid,
    ArrowPathIcon as ArrowPathIconSolid
} from '@heroicons/react/24/solid';
import { formatToRupiah } from '../utils/formatter.ts';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const SquaresPlusIcon = (SquaresPlusIconSolid as any).default || SquaresPlusIconSolid;
const DevicePhoneMobileIcon = (DevicePhoneMobileIconSolid as any).default || DevicePhoneMobileIconSolid;
const WifiIcon = (WifiIconSolid as any).default || WifiIconSolid;
const BoltIcon = (BoltIconSolid as any).default || BoltIconSolid;
const WalletIcon = (WalletIconSolid as any).default || WalletIconSolid;
const ShieldCheckIcon = (ShieldCheckIconSolid as any).default || ShieldCheckIconSolid;
const TvIcon = (TvIconSolid as any).default || TvIconSolid;
const PuzzlePieceIcon = (PuzzlePieceIconSolid as any).default || PuzzlePieceIconSolid;
const SparklesIcon = (SparklesIconSolid as any).default || SparklesIconSolid;
const BeakerIcon = (BeakerIconSolid as any).default || BeakerIconSolid;
const XMarkIcon = (XMarkIconSolid as any).default || XMarkIconSolid;
const ArrowPathIcon = (ArrowPathIconSolid as any).default || ArrowPathIconSolid;


interface BayarBeliPageProps {
  setActivePage: (page: string) => void;
}

interface Service {
    label: string;
    icon: ElementType;
    type: 'Beli' | 'Bayar';
    placeholder: string;
}

const ServiceButton: React.FC<{ icon: ElementType, label: string, onClick: () => void }> = ({ icon: IconComponent, label, onClick }) => {
    const Icon = (IconComponent as any).default || IconComponent;
    return (
        <button 
            onClick={onClick}
            className="flex flex-col items-center justify-center text-center p-4 bg-surface dark:bg-dark-surface rounded-xl shadow-md space-y-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-dark-background"
        >
            <div className="p-3 bg-primary/10 rounded-full">
                <Icon className="w-7 h-7 text-primary dark:text-gold-light" />
            </div>
            <span className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">{label}</span>
        </button>
    );
};

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary mb-4">{title}</h2>
);

interface PaymentModalProps {
    activeService: Service | null;
    onClose: () => void;
    customerNumber: string;
    selectedNominal: number | null;
    billDetails: { name: string; period: string; amount: number; adminFee: number; } | null;
    isCheckingBill: boolean;
    step: 'input' | 'confirmation';
    setStep: React.Dispatch<React.SetStateAction<'input' | 'confirmation'>>;
    setCustomerNumber: React.Dispatch<React.SetStateAction<string>>;
    handleCheckBill: () => void;
    handleNominalSelect: (amount: number) => void;
    handlePayment: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
    activeService,
    onClose,
    customerNumber,
    selectedNominal,
    billDetails,
    isCheckingBill,
    step,
    setStep,
    setCustomerNumber,
    handleCheckBill,
    handleNominalSelect,
    handlePayment,
}) => {
    if (!activeService) return null;

    const Icon = (activeService.icon as any).default || activeService.icon;
    const isBeli = activeService.type === 'Beli';
    const adminFee = 2000;
    const total = useMemo(() => isBeli ? (selectedNominal || 0) + adminFee : (billDetails?.amount || 0) + (billDetails?.adminFee || 0), [isBeli, selectedNominal, billDetails, adminFee]);
    const nominals = [10000, 25000, 50000, 100000, 200000, 500000];

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-2xl p-6 w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><XMarkIcon className="w-6 h-6" /></button>
                <div className="flex items-center gap-3 mb-6">
                    <Icon className="w-8 h-8 text-primary dark:text-gold-light" />
                    <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">{activeService.label}</h2>
                </div>

                {step === 'input' && (
                    <div className="space-y-4 animate-fade-in">
                        <div>
                            <label htmlFor="customerNumber" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
                                {isBeli ? 'Nomor Telepon / ID Pelanggan' : 'Nomor Pelanggan'}
                            </label>
                            <input
                                type="text"
                                id="customerNumber"
                                value={customerNumber}
                                onChange={e => setCustomerNumber(e.target.value)}
                                className="w-full p-2 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600 focus:ring-2 focus:ring-primary focus:outline-none"
                                placeholder={activeService.placeholder}
                            />
                        </div>

                        {isBeli && (
                            <div>
                                <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-2">Pilih Nominal</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {nominals.map(n => (
                                        <button
                                            key={n}
                                            onClick={() => handleNominalSelect(n)}
                                            className="p-3 border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 font-semibold text-text-primary dark:text-dark-text-primary text-sm transition-colors"
                                        >
                                            {formatToRupiah(n).replace('Rp', '')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {!isBeli && (
                            <button
                                onClick={handleCheckBill}
                                disabled={isCheckingBill || !customerNumber.trim()}
                                className="w-full bg-primary text-white font-bold py-3 rounded-lg flex items-center justify-center disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-wait"
                            >
                                {isCheckingBill ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : 'Cek Tagihan'}
                            </button>
                        )}
                    </div>
                )}
                
                {step === 'confirmation' && (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="font-bold text-center text-lg text-text-primary dark:text-dark-text-primary">Konfirmasi Pembayaran</h3>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-2 text-sm">
                            {isBeli ? (
                                <>
                                    <div className="flex justify-between"><span className="text-text-secondary dark:text-dark-text-secondary">Produk</span><span className="font-semibold">{activeService.label}</span></div>
                                    <div className="flex justify-between"><span className="text-text-secondary dark:text-dark-text-secondary">Nomor Tujuan</span><span className="font-semibold">{customerNumber}</span></div>
                                    <div className="flex justify-between"><span className="text-text-secondary dark:text-dark-text-secondary">Harga</span><span className="font-semibold">{formatToRupiah(selectedNominal || 0)}</span></div>
                                    <div className="flex justify-between"><span className="text-text-secondary dark:text-dark-text-secondary">Biaya Admin</span><span className="font-semibold">{formatToRupiah(adminFee)}</span></div>
                                </>
                            ) : (
                                <>
                                    <div className="flex justify-between"><span className="text-text-secondary dark:text-dark-text-secondary">Nama Pelanggan</span><span className="font-semibold">{billDetails?.name}</span></div>
                                    <div className="flex justify-between"><span className="text-text-secondary dark:text-dark-text-secondary">Nomor Pelanggan</span><span className="font-semibold">{customerNumber}</span></div>
                                    <div className="flex justify-between"><span className="text-text-secondary dark:text-dark-text-secondary">Periode</span><span className="font-semibold">{billDetails?.period}</span></div>
                                    <div className="flex justify-between"><span className="text-text-secondary dark:text-dark-text-secondary">Jumlah Tagihan</span><span className="font-semibold">{formatToRupiah(billDetails?.amount || 0)}</span></div>
                                    <div className="flex justify-between"><span className="text-text-secondary dark:text-dark-text-secondary">Biaya Admin</span><span className="font-semibold">{formatToRupiah(billDetails?.adminFee || 0)}</span></div>
                                </>
                            )}
                            <div className="flex justify-between font-bold text-base pt-2 border-t mt-2">
                                <span>Total Pembayaran</span>
                                <span className="text-primary dark:text-gold-light">{formatToRupiah(total)}</span>
                            </div>
                        </div>
                        <button onClick={handlePayment} className="w-full bg-gradient-to-br from-gold-light to-gold-dark text-white font-bold py-3 rounded-lg">
                            Bayar Sekarang
                        </button>
                        <button onClick={() => setStep('input')} className="w-full text-sm font-semibold text-text-secondary dark:text-dark-text-secondary mt-2">Kembali</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const BayarBeliPage: React.FC<BayarBeliPageProps> = ({ setActivePage }) => {
    const [activeService, setActiveService] = useState<Service | null>(null);
    const [customerNumber, setCustomerNumber] = useState('');
    const [selectedNominal, setSelectedNominal] = useState<number | null>(null);
    const [billDetails, setBillDetails] = useState<{ name: string; period: string; amount: number; adminFee: number; } | null>(null);
    const [isCheckingBill, setIsCheckingBill] = useState(false);
    const [step, setStep] = useState<'input' | 'confirmation'>('input');
  
    const services: Service[] = [
        { label: 'Pulsa', icon: DevicePhoneMobileIcon, type: 'Beli', placeholder: '081234567890' },
        { label: 'Paket Data', icon: WifiIcon, type: 'Beli', placeholder: '081234567890' },
        { label: 'Token Listrik', icon: BoltIcon, type: 'Beli', placeholder: '32012345678' },
        { label: 'E-Money', icon: WalletIcon, type: 'Beli', placeholder: '081234567890' },
        { label: 'Voucher Game', icon: PuzzlePieceIcon, type: 'Beli', placeholder: '12345678 (1234)' },
        { label: 'Listrik Pascabayar', icon: BoltIcon, type: 'Bayar', placeholder: '530123456789' },
        { label: 'BPJS', icon: ShieldCheckIcon, type: 'Bayar', placeholder: '8888801234567890' },
        { label: 'PDAM', icon: BeakerIcon, type: 'Bayar', placeholder: '123456789' },
        { label: 'Internet & TV Kabel', icon: TvIcon, type: 'Bayar', placeholder: '123456789012' },
        { label: 'Donasi & Zakat', icon: SparklesIcon, type: 'Bayar', placeholder: 'Pilih Lembaga' },
    ];
  
    const beliServices = services.filter(s => s.type === 'Beli');
    const bayarServices = services.filter(s => s.type === 'Bayar');
  
    const handleServiceClick = (service: Service) => {
        setActiveService(service);
        setStep('input');
    };
  
    const handleCloseModal = () => {
        setActiveService(null);
        setCustomerNumber('');
        setSelectedNominal(null);
        setBillDetails(null);
        setIsCheckingBill(false);
    };
  
    const handleNominalSelect = (amount: number) => {
        setSelectedNominal(amount);
        if (customerNumber.trim()) {
            setStep('confirmation');
        } else {
            alert('Harap masukkan Nomor Telepon / ID Pelanggan terlebih dahulu.');
        }
    };
  
    const handleCheckBill = () => {
        setIsCheckingBill(true);
        // Simulate API call
        setTimeout(() => {
            setBillDetails({
                name: 'BUDI SANTOSO',
                period: 'Agustus 2024',
                amount: 150000,
                adminFee: 2500
            });
            setStep('confirmation');
            setIsCheckingBill(false);
        }, 1500);
    };
  
    const handlePayment = () => {
        const isBeli = activeService?.type === 'Beli';
        const total = isBeli ? (selectedNominal || 0) + 2000 : (billDetails?.amount || 0) + (billDetails?.adminFee || 0);
        alert(`Pembayaran untuk ${activeService?.label} sebesar ${formatToRupiah(total)} berhasil!`);
        handleCloseModal();
    };
  
    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            {activeService && <PaymentModal 
                activeService={activeService}
                onClose={handleCloseModal}
                customerNumber={customerNumber}
                selectedNominal={selectedNominal}
                billDetails={billDetails}
                isCheckingBill={isCheckingBill}
                step={step}
                setStep={setStep}
                setCustomerNumber={setCustomerNumber}
                handleCheckBill={handleCheckBill}
                handleNominalSelect={handleNominalSelect}
                handlePayment={handlePayment}
            />}
            {/* Header */}
            <div className="flex items-center mb-6">
                <button
                    onClick={() => setActivePage('Dashboard')}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-4"
                >
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3">
                    <SquaresPlusIcon className="w-8 h-8 text-primary dark:text-gold-light" />
                    <h1 className="text-2xl font-bold">Bayar & Beli</h1>
                </div>
            </div>
  
            <div className="space-y-6">
                <div>
                    <SectionHeader title="Beli Produk Digital" />
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                        {beliServices.map(service => (
                            <ServiceButton key={service.label} icon={service.icon} label={service.label} onClick={() => handleServiceClick(service)} />
                        ))}
                    </div>
                </div>
                <div>
                    <SectionHeader title="Bayar Tagihan" />
                     <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                        {bayarServices.map(service => (
                            <ServiceButton key={service.label} icon={service.icon} label={service.label} onClick={() => handleServiceClick(service)} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BayarBeliPage;