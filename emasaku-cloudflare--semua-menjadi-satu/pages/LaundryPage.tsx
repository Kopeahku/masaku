import React, { useState } from 'react';
import type { ElementType } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    SparklesIcon as SparklesIconSolid,
    DevicePhoneMobileIcon as DevicePhoneMobileIconSolid,
    TruckIcon as TruckIconSolid,
    HomeIcon as HomeIconSolid,
    RectangleStackIcon as RectangleStackIconSolid,
    TagIcon as TagIconSolid,
    BoltIcon as BoltIconSolid,
    ClockIcon as ClockIconSolid,
    CameraIcon as CameraIconSolid,
    BuildingStorefrontIcon as BuildingStorefrontIconSolid
} from '@heroicons/react/24/solid';
import { LaundryServiceType } from '../types.ts';
import StainGuideModal from '../components/laundry/StainGuideModal.tsx';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const SparklesIcon = (SparklesIconSolid as any).default || SparklesIconSolid;
const DevicePhoneMobileIcon = (DevicePhoneMobileIconSolid as any).default || DevicePhoneMobileIconSolid;
const TruckIcon = (TruckIconSolid as any).default || TruckIconSolid;
const HomeIcon = (HomeIconSolid as any).default || HomeIconSolid;
const RectangleStackIcon = (RectangleStackIconSolid as any).default || RectangleStackIconSolid;
const TagIcon = (TagIconSolid as any).default || TagIconSolid;
const BoltIcon = (BoltIconSolid as any).default || BoltIconSolid;
const ClockIcon = (ClockIconSolid as any).default || ClockIconSolid;
const CameraIcon = (CameraIconSolid as any).default || CameraIconSolid;
const BuildingStorefrontIcon = (BuildingStorefrontIconSolid as any).default || BuildingStorefrontIconSolid;


interface LaundryPageProps {
  setActivePage: (page: string) => void;
  onSelectService: (serviceType: LaundryServiceType) => void;
}

const HowItWorksStep: React.FC<{ icon: ElementType, title: string, description: string }> = ({ icon: IconComponent, title, description }) => {
    const Icon = (IconComponent as any).default || IconComponent;
    return (
        <div className="flex flex-col items-center text-center">
            <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-full">
                <Icon className="w-8 h-8 text-primary dark:text-gold-light" />
            </div>
            <h4 className="mt-2 font-bold text-sm text-text-primary dark:text-dark-text-primary">{title}</h4>
            <p className="text-xs text-text-secondary dark:text-dark-text-secondary">{description}</p>
        </div>
    );
};

const ServiceCard: React.FC<{ icon: ElementType, title: string, description: string, onClick: () => void }> = ({ icon: IconComponent, title, description, onClick }) => {
    const Icon = (IconComponent as any).default || IconComponent;
    return (
        <button 
            onClick={onClick}
            className="bg-surface dark:bg-dark-surface p-6 rounded-xl shadow-md text-left flex items-start gap-4 transition-all hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-dark-background"
        >
            <div className="bg-primary/10 p-3 rounded-lg">
                <Icon className="w-8 h-8 text-primary dark:text-gold-light" />
            </div>
            <div>
                <h3 className="font-bold text-lg text-text-primary dark:text-dark-text-primary">{title}</h3>
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-1">{description}</p>
            </div>
        </button>
    );
};

const LaundryPage: React.FC<LaundryPageProps> = ({ setActivePage, onSelectService }) => {
    const [isStainModalOpen, setStainModalOpen] = useState(false);

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
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
                    <SparklesIcon className="w-8 h-8 text-primary dark:text-gold-light" />
                    <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">
                        Laundry
                    </h1>
                </div>
            </div>

            <div className="space-y-6">
                {/* How it Works Section */}
                <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-center text-text-primary dark:text-dark-text-primary mb-6">Cara Kerja</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-start">
                        <HowItWorksStep icon={DevicePhoneMobileIcon} title="1. Pesan Layanan" description="Pilih jenis laundry & jadwal jemput." />
                        <HowItWorksStep icon={TruckIcon} title="2. Penjemputan" description="Kurir kami akan menjemput pakaianmu." />
                        <HowItWorksStep icon={SparklesIcon} title="3. Proses Cuci" description="Dicuci bersih & wangi oleh mitra profesional." />
                        <HowItWorksStep icon={HomeIcon} title="4. Pengantaran" description="Pakaian bersih diantar kembali ke rumahmu." />
                    </div>
                </div>
                
                {/* AI STAIN GUIDE - NEW SECTION */}
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-700 dark:to-purple-800 text-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h2 className="font-bold text-xl flex items-center gap-2"><SparklesIcon className="w-6 h-6 text-yellow-300"/> Punya Noda Membandel?</h2>
                        <p className="text-sm text-white/80 mt-1">Gunakan AI untuk mendapatkan tips penanganan noda sebelum di-laundry.</p>
                    </div>
                    <button 
                        onClick={() => setStainModalOpen(true)}
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm font-bold py-2 px-6 rounded-lg transition-colors flex-shrink-0 flex items-center gap-2"
                    >
                        <CameraIcon className="w-5 h-5" />
                        Cek Noda dengan AI
                    </button>
                </div>
                
                {/* Service Selection Section */}
                <div>
                    <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary mb-4">Pilih Layanan</h2>
                    <div className="space-y-4">
                        <ServiceCard 
                            icon={RectangleStackIcon}
                            title="Laundry Kiloan"
                            description="Pakaian sehari-hari, dihitung per kg."
                            onClick={() => onSelectService('Kiloan')}
                        />
                        <ServiceCard 
                            icon={TagIcon}
                            title="Laundry Satuan"
                            description="Untuk item spesial seperti jas, gaun, sepatu."
                            onClick={() => onSelectService('Satuan')}
                        />
                        <ServiceCard 
                            icon={BoltIcon}
                            title="Layanan Ekspres"
                            description="Pakaian bersih lebih cepat dalam hitungan jam."
                            onClick={() => onSelectService('Ekspres')}
                        />
                    </div>
                </div>
                
                {/* Partner Registration Call to Action */}
                <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-4">
                    <button 
                        onClick={() => setActivePage('Laundry Partner')}
                        className="w-full flex justify-between items-center text-left group p-2"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                <BuildingStorefrontIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-text-primary dark:text-dark-text-primary">Punya Usaha Laundry?</h3>
                                <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Tingkatkan pendapatan Anda dengan menjadi Mitra Cuci kami.</p>
                            </div>
                        </div>
                        <span className="text-sm font-bold text-primary dark:text-gold-light group-hover:underline whitespace-nowrap ml-4">Daftar Mitra Cuci &rarr;</span>
                    </button>
                </div>

                {/* Order History */}
                <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-4">
                    <button 
                        onClick={() => alert('Fitur riwayat pesanan sedang dikembangkan.')}
                        className="w-full flex justify-between items-center text-left group p-2"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                <ClockIcon className="w-6 h-6 text-text-secondary dark:text-dark-text-secondary" />
                            </div>
                            <span className="font-bold text-text-primary dark:text-dark-text-primary">Riwayat Pesanan</span>
                        </div>
                        <span className="text-sm font-semibold text-primary dark:text-gold-light group-hover:underline">Lihat Semua</span>
                    </button>
                </div>
            </div>

            {isStainModalOpen && <StainGuideModal onClose={() => setStainModalOpen(false)} />}
        </div>
    );
};

export default LaundryPage;