import React from 'react';
import type { ElementType } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    BriefcaseIcon as BriefcaseIconSolid,
    TruckIcon as TruckIconSolid,
    TagIcon as TagIconSolid,
    BuildingStorefrontIcon as BuildingStorefrontIconSolid,
    ArrowPathIcon as ArrowPathIconSolid,
    SparklesIcon as SparklesIconSolid,
    GiftIcon as GiftIconSolid
} from '@heroicons/react/24/solid';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const BriefcaseIcon = (BriefcaseIconSolid as any).default || BriefcaseIconSolid;
const TruckIcon = (TruckIconSolid as any).default || TruckIconSolid;
const TagIcon = (TagIconSolid as any).default || TagIconSolid;
const BuildingStorefrontIcon = (BuildingStorefrontIconSolid as any).default || BuildingStorefrontIconSolid;
const ArrowPathIcon = (ArrowPathIconSolid as any).default || ArrowPathIconSolid;
const SparklesIcon = (SparklesIconSolid as any).default || SparklesIconSolid;
const GiftIcon = (GiftIconSolid as any).default || GiftIconSolid;


interface PeluangMitraPageProps {
  setActivePage: (page: string) => void;
}

const OpportunityCard: React.FC<{
    icon: ElementType,
    title: string,
    description: string,
    onClick: () => void,
    cta: string
}> = ({ icon: IconComponent, title, description, onClick, cta }) => {
    const Icon = (IconComponent as any).default || IconComponent;
    return (
        <div className="bg-surface dark:bg-dark-surface p-6 rounded-xl shadow-md text-left flex flex-col">
            <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon className="w-8 h-8 text-primary dark:text-gold-light" />
                </div>
                <h3 className="font-bold text-lg text-text-primary dark:text-dark-text-primary">{title}</h3>
            </div>
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary flex-grow">{description}</p>
            <button
                onClick={onClick}
                className="mt-4 w-full bg-gradient-to-br from-gold-light to-gold-dark text-white hover:opacity-90 font-bold py-2 px-4 rounded-lg transition-colors"
            >
                {cta}
            </button>
        </div>
    );
};


const PeluangMitraPage: React.FC<PeluangMitraPageProps> = ({ setActivePage }) => {
    
    const opportunities = [
        {
            icon: TruckIcon,
            title: "Mitra Pengemudi",
            description: "Dapatkan penghasilan fleksibel dengan menjadi pengemudi ojek motor atau mobil. Antar penumpang atau kirim barang dan tentukan jam kerja Anda sendiri.",
            page: "Daftar Pengemudi",
            cta: "Daftar Jadi Pengemudi"
        },
        {
            icon: TagIcon,
            title: "Mitra Penjual",
            description: "Punya barang untuk dijual? Buka toko Anda di marketplace kami dan jangkau ribuan pengguna. Proses mudah dan tanpa biaya pendaftaran.",
            page: "Daftar Penjual",
            cta: "Mulai Berjualan"
        },
        {
            icon: SparklesIcon,
            title: "Mitra Cuci (Laundry)",
            description: "Kembangkan usaha laundry Anda. Terima pesanan antar-jemput dari pengguna di sekitar Anda dan kelola semuanya lewat dasbor mitra.",
            page: "Laundry Partner",
            cta: "Daftar Mitra Cuci"
        },
        {
            icon: BuildingStorefrontIcon,
            title: "Mitra Retail",
            description: "Jadikan toko atau warung Anda sebagai titik pembayaran dan top-up untuk pengguna EmaSaku. Dapatkan komisi dari setiap transaksi.",
            page: "Daftar Mitra Retail",
            cta: "Jadi Mitra Retail"
        },
        {
            icon: ArrowPathIcon,
            title: "Mitra Bank Sampah",
            description: "Kelola bank sampah di lingkungan Anda. Terima setoran sampah dari anggota, verifikasi berat, dan bantu proses daur ulang sambil menghasilkan.",
            page: "Daftar Mitra Sampah",
            cta: "Jadi Mitra Sampah"
        },
        {
            icon: GiftIcon,
            title: "Grup Arisan",
            description: "Buat dan kelola grup arisan Anda sendiri bersama komunitas. Sistem otomatis, transparan, dan terintegrasi dengan saldo EmaSaku.",
            page: "Daftar Arisan",
            cta: "Buat Grup Arisan"
        }
    ];

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex items-center mb-6">
                <button
                    onClick={() => setActivePage('Dashboard')}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-4"
                >
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3">
                    <BriefcaseIcon className="w-8 h-8 text-primary dark:text-gold-light" />
                    <h1 className="text-2xl md:text-3xl font-bold">Peluang Kemitraan</h1>
                </div>
            </div>
            
            <p className="text-center text-text-secondary dark:text-dark-text-secondary mb-6 max-w-2xl mx-auto">
                Bergabunglah dengan ekosistem EmaSaku dan temukan berbagai cara untuk mendapatkan penghasilan tambahan, mengembangkan usaha, dan memberdayakan komunitas.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {opportunities.map(op => (
                    <OpportunityCard 
                        key={op.title}
                        icon={op.icon}
                        title={op.title}
                        description={op.description}
                        cta={op.cta}
                        onClick={() => setActivePage(op.page)}
                    />
                ))}
            </div>
        </div>
    );
};

export default PeluangMitraPage;