import React from 'react';
import type { ElementType } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    BuildingStorefrontIcon as BuildingStorefrontIconSolid,
    ClipboardDocumentCheckIcon as ClipboardDocumentCheckIconSolid,
    TruckIcon as TruckIconSolid,
    TagIcon as TagIconSolid,
    ArrowPathIcon as ArrowPathIconSolid,
    ChevronRightIcon as ChevronRightIconSolid
} from '@heroicons/react/24/solid';
import { User } from '../types.ts';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const BuildingStorefrontIcon = (BuildingStorefrontIconSolid as any).default || BuildingStorefrontIconSolid;
const ClipboardDocumentCheckIcon = (ClipboardDocumentCheckIconSolid as any).default || ClipboardDocumentCheckIconSolid;
const TruckIcon = (TruckIconSolid as any).default || TruckIconSolid;
const TagIcon = (TagIconSolid as any).default || TagIconSolid;
const ArrowPathIcon = (ArrowPathIconSolid as any).default || ArrowPathIconSolid;
const ChevronRightIcon = (ChevronRightIconSolid as any).default || ChevronRightIconSolid;


interface PartnerDashboardPageProps {
  setActivePage: (page: string) => void;
  currentUser: User;
}

const PartnerCard: React.FC<{
    icon: ElementType,
    title: string,
    description: string,
    onClick: () => void
}> = ({ icon: IconComponent, title, description, onClick }) => {
    const Icon = (IconComponent as any).default || IconComponent;
    return (
        <button onClick={onClick} className="w-full bg-surface dark:bg-dark-surface p-4 rounded-xl shadow-md flex items-center gap-4 text-left transition-all hover:shadow-lg hover:ring-2 hover:ring-primary/50">
            <div className="p-3 bg-primary/10 rounded-lg">
                <Icon className="w-8 h-8 text-primary dark:text-gold-light" />
            </div>
            <div className="flex-grow">
                <h3 className="font-bold text-lg text-text-primary dark:text-dark-text-primary">{title}</h3>
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{description}</p>
            </div>
            <ChevronRightIcon className="w-6 h-6 text-slate-400" />
        </button>
    );
};


const PartnerDashboardPage: React.FC<PartnerDashboardPageProps> = ({ setActivePage, currentUser }) => {
    
    const partnerRoles = [
        {
            isPartner: currentUser.isRetailPartner,
            title: "Mitra Retail",
            description: "Proses top up anggota di gerai Anda.",
            icon: BuildingStorefrontIcon,
            page: 'Dasbor Mitra Retail'
        },
        {
            isPartner: currentUser.isLaundryPartner,
            title: "Mitra Cuci",
            description: "Kelola pesanan laundry yang masuk.",
            icon: ClipboardDocumentCheckIcon,
            page: 'Laundry Partner Dashboard'
        },
        {
            isPartner: typeof currentUser.driverBalance === 'number',
            title: "Mitra Pengemudi",
            description: "Lihat pesanan ojek dan atur status online.",
            icon: TruckIcon,
            page: 'Pengemudi'
        },
        {
            isPartner: currentUser.isSeller,
            title: "Mitra Penjual",
            description: "Kelola produk dan pesanan di marketplace.",
            icon: TagIcon,
            page: 'Dasbor Mitra Penjual'
        },
        {
            isPartner: currentUser.isWastePartner,
            title: "Mitra Bank Sampah",
            description: "Verifikasi setoran sampah dari anggota.",
            icon: ArrowPathIcon,
            page: 'Mitra Sampah Dashboard'
        },
    ];

    const activePartnerRoles = partnerRoles.filter(role => role.isPartner);

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
                    <BuildingStorefrontIcon className="w-8 h-8 text-primary dark:text-gold-light" />
                    <h1 className="text-2xl md:text-3xl font-bold">Dasbor Mitra</h1>
                </div>
            </div>

            <div className="space-y-4">
                {activePartnerRoles.length > 0 ? (
                    activePartnerRoles.map(role => (
                        <PartnerCard 
                            key={role.page}
                            icon={role.icon}
                            title={role.title}
                            description={role.description}
                            onClick={() => setActivePage(role.page)}
                        />
                    ))
                ) : (
                    <div className="text-center bg-surface dark:bg-dark-surface p-8 rounded-xl shadow-md">
                        <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">Anda Belum Terdaftar Sebagai Mitra</h2>
                        <p className="text-text-secondary dark:text-dark-text-secondary mt-2 mb-6">Jelajahi berbagai peluang kemitraan untuk mendapatkan penghasilan tambahan.</p>
                        <button
                            onClick={() => setActivePage('Peluang Mitra')}
                            className="bg-gradient-to-br from-gold-light to-gold-dark hover:opacity-90 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                        >
                            Lihat Peluang Kemitraan
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PartnerDashboardPage;