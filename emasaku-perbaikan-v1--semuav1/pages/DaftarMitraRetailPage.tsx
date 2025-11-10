import React, { useState } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    BuildingStorefrontIcon as BuildingStorefrontIconSolid, 
    CheckBadgeIcon as CheckBadgeIconSolid, 
    CurrencyDollarIcon as CurrencyDollarIconSolid, 
    UsersIcon as UsersIconSolid, 
    ShieldCheckIcon as ShieldCheckIconSolid 
} from '@heroicons/react/24/solid';
import { User } from '../types.ts';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const BuildingStorefrontIcon = (BuildingStorefrontIconSolid as any).default || BuildingStorefrontIconSolid;
const CheckBadgeIcon = (CheckBadgeIconSolid as any).default || CheckBadgeIconSolid;
const CurrencyDollarIcon = (CurrencyDollarIconSolid as any).default || CurrencyDollarIconSolid;
const UsersIcon = (UsersIconSolid as any).default || UsersIconSolid;
const ShieldCheckIcon = (ShieldCheckIconSolid as any).default || ShieldCheckIconSolid;

interface DaftarMitraRetailPageProps {
  setActivePage: (page: string) => void;
  currentUser: User;
  onRetailPartnerRegistrationRequest: (formData: any) => void;
}

const BenefitCard: React.FC<{ icon: React.ElementType, title: string, description: string }> = ({ icon: IconComponent, title, description }) => {
    const Icon = (IconComponent as any).default || IconComponent;
    return (
        <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div className="bg-primary/10 p-3 rounded-full">
                <Icon className="w-6 h-6 text-primary dark:text-gold-light" />
            </div>
            <div>
                <h4 className="font-bold text-text-primary dark:text-dark-text-primary">{title}</h4>
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{description}</p>
            </div>
        </div>
    );
};

const DaftarMitraRetailPage: React.FC<DaftarMitraRetailPageProps> = ({ setActivePage, currentUser, onRetailPartnerRegistrationRequest }) => {
    const [formState, setFormState] = useState({
        storeName: '',
        address: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formState.storeName || !formState.address) {
            alert('Harap lengkapi semua data pendaftaran.');
            return;
        }
        onRetailPartnerRegistrationRequest(formState);
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="flex items-center mb-6">
                <button onClick={() => setActivePage('Peluang Mitra')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 mr-4">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3">
                    <BuildingStorefrontIcon className="w-8 h-8 text-primary dark:text-gold-light" />
                    <h1 className="text-2xl md:text-3xl font-bold">Jadi Mitra Retail</h1>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-center mb-4">Jadilah Titik Top Up & Pembayaran di Komunitas Anda</h2>
                    <div className="space-y-3">
                        <BenefitCard icon={CurrencyDollarIcon} title="Komisi Transaksi" description="Dapatkan penghasilan tambahan dari setiap transaksi top-up yang Anda layani." />
                        <BenefitCard icon={UsersIcon} title="Tingkatkan Kunjungan" description="Tarik lebih banyak pelanggan ke toko atau warung Anda." />
                        <BenefitCard icon={CheckBadgeIcon} title="Status Mitra Resmi" description="Tingkatkan kepercayaan pelanggan dengan menjadi mitra resmi EmaSaku." />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6 space-y-4">
                    <h2 className="text-xl font-bold text-center mb-4">Formulir Pendaftaran Mitra Retail</h2>
                    
                    <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                        <p className="text-sm font-medium">Nama Pendaftar: <span className="font-bold">{currentUser.name}</span></p>
                    </div>
                    
                    <div>
                        <label htmlFor="storeName" className="block text-sm font-medium">Nama Toko / Warung / Usaha</label>
                        <input id="storeName" name="storeName" value={formState.storeName} onChange={handleInputChange} placeholder="Contoh: Warung Ibu Siti" className="mt-1 w-full p-2 border rounded-md" required/>
                    </div>
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium">Alamat Lengkap Usaha</label>
                        <textarea id="address" name="address" value={formState.address} onChange={handleInputChange} placeholder="Masukkan alamat lengkap lokasi usaha Anda" rows={3} className="mt-1 w-full p-2 border rounded-md" required></textarea>
                    </div>

                    <button type="submit" className="w-full bg-gradient-to-br from-gold-light to-gold-dark text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2">
                        <ShieldCheckIcon className="w-5 h-5"/>
                        Ajukan Pendaftaran
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DaftarMitraRetailPage;