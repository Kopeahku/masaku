import React, { useState } from 'react';
import type { ElementType } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    ArrowPathIcon as ArrowPathIconSolid,
    CheckBadgeIcon as CheckBadgeIconSolid, 
    CurrencyDollarIcon as CurrencyDollarIconSolid, 
    UsersIcon as UsersIconSolid,
    ShieldCheckIcon as ShieldCheckIconSolid
} from '@heroicons/react/24/solid';
import { User } from '../types.ts';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const ArrowPathIcon = (ArrowPathIconSolid as any).default || ArrowPathIconSolid;
const CheckBadgeIcon = (CheckBadgeIconSolid as any).default || CheckBadgeIconSolid;
const CurrencyDollarIcon = (CurrencyDollarIconSolid as any).default || CurrencyDollarIconSolid;
const UsersIcon = (UsersIconSolid as any).default || UsersIconSolid;
const ShieldCheckIcon = (ShieldCheckIconSolid as any).default || ShieldCheckIconSolid;

interface DaftarMitraSampahPageProps {
  setActivePage: (page: string) => void;
  currentUser: User;
  onWastePartnerRegistrationRequest: (formData: any) => void;
}

const BenefitCard: React.FC<{ icon: ElementType, title: string, description: string }> = ({ icon: IconComponent, title, description }) => {
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

const DaftarMitraSampahPage: React.FC<DaftarMitraSampahPageProps> = ({ setActivePage, currentUser, onWastePartnerRegistrationRequest }) => {
    const [formState, setFormState] = useState({
        bankName: '',
        address: '',
        operationalHours: 'Senin - Sabtu, 08:00 - 16:00',
        acceptedWastes: 'Plastik PET, Kardus, Logam',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formState.bankName || !formState.address) {
            alert('Harap lengkapi semua data pendaftaran.');
            return;
        }
        onWastePartnerRegistrationRequest(formState);
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="flex items-center mb-6">
                <button onClick={() => setActivePage('Peluang Mitra')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 mr-4">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3">
                    <ArrowPathIcon className="w-8 h-8 text-primary dark:text-gold-light" />
                    <h1 className="text-2xl md:text-3xl font-bold">Jadi Mitra Bank Sampah</h1>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-center mb-4">Ubah Sampah Jadi Rupiah, Berdayakan Lingkungan</h2>
                    <div className="space-y-3">
                        <BenefitCard icon={CurrencyDollarIcon} title="Sumber Pendapatan Baru" description="Dapatkan keuntungan dari pengelolaan dan penjualan sampah terpilah." />
                        <BenefitCard icon={UsersIcon} title="Dukung Komunitas Lokal" description="Menjadi pusat pengelolaan sampah bagi anggota EmaSaku di sekitar Anda." />
                        <BenefitCard icon={CheckBadgeIcon} title="Kontribusi Positif" description="Berperan aktif dalam menjaga kebersihan dan kelestarian lingkungan." />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6 space-y-4">
                    <h2 className="text-xl font-bold text-center mb-4">Formulir Pendaftaran Mitra Bank Sampah</h2>
                    
                    <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                        <p className="text-sm font-medium">Nama Penanggung Jawab: <span className="font-bold">{currentUser.name}</span></p>
                    </div>
                    
                    <div>
                        <label htmlFor="bankName" className="block text-sm font-medium">Nama Bank Sampah / Usaha</label>
                        <input id="bankName" name="bankName" value={formState.bankName} onChange={handleInputChange} placeholder="Contoh: Bank Sampah Emasaku Sejahtera" className="mt-1 w-full p-2 border rounded-md" required/>
                    </div>
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium">Alamat Lengkap Lokasi</label>
                        <textarea id="address" name="address" value={formState.address} onChange={handleInputChange} placeholder="Masukkan alamat lengkap lokasi bank sampah" rows={3} className="mt-1 w-full p-2 border rounded-md" required></textarea>
                    </div>
                    <div>
                        <label htmlFor="operationalHours" className="block text-sm font-medium">Jam Operasional</label>
                        <input id="operationalHours" name="operationalHours" value={formState.operationalHours} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md" required/>
                    </div>
                    <div>
                        <label htmlFor="acceptedWastes" className="block text-sm font-medium">Jenis Sampah yang Diterima</label>
                        <input id="acceptedWastes" name="acceptedWastes" value={formState.acceptedWastes} onChange={handleInputChange} placeholder="Pisahkan dengan koma, cth: Plastik, Kertas, Logam" className="mt-1 w-full p-2 border rounded-md" required/>
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

export default DaftarMitraSampahPage;