import React, { useState } from 'react';
import type { ElementType } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    TagIcon as TagIconSolid, 
    CheckBadgeIcon as CheckBadgeIconSolid, 
    CurrencyDollarIcon as CurrencyDollarIconSolid, 
    UsersIcon as UsersIconSolid,
    ShieldCheckIcon as ShieldCheckIconSolid
} from '@heroicons/react/24/solid';
import { User, SellerRegistrationRequest } from '../types.ts';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const TagIcon = (TagIconSolid as any).default || TagIconSolid;
const CheckBadgeIcon = (CheckBadgeIconSolid as any).default || CheckBadgeIconSolid;
const CurrencyDollarIcon = (CurrencyDollarIconSolid as any).default || CurrencyDollarIconSolid;
const UsersIcon = (UsersIconSolid as any).default || UsersIconSolid;
const ShieldCheckIcon = (ShieldCheckIconSolid as any).default || ShieldCheckIconSolid;

interface DaftarPenjualPageProps {
  setActivePage: (page: string) => void;
  currentUser: User;
  onSellerRegistrationRequest: (formData: Omit<SellerRegistrationRequest, 'id' | 'date' | 'userId' | 'userName' | 'userAvatar'>) => void;
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

const HowToStep: React.FC<{ number: number, title: string, description: string }> = ({ number, title, description }) => (
    <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-primary text-white text-lg font-bold rounded-full flex items-center justify-center">{number}</div>
        <div>
            <h4 className="font-bold text-text-primary dark:text-dark-text-primary">{title}</h4>
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{description}</p>
        </div>
    </div>
);


const DaftarPenjualPage: React.FC<DaftarPenjualPageProps> = ({ setActivePage, currentUser, onSellerRegistrationRequest }) => {
    const [formState, setFormState] = useState({
        storeName: '',
        storeDescription: '',
        pickupAddress: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formState.storeName || !formState.storeDescription || !formState.pickupAddress) {
            alert('Harap lengkapi semua data pendaftaran.');
            return;
        }
        onSellerRegistrationRequest(formState);
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="flex items-center mb-6">
                <button onClick={() => setActivePage('Peluang Mitra')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 mr-4">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3">
                    <TagIcon className="w-8 h-8 text-primary dark:text-gold-light" />
                    <h1 className="text-2xl md:text-3xl font-bold">Jadi Mitra Penjual</h1>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-center mb-4">Jangkau Ribuan Pengguna dan Tingkatkan Penjualan Anda</h2>
                    <div className="space-y-3">
                        <BenefitCard icon={UsersIcon} title="Jangkauan Luas" description="Produk Anda akan dilihat oleh seluruh pengguna aktif aplikasi EmaSaku." />
                        <BenefitCard icon={CurrencyDollarIcon} title="Tanpa Biaya Pendaftaran" description="Membuka toko di marketplace kami gratis, tanpa biaya tersembunyi." />
                        <BenefitCard icon={CheckBadgeIcon} title="Aman & Terpercaya" description="Bertransaksi dalam ekosistem yang aman dan terverifikasi." />
                    </div>
                </div>
                
                <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-center mb-6">3 Langkah Sederhana untuk Mulai Berjualan</h2>
                    <div className="space-y-6">
                        <HowToStep number={1} title="Isi Formulir Toko" description="Lengkapi detail mengenai toko dan produk yang akan Anda jual." />
                        <HowToStep number={2} title="Verifikasi oleh Admin" description="Tim kami akan meninjau pendaftaran Anda untuk memastikan kualitas." />
                        <HowToStep number={3} title="Mulai Jual Produk" description="Setelah disetujui, Anda dapat langsung mulai menambahkan dan menjual produk." />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6 space-y-4">
                    <h2 className="text-xl font-bold text-center mb-4">Formulir Pendaftaran Toko</h2>
                    
                    <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                        <p className="text-sm font-medium">Nama Pendaftar: <span className="font-bold">{currentUser.name}</span></p>
                    </div>
                    
                    <div>
                        <label htmlFor="storeName" className="block text-sm font-medium">Nama Toko</label>
                        <input id="storeName" name="storeName" value={formState.storeName} onChange={handleInputChange} placeholder="Contoh: Budi Elektronik" className="mt-1 w-full p-2 border rounded-md" required/>
                    </div>
                     <div>
                        <label htmlFor="storeDescription" className="block text-sm font-medium">Deskripsi Singkat Toko</label>
                        <textarea id="storeDescription" name="storeDescription" value={formState.storeDescription} onChange={handleInputChange} placeholder="Contoh: Menjual berbagai macam barang elektronik bekas berkualitas." rows={3} className="mt-1 w-full p-2 border rounded-md" required></textarea>
                    </div>
                     <div>
                        <label htmlFor="pickupAddress" className="block text-sm font-medium">Alamat Pengambilan Barang (Pickup)</label>
                        <textarea id="pickupAddress" name="pickupAddress" value={formState.pickupAddress} onChange={handleInputChange} placeholder="Masukkan alamat lengkap Anda" rows={3} className="mt-1 w-full p-2 border rounded-md" required></textarea>
                    </div>

                    <button type="submit" className="w-full bg-gradient-to-br from-gold-light to-gold-dark text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2">
                        <ShieldCheckIcon className="w-5 h-5"/>
                        Kirim Pendaftaran Toko
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DaftarPenjualPage;