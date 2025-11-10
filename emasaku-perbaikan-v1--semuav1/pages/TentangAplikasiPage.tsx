import React, { useState, useRef } from 'react';
import type { ElementType } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    WalletIcon as WalletIconSolid, 
    SparklesIcon as SparklesIconSolid, 
    HeartIcon as HeartIconSolid, 
    ShoppingCartIcon as ShoppingCartIconSolid, 
    UserGroupIcon as UserGroupIconSolid, 
    PencilSquareIcon as PencilSquareIconSolid, 
    CameraIcon as CameraIconSolid 
} from '@heroicons/react/24/solid';
import { User, UserRole } from '../types.ts';
import useLocalStorage from '../hooks/useLocalStorage.ts';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const WalletIcon = (WalletIconSolid as any).default || WalletIconSolid;
const SparklesIcon = (SparklesIconSolid as any).default || SparklesIconSolid;
const HeartIcon = (HeartIconSolid as any).default || HeartIconSolid;
const ShoppingCartIcon = (ShoppingCartIconSolid as any).default || ShoppingCartIconSolid;
const UserGroupIcon = (UserGroupIconSolid as any).default || UserGroupIconSolid;
const PencilSquareIcon = (PencilSquareIconSolid as any).default || PencilSquareIconSolid;
const CameraIcon = (CameraIconSolid as any).default || CameraIconSolid;

interface TentangAplikasiPageProps {
  setActivePage: (page: string) => void;
  currentUser: User;
}

interface FeatureInfo {
    iconName: string;
    title: string;
    description: string;
}

interface PageContent {
    appName: string;
    appVersion: string;
    logoUrl: string; // Will store a data URL
    description: string;
    features: FeatureInfo[];
    footerText: string;
}

const iconMap: { [key: string]: ElementType } = {
    WalletIcon, SparklesIcon, HeartIcon, ShoppingCartIcon, UserGroupIcon
};

const defaultLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#B45309"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25-2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 3a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m-1.5-3.375C2.063 7.843 2.5 7.5 3 7.5h18c.5 0 .938.343 1.5.875M3 7.5h18" /></svg>`;
const defaultLogoUrl = typeof window !== 'undefined' ? `data:image/svg+xml;base64,${window.btoa(defaultLogoSvg)}` : '';


const defaultContent: PageContent = {
    appName: "EmaSaku",
    appVersion: "1.0.0",
    logoUrl: defaultLogoUrl,
    description: "EmaSaku adalah aplikasi tabungan digital modern yang dirancang untuk membantu Anda mengelola keuangan pribadi dan kelompok, iuran, donasi, serta dilengkapi dengan fitur marketplace dan penasihat keuangan berbasis AI untuk keputusan finansial yang lebih cerdas.",
    features: [
        { iconName: 'WalletIcon', title: "Manajemen Keuangan", description: "Kelola saldo, lacak riwayat transaksi, dan atur tujuan tabungan Anda dengan mudah." },
        { iconName: 'SparklesIcon', title: "AI Financial Advisor", description: "Dapatkan saran dan wawasan keuangan yang dipersonalisasi dari asisten AI cerdas kami." },
        { iconName: 'HeartIcon', title: "Donasi & Kebaikan", description: "Berpartisipasi dalam berbagai program donasi yang terverifikasi dan transparan." },
        { iconName: 'ShoppingCartIcon', title: "Marketplace (Jual Beli)", description: "Jual beli barang dengan aman dan mudah antar sesama anggota komunitas." },
        { iconName: 'UserGroupIcon', title: "Fitur Komunitas Lengkap", description: "Terhubung dengan anggota lain, bayar iuran, ikuti arisan, dan temukan berbagai fitur lainnya." },
    ],
    footerText: "Dibuat dengan ❤️ oleh Tim Developer EmaSaku"
};

const FeatureItem: React.FC<{ icon: ElementType, title: string, description: string }> = ({ icon: IconComponent, title, description }) => {
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

const TentangAplikasiPage: React.FC<TentangAplikasiPageProps> = ({ setActivePage, currentUser }) => {
    const [content, setContent] = useLocalStorage<PageContent>('tentang_aplikasi_content', defaultContent);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState<PageContent>(content);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSave = () => {
        setContent(editContent);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditContent(content);
        setIsEditing(false);
    };
    
    const handleFeatureChange = (index: number, field: 'title' | 'description', value: string) => {
        const newFeatures = [...editContent.features];
        newFeatures[index] = { ...newFeatures[index], [field]: value };
        setEditContent({ ...editContent, features: newFeatures });
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditContent({ ...editContent, logoUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex items-center mb-6">
                <button
                    onClick={() => setActivePage('Profile')}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-4"
                    aria-label="Kembali ke Profil"
                >
                    <ArrowLeftIcon className="w-6 h-6 text-text-primary dark:text-dark-text-primary" />
                </button>
                <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">
                    Tentang Aplikasi
                </h1>
            </div>

            {/* Main Content Card */}
            <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6 md:p-8 space-y-6 relative">
                 {currentUser.role === UserRole.DEVELOPER && !isEditing && (
                    <button onClick={() => setIsEditing(true)} className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-primary dark:text-gold-light bg-primary/10 dark:bg-gold-light/10 rounded-lg hover:bg-primary/20 dark:hover:bg-gold-light/20">
                        <PencilSquareIcon className="w-4 h-4" />
                        Ubah Konten
                    </button>
                )}
                {/* App Logo and Name */}
                <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-6">
                    {isEditing ? (
                        <>
                            <div className="relative w-16 h-16 mx-auto">
                                <img src={editContent.logoUrl} alt="Logo Preview" className="w-16 h-16 object-contain" />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute inset-0 bg-black/50 flex items-center justify-center text-white rounded-full opacity-0 hover:opacity-100 transition-opacity"
                                >
                                    <CameraIcon className="w-8 h-8"/>
                                </button>
                                <input type="file" ref={fileInputRef} onChange={handleLogoChange} className="hidden" accept="image/*" />
                            </div>
                             <input 
                                type="text"
                                value={editContent.appName}
                                onChange={(e) => setEditContent({ ...editContent, appName: e.target.value })}
                                className="w-full max-w-xs mx-auto mt-4 p-1 text-3xl font-bold text-center bg-slate-100 dark:bg-slate-700 rounded-md"
                             />
                            <div className="flex items-center justify-center mt-1">
                                <span className="text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Versi</span>
                                <input 
                                    type="text"
                                    value={editContent.appVersion}
                                    onChange={(e) => setEditContent({ ...editContent, appVersion: e.target.value })}
                                    className="w-20 p-0.5 ml-1 text-sm font-semibold text-center bg-slate-100 dark:bg-slate-700 rounded-md"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <img src={content.logoUrl} alt="App Logo" className="w-16 h-16 mx-auto" />
                            <h2 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary mt-4">{content.appName}</h2>
                            <p className="text-sm font-semibold text-text-secondary dark:text-dark-text-secondary mt-1">Versi {content.appVersion}</p>
                        </>
                    )}
                </div>

                {isEditing ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Deskripsi Aplikasi</label>
                            <textarea
                                value={editContent.description}
                                onChange={(e) => setEditContent({ ...editContent, description: e.target.value })}
                                className="w-full h-24 p-2 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Fitur Utama</label>
                            {editContent.features.map((feature, index) => (
                                <div key={index} className="p-2 border rounded-md mb-2 bg-slate-50 dark:bg-slate-800/50">
                                    <input
                                        type="text"
                                        value={feature.title}
                                        onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                                        className="w-full p-1 border-b font-bold bg-transparent"
                                    />
                                    <textarea
                                        value={feature.description}
                                        onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                                        className="w-full p-1 mt-1 text-sm h-16 bg-transparent"
                                    />
                                </div>
                            ))}
                        </div>
                         <div>
                            <label className="block text-sm font-medium mb-1">Teks Footer</label>
                             <input 
                                type="text"
                                value={editContent.footerText}
                                onChange={(e) => setEditContent({ ...editContent, footerText: e.target.value })}
                                className="w-full p-2 text-sm border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600"
                            />
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={handleCancel} className="px-4 py-2 text-sm font-semibold bg-slate-200 dark:bg-slate-700 rounded-lg">Batal</button>
                            <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg">Simpan</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div>
                            <p className="text-center text-text-secondary dark:text-dark-text-secondary leading-relaxed">
                                {content.description}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-text-primary dark:text-dark-text-primary mb-4 text-center">Fitur Utama</h3>
                            <div className="space-y-3">
                                {content.features.map((feature, index) => {
                                    const Icon = iconMap[feature.iconName] || WalletIcon;
                                    return <FeatureItem key={index} icon={Icon} title={feature.title} description={feature.description} />;
                                })}
                            </div>
                        </div>
                    </>
                )}

                {!isEditing && (
                    <div className="text-center border-t border-slate-200 dark:border-slate-700 pt-6">
                        <p className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">{content.footerText}</p>
                        <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1">
                            © {new Date().getFullYear()} {content.appName}. Seluruh hak cipta dilindungi.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TentangAplikasiPage;