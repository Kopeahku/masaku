import React, { useState, useRef } from 'react';
import type { ElementType } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    BuildingStorefrontIcon as BuildingStorefrontIconSolid, 
    CheckBadgeIcon as CheckBadgeIconSolid, 
    CurrencyDollarIcon as CurrencyDollarIconSolid, 
    ClipboardDocumentListIcon as ClipboardDocumentListIconSolid,
    CameraIcon as CameraIconSolid,
    CheckCircleIcon as CheckCircleIconSolid,
    SparklesIcon as SparklesIconSolid
} from '@heroicons/react/24/solid';
import { User } from '../types.ts';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const BuildingStorefrontIcon = (BuildingStorefrontIconSolid as any).default || BuildingStorefrontIconSolid;
const CheckBadgeIcon = (CheckBadgeIconSolid as any).default || CheckBadgeIconSolid;
const CurrencyDollarIcon = (CurrencyDollarIconSolid as any).default || CurrencyDollarIconSolid;
const ClipboardDocumentListIcon = (ClipboardDocumentListIconSolid as any).default || ClipboardDocumentListIconSolid;
const CameraIcon = (CameraIconSolid as any).default || CameraIconSolid;
const CheckCircleIcon = (CheckCircleIconSolid as any).default || CheckCircleIconSolid;
const SparklesIcon = (SparklesIconSolid as any).default || SparklesIconSolid;

interface LaundryPartnerPageProps {
  setActivePage: (page: string) => void;
  currentUser: User;
  onPartnerRegistrationRequest: (formData: any) => void;
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

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string, id: string }> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">{label}</label>
        <input id={id} {...props} className="w-full p-2 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600 focus:ring-2 focus:ring-primary focus:outline-none" />
    </div>
);

const CheckboxField: React.FC<{ label: string, id: string, checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, id, checked, onChange }) => (
    <label htmlFor={id} className="flex items-center gap-2 p-2 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600 cursor-pointer">
        <input type="checkbox" id={id} checked={checked} onChange={onChange} className="h-4 w-4 rounded text-primary focus:ring-primary" />
        <span className="text-sm font-medium">{label}</span>
    </label>
);

const LaundryPartnerPage: React.FC<LaundryPartnerPageProps> = ({ setActivePage, currentUser, onPartnerRegistrationRequest }) => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formState, setFormState] = useState({
        businessName: '',
        ownerName: currentUser.name,
        phone: currentUser.whatsapp || '',
        address: '',
        hours: '08:00 - 20:00',
        services: {
            kiloan: true,
            satuan: false,
            ekspres: false,
            setrika: false,
        },
    });
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };
    
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormState(prev => ({
            ...prev,
            services: { ...prev.services, [name]: checked }
        }));
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formState.businessName || !formState.address || !photoPreview) {
            alert('Harap lengkapi Nama Usaha, Alamat, dan Foto Tempat Usaha.');
            return;
        }
        onPartnerRegistrationRequest(formState);
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="max-w-2xl mx-auto text-center bg-surface dark:bg-dark-surface p-8 rounded-xl shadow-lg animate-fade-in">
                <CheckCircleIcon className="w-16 h-16 mx-auto text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">Pendaftaran Terkirim!</h2>
                <p className="text-text-secondary dark:text-dark-text-secondary mt-2 mb-6">
                    Terima kasih telah mendaftar. Tim kami akan meninjau aplikasi Anda dan akan memberitahu Anda melalui notifikasi setelah proses verifikasi selesai.
                </p>
                <button
                    onClick={() => setActivePage('Dashboard')}
                    className="bg-gradient-to-br from-gold-light to-gold-dark text-white hover:opacity-90 font-bold py-2 px-6 rounded-lg transition-colors"
                >
                    Kembali ke Dasbor
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="flex items-center mb-6">
                <button
                    onClick={() => setActivePage('Dashboard')}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-4"
                >
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3">
                    <BuildingStorefrontIcon className="w-8 h-8 text-primary dark:text-gold-light" />
                    <h1 className="text-2xl md:text-3xl font-bold">Jadi Mitra Cuci</h1>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-center mb-4">Kembangkan Usaha Laundry Anda Bersama Kami</h2>
                    <div className="space-y-3">
                        <BenefitCard icon={CurrencyDollarIcon} title="Tingkatkan Pendapatan" description="Dapatkan pelanggan baru dari ribuan pengguna aplikasi kami." />
                        <BenefitCard icon={ClipboardDocumentListIcon} title="Manajemen Mudah" description="Kelola pesanan masuk dengan mudah melalui dasbor mitra." />
                        <BenefitCard icon={CheckBadgeIcon} title="Jadilah Pilihan Utama" description="Tingkatkan kredibilitas usaha Anda dengan menjadi mitra terverifikasi." />
                    </div>
                </div>
                
                <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-center mb-6">Cukup 3 Langkah Mudah</h2>
                    <div className="space-y-6">
                        <HowToStep number={1} title="Isi Formulir" description="Lengkapi data usaha laundry Anda pada formulir di bawah ini." />
                        <HowToStep number={2} title="Verifikasi" description="Tim kami akan menghubungi dan melakukan verifikasi data usaha Anda." />
                        <HowToStep number={3} title="Mulai Terima Pesanan" description="Setelah terverifikasi, Anda siap menerima pesanan pertama!" />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6 space-y-4">
                    <h2 className="text-xl font-bold text-center mb-4">Formulir Pendaftaran Mitra</h2>
                    <InputField label="Nama Usaha Laundry" id="businessName" name="businessName" value={formState.businessName} onChange={handleInputChange} required />
                    <InputField label="Nama Pemilik" id="ownerName" name="ownerName" value={formState.ownerName} onChange={handleInputChange} required />
                    <InputField label="Nomor Telepon / WA" id="phone" name="phone" type="tel" value={formState.phone} onChange={handleInputChange} required />
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Alamat Lengkap Usaha</label>
                        <textarea id="address" name="address" value={formState.address} onChange={handleInputChange} rows={3} className="w-full p-2 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600 focus:ring-2 focus:ring-primary focus:outline-none" required></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-2">Layanan yang Ditawarkan</label>
                        <div className="grid grid-cols-2 gap-2">
                            <CheckboxField label="Kiloan" id="kiloan" name="kiloan" checked={formState.services.kiloan} onChange={handleCheckboxChange} />
                            <CheckboxField label="Satuan" id="satuan" name="satuan" checked={formState.services.satuan} onChange={handleCheckboxChange} />
                            <CheckboxField label="Ekspres" id="ekspres" name="ekspres" checked={formState.services.ekspres} onChange={handleCheckboxChange} />
                            <CheckboxField label="Setrika Saja" id="setrika" name="setrika" checked={formState.services.setrika} onChange={handleCheckboxChange} />
                        </div>
                    </div>
                    <InputField label="Jam Operasional" id="hours" name="hours" placeholder="Contoh: 08:00 - 20:00" value={formState.hours} onChange={handleInputChange} required />
                    <div>
                        <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-2">Foto Tempat Usaha</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                {photoPreview ? (
                                    <img src={photoPreview} alt="Preview" className="mx-auto h-24 w-auto rounded-md"/>
                                ) : (
                                    <CameraIcon className="mx-auto h-12 w-12 text-slate-400" />
                                )}
                                <div className="flex text-sm text-slate-600 dark:text-slate-400">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-dark-surface rounded-md font-medium text-primary dark:text-gold-light hover:text-primary-focus">
                                        <span>{photoPreview ? 'Ganti foto' : 'Unggah foto'}</span>
                                        <input id="file-upload" ref={fileInputRef} name="file-upload" type="file" className="sr-only" onChange={handlePhotoUpload} accept="image/*" />
                                    </label>
                                </div>
                                <p className="text-xs text-slate-500">Wajib diisi. Foto tampak depan usaha.</p>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-gradient-to-br from-gold-light to-gold-dark text-white font-bold py-3 px-4 rounded-lg transition-opacity hover:opacity-90 flex items-center justify-center gap-2">
                        <SparklesIcon className="w-5 h-5"/>
                        Daftar Sekarang
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LaundryPartnerPage;