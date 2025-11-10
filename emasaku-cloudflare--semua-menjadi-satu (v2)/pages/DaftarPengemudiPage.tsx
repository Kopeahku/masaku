import React, { useState, useRef } from 'react';
import type { ElementType } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    TruckIcon as TruckIconSolid, 
    CheckBadgeIcon as CheckBadgeIconSolid, 
    CurrencyDollarIcon as CurrencyDollarIconSolid, 
    ClockIcon as ClockIconSolid,
    CameraIcon as CameraIconSolid,
    CheckCircleIcon as CheckCircleIconSolid,
    ClipboardDocumentListIcon as ClipboardDocumentListIconSolid,
    UserCircleIcon as UserCircleIconSolid,
    ShieldCheckIcon as ShieldCheckIconSolid
} from '@heroicons/react/24/solid';
import { User, DriverRegistrationRequest } from '../types.ts';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const TruckIcon = (TruckIconSolid as any).default || TruckIconSolid;
const CheckBadgeIcon = (CheckBadgeIconSolid as any).default || CheckBadgeIconSolid;
const CurrencyDollarIcon = (CurrencyDollarIconSolid as any).default || CurrencyDollarIconSolid;
const ClockIcon = (ClockIconSolid as any).default || ClockIconSolid;
const CameraIcon = (CameraIconSolid as any).default || CameraIconSolid;
const CheckCircleIcon = (CheckCircleIconSolid as any).default || CheckCircleIconSolid;
const ClipboardDocumentListIcon = (ClipboardDocumentListIconSolid as any).default || ClipboardDocumentListIconSolid;
const UserCircleIcon = (UserCircleIconSolid as any).default || UserCircleIconSolid;
const ShieldCheckIcon = (ShieldCheckIconSolid as any).default || ShieldCheckIconSolid;


interface DaftarPengemudiPageProps {
  setActivePage: (page: string) => void;
  currentUser: User;
  onDriverRegistrationRequest: (formData: Omit<DriverRegistrationRequest, 'id' | 'date' | 'userId' | 'userName' | 'userAvatar' | 'status'>) => void;
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

const FileUploadField: React.FC<{ label: string, onUpload: (file: File) => void, preview: string | null, id: string }> = ({ label, onUpload, preview, id }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    return (
        <div>
            <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-2">{label}</label>
            <div 
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
            >
                <div className="space-y-1 text-center">
                    {preview ? (
                        <>
                            <img src={preview} alt="Preview" className="mx-auto h-24 w-auto rounded-md" />
                             <p className="text-xs text-green-500 flex items-center justify-center gap-1"><CheckCircleIcon className="w-4 h-4"/> Berhasil diunggah. Klik untuk ganti.</p>
                        </>
                    ) : (
                        <>
                            <CameraIcon className="mx-auto h-12 w-12 text-slate-400" />
                            <p className="text-sm text-slate-600 dark:text-slate-400">Klik untuk unggah foto</p>
                            <p className="text-xs text-slate-500">PNG, JPG, GIF hingga 10MB</p>
                        </>
                    )}
                </div>
                <input ref={fileInputRef} id={id} name={id} type="file" className="sr-only" onChange={e => e.target.files && onUpload(e.target.files[0])} accept="image/*" />
            </div>
        </div>
    );
};


const DaftarPengemudiPage: React.FC<DaftarPengemudiPageProps> = ({ setActivePage, currentUser, onDriverRegistrationRequest }) => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formState, setFormState] = useState({
        vehicleType: 'Motor' as 'Motor' | 'Mobil',
        licensePlate: '',
        vehicleModel: '',
    });
    const [files, setFiles] = useState<{ sim: string | null, stnk: string | null, diri: string | null }>({
        sim: null,
        stnk: null,
        diri: null
    });

    const handleFileChange = (id: 'sim' | 'stnk' | 'diri', file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setFiles(prev => ({ ...prev, [id]: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formState.licensePlate || !formState.vehicleModel || !files.sim || !files.stnk || !files.diri) {
            alert('Harap lengkapi semua data dan unggah semua dokumen yang diperlukan.');
            return;
        }
        onDriverRegistrationRequest(formState);
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="max-w-2xl mx-auto text-center bg-surface dark:bg-dark-surface p-8 rounded-xl shadow-lg animate-fade-in">
                <CheckCircleIcon className="w-16 h-16 mx-auto text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">Pendaftaran Terkirim!</h2>
                <p className="text-text-secondary dark:text-dark-text-secondary mt-2 mb-6">
                    Terima kasih telah mendaftar. Tim kami akan meninjau aplikasi Anda dan akan memberitahu Anda melalui notifikasi setelah proses verifikasi selesai (biasanya 1-2 hari kerja).
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
                <button onClick={() => setActivePage('Peluang Mitra')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 mr-4">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3">
                    <TruckIcon className="w-8 h-8 text-primary dark:text-gold-light" />
                    <h1 className="text-2xl md:text-3xl font-bold">Jadi Mitra Pengemudi</h1>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-center mb-4">Dapatkan Penghasilan Tambahan dengan Jam Fleksibel</h2>
                    <div className="space-y-3">
                        <BenefitCard icon={CurrencyDollarIcon} title="Penghasilan Kompetitif" description="Dapatkan bayaran untuk setiap perjalanan dan pengantaran yang Anda selesaikan." />
                        <BenefitCard icon={ClockIcon} title="Waktu Fleksibel" description="Anda yang menentukan kapan mau online dan menerima pesanan." />
                        <BenefitCard icon={CheckBadgeIcon} title="Aman & Terpercaya" description="Bergabung dengan platform terverifikasi yang mengutamakan keamanan." />
                    </div>
                </div>
                
                <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-center mb-6">3 Langkah Mudah untuk Memulai</h2>
                    <div className="space-y-6">
                        <HowToStep number={1} title="Lengkapi Data" description="Isi formulir pendaftaran di bawah ini dan unggah dokumen yang diperlukan." />
                        <HowToStep number={2} title="Verifikasi" description="Tim kami akan memeriksa kelengkapan dan keabsahan dokumen Anda." />
                        <HowToStep number={3} title="Mulai Ambil Pesanan" description="Setelah disetujui, aktifkan status online Anda dan mulailah menghasilkan!" />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6 space-y-4">
                    <h2 className="text-xl font-bold text-center mb-4">Formulir Pendaftaran</h2>
                    
                    <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                        <p className="text-sm font-medium">Nama Pendaftar: <span className="font-bold">{currentUser.name}</span></p>
                        <p className="text-sm font-medium">No. Telepon: <span className="font-bold">{currentUser.whatsapp || 'Tidak ada'}</span></p>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-2">Jenis Kendaraan</label>
                        <div className="grid grid-cols-2 gap-2">
                             <label className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer ${formState.vehicleType === 'Motor' ? 'border-primary bg-primary/10' : 'border-slate-300 dark:border-slate-600'}`}>
                                <input type="radio" name="vehicleType" value="Motor" checked={formState.vehicleType === 'Motor'} onChange={handleInputChange} className="h-4 w-4 text-primary focus:ring-primary"/>
                                Motor
                            </label>
                            <label className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer ${formState.vehicleType === 'Mobil' ? 'border-primary bg-primary/10' : 'border-slate-300 dark:border-slate-600'}`}>
                                <input type="radio" name="vehicleType" value="Mobil" checked={formState.vehicleType === 'Mobil'} onChange={handleInputChange} className="h-4 w-4 text-primary focus:ring-primary"/>
                                Mobil
                            </label>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="licensePlate" value={formState.licensePlate} onChange={handleInputChange} placeholder="Nomor Polisi (e.g. B 1234 ABC)" className="p-2 border rounded-md" required/>
                        <input name="vehicleModel" value={formState.vehicleModel} onChange={handleInputChange} placeholder="Merek & Model Kendaraan" className="p-2 border rounded-md" required/>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FileUploadField label="Foto SIM" id="sim" preview={files.sim} onUpload={(file) => handleFileChange('sim', file)} />
                        <FileUploadField label="Foto STNK" id="stnk" preview={files.stnk} onUpload={(file) => handleFileChange('stnk', file)} />
                        <FileUploadField label="Foto Diri & Kendaraan" id="diri" preview={files.diri} onUpload={(file) => handleFileChange('diri', file)} />
                    </div>

                    <button type="submit" className="w-full bg-gradient-to-br from-gold-light to-gold-dark text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2">
                        <ShieldCheckIcon className="w-5 h-5"/>
                        Kirim Pendaftaran
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DaftarPengemudiPage;