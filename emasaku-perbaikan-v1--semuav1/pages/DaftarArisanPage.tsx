import React, { useState } from 'react';
import type { ElementType } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    GiftIcon as GiftIconSolid, 
    CheckBadgeIcon as CheckBadgeIconSolid, 
    CurrencyDollarIcon as CurrencyDollarIconSolid, 
    CalendarDaysIcon as CalendarDaysIconSolid,
    ShieldCheckIcon as ShieldCheckIconSolid
} from '@heroicons/react/24/solid';
import { User, ArisanRegistrationRequest } from '../types.ts';
import { formatToRupiah } from '../utils/formatter.ts';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const GiftIcon = (GiftIconSolid as any).default || GiftIconSolid;
const CheckBadgeIcon = (CheckBadgeIconSolid as any).default || CheckBadgeIconSolid;
const CurrencyDollarIcon = (CurrencyDollarIconSolid as any).default || CurrencyDollarIconSolid;
const CalendarDaysIcon = (CalendarDaysIconSolid as any).default || CalendarDaysIconSolid;
const ShieldCheckIcon = (ShieldCheckIconSolid as any).default || ShieldCheckIconSolid;

interface DaftarArisanPageProps {
  setActivePage: (page: string) => void;
  currentUser: User;
  onArisanRegistrationRequest: (formData: Omit<ArisanRegistrationRequest, 'id' | 'date' | 'userId' | 'userName' | 'userAvatar' | 'status'>) => void;
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


const DaftarArisanPage: React.FC<DaftarArisanPageProps> = ({ setActivePage, currentUser, onArisanRegistrationRequest }) => {
    const [formState, setFormState] = useState({
        groupName: '',
        feeAmount: '',
        paymentPeriod: 'Bulanan' as 'Mingguan' | 'Bulanan',
        memberCount: '',
        startDate: '',
        description: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { groupName, feeAmount, paymentPeriod, memberCount, startDate } = formState;
        if (!groupName || !feeAmount || !paymentPeriod || !memberCount || !startDate) {
            alert('Harap lengkapi semua data yang diperlukan.');
            return;
        }
        onArisanRegistrationRequest({
            ...formState,
            feeAmount: Number(feeAmount),
            memberCount: Number(memberCount),
        });
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="flex items-center mb-6">
                <button onClick={() => setActivePage('Arisan')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 mr-4">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3">
                    <GiftIcon className="w-8 h-8 text-primary dark:text-gold-light" />
                    <h1 className="text-2xl md:text-3xl font-bold">Buat Grup Arisan Baru</h1>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-center mb-4">Kelola Arisan Jadi Lebih Mudah & Transparan</h2>
                    <div className="space-y-3">
                        <BenefitCard icon={CheckBadgeIcon} title="Otomatis & Transparan" description="Sistem pengundian yang adil dan riwayat pembayaran yang tercatat otomatis." />
                        <BenefitCard icon={CalendarDaysIcon} title="Pengingat Otomatis" description="Anggota akan mendapatkan notifikasi pengingat saat jadwal pembayaran tiba." />
                        <BenefitCard icon={CurrencyDollarIcon} title="Pembayaran Mudah" description="Anggota dapat membayar iuran arisan langsung dari saldo EmaSaku." />
                    </div>
                </div>
                
                <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-center mb-6">Langkah Membuat Grup</h2>
                    <div className="space-y-6">
                        <HowToStep number={1} title="Isi Detail Grup" description="Lengkapi formulir pendaftaran grup arisan di bawah ini." />
                        <HowToStep number={2} title="Tunggu Persetujuan" description="Admin akan meninjau dan menyetujui pembuatan grup Anda." />
                        <HowToStep number={3} title="Undang Anggota" description="Setelah disetujui, Anda dapat mulai mengundang anggota untuk bergabung." />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6 space-y-4">
                    <h2 className="text-xl font-bold text-center mb-4">Formulir Pendaftaran Grup Arisan</h2>
                    
                    <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                        <p className="text-sm font-medium">Nama Penyelenggara: <span className="font-bold">{currentUser.name}</span></p>
                    </div>
                    
                    <div>
                        <label htmlFor="groupName" className="block text-sm font-medium">Nama Grup Arisan</label>
                        <input id="groupName" name="groupName" value={formState.groupName} onChange={handleInputChange} placeholder="Contoh: Arisan RT 05 Ceria" className="mt-1 w-full p-2 border rounded-md" required/>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label htmlFor="feeAmount" className="block text-sm font-medium">Jumlah Iuran per Anggota (Rp)</label>
                           <input id="feeAmount" name="feeAmount" type="number" value={formState.feeAmount} onChange={handleInputChange} placeholder="Contoh: 100000" className="mt-1 w-full p-2 border rounded-md" required/>
                        </div>
                        <div>
                            <label htmlFor="paymentPeriod" className="block text-sm font-medium">Periode Pembayaran</label>
                             <select id="paymentPeriod" name="paymentPeriod" value={formState.paymentPeriod} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md" required>
                                <option>Bulanan</option>
                                <option>Mingguan</option>
                            </select>
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label htmlFor="memberCount" className="block text-sm font-medium">Jumlah Anggota</label>
                           <input id="memberCount" name="memberCount" type="number" value={formState.memberCount} onChange={handleInputChange} placeholder="Contoh: 10" className="mt-1 w-full p-2 border rounded-md" required/>
                        </div>
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium">Tanggal Mulai Arisan</label>
                            <input id="startDate" name="startDate" type="date" value={formState.startDate} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md" required/>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="description" className="block text-sm font-medium">Deskripsi Singkat (Opsional)</label>
                        <textarea id="description" name="description" value={formState.description} onChange={handleInputChange} placeholder="Contoh: Arisan untuk silaturahmi warga RT 05." rows={3} className="mt-1 w-full p-2 border rounded-md"></textarea>
                    </div>

                    <button type="submit" className="w-full bg-gradient-to-br from-gold-light to-gold-dark text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2">
                        <ShieldCheckIcon className="w-5 h-5"/>
                        Kirim Permintaan Grup
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DaftarArisanPage;