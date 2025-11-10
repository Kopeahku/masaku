import React, { useState } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    ExclamationTriangleIcon as ExclamationTriangleIconSolid, 
    PencilSquareIcon as PencilSquareIconSolid, 
    ChevronDownIcon as ChevronDownIconSolid 
} from '@heroicons/react/24/solid';
import { User, UserRole } from '../types.ts';
import useLocalStorage from '../hooks/useLocalStorage.ts';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const ExclamationTriangleIcon = (ExclamationTriangleIconSolid as any).default || ExclamationTriangleIconSolid;
const PencilSquareIcon = (PencilSquareIconSolid as any).default || PencilSquareIconSolid;
const ChevronDownIcon = (ChevronDownIconSolid as any).default || ChevronDownIconSolid;

interface DisclaimerPageProps {
  setActivePage: (page: string) => void;
  currentUser: User;
}

interface DisclaimerItem {
    title: string;
    content: string;
}

const defaultDisclaimerItems: DisclaimerItem[] = [
    {
        title: "1. Tujuan Informasi Umum",
        content: "<p>Informasi yang disediakan oleh aplikasi EmaSaku (\"Layanan\"), termasuk namun tidak terbatas pada data, grafik, kalkulator, dan output dari AI Financial Advisor, hanya ditujukan untuk tujuan informasi dan edukasi umum. Konten yang disajikan tidak dimaksudkan sebagai pengganti nasihat profesional.</p>"
    },
    {
        title: "2. Bukan Nasihat Keuangan Profesional",
        content: "<p>EmaSaku <strong>bukanlah</strong> penasihat keuangan, hukum, atau pajak berlisensi. Informasi yang diberikan melalui Layanan, terutama dari fitur AI Financial Advisor, bersifat umum dan tidak disesuaikan dengan situasi finansial pribadi Anda. <strong>Jangan menganggap informasi ini sebagai nasihat investasi, keuangan, hukum, atau pajak.</strong> Anda harus selalu berkonsultasi dengan profesional yang berkualifikasi sebelum membuat keputusan finansial apa pun.</p>"
    },
    {
        title: "3. Keterbatasan AI Financial Advisor",
        content: "<p>AI Financial Advisor adalah alat bantu berbasis kecerdasan buatan yang menghasilkan respons berdasarkan data dan pola yang ada. Tanggapan yang diberikan mungkin tidak selalu akurat, lengkap, atau relevan dengan kondisi Anda. AI dapat membuat kesalahan, salah menafsirkan pertanyaan, atau memberikan informasi yang usang. Anda tidak boleh mengandalkan sepenuhnya pada saran dari AI untuk membuat keputusan penting.</p>"
    },
    {
        title: "4. Akurasi Informasi",
        content: "<p>Meskipun kami berusaha untuk menyajikan informasi yang akurat dan terkini, kami tidak memberikan jaminan atau garansi apa pun mengenai kelengkapan, keandalan, atau keakuratan informasi di dalam aplikasi. Data, termasuk data transaksi (yang dalam versi ini mungkin merupakan data tiruan/mock), dapat mengandung kesalahan atau ketidakakuratan.</p>"
    },
    {
        title: "5. Tanggung Jawab Pengguna",
        content: "<p>Anda bertanggung jawab penuh atas semua keputusan dan tindakan yang Anda ambil berdasarkan informasi yang diperoleh dari Layanan kami. EmaSaku, pemilik, dan pengembangnya tidak bertanggung jawab atas kerugian, kerusakan, atau konsekuensi apa pun yang timbul secara langsung atau tidak langsung dari penggunaan informasi yang disediakan dalam aplikasi ini.</p>"
    },
    {
        title: "6. Risiko Investasi dan Keuangan",
        content: "<p>Semua bentuk investasi dan keputusan keuangan mengandung risiko. Kinerja masa lalu tidak menjamin hasil di masa depan. EmaSaku tidak menjamin keuntungan atau hasil apa pun dari keputusan yang Anda buat.</p>"
    },
    {
        title: "7. Perubahan dan Ketersediaan Layanan",
        content: "<p>Kami berhak untuk mengubah, menangguhkan, atau menghentikan bagian mana pun dari Layanan setiap saat tanpa pemberitahuan sebelumnya.</p>"
    },
    {
        title: "8. Penerimaan Disclaimer",
        content: "<p>Dengan menggunakan aplikasi EmaSaku, Anda mengakui bahwa Anda telah membaca, memahami, dan menyetujui seluruh isi dari disclaimer ini.</p>"
    }
];

const Section: React.FC<{ title: string, content: string }> = ({ title, content }) => (
    <div className="mb-6">
        <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary mb-3 border-b-2 border-primary/20 pb-2">{title}</h2>
        <div 
            className="space-y-3 text-sm text-text-secondary dark:text-dark-text-secondary leading-relaxed prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: content }}
        />
    </div>
);

const DisclaimerPage: React.FC<DisclaimerPageProps> = ({ setActivePage, currentUser }) => {
    const lastUpdated = "1 Agustus 2024";
    const [disclaimerItems, setDisclaimerItems] = useLocalStorage<DisclaimerItem[]>('disclaimer_content', defaultDisclaimerItems);
    const [isEditing, setIsEditing] = useState(false);
    const [editItems, setEditItems] = useState<DisclaimerItem[]>(disclaimerItems);

    const handleSave = () => {
        setDisclaimerItems(editItems);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditItems(disclaimerItems);
        setIsEditing(false);
    };

    const handleTextChange = (index: number, field: 'title' | 'content', value: string) => {
        setEditItems(prev => {
            const newItems = [...prev];
            newItems[index] = { ...newItems[index], [field]: value };
            return newItems;
        });
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
                <div className="flex items-center gap-3">
                    <ExclamationTriangleIcon className="w-8 h-8 text-primary dark:text-gold-light" />
                    <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">
                        Disclaimer
                    </h1>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6 md:p-8 relative">
                {currentUser.role === UserRole.DEVELOPER && !isEditing && (
                    <button onClick={() => setIsEditing(true)} className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-primary dark:text-gold-light bg-primary/10 dark:bg-gold-light/10 rounded-lg hover:bg-primary/20 dark:hover:bg-gold-light/20">
                        <PencilSquareIcon className="w-4 h-4" />
                        Ubah Konten
                    </button>
                )}

                <p className="text-xs text-text-secondary dark:text-dark-text-secondary mb-6">Terakhir diperbarui: {lastUpdated}</p>

                {isEditing ? (
                    <div className="space-y-4">
                        {editItems.map((item, index) => (
                            <div key={index} className="p-3 border rounded-lg">
                                <label className="block text-xs font-medium">Judul Poin #{index + 1}</label>
                                <input 
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => handleTextChange(index, 'title', e.target.value)}
                                    className="w-full p-1 border-b mb-2 font-bold bg-white dark:bg-slate-800 dark:border-slate-600"
                                />
                                <label className="block text-xs font-medium">Isi Konten (mendukung HTML)</label>
                                <textarea 
                                    value={item.content}
                                    onChange={(e) => handleTextChange(index, 'content', e.target.value)}
                                    className="w-full h-24 p-2 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600 font-mono text-xs"
                                />
                            </div>
                        ))}
                         <div className="flex justify-end gap-2 mt-4">
                            <button onClick={handleCancel} className="px-4 py-2 text-sm font-semibold bg-slate-200 dark:bg-slate-700 rounded-lg">Batal</button>
                            <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg">Simpan</button>
                        </div>
                    </div>
                ) : (
                    disclaimerItems.map(item => (
                        <Section key={item.title} title={item.title} content={item.content} />
                    ))
                )}
            </div>
        </div>
    );
};

export default DisclaimerPage;