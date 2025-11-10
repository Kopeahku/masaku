import React, { useState } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    ShieldCheckIcon as ShieldCheckIconSolid, 
    PencilSquareIcon as PencilSquareIconSolid 
} from '@heroicons/react/24/solid';
import { User, UserRole } from '../types.ts';
import useLocalStorage from '../hooks/useLocalStorage.ts';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const ShieldCheckIcon = (ShieldCheckIconSolid as any).default || ShieldCheckIconSolid;
const PencilSquareIcon = (PencilSquareIconSolid as any).default || PencilSquareIconSolid;

interface KebijakanPrivasiPageProps {
  setActivePage: (page: string) => void;
  currentUser: User;
}

interface PolicyItem {
    title: string;
    content: string;
}

const defaultPolicies: PolicyItem[] = [
    {
        title: "1. Pendahuluan",
        content: "<p>EmaSaku (\"kami\") berkomitmen untuk melindungi privasi dan keamanan data pribadi pengguna kami (\"Anda\"). Kebijakan Privasi ini menjelaskan jenis informasi yang kami kumpulkan, bagaimana informasi tersebut digunakan dan dilindungi, serta hak-hak yang Anda miliki terkait data pribadi Anda saat menggunakan aplikasi EmaSaku (\"Layanan\").</p>"
    },
    {
        title: "2. Informasi yang Kami Kumpulkan",
        content: "<p>Untuk menyediakan layanan yang optimal, kami mengumpulkan beberapa jenis informasi:</p><ul class=\"list-disc pl-5 space-y-1\"><li><strong>Data Identitas Pribadi:</strong> Informasi yang Anda berikan saat mendaftar, seperti nama, alamat email, dan nomor telepon.</li><li><strong>Data Transaksi Keuangan:</strong> Detail transaksi yang Anda lakukan melalui aplikasi, termasuk top-up, penarikan, transfer, pembayaran iuran, donasi, dan aktivitas jual beli.</li><li><strong>Data Penggunaan Aplikasi:</strong> Informasi tentang bagaimana Anda berinteraksi dengan fitur-fitur kami, seperti pertanyaan yang diajukan kepada AI Advisor, halaman yang dikunjungi, dan fitur yang paling sering digunakan.</li><li><strong>Informasi Perangkat dan Teknis:</strong> Jenis perangkat, sistem operasi, alamat IP, dan pengidentifikasi unik perangkat untuk tujuan keamanan, analisis, dan perbaikan layanan.</li></ul>"
    },
    {
        title: "3. Bagaimana Kami Menggunakan Informasi Anda",
        content: "<p>Informasi Anda kami gunakan untuk tujuan berikut:</p><ul class=\"list-disc pl-5 space-y-1\"><li><strong>Menyediakan dan Mengelola Layanan:</strong> Untuk memproses pendaftaran, memverifikasi identitas, mengelola transaksi, dan memastikan fungsionalitas aplikasi.</li><li><strong>Personalisasi Pengalaman:</strong> Untuk memberikan konten yang relevan, seperti saran dari AI Advisor yang didasarkan pada data transaksi Anda (data dianonimkan untuk analisis).</li><li><strong>Keamanan dan Pencegahan Penipuan:</strong> Untuk melindungi akun Anda, mendeteksi aktivitas mencurigakan, dan menjaga keamanan platform.</li><li><strong>Komunikasi:</strong> Untuk mengirimkan notifikasi penting terkait transaksi, pembaruan layanan, atau perubahan kebijakan.</li><li><strong>Analisis dan Peningkatan:</strong> Untuk memahami bagaimana layanan kami digunakan, sehingga kami dapat terus melakukan inovasi dan perbaikan.</li></ul>"
    },
    {
        title: "4. Pembagian Informasi Anda",
        content: "<p>Kami tidak menjual atau menyewakan data pribadi Anda kepada pihak ketiga. Kami hanya membagikan informasi Anda dalam situasi berikut:</p><ul class=\"list-disc pl-5 space-y-1\"><li><strong>Dengan Persetujuan Anda:</strong> Jika kami perlu membagikan data Anda untuk tujuan lain, kami akan meminta persetujuan eksplisit dari Anda terlebih dahulu.</li><li><strong>Untuk Kepatuhan Hukum:</strong> Jika diwajibkan oleh hukum, seperti perintah pengadilan atau permintaan sah dari aparat penegak hukum.</li><li><strong>Penyedia Layanan Pihak Ketiga:</strong> Kami mungkin menggunakan layanan pihak ketiga (misalnya, untuk infrastruktur cloud atau pemrosesan pembayaran) yang terikat kontrak untuk menjaga kerahasiaan dan keamanan data Anda.</li></ul>"
    },
    {
        title: "5. Keamanan Data",
        content: "<p>Kami menerapkan langkah-langkah keamanan teknis dan organisasional yang wajar untuk melindungi data pribadi Anda dari akses tidak sah, perubahan, pengungkapan, atau penghancuran. Ini termasuk enkripsi data, kontrol akses, dan audit keamanan rutin. Namun, tidak ada sistem transmisi atau penyimpanan data yang 100% aman.</p>"
    },
    {
        title: "6. Hak-Hak Anda (Sesuai GDPR)",
        content: "<p>Sebagai pengguna, Anda memiliki hak-hak berikut atas data pribadi Anda:</p><ul class=\"list-disc pl-5 space-y-1\"><li><strong>Hak Akses:</strong> Anda berhak meminta salinan informasi pribadi yang kami miliki tentang Anda.</li><li><strong>Hak Rektifikasi:</strong> Anda berhak meminta kami untuk memperbaiki informasi yang tidak akurat atau melengkapi informasi yang kurang.</li><li><strong>Hak untuk Dihapus (Right to be Forgotten):</strong> Anda dapat meminta penghapusan akun dan data pribadi Anda dalam kondisi tertentu.</li><li><strong>Hak untuk Membatasi Pemrosesan:</strong> Anda berhak meminta kami untuk membatasi cara kami menggunakan data Anda.</li></ul><p>Untuk melaksanakan hak-hak ini, silakan hubungi kami melalui detail kontak di bawah ini. Permintaan Anda akan kami proses sesuai dengan hukum yang berlaku.</p>"
    },
    {
        title: "7. Privasi Anak-Anak",
        content: "<p>Layanan kami tidak ditujukan untuk individu di bawah usia 13 tahun (atau batas usia lain yang relevan di yurisdiksi Anda). Kami tidak secara sengaja mengumpulkan data pribadi dari anak-anak. Jika kami mengetahui adanya data tersebut, kami akan segera mengambil langkah untuk menghapusnya.</p>"
    },
    {
        title: "8. Perubahan pada Kebijakan Ini",
        content: "<p>Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan signifikan akan diberitahukan kepada Anda melalui notifikasi di dalam aplikasi. Kami menganjurkan Anda untuk meninjau kebijakan ini secara berkala.</p>"
    },
    {
        title: "9. Kontak Kami",
        content: "<p>Jika Anda memiliki pertanyaan atau kekhawatiran tentang Kebijakan Privasi ini atau praktik data kami, silakan hubungi kami melalui fitur \"Hubungi Admin\" di aplikasi atau melalui email di: <a href=\"mailto:privacy@emasaku.com\" class=\"text-primary hover:underline\">privacy@emasaku.com</a>.</p>"
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

const KebijakanPrivasiPage: React.FC<KebijakanPrivasiPageProps> = ({ setActivePage, currentUser }) => {
    const lastUpdated = "1 Agustus 2024";
    const [policies, setPolicies] = useLocalStorage<PolicyItem[]>('kebijakan_privasi_content', defaultPolicies);
    const [isEditing, setIsEditing] = useState(false);
    const [editPolicies, setEditPolicies] = useState<PolicyItem[]>(policies);

    const handleSave = () => {
        setPolicies(editPolicies);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditPolicies(policies);
        setIsEditing(false);
    };

    const handleTextChange = (index: number, field: 'title' | 'content', value: string) => {
        const newPolicies = [...editPolicies];
        newPolicies[index] = { ...newPolicies[index], [field]: value };
        setEditPolicies(newPolicies);
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
                    <ShieldCheckIcon className="w-8 h-8 text-primary dark:text-gold-light" />
                    <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">
                        Kebijakan Privasi
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
                        {editPolicies.map((item, index) => (
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
                                    className="w-full h-32 p-2 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600 font-mono text-xs"
                                />
                            </div>
                        ))}
                         <div className="flex justify-end gap-2 mt-4">
                            <button onClick={handleCancel} className="px-4 py-2 text-sm font-semibold bg-slate-200 dark:bg-slate-700 rounded-lg">Batal</button>
                            <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg">Simpan</button>
                        </div>
                    </div>
                ) : (
                    policies.map(policy => (
                        <Section key={policy.title} title={policy.title}>
                            <div dangerouslySetInnerHTML={{ __html: policy.content }} />
                        </Section>
                    ))
                )}
            </div>
        </div>
    );
};

export default KebijakanPrivasiPage;