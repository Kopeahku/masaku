import React, { useState } from 'react';
import { ArrowLeftIcon as ArrowLeftIconSolid, DocumentTextIcon as DocumentTextIconSolid, PencilSquareIcon as PencilSquareIconSolid } from '@heroicons/react/24/solid';
import { User, UserRole } from '../types.ts';
import useLocalStorage from '../hooks/useLocalStorage.ts';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const DocumentTextIcon = (DocumentTextIconSolid as any).default || DocumentTextIconSolid;
const PencilSquareIcon = (PencilSquareIconSolid as any).default || PencilSquareIconSolid;

interface SyaratKetentuanPageProps {
  setActivePage: (page: string) => void;
  currentUser: User;
}

interface TermItem {
    title: string;
    content: string;
}

const defaultTerms: TermItem[] = [
    {
        title: "1. Persetujuan Pengguna",
        content: "<p>Selamat datang di EmaSaku! Dengan mengunduh, mendaftar, dan/atau menggunakan aplikasi kami (\"Layanan\"), Anda mengakui bahwa Anda telah membaca, memahami, dan setuju untuk terikat oleh Syarat dan Ketentuan ini, serta Kebijakan Privasi kami. Jika Anda tidak menyetujui ketentuan ini, mohon untuk tidak menggunakan Layanan kami.</p>"
    },
    {
        title: "2. Kebijakan Privasi dan Perlindungan Data (GDPR)",
        content: `
            <p>Kami sangat menghargai privasi Anda. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.</p>
            <h3 class="font-bold text-text-primary dark:text-dark-text-primary mt-2">Data yang Kami Kumpulkan:</h3>
            <ul class="list-disc pl-5 space-y-1">
                <li><strong>Informasi Pendaftaran:</strong> Nama, email, nomor telepon, dan data profil lainnya yang Anda berikan.</li>
                <li><strong>Data Transaksi:</strong> Riwayat top-up, penarikan, transfer, donasi, dan aktivitas keuangan lainnya di dalam aplikasi.</li>
                <li><strong>Data Penggunaan:</strong> Interaksi dengan fitur aplikasi, seperti AI Advisor, marketplace, dan fitur komunitas.</li>
                <li><strong>Informasi Teknis:</strong> Jenis perangkat, sistem operasi, dan pengidentifikasi unik perangkat untuk analisis dan keamanan.</li>
            </ul>
            <h3 class="font-bold text-text-primary dark:text-dark-text-primary mt-2">Bagaimana Kami Menggunakan Data Anda:</h3>
            <ul class="list-disc pl-5 space-y-1">
                <li>Untuk menyediakan, memelihara, dan meningkatkan Layanan kami.</li>
                <li>Untuk memproses transaksi dan mencegah penipuan.</li>
                <li>Untuk mempersonalisasi pengalaman Anda, termasuk saran dari AI Advisor.</li>
                <li>Untuk berkomunikasi dengan Anda mengenai pembaruan atau informasi penting.</li>
            </ul>
             <h3 class="font-bold text-text-primary dark:text-dark-text-primary mt-2">Hak Anda (Sesuai GDPR):</h3>
            <p>Anda memiliki hak untuk:</p>
            <ul class="list-disc pl-5 space-y-1">
                <li><strong>Mengakses</strong> data pribadi Anda yang kami simpan.</li>
                <li><strong>Memperbaiki</strong> data yang tidak akurat atau tidak lengkap.</li>
                <li><strong>Menghapus</strong> data Anda dari sistem kami ("hak untuk dilupakan") dalam kondisi tertentu.</li>
                <li><strong>Membatasi</strong> pemrosesan data Anda.</li>
                <li><strong>Meminta portabilitas data</strong>, yaitu menerima data Anda dalam format yang terstruktur dan dapat dibaca mesin.</li>
            </ul>
            <p>Untuk menggunakan hak-hak ini, silakan hubungi kami melalui informasi kontak yang tersedia.</p>
        `
    },
    {
        title: "3. Kepatuhan Terhadap Kebijakan Google Play Store",
        content: `
            <p>EmaSaku berkomitmen untuk mematuhi semua kebijakan yang ditetapkan oleh Google Play Store. Hal ini mencakup:</p>
            <ul class="list-disc pl-5 space-y-1">
                <li><strong>Konten Terlarang:</strong> Pengguna dilarang keras untuk mengunggah atau membagikan konten yang mengandung ujaran kebencian, kekerasan, pelecehan, konten seksual eksplisit, atau aktivitas ilegal lainnya melalui fitur komunitas atau marketplace kami.</li>
                <li><strong>Konten Buatan Pengguna (UGC):</strong> Kami akan melakukan moderasi terhadap konten yang diunggah pengguna (misalnya, di fitur Jual Beli dan Komunitas) dan akan menghapus konten yang melanggar kebijakan kami tanpa pemberitahuan sebelumnya. Pengguna dapat melaporkan konten yang tidak pantas.</li>
                <li><strong>Monetisasi dan Pembayaran:</strong> Semua transaksi keuangan dalam aplikasi diproses melalui sistem yang aman. Biaya layanan (jika ada) akan ditampilkan secara transparan sebelum Anda melakukan transaksi.</li>
                <li><strong>Kekayaan Intelektual:</strong> Pengguna harus menghormati hak cipta dan merek dagang. Dilarang mengunggah konten yang melanggar kekayaan intelektual pihak lain.</li>
            </ul>
        `
    },
    {
        title: "4. Penggunaan Layanan",
        content: `
            <p>Anda setuju untuk menggunakan EmaSaku hanya untuk tujuan yang sah dan sesuai dengan hukum yang berlaku. Anda bertanggung jawab penuh atas keamanan akun Anda, termasuk menjaga kerahasiaan kata sandi.</p>
            <ul class="list-disc pl-5 space-y-1">
                <li><strong>Fitur AI Advisor:</strong> Saran yang diberikan oleh AI Advisor bersifat informatif dan tidak boleh dianggap sebagai nasihat keuangan profesional. Keputusan finansial tetap menjadi tanggung jawab Anda sepenuhnya.</li>
                <li><strong>Fitur Jual Beli:</strong> EmaSaku bertindak sebagai platform. Kami tidak bertanggung jawab atas kualitas, keamanan, atau legalitas barang yang diperjualbelikan. Transaksi dilakukan atas risiko pengguna sendiri.</li>
                <li><strong>Fitur Donasi:</strong> Kami bekerja sama dengan mitra terpercaya untuk menyalurkan donasi. Laporan penyaluran akan disediakan untuk transparansi.</li>
            </ul>
        `
    },
    {
        title: "5. Batasan Tanggung Jawab",
        content: "<p>Layanan EmaSaku disediakan \"sebagaimana adanya\". Kami tidak menjamin bahwa Layanan akan selalu bebas dari gangguan, kesalahan, atau bug. Sejauh diizinkan oleh hukum, EmaSaku tidak bertanggung jawab atas kerugian langsung maupun tidak langsung yang timbul dari penggunaan atau ketidakmampuan menggunakan Layanan kami.</p>"
    },
    {
        title: "6. Pemberhentian Akun",
        content: "<p>Kami berhak menangguhkan atau menghapus akun Anda jika kami menemukan adanya pelanggaran terhadap Syarat & Ketentuan ini atau aktivitas yang merugikan Layanan atau pengguna lain. Anda juga dapat mengajukan permohonan penghapusan akun melalui menu profil.</p>"
    },
    {
        title: "7. Perubahan Ketentuan",
        content: "<p>Kami dapat mengubah Syarat & Ketentuan ini dari waktu ke waktu. Kami akan memberitahu Anda tentang perubahan signifikan melalui notifikasi dalam aplikasi atau email. Dengan terus menggunakan Layanan setelah perubahan berlaku, Anda dianggap menyetujui ketentuan yang baru.</p>"
    },
    {
        title: "8. Kontak Kami",
        content: `<p>Jika Anda memiliki pertanyaan mengenai Syarat & Ketentuan ini, silakan hubungi kami melalui fitur "Hubungi Admin" di aplikasi atau kirim email ke: <a href="mailto:dukungan@emasaku.com" class="text-primary hover:underline">dukungan@emasaku.com</a>.</p>`
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


const SyaratKetentuanPage: React.FC<SyaratKetentuanPageProps> = ({ setActivePage, currentUser }) => {
    const lastUpdated = "1 Agustus 2024";
    const [termsContent, setTermsContent] = useLocalStorage<TermItem[]>('terms_content', defaultTerms);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState<TermItem[]>(termsContent);

    const handleSave = () => {
        setTermsContent(editContent);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditContent(termsContent);
        setIsEditing(false);
    };
    
    const handleTextChange = (index: number, field: 'title' | 'content', value: string) => {
        setEditContent(prev => {
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
                    <DocumentTextIcon className="w-8 h-8 text-primary dark:text-gold-light" />
                    <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">
                        Syarat & Ketentuan
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
                        {editContent.map((item, index) => (
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
                    termsContent.map(item => (
                        <Section key={item.title} title={item.title} content={item.content} />
                    ))
                )}
            </div>
        </div>
    );
};

export default SyaratKetentuanPage;