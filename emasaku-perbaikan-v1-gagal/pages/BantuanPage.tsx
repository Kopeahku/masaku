import React, { useState } from 'react';
import type { ElementType } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    QuestionMarkCircleIcon as QuestionMarkCircleIconSolid, 
    ChevronDownIcon as ChevronDownIconSolid,
    HomeIcon as HomeIconSolid,
    WalletIcon as WalletIconSolid,
    SparklesIcon as SparklesIconSolid,
    UserGroupIcon as UserGroupIconSolid,
    BuildingLibraryIcon as BuildingLibraryIconSolid,
    WrenchScrewdriverIcon as WrenchScrewdriverIconSolid,
    UserCircleIcon as UserCircleIconSolid,
    PencilSquareIcon as PencilSquareIconSolid
} from '@heroicons/react/24/solid';
import { User, UserRole } from '../types.ts';
import useLocalStorage from '../hooks/useLocalStorage.ts';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const QuestionMarkCircleIcon = (QuestionMarkCircleIconSolid as any).default || QuestionMarkCircleIconSolid;
const ChevronDownIcon = (ChevronDownIconSolid as any).default || ChevronDownIconSolid;
const HomeIcon = (HomeIconSolid as any).default || HomeIconSolid;
const WalletIcon = (WalletIconSolid as any).default || WalletIconSolid;
const SparklesIcon = (SparklesIconSolid as any).default || SparklesIconSolid;
const UserGroupIcon = (UserGroupIconSolid as any).default || UserGroupIconSolid;
const BuildingLibraryIcon = (BuildingLibraryIconSolid as any).default || BuildingLibraryIconSolid;
const WrenchScrewdriverIcon = (WrenchScrewdriverIconSolid as any).default || WrenchScrewdriverIconSolid;
const UserCircleIcon = (UserCircleIconSolid as any).default || UserCircleIconSolid;
const PencilSquareIcon = (PencilSquareIconSolid as any).default || PencilSquareIconSolid;


interface BantuanPageProps {
  setActivePage: (page: string) => void;
  currentUser: User;
}

interface QAItem {
    question: string;
    answer: string;
}

interface FaqSectionData {
    id: string;
    title: string;
    iconName: string;
    qas: QAItem[];
}

const iconMap: { [key: string]: ElementType } = {
    HomeIcon, WalletIcon, SparklesIcon, UserGroupIcon, BuildingLibraryIcon, WrenchScrewdriverIcon, UserCircleIcon
};

const defaultFaqs: FaqSectionData[] = [
    {
        id: 'dasbor', title: 'Dasbor & Navigasi', iconName: 'HomeIcon', qas: [
            {
                question: "Apa saja yang ditampilkan di Dasbor?",
                answer: "<p>Dasbor adalah halaman utama Anda. Di sini Anda dapat melihat:</p><ul><li><strong>Total Saldo:</strong> Jumlah saldo Anda saat ini. Anda bisa menyembunyikan/menampilkan saldo dengan ikon mata.</li><li><strong>Tujuan Tabungan:</strong> Progres pencapaian target tabungan Anda.</li><li><strong>Tombol Aksi Cepat:</strong> Akses cepat ke fitur-fitur utama seperti Top Up, Tarik Saldo, Donasi, dll.</li><li><strong>Grafik Pertumbuhan Saldo:</strong> Visualisasi perkembangan saldo Anda dari waktu ke waktu.</li><li><strong>Aktivitas Terbaru:</strong> Daftar transaksi terakhir yang Anda lakukan.</li></ul>"
            },
            {
                question: "Bagaimana cara berpindah halaman?",
                answer: "<p>Anda dapat menggunakan:</p><ul><li><strong>Sidebar (Desktop):</strong> Menu navigasi di sebelah kiri layar.</li><li><strong>BottomNav (Mobile):</strong> Menu navigasi di bagian bawah layar.</li></ul><p>Cukup klik ikon atau nama menu untuk berpindah ke halaman yang diinginkan.</p>"
            }
        ]
    },
    {
        id: 'keuangan', title: 'Manajemen Keuangan', iconName: 'WalletIcon', qas: [
            {
                question: "Bagaimana cara mengisi saldo (Top Up)?",
                answer: "<ol><li>Dari Dasbor, klik tombol \"Top Up\".</li><li>Masukkan nominal jumlah yang ingin Anda isi. Anda juga bisa memilih nominal cepat yang tersedia.</li><li>Pilih metode pembayaran (Virtual Account, Gerai Retail, atau E-Wallet).</li><li>Pilih penyedia layanan (misal: BCA, Indomaret, GoPay).</li><li>Anda akan diberikan instruksi pembayaran. Ikuti instruksi tersebut.</li><li>Setelah pembayaran berhasil, klik tombol \"Konfirmasi Top Up\". Permintaan Anda akan diproses oleh admin.</li></ol>"
            },
            {
                question: "Bagaimana cara menarik saldo?",
                answer: "<ol><li>Dari Dasbor, klik tombol \"Tarik Saldo\".</li><li>Masukkan jumlah yang ingin ditarik.</li><li>Pilih rekening bank tujuan Anda dari daftar. Jika belum ada, tambahkan rekening baru.</li><li>Periksa rincian penarikan, termasuk biaya admin.</li><li>Klik \"Ajukan Penarikan Dana\". Permintaan Anda akan diproses oleh admin.</li></ol>"
            }
        ]
    },
    // ... other sections similarly structured ...
     {
        id: 'ai', title: 'AI Financial Advisor', iconName: 'SparklesIcon', qas: [
            { question: "Apa itu AI Advisor?", answer: "<p>AI Advisor adalah asisten keuangan cerdas yang dapat membantu Anda menganalisis data transaksi. Anda bisa bertanya dalam bahasa sehari-hari untuk mendapatkan ringkasan, saran, atau analisis tentang keuangan Anda di aplikasi ini.</p>" },
            { question: "Bagaimana cara menggunakannya?", answer: "<ol><li>Buka halaman \"AI Advisor\" dari menu navigasi.</li><li>Ketik pertanyaan Anda di kolom input di bagian bawah.</li><li>Tekan tombol kirim. AI akan menganalisis data transaksi Anda dan memberikan jawaban.</li><li>Contoh pertanyaan: \"Berapa total pengeluaranku untuk donasi bulan ini?\" atau \"Berikan saran agar aku bisa lebih hemat.\"</li></ol>" }
        ]
    },
    {
        id: 'komunitas', title: 'Fitur Komunitas', iconName: 'UserGroupIcon', qas: [
            { question: "Bagaimana cara berdonasi?", answer: "<ol><li>Buka halaman \"Donasi\".</li><li>Pilih program donasi yang Anda minati. Anda bisa melakukan \"Donasi Cepat\" dengan nominal yang sudah ada, atau klik pada program untuk melihat detailnya.</li><li>Di halaman detail, masukkan jumlah donasi yang Anda inginkan dan klik \"Lanjutkan Pembayaran\".</li></ol>" },
            { question: "Bagaimana cara menggunakan fitur Jual Beli?", answer: "<ul><li><strong>Membeli:</strong> Jelajahi produk, gunakan fitur pencarian, klik produk untuk melihat detail, dan tambahkan ke keranjang atau favorit.</li><li><strong>Menjual:</strong> Klik tombol \"Jual Barang\", isi semua detail produk seperti nama, harga, deskripsi, kategori, dan unggah foto produk Anda.</li></ul>" }
        ]
    },
    {
        id: 'islami', title: 'Pusat Islami', iconName: 'BuildingLibraryIcon', qas: [
             { question: "Bagaimana cara membaca Al-Qur'an?", answer: "<ol><li>Masuk ke \"Islamic Center\", lalu pilih \"Al-Qur'an\".</li><li>Anda dapat mencari surah berdasarkan nama atau nomor, atau melihat riwayat bacaan terakhir Anda.</li><li>Klik surah yang ingin dibaca.</li><li>Untuk mendengarkan audio per ayat, klik ikon putar (play) di samping nomor ayat. Sebuah pemutar audio akan muncul di bagian bawah.</li></ol>" },
             { question: "Bagaimana cara menggunakan Tasbih Digital?", answer: "<ol><li>Masuk ke \"Islamic Center\", lalu pilih \"Tasbih Digital\".</li><li>Ketuk tombol besar di tengah untuk menghitung.</li><li>Anda dapat mengatur target hitungan, suara, dan getar melalui ikon pengaturan (roda gigi).</li></ol>" }
        ]
    },
    {
        id: 'utilitas', title: 'Alat & Utilitas', iconName: 'WrenchScrewdriverIcon', qas: [
            { question: "Untuk apa Kalkulator Konstruksi?", answer: "<p>Fitur ini membantu Anda membuat estimasi cepat untuk kebutuhan material proyek konstruksi sederhana, seperti:</p><ul><li><strong>Kebutuhan Bata:</strong> Menghitung jumlah bata yang dibutuhkan berdasarkan luas dinding.</li><li><strong>Kebutuhan Beton:</strong> Menghitung volume beton (cor) untuk sebuah area.</li><li><strong>Kebutuhan Cat:</strong> Menghitung jumlah cat dalam liter berdasarkan luas dinding dan jumlah lapisan.</li></ul><p>Cukup masukkan dimensi yang diminta, dan kalkulator akan memberikan estimasinya. Ingat, ini adalah perkiraan dan bisa berbeda di lapangan.</p>" }
        ]
    },
    {
        id: 'akun', title: 'Profil & Akun', iconName: 'UserCircleIcon', qas: [
            { question: "Bagaimana cara mengubah profil saya?", answer: "<ol><li>Buka halaman \"Profile\" Anda.</li><li>Klik tombol \"Ubah Profil\".</li><li>Di jendela yang muncul, Anda dapat mengubah nama, nomor WhatsApp, email, dan foto profil.</li><li>Klik \"Simpan Perubahan\" jika sudah selesai.</li></ol>" },
            { question: "Bagaimana cara menghubungi Admin/Customer Service?", answer: "<p>Di halaman Profil, pada bagian \"Pengaturan & Bantuan\", terdapat tombol \"Hubungi Admin\" (untuk Member) atau \"Chat Customer Service\" (untuk Admin). Klik tombol tersebut untuk membuka jendela obrolan langsung.</p>" },
            { question: "Bagaimana cara keluar (logout)?", answer: "<p>Di halaman Profil, pada bagian \"Akun\", klik tombol \"Keluar\".</p>" }
        ]
    }
];

const FaqSection: React.FC<{ 
    title: string, 
    icon: ElementType, 
    children: React.ReactNode, 
    isOpen: boolean, 
    onToggle: () => void 
}> = ({ title, icon: IconComponent, children, isOpen, onToggle }) => {
    const Icon = (IconComponent as any).default || IconComponent;
    return (
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
            <button
                onClick={onToggle}
                className="w-full flex justify-between items-center p-4 text-left transition-colors bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6 text-primary dark:text-gold-light"/>
                    <span className="font-bold text-lg text-text-primary dark:text-dark-text-primary">{title}</span>
                </div>
                <ChevronDownIcon className={`w-5 h-5 text-text-secondary dark:text-dark-text-secondary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="p-4 bg-white dark:bg-dark-surface space-y-4 animate-fade-in">
                    {children}
                </div>
            )}
        </div>
    );
};

const QA: React.FC<{ question: string, children: React.ReactNode }> = ({ question, children }) => (
    <div>
        <h4 className="font-semibold text-text-primary dark:text-dark-text-primary">{question}</h4>
        <div className="text-sm text-text-secondary dark:text-dark-text-secondary mt-1 space-y-2 prose prose-sm max-w-none dark:prose-invert"
             dangerouslySetInnerHTML={{ __html: children as string }}
        />
    </div>
);

const BantuanPage: React.FC<BantuanPageProps> = ({ setActivePage, currentUser }) => {
    const [faqContent, setFaqContent] = useLocalStorage<FaqSectionData[]>('bantuan_content', defaultFaqs);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState<FaqSectionData[]>(faqContent);
    const [openSection, setOpenSection] = useState<string | null>(null);

    const toggleSection = (sectionId: string) => {
        setOpenSection(openSection === sectionId ? null : sectionId);
    };
    
    const handleSave = () => {
        setFaqContent(editContent);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditContent(faqContent);
        setIsEditing(false);
    };
    
    const handleContentChange = (sectionIndex: number, qaIndex: number, field: 'question' | 'answer', value: string) => {
        const newContent = [...editContent];
        newContent[sectionIndex].qas[qaIndex] = { ...newContent[sectionIndex].qas[qaIndex], [field]: value };
        setEditContent(newContent);
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center">
                    <button
                        onClick={() => setActivePage('Profile')}
                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-4"
                        aria-label="Kembali ke Profil"
                    >
                        <ArrowLeftIcon className="w-6 h-6 text-text-primary dark:text-dark-text-primary" />
                    </button>
                    <div className="flex items-center gap-3">
                        <QuestionMarkCircleIcon className="w-8 h-8 text-primary dark:text-gold-light" />
                        <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">
                            Pusat Bantuan
                        </h1>
                    </div>
                 </div>
                  {currentUser.role === UserRole.DEVELOPER && !isEditing && (
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-primary dark:text-gold-light bg-primary/10 dark:bg-gold-light/10 rounded-lg hover:bg-primary/20 dark:hover:bg-gold-light/20">
                        <PencilSquareIcon className="w-4 h-4" />
                        Ubah
                    </button>
                )}
            </div>
            
            {isEditing ? (
                 <div className="space-y-4 bg-surface dark:bg-dark-surface p-4 rounded-xl shadow-md">
                     {editContent.map((section, sectionIndex) => (
                         <div key={section.id} className="p-3 border rounded-lg">
                             <h3 className="font-bold text-lg mb-2">{section.title}</h3>
                             {section.qas.map((qa, qaIndex) => (
                                 <div key={qaIndex} className="p-2 border-t mt-2">
                                     <label className="text-xs font-medium">Pertanyaan</label>
                                     <input type="text" value={qa.question} onChange={e => handleContentChange(sectionIndex, qaIndex, 'question', e.target.value)} className="w-full p-1 border-b mb-2" />
                                     <label className="text-xs font-medium">Jawaban (HTML)</label>
                                     <textarea value={qa.answer} onChange={e => handleContentChange(sectionIndex, qaIndex, 'answer', e.target.value)} className="w-full h-24 p-1 border rounded-md text-xs font-mono" />
                                 </div>
                             ))}
                         </div>
                     ))}
                      <div className="flex justify-end gap-2 mt-4">
                        <button onClick={handleCancel} className="px-4 py-2 text-sm font-semibold bg-slate-200 rounded-lg">Batal</button>
                        <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg">Simpan</button>
                    </div>
                 </div>
            ) : (
                <div className="space-y-2">
                    {faqContent.map(section => {
                        const Icon = iconMap[section.iconName] || QuestionMarkCircleIcon;
                        return (
                            <FaqSection 
                                key={section.id}
                                title={section.title} 
                                icon={Icon} 
                                isOpen={openSection === section.id} 
                                onToggle={() => toggleSection(section.id)}
                            >
                                {section.qas.map((qa, index) => (
                                    <QA key={index} question={qa.question}>{qa.answer}</QA>
                                ))}
                            </FaqSection>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default BantuanPage;