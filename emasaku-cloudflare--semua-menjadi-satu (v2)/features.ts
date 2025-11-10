import type { ElementType } from 'react';
import { 
    ArrowUpCircleIcon as ArrowUpCircleIconOutline,
    ArrowDownCircleIcon as ArrowDownCircleIconOutline,
    ArrowsRightLeftIcon as ArrowsRightLeftIconOutline,
    ShoppingCartIcon as ShoppingCartIconOutline,
    TruckIcon as TruckIconOutline,
    BriefcaseIcon as BriefcaseIconOutline,
    PuzzlePieceIcon as PuzzlePieceIconOutline,
    HeartIcon as HeartIconOutline,
    BanknotesIcon as BanknotesIconOutline,
    UserGroupIcon as UserGroupIconOutline,
    GiftIcon as GiftIconOutline,
    BuildingLibraryIcon as BuildingLibraryIconOutline,
    BuildingOfficeIcon as BuildingOfficeIconOutline,
    CalculatorIcon as CalculatorIconOutline,
    QuestionMarkCircleIcon as QuestionMarkCircleIconOutline,
    MegaphoneIcon as MegaphoneIconOutline,
    SquaresPlusIcon as SquaresPlusIconOutline,
    StarIcon as StarIconOutline,
    UserIcon as UserIconOutline,
    SparklesIcon as SparklesIconOutline,
    BuildingStorefrontIcon as BuildingStorefrontIconOutline,
    ClipboardDocumentCheckIcon as ClipboardDocumentCheckIconOutline,
    ArrowPathIcon as ArrowPathIconOutline
} from '@heroicons/react/24/outline';

const ArrowUpCircleIcon = (ArrowUpCircleIconOutline as any).default || ArrowUpCircleIconOutline;
const ArrowDownCircleIcon = (ArrowDownCircleIconOutline as any).default || ArrowDownCircleIconOutline;
const ArrowsRightLeftIcon = (ArrowsRightLeftIconOutline as any).default || ArrowsRightLeftIconOutline;
const ShoppingCartIcon = (ShoppingCartIconOutline as any).default || ShoppingCartIconOutline;
const TruckIcon = (TruckIconOutline as any).default || TruckIconOutline;
const BriefcaseIcon = (BriefcaseIconOutline as any).default || BriefcaseIconOutline;
const PuzzlePieceIcon = (PuzzlePieceIconOutline as any).default || PuzzlePieceIconOutline;
const HeartIcon = (HeartIconOutline as any).default || HeartIconOutline;
const BanknotesIcon = (BanknotesIconOutline as any).default || BanknotesIconOutline;
const UserGroupIcon = (UserGroupIconOutline as any).default || UserGroupIconOutline;
const GiftIcon = (GiftIconOutline as any).default || GiftIconOutline;
const BuildingLibraryIcon = (BuildingLibraryIconOutline as any).default || BuildingLibraryIconOutline;
const BuildingOfficeIcon = (BuildingOfficeIconOutline as any).default || BuildingOfficeIconOutline;
const CalculatorIcon = (CalculatorIconOutline as any).default || CalculatorIconOutline;
const QuestionMarkCircleIcon = (QuestionMarkCircleIconOutline as any).default || QuestionMarkCircleIconOutline;
const MegaphoneIcon = (MegaphoneIconOutline as any).default || MegaphoneIconOutline;
const SquaresPlusIcon = (SquaresPlusIconOutline as any).default || SquaresPlusIconOutline;
const StarIcon = (StarIconOutline as any).default || StarIconOutline;
const UserIcon = (UserIconOutline as any).default || UserIconOutline;
const SparklesIcon = (SparklesIconOutline as any).default || SparklesIconOutline;
const BuildingStorefrontIcon = (BuildingStorefrontIconOutline as any).default || BuildingStorefrontIconOutline;
const ClipboardDocumentCheckIcon = (ClipboardDocumentCheckIconOutline as any).default || ClipboardDocumentCheckIconOutline;
const ArrowPathIcon = (ArrowPathIconOutline as any).default || ArrowPathIconOutline;

export interface DashboardFeature {
    id: string;
    label: string;
    description: string;
    icon: ElementType;
    page: string;
    bgClass: string;
    iconClass: string;
}

export const dashboardFeatures: DashboardFeature[] = [
    { 
        id: 'topUp', 
        label: "Top Up", 
        description: "Isi saldo dompet",
        icon: ArrowUpCircleIcon, 
        page: 'Top Up',
        bgClass: "bg-green-100 dark:bg-green-900/50 group-hover:bg-green-200 dark:group-hover:bg-green-800/60", 
        iconClass: "text-green-600 dark:text-green-400"
    },
    { 
        id: 'tarikSaldo', 
        label: "Tarik Saldo", 
        description: "Rekening & E-wallet",
        icon: ArrowDownCircleIcon, 
        page: 'Tarik Saldo',
        bgClass: "bg-red-100 dark:bg-red-900/50 group-hover:bg-red-200 dark:group-hover:bg-red-800/60",
        iconClass: "text-red-600 dark:text-red-400"
    },
    { 
        id: 'tarikTunai', 
        label: "Tarik Tunai", 
        description: "Ambil di gerai retail",
        icon: BuildingStorefrontIcon, 
        page: 'Tarik Saldo',
        bgClass: "bg-rose-100 dark:bg-rose-900/50 group-hover:bg-rose-200 dark:group-hover:bg-rose-800/60",
        iconClass: "text-rose-600 dark:text-rose-400"
    },
    { 
        id: 'transfer', 
        label: "Transfer", 
        description: "Kirim uang",
        icon: ArrowsRightLeftIcon, 
        page: 'Transfer',
        bgClass: "bg-blue-100 dark:bg-blue-900/50 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/60",
        iconClass: "text-blue-600 dark:text-blue-400"
    },
    { 
        id: 'donasi', 
        label: "Donasi", 
        description: "Salurkan kebaikan",
        icon: HeartIcon, 
        page: 'Donasi',
        bgClass: "bg-purple-100 dark:bg-purple-900/50 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/60",
        iconClass: "text-purple-600 dark:text-purple-400"
    },
    { 
        id: 'jualBeli', 
        label: "Jual Beli", 
        description: "Marketplace",
        icon: ShoppingCartIcon, 
        page: 'Jual Beli',
        bgClass: "bg-indigo-100 dark:bg-indigo-900/50 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/60",
        iconClass: "text-indigo-600 dark:text-indigo-400"
    },
    { 
        id: 'kasir', 
        label: "Kasir", 
        description: "Point of Sale (POS)",
        icon: BuildingStorefrontIcon, 
        page: 'Kasir',
        bgClass: "bg-rose-100 dark:bg-rose-900/50 group-hover:bg-rose-200 dark:group-hover:bg-rose-800/60",
        iconClass: "text-rose-600 dark:text-rose-400"
    },
    { 
        id: 'ojek', 
        label: "Ojek", 
        description: "Transportasi",
        icon: TruckIcon, 
        page: 'Ojek',
        bgClass: "bg-sky-100 dark:bg-sky-900/50 group-hover:bg-sky-200 dark:group-hover:bg-sky-800/60",
        iconClass: "text-sky-600 dark:text-sky-400"
    },
    { 
        id: 'loker', 
        label: "Loker", 
        description: "Lowongan Kerja",
        icon: BriefcaseIcon, 
        page: 'Loker',
        bgClass: "bg-teal-100 dark:bg-teal-900/50 group-hover:bg-teal-200 dark:group-hover:bg-teal-800/60",
        iconClass: "text-teal-600 dark:text-teal-400"
    },
    { 
        id: 'game', 
        label: "Game", 
        description: "Hiburan & Poin",
        icon: PuzzlePieceIcon, 
        page: 'Game',
        bgClass: "bg-orange-100 dark:bg-orange-900/50 group-hover:bg-orange-200 dark:group-hover:bg-orange-800/60",
        iconClass: "text-orange-600 dark:text-orange-400"
    },
    { 
        id: 'iuran', 
        label: "Iuran", 
        description: "Bayar iuran rutin",
        icon: BanknotesIcon, 
        page: 'Iuran',
        bgClass: "bg-yellow-100 dark:bg-yellow-900/50 group-hover:bg-yellow-200 dark:group-hover:bg-yellow-800/60",
        iconClass: "text-yellow-600 dark:text-yellow-400"
    },
    { 
        id: 'komunitas', 
        label: "Komunitas", 
        description: "Ruang diskusi",
        icon: UserGroupIcon, 
        page: 'Komunitas',
        bgClass: "bg-pink-100 dark:bg-pink-900/50 group-hover:bg-pink-200 dark:group-hover:bg-pink-800/60",
        iconClass: "text-pink-600 dark:text-pink-400"
    },
    { 
        id: 'arisan', 
        label: "Arisan", 
        description: "Kelola arisan grup",
        icon: GiftIcon, 
        page: 'Arisan',
        bgClass: "bg-cyan-100 dark:bg-cyan-900/50 group-hover:bg-cyan-200 dark:group-hover:bg-cyan-800/60",
        iconClass: "text-cyan-600 dark:text-cyan-400"
    },
    { 
        id: 'islamicCenter', 
        label: "Islami", 
        description: "Al-Qur'an, dll.",
        icon: BuildingLibraryIcon, 
        page: 'Islamic Center',
        bgClass: "bg-emerald-100 dark:bg-emerald-900/50 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/60",
        iconClass: "text-emerald-600 dark:text-emerald-400"
    },
    { 
        id: 'hitungSipil', 
        label: "Hitung Sipil", 
        description: "Kalkulator konstruksi",
        icon: BuildingOfficeIcon, 
        page: 'Hitung Sipil',
        bgClass: "bg-slate-100 dark:bg-slate-900/50 group-hover:bg-slate-200 dark:group-hover:bg-slate-800/60",
        iconClass: "text-slate-600 dark:text-slate-400"
    },
    { 
        id: 'alatHitung', 
        label: "Alat Hitung", 
        description: "Kalkulator biasa",
        icon: CalculatorIcon, 
        page: 'Alat Hitung',
        bgClass: "bg-gray-100 dark:bg-gray-900/50 group-hover:bg-gray-200 dark:group-hover:bg-gray-800/60",
        iconClass: "text-gray-600 dark:text-gray-400"
    },
    { 
        id: 'quiz', 
        label: "Quiz", 
        description: "Uji wawasan",
        icon: QuestionMarkCircleIcon, 
        page: 'Quiz',
        bgClass: "bg-lime-100 dark:bg-lime-900/50 group-hover:bg-lime-200 dark:group-hover:bg-lime-800/60",
        iconClass: "text-lime-600 dark:text-lime-400"
    },
    { 
        id: 'bayarBeli', 
        label: "Bayar/Beli", 
        description: "Tagihan & produk digital",
        icon: ClipboardDocumentCheckIcon, 
        page: 'Bayar & Beli',
        bgClass: "bg-rose-100 dark:bg-rose-900/50 group-hover:bg-rose-200 dark:group-hover:bg-rose-800/60",
        iconClass: "text-rose-600 dark:text-rose-400"
    },
    { 
        id: 'dreamWeaver', 
        label: "Dream Weaver", 
        description: "Visualkan impianmu",
        icon: SparklesIcon, 
        page: 'Dream Weaver',
        bgClass: "bg-rose-100 dark:bg-rose-900/50 group-hover:bg-rose-200 dark:group-hover:bg-rose-800/60",
        iconClass: "text-rose-600 dark:text-rose-400"
    },
    { 
        id: 'bankSampah', 
        label: "Bank Sampah", 
        description: "Kelola sampah",
        icon: ArrowPathIcon, 
        page: 'Bank Sampah',
        bgClass: "bg-green-100 dark:bg-green-900/50 group-hover:bg-green-200 dark:group-hover:bg-green-800/60",
        iconClass: "text-green-600 dark:text-green-400"
    },
    { 
        id: 'laundry', 
        label: "Laundry", 
        description: "Cuci antar-jemput",
        icon: SparklesIcon, 
        page: 'Laundry',
        bgClass: "bg-violet-100 dark:bg-violet-900/50 group-hover:bg-violet-200 dark:group-hover:bg-violet-800/60",
        iconClass: "text-violet-600 dark:text-violet-400"
    },
    // The following are part of laundry modal, but we can have them here for consistency if needed in other places
    { 
        id: 'laundryPartnerDashboard', 
        label: "Dasbor Mitra", 
        description: "Kelola pesanan laundry",
        icon: ClipboardDocumentCheckIcon, 
        page: 'Laundry Partner Dashboard',
        bgClass: "bg-blue-100 dark:bg-blue-900/50",
        iconClass: "text-blue-600 dark:text-blue-400"
    },
    { 
        id: 'laundryPartner', 
        label: "Daftar Mitra", 
        description: "Gabung jadi mitra",
        icon: BuildingStorefrontIcon, 
        page: 'Laundry Partner',
        bgClass: "bg-green-100 dark:bg-green-900/50",
        iconClass: "text-green-600 dark:text-green-400"
    },
];