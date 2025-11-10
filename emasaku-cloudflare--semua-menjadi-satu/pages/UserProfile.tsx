import React, { useState, useEffect } from 'react';
import { User, UserRole, Product, ThemeColors } from '../types.ts';
import { getUserById, getProductsBySellerId } from '../services/mockData.ts';
import { 
    ArrowLeftOnRectangleIcon as ArrowLeftOnRectangleIconSolid,
    ClockIcon as ClockIconSolid,
    ArchiveBoxIcon as ArchiveBoxIconSolid,
    HeartIcon as HeartIconSolid,
    Cog6ToothIcon as Cog6ToothIconSolid,
    ChatBubbleBottomCenterTextIcon as ChatBubbleBottomCenterTextIconSolid,
    QuestionMarkCircleIcon as QuestionMarkCircleIconSolid,
    DocumentTextIcon as DocumentTextIconSolid,
    TrashIcon as TrashIconSolid,
    ChevronRightIcon as ChevronRightIconSolid,
    UserCircleIcon as UserCircleIconSolid,
    ChatBubbleOvalLeftEllipsisIcon as ChatBubbleOvalLeftEllipsisIconSolid,
    InformationCircleIcon as InformationCircleIconSolid,
    ShieldCheckIcon as ShieldCheckIconSolid,
    ExclamationTriangleIcon as ExclamationTriangleIconSolid,
    EnvelopeIcon as EnvelopeIconSolid,
    SpeakerWaveIcon as SpeakerWaveIconSolid,
    XMarkIcon as XMarkIconSolid,
    ClipboardDocumentIcon as ClipboardDocumentIconSolid,
    BellIcon as BellIconSolid,
    PaintBrushIcon as PaintBrushIconSolid,
    BuildingStorefrontIcon as BuildingStorefrontIconSolid
} from '@heroicons/react/24/solid';
import EditProfileModal from '../components/profile/EditProfileModal.tsx';
import ContactAdminModal from '../components/profile/ContactAdminModal.tsx';
import { NavItem } from '../components/profile/EditNavigationModal.tsx';
import { formatDate } from '../utils/formatter.ts';
import ProductCard from '../components/products/ProductCard.tsx';
import useLocalStorage from '../hooks/useLocalStorage.ts';
import ThemeEditorModal from '../components/profile/ThemeEditorModal.tsx';
import { defaultThemeColors, defaultColorsHex, themeColorLabels, hexToRgb } from '../theme.ts';

const ArrowLeftOnRectangleIcon = (ArrowLeftOnRectangleIconSolid as any).default || ArrowLeftOnRectangleIconSolid;
const ClockIcon = (ClockIconSolid as any).default || ClockIconSolid;
const ArchiveBoxIcon = (ArchiveBoxIconSolid as any).default || ArchiveBoxIconSolid;
const HeartIcon = (HeartIconSolid as any).default || HeartIconSolid;
const Cog6ToothIcon = (Cog6ToothIconSolid as any).default || Cog6ToothIconSolid;
const ChatBubbleBottomCenterTextIcon = (ChatBubbleBottomCenterTextIconSolid as any).default || ChatBubbleBottomCenterTextIconSolid;
const QuestionMarkCircleIcon = (QuestionMarkCircleIconSolid as any).default || QuestionMarkCircleIconSolid;
const DocumentTextIcon = (DocumentTextIconSolid as any).default || DocumentTextIconSolid;
const TrashIcon = (TrashIconSolid as any).default || TrashIconSolid;
const ChevronRightIcon = (ChevronRightIconSolid as any).default || ChevronRightIconSolid;
const UserCircleIcon = (UserCircleIconSolid as any).default || UserCircleIconSolid;
const ChatBubbleOvalLeftEllipsisIcon = (ChatBubbleOvalLeftEllipsisIconSolid as any).default || ChatBubbleOvalLeftEllipsisIconSolid;
const InformationCircleIcon = (InformationCircleIconSolid as any).default || InformationCircleIconSolid;
const ShieldCheckIcon = (ShieldCheckIconSolid as any).default || ShieldCheckIconSolid;
const ExclamationTriangleIcon = (ExclamationTriangleIconSolid as any).default || ExclamationTriangleIconSolid;
const EnvelopeIcon = (EnvelopeIconSolid as any).default || EnvelopeIconSolid;
const SpeakerWaveIcon = (SpeakerWaveIconSolid as any).default || SpeakerWaveIconSolid;
const XMarkIcon = (XMarkIconSolid as any).default || XMarkIconSolid;
const ClipboardDocumentIcon = (ClipboardDocumentIconSolid as any).default || ClipboardDocumentIconSolid;
const BellIcon = (BellIconSolid as any).default || BellIconSolid;
const PaintBrushIcon = (PaintBrushIconSolid as any).default || PaintBrushIconSolid;
const BuildingStorefrontIcon = (BuildingStorefrontIconSolid as any).default || BuildingStorefrontIconSolid;

interface UserProfileProps {
  userToViewId: string;
  currentUser: User;
  onLogout: () => void;
  setActivePage: (page: string) => void;
  onProfileUpdate: (userId: string, updates: Partial<User>) => Promise<User | null>;
  navigateToProfile: (userId: string) => void;
  favorites: number[];
  onToggleFavorite: (product: Product) => void;
  navigateToProductDetail: (productId: number) => void;
  themeColors: ThemeColors;
  setThemeColors: React.Dispatch<React.SetStateAction<ThemeColors>>;
}

// Map icon names to components for dynamic rendering
const iconComponents = {
    ArrowLeftOnRectangleIcon, ClockIcon, ArchiveBoxIcon, HeartIcon, Cog6ToothIcon, ChatBubbleBottomCenterTextIcon,
    QuestionMarkCircleIcon, DocumentTextIcon, TrashIcon, ChevronRightIcon, UserCircleIcon, ChatBubbleOvalLeftEllipsisIcon,
    InformationCircleIcon, ShieldCheckIcon, ExclamationTriangleIcon, EnvelopeIcon, SpeakerWaveIcon, XMarkIcon,
    ClipboardDocumentIcon,
    BellIcon,
    PaintBrushIcon
};

// Default navigation structure
const defaultNavItems: NavItem[] = [
  // Aktivitas
  { id: 'notifications', section: 'Aktivitas', iconName: 'BellIcon', label: 'Notifikasi', actionType: 'page', actionValue: 'Notifikasi' },
  { id: 'historyTx', section: 'Aktivitas', iconName: 'ClockIcon', label: 'Riwayat Transaksi', actionType: 'page', actionValue: 'Riwayat Transaksi' },
  { id: 'historyOrder', section: 'Aktivitas', iconName: 'ArchiveBoxIcon', label: 'Riwayat Pesanan', actionType: 'page', actionValue: 'Riwayat Pesanan' },
  { id: 'favorites', section: 'Aktivitas', iconName: 'HeartIcon', label: 'Favorit Saya', actionType: 'page', actionValue: 'Favorit Saya' },

  // Pengaturan & Bantuan
  { id: 'settings', section: 'Pengaturan & Bantuan', iconName: 'Cog6ToothIcon', label: 'Pengaturan', actionType: 'function', actionValue: 'placeholder' },
  { id: 'theme', section: 'Pengaturan & Bantuan', iconName: 'PaintBrushIcon', label: 'Ubah Warna Tema', actionType: 'modal', actionValue: 'themeEditor', roles: [UserRole.ADMIN, UserRole.DEVELOPER] },
  { id: 'contactAdmin', section: 'Pengaturan & Bantuan', iconName: 'ChatBubbleBottomCenterTextIcon', label: 'Hubungi Admin', actionType: 'modal', actionValue: 'contactAdmin', roles: [UserRole.MEMBER] },
  { id: 'contactDev', section: 'Pengaturan & Bantuan', iconName: 'ChatBubbleOvalLeftEllipsisIcon', label: 'Chat Customer Service', actionType: 'modal', actionValue: 'contactDev', roles: [UserRole.ADMIN] },
  { id: 'help', section: 'Pengaturan & Bantuan', iconName: 'QuestionMarkCircleIcon', label: 'Bantuan', actionType: 'page', actionValue: 'Bantuan' },
  { id: 'contactUs', section: 'Pengaturan & Bantuan', iconName: 'EnvelopeIcon', label: 'Kontak Kami', actionType: 'page', actionValue: 'Kontak Kami' },
  { id: 'terms', section: 'Pengaturan & Bantuan', iconName: 'DocumentTextIcon', label: 'Syarat & Ketentuan', actionType: 'page', actionValue: 'Syarat & Ketentuan' },
  { id: 'privacy', section: 'Pengaturan & Bantuan', iconName: 'ShieldCheckIcon', label: 'Kebijakan Privasi', actionType: 'page', actionValue: 'Kebijakan Privasi' },
  { id: 'disclaimer', section: 'Pengaturan & Bantuan', iconName: 'ExclamationTriangleIcon', label: 'Disclaimer', actionType: 'page', actionValue: 'Disclaimer' },
  { id: 'about', section: 'Pengaturan & Bantuan', iconName: 'InformationCircleIcon', label: 'Tentang Aplikasi', actionType: 'page', actionValue: 'Tentang Aplikasi' },

  // Akun
  { id: 'logout', section: 'Akun', iconName: 'ArrowLeftOnRectangleIcon', label: 'Keluar', actionType: 'function', actionValue: 'logout' },
  { id: 'deleteAccount', section: 'Akun', iconName: 'TrashIcon', label: 'Hapus Akun', actionType: 'function', actionValue: 'deleteAccount', isDestructive: true },
];

const ActionItem: React.FC<{
    icon: React.ElementType;
    label: string;
    onClick: () => void;
    isDestructive?: boolean;
}> = ({ icon: Icon, label, onClick, isDestructive = false }) => (
    <li>
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between p-4 text-left transition-colors ${
                isDestructive 
                ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                : 'text-text-primary dark:text-dark-text-primary hover:bg-slate-50 dark:hover:bg-slate-700/50'
            }`}
        >
            <div className="flex items-center gap-4">
                <Icon className={`w-6 h-6 ${isDestructive ? '' : 'text-text-secondary dark:text-dark-text-secondary'}`} />
                <span className="font-semibold">{label}</span>
            </div>
            {!isDestructive && <ChevronRightIcon className="w-5 h-5 text-slate-400" />}
        </button>
    </li>
);

const UserProfile: React.FC<UserProfileProps> = ({ 
    userToViewId, 
    currentUser, 
    onLogout, 
    setActivePage, 
    onProfileUpdate, 
    navigateToProfile,
    favorites,
    onToggleFavorite,
    navigateToProductDetail,
    themeColors,
    setThemeColors
}) => {
    const [userToView, setUserToView] = useState<User | null>(null);
    const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isContactAdminModalOpen, setContactAdminModalOpen] = useState(false);
    const [isContactDevModalOpen, setContactDevModalOpen] = useState(false);
    const [isThemeModalOpen, setThemeModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const [navItems, setNavItems] = useLocalStorage<NavItem[]>('profileNavItems', defaultNavItems);

    const isOwnProfile = userToViewId === currentUser.id;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const user = await getUserById(userToViewId);
            setUserToView(user || null);
            if (user) {
                const products = await getProductsBySellerId(user.id);
                setSellerProducts(products);
            }
            setLoading(false);
        };
        fetchData();
    }, [userToViewId]);

    const handleSaveProfile = async (userId: string, updates: Partial<User>) => {
        await onProfileUpdate(userId, updates);
        const user = await getUserById(userToViewId); // Refetch to get fresh data
        setUserToView(user || null);
    };
    
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    
    const handleThemeSave = (newColorsHex: { [key: string]: string }) => {
        const newThemeRgb: ThemeColors = {};
        for (const key in newColorsHex) {
            const cssVarName = `--color-${key.replace(/-/g, '-')}`;
            newThemeRgb[cssVarName] = hexToRgb(newColorsHex[key]);
        }
        setThemeColors(newThemeRgb);
        setThemeModalOpen(false);
    };

    const handleThemeModalClose = () => {
        // Revert live preview by re-applying the originally persisted colors
        setThemeColors(themeColors);
        setThemeModalOpen(false);
    };


    const handleActionItemClick = (item: NavItem) => {
      switch (item.actionType) {
        case 'page':
          setActivePage(item.actionValue);
          break;
        case 'modal':
          if (item.actionValue === 'contactAdmin') setContactAdminModalOpen(true);
          if (item.actionValue === 'contactDev') setContactDevModalOpen(true);
          if (item.actionValue === 'themeEditor') setThemeModalOpen(true);
          break;
        case 'function':
          if (item.actionValue === 'logout') onLogout();
          if (item.actionValue === 'deleteAccount') alert('Fitur Hapus Akun akan menghubungi admin untuk proses verifikasi lebih lanjut.');
          if (item.actionValue === 'placeholder') alert(`Fitur "${item.label}" sedang dalam pengembangan.`);
          break;
        default:
          break;
      }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-full"><div className="w-8 h-8 border-4 border-gold-DEFAULT border-t-transparent rounded-full animate-spin"></div></div>;
    }

    if (!userToView) {
        return <div className="text-center p-8">Pengguna tidak ditemukan.</div>;
    }
    
    const referralCode = `EMASAKU-${userToView.name.split(' ')[0].toUpperCase()}`;

    const navSections = ['Aktivitas', 'Pengaturan & Bantuan', 'Akun'];
    
    return (
        <div className="max-w-2xl mx-auto animate-fade-in space-y-4">
            {/* User Info Card */}
            <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6 flex flex-col items-center text-center">
                <img 
                  src={userToView.avatarUrl} 
                  alt={userToView.name} 
                  className="w-24 h-24 rounded-full ring-4 ring-gold-DEFAULT/50 dark:ring-gold-light/50 mb-4" 
                />
                <h1 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">{userToView.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                    <p className="text-sm font-semibold bg-gold-DEFAULT/10 text-gold-dark dark:bg-gold-light/20 dark:text-gold-light px-3 py-1 rounded-full inline-block">
                      {userToView.role}
                    </p>
                    {userToView.isRetailPartner && (
                         <p className="text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 px-3 py-1 rounded-full inline-block">
                          Mitra Retail
                        </p>
                    )}
                </div>
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-2 flex items-center justify-center gap-1.5">
                    <ClockIcon className="w-4 h-4" />
                    Bergabung sejak {formatDate(userToView.joinedDate)}
                </p>
            </div>
            
            {isOwnProfile && currentUser.isRetailPartner && (
                 <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-4">
                     <button
                        onClick={() => setActivePage('Dasbor Mitra Retail')}
                        className="w-full flex items-center justify-between p-2 group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg">
                                <BuildingStorefrontIcon className="w-8 h-8 text-green-600 dark:text-green-400"/>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-left text-text-primary dark:text-dark-text-primary">Dasbor Mitra Retail</h3>
                                <p className="text-sm text-left text-text-secondary dark:text-dark-text-secondary">Proses top up anggota di gerai Anda.</p>
                            </div>
                        </div>
                        <ChevronRightIcon className="w-6 h-6 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                 </div>
            )}

            {/* About Admin/Dev Card */}
            {(userToView.role === UserRole.ADMIN || userToView.role === UserRole.DEVELOPER) && (
              <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6">
                <h2 className="font-bold text-lg text-text-primary dark:text-dark-text-primary mb-2 flex items-center gap-2">
                  <InformationCircleIcon className="w-6 h-6 text-primary dark:text-gold-light" />
                  {userToView.role === UserRole.ADMIN ? 'Tentang Admin' : 'Tentang Developer'}
                </h2>
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary leading-relaxed">
                  {userToView.role === UserRole.ADMIN
                    ? 'Admin bertanggung jawab untuk mengelola anggota, memverifikasi transaksi (seperti penarikan dana & top up), serta memastikan komunitas berjalan dengan baik. Hubungi admin jika Anda memerlukan bantuan terkait akun atau transaksi.'
                    : 'Developer bertanggung jawab atas pemeliharaan teknis, pengembangan fitur baru, dan memastikan keamanan aplikasi. Hubungi developer untuk melaporkan bug atau masalah teknis.'}
                </p>
              </div>
            )}

            {/* Seller's Products */}
            {sellerProducts.length > 0 && (
                <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md overflow-hidden">
                    <h2 className="font-bold text-lg p-4 border-b border-slate-200 dark:border-slate-700 text-text-primary dark:text-dark-text-primary">
                        Barang Dijual ({sellerProducts.length})
                    </h2>
                    <div className="p-4 grid grid-cols-2 gap-4">
                        {sellerProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                isFavorite={favorites.includes(product.id)}
                                onCardClick={() => navigateToProductDetail(product.id)}
                                onToggleFavorite={() => onToggleFavorite(product)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {isOwnProfile && (
                <>
                    {/* Referral Code for Admins/Devs */}
                    {(userToView.role === UserRole.ADMIN || userToView.role === UserRole.DEVELOPER) && (
                        <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6">
                            <h2 className="font-bold text-lg text-text-primary dark:text-dark-text-primary mb-3">Kode Referral Anda</h2>
                            <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-4">
                                Bagikan kode ini untuk mengundang anggota baru dan dapatkan benefit spesial.
                            </p>
                            <div className="flex items-center gap-2 p-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                <span className="font-mono font-bold text-lg text-primary dark:text-gold-light flex-grow">{referralCode}</span>
                                <button 
                                    onClick={() => handleCopy(referralCode)}
                                    className="px-4 py-1.5 bg-gold-dark text-white text-sm font-semibold rounded-md hover:opacity-90 transition-opacity w-28 flex items-center justify-center gap-1"
                                >
                                    {copied ? <>Tersalin!</> : <><ClipboardDocumentIcon className="w-4 h-4" /> Salin</>}
                                </button>
                            </div>
                        </div>
                    )}
                
                    {/* Edit Profile & Nav Section */}
                    <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md overflow-hidden">
                        <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                           <ActionItem icon={UserCircleIcon} label="Ubah Profil" onClick={() => setEditModalOpen(true)} />
                        </ul>
                    </div>
                    
                    {/* Navigation sections rendered dynamically */}
                    {navSections.map(section => {
                        const itemsInSection = navItems.filter(item => 
                            item.section === section && 
                            (!item.roles || item.roles.includes(currentUser.role))
                        );
                        if (itemsInSection.length === 0) return null;

                        return (
                            <div key={section} className="bg-surface dark:bg-dark-surface rounded-xl shadow-md overflow-hidden">
                                <h2 className="font-bold text-lg p-4 border-b border-slate-200 dark:border-slate-700 text-text-primary dark:text-dark-text-primary">{section}</h2>
                                <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {itemsInSection.map(item => {
                                        const IconComponent = iconComponents[item.iconName as keyof typeof iconComponents] || UserCircleIcon;
                                        return (
                                            <ActionItem
                                                key={item.id}
                                                icon={IconComponent}
                                                label={item.label}
                                                onClick={() => handleActionItemClick(item)}
                                                isDestructive={item.isDestructive}
                                            />
                                        )
                                    })}
                                </ul>
                            </div>
                        );
                    })}
                </>
            )}
            
            {isEditModalOpen && isOwnProfile && (
                <EditProfileModal
                    user={currentUser}
                    onClose={() => setEditModalOpen(false)}
                    onSave={handleSaveProfile}
                />
            )}

            {isThemeModalOpen && (
                <ThemeEditorModal
                    onClose={handleThemeModalClose}
                    onSave={handleThemeSave}
                />
            )}

            {isContactAdminModalOpen && (
                <ContactAdminModal
                    onClose={() => setContactAdminModalOpen(false)}
                />
            )}

            {isContactDevModalOpen && (
                <ContactAdminModal
                    onClose={() => setContactDevModalOpen(false)}
                    recipientName="Developer"
                    recipientAvatarUrl="https://picsum.photos/seed/dev1/100"
                />
            )}
        </div>
    );
};

export default UserProfile;
