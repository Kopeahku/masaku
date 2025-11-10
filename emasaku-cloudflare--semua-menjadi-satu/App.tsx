import React, { useState, useEffect, useCallback } from 'react';

// --- HOOKS ---
import useLocalStorage from './hooks/useLocalStorage.ts';

// --- TYPES ---
import { 
    User, UserRole, Transaction, TransactionType, TransactionStatus, Notification, NotificationType, Product,
    CartItem, LaundryOrder, LaundryServiceType, OjekOrder, PaymentMethod,
    SellerRegistrationRequest, DriverRegistrationRequest, ArisanRegistrationRequest,
    WastePartnerRegistrationRequest, LaundryPartnerRegistrationRequest, RetailPartnerRegistrationRequest, ThemeColors,
    DonationProgram
} from './types.ts';

// --- MOCK DATA & SERVICES ---
import { 
    mockUsers, mockTransactions as initialTransactions, mockNotifications as initialNotifications, getTransactionsForUser, getAllUsers, mockProducts,
    mockLaundryOrders, getLaundryOrders, mockDonationPrograms
} from './services/mockData.ts';
import { defaultVaBanks, defaultEWallets, defaultRetailOutlets } from './pages/TopUpPage.tsx';

// --- LAYOUT COMPONENTS ---
import Header from './components/layout/Header.tsx';
import Sidebar from './components/layout/Sidebar.tsx';
import BottomNav from './components/layout/BottomNav.tsx';
import NotificationsPanel from './components/layout/NotificationsPanel.tsx';

// --- PAGE COMPONENTS ---
import LoginPage from './pages/LoginPage.tsx';
import MemberDashboard from './pages/MemberDashboard.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import MembersList from './pages/MembersList.tsx';
import AdminsList from './pages/AdminsList.tsx';
import UserProfile from './pages/UserProfile.tsx';
import TopUpPage from './pages/TopUpPage.tsx';
import TarikSaldoPage from './pages/TarikSaldoPage.tsx';
import TransferPage from './pages/TransferPage.tsx';
import JualBeliPage from './pages/JualBeliPage.tsx';
import ProductDetailPage from './pages/ProductDetailPage.tsx';
import AddProductPage from './pages/AddProductPage.tsx';
import CartPage from './pages/CartPage.tsx';
import CheckoutPage from './pages/CheckoutPage.tsx';
import DonasiPage from './pages/DonasiPage.tsx';
import DonasiDetailPage from './pages/DonasiDetailPage.tsx';
import AllDonationsPage from './pages/AllDonationsPage.tsx';
import IuranPage from './pages/IuranPage.tsx';
import ArisanPage from './pages/ArisanPage.tsx';
import LokerPage from './pages/LokerPage.tsx';
import JobDetailPage from './pages/JobDetailPage.tsx';
import KomunitasPage from './pages/KomunitasPage.tsx';
import GamePage from './pages/GamePage.tsx';
import IslamicCenter from './pages/IslamicCenter.tsx';
import HitungSipilPage from './pages/HitungSipilPage.tsx';
import AlatHitungPage from './pages/AlatHitungPage.tsx';
import QuizPage from './pages/QuizPage.tsx';
import BayarBeliPage from './pages/BayarBeliPage.tsx';
import KerenPage from './pages/KerenPage.tsx';
import NotificationsPage from './pages/NotificationsPage.tsx';
import RiwayatTransaksiPage from './pages/RiwayatTransaksiPage.tsx';
import RiwayatPesananPage from './pages/RiwayatPesananPage.tsx';
import FavoritPage from './pages/FavoritPage.tsx';
import SyaratKetentuanPage from './pages/SyaratKetentuanPage.tsx';
import KebijakanPrivasiPage from './pages/KebijakanPrivasiPage.tsx';
import DisclaimerPage from './pages/DisclaimerPage.tsx';
import KontakKamiPage from './pages/KontakKamiPage.tsx';
import BantuanPage from './pages/BantuanPage.tsx';
import TentangAplikasiPage from './pages/TentangAplikasiPage.tsx';
import ComingSoonPage from './pages/ComingSoonPage.tsx';
import FeatureSettingsPage from './pages/FeatureSettingsPage.tsx';
import OjekPage from './pages/OjekPage.tsx';
import PengemudiPage from './pages/PengemudiPage.tsx';
import LaundryPage from './pages/LaundryPage.tsx';
import LaundryOrderPage from './pages/LaundryOrderPage.tsx';
import LaundryTrackingPage from './pages/LaundryTrackingPage.tsx';
import LaundryPartnerPage from './pages/LaundryPartnerPage.tsx';
import LaundryPartnerDashboardPage from './pages/LaundryPartnerDashboardPage.tsx';
import BankSampahPage from './pages/BankSampahPage.tsx';
import KasirPage from './pages/KasirPage.tsx';
import PeluangMitraPage from './pages/PeluangMitraPage.tsx';
import PartnerDashboardPage from './pages/PartnerDashboardPage.tsx';
import DaftarPengemudiPage from './pages/DaftarPengemudiPage.tsx';
import DaftarPenjualPage from './pages/DaftarPenjualPage.tsx';
import DaftarArisanPage from './pages/DaftarArisanPage.tsx';
import DaftarMitraSampahPage from './pages/DaftarMitraSampahPage.tsx';
// Fix: Changed to default import as the component is now default exported.
import MitraSampahDashboardPage from './pages/MitraSampahDashboardPage.tsx';
import DaftarMitraRetailPage from './pages/DaftarMitraRetailPage.tsx';
import RetailPartnerDashboardPage from './pages/RetailPartnerDashboardPage.tsx';
import DasborMitraPenjualPage from './pages/DasborMitraPenjualPage.tsx';
import ManageDonationsPage from './pages/ManageDonationsPage.tsx';
import { dashboardFeatures } from './features.ts';
import { defaultThemeColors } from './theme.ts';
import { formatToRupiah } from './utils/formatter.ts';

const App: React.FC = () => {
    // === THEME & STYLE STATE ===
    const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    );
    const [themeColors, setThemeColors] = useLocalStorage<ThemeColors>('appThemeColors', defaultThemeColors);

    // === USER & AUTH STATE ===
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [viewingUserId, setViewingUserId] = useState<string | null>(null);
    const [allUsers, setAllUsers] = useState<User[]>(mockUsers);
    
    // === NAVIGATION STATE ===
    const [activePage, setActivePage] = useState<string>('Dashboard');
    const [comingSoonFeature, setComingSoonFeature] = useState<string>('');

    // === CORE DATA STATE ===
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    const [showNotifications, setShowNotifications] = useState(false);
    const [donationPrograms, setDonationPrograms] = useState<DonationProgram[]>(mockDonationPrograms);

    // === FEATURE-SPECIFIC STATE ===
    const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
    const [favorites, setFavorites] = useLocalStorage<number[]>('favorites', []);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [selectedDonationProgramId, setSelectedDonationProgramId] = useState<number | null>(null);
    const [prefilledDonation, setPrefilledDonation] = useState<{programId: number; amount: number} | null>(null);
    const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
    const [laundryOrders, setLaundryOrders] = useState<LaundryOrder[]>(mockLaundryOrders);
    const [activeLaundryOrder, setActiveLaundryOrder] = useState<LaundryOrder | null>(null);
    const [selectedLaundryService, setSelectedLaundryService] = useState<LaundryServiceType>('Kiloan');
    const [vaBanks, setVaBanks] = useLocalStorage<PaymentMethod[]>('vaBanks', defaultVaBanks);
    const [eWallets, setEWallets] = useLocalStorage<PaymentMethod[]>('eWallets', defaultEWallets);
    const [retailOutlets, setRetailOutlets] = useLocalStorage<PaymentMethod[]>('retailOutlets', defaultRetailOutlets);
    const initialVisibility = dashboardFeatures.reduce((acc, f) => ({ ...acc, [f.id]: true }), {});
    const [featureVisibility, setFeatureVisibility] = useLocalStorage<Record<string, boolean>>('featureVisibility', initialVisibility);
    const [initialWithdrawalTab, setInitialWithdrawalTab] = useState<'bank' | 'ewallet' | 'retail'>('bank');
    
    // Admin-facing registration requests
    const [sellerRequests, setSellerRequests] = useState<SellerRegistrationRequest[]>([]);
    const [driverRequests, setDriverRequests] = useState<DriverRegistrationRequest[]>([]);
    const [arisanRequests, setArisanRequests] = useState<ArisanRegistrationRequest[]>([]);
    const [wastePartnerRequests, setWastePartnerRequests] = useState<WastePartnerRegistrationRequest[]>([]);
    const [laundryPartnerRequests, setLaundryPartnerRequests] = useState<LaundryPartnerRegistrationRequest[]>([]);
    const [retailPartnerRequests, setRetailPartnerRequests] = useState<RetailPartnerRegistrationRequest[]>([]);
    
    // === EFFECTS ===
    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
    }, [theme]);

    useEffect(() => {
        const root = document.documentElement;
        for (const key in themeColors) {
          root.style.setProperty(key, themeColors[key]);
        }
    }, [themeColors]);
    
    useEffect(() => {
        if(currentUser) {
            getTransactionsForUser(currentUser.id).then(setTransactions);
        } else {
            setTransactions(initialTransactions); // Show all for unauthenticated/admin view if needed
        }
    }, [currentUser]);


    // === HANDLERS & CALLBACKS ===

    const addNotification = useCallback((title: string, message: string, type: NotificationType = NotificationType.GENERAL, relatedId?: string) => {
        const newNotif: Notification = {
            id: `notif-${Date.now()}`,
            title,
            message,
            date: new Date().toISOString(),
            read: false,
            type,
            relatedId
        };
        setNotifications(prev => [newNotif, ...prev]);
        const sound = document.getElementById('notification-sound') as HTMLAudioElement;
        if (sound) sound.play().catch(e => console.error("Sound play failed", e));
    }, []);

    const getTransactionDataForAI = useCallback(() => {
        if (!currentUser) return Promise.resolve([]);
        return getTransactionsForUser(currentUser.id);
    }, [currentUser]);

    const handleLogin = (role: UserRole) => {
        let userToLogin: User | undefined;
        if (role === UserRole.MEMBER) userToLogin = allUsers.find(u => u.id === 'member-01');
        else if (role === UserRole.ADMIN) userToLogin = allUsers.find(u => u.id === 'admin-01');
        else if (role === UserRole.DEVELOPER) userToLogin = allUsers.find(u => u.id === 'dev-01');

        if (userToLogin) {
            setCurrentUser(userToLogin);
            setActivePage('Dashboard');
        }
    };
    
    const handleLogout = () => setCurrentUser(null);
    const handleToggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    const handleProfileUpdate = async (userId: string, updates: Partial<User>): Promise<User | null> => {
        let updatedUser: User | null = null;
        setAllUsers(prev => prev.map(u => {
            if (u.id === userId) {
                updatedUser = { ...u, ...updates };
                return updatedUser;
            }
            return u;
        }));
        if (currentUser?.id === userId) {
            setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
        }
        return updatedUser;
    };

    // Generic handler for all registration requests
    const handleRegistrationRequest = (type: string, formData: any, user: User) => {
        const baseRequest = {
            id: `${type.toLowerCase()}-${Date.now()}`,
            date: new Date().toISOString(),
            userId: user.id,
            userName: user.name,
            userAvatar: user.avatarUrl,
            status: 'pending' as const
        };

        let request: any;
        let setState: React.Dispatch<React.SetStateAction<any[]>>;
        let notificationTitle: string;

        switch(type) {
            case 'Seller':
                request = { ...baseRequest, ...formData };
                setState = setSellerRequests;
                notificationTitle = 'Pengajuan Mitra Penjual';
                break;
            case 'Driver':
                request = { ...baseRequest, ...formData };
                setState = setDriverRequests;
                notificationTitle = 'Pengajuan Mitra Pengemudi';
                break;
            case 'Arisan':
                request = { ...baseRequest, ...formData };
                setState = setArisanRequests;
                notificationTitle = 'Pengajuan Grup Arisan';
                break;
            case 'WastePartner':
                request = { ...baseRequest, ...formData };
                setState = setWastePartnerRequests;
                notificationTitle = 'Pengajuan Mitra Sampah';
                break;
            case 'LaundryPartner':
                request = { ...baseRequest, ...formData };
                setState = setLaundryPartnerRequests;
                notificationTitle = 'Pengajuan Mitra Cuci';
                break;
            case 'RetailPartner':
                request = { ...baseRequest, ...formData };
                setState = setRetailPartnerRequests;
                notificationTitle = 'Pengajuan Mitra Retail';
                break;
            default:
                return;
        }

        setState(prev => [request, ...prev]);
        addNotification(notificationTitle, `Pengajuan Anda telah dikirim dan sedang menunggu persetujuan admin.`);
    };
    
    const handleApproveRegistration = (type: string, requestId: string, approve: boolean) => {
        const status = approve ? 'approved' : 'rejected';
        let userIdToUpdate: string | undefined;

        const updateRequestList = (setter: React.Dispatch<React.SetStateAction<any[]>>, flag?: keyof User) => {
            setter(prev => prev.map(req => {
                if (req.id === requestId) {
                    userIdToUpdate = req.userId;
                    if (approve && flag) {
                        setAllUsers(users => users.map(u => u.id === req.userId ? { ...u, [flag]: true } : u));
                    }
                    return { ...req, status };
                }
                return req;
            }));
        };

        switch(type) {
            case 'seller': updateRequestList(setSellerRequests, 'isSeller'); break;
            case 'driver': updateRequestList(setDriverRequests, 'driverBalance'); break;
            case 'waste': updateRequestList(setWastePartnerRequests, 'isWastePartner'); break;
            case 'laundry': updateRequestList(setLaundryPartnerRequests, 'isLaundryPartner'); break;
            case 'retail': updateRequestList(setRetailPartnerRequests, 'isRetailPartner'); break;
            case 'arisan': updateRequestList(setArisanRequests); break;
        }
        
        if (userIdToUpdate) {
            addNotification(
                `Status Pengajuan ${type}`,
                `Pengajuan kemitraan Anda telah ${approve ? 'disetujui' : 'ditolak'}.`
            );
        }
    };
    
     const handleWasteDepositRequest = (wasteTypeName: string, weight: number, value: number) => {
        if (!currentUser) return;
        const newTx: Transaction = {
            id: `tx-waste-${Date.now()}`,
            userId: currentUser.id,
            userName: currentUser.name,
            date: new Date().toISOString(),
            type: TransactionType.WASTE_DEPOSIT,
            status: TransactionStatus.PENDING,
            amount: value,
            description: `Setor ${wasteTypeName} ${weight}kg`,
        };
        setTransactions(prev => [newTx, ...prev]);
        addNotification('Permintaan Setor Sampah', `Pengajuan setoran sampah Anda sebesar ${formatToRupiah(value)} sedang menunggu verifikasi.`);
    };
    
    const handleApproveWasteDeposit = (transactionId: string) => {
        setTransactions(prev => prev.map(tx => {
            if (tx.id === transactionId) {
                addNotification('Setoran Sampah Disetujui', `Setoran sampah senilai ${formatToRupiah(tx.amount)} telah disetujui dan saldo ditambahkan.`);
                return { ...tx, status: TransactionStatus.COMPLETED };
            }
            return tx;
        }));
    };

    const handlePayZakat = (amount: number) => {
        // Zakat program ID is hardcoded based on mock data
        const zakatProgramId = 3; 
        if (amount > 0) {
            setSelectedDonationProgramId(zakatProgramId);
            setPrefilledDonation({ programId: zakatProgramId, amount });
            setActivePage('Detail Donasi');
        } else {
            // If zakat is 0, just go to the main donation page
            setActivePage('Donasi');
        }
    };

    const handleAddDonationProgram = (program: Omit<DonationProgram, 'id'>) => {
        setDonationPrograms(prev => {
            const newId = Math.max(0, ...prev.map(p => p.id)) + 1;
            const newProgram: DonationProgram = { ...program, id: newId };
            return [newProgram, ...prev];
        });
        addNotification('Program Donasi Ditambahkan', `Program "${program.title}" berhasil dibuat.`);
    };

    const handleUpdateDonationProgram = (updatedProgram: DonationProgram) => {
        setDonationPrograms(prev => prev.map(p => p.id === updatedProgram.id ? updatedProgram : p));
        addNotification('Program Donasi Diperbarui', `Program "${updatedProgram.title}" berhasil diperbarui.`);
    };

    const handleDeleteDonationProgram = (programId: number) => {
        setDonationPrograms(prev => prev.filter(p => p.id !== programId));
        addNotification('Program Donasi Dihapus', `Program donasi telah berhasil dihapus.`);
    };

    if (!currentUser) {
        return <LoginPage onLogin={handleLogin} />;
    }

    // This is a simplified balance calculation for display.
    const currentBalance = transactions
        .filter(t => t.userId === currentUser.id && t.status === TransactionStatus.COMPLETED)
        .reduce((acc, t) => {
            if ([TransactionType.TOP_UP, TransactionType.SALE, TransactionType.TRANSFER_IN, TransactionType.WASTE_DEPOSIT, TransactionType.RETAIL_PAYOUT, TransactionType.LAUNDRY_PAYOUT].includes(t.type)) {
                return acc + t.amount;
            }
            if ([TransactionType.WITHDRAWAL, TransactionType.PURCHASE, TransactionType.TRANSFER_OUT, TransactionType.CONTRIBUTION, TransactionType.DONATION].includes(t.type)) {
                return acc - Math.abs(t.amount); // Ensure amount is subtracted
            }
            return acc;
        }, 0);
    
    const renderActivePage = () => {
        if (comingSoonFeature) {
            return <ComingSoonPage featureName={comingSoonFeature} setActivePage={(page) => { setActivePage(page); setComingSoonFeature(''); }} />;
        }
        switch(activePage) {
            case 'Dashboard':
                return currentUser.role === UserRole.MEMBER ? 
                    <MemberDashboard user={currentUser} transactions={transactions} theme={theme} setActivePage={setActivePage} featureVisibility={featureVisibility} onShowComingSoon={(name) => setComingSoonFeature(name)} getTransactionData={getTransactionDataForAI} setInitialWithdrawalTab={setInitialWithdrawalTab} /> :
                    <AdminDashboard user={currentUser} transactions={transactions} theme={theme} setActivePage={setActivePage} featureVisibility={featureVisibility} onShowComingSoon={(name) => setComingSoonFeature(name)} getTransactionData={getTransactionDataForAI} setInitialWithdrawalTab={setInitialWithdrawalTab} />;
            case 'Members': return <MembersList 
                navigateToProfile={(id) => { setViewingUserId(id); setActivePage('Profile'); }}
                sellerRequests={sellerRequests}
                driverRequests={driverRequests}
                arisanRequests={arisanRequests}
                wastePartnerRequests={wastePartnerRequests}
                laundryPartnerRequests={laundryPartnerRequests}
                retailPartnerRequests={retailPartnerRequests}
                onApprove={handleApproveRegistration}
            />;
            case 'Admins': return <AdminsList navigateToProfile={(id) => { setViewingUserId(id); setActivePage('Profile'); }} currentUser={currentUser} onBroadcast={(msg) => addNotification('Broadcast', msg)} />;
            case 'Profile': return <UserProfile userToViewId={viewingUserId || currentUser.id} currentUser={currentUser} onLogout={handleLogout} setActivePage={setActivePage} onProfileUpdate={handleProfileUpdate} navigateToProfile={(id) => setViewingUserId(id)} favorites={favorites} onToggleFavorite={()=>{}} navigateToProductDetail={(id) => { setSelectedProductId(id); setActivePage('Detail Produk'); }} themeColors={themeColors} setThemeColors={setThemeColors} />;
            case 'Top Up': return <TopUpPage setActivePage={setActivePage} onRequestTopUp={() => {}} currentUser={currentUser} transactions={transactions} vaBanks={vaBanks} setVaBanks={setVaBanks} eWallets={eWallets} setEWallets={setEWallets} retailOutlets={retailOutlets} setRetailOutlets={setRetailOutlets} onPartnerRegistrationRequest={(formData) => handleRegistrationRequest('RetailPartner', formData, currentUser)} />;
            case 'Tarik Saldo': return <TarikSaldoPage setActivePage={setActivePage} currentUser={currentUser} onRequestWithdrawal={() => {}} initialTab={initialWithdrawalTab} />;
            case 'Transfer': return <TransferPage setActivePage={setActivePage} currentUser={currentUser} onTransfer={() => {}} currentBalance={currentBalance} />;
            case 'Donasi': return <DonasiPage setActivePage={setActivePage} navigateToDonationDetail={(id) => {setSelectedDonationProgramId(id); setActivePage('Detail Donasi');}} donationPrograms={donationPrograms} />;
            case 'Detail Donasi':
                const prefill = prefilledDonation?.programId === selectedDonationProgramId ? prefilledDonation.amount : undefined;
                const programForDetail = donationPrograms.find(p => p.id === selectedDonationProgramId);
                return <DonasiDetailPage 
                    setActivePage={setActivePage} 
                    program={programForDetail!} 
                    onDonate={() => {}} 
                    prefilledAmount={prefill}
                    onPageLeave={() => setPrefilledDonation(null)}
                />;
            case 'Semua Program Donasi': return <AllDonationsPage setActivePage={setActivePage} navigateToDonationDetail={(id) => {setSelectedDonationProgramId(id); setActivePage('Detail Donasi');}} donationPrograms={donationPrograms} />;
            case 'Jual Beli': return <JualBeliPage setActivePage={setActivePage} navigateToProductDetail={(id) => { setSelectedProductId(id); setActivePage('Detail Produk'); }} onAddToCart={()=>{}} onBuyNow={()=>{}} onToggleFavorite={()=>{}} favorites={favorites} />;
            case 'Detail Produk': return <ProductDetailPage setActivePage={setActivePage} productId={selectedProductId!} onAddToCart={()=>{}} onBuyNow={()=>{}} onToggleFavorite={()=>{}} isFavorite={favorites.includes(selectedProductId!)} navigateToProfile={(id) => { setViewingUserId(id); setActivePage('Profile'); }}/>;
            case 'Tambah Produk': return <AddProductPage setActivePage={setActivePage} currentUser={currentUser} onAddProduct={() => {}} />;
            case 'Keranjang': return <CartPage cart={cart} onRemoveFromCart={()=>{}} onUpdateCartQuantity={()=>{}} setActivePage={setActivePage} />;
            case 'Checkout': return <CheckoutPage setActivePage={setActivePage} />;
            case 'Iuran': return <IuranPage setActivePage={setActivePage} onRequestIuranPayment={()=>{}} onAddNotification={()=>{}} currentUser={currentUser} />;
            case 'Arisan': return <ArisanPage setActivePage={setActivePage} currentUser={currentUser} />;
            case 'Loker': return <LokerPage setActivePage={setActivePage} currentUser={currentUser} onApplyForJob={()=>{}} onViewJobDetail={(id) => {setSelectedJobId(id); setActivePage('Detail Loker');}} />;
            case 'Detail Loker': return <JobDetailPage setActivePage={setActivePage} jobId={selectedJobId!} currentUser={currentUser} onApplyForJob={() => {}} />;
            case 'Komunitas': return <KomunitasPage setActivePage={setActivePage} currentUser={currentUser} navigateToProfile={(id) => { setViewingUserId(id); setActivePage('Profile'); }} />;
            case 'Game': return <GamePage setActivePage={setActivePage} />;
            case 'Islamic Center': return <IslamicCenter setActivePage={setActivePage} onPayZakat={handlePayZakat} />;
            case 'Hitung Sipil': return <HitungSipilPage setActivePage={setActivePage} />;
            case 'Alat Hitung': return <AlatHitungPage setActivePage={setActivePage} />;
            case 'Quiz': return <QuizPage setActivePage={setActivePage} />;
            case 'Bayar & Beli': return <BayarBeliPage setActivePage={setActivePage} />;
            case 'Dream Weaver': return <KerenPage setActivePage={setActivePage} />;
            case 'Notifikasi': return <NotificationsPage currentUser={currentUser} notifications={notifications} transactions={transactions} setActivePage={setActivePage} onMarkAsRead={()=>{}} onMarkAllAsRead={()=>{}} onTransactionApproval={()=>{}} />;
            case 'Riwayat Transaksi': return <RiwayatTransaksiPage currentUser={currentUser} setActivePage={setActivePage} />;
            case 'Riwayat Pesanan': return <RiwayatPesananPage setActivePage={setActivePage} />;
            case 'Favorit Saya': return <FavoritPage favorites={favorites} setActivePage={setActivePage} navigateToProductDetail={(id) => { setSelectedProductId(id); setActivePage('Detail Produk'); }} onAddToCart={()=>{}} onBuyNow={()=>{}} onToggleFavorite={()=>{}} />;
            case 'Syarat & Ketentuan': return <SyaratKetentuanPage currentUser={currentUser} setActivePage={setActivePage} />;
            case 'Kebijakan Privasi': return <KebijakanPrivasiPage currentUser={currentUser} setActivePage={setActivePage} />;
            case 'Disclaimer': return <DisclaimerPage currentUser={currentUser} setActivePage={setActivePage} />;
            case 'Kontak Kami': return <KontakKamiPage currentUser={currentUser} setActivePage={setActivePage} />;
            case 'Bantuan': return <BantuanPage currentUser={currentUser} setActivePage={setActivePage} />;
            case 'Tentang Aplikasi': return <TentangAplikasiPage currentUser={currentUser} setActivePage={setActivePage} />;
            case 'Pengaturan Fitur': return <FeatureSettingsPage currentUser={currentUser} setActivePage={setActivePage} featureVisibility={featureVisibility} onToggleFeature={(id) => setFeatureVisibility(prev => ({...prev, [id]: !prev[id]}))} onRequestFeatureActivation={()=>{}} />;
            case 'Ojek': return <OjekPage setActivePage={setActivePage} currentUser={currentUser} onProfileUpdate={handleProfileUpdate} />;
            case 'Pengemudi': return <PengemudiPage setActivePage={setActivePage} currentUser={currentUser} onProfileUpdate={handleProfileUpdate} />;
            case 'Laundry': return <LaundryPage setActivePage={setActivePage} onSelectService={(service) => { setSelectedLaundryService(service); setActivePage('Pesan Laundry'); }} />;
            case 'Pesan Laundry': return <LaundryOrderPage setActivePage={setActivePage} serviceType={selectedLaundryService} onPlaceOrder={(order) => { const newOrder: LaundryOrder = { id: `laundry-${Date.now()}`, customerId: currentUser.id, customerName: currentUser.name, customerAvatar: currentUser.avatarUrl, statusSteps: ['Pesanan Dibuat'], createdAt: new Date().toISOString(), ...order }; setLaundryOrders(prev => [newOrder, ...prev]); setActiveLaundryOrder(newOrder); setActivePage('Lacak Laundry'); }}/>;
            case 'Lacak Laundry': return <LaundryTrackingPage order={activeLaundryOrder!} onCancelOrder={() => { setActiveLaundryOrder(null); setActivePage('Laundry');}} />;
            case 'Laundry Partner': return <LaundryPartnerPage setActivePage={setActivePage} currentUser={currentUser} onPartnerRegistrationRequest={(formData) => handleRegistrationRequest('LaundryPartner', formData, currentUser)} />;
            case 'Laundry Partner Dashboard': return <LaundryPartnerDashboardPage setActivePage={setActivePage} currentUser={currentUser} orders={laundryOrders} onUpdateStatus={(orderId, newStatus) => setLaundryOrders(prev => prev.map(o => o.id === orderId ? {...o, statusSteps: [...o.statusSteps, newStatus]} : o))} />;
            case 'Bank Sampah': return <BankSampahPage setActivePage={setActivePage} currentUser={currentUser} transactions={transactions} onWasteDepositRequest={handleWasteDepositRequest} />;
            case 'Kasir': return <KasirPage setActivePage={setActivePage} getProducts={async () => mockProducts} onSale={() => {}} />;
            case 'Peluang Mitra': return <PeluangMitraPage setActivePage={setActivePage} />;
            case 'Dasbor Mitra': return <PartnerDashboardPage setActivePage={setActivePage} currentUser={currentUser} />;
            case 'Daftar Pengemudi': return <DaftarPengemudiPage setActivePage={setActivePage} currentUser={currentUser} onDriverRegistrationRequest={(formData) => handleRegistrationRequest('Driver', formData, currentUser)} />;
            case 'Daftar Penjual': return <DaftarPenjualPage setActivePage={setActivePage} currentUser={currentUser} onSellerRegistrationRequest={(formData) => handleRegistrationRequest('Seller', formData, currentUser)} />;
            case 'Daftar Arisan': return <DaftarArisanPage setActivePage={setActivePage} currentUser={currentUser} onArisanRegistrationRequest={(formData) => handleRegistrationRequest('Arisan', formData, currentUser)} />;
            case 'Daftar Mitra Sampah': return <DaftarMitraSampahPage setActivePage={setActivePage} currentUser={currentUser} onWastePartnerRegistrationRequest={(formData) => handleRegistrationRequest('WastePartner', formData, currentUser)} />;
            case 'Mitra Sampah Dashboard': return <MitraSampahDashboardPage setActivePage={setActivePage} currentUser={currentUser} transactions={transactions} onApproveDeposit={handleApproveWasteDeposit} />;
            case 'Daftar Mitra Retail': return <DaftarMitraRetailPage setActivePage={setActivePage} currentUser={currentUser} onRetailPartnerRegistrationRequest={(formData) => handleRegistrationRequest('RetailPartner', formData, currentUser)} />;
            case 'Dasbor Mitra Retail': return <RetailPartnerDashboardPage setActivePage={setActivePage} currentUser={currentUser} transactions={transactions} onProcessRetailTopUp={async () => ({success: true, message: "Success"})} />;
            case 'Dasbor Mitra Penjual': return <DasborMitraPenjualPage setActivePage={setActivePage} />;
            case 'Manage Donations': return <ManageDonationsPage setActivePage={setActivePage} donationPrograms={donationPrograms} onAddProgram={handleAddDonationProgram} onUpdateProgram={handleUpdateDonationProgram} onDeleteProgram={handleDeleteDonationProgram} />;
            default:
                return <MemberDashboard user={currentUser} transactions={transactions} theme={theme} setActivePage={setActivePage} featureVisibility={featureVisibility} onShowComingSoon={(name) => setComingSoonFeature(name)} getTransactionData={getTransactionDataForAI} setInitialWithdrawalTab={setInitialWithdrawalTab} />;
        }
    };
    
    return (
        <div className={`${theme} font-sans`}>
            <div className="flex h-screen bg-background text-text-primary dark:bg-dark-background dark:text-dark-text-primary">
                <Sidebar activePage={activePage} setActivePage={setActivePage} currentUser={currentUser} setViewingUserId={setViewingUserId} />
                <main className="flex-1 flex flex-col overflow-hidden">
                    <Header 
                        currentUser={currentUser} 
                        notifications={notifications}
                        cart={cart}
                        theme={theme} 
                        onToggleTheme={handleToggleTheme}
                        onViewProfile={() => { setViewingUserId(null); setActivePage('Profile'); }}
                        onViewNotifications={() => setActivePage('Notifikasi')}
                        onViewCart={() => setActivePage('Keranjang')}
                    />
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
                        {renderActivePage()}
                    </div>
                </main>
                <BottomNav activePage={activePage} setActivePage={setActivePage} currentUser={currentUser} setViewingUserId={setViewingUserId} />
            </div>
        </div>
    );
};

export default App;