// Fix: Import ElementType from React to resolve type error.
import type { ElementType } from 'react';
import {
  User,
  UserRole,
  Transaction,
  TransactionType,
  TransactionStatus,
  SavingsGoal,
  Product,
  Notification,
  NotificationType,
  Iuran,
  DonationProgram,
  Job,
  CommunityPost,
  PostComment,
  LaundryOrder,
  LaundryStatus,
  SellerRegistrationRequest,
  DriverRegistrationRequest,
  ArisanRegistrationRequest,
  WastePartnerRegistrationRequest,
  LaundryPartnerRegistrationRequest,
  RetailPartnerRegistrationRequest
} from '../types.ts';
// Fix: Add guard for heroicons
import { 
    CubeIcon as CubeIconOutline, 
    ShoppingCartIcon as ShoppingCartIconOutline, 
    SparklesIcon as SparklesIconOutline
} from '@heroicons/react/24/outline';

// Fix: Add guard for heroicons
const CubeIcon = (CubeIconOutline as any).default || CubeIconOutline;
const ShoppingCartIcon = (ShoppingCartIconOutline as any).default || ShoppingCartIconOutline;
const SparklesIcon = (SparklesIconOutline as any).default || SparklesIconOutline;


// --- MOCK DATA ---

export const mockUsers: User[] = [
  { id: 'member-01', name: 'Budi Santoso', email: 'budi.s@example.com', avatarUrl: 'https://picsum.photos/seed/budi/100', role: UserRole.MEMBER, joinedDate: '2023-01-15T09:00:00Z', whatsapp: '081234567890', driverBalance: 50000 },
  { id: 'member-02', name: 'Siti Aminah', email: 'siti.a@example.com', avatarUrl: 'https://picsum.photos/seed/siti/100', role: UserRole.MEMBER, joinedDate: '2023-02-20T14:30:00Z', whatsapp: '081234567891', isSeller: true },
  { id: 'admin-01', name: 'Admin EmaSaku', email: 'admin@emasaku.com', avatarUrl: 'https://picsum.photos/seed/admin1/100', role: UserRole.ADMIN, joinedDate: '2023-01-01T08:00:00Z', whatsapp: '081111111111', isRetailPartner: true },
  { id: 'dev-01', name: 'Developer EmaSaku', email: 'dev@emasaku.com', avatarUrl: 'https://picsum.photos/seed/dev1/100', role: UserRole.DEVELOPER, joinedDate: '2023-01-01T07:00:00Z', whatsapp: '089999999999' },
  { id: 'member-03', name: 'Eko Wijoyo', email: 'eko.w@example.com', avatarUrl: 'https://picsum.photos/seed/eko/100', role: UserRole.MEMBER, joinedDate: '2023-03-10T11:00:00Z', isLaundryPartner: true },
  { id: 'member-04', name: 'Dewi Lestari', email: 'dewi.l@example.com', avatarUrl: 'https://picsum.photos/seed/dewi/100', role: UserRole.MEMBER, joinedDate: '2023-04-05T18:00:00Z' },
  { id: 'driver-01', name: 'Agus Setiawan', email: 'agus.s@driver.com', avatarUrl: 'https://picsum.photos/seed/agus/100', role: UserRole.MEMBER, joinedDate: '2023-05-01T09:00:00Z', driverBalance: 150000 },
];

export const mockTransactions: Transaction[] = [
    { id: 'tx-001', userId: 'member-01', userName: 'Budi Santoso', date: new Date(Date.now() - 2 * 86400000).toISOString(), type: TransactionType.TOP_UP, status: TransactionStatus.COMPLETED, amount: 500000, description: 'Top Up Saldo via BCA VA', method: 'BCA' },
    { id: 'tx-002', userId: 'member-01', userName: 'Budi Santoso', date: new Date(Date.now() - 1 * 86400000).toISOString(), type: TransactionType.PURCHASE, status: TransactionStatus.COMPLETED, amount: -75000, description: 'Beli Kopi di Marketplace' },
    { id: 'tx-003', userId: 'member-01', userName: 'Budi Santoso', date: new Date().toISOString(), type: TransactionType.WITHDRAWAL, status: TransactionStatus.PENDING, amount: -100000, description: 'Tarik Saldo ke BCA' },
    { id: 'tx-004', userId: 'member-01', userName: 'Budi Santoso', date: new Date(Date.now() - 5 * 86400000).toISOString(), type: TransactionType.DONATION, status: TransactionStatus.COMPLETED, amount: -25000, description: 'Donasi Panti Asuhan' },
    { id: 'tx-005', userId: 'member-01', userName: 'Budi Santoso', date: new Date(Date.now() - 10 * 86400000).toISOString(), type: TransactionType.CONTRIBUTION, status: TransactionStatus.COMPLETED, amount: -50000, description: 'Iuran Keamanan Juli' },
    { id: 'tx-010', userId: 'member-01', userName: 'Budi Santoso', date: new Date(Date.now() - 3 * 86400000).toISOString(), type: TransactionType.WASTE_DEPOSIT, status: TransactionStatus.COMPLETED, amount: 15000, description: 'Setor Sampah Plastik 3kg' },
    { id: 'tx-006', userId: 'member-02', userName: 'Siti Aminah', date: new Date(Date.now() - 4 * 86400000).toISOString(), type: TransactionType.SALE, status: TransactionStatus.COMPLETED, amount: 150000, description: 'Penjualan Buku Bekas' },
    { id: 'tx-007', userId: 'member-03', userName: 'Eko Wijoyo', date: new Date(Date.now() - 1 * 86400000).toISOString(), type: TransactionType.TOP_UP, status: TransactionStatus.PENDING, amount: 200000, description: 'Top Up via Indomaret' },
    { id: 'tx-008', userId: 'member-04', userName: 'Dewi Lestari', date: new Date(Date.now() - 2 * 86400000).toISOString(), type: TransactionType.WITHDRAWAL, status: TransactionStatus.COMPLETED, amount: -50000, description: 'Tarik Saldo ke Mandiri' },
    { id: 'tx-009', userId: 'member-01', userName: 'Budi Santoso', date: new Date(Date.now() - 6 * 86400000).toISOString(), type: TransactionType.TOP_UP, status: TransactionStatus.FAILED, amount: 100000, description: 'Top Up Saldo via GoPay' },
];

export const mockSavingsGoals: { [userId: string]: SavingsGoal } = {
  'member-01': { name: 'Liburan Akhir Tahun', targetAmount: 5000000, targetDate: '2024-12-25' },
};

export const mockProducts: Product[] = [
    { id: 1, name: 'Termos Kopi Stainless Steel 500ml', price: 75000, description: 'Termos tahan panas dan dingin, cocok untuk dibawa bepergian.', category: 'Peralatan Rumah Tangga', imageUrl: 'https://images.unsplash.com/photo-1559526732-52033c1d4a94?w=300', stock: 10, seller: { id: 'member-02', name: 'Siti Aminah', avatarUrl: mockUsers[1].avatarUrl, location: 'Jakarta Selatan' } },
    { id: 2, name: 'Buku "Atomic Habits" by James Clear', price: 95000, description: 'Buku self-help terlaris tentang membangun kebiasaan baik.', category: 'Buku', imageUrl: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300', stock: 5, seller: { id: 'member-04', name: 'Dewi Lestari', avatarUrl: mockUsers[3].avatarUrl, location: 'Bandung' } },
];

export const mockNotifications: Notification[] = [
    { id: 'notif-1', title: 'Top Up Diproses', message: 'Permintaan Top Up Anda sebesar Rp 200.000 sedang diverifikasi oleh admin.', date: new Date().toISOString(), read: false, type: NotificationType.GENERAL },
    { id: 'notif-2', title: 'Penarikan Dana Berhasil', message: 'Penarikan dana sebesar Rp 50.000 ke rekening Mandiri Anda telah berhasil.', date: new Date(Date.now() - 86400000).toISOString(), read: true, type: NotificationType.TRANSACTION_SUCCESS },
    { id: 'notif-3', title: 'Permintaan Persetujuan', message: 'Eko Wijoyo mengajukan Top Up sebesar Rp 200.000 via Indomaret.', date: new Date(Date.now() - 3600000).toISOString(), read: false, type: NotificationType.APPROVAL_REQUEST, relatedId: 'tx-007' },
];

export const mockLaundryOrders: LaundryOrder[] = [
    {
        id: `laundry-${Date.now()}`,
        customerId: 'member-01',
        customerName: 'Budi Santoso',
        customerAvatar: mockUsers[0].avatarUrl,
        serviceType: 'Kiloan',
        address: 'Jl. Merdeka No. 17, Jakarta Pusat',
        pickupTime: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        estimatedPrice: 24000,
        statusSteps: ['Pesanan Dibuat', 'Mencari Kurir', 'Kurir Menuju Lokasi', 'Pakaian Diterima'],
        estimatedWeight: 3
    }
];

export const mockDonationPrograms: DonationProgram[] = [
    { id: 1, title: 'Bantu Korban Banjir', description: 'Bantuan darurat untuk saudara kita yang terdampak banjir bandang di wilayah Jawa Barat.', imageUrl: 'https://images.unsplash.com/photo-1567493757918-35613a933f0b?w=400', category: 'Bencana Alam', targetAmount: 50000000, currentAmount: 12500000 },
    { id: 2, title: 'Beasiswa Anak Yatim', description: 'Mari kita dukung pendidikan anak-anak yatim agar mereka dapat meraih cita-citanya.', imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400', category: 'Pendidikan', targetAmount: 100000000, currentAmount: 78000000 },
    { id: 3, title: 'Tunaikan Zakat Maal Anda', description: 'Salurkan zakat maal Anda melalui EmaSaku untuk membersihkan harta dan membantu mereka yang membutuhkan. Zakat Anda akan disalurkan kepada mustahik yang berhak.', imageUrl: 'https://images.unsplash.com/photo-1593113516828-6f22bca04804?w=400', category: 'Zakat', targetAmount: 250000000, currentAmount: 45750000 },
];

// --- MOCK REGISTRATION REQUESTS ---
export const sellerRegistrationRequests: SellerRegistrationRequest[] = [];
export const driverRegistrationRequests: DriverRegistrationRequest[] = [];
export const arisanRegistrationRequests: ArisanRegistrationRequest[] = [];
export const wastePartnerRegistrationRequests: WastePartnerRegistrationRequest[] = [];
export const laundryPartnerRegistrationRequests: LaundryPartnerRegistrationRequest[] = [];
export const retailPartnerRegistrationRequests: RetailPartnerRegistrationRequest[] = [];


// --- MOCK API FUNCTIONS ---

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getUserById = async (id: string): Promise<User | null> => {
  await delay(300);
  return mockUsers.find(u => u.id === id) || null;
};

export const getAllUsers = async (): Promise<User[]> => {
    await delay(500);
    return mockUsers;
};

export const getTransactionsForUser = async (userId: string): Promise<Transaction[]> => {
  await delay(400);
  return mockTransactions.filter(t => t.userId === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getSavingsGoalForUser = async (userId: string): Promise<SavingsGoal | null> => {
  await delay(200);
  return mockSavingsGoals[userId] || null;
};

export const updateSavingsGoalForUser = async (userId: string, goalData: Partial<SavingsGoal>): Promise<SavingsGoal | null> => {
    await delay(300);
    const existingGoal = mockSavingsGoals[userId] || {};
    mockSavingsGoals[userId] = { ...existingGoal, ...goalData } as SavingsGoal;
    return mockSavingsGoals[userId];
};

export const getProducts = async (): Promise<Product[]> => {
    await delay(600);
    return mockProducts;
};

export const getProductById = async (id: number): Promise<Product | null> => {
    await delay(300);
    return mockProducts.find(p => p.id === id) || null;
};

export const getProductsBySellerId = async (sellerId: string): Promise<Product[]> => {
    await delay(400);
    return mockProducts.filter(p => p.seller.id === sellerId);
};

export const getIuranList = async (): Promise<Iuran[]> => {
    await delay(300);
    return [
        { id: 'iuran-1', title: 'Iuran Keamanan Kompleks', amount: 50000, dueDate: '2024-08-10' },
        { id: 'iuran-2', title: 'Kas RT 05', amount: 20000, dueDate: '2024-08-05' },
    ];
};

export const getArisanMembers = async (): Promise<User[]> => {
    await delay(200);
    return mockUsers.filter(u => u.role === UserRole.MEMBER).slice(0, 10);
};

export const getJobs = async (): Promise<Job[]> => {
    await delay(700);
    return [
        { id: 1, title: 'Admin Media Sosial', company: 'PT Maju Jaya', logo: 'https://logo.clearbit.com/maju.com', location: 'Jakarta', type: 'Full-time', salary: 'Rp 5jt - 7jt', description: 'Mengelola semua akun media sosial perusahaan.', responsibilities: ['Membuat konten', 'Menjawab DM'], requirements: ['S1 Komunikasi', 'Pengalaman 1 tahun'] },
    ];
};
export const getJobById = async (id: number): Promise<Job | null> => {
    const jobs = await getJobs();
    return jobs.find(j => j.id === id) || null;
};

export const featuredMembers: Pick<User, 'id' | 'name' | 'avatarUrl'>[] = mockUsers.slice(0, 4);

export const mockPosts: CommunityPost[] = [
    { id: 'post1', authorId: 'member-02', authorName: 'Siti Aminah', authorAvatarUrl: mockUsers[1].avatarUrl, timestamp: new Date(Date.now() - 3600000).toISOString(), content: 'Halo semua, ada yang punya tips investasi untuk pemula?', topic: 'Investasi', likes: ['member-01', 'dev-01'], comments: [] },
];

export const getCommunityPosts = async (): Promise<CommunityPost[]> => {
    await delay(800);
    return mockPosts;
};

export const addCommunityPost = async (postData: Pick<CommunityPost, 'content' | 'topic' | 'imageUrl'>, author: User): Promise<CommunityPost> => {
    await delay(400);
    const newPost: CommunityPost = {
        id: `post${Date.now()}`,
        authorId: author.id,
        authorName: author.name,
        authorAvatarUrl: author.avatarUrl,
        timestamp: new Date().toISOString(),
        content: postData.content,
        topic: postData.topic,
        imageUrl: postData.imageUrl,
        likes: [],
        comments: [],
    };
    mockPosts.unshift(newPost);
    return newPost;
};

export const togglePostLike = async (postId: string, userId: string): Promise<void> => {
    await delay(100);
    const post = mockPosts.find(p => p.id === postId);
    if(post) {
        const index = post.likes.indexOf(userId);
        if (index > -1) {
            post.likes.splice(index, 1);
        } else {
            post.likes.push(userId);
        }
    }
};

export const addPostComment = async (postId: string, commentData: Pick<PostComment, 'content'>, author: User, parentId?: string): Promise<CommunityPost | null> => {
    await delay(300);
    const post = mockPosts.find(p => p.id === postId);
    if (!post) return null;

    const newComment: PostComment = {
        id: `comment${Date.now()}`,
        authorId: author.id,
        authorName: author.name,
        authorAvatarUrl: author.avatarUrl,
        timestamp: new Date().toISOString(),
        content: commentData.content,
    };

    if (parentId) {
        // This is a simplified reply logic, doesn't handle nested replies
        const parentComment = post.comments.find(c => c.id === parentId);
        if (parentComment) {
            parentComment.replies = [...(parentComment.replies || []), newComment];
        }
    } else {
        post.comments.push(newComment);
    }
    return post;
};

export interface WasteType {
    id: string;
    name: string;
    pricePerKg: number;
    icon: ElementType;
}

export const getWasteTypes = async (): Promise<WasteType[]> => {
    await delay(300);
    return [
        { id: 'waste-1', name: 'Botol Plastik PET', pricePerKg: 3000, icon: CubeIcon },
        { id: 'waste-2', name: 'Kardus & Karton', pricePerKg: 1500, icon: ShoppingCartIcon },
        { id: 'waste-3', name: 'Logam (Kaleng)', pricePerKg: 2000, icon: SparklesIcon },
    ];
};

export const getLaundryOrders = async (): Promise<LaundryOrder[]> => {
    await delay(400);
    return mockLaundryOrders;
};