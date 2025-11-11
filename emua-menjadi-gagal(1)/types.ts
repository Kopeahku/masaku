import type { ElementType } from 'react';

export enum UserRole {
  MEMBER = 'Member',
  ADMIN = 'Admin',
  DEVELOPER = 'Developer',
}

export interface User {
  id: string;
  name: string;
  email?: string;
  avatarUrl: string;
  role: UserRole;
  joinedDate: string;
  whatsapp?: string;
  driverBalance?: number;
  isRetailPartner?: boolean;
  isLaundryPartner?: boolean;
  isSeller?: boolean;
  isWastePartner?: boolean;
}

export enum TransactionType {
  SAVINGS = 'SAVINGS',
  WITHDRAWAL = 'WITHDRAWAL',
  TOP_UP = 'TOP_UP',
  TRANSFER_IN = 'TRANSFER_IN',
  TRANSFER_OUT = 'TRANSFER_OUT',
  CONTRIBUTION = 'CONTRIBUTION',
  DONATION = 'DONATION',
  SALE = 'SALE',
  PURCHASE = 'PURCHASE',
  BALANCE_ADJUSTMENT = 'BALANCE_ADJUSTMENT',
  PARTNER_REGISTRATION_REQUEST = 'PARTNER_REGISTRATION_REQUEST',
  RETAIL_PAYOUT = 'RETAIL_PAYOUT',
  WASTE_DEPOSIT = 'WASTE_DEPOSIT',
  LAUNDRY_PAYOUT = 'LAUNDRY_PAYOUT'
}

export enum TransactionStatus {
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  date: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  description: string;
  method?: string;
}

export interface SavingsGoal {
  name: string;
  targetAmount: number;
  targetDate?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: NotificationType;
  relatedId?: string;
}

export enum NotificationType {
  GENERAL = 'GENERAL',
  TRANSACTION_SUCCESS = 'TRANSACTION_SUCCESS',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  APPROVAL_REQUEST = 'APPROVAL_REQUEST',
  BROADCAST = 'BROADCAST',
}

export interface HeaderProps {
  currentUser: User;
  notifications: Notification[];
  cart: CartItem[];
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onViewProfile: () => void;
  onViewNotifications: () => void;
  onViewCart: () => void;
}

export interface StatCardData {
  title: string;
  value: string;
  icon: ElementType;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    category: string;
    imageUrl: string;
    stock: number;
    variants?: string[];
    seller: {
        id: string;
        name: string;
        avatarUrl: string;
        location: string;
    };
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface DonationProgram {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    targetAmount: number;
    currentAmount: number;
}

export interface Iuran {
    id: string;
    title: string;
    amount: number;
    dueDate: string;
}

export interface Job {
    id: number;
    title: string;
    company: string;
    logo: string;
    location: string;
    type: string;
    salary: string;
    description: string;
    responsibilities: string[];
    requirements: string[];
}

export interface CommunityPost {
    id: string;
    authorId: string;
    authorName: string;
    authorAvatarUrl: string;
    timestamp: string;
    content: string;
    topic: string;
    imageUrl?: string;
    likes: string[];
    comments: PostComment[];
}

export interface PostComment {
    id: string;
    authorId: string;
    authorName: string;
    authorAvatarUrl: string;
    timestamp: string;
    content: string;
    replies?: PostComment[];
}

export type ThemeColors = { [key: string]: string };


export enum LaundryServiceType {
    KILOAN = 'Kiloan',
    SATUAN = 'Satuan',
    EKSPRES = 'Ekspres'
}

export interface LaundryOrderItem {
    name: string;
    quantity: number;
}

export type LaundryStatus = 
    'Pesanan Dibuat' | 
    'Mencari Kurir' | 
    'Kurir Menuju Lokasi' |
    'Pakaian Diterima' |
    'Proses Cuci' | 
    'Siap Diantar' | 
    'Selesai';

export interface LaundryOrder {
    id: string;
    customerId: string;
    customerName: string;
    customerAvatar: string;
    serviceType: LaundryServiceType | string;
    address: string;
    pickupTime: string;
    createdAt: string;
    estimatedPrice: number;
    statusSteps: LaundryStatus[];
    notes?: string;
    items?: LaundryOrderItem[];
    estimatedWeight?: number;
}

export interface OjekOrder {
    id: string;
    from: string;
    to: string;
    service: 'motor' | 'mobil' | 'kirim';
    offeredPrice: number;
    passengerName: string;
    passengerId: string;
    driverName?: string;
    driverId?: string;
    paymentMethod: 'saldo' | 'cash';
    status: 'pending' | 'in_progress' | 'completed' | 'declined';
    itemWeight?: number;
    itemLength?: number;
    itemWidth?: number;
    itemHeight?: number;
    deliveryVehicle?: 'motor' | 'mobil';
}

export interface PaymentMethod {
    name: string;
    logo: string;
    accountNumber?: string;
}

export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface BaseRegistrationRequest {
    id: string;
    date: string;
    userId: string;
    userName: string;
    userAvatar: string;
    status: RequestStatus;
}

export interface SellerRegistrationRequest extends BaseRegistrationRequest {
    storeName: string;
    storeDescription: string;
    pickupAddress: string;
}

export interface DriverRegistrationRequest extends BaseRegistrationRequest {
    vehicleType: 'Motor' | 'Mobil';
    licensePlate: string;
    vehicleModel: string;
}

export interface ArisanRegistrationRequest extends BaseRegistrationRequest {
    groupName: string;
    feeAmount: number;
    paymentPeriod: 'Mingguan' | 'Bulanan';
    memberCount: number;
    startDate: string;
    description?: string;
}

export interface WastePartnerRegistrationRequest extends BaseRegistrationRequest {
    bankName: string;
    address: string;
    operationalHours: string;
    acceptedWastes: string;
}

export interface LaundryPartnerRegistrationRequest extends BaseRegistrationRequest {
    businessName: string;
    address: string;
    hours: string;
    services: {
        kiloan: boolean;
        satuan: boolean;
        ekspres: boolean;
        setrika: boolean;
    };
}

export interface RetailPartnerRegistrationRequest extends BaseRegistrationRequest {
    storeName: string;
    address: string;
}