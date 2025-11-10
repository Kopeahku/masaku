import React, { useState, useMemo } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    ClipboardDocumentCheckIcon as ClipboardDocumentCheckIconSolid, 
    CurrencyDollarIcon as CurrencyDollarIconSolid, 
    InboxIcon as InboxIconSolid, 
    CheckCircleIcon as CheckCircleIconSolid,
    XMarkIcon as XMarkIconSolid,
    SparklesIcon as SparklesIconSolid
} from '@heroicons/react/24/solid';
import { User, LaundryOrder, LaundryStatus, LaundryOrderItem } from '../types.ts';
import { formatToRupiah } from '../utils/formatter.ts';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const ClipboardDocumentCheckIcon = (ClipboardDocumentCheckIconSolid as any).default || ClipboardDocumentCheckIconSolid;
const CurrencyDollarIcon = (CurrencyDollarIconSolid as any).default || CurrencyDollarIconSolid;
const InboxIcon = (InboxIconSolid as any).default || InboxIconSolid;
const CheckCircleIcon = (CheckCircleIconSolid as any).default || CheckCircleIconSolid;
const XMarkIcon = (XMarkIconSolid as any).default || XMarkIconSolid;
const SparklesIcon = (SparklesIconSolid as any).default || SparklesIconSolid;

interface LaundryPartnerDashboardPageProps {
  setActivePage: (page: string) => void;
  currentUser: User;
  orders: LaundryOrder[];
  onUpdateStatus: (orderId: string, newStatus: LaundryStatus) => void;
}

const ALL_STEPS: LaundryStatus[] = ['Pakaian Diterima', 'Proses Cuci', 'Siap Diantar', 'Selesai'];

const StatCard: React.FC<{ title: string, value: string, icon: React.ElementType }> = ({ title, value, icon: IconComponent }) => {
    const Icon = (IconComponent as any).default || IconComponent;
    return (
        <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-4 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
                <Icon className="w-7 h-7 text-primary dark:text-gold-light" />
            </div>
            <div>
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{title}</p>
                <p className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">{value}</p>
            </div>
        </div>
    );
};

const OrderDetailModal: React.FC<{ order: LaundryOrder, onClose: () => void }> = ({ order, onClose }) => (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm animate-fade-in">
        <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-2xl p-6 w-full max-w-lg relative max-h-[90vh] flex flex-col">
            <button onClick={onClose} className="absolute top-3 right-3 text-slate-400"><XMarkIcon className="w-6 h-6" /></button>
            <h2 className="text-xl font-bold mb-4">Detail Pesanan #{order.id.slice(-6)}</h2>
            <div className="flex-grow overflow-y-auto pr-2 space-y-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <p className="text-xs font-semibold">Pelanggan</p>
                    <p>{order.customerName}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <p className="text-xs font-semibold">Alamat</p>
                    <p>{order.address}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <p className="text-xs font-semibold">Jadwal Jemput</p>
                    <p>{new Date(order.pickupTime).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}</p>
                </div>
                {order.notes && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <p className="text-xs font-semibold">Catatan</p>
                        <p>{order.notes}</p>
                    </div>
                )}
                 <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <p className="text-xs font-semibold">Rincian</p>
                    {order.serviceType === 'Satuan' && order.items ? (
                        <ul className="list-disc pl-5">
                            {order.items.map(item => <li key={item.name}>{item.quantity}x {item.name}</li>)}
                        </ul>
                    ) : (
                        <p>{order.estimatedWeight} kg (Estimasi)</p>
                    )}
                </div>
                 <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <p className="text-xs font-semibold">Estimasi Biaya</p>
                    <p className="font-bold text-lg">{formatToRupiah(order.estimatedPrice)}</p>
                </div>
            </div>
            <button onClick={onClose} className="mt-4 w-full bg-slate-200 dark:bg-slate-700 font-semibold py-2 rounded-lg">Tutup</button>
        </div>
    </div>
);

const getNextActionText = (order: LaundryOrder): string | null => {
    const currentStatus = order.statusSteps[order.statusSteps.length - 1];
    if (currentStatus === 'Pakaian Diterima') return 'Mulai Cuci';
    if (currentStatus === 'Proses Cuci') return 'Selesai & Siap Antar';
    if (currentStatus === 'Siap Diantar') return 'Selesaikan Pesanan';
    return null;
};

const OrderCard: React.FC<{
    order: LaundryOrder;
    onViewDetail: (order: LaundryOrder) => void;
    onUpdateStatus: (order: LaundryOrder) => void;
}> = ({ order, onViewDetail, onUpdateStatus }) => {
    const currentStatus = order.statusSteps[order.statusSteps.length - 1];
    const nextActionText = getNextActionText(order);

    return (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-semibold text-text-secondary dark:text-dark-text-secondary">#{order.id.slice(-6)}</p>
                    <p className="font-bold text-text-primary dark:text-dark-text-primary">{order.customerName}</p>
                </div>
                <span className="text-xs font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full">{order.serviceType}</span>
            </div>
            <div className="my-3 py-3 border-y border-slate-200 dark:border-slate-700">
                <p className="text-sm font-semibold">Status: <span className="text-primary dark:text-gold-light">{currentStatus}</span></p>
                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">Dipesan pada: {new Date(order.createdAt).toLocaleString('id-ID')}</p>
            </div>
            <div className="flex gap-2">
                <button onClick={() => onViewDetail(order)} className="flex-1 bg-slate-200 dark:bg-slate-700 text-sm font-semibold py-2 rounded-md">Lihat Detail</button>
                {nextActionText && (
                    <button onClick={() => onUpdateStatus(order)} className="flex-1 bg-primary text-white dark:text-slate-900 text-sm font-bold py-2 rounded-md flex items-center justify-center gap-1">
                        <SparklesIcon className="w-4 h-4" />
                        {nextActionText}
                    </button>
                )}
            </div>
        </div>
    );
};

const LaundryPartnerDashboardPage: React.FC<LaundryPartnerDashboardPageProps> = ({ setActivePage, currentUser, orders, onUpdateStatus }) => {
    const [activeTab, setActiveTab] = useState<'aktif' | 'selesai'>('aktif');
    const [selectedOrder, setSelectedOrder] = useState<LaundryOrder | null>(null);

    const { activeOrders, completedOrders, stats } = useMemo(() => {
        const active: LaundryOrder[] = [];
        const completed: LaundryOrder[] = [];
        let revenueThisMonth = 0;
        
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        for (const order of orders) {
            const isCompleted = order.statusSteps.includes('Selesai');
            if (isCompleted) {
                completed.push(order);
                const orderDate = new Date(order.createdAt);
                if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
                    revenueThisMonth += order.estimatedPrice * 0.8; // 80% partner commission
                }
            } else {
                active.push(order);
            }
        }
        
        return {
            activeOrders: active,
            completedOrders: completed,
            stats: {
                revenue: formatToRupiah(revenueThisMonth),
                newOrders: active.filter(o => o.statusSteps.length <= 4).length.toString(), // 'Pakaian Diterima' is the 4th step
                completedThisMonth: completed.filter(o => {
                    const orderDate = new Date(o.createdAt);
                    return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
                }).length.toString()
            }
        };
    }, [orders]);

    const handleUpdate = (order: LaundryOrder) => {
        const currentStatus = order.statusSteps[order.statusSteps.length - 1];
        const currentStatusIndex = ALL_STEPS.findIndex(step => step === currentStatus);
        
        if (currentStatusIndex > -1 && currentStatusIndex < ALL_STEPS.length - 1) {
             const nextStatus = ALL_STEPS[currentStatusIndex + 1];
             onUpdateStatus(order.id, nextStatus);
        } else if (currentStatus === 'Siap Diantar') { // A special case if it's the last actionable step
             onUpdateStatus(order.id, 'Selesai');
        } else if (currentStatus === 'Proses Cuci') {
             onUpdateStatus(order.id, 'Siap Diantar');
        } else if (currentStatus === 'Pakaian Diterima') {
             onUpdateStatus(order.id, 'Proses Cuci');
        }
    };
    
    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            {selectedOrder && <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
            <div className="flex items-center mb-6">
                <button onClick={() => setActivePage('Dashboard')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 mr-4">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3">
                    <ClipboardDocumentCheckIcon className="w-8 h-8 text-primary dark:text-gold-light" />
                    <h1 className="text-2xl md:text-3xl font-bold">Dasbor Mitra Cuci</h1>
                </div>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard title="Pendapatan Bulan Ini" value={stats.revenue} icon={CurrencyDollarIcon} />
                    <StatCard title="Pesanan Baru" value={stats.newOrders} icon={InboxIcon} />
                    <StatCard title="Pesanan Selesai" value={stats.completedThisMonth} icon={CheckCircleIcon} />
                </div>
                
                <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-4">
                    <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 mb-4">
                        <button onClick={() => setActiveTab('aktif')} className={`py-2 text-sm font-bold rounded-md transition-colors ${activeTab === 'aktif' ? 'bg-gradient-to-br from-gold-light to-gold-dark text-white shadow' : 'text-text-secondary dark:text-dark-text-secondary hover:bg-slate-200 dark:hover:bg-slate-700'}`}>Pesanan Aktif ({activeOrders.length})</button>
                        <button onClick={() => setActiveTab('selesai')} className={`py-2 text-sm font-bold rounded-md transition-colors ${activeTab === 'selesai' ? 'bg-gradient-to-br from-gold-light to-gold-dark text-white shadow' : 'text-text-secondary dark:text-dark-text-secondary hover:bg-slate-200 dark:hover:bg-slate-700'}`}>Riwayat Selesai</button>
                    </div>
                    
                    <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                        {activeTab === 'aktif' && (
                            activeOrders.length > 0 ? activeOrders.map(order => 
                                <OrderCard 
                                    key={order.id} 
                                    order={order} 
                                    onViewDetail={setSelectedOrder}
                                    onUpdateStatus={handleUpdate}
                                />)
                            : <p className="text-center text-sm text-text-secondary py-8">Tidak ada pesanan aktif saat ini.</p>
                        )}
                        {activeTab === 'selesai' && (
                             completedOrders.length > 0 ? completedOrders.map(order => 
                                <OrderCard 
                                    key={order.id} 
                                    order={order} 
                                    onViewDetail={setSelectedOrder}
                                    onUpdateStatus={handleUpdate}
                                />)
                            : <p className="text-center text-sm text-text-secondary py-8">Belum ada riwayat pesanan yang selesai.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LaundryPartnerDashboardPage;