import React, { useState, useEffect, useRef } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    BellIcon as BellIconSolid, 
    UserCircleIcon as UserCircleIconSolid, 
    MapPinIcon as MapPinIconSolid 
} from '@heroicons/react/24/solid';
import { User, OjekOrder } from '../types.ts';
import { formatToRupiah } from '../utils/formatter.ts';
import { getUserById } from '../services/mockData.ts';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const BellIcon = (BellIconSolid as any).default || BellIconSolid;
const UserCircleIcon = (UserCircleIconSolid as any).default || UserCircleIconSolid;
const MapPinIcon = (MapPinIconSolid as any).default || MapPinIconSolid;


// --- LIVE MAP VIEW COMPONENT (COPIED FOR SIMPLICITY, IDEALLY A SHARED COMPONENT) ---
interface LiveMapViewProps {
    driverPosition: { x: number; y: number };
    passengerPosition: { x: number; y: number };
    destinationPosition: { x: number; y: number };
    driverToPassengerPath: string;
    passengerToDestinationPath: string;
    tripStatus: 'pickup' | 'trip';
}

const LiveMapView: React.FC<LiveMapViewProps> = ({ 
    driverPosition, passengerPosition, destinationPosition, 
    driverToPassengerPath, passengerToDestinationPath, tripStatus 
}) => {
    const pickupAnimationRef = useRef<SVGAnimateMotionElement>(null);
    const tripAnimationRef = useRef<SVGAnimateMotionElement>(null);

    useEffect(() => {
        if (tripStatus === 'pickup' && pickupAnimationRef.current) {
            pickupAnimationRef.current.beginElement();
        } else if (tripStatus === 'trip' && tripAnimationRef.current) {
            tripAnimationRef.current.beginElement();
        }
    }, [tripStatus]);

    const DriverMarker = () => (
        <g>
            <circle cx="0" cy="0" r="10" fill="#F59E0B" stroke="white" strokeWidth="2" />
            <path d="M -4 -2 L 4 0 L -4 2 Z" fill="white" />
            <animateMotion dur="8s" begin="indefinite" repeatCount="1" fill="freeze" path={driverToPassengerPath} ref={pickupAnimationRef} />
            <animateMotion dur="10s" begin="indefinite" repeatCount="1" fill="freeze" path={passengerToDestinationPath} ref={tripAnimationRef} />
        </g>
    );

    const LocationMarker: React.FC<{ position: { x: number; y: number }; type: 'passenger' | 'destination' }> = ({ position, type }) => (
         <g transform={`translate(${position.x}, ${position.y})`}>
            {type === 'passenger' ? (
                <>
                    <circle cx="0" cy="0" r="10" fill="#10B981" stroke="white" strokeWidth="2" />
                    <circle cx="0" cy="0" r="4" fill="white" />
                </>
            ) : (
                <>
                    <path d="M 0 -12 L 8 -2 L 0 0 L -8 -2 Z" fill="#EF4444" />
                    <circle cx="0" cy="0" r="10" fill="#EF4444" stroke="white" strokeWidth="2" />
                    <path d="M -4 -2 L 4 2 M -4 2 L 4 -2" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </>
            )}
        </g>
    );

    return (
        <div className="h-96 bg-slate-100 dark:bg-slate-800 rounded-lg relative overflow-hidden border border-slate-300 dark:border-slate-700">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 300">
                <defs>
                    <pattern id="grid-map" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(203, 213, 225, 0.5)" strokeWidth="0.5"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-map)" />
                <path d={driverToPassengerPath} stroke="#a78bfa" strokeWidth="3" fill="none" strokeDasharray="5,5" />
                <path d={passengerToDestinationPath} stroke="#3b82f6" strokeWidth="3" fill="none" />
                <LocationMarker position={passengerPosition} type="passenger" />
                <LocationMarker position={destinationPosition} type="destination" />
                <DriverMarker />
            </svg>
        </div>
    );
};


// --- PENGEMUDI PAGE ---
interface PengemudiPageProps {
  setActivePage: (page: string) => void;
  currentUser: User;
  onProfileUpdate: (userId: string, updates: Partial<User>) => Promise<User | null>;
}

const MotorcycleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8a1 1 0 001 1h1a1 1 0 001-1v-1h12v1a1 1 0 001 1h1a1 1 0 001-1v-8l-2.08-5.99zM6.5 16a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm11 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM5 11l1.5-4.5h11L19 11H5z" />
  </svg>
);

const CarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M3.206 6.512A3 3 0 015.75 4.5h12.5a3 3 0 012.544 2.012l2.688 8.122a3 3 0 01-2.544 3.866H5.75a3 3 0 01-2.544-3.866l-2.688-8.122zM5.75 6a1.5 1.5 0 00-1.272 1.006l-2.688 8.122a1.5 1.5 0 001.272 1.932h12.5a1.5 1.5 0 001.272-1.932L19.522 7.006A1.5 1.5 0 0018.25 6H5.75z" clipRule="evenodd" />
        <path d="M6 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
    </svg>
);

const BoxIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M20 7l-2-2-8-4-8 4-2 2v10l2 2 8 4 8-4 2-2V7zM12 4.618L17.13 7 12 9.382 6.87 7 12 4.618zM4 8.236l4 2.4v4.928l-4-2.4V8.236zm16 0v4.928l-4 2.4V10.636l4-2.4zM8 16.364v-4.928l4 2.4v4.928l-4-2.4zm8 0l-4 2.4v-4.928l4-2.4v4.928z"/>
    </svg>
);


const PengemudiPage: React.FC<PengemudiPageProps> = ({ setActivePage, currentUser, onProfileUpdate }) => {
    const [onlineStatus, setOnlineStatus] = useState({ motor: false, mobil: false });
    const [incomingOrders, setIncomingOrders] = useState<OjekOrder[]>([]);
    const [activeJob, setActiveJob] = useState<OjekOrder | null>(null);
    const [tripStatus, setTripStatus] = useState<'pickup' | 'trip'>('pickup');


    const isOnline = onlineStatus.motor || onlineStatus.mobil;

    useEffect(() => {
        const checkOrdersAndJobs = () => {
            try {
                const allOrders: OjekOrder[] = JSON.parse(localStorage.getItem('ojek_orders') || '[]');
                
                if (isOnline && !activeJob) {
                    const pendingOrders = allOrders.filter(order => order.status === 'pending');
                    setIncomingOrders(pendingOrders);
                } else {
                    setIncomingOrders([]);
                }

                const myJob = allOrders.find(o => o.driverId === currentUser.id && o.status === 'in_progress');
                if (myJob) {
                    if (!activeJob) { // Job just became active
                        setActiveJob(myJob);
                        setTripStatus('pickup');
                        setTimeout(() => setTripStatus('trip'), 8000); // Pickup animation duration
                    }
                } else if (activeJob) {
                    setActiveJob(null);
                    onProfileUpdate(currentUser.id, {});
                }

            } catch (e) { console.error("Gagal memuat pesanan", e); }
        };

        const intervalId = setInterval(checkOrdersAndJobs, 2000); 

        return () => clearInterval(intervalId);
    }, [isOnline, currentUser.id, activeJob, onProfileUpdate]);

    const handleOrderResponse = async (orderId: string, response: 'in_progress' | 'declined') => {
        try {
            const allOrders: OjekOrder[] = JSON.parse(localStorage.getItem('ojek_orders') || '[]');
            let passengerName = '';
            const updatedOrders = allOrders.map(order => {
                if (order.id === orderId) {
                    passengerName = order.passengerName;
                    return { ...order, status: response, driverName: currentUser.name, driverId: currentUser.id };
                }
                return order;
            });
            localStorage.setItem('ojek_orders', JSON.stringify(updatedOrders));
            setIncomingOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
            if (response === 'in_progress') {
                alert(`Pesanan dari ${passengerName} diterima!`);
            }
        } catch (e) { console.error("Gagal update pesanan", e); }
    };

    const handleToggle = (type: 'motor' | 'mobil') => {
        setOnlineStatus(prev => ({ motor: type === 'motor' ? !prev.motor : false, mobil: type === 'mobil' ? !prev.mobil : false }));
    };

    const getServiceInfo = (order: OjekOrder) => {
        if (order.service === 'kirim') {
            const vehicle = order.deliveryVehicle === 'mobil' ? 'Mobil' : 'Motor';
            return { label: `Kirim Barang (${vehicle})`, icon: order.deliveryVehicle === 'mobil' ? CarIcon : MotorcycleIcon };
        }
        if (order.service === 'mobil') {
            return { label: 'Tumpangan Mobil', icon: CarIcon };
        }
        return { label: 'Tumpangan Motor', icon: MotorcycleIcon };
    };
    
    // --- Mock positions for map simulation ---
    const driverStartPosition = { x: 20, y: 20 };
    const passengerPosition = { x: 50, y: 250 };
    const destinationPosition = { x: 250, y: 50 };
    const driverToPassengerPath = `M ${driverStartPosition.x} ${driverStartPosition.y} Q 20 150, ${passengerPosition.x} ${passengerPosition.y}`;
    const passengerToDestinationPath = `M ${passengerPosition.x} ${passengerPosition.y} Q 150 150, ${destinationPosition.x} ${destinationPosition.y}`;


    if (activeJob) {
        let statusText = `Menuju lokasi ${activeJob.passengerName}...`;
        if (tripStatus === 'trip') {
            statusText = `Mengantar ${activeJob.passengerName} ke tujuan...`;
        }
         return (
            <div className="max-w-4xl mx-auto animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl md:text-3xl font-bold">Pekerjaan Aktif</h1>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/50">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">Dalam Perjalanan</span>
                    </div>
                </div>
                <div className="relative">
                    <LiveMapView 
                        driverPosition={driverStartPosition}
                        passengerPosition={passengerPosition}
                        destinationPosition={destinationPosition}
                        driverToPassengerPath={driverToPassengerPath}
                        passengerToDestinationPath={passengerToDestinationPath}
                        tripStatus={tripStatus}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-surface/80 dark:bg-dark-surface/80 backdrop-blur-sm p-4 rounded-b-lg">
                        <div className="flex items-center gap-3">
                            <UserCircleIcon className="w-10 h-10 text-text-secondary dark:text-dark-text-secondary"/>
                             <div>
                                <p className="font-bold text-lg">{activeJob.passengerName}</p>
                                <p className="text-sm font-semibold text-primary dark:text-gold-light">{statusText}</p>
                             </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-center">
                            <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Potensi Pendapatan</p>
                            <p className="text-2xl font-bold text-primary dark:text-gold-light">{formatToRupiah(activeJob.offeredPrice)}</p>
                        </div>
                    </div>
                </div>
            </div>
         );
    }

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <button onClick={() => setActivePage('Dashboard')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 mr-4">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <h1 className="text-2xl md:text-3xl font-bold">Mode Pengemudi</h1>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${isOnline ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
                    <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className={`text-sm font-bold ${isOnline ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{isOnline ? 'Online' : 'Offline'}</span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="bg-gradient-to-br from-slate-700 to-slate-900 text-white rounded-xl shadow-lg p-6">
                    <p className="text-sm text-slate-300">Saldo Pengemudi</p>
                    <p className="text-4xl font-bold my-2">{formatToRupiah(currentUser.driverBalance || 0)}</p>
                    <div className="flex gap-2 mt-4">
                        <button onClick={() => alert('Fitur Tarik Saldo sedang dikembangkan.')} className="flex-1 bg-white/10 hover:bg-white/20 font-semibold py-2 rounded-lg text-sm">Tarik Saldo</button>
                        <button onClick={() => alert('Fitur Riwayat Pendapatan sedang dikembangkan.')} className="flex-1 bg-white/10 hover:bg-white/20 font-semibold py-2 rounded-lg text-sm">Riwayat</button>
                    </div>
                </div>

                <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-4">
                    <h3 className="font-bold text-lg mb-3">Atur Status Ketersediaan</h3>
                    <div className="space-y-3">
                        {([
                            { type: 'motor', label: 'Motor', icon: MotorcycleIcon },
                            { type: 'mobil', label: 'Mobil', icon: CarIcon }
                        ] as const).map(({ type, label, icon: Icon }) => (
                            <div key={type} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                <div className="flex items-center gap-3"><Icon className="w-8 h-8 text-primary dark:text-gold-light" /><span className="font-bold">{label}</span></div>
                                <button onClick={() => handleToggle(type)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${onlineStatus[type] ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${onlineStatus[type] ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {isOnline && (
                    <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-4">
                        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                            <BellIcon className="w-6 h-6 text-primary dark:text-gold-light" /> Pesanan Masuk
                        </h3>
                        {incomingOrders.length > 0 ? (
                            <div className="space-y-3">
                                {incomingOrders.map(order => {
                                    const { label: serviceLabel, icon: ServiceIcon } = getServiceInfo(order);
                                    return (
                                        <div key={order.id} className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className="p-2 bg-slate-200 dark:bg-slate-700 rounded-full"><ServiceIcon className="w-6 h-6" /></div>
                                                <div>
                                                    <p className="font-bold">{order.passengerName}</p>
                                                    <p className="text-xs font-semibold text-primary dark:text-gold-light">{serviceLabel}</p>
                                                    <p className="text-sm mt-1">Tawaran: <span className="font-bold text-green-600 dark:text-green-400">{formatToRupiah(order.offeredPrice)}</span></p>
                                                </div>
                                            </div>
                                            <div className="text-sm space-y-1 border-t pt-2">
                                                <p><span className="font-semibold">Dari:</span> {order.from}</p>
                                                <p><span className="font-semibold">Ke:</span> {order.to}</p>
                                            </div>
                                            {order.service === 'kirim' && (
                                                <div className="text-xs space-y-1 mt-2 border-t pt-2">
                                                    {order.itemWeight && <p><span className="font-semibold">Berat:</span> {order.itemWeight} kg</p>}
                                                    {(order.itemLength || order.itemWidth || order.itemHeight) && (<p><span className="font-semibold">Dimensi:</span> {order.itemLength||'..'}x{order.itemWidth||'..'}x{order.itemHeight||'..'} cm</p>)}
                                                </div>
                                            )}
                                            <div className="flex gap-2 mt-4">
                                                <button onClick={() => handleOrderResponse(order.id, 'in_progress')} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-md">Terima</button>
                                                <button onClick={() => handleOrderResponse(order.id, 'declined')} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-md">Tolak</button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-text-secondary dark:text-dark-text-secondary text-center py-4">Belum ada pesanan baru. Tetap siaga!</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PengemudiPage;