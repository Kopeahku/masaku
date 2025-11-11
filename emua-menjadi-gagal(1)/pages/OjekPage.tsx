import React, { useState, useEffect, useRef } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    TruckIcon as TruckIconSolid, 
    MapPinIcon as MapPinIconSolid, 
    ClockIcon as ClockIconSolid, 
    StarIcon as StarIconSolid, 
    CurrencyDollarIcon as CurrencyDollarIconSolid, 
    ArchiveBoxIcon as ArchiveBoxIconSolid, 
    ArrowsPointingOutIcon as ArrowsPointingOutIconSolid, 
    WalletIcon as WalletIconSolid, 
    CheckCircleIcon as CheckCircleIconSolid, 
    PencilIcon as PencilIconSolid, 
    UserCircleIcon as UserCircleIconSolid 
} from '@heroicons/react/24/solid';
import { formatToRupiah } from '../utils/formatter.ts';
import { User, OjekOrder } from '../types.ts';
import { getUserById } from '../services/mockData.ts';
import { GoogleGenAI } from "@google/genai";

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const TruckIcon = (TruckIconSolid as any).default || TruckIconSolid;
const MapPinIcon = (MapPinIconSolid as any).default || MapPinIconSolid;
const ClockIcon = (ClockIconSolid as any).default || ClockIconSolid;
const StarIcon = (StarIconSolid as any).default || StarIconSolid;
const CurrencyDollarIcon = (CurrencyDollarIconSolid as any).default || CurrencyDollarIconSolid;
const ArchiveBoxIcon = (ArchiveBoxIconSolid as any).default || ArchiveBoxIconSolid;
const ArrowsPointingOutIcon = (ArrowsPointingOutIconSolid as any).default || ArrowsPointingOutIconSolid;
const WalletIcon = (WalletIconSolid as any).default || WalletIconSolid;
const CheckCircleIcon = (CheckCircleIconSolid as any).default || CheckCircleIconSolid;
const PencilIcon = (PencilIconSolid as any).default || PencilIconSolid;
const UserCircleIcon = (UserCircleIconSolid as any).default || UserCircleIconSolid;


// --- LIVE MAP VIEW COMPONENT ---
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
                
                {/* Routes */}
                <path d={driverToPassengerPath} stroke="#a78bfa" strokeWidth="3" fill="none" strokeDasharray="5,5" />
                <path d={passengerToDestinationPath} stroke="#3b82f6" strokeWidth="3" fill="none" />
                
                {/* Markers */}
                <LocationMarker position={passengerPosition} type="passenger" />
                <LocationMarker position={destinationPosition} type="destination" />
                <DriverMarker />
            </svg>
        </div>
    );
};


// --- DETAILED MAP COMPONENT ---
const DetailedMapView: React.FC<{ startLabel: string, endLabel: string }> = ({ startLabel, endLabel }) => {
  const [buildings, setBuildings] = useState<{x: number, y: number, width: number, height: number}[]>([]);
  const [pathData, setPathData] = useState('');

  useEffect(() => {
    // Generate random buildings for visual effect
    const newBuildings = [];
    for (let i = 0; i < 20; i++) {
        newBuildings.push({
            x: Math.random() * 280,
            y: Math.random() * 180,
            width: Math.random() * 20 + 10,
            height: Math.random() * 20 + 10,
        });
    }
    setBuildings(newBuildings);
    
    // Generate a simple random path
    let d = "M 24 24"; // Start point
    let x = 24;
    let y = 24;
    for (let i = 0; i < 2; i++) { // Create a few turns
        x += Math.random() * 60 + 20;
        y += Math.random() * 60 - 30;
        d += ` L ${Math.min(x, 200)} ${Math.max(20, Math.min(y, 160))}`;
    }
    d += " L 216 168"; // End point
    setPathData(d);

  }, []);

  return (
    <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-lg relative overflow-hidden mb-4 border border-slate-300 dark:border-slate-700">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 240 192">
            <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(203, 213, 225, 0.5)" strokeWidth="0.5"/>
                </pattern>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#F59E0B" />
                </marker>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {buildings.map((b, i) => (
                <rect key={i} x={b.x} y={b.y} width={b.width} height={b.height} fill="rgba(203, 213, 225, 0.7)" className="dark:fill-slate-700/70" />
            ))}
            <path d={pathData} stroke="#F59E0B" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="route-path" markerEnd="url(#arrowhead)" />

            {/* Start Point */}
            <g transform="translate(24, 24)">
                <circle cx="0" cy="0" r="8" fill="#10B981" stroke="white" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="3" fill="white" />
                <text x="12" y="5" fontSize="8" fill="#1e293b" className="dark:fill-white font-bold">{startLabel}</text>
            </g>

            {/* End Point */}
            <g transform="translate(216, 168)">
                <circle cx="0" cy="0" r="8" fill="#EF4444" stroke="white" strokeWidth="1.5" />
                <path d="M -3 -3 L 3 3 M -3 3 L 3 -3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <text x="-12" y="-12" fontSize="8" fill="#1e293b" className="dark:fill-white font-bold" textAnchor="end">{endLabel}</text>
            </g>
        </svg>
    </div>
  );
};


// Simple inline SVG components for better visuals
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

interface OjekPageProps {
  setActivePage: (page: string) => void;
  currentUser: User;
  onProfileUpdate: (userId: string, updates: Partial<User>) => Promise<User | null>;
}

const MOCK_DESTINATIONS = [
    'Monumen Nasional (Monas), Jakarta Pusat',
    'Stasiun Gambir, Jakarta Pusat',
    'Mall Grand Indonesia, Jakarta Pusat',
    'Plaza Indonesia, Jakarta Pusat',
    'Blok M Square, Jakarta Selatan',
    'Kebun Binatang Ragunan, Jakarta Selatan',
    'Bandara Soekarno-Hatta, Tangerang',
    'Stasiun Manggarai, Jakarta Selatan',
    'Kota Tua Jakarta, Jakarta Barat',
    'Taman Mini Indonesia Indah, Jakarta Timur',
    'Ancol Taman Impian, Jakarta Utara',
];


const OjekPage: React.FC<OjekPageProps> = ({ setActivePage, currentUser, onProfileUpdate }) => {
    const [view, setView] = useState<'input' | 'confirmation'>('input');
    const [service, setService] = useState<'motor' | 'mobil' | 'kirim'>('motor');
    const [manualPrice, setManualPrice] = useState('');
    const [destination, setDestination] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'saldo' | 'cash'>('saldo');
    const [deliveryVehicle, setDeliveryVehicle] = useState<'motor' | 'mobil'>('motor');
    const [activeOrder, setActiveOrder] = useState<OjekOrder | null>(null);
    const [routeDetails, setRouteDetails] = useState<{ distance: string; time: string; price: number; mapsUri?: string } | null>(null);
    const [isLoadingRoute, setIsLoadingRoute] = useState(false);
    
    // State for destination recommendations
    const [showRecommendations, setShowRecommendations] = useState(false);
    const [filteredDestinations, setFilteredDestinations] = useState<string[]>([]);


    // New state for live map
    const [tripStatus, setTripStatus] = useState<'pickup' | 'trip'>('pickup');
    const [showCompletedButton, setShowCompletedButton] = useState(false);

    const [packageDetails, setPackageDetails] = useState({
        weight: '',
        length: '',
        width: '',
        height: ''
    });

    useEffect(() => {
        const checkActiveOrder = () => {
            try {
                const allOrders: OjekOrder[] = JSON.parse(localStorage.getItem('ojek_orders') || '[]');
                const myOrder = allOrders.find(o => o.passengerId === currentUser.id && (o.status === 'in_progress' || o.status === 'pending'));

                if (myOrder && myOrder.status === 'in_progress') {
                    if (!activeOrder) {
                        // Order just got accepted, start pickup animation
                        setActiveOrder(myOrder);
                        setTripStatus('pickup');
                        setShowCompletedButton(false);
                        setTimeout(() => setTripStatus('trip'), 8000); // Pickup animation duration
                        setTimeout(() => setShowCompletedButton(true), 18000); // Trip animation duration
                    }
                } else if (!myOrder) {
                    setActiveOrder(null);
                }
            } catch (e) {
                console.error("Error checking active order:", e);
            }
        };

        checkActiveOrder();
        const intervalId = setInterval(checkActiveOrder, 3000);

        return () => clearInterval(intervalId);
    }, [currentUser.id, activeOrder]);


    const handlePackageDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPackageDetails(prev => ({ ...prev, [name]: value }));
    };
    
    const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDestination(value);

        if (value.length > 1) {
            const filtered = MOCK_DESTINATIONS.filter(d =>
                d.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredDestinations(filtered);
            setShowRecommendations(filtered.length > 0);
        } else {
            setFilteredDestinations([]);
            setShowRecommendations(false);
        }
    };

    const handleRecommendationSelect = (selectedDestination: string) => {
        setDestination(selectedDestination);
        setShowRecommendations(false);
    };

    const handleFindRoute = async () => {
        if (!destination.trim()) {
            alert('Silakan masukkan tujuan Anda.');
            return;
        }
        setIsLoadingRoute(true);
        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            const { latitude, longitude } = position.coords;

            // Fix: Use optional chaining to safely access VITE_API_KEY from Vite's environment variables.
            const apiKey = (import.meta as any)?.env?.VITE_API_KEY;
            if (!apiKey) {
                alert('Kunci API untuk Gemini tidak dikonfigurasi. Harap atur variabel VITE_API_KEY.');
                setIsLoadingRoute(false);
                return;
            }
            const ai = new GoogleGenAI({ apiKey: apiKey });
            const serviceType = service === 'mobil' ? 'mobil' : (service === 'kirim' ? `pengiriman barang via ${deliveryVehicle}` : 'ojek motor');
            
            const prompt = `Berapa estimasi jarak (km), waktu tempuh (menit), dan rekomendasi harga (IDR) untuk perjalanan ${serviceType} dari koordinat ${latitude},${longitude} ke "${destination}"? Berikan jawaban dalam format: JARAK: [angka] km, WAKTU: [angka] menit, HARGA: [angka].`;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    tools: [{ googleMaps: {} }],
                    toolConfig: {
                        retrievalConfig: {
                            latLng: {
                                latitude: latitude,
                                longitude: longitude
                            }
                        }
                    }
                },
            });

            const text = response.text;
            const distanceMatch = text.match(/JARAK: ([\d.,]+) km/);
            const timeMatch = text.match(/WAKTU: ([\d.,]+) menit/);
            const priceMatch = text.match(/HARGA: ([\d.,]+)/);
            
            const mapChunk = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.find(c => c.maps);
            const mapsUri = mapChunk?.maps?.uri;

            if (distanceMatch && timeMatch && priceMatch) {
                const price = parseInt(priceMatch[1].replace(/\D/g, ''));
                setRouteDetails({
                    distance: distanceMatch[1],
                    time: `${timeMatch[1]} menit`,
                    price: price,
                    mapsUri: mapsUri
                });
                setManualPrice(String(price));
                setView('confirmation');
            } else {
                alert("Maaf, gagal mendapatkan estimasi rute dari AI. Silakan coba lagi.");
            }

        } catch (error) {
            console.error("Error getting route details:", error);
            if ((error as GeolocationPositionError).code === 1) {
                 alert("Izin lokasi ditolak. Harap aktifkan izin lokasi di browser Anda untuk menggunakan fitur ini.");
            } else {
                alert("Gagal mendapatkan lokasi atau estimasi rute. Pastikan GPS Anda aktif dan coba lagi.");
            }
        } finally {
            setIsLoadingRoute(false);
        }
    };


    const handlePesan = () => {
        if (!destination.trim() || !routeDetails) {
            alert('Detail rute tidak ditemukan.');
            return;
        }
        const finalPrice = Number(manualPrice) || routeDetails.price;
        if (paymentMethod === 'saldo' && (currentUser.driverBalance || 0) < finalPrice) {
            alert('Saldo Anda tidak mencukupi untuk melakukan pembayaran ini.');
            return;
        }

        const newOrder: OjekOrder = {
            id: `order_${Date.now()}`,
            from: 'Lokasi Anda saat ini',
            to: destination,
            service: service,
            offeredPrice: finalPrice,
            passengerName: currentUser.name,
            passengerId: currentUser.id,
            paymentMethod: paymentMethod,
            status: 'pending',
        };

        if (service === 'kirim') {
            newOrder.itemWeight = Number(packageDetails.weight) || undefined;
            newOrder.itemLength = Number(packageDetails.length) || undefined;
            newOrder.itemWidth = Number(packageDetails.width) || undefined;
            newOrder.itemHeight = Number(packageDetails.height) || undefined;
            newOrder.deliveryVehicle = deliveryVehicle;
        }

        try {
            const existingOrders = JSON.parse(localStorage.getItem('ojek_orders') || '[]');
            localStorage.setItem('ojek_orders', JSON.stringify([...existingOrders, newOrder]));
            alert('Pesanan Anda telah dikirim ke pengemudi terdekat. Mohon tunggu konfirmasi.');
            setDestination('');
            setManualPrice('');
            setPackageDetails({ weight: '', length: '', width: '', height: '' });
            setView('input');
            setRouteDetails(null);
        } catch (e) {
            console.error("Gagal menyimpan pesanan ke localStorage", e);
            alert('Gagal mengirim pesanan. Silakan coba lagi.');
        }
    };
    
    const handleSudahSampai = async () => {
        if (!activeOrder) return;
        try {
            if (activeOrder.paymentMethod === 'saldo' && activeOrder.driverId) {
                const passengerNewBalance = (currentUser.driverBalance || 0) - activeOrder.offeredPrice;
                await onProfileUpdate(currentUser.id, { driverBalance: passengerNewBalance });

                const driver = await getUserById(activeOrder.driverId);
                if (driver) {
                    const driverNewBalance = (driver.driverBalance || 0) + activeOrder.offeredPrice;
                    await onProfileUpdate(driver.id, { driverBalance: driverNewBalance });
                }
            }
            const allOrders: OjekOrder[] = JSON.parse(localStorage.getItem('ojek_orders') || '[]');
            const updatedOrders = allOrders.map(o => o.id === activeOrder.id ? { ...o, status: 'completed' } : o);
            localStorage.setItem('ojek_orders', JSON.stringify(updatedOrders));
            
            alert("Pesanan selesai. Terima kasih telah menggunakan layanan kami!");
            setActiveOrder(null);
        } catch (e) {
            console.error("Gagal menyelesaikan pesanan:", e);
            alert("Terjadi kesalahan saat menyelesaikan pesanan.");
        }
    };

    // --- Mock positions for map simulation ---
    const driverStartPosition = { x: 20, y: 20 };
    const passengerPosition = { x: 50, y: 250 };
    const destinationPosition = { x: 250, y: 50 };
    const driverToPassengerPath = `M ${driverStartPosition.x} ${driverStartPosition.y} Q 20 150, ${passengerPosition.x} ${passengerPosition.y}`;
    const passengerToDestinationPath = `M ${passengerPosition.x} ${passengerPosition.y} Q 150 150, ${destinationPosition.x} ${destinationPosition.y}`;
    
    if (activeOrder) {
        let statusText = "Pengemudi sedang menuju lokasimu...";
        if (tripStatus === 'trip') {
            statusText = "Kamu sedang dalam perjalanan ke tujuan...";
        }

        return (
            <div className="max-w-4xl mx-auto animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                    <TruckIcon className="w-8 h-8 text-primary dark:text-gold-light" />
                    <h1 className="text-2xl md:text-3xl font-bold">Perjalanan Anda</h1>
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
                        <div className="flex items-center gap-3 mb-3">
                             <UserCircleIcon className="w-10 h-10 text-text-secondary dark:text-dark-text-secondary"/>
                             <div>
                                <p className="font-bold text-lg">{activeOrder.driverName}</p>
                                <p className="text-sm font-semibold text-primary dark:text-gold-light">{statusText}</p>
                             </div>
                        </div>
                        {showCompletedButton && (
                            <button
                                onClick={handleSudahSampai}
                                className="w-full bg-gradient-to-br from-gold-light to-gold-dark text-white font-bold py-3 px-4 rounded-lg transition-opacity hover:opacity-90 animate-fade-in"
                            >
                                Sudah Sampai
                            </button>
                        )}
                    </div>
                </div>
            </div>
        )
    }

  const renderInputView = () => (
    <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-4 md:p-6 mb-4">
        {/* Service Selection */}
        <div className="grid grid-cols-3 gap-2 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 mb-4">
            {[
                { type: 'motor', label: 'Motor', icon: MotorcycleIcon },
                { type: 'mobil', label: 'Mobil', icon: CarIcon },
                { type: 'kirim', label: 'Kirim', icon: BoxIcon },
            ].map(s => {
                const isSelected = service === s.type;
                return (
                    <button 
                        key={s.type}
                        onClick={() => setService(s.type as 'motor' | 'mobil' | 'kirim')}
                        className={`flex items-center justify-center gap-2 py-2.5 px-2 text-sm font-bold rounded-md transition-all ${isSelected ? 'bg-primary text-white shadow' : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-text-secondary dark:text-dark-text-secondary'}`}
                    >
                        <s.icon className="w-5 h-5"/> <span>{s.label}</span>
                    </button>
                )
            })}
        </div>
        
        {service === 'kirim' && (
            <div className="animate-fade-in mt-4 mb-4">
                <p className="text-sm font-semibold text-text-secondary dark:text-dark-text-secondary mb-2">Pilih Kendaraan Kurir</p>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                    {[{ type: 'motor', label: 'Motor', icon: MotorcycleIcon }, { type: 'mobil', label: 'Mobil', icon: CarIcon }].map(v => {
                        const isSelected = deliveryVehicle === v.type;
                        return (
                             <button 
                                key={v.type}
                                onClick={() => setDeliveryVehicle(v.type as 'motor' | 'mobil')}
                                className={`flex items-center justify-center gap-2 py-2.5 px-2 text-sm font-bold rounded-md transition-all ${isSelected ? 'bg-primary/80 text-white shadow' : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-text-secondary dark:text-dark-text-secondary'}`}
                            >
                                <v.icon className="w-5 h-5"/> <span>{v.label}</span>
                            </button>
                        )
                    })}
                </div>
            </div>
        )}

        {/* Location Input */}
        <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MapPinIcon className="w-5 h-5 text-red-500"/>
            </div>
            <input 
                type="text" 
                placeholder="Mau ke mana?" 
                value={destination}
                onChange={handleDestinationChange}
                onFocus={() => { if (destination.length > 1) setShowRecommendations(true); }}
                onBlur={() => setTimeout(() => setShowRecommendations(false), 200)}
                autoComplete="off"
                className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-background dark:bg-dark-background focus:ring-2 focus:ring-primary focus:outline-none"
            />
             {showRecommendations && filteredDestinations.length > 0 && (
                <ul className="absolute z-10 w-full bg-surface dark:bg-dark-surface mt-1 rounded-lg shadow-lg border dark:border-slate-700 max-h-48 overflow-y-auto">
                    {filteredDestinations.map((dest) => (
                        <li key={dest}>
                            <button
                                onMouseDown={(e) => e.preventDefault()} // Prevents input blur before click
                                onClick={() => handleRecommendationSelect(dest)}
                                className="w-full text-left px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3 text-sm"
                            >
                                <MapPinIcon className="w-4 h-4 text-slate-400" />
                                <span>{dest}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
        
         {service === 'kirim' && (
            <div className="space-y-3 pt-4 mt-4 border-t border-slate-200 dark:border-slate-700 animate-fade-in">
                <p className="text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Detail Barang Kiriman (Opsional)</p>
                <div className="grid grid-cols-2 gap-3">
                    <div className="relative"><div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><ArchiveBoxIcon className="w-5 h-5 text-gray-500"/></div><input type="number" name="weight" placeholder="Berat" value={packageDetails.weight} onChange={handlePackageDetailsChange} className="w-full pl-10 pr-8 py-3 border rounded-lg bg-background dark:bg-dark-background" /><span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-text-secondary">kg</span></div>
                    <div className="relative"><div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><ArrowsPointingOutIcon className="w-5 h-5 text-gray-500"/></div><input type="number" name="length" placeholder="Panjang" value={packageDetails.length} onChange={handlePackageDetailsChange} className="w-full pl-10 pr-8 py-3 border rounded-lg bg-background dark:bg-dark-background" /><span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-text-secondary">cm</span></div>
                    <div className="relative"><div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><ArrowsPointingOutIcon className="w-5 h-5 text-gray-500 transform -rotate-90"/></div><input type="number" name="width" placeholder="Lebar" value={packageDetails.width} onChange={handlePackageDetailsChange} className="w-full pl-10 pr-8 py-3 border rounded-lg bg-background dark:bg-dark-background" /><span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-text-secondary">cm</span></div>
                    <div className="relative"><div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><ArrowsPointingOutIcon className="w-5 h-5 text-gray-500"/></div><input type="number" name="height" placeholder="Tinggi" value={packageDetails.height} onChange={handlePackageDetailsChange} className="w-full pl-10 pr-8 py-3 border rounded-lg bg-background dark:bg-dark-background" /><span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-text-secondary">cm</span></div>
                </div>
            </div>
        )}

        <button
          onClick={handleFindRoute}
          disabled={isLoadingRoute}
          className="w-full mt-4 bg-gradient-to-br from-gold-light to-gold-dark text-white hover:opacity-90 font-bold py-3 px-8 rounded-lg transition-colors flex items-center justify-center disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-wait"
        >
            {isLoadingRoute ? (
                <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>Mencari Rute...</span>
                </>
            ) : (
                'Cek Estimasi Perjalanan'
            )}
        </button>
    </div>
  );
  
  const renderConfirmationView = () => {
    if (!routeDetails) return null;
    return (
        <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-4 md:p-6 mb-4 animate-fade-in">
            <DetailedMapView startLabel="Lokasi Anda" endLabel={destination} />

            {/* Estimation Details */}
            <div className="grid grid-cols-2 gap-4 text-center mb-4">
                <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg"><p className="text-xs text-text-secondary dark:text-dark-text-secondary flex items-center justify-center gap-1"><StarIcon className="w-3 h-3"/> Jarak</p><p className="font-bold text-lg">{routeDetails.distance} km</p></div>
                <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg"><p className="text-xs text-text-secondary dark:text-dark-text-secondary flex items-center justify-center gap-1"><ClockIcon className="w-3 h-3"/> Waktu</p><p className="font-bold text-lg">{routeDetails.time}</p></div>
            </div>
            
             {/* Price & Payment */}
            <div className="space-y-3">
                 <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><CurrencyDollarIcon className="w-5 h-5 text-green-500"/></div>
                    <input type="number" value={manualPrice} onChange={(e) => setManualPrice(e.target.value)} className="w-full pl-10 pr-10 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-background dark:bg-dark-background focus:ring-2 focus:ring-primary focus:outline-none font-bold"/>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3"><PencilIcon className="w-5 h-5 text-text-secondary dark:text-dark-text-secondary"/></div>
                </div>
                 <div className="pt-2">
                    <p className="text-sm font-semibold text-text-secondary dark:text-dark-text-secondary mb-2">Metode Pembayaran</p>
                    <div className="flex gap-3"><button onClick={() => setPaymentMethod('saldo')} className={`flex-1 flex items-center gap-2 p-3 border-2 rounded-lg transition-colors ${paymentMethod === 'saldo' ? 'border-primary bg-primary/10' : 'border-slate-300 dark:border-slate-600'}`}><WalletIcon className="w-5 h-5 text-primary dark:text-gold-light" /><span className="font-bold text-sm">Saldo</span></button><button onClick={() => setPaymentMethod('cash')} className={`flex-1 flex items-center gap-2 p-3 border-2 rounded-lg transition-colors ${paymentMethod === 'cash' ? 'border-primary bg-primary/10' : 'border-slate-300 dark:border-slate-600'}`}><CurrencyDollarIcon className="w-5 h-5 text-primary dark:text-gold-light" /><span className="font-bold text-sm">Cash</span></button></div>
                </div>
            </div>

            {routeDetails.mapsUri && (
                <a 
                    href={routeDetails.mapsUri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg transition-colors"
                >
                    <MapPinIcon className="w-5 h-5" />
                    Lihat Rute di Google Maps
                </a>
            )}
            
            <div className="flex gap-2 mt-2">
                <button onClick={() => setView('input')} className="flex-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 font-bold py-3 px-4 rounded-lg transition-colors text-sm">Ubah</button>
                <button onClick={handlePesan} className="flex-1 bg-gradient-to-br from-gold-light to-gold-dark text-white hover:opacity-90 font-bold py-3 px-4 rounded-lg transition-colors">Pesan Sekarang</button>
            </div>
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => view === 'input' ? setActivePage('Dashboard') : setView('input')}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-4"
          aria-label="Kembali"
        >
          <ArrowLeftIcon className="w-6 h-6 text-text-primary dark:text-dark-text-primary" />
        </button>
        <div className="flex items-center gap-3">
          <TruckIcon className="w-8 h-8 text-primary dark:text-gold-light" />
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">
            Ojek Online
          </h1>
        </div>
      </div>
      
      {view === 'input' && renderInputView()}
      {view === 'confirmation' && renderConfirmationView()}
      
    </div>
  );
};

export default OjekPage;