import React, { useState, useMemo } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    MapPinIcon as MapPinIconSolid, 
    CalendarDaysIcon as CalendarDaysIconSolid, 
    PencilIcon as PencilIconSolid, 
    MinusIcon as MinusIconSolid, 
    PlusIcon as PlusIconSolid 
} from '@heroicons/react/24/solid';
import { LaundryServiceType, LaundryOrder, LaundryOrderItem } from '../types.ts';
import { formatToRupiah } from '../utils/formatter.ts';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const MapPinIcon = (MapPinIconSolid as any).default || MapPinIconSolid;
const CalendarDaysIcon = (CalendarDaysIconSolid as any).default || CalendarDaysIconSolid;
const PencilIcon = (PencilIconSolid as any).default || PencilIconSolid;
const MinusIcon = (MinusIconSolid as any).default || MinusIconSolid;
const PlusIcon = (PlusIconSolid as any).default || PlusIconSolid;

interface LaundryOrderPageProps {
  setActivePage: (page: string) => void;
  serviceType: LaundryServiceType;
  onPlaceOrder: (order: Omit<LaundryOrder, 'id' | 'statusSteps' | 'createdAt' | 'customerId' | 'customerName' | 'customerAvatar'>) => void;
}

const SATUAN_ITEMS = [
    { name: 'Kemeja', price: 15000 },
    { name: 'Jas', price: 35000 },
    { name: 'Gaun Pesta', price: 50000 },
    { name: 'Sepatu', price: 40000 },
    { name: 'Selimut', price: 25000 },
];

const KILOAN_PRICE_PER_KG = 8000;
const EKSPRES_PRICE_PER_KG = 15000;

const LaundryOrderPage: React.FC<LaundryOrderPageProps> = ({ setActivePage, serviceType, onPlaceOrder }) => {
    const [address, setAddress] = useState('Jl. Merdeka No. 17, Jakarta Pusat');
    const [pickupDate, setPickupDate] = useState(new Date().toISOString().split('T')[0]);
    const [pickupTime, setPickupTime] = useState('14:00 - 16:00');
    const [notes, setNotes] = useState('');

    // State for Kiloan/Ekspres
    const [estimatedWeight, setEstimatedWeight] = useState(3);
    
    // State for Satuan
    const [satuanItems, setSatuanItems] = useState<LaundryOrderItem[]>(
        SATUAN_ITEMS.map(item => ({ name: item.name, quantity: 0 }))
    );

    const estimatedPrice = useMemo(() => {
        if (serviceType === 'Kiloan') {
            return estimatedWeight * KILOAN_PRICE_PER_KG;
        }
        if (serviceType === 'Ekspres') {
            return estimatedWeight * EKSPRES_PRICE_PER_KG;
        }
        if (serviceType === 'Satuan') {
            return satuanItems.reduce((total, item) => {
                const itemPrice = SATUAN_ITEMS.find(i => i.name === item.name)?.price || 0;
                return total + (item.quantity * itemPrice);
            }, 0);
        }
        return 0;
    }, [serviceType, estimatedWeight, satuanItems]);

    const handleSatuanQuantityChange = (itemName: string, delta: number) => {
        setSatuanItems(prevItems =>
            prevItems.map(item =>
                item.name === itemName
                    ? { ...item, quantity: Math.max(0, item.quantity + delta) }
                    : item
            )
        );
    };

    const handleSubmit = () => {
        if (estimatedPrice <= 0) {
            alert('Harap masukkan detail pesanan Anda.');
            return;
        }
        
        const orderDetails: Omit<LaundryOrder, 'id' | 'statusSteps' | 'createdAt' | 'customerId' | 'customerName' | 'customerAvatar'> = {
            serviceType,
            address,
            pickupTime: `${pickupDate} ${pickupTime}`,
            notes,
            estimatedPrice,
        };

        if (serviceType === 'Satuan') {
            orderDetails.items = satuanItems.filter(item => item.quantity > 0);
        } else {
            orderDetails.estimatedWeight = estimatedWeight;
        }
        
        onPlaceOrder(orderDetails);
    };
    
    const renderServiceSpecificInputs = () => {
        if (serviceType === 'Kiloan' || serviceType === 'Ekspres') {
            return (
                <div className="flex items-center justify-between">
                    <span className="font-semibold">Estimasi Berat</span>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setEstimatedWeight(w => Math.max(1, w - 1))} className="w-8 h-8 flex items-center justify-center border rounded-md"><MinusIcon className="w-4 h-4"/></button>
                        <span className="font-bold w-12 text-center">{estimatedWeight} kg</span>
                        <button onClick={() => setEstimatedWeight(w => w + 1)} className="w-8 h-8 flex items-center justify-center border rounded-md"><PlusIcon className="w-4 h-4"/></button>
                    </div>
                </div>
            );
        }
        if (serviceType === 'Satuan') {
            return (
                 <div className="space-y-3">
                    {satuanItems.map(item => (
                        <div key={item.name} className="flex items-center justify-between">
                            <span className="font-semibold">{item.name}</span>
                            <div className="flex items-center gap-2">
                                <button onClick={() => handleSatuanQuantityChange(item.name, -1)} className="w-8 h-8 flex items-center justify-center border rounded-md"><MinusIcon className="w-4 h-4"/></button>
                                <span className="font-bold w-8 text-center">{item.quantity}</span>
                                <button onClick={() => handleSatuanQuantityChange(item.name, 1)} className="w-8 h-8 flex items-center justify-center border rounded-md"><PlusIcon className="w-4 h-4"/></button>
                            </div>
                        </div>
                    ))}
                 </div>
            );
        }
        return null;
    }

    return (
        <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="flex items-center mb-6">
                <button onClick={() => setActivePage('Laundry')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 mr-4">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold">Pesan Laundry {serviceType}</h1>
            </div>

            <div className="space-y-4">
                <div className="bg-surface dark:bg-dark-surface p-4 rounded-xl shadow-md space-y-3">
                    <h3 className="font-bold flex items-center gap-2"><MapPinIcon className="w-5 h-5 text-primary dark:text-gold-light"/> Alamat Penjemputan</h3>
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full p-2 border rounded-md bg-background dark:bg-dark-background" />
                </div>
                <div className="bg-surface dark:bg-dark-surface p-4 rounded-xl shadow-md space-y-3">
                    <h3 className="font-bold flex items-center gap-2"><CalendarDaysIcon className="w-5 h-5 text-primary dark:text-gold-light"/> Jadwal Penjemputan</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <input type="date" value={pickupDate} onChange={e => setPickupDate(e.target.value)} className="w-full p-2 border rounded-md bg-background dark:bg-dark-background" />
                        <select value={pickupTime} onChange={e => setPickupTime(e.target.value)} className="w-full p-2 border rounded-md bg-background dark:bg-dark-background">
                            <option>08:00 - 10:00</option>
                            <option>10:00 - 12:00</option>
                            <option>12:00 - 14:00</option>
                            <option>14:00 - 16:00</option>
                            <option>16:00 - 18:00</option>
                        </select>
                    </div>
                </div>
                 <div className="bg-surface dark:bg-dark-surface p-4 rounded-xl shadow-md space-y-3">
                    <h3 className="font-bold">Detail Pesanan</h3>
                    {renderServiceSpecificInputs()}
                </div>
                <div className="bg-surface dark:bg-dark-surface p-4 rounded-xl shadow-md space-y-3">
                    <h3 className="font-bold flex items-center gap-2"><PencilIcon className="w-5 h-5 text-primary dark:text-gold-light"/> Catatan Khusus (Opsional)</h3>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Contoh: Tolong pisahkan baju putih..." className="w-full h-20 p-2 border rounded-md bg-background dark:bg-dark-background resize-none"></textarea>
                </div>
            </div>

             <div className="fixed bottom-0 left-0 right-0 bg-surface dark:bg-dark-surface p-3 border-t dark:border-slate-700 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
                <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Estimasi Biaya</p>
                        <p className="font-bold text-xl text-primary dark:text-gold-light">{formatToRupiah(estimatedPrice)}</p>
                    </div>
                    <button 
                        onClick={handleSubmit}
                        disabled={estimatedPrice <= 0}
                        className="bg-gradient-to-br from-gold-light to-gold-dark text-white font-bold py-3 px-8 rounded-lg transition-opacity hover:opacity-90 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed"
                    >
                        Jemput Sekarang
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LaundryOrderPage;