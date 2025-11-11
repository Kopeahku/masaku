import React, { useState, useEffect } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    ClipboardDocumentCheckIcon as ClipboardDocumentCheckIconSolid, 
    MagnifyingGlassIcon as MagnifyingGlassIconSolid, 
    TruckIcon as TruckIconSolid, 
    ArchiveBoxIcon as ArchiveBoxIconSolid,
    SparklesIcon as SparklesIconSolid,
    HomeIcon as HomeIconSolid,
    CheckCircleIcon as CheckCircleIconSolid,
    XCircleIcon as XCircleIconSolid
} from '@heroicons/react/24/solid';
import { LaundryOrder, LaundryStatus } from '../types.ts';
import { formatToRupiah } from '../utils/formatter.ts';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const ClipboardDocumentCheckIcon = (ClipboardDocumentCheckIconSolid as any).default || ClipboardDocumentCheckIconSolid;
const MagnifyingGlassIcon = (MagnifyingGlassIconSolid as any).default || MagnifyingGlassIconSolid;
const TruckIcon = (TruckIconSolid as any).default || TruckIconSolid;
const ArchiveBoxIcon = (ArchiveBoxIconSolid as any).default || ArchiveBoxIconSolid;
const SparklesIcon = (SparklesIconSolid as any).default || SparklesIconSolid;
const HomeIcon = (HomeIconSolid as any).default || HomeIconSolid;
const CheckCircleIcon = (CheckCircleIconSolid as any).default || CheckCircleIconSolid;
const XCircleIcon = (XCircleIconSolid as any).default || XCircleIconSolid;


interface LaundryTrackingPageProps {
  order: LaundryOrder;
  onCancelOrder: () => void;
}

const ALL_STEPS: { status: LaundryStatus, icon: React.ElementType, text: string }[] = [
    { status: 'Pesanan Dibuat', icon: ClipboardDocumentCheckIcon, text: 'Pesanan telah kami terima.' },
    { status: 'Mencari Kurir', icon: MagnifyingGlassIcon, text: 'Sistem sedang mencari kurir terdekat.' },
    { status: 'Kurir Menuju Lokasi', icon: TruckIcon, text: 'Kurir sedang dalam perjalanan menjemput pakaianmu.' },
    { status: 'Pakaian Diterima', icon: ArchiveBoxIcon, text: 'Pakaian telah diterima oleh kurir kami.' },
    { status: 'Proses Cuci', icon: SparklesIcon, text: 'Pakaianmu sedang dicuci bersih dan diwangi.' },
    { status: 'Siap Diantar', icon: HomeIcon, text: 'Pakaian bersih siap diantar kembali.' },
    { status: 'Selesai', icon: CheckCircleIcon, text: 'Pesanan telah selesai.' },
];


const LaundryTrackingPage: React.FC<LaundryTrackingPageProps> = ({ order, onCancelOrder }) => {
    const [completedSteps, setCompletedSteps] = useState<LaundryStatus[]>(order.statusSteps);

    useEffect(() => {
        const currentStepIndex = ALL_STEPS.findIndex(step => step.status === completedSteps[completedSteps.length - 1]);
        
        if (currentStepIndex < ALL_STEPS.length - 1) {
            const timer = setTimeout(() => {
                const nextStep = ALL_STEPS[currentStepIndex + 1];
                setCompletedSteps(prev => [...prev, nextStep.status]);
            }, 3000 + Math.random() * 2000); // Simulate 3-5 seconds delay

            return () => clearTimeout(timer);
        }
    }, [completedSteps]);
    
    const isStepCompleted = (step: LaundryStatus) => completedSteps.includes(step);
    const isStepActive = (step: LaundryStatus) => completedSteps[completedSteps.length - 1] === step;

    return (
        <div className="max-w-2xl mx-auto animate-fade-in pb-24">
            <div className="flex items-center justify-between mb-6">
                 <button onClick={onCancelOrder} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 mr-4">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold">Lacak Pesanan</h1>
                <div className="w-12"></div>
            </div>

            <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6 space-y-4">
                <div>
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold text-lg text-text-primary dark:text-dark-text-primary">Order ID: #{order.id.slice(-6)}</h2>
                        <span className="text-xs font-semibold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full">{order.serviceType}</span>
                    </div>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{new Date(order.createdAt).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}</p>
                </div>
                
                <div className="border-t border-b border-slate-200 dark:border-slate-700 py-4">
                    <p className="text-sm font-semibold text-text-secondary dark:text-dark-text-secondary mb-1">Alamat Penjemputan</p>
                    <p className="text-text-primary dark:text-dark-text-primary">{order.address}</p>
                </div>

                {/* Timeline */}
                <div className="relative pl-5 py-4">
                    {ALL_STEPS.map((stepInfo, index) => {
                        const completed = isStepCompleted(stepInfo.status);
                        const active = isStepActive(stepInfo.status);
                        const Icon = (stepInfo.icon as any).default || stepInfo.icon;
                        return (
                             <div key={stepInfo.status} className="flex items-start gap-4 mb-6">
                                <div className="absolute left-0 transform -translate-x-1/2 mt-1">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${completed ? 'bg-primary dark:bg-gold-dark' : 'bg-slate-300 dark:bg-slate-600'}`}>
                                        <Icon className={`w-4 h-4 text-white ${active ? 'animate-pulse' : ''}`} />
                                    </div>
                                    {index < ALL_STEPS.length - 1 && (
                                        <div className={`absolute top-6 left-1/2 -translate-x-1/2 h-8 w-0.5 transition-colors ${completed ? 'bg-primary dark:bg-gold-dark' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                                    )}
                                </div>
                                <div className="ml-4">
                                    <h4 className={`font-bold transition-colors ${completed ? 'text-text-primary dark:text-dark-text-primary' : 'text-text-secondary dark:text-dark-text-secondary'}`}>{stepInfo.status}</h4>
                                    {completed && <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{stepInfo.text}</p>}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            
            <div className="fixed bottom-0 left-0 right-0 bg-surface dark:bg-dark-surface p-3 border-t dark:border-slate-700 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
                <div className="max-w-2xl mx-auto">
                    <button 
                        onClick={onCancelOrder}
                        className="w-full flex items-center justify-center gap-2 bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-800/60 text-red-600 dark:text-red-400 font-bold py-3 px-8 rounded-lg transition-colors"
                    >
                        <XCircleIcon className="w-5 h-5"/>
                        Batalkan Pesanan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LaundryTrackingPage;