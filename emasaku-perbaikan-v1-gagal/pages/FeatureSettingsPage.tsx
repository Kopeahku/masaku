import React, { useState } from 'react';
import type { ElementType } from 'react';
import { dashboardFeatures, DashboardFeature } from '../features.ts';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    Cog6ToothIcon as Cog6ToothIconSolid, 
    XMarkIcon as XMarkIconSolid, 
    BanknotesIcon as BanknotesIconSolid, 
    SparklesIcon as SparklesIconSolid 
} from '@heroicons/react/24/solid';
import { User, UserRole } from '../types.ts';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const Cog6ToothIcon = (Cog6ToothIconSolid as any).default || Cog6ToothIconSolid;
const XMarkIcon = (XMarkIconSolid as any).default || XMarkIconSolid;
const BanknotesIcon = (BanknotesIconSolid as any).default || BanknotesIconSolid;
const SparklesIcon = (SparklesIconSolid as any).default || SparklesIconSolid;

interface FeatureSettingsPageProps {
    currentUser: User;
    setActivePage: (page: string) => void;
    featureVisibility: Record<string, boolean>;
    onToggleFeature: (featureId: string) => void;
    onRequestFeatureActivation: (featureId: string, featureLabel: string, cost: number) => void;
}

const FeatureActivationModal: React.FC<{
    feature: DashboardFeature;
    onClose: () => void;
    onConfirm: (featureId: string, featureLabel: string, cost: number) => void;
}> = ({ feature, onClose, onConfirm }) => {
    const activationCost = 1000000; // Mock cost
    
    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-2xl p-6 w-full max-w-md relative text-center">
                <button onClick={onClose} className="absolute top-3 right-3 text-slate-400"><XMarkIcon className="w-6 h-6" /></button>
                <SparklesIcon className="w-12 h-12 text-primary dark:text-gold-light mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Aktivasi Fitur Premium</h2>
                <p className="text-text-secondary dark:text-dark-text-secondary text-sm">
                    Anda akan mengaktifkan fitur <strong>"{feature.label}"</strong>. Fitur ini memerlukan pembayaran satu kali untuk aktivasi.
                </p>
                <div className="my-6 p-4 bg-slate-100 dark:bg-dark-surface/50 rounded-lg">
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Biaya Aktivasi</p>
                    <p className="text-3xl font-bold text-gold-dark dark:text-gold-light">Rp 1.000.000</p>
                </div>
                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">
                    Dengan melanjutkan, permintaan aktivasi akan dikirim ke Developer untuk persetujuan.
                </p>
                <div className="flex justify-end gap-3 pt-6">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md text-sm font-semibold">Batal</button>
                    <button 
                        type="button" 
                        onClick={() => onConfirm(feature.id, feature.label, activationCost)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-gold-light to-gold-dark text-amber-900 font-bold rounded-md text-sm transition-opacity hover:opacity-90"
                    >
                        <BanknotesIcon className="w-5 h-5" />
                        Bayar & Aktifkan
                    </button>
                </div>
            </div>
        </div>
    );
};

const FeatureSettingsPage: React.FC<FeatureSettingsPageProps> = ({
    currentUser,
    setActivePage,
    featureVisibility,
    onToggleFeature,
    onRequestFeatureActivation
}) => {
    const [activationModalFeature, setActivationModalFeature] = useState<DashboardFeature | null>(null);

    const handleToggleClick = (feature: DashboardFeature, isVisible: boolean) => {
        if (isVisible) {
            // If it's visible, we are turning it OFF. This is a free action.
            onToggleFeature(feature.id);
        } else {
            // If it's not visible, we are turning it ON. This requires payment/approval.
            setActivationModalFeature(feature);
        }
    };
    
    const handleConfirmActivation = (featureId: string, featureLabel: string, cost: number) => {
        onRequestFeatureActivation(featureId, featureLabel, cost);
        setActivationModalFeature(null);
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex items-center mb-6">
                <button
                    onClick={() => setActivePage('Dashboard')}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-4"
                    aria-label="Kembali ke Dasbor"
                >
                    <ArrowLeftIcon className="w-6 h-6 text-text-primary dark:text-dark-text-primary" />
                </button>
                <div className="flex items-center gap-3">
                    <Cog6ToothIcon className="w-8 h-8 text-primary dark:text-gold-light" />
                    <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">
                        Pengaturan Fitur
                    </h1>
                </div>
            </div>

            {/* Settings Panel */}
            <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6">
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-4">
                    Atur visibilitas fitur di dasbor pengguna. Mengaktifkan fitur memerlukan persetujuan developer, sementara hanya developer yang dapat menonaktifkan fitur yang sudah aktif.
                </p>
                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                    {dashboardFeatures.map(feature => {
                        const isVisible = featureVisibility[feature.id];
                        const isAdmin = currentUser.role === UserRole.ADMIN;
                        
                        // Admin cannot deactivate a visible feature.
                        const isToggleDisabled = isAdmin && isVisible;
                        
                        // Fix: Robustly handle cases where the icon might be a module object
                        const Icon = (feature.icon as any).default || feature.icon;

                        return (
                            <div key={feature.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Icon className="w-6 h-6 text-text-secondary dark:text-dark-text-secondary" />
                                    <span className="font-semibold text-text-primary dark:text-dark-text-primary">{feature.label}</span>
                                </div>
                                <button 
                                    onClick={() => handleToggleClick(feature, isVisible)}
                                    disabled={isToggleDisabled}
                                    title={isToggleDisabled ? "Hanya developer yang dapat menonaktifkan fitur." : (isVisible ? "Nonaktifkan fitur" : "Aktifkan fitur")}
                                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                                        isVisible ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                                    } ${isToggleDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
                                >
                                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isVisible ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            {activationModalFeature && (
                <FeatureActivationModal 
                    feature={activationModalFeature}
                    onClose={() => setActivationModalFeature(null)}
                    onConfirm={handleConfirmActivation}
                />
            )}
        </div>
    );
};

export default FeatureSettingsPage;