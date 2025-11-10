import React from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    HeartIcon as HeartIconSolid
} from '@heroicons/react/24/solid';
import type { DonationProgram } from '../types.ts';
import DonationProgramCard from '../components/donations/DonationProgramCard.tsx';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const HeartIcon = (HeartIconSolid as any).default || HeartIconSolid;

interface AllDonationsPageProps {
  setActivePage: (page: string) => void;
  navigateToDonationDetail: (programId: number) => void;
  donationPrograms: DonationProgram[];
}

const AllDonationsPage: React.FC<AllDonationsPageProps> = ({ setActivePage, navigateToDonationDetail, donationPrograms }) => {
    const loading = donationPrograms.length === 0;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }
  
    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-center mb-6">
            <button
            onClick={() => setActivePage('Donasi')}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-4"
            aria-label="Kembali ke Halaman Donasi"
            >
            <ArrowLeftIcon className="w-6 h-6 text-text-primary dark:text-dark-text-primary" />
            </button>
            <div className="flex items-center gap-3">
                <HeartIcon className="w-8 h-8 text-primary dark:text-gold-light" />
                <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">
                    Semua Program Donasi
                </h1>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {donationPrograms.map(program => (
                <DonationProgramCard 
                    key={program.id} 
                    program={program}
                    onNavigateToDetail={navigateToDonationDetail}
                />
            ))}
        </div>
        </div>
    );
};

export default AllDonationsPage;