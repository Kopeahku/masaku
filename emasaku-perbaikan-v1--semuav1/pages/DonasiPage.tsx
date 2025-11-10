import React from 'react';
import { ArrowLeftIcon as ArrowLeftIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import type { DonationProgram } from '../types.ts';
import DonationProgramCard from '../components/donations/DonationProgramCard.tsx';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const HeartIcon = (HeartIconSolid as any).default || HeartIconSolid;


interface DonasiPageProps {
  setActivePage: (page: string) => void;
  navigateToDonationDetail: (programId: number) => void;
  donationPrograms: DonationProgram[];
}

const DonasiPage: React.FC<DonasiPageProps> = ({ setActivePage, navigateToDonationDetail, donationPrograms }) => {
    const loading = donationPrograms.length === 0;

    const featuredProgram = donationPrograms[0];
    const otherPrograms = donationPrograms.slice(1, 3); // Show 2 other programs on the main page

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
                    onClick={() => setActivePage('Dashboard')}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-4"
                    aria-label="Kembali ke Dasbor"
                >
                    <ArrowLeftIcon className="w-6 h-6 text-text-primary dark:text-dark-text-primary" />
                </button>
                <div className="flex items-center gap-3">
                    <HeartIcon className="w-8 h-8 text-red-500" />
                    <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">
                        Donasi & Kebaikan
                    </h1>
                </div>
            </div>

            {/* Featured Program */}
            {featuredProgram && (
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary mb-3">Program Unggulan</h2>
                    <DonationProgramCard program={featuredProgram} onNavigateToDetail={navigateToDonationDetail} />
                </div>
            )}
            
            {/* Other Programs */}
            {otherPrograms.length > 0 && (
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">Program Lainnya</h2>
                        <button 
                            onClick={() => setActivePage('Semua Program Donasi')}
                            className="text-sm font-semibold text-primary dark:text-gold-light hover:underline"
                        >
                            Lihat Semua
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {otherPrograms.map(program => (
                            <DonationProgramCard key={program.id} program={program} onNavigateToDetail={navigateToDonationDetail} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DonasiPage;