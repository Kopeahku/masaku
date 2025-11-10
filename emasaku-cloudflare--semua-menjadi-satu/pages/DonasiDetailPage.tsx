import React, { useState, useEffect } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    HeartIcon as HeartIconSolid,
    BanknotesIcon as BanknotesIconSolid
} from '@heroicons/react/24/solid';
import { formatToRupiah } from '../utils/formatter.ts';
import type { DonationProgram } from '../types.ts';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const HeartIcon = (HeartIconSolid as any).default || HeartIconSolid;
const BanknotesIcon = (BanknotesIconSolid as any).default || BanknotesIconSolid;

interface DonasiDetailPageProps {
  setActivePage: (page: string) => void;
  program: DonationProgram;
  onDonate: (programTitle: string, amount: number) => void;
  prefilledAmount?: number;
  onPageLeave?: () => void;
}

const DonasiDetailPage: React.FC<DonasiDetailPageProps> = ({ setActivePage, program, onDonate, prefilledAmount, onPageLeave }) => {
    const [donationAmount, setDonationAmount] = useState(prefilledAmount ? String(prefilledAmount) : '');

    useEffect(() => {
        // This effect ensures the component cleans up the prefilled amount when unmounting
        return () => {
            if (onPageLeave) {
                onPageLeave();
            }
        };
    }, [onPageLeave]);

    const handleDonation = () => {
        if (!donationAmount || Number(donationAmount) <= 0) {
            alert('Silakan masukkan jumlah donasi yang valid.');
            return;
        }
        if (program) {
            onDonate(program.title, Number(donationAmount));
        }
    };
    
    const quickAmounts = [25000, 50000, 100000, 250000];
    
    if (!program) {
        return <div className="text-center p-8">Program donasi tidak ditemukan atau sedang dimuat...</div>;
    }

    const progress = (program.currentAmount / program.targetAmount) * 100;

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
             {/* Header */}
            <div className="flex items-center mb-6">
                <button
                onClick={() => {
                    setActivePage('Donasi');
                }}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-4"
                aria-label="Kembali ke Halaman Donasi"
                >
                <ArrowLeftIcon className="w-6 h-6 text-text-primary dark:text-dark-text-primary" />
                </button>
                 <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary truncate">
                    Detail Donasi
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Program Details */}
                <div className="space-y-4">
                    <img src={program.imageUrl} alt={program.title} className="w-full h-56 object-cover rounded-xl shadow-lg"/>
                    <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">{program.title}</h2>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-gold-light to-gold-dark h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                     <div className="flex justify-between text-sm">
                        <div>
                            <p className="text-text-secondary dark:text-dark-text-secondary">Terkumpul</p>
                            <p className="font-bold text-lg text-primary dark:text-gold-light">{formatToRupiah(program.currentAmount)}</p>
                        </div>
                        <div className="text-right">
                             <p className="text-text-secondary dark:text-dark-text-secondary">Target</p>
                            <p className="font-semibold text-text-primary dark:text-dark-text-primary">{formatToRupiah(program.targetAmount)}</p>
                        </div>
                    </div>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{program.description}</p>
                </div>

                {/* Donation Form */}
                <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6 h-fit">
                    <h3 className="text-xl font-bold mb-4 text-text-primary dark:text-dark-text-primary flex items-center gap-2">
                        <HeartIcon className="w-6 h-6 text-red-500"/>
                        Salurkan Kebaikan Anda
                    </h3>
                    
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
                            Jumlah Donasi
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center text-lg font-bold text-text-secondary dark:text-dark-text-secondary">Rp</span>
                            <input
                                type="number"
                                id="amount"
                                value={donationAmount}
                                onChange={(e) => setDonationAmount(e.target.value.replace(/[^0-9]/g, ''))}
                                placeholder="0"
                                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-gold-DEFAULT focus:outline-none bg-white dark:bg-slate-800 dark:border-slate-600 font-bold text-lg"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                        {quickAmounts.map(qa => (
                            <button
                                key={qa}
                                onClick={() => setDonationAmount(String(qa))}
                                className="px-2 py-1.5 border border-slate-300 dark:border-slate-600 rounded-md text-sm font-semibold text-text-secondary dark:text-dark-text-secondary hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                {formatToRupiah(qa)}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleDonation}
                        disabled={!donationAmount || Number(donationAmount) <= 0}
                        className="w-full mt-6 bg-gradient-to-br from-gold-light to-gold-dark text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed"
                    >
                        <BanknotesIcon className="w-5 h-5"/>
                        Donasi Sekarang (via Saldo)
                    </button>
                    <p className="text-xs text-center mt-2 text-text-secondary dark:text-dark-text-secondary">Donasi akan dipotong dari saldo EmaSaku Anda.</p>
                </div>
            </div>
        </div>
    )
}

export default DonasiDetailPage;