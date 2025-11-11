import React from 'react';
import { DonationProgram } from '../../types.ts';
import { formatToRupiah } from '../../utils/formatter.ts';
// Fix: Add guard for heroicons
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

// Fix: Add guard for heroicons
const HeartIcon = (HeartIconSolid as any).default || HeartIconSolid;

interface DonationProgramCardProps {
  program: DonationProgram;
  onNavigateToDetail: (programId: number) => void;
}

const DonationProgramCard: React.FC<DonationProgramCardProps> = ({ program, onNavigateToDetail }) => {
    const progress = (program.currentAmount / program.targetAmount) * 100;

    return (
        <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col">
            <img 
                src={program.imageUrl} 
                alt={program.title} 
                className="w-full h-40 object-cover cursor-pointer" 
                onClick={() => onNavigateToDetail(program.id)}
            />
            <div className="p-4 flex flex-col flex-grow">
                <span className="text-xs font-semibold bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-400 px-2 py-1 rounded-full w-fit">{program.category}</span>
                <h3 
                    className="font-bold text-lg text-text-primary dark:text-dark-text-primary mt-2 line-clamp-1 cursor-pointer"
                    onClick={() => onNavigateToDetail(program.id)}
                >
                    {program.title}
                </h3>
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary my-2 h-10 line-clamp-2">{program.description}</p>
                
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 my-2">
                    <div className="bg-gradient-to-r from-gold-light to-gold-dark h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="font-semibold text-text-primary dark:text-dark-text-primary">{formatToRupiah(program.currentAmount)}</span>
                    <span className="text-text-secondary dark:text-dark-text-secondary">dari {formatToRupiah(program.targetAmount)}</span>
                </div>

                <div className="mt-auto pt-4">
                    <button
                        onClick={() => onNavigateToDetail(program.id)}
                        className="w-full bg-gradient-to-br from-gold-light to-gold-dark text-white font-bold py-2.5 px-4 rounded-lg transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
                    >
                        <HeartIcon className="w-5 h-5"/>
                        Donasi Sekarang
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DonationProgramCard;