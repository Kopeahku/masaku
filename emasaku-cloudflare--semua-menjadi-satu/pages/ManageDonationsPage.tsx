import React, { useState } from 'react';
import { DonationProgram } from '../types.ts';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    HeartIcon as HeartIconSolid, 
    PlusCircleIcon as PlusCircleIconSolid,
    PencilIcon as PencilIconSolid,
    TrashIcon as TrashIconSolid
} from '@heroicons/react/24/solid';
import { formatToRupiah } from '../utils/formatter.ts';
import DonationFormModal from '../components/donations/DonationFormModal.tsx';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const HeartIcon = (HeartIconSolid as any).default || HeartIconSolid;
const PlusCircleIcon = (PlusCircleIconSolid as any).default || PlusCircleIconSolid;
const PencilIcon = (PencilIconSolid as any).default || PencilIconSolid;
const TrashIcon = (TrashIconSolid as any).default || TrashIconSolid;

interface ManageDonationsPageProps {
    setActivePage: (page: string) => void;
    donationPrograms: DonationProgram[];
    onAddProgram: (program: Omit<DonationProgram, 'id'>) => void;
    onUpdateProgram: (program: DonationProgram) => void;
    onDeleteProgram: (programId: number) => void;
}

const ManageDonationsPage: React.FC<ManageDonationsPageProps> = ({ setActivePage, donationPrograms, onAddProgram, onUpdateProgram, onDeleteProgram }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProgram, setEditingProgram] = useState<DonationProgram | null>(null);

    const handleOpenModal = (program: DonationProgram | null = null) => {
        setEditingProgram(program);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProgram(null);
    };

    const handleSaveProgram = (programData: DonationProgram | Omit<DonationProgram, 'id' | 'currentAmount'>) => {
        if ('id' in programData) {
            onUpdateProgram(programData as DonationProgram);
        } else {
            onAddProgram(programData as Omit<DonationProgram, 'id'>);
        }
        handleCloseModal();
    };
    
    const handleDelete = (program: DonationProgram) => {
        if (window.confirm(`Anda yakin ingin menghapus program "${program.title}"? Aksi ini tidak dapat dibatalkan.`)) {
            onDeleteProgram(program.id);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            {isModalOpen && (
                <DonationFormModal 
                    programToEdit={editingProgram}
                    onClose={handleCloseModal}
                    onSave={handleSaveProgram}
                />
            )}
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
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
                            Kelola Program Donasi
                        </h1>
                    </div>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-primary text-white font-semibold px-4 py-2 rounded-lg text-sm"
                >
                    <PlusCircleIcon className="w-5 h-5"/>
                    Tambah Program
                </button>
            </div>

            <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-4 space-y-3">
                {donationPrograms.length > 0 ? donationPrograms.map(program => {
                    const progress = (program.currentAmount / program.targetAmount) * 100;
                    return (
                        <div key={program.id} className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg flex flex-col md:flex-row items-start gap-4">
                            <img src={program.imageUrl} alt={program.title} className="w-full md:w-32 h-24 object-cover rounded-md flex-shrink-0" />
                            <div className="flex-grow">
                                <span className="text-xs font-semibold bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-400 px-2 py-1 rounded-full">{program.category}</span>
                                <h3 className="font-bold mt-1">{program.title}</h3>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 my-1">
                                    <div className="bg-gradient-to-r from-gold-light to-gold-dark h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                                </div>
                                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">
                                    {formatToRupiah(program.currentAmount)} / {formatToRupiah(program.targetAmount)}
                                </p>
                            </div>
                            <div className="flex gap-2 self-start md:self-center flex-shrink-0">
                                <button onClick={() => handleOpenModal(program)} className="p-2 bg-blue-100 text-blue-600 rounded-full"><PencilIcon className="w-5 h-5"/></button>
                                <button onClick={() => handleDelete(program)} className="p-2 bg-red-100 text-red-600 rounded-full"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        </div>
                    );
                }) : (
                    <p className="text-center text-text-secondary dark:text-dark-text-secondary py-8">Belum ada program donasi. Klik "Tambah Program" untuk memulai.</p>
                )}
            </div>
        </div>
    );
};

export default ManageDonationsPage;