import React from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    TagIcon as TagIconSolid 
} from '@heroicons/react/24/solid';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const TagIcon = (TagIconSolid as any).default || TagIconSolid;

interface DasborMitraPenjualPageProps {
  setActivePage: (page: string) => void;
}

const DasborMitraPenjualPage: React.FC<DasborMitraPenjualPageProps> = ({ setActivePage }) => {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => setActivePage('Dasbor Mitra')}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-4"
          aria-label="Kembali ke Dasbor Mitra"
        >
          <ArrowLeftIcon className="w-6 h-6 text-text-primary dark:text-dark-text-primary" />
        </button>
        <div className="flex items-center gap-3">
          <TagIcon className="w-8 h-8 text-primary dark:text-gold-light" />
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">
            Dasbor Mitra Penjual
          </h1>
        </div>
      </div>

      <div className="text-center bg-surface dark:bg-dark-surface p-8 rounded-xl shadow-md">
        <TagIcon className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
        <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">Segera Hadir</h2>
        <p className="text-text-secondary dark:text-dark-text-secondary mt-2">
          Halaman dasbor untuk mitra penjual sedang dalam pengembangan. Di sini Anda akan dapat mengelola produk, melihat pesanan, dan melacak pendapatan Anda.
        </p>
      </div>
    </div>
  );
};

export default DasborMitraPenjualPage;