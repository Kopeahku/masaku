import React from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    ShoppingBagIcon as ShoppingBagIconSolid 
} from '@heroicons/react/24/solid';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const ShoppingBagIcon = (ShoppingBagIconSolid as any).default || ShoppingBagIconSolid;


interface CheckoutPageProps {
  setActivePage: (page: string) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ setActivePage }) => {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => setActivePage('Keranjang')}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-4"
          aria-label="Kembali ke Keranjang"
        >
          <ArrowLeftIcon className="w-6 h-6 text-text-primary dark:text-dark-text-primary" />
        </button>
        <div className="flex items-center gap-3">
          <ShoppingBagIcon className="w-8 h-8 text-primary dark:text-gold-light" />
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">
            Checkout
          </h1>
        </div>
      </div>

      <div className="text-center bg-surface dark:bg-dark-surface p-8 rounded-xl shadow-md">
        <ShoppingBagIcon className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
        <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">Segera Hadir</h2>
        <p className="text-text-secondary dark:text-dark-text-secondary mt-2">
          Halaman checkout sedang dalam tahap akhir pengembangan dan akan segera bisa Anda gunakan untuk menyelesaikan pesanan.
        </p>
      </div>
    </div>
  );
};

export default CheckoutPage;