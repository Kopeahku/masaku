import React, { useState, useEffect, useMemo } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    ClockIcon as ClockIconSolid, 
    MagnifyingGlassIcon as MagnifyingGlassIconSolid 
} from '@heroicons/react/24/solid';
import { Transaction, User } from '../types.ts';
import { getTransactionsForUser } from '../services/mockData.ts';
import TransactionList from '../components/dashboard/RecentTransactions.tsx';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const ClockIcon = (ClockIconSolid as any).default || ClockIconSolid;
const MagnifyingGlassIcon = (MagnifyingGlassIconSolid as any).default || MagnifyingGlassIconSolid;

interface RiwayatTransaksiPageProps {
  currentUser: User;
  setActivePage: (page: string) => void;
}

const RiwayatTransaksiPage: React.FC<RiwayatTransaksiPageProps> = ({ currentUser, setActivePage }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      const userTransactions = await getTransactionsForUser(currentUser.id);
      setTransactions(userTransactions);
      setLoading(false);
    };
    fetchTransactions();
  }, [currentUser.id]);

  const filteredTransactions = useMemo(() => {
    if (!searchTerm) {
        return transactions;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return transactions.filter(tx =>
        tx.description.toLowerCase().includes(lowercasedTerm) ||
        tx.amount.toString().includes(lowercasedTerm) ||
        (tx.method && tx.method.toLowerCase().includes(lowercasedTerm)) ||
        tx.type.toString().toLowerCase().includes(lowercasedTerm)
    );
  }, [transactions, searchTerm]);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => setActivePage('Profile')}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-4"
          aria-label="Kembali ke Profil"
        >
          <ArrowLeftIcon className="w-6 h-6 text-text-primary dark:text-dark-text-primary" />
        </button>
        <div className="flex items-center gap-3">
          <ClockIcon className="w-8 h-8 text-primary dark:text-gold-light" />
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">
            Riwayat Transaksi
          </h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-dark-text-secondary pointer-events-none" />
        <input
            type="text"
            placeholder="Cari berdasarkan deskripsi, jumlah, atau metode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-background dark:bg-dark-background focus:ring-2 focus:ring-primary focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <TransactionList
          transactions={filteredTransactions}
          title="Semua Transaksi"
          // onUserClick is omitted because this page shows a single user's history
        />
      )}
    </div>
  );
};

export default RiwayatTransaksiPage;