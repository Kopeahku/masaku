import React, { useState, useEffect } from 'react';
// Fix: Add .ts extension to the import path
import { SavingsGoal } from '../../types.ts';
import { XMarkIcon as XMarkIconOutline } from '@heroicons/react/24/outline';

// Fix: Add guard for heroicons
const XMarkIcon = (XMarkIconOutline as any).default || XMarkIconOutline;

interface EditGoalModalProps {
  goal: SavingsGoal | null;
  onClose: () => void;
  onSave: (goalData: { name: string; targetAmount: number; targetDate?: string }) => void;
}

const EditGoalModal: React.FC<EditGoalModalProps> = ({ goal, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  
  useEffect(() => {
    if (goal) {
      setName(goal.name);
      setTargetAmount(goal.targetAmount.toString());
      setTargetDate(goal.targetDate || '');
    }
  }, [goal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      targetAmount: parseFloat(targetAmount),
      targetDate: targetDate || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-2xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          aria-label="Tutup"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary mb-4">
          {goal ? 'Ubah Tujuan Tabungan' : 'Buat Tujuan Tabungan Baru'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
              Nama Tujuan
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Liburan ke Bali"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none bg-white dark:bg-slate-800 dark:border-slate-600"
              required
            />
          </div>
          <div>
            <label htmlFor="targetAmount" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
              Target Jumlah (Rp)
            </label>
            <input
              type="number"
              id="targetAmount"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="Contoh: 10000000"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none bg-white dark:bg-slate-800 dark:border-slate-600"
              required
              min="1"
            />
          </div>
          <div>
            <label htmlFor="targetDate" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
              Tanggal Target (Opsional)
            </label>
            <input
              type="date"
              id="targetDate"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none bg-white dark:bg-slate-800 dark:border-slate-600"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md text-sm font-semibold">
              Batal
            </button>
            <button type="submit" className="px-4 py-2 bg-gradient-to-r from-gold-light to-gold-dark hover:opacity-90 transition-opacity rounded-md text-white text-sm font-semibold">
              Simpan Tujuan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditGoalModal;