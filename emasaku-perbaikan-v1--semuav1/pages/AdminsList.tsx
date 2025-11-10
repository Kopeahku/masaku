import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types.ts';
import { getAllUsers } from '../services/mockData.ts';
// Fix: Add guard for heroicons
import { 
    ChevronRightIcon as ChevronRightIconSolid, 
    MegaphoneIcon as MegaphoneIconSolid, 
    XMarkIcon as XMarkIconSolid 
} from '@heroicons/react/24/solid';

// Fix: Add guard for heroicons
const ChevronRightIcon = (ChevronRightIconSolid as any).default || ChevronRightIconSolid;
const MegaphoneIcon = (MegaphoneIconSolid as any).default || MegaphoneIconSolid;
const XMarkIcon = (XMarkIconSolid as any).default || XMarkIconSolid;

interface AdminsListProps {
  navigateToProfile: (userId: string) => void;
  currentUser: User;
  onBroadcast: (message: string) => void;
}

interface BroadcastModalProps {
  onClose: () => void;
  onSend: (message: string) => void;
}

const BroadcastModal: React.FC<BroadcastModalProps> = ({ onClose, onSend }) => {
    const [message, setMessage] = useState('');
    
    const handleSend = () => {
        if (!message.trim()) {
            alert('Pesan tidak boleh kosong.');
            return;
        }
        onSend(message);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-2xl p-6 w-full max-w-lg relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3 mb-4">
                    <MegaphoneIcon className="w-6 h-6 text-primary dark:text-gold-light"/>
                    <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">Kirim Pesan ke Semua Admin</h2>
                </div>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ketik pesan broadcast Anda di sini..."
                    className="w-full h-40 p-2 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600 focus:ring-2 focus:ring-primary focus:outline-none"
                    rows={5}
                />
                <div className="flex justify-end gap-3 pt-4">
                    <button onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md text-sm font-semibold">Batal</button>
                    <button onClick={handleSend} className="px-4 py-2 bg-gradient-to-r from-gold-light to-gold-dark text-white font-bold rounded-md text-sm">Kirim Broadcast</button>
                </div>
            </div>
        </div>
    );
};

const AdminsList: React.FC<AdminsListProps> = ({ navigateToProfile, currentUser, onBroadcast }) => {
  const [admins, setAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBroadcastModalOpen, setBroadcastModalOpen] = useState(false);

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      const allUsers = await getAllUsers();
      setAdmins(allUsers.filter(u => u.role === UserRole.ADMIN));
      setLoading(false);
    };
    fetchAdmins();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">Daftar Admin</h1>
            {currentUser.role === UserRole.DEVELOPER && (
                <button
                    onClick={() => setBroadcastModalOpen(true)}
                    className="flex items-center gap-2 bg-gradient-to-br from-indigo-500 to-purple-600 hover:opacity-90 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors shadow-lg"
                >
                    <MegaphoneIcon className="w-5 h-5" />
                    Kirim Pesan Broadcast
                </button>
            )}
        </div>

        <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md">
            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                {admins.map(admin => (
                    <li key={admin.id}>
                        <button 
                            onClick={() => navigateToProfile(admin.id)} 
                            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
                        >
                            <div className="flex items-center space-x-4">
                                <img src={admin.avatarUrl} alt={admin.name} className="w-12 h-12 rounded-full" />
                                <div>
                                    <p className="font-semibold text-text-primary dark:text-dark-text-primary">{admin.name}</p>
                                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{admin.role}</p>
                                </div>
                            </div>
                            <ChevronRightIcon className="w-5 h-5 text-slate-400 dark:text-slate-500"/>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
        {isBroadcastModalOpen && <BroadcastModal onClose={() => setBroadcastModalOpen(false)} onSend={onBroadcast} />}
    </div>
  );
};

export default AdminsList;