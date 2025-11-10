import React, { useState, useEffect } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    GiftIcon as GiftIconSolid, 
    TrophyIcon as TrophyIconSolid, 
    ArrowPathIcon as ArrowPathIconSolid, 
    UsersIcon as UsersIconSolid, 
    PlusCircleIcon as PlusCircleIconSolid 
} from '@heroicons/react/24/solid';
import { User } from '../types.ts';
import { getArisanMembers } from '../services/mockData.ts';
import { formatToRupiah } from '../utils/formatter.ts';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const GiftIcon = (GiftIconSolid as any).default || GiftIconSolid;
const TrophyIcon = (TrophyIconSolid as any).default || TrophyIconSolid;
const ArrowPathIcon = (ArrowPathIconSolid as any).default || ArrowPathIconSolid;
const UsersIcon = (UsersIconSolid as any).default || UsersIconSolid;
const PlusCircleIcon = (PlusCircleIconSolid as any).default || PlusCircleIconSolid;


interface ArisanPageProps {
  setActivePage: (page: string) => void;
  currentUser: User;
}

const ArisanPage: React.FC<ArisanPageProps> = ({ setActivePage, currentUser }) => {
  const [members, setMembers] = useState<User[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [winner, setWinner] = useState<User | null>(null);
  const [showWinner, setShowWinner] = useState(false);
  
  const arisanFee = 100000; // Mock fee per member

  useEffect(() => {
    const fetchMembers = async () => {
        const arisanMembers = await getArisanMembers();
        setMembers(arisanMembers);
    };
    fetchMembers();
  }, []);

  const handleDraw = () => {
    if (isDrawing || members.length === 0) return;

    setIsDrawing(true);
    setWinner(null);
    setShowWinner(false);

    // Shake animation for 2 seconds
    setTimeout(() => {
        const winnerIndex = Math.floor(Math.random() * members.length);
        const winnerUser = members[winnerIndex];
        setWinner(winnerUser);
    }, 2000);

    // After ticket flies out (shake + fly-out animation)
    setTimeout(() => {
        setIsDrawing(false);
        setShowWinner(true);
    }, 3000); // 2000ms shake + 1000ms fly-out
  };

  const handleReset = () => {
    setWinner(null);
    setShowWinner(false);
  };
  
  const totalPrize = members.length * arisanFee;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
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
            <GiftIcon className="w-8 h-8 text-cyan-500" />
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">
                Arisan Komunitas
            </h1>
            </div>
        </div>
        <button
            onClick={() => setActivePage('Daftar Arisan')}
            className="flex items-center gap-2 bg-primary text-white font-semibold px-4 py-2 rounded-lg text-sm"
        >
            <PlusCircleIcon className="w-5 h-5"/>
            Buat Grup Baru
        </button>
      </div>
      
       {/* Active Arisan Groups */}
      <div className="mb-6 bg-surface dark:bg-dark-surface p-4 md:p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-3"><UsersIcon className="w-6 h-6 text-text-secondary"/> Grup Arisan Aktif</h3>
        <div className="space-y-2">
            {/* Mockup of an active group */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <div>
                    <p className="font-bold">Arisan Warga RT 05</p>
                    <p className="text-xs text-text-secondary">10 Anggota | Iuran {formatToRupiah(100000)}/Bulan</p>
                </div>
                <button className="px-3 py-1 bg-cyan-500 text-white text-xs font-bold rounded-md">Lihat</button>
            </div>
             <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <div>
                    <p className="font-bold">Arisan Kantor Ceria</p>
                    <p className="text-xs text-text-secondary">15 Anggota | Iuran {formatToRupiah(50000)}/Minggu</p>
                </div>
                <button className="px-3 py-1 bg-cyan-500 text-white text-xs font-bold rounded-md">Lihat</button>
            </div>
        </div>
      </div>

      <div className="bg-surface dark:bg-dark-surface p-4 md:p-8 rounded-xl shadow-md flex flex-col items-center">
        <h2 className="text-xl font-bold text-center mb-2">Simulasi Kocok Arisan</h2>
        <div className="text-center mb-6">
            <p className="text-text-secondary dark:text-dark-text-secondary">Total Hadiah Simulasi</p>
            <p className="text-4xl font-bold text-primary dark:text-gold-light">{formatToRupiah(totalPrize)}</p>
        </div>
        
        <div className="relative h-64 w-full flex items-center justify-center">
            {/* Arisan Jar */}
            <div className={`arisan-jar ${isDrawing ? 'animate-shake' : ''}`}>
                <div className="arisan-tickets-container">
                    {members.map((member, index) => (
                        <div 
                            key={member.id} 
                            className="arisan-ticket" 
                            style={{ 
                                // @ts-ignore
                                '--x': `${(Math.random() * 80) - 40}px`,
                                '--y': `${(Math.random() * 40) - 20}px`,
                                '--r': `${(Math.random() * 40) - 20}deg`,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Winner Ticket Animation */}
            {winner && !isDrawing && (
                <div className="arisan-winner-ticket absolute">
                     <div className="bg-gold-light p-4 rounded-lg shadow-2xl text-center transform transition-transform duration-500 ease-out -rotate-6">
                        <img src={winner.avatarUrl} alt={winner.name} className="w-20 h-20 rounded-full mx-auto ring-4 ring-gold-dark mb-2"/>
                        <p className="font-bold text-lg text-gold-dark">{winner.name}</p>
                    </div>
                </div>
            )}
        </div>

        {showWinner && winner ? (
            <div className="mt-6 text-center animate-fade-in">
                <div className="flex items-center justify-center gap-2">
                    <TrophyIcon className="w-8 h-8 text-amber-500" />
                    <h3 className="text-xl font-bold">Selamat Kepada Pemenang!</h3>
                </div>
                <div className="my-4 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg inline-block">
                    <img src={winner.avatarUrl} alt={winner.name} className="w-16 h-16 rounded-full mx-auto ring-4 ring-gold-DEFAULT"/>
                    <p className="text-2xl font-bold mt-2 text-primary dark:text-gold-light">{winner.name}</p>
                </div>
                <div>
                     <button onClick={handleReset} className="flex items-center gap-2 mx-auto px-6 py-2 bg-slate-200 dark:bg-slate-600 text-sm font-semibold rounded-lg">
                        <ArrowPathIcon className="w-5 h-5"/>
                        Undi Ulang
                    </button>
                </div>
            </div>
        ) : (
            <button
                onClick={handleDraw}
                disabled={isDrawing}
                className="mt-6 bg-gradient-to-br from-cyan-400 to-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-all disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-500"
            >
                {isDrawing ? 'Mengocok...' : 'Kocok Pemenang!'}
            </button>
        )}
      </div>
    </div>
  );
};

export default ArisanPage;
