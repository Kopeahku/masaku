import React from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    PuzzlePieceIcon as PuzzlePieceIconSolid, 
    TrophyIcon as TrophyIconSolid,
    FireIcon as FireIconSolid,
    GiftIcon as GiftIconSolid,
    PlayCircleIcon as PlayCircleIconSolid,
    UserGroupIcon as UserGroupIconSolid
} from '@heroicons/react/24/solid';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const PuzzlePieceIcon = (PuzzlePieceIconSolid as any).default || PuzzlePieceIconSolid;
const TrophyIcon = (TrophyIconSolid as any).default || TrophyIconSolid;
const FireIcon = (FireIconSolid as any).default || FireIconSolid;
const GiftIcon = (GiftIconSolid as any).default || GiftIconSolid;
const PlayCircleIcon = (PlayCircleIconSolid as any).default || PlayCircleIconSolid;
const UserGroupIcon = (UserGroupIconSolid as any).default || UserGroupIconSolid;


interface GamePageProps {
  setActivePage: (page: string) => void;
}

// Mock Data
const mockFeaturedGame = {
    title: 'Teka-Teki Cerdas',
    description: 'Uji wawasanmu dalam kuis harian berhadiah poin!',
    imageUrl: 'https://images.unsplash.com/photo-1579820010410-c10411aaaa88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
};

const mockGames = [
    { id: 1, title: 'Catur Cepat', category: 'Strategi', imageUrl: 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80' },
    { id: 2, title: 'Susun Kata', category: 'Asah Otak', imageUrl: 'https://images.unsplash.com/photo-1604263030429-923187a54a2a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80' },
    { id: 3, title: 'Blok Geser', category: 'Puzzle', imageUrl: 'https://images.unsplash.com/photo-1596496050827-8299e0220de1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80' },
    { id: 4, title: 'Balap Mobil', category: 'Aksi', imageUrl: 'https://images.unsplash.com/photo-1552642224-e9a7413a2750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80' },
];

const mockLeaderboard = [
    { id: 1, name: 'Budi S.', score: 12500, avatarUrl: 'https://picsum.photos/seed/leader1/50' },
    { id: 2, name: 'Siti A.', score: 11800, avatarUrl: 'https://picsum.photos/seed/leader2/50' },
    { id: 3, name: 'Eko W.', score: 10500, avatarUrl: 'https://picsum.photos/seed/leader3/50' },
];

const GameCard: React.FC<{ game: typeof mockGames[0] }> = ({ game }) => (
    <div className="bg-surface dark:bg-dark-surface rounded-lg shadow-md overflow-hidden group transition-all hover:shadow-xl hover:-translate-y-1">
        <img src={game.imageUrl} alt={game.title} className="w-full h-28 object-cover" />
        <div className="p-3">
            <h4 className="font-bold text-text-primary dark:text-dark-text-primary truncate">{game.title}</h4>
            <p className="text-xs text-text-secondary dark:text-dark-text-secondary">{game.category}</p>
            <button
                onClick={() => alert(`Memainkan ${game.title}...`)}
                className="w-full mt-2 bg-primary hover:bg-primary-focus text-white text-sm font-semibold py-1.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
                <PlayCircleIcon className="w-5 h-5"/>
                Mainkan
            </button>
        </div>
    </div>
);

const GamePage: React.FC<GamePageProps> = ({ setActivePage }) => {
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
            <PuzzlePieceIcon className="w-8 h-8 text-primary dark:text-gold-light" />
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">
              Game Center
            </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-5">
        {/* Featured Game */}
        <div className="relative rounded-xl shadow-lg overflow-hidden h-56 flex items-end p-6 text-white bg-black/30">
            <img src={mockFeaturedGame.imageUrl} alt={mockFeaturedGame.title} className="absolute inset-0 w-full h-full object-cover -z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent -z-10"></div>
            <div>
                <h2 className="text-2xl font-bold">{mockFeaturedGame.title}</h2>
                <p className="text-sm max-w-sm mb-4">{mockFeaturedGame.description}</p>
                <button
                    onClick={() => alert('Memainkan game unggulan...')}
                    className="bg-primary hover:bg-primary-focus text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
                >
                    <PlayCircleIcon className="w-5 h-5"/>
                    Mainkan Sekarang
                </button>
            </div>
        </div>

        {/* Community & Competition */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Leaderboard */}
          <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-4">
            <h3 className="font-bold text-lg text-text-primary dark:text-dark-text-primary flex items-center gap-2 mb-3">
                <TrophyIcon className="w-6 h-6 text-yellow-500" />
                Papan Peringkat
            </h3>
            <ul className="space-y-2">
                {mockLeaderboard.map((player, index) => (
                    <li key={player.id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <span className="font-bold text-lg text-text-secondary dark:text-dark-text-secondary w-5">#{index+1}</span>
                        <img src={player.avatarUrl} alt={player.name} className="w-8 h-8 rounded-full"/>
                        <p className="flex-grow font-semibold text-sm text-text-primary dark:text-dark-text-primary">{player.name}</p>
                        <p className="font-bold text-sm text-primary dark:text-gold-light">{player.score} Poin</p>
                    </li>
                ))}
            </ul>
            <button className="w-full mt-3 text-sm font-semibold text-primary dark:text-gold-light hover:underline">Lihat Semua Peringkat</button>
          </div>
          {/* Challenges & Rewards */}
          <div className="space-y-4">
             <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-4 flex items-center gap-4">
                <div className="bg-red-100 dark:bg-red-900/50 p-3 rounded-full"><FireIcon className="w-6 h-6 text-red-500" /></div>
                <div>
                    <h4 className="font-bold text-text-primary dark:text-dark-text-primary">Tantangan Harian</h4>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Selesaikan untuk dapat 200 Poin!</p>
                </div>
                <button className="ml-auto bg-red-500 hover:bg-red-600 text-white font-semibold text-sm px-4 py-2 rounded-lg">Mulai</button>
             </div>
             <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-4 flex items-center gap-4">
                <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full"><GiftIcon className="w-6 h-6 text-green-500" /></div>
                <div>
                    <h4 className="font-bold text-text-primary dark:text-dark-text-primary">Poin Anda: 5,210</h4>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Tukarkan dengan hadiah menarik.</p>
                </div>
                <button className="ml-auto bg-green-500 hover:bg-green-600 text-white font-semibold text-sm px-4 py-2 rounded-lg">Tukar</button>
             </div>
          </div>
        </div>

        {/* Game Collection */}
        <div>
            <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary mb-4">Koleksi Game</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mockGames.map(game => (
                    <GameCard key={game.id} game={game}/>
                ))}
            </div>
        </div>

        {/* Social */}
        <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6 text-center">
            <UserGroupIcon className="w-10 h-10 text-primary dark:text-gold-light mx-auto mb-2"/>
            <h3 className="font-bold text-lg text-text-primary dark:text-dark-text-primary">Main Bareng Teman Lebih Seru!</h3>
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary max-w-md mx-auto my-2">Undang temanmu untuk bergabung, bersaing di papan peringkat, dan selesaikan tantangan bersama.</p>
            <button className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">Undang Teman</button>
        </div>
      </div>
    </div>
  );
};

export default GamePage;