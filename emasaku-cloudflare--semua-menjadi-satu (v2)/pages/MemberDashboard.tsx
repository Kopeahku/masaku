import React, { useState, useEffect } from 'react';
import type { ElementType } from 'react';
import { User, Transaction, TransactionType, SavingsGoal, UserRole, TransactionStatus } from '../types.ts';
import { getSavingsGoalForUser, updateSavingsGoalForUser } from '../services/mockData.ts';
import TransactionList from '../components/dashboard/RecentTransactions.tsx';
import SavingsChart from '../components/dashboard/SavingsChart.tsx';
import TotalBalanceCard from '../components/dashboard/TotalBalanceCard.tsx';
import EditGoalModal from '../components/dashboard/EditGoalModal.tsx';
import { dashboardFeatures, DashboardFeature } from '../features.ts';
import { getFinancialAdvice } from '../services/geminiService.ts';
import ReactMarkdown from 'react-markdown';
// Fix: Add guard for heroicons
import { PaperAirplaneIcon as PaperAirplaneIconSolid } from '@heroicons/react/24/solid';
import { 
    SparklesIcon as SparklesIconOutline,
    UserIcon as UserIconOutline,
    BriefcaseIcon as BriefcaseIconOutline,
    XMarkIcon as XMarkIconOutline,
    InformationCircleIcon as InformationCircleIconOutline,
    HeartIcon as HeartIconOutline
} from '@heroicons/react/24/outline';

// Fix: Add guard for heroicons
const PaperAirplaneIcon = (PaperAirplaneIconSolid as any).default || PaperAirplaneIconSolid;
const SparklesIcon = (SparklesIconOutline as any).default || SparklesIconOutline;
const UserIcon = (UserIconOutline as any).default || UserIconOutline;
const BriefcaseIcon = (BriefcaseIconOutline as any).default || BriefcaseIconOutline;
const OutlineXMarkIcon = (XMarkIconOutline as any).default || XMarkIconOutline;
const InformationCircleIcon = (InformationCircleIconOutline as any).default || InformationCircleIconOutline;
const HeartIcon = (HeartIconOutline as any).default || HeartIconOutline;


interface MemberDashboardProps {
  user: User;
  transactions: Transaction[];
  theme: 'light' | 'dark';
  setActivePage: (page: string) => void;
  featureVisibility: Record<string, boolean>;
  onShowComingSoon: (featureName: string) => void;
  getTransactionData: () => Promise<Transaction[]>;
  setInitialWithdrawalTab: (tab: 'bank' | 'ewallet' | 'retail') => void;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const EmbeddedFinancialAdvisor: React.FC<{ user: User; getTransactionData: () => Promise<Transaction[]>; }> = ({ user, getTransactionData }) => {
    const [prompt, setPrompt] = useState('');
    const [conversation, setConversation] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
    }, [conversation]);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || isLoading) return;

        const userMessage: Message = { sender: 'user', text: prompt };
        setConversation(prev => [...prev, userMessage]);
        setIsLoading(true);
        setPrompt('');

        try {
            const transactions = await getTransactionData();
            const aiResponseText = await getFinancialAdvice(prompt, transactions);
            const aiMessage: Message = { sender: 'ai', text: aiResponseText };
            setConversation(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage: Message = { sender: 'ai', text: 'Maaf, terjadi kesalahan. Coba lagi nanti.' };
            setConversation(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const examplePrompts = [
        "Ringkas pengeluaranku bulan ini.",
        "Beri saya saran untuk meningkatkan tabungan.",
        "Analisis tren donasi saya.",
    ];

    return (
        <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-4 flex flex-col h-full border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-3 px-2">
                <SparklesIcon className="w-6 h-6 text-primary dark:text-gold-light" />
                <h3 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">EmaSaku AI Advisor</h3>
            </div>
            
            <div ref={chatContainerRef} className="flex-grow overflow-y-auto pr-2 space-y-4 h-48 md:h-auto">
                 {conversation.length === 0 && (
                    <div className="text-center text-text-secondary dark:text-dark-text-secondary p-4 h-full flex flex-col justify-center">
                        <h3 className="font-semibold text-base mb-2 text-text-primary dark:text-dark-text-primary">Contoh Pertanyaan:</h3>
                        <div className="grid grid-cols-1 gap-2">
                            {examplePrompts.map((p, i) => (
                                <button
                                key={i}
                                onClick={() => setPrompt(p)}
                                className="bg-background dark:bg-dark-background hover:bg-slate-100 dark:hover:bg-slate-800 text-left text-sm p-2 rounded-lg transition-colors"
                                >
                                {p}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {conversation.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                        {msg.sender === 'ai' && <div className="w-7 h-7 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-1">AI</div>}
                        <div className={`p-2 px-3 rounded-lg max-w-sm ${msg.sender === 'user' ? 'bg-gradient-to-r from-gold-light to-gold-dark text-white' : 'bg-slate-100 dark:bg-slate-700'}`}>
                            <div className="prose prose-sm max-w-none dark:prose-invert">
                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                            </div>
                        </div>
                        {msg.sender === 'user' && <img src={user.avatarUrl} alt="user" className="w-7 h-7 rounded-full flex-shrink-0 mt-1" />}
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex items-start gap-2">
                        <div className="w-7 h-7 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-1">AI</div>
                        <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-700">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
             <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Tanya AI tentang keuanganmu..."
                    className="flex-grow p-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition bg-white dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="bg-primary hover:bg-primary-focus text-white p-2.5 rounded-lg disabled:bg-slate-300 dark:disabled:bg-slate-600 transition-colors flex items-center justify-center w-11 h-11"
                >
                    {isLoading ? 
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> :
                        <PaperAirplaneIcon className="w-5 h-5"/>
                    }
                </button>
            </form>
        </div>
    );
};

const ActionButton: React.FC<{ 
    icon: ElementType; 
    label: string; 
    description: string;
    onClick: () => void; 
    'aria-label': string;
    bgClass: string;
    iconClass: string;
}> = ({ icon: Icon, label, description, onClick, 'aria-label': ariaLabel, bgClass, iconClass }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center text-center space-y-1 text-text-secondary dark:text-dark-text-secondary hover:text-gold-DEFAULT dark:hover:text-gold-light transition-colors group focus:outline-none focus:ring-2 focus:ring-gold-DEFAULT rounded-lg p-1"
        aria-label={ariaLabel}
    >
        <div className={`p-3 rounded-full transition-colors ${bgClass}`}>
            <Icon className={`w-6 h-6 ${iconClass}`} />
        </div>
        <div>
            <span className="text-xs font-semibold text-text-primary dark:text-dark-text-primary">{label}</span>
            <p className="text-[10px] leading-tight text-slate-500 dark:text-slate-400">{description}</p>
        </div>
    </button>
);

const FeaturePlaceholder: React.FC<{ icon: ElementType; label: string; onClick: () => void; }> = ({ icon: Icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="relative flex flex-col items-center text-center space-y-1 text-slate-400 dark:text-slate-500 p-1 group hover:text-slate-500 dark:hover:text-slate-400 transition-colors"
        title={`Fitur ${label} akan segera hadir!`}
    >
        <div className="absolute top-0 right-0 text-[8px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-full z-10 group-hover:bg-slate-300 dark:group-hover:bg-slate-600">
            Segera Hadir
        </div>
        <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <span className="text-xs font-semibold">{label}</span>
            <p className="text-[10px] leading-tight text-slate-500 dark:text-slate-500">Fitur sedang disiapkan</p>
        </div>
    </button>
);

const MemberDashboard: React.FC<MemberDashboardProps> = ({ user, transactions, theme, setActivePage, featureVisibility, onShowComingSoon, getTransactionData, setInitialWithdrawalTab }) => {
  const [loading, setLoading] = useState(true);
  const [savingsGoal, setSavingsGoal] = useState<SavingsGoal | null>(null);
  const [isGoalModalOpen, setGoalModalOpen] = useState(false);
  const [isBalanceVisible, setBalanceVisible] = useState(true);
  const [isOjekModalOpen, setOjekModalOpen] = useState(false);
  const [isLaundryModalOpen, setLaundryModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const goalData = await getSavingsGoalForUser(user.id);
      setSavingsGoal(goalData);
      setLoading(false);
    };
    fetchData();
  }, [user.id]);
  
  const handleSaveGoal = async (goalData: { name: string; targetAmount: number; targetDate?: string }) => {
    const updatedGoal = await updateSavingsGoalForUser(user.id, goalData);
    setSavingsGoal(updatedGoal);
    setGoalModalOpen(false);
  };
  
  const toggleBalanceVisibility = () => {
    setBalanceVisible(prev => !prev);
  };

  const handleFeatureClick = (feature: DashboardFeature) => {
    if (feature.page === 'Ojek') {
      setOjekModalOpen(true);
    } else if (feature.page === 'Laundry') {
      setLaundryModalOpen(true);
    } else {
      if (feature.id === 'tarikTunai') {
        setInitialWithdrawalTab('retail');
      } else {
        // Default for 'Tarik Saldo' or anything else
        setInitialWithdrawalTab('bank');
      }
      setActivePage(feature.page);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="w-8 h-8 border-4 border-gold-DEFAULT border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalSavings = transactions
    .filter(t => (t.type === TransactionType.SAVINGS || t.type === TransactionType.TOP_UP || t.type === TransactionType.WASTE_DEPOSIT) && t.status === TransactionStatus.COMPLETED)
    .reduce((acc, t) => acc + t.amount, 0);

  const totalWithdrawals = transactions
    .filter(t => t.type === TransactionType.WITHDRAWAL && t.status === TransactionStatus.COMPLETED)
    .reduce((acc, t) => acc + t.amount, 0);
  
  const totalAdjustments = transactions
    .filter(t => t.type === TransactionType.BALANCE_ADJUSTMENT && t.status === TransactionStatus.COMPLETED)
    .reduce((acc, t) => acc + t.amount, 0);

  const currentBalance = totalSavings - totalWithdrawals + totalAdjustments;

  const savingsData = transactions
        .filter(t => 
            (t.type === TransactionType.SAVINGS || 
             t.type === TransactionType.TOP_UP || 
             t.type === TransactionType.WASTE_DEPOSIT || 
             t.type === TransactionType.BALANCE_ADJUSTMENT ||
             t.type === TransactionType.WITHDRAWAL) &&
            t.status === TransactionStatus.COMPLETED
        )
        .sort((a, b) => new Date(a.date).getTime() - new Date(a.date).getTime())
        .reduce((acc, t) => {
            const last = acc.length > 0 ? acc[acc.length - 1] : { value: 0, name: '' };
            const amountChange = t.type === TransactionType.WITHDRAWAL ? -t.amount : t.amount;
            const newTotal = last.value + amountChange;
            acc.push({ name: t.date, value: newTotal });
            return acc;
        }, [] as { name: string; value: number }[])
        .slice(-30);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-1 space-y-3">
          <TotalBalanceCard 
            balance={currentBalance} 
            userName={user.name}
            savingsGoal={savingsGoal}
            isBalanceVisible={isBalanceVisible}
            onToggleVisibility={toggleBalanceVisibility}
            onEditGoal={() => setGoalModalOpen(true)}
          />

          {(user.role === UserRole.ADMIN || user.role === UserRole.DEVELOPER) && (
              <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-4 animate-fade-in">
                  <h3 className="text-lg font-bold mb-3 text-text-primary dark:text-dark-text-primary">Panel Admin</h3>
                  <button
                      onClick={() => setActivePage('Manage Donations')}
                      className="flex w-full items-center text-left p-3 rounded-lg bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                      <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-full">
                          <HeartIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="ml-4">
                          <span className="text-sm font-semibold text-text-primary dark:text-dark-text-primary">Kelola Donasi</span>
                          <p className="text-xs text-text-secondary dark:text-dark-text-secondary">Tambah, edit, atau hapus program</p>
                      </div>
                  </button>
              </div>
          )}

          <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-4">
              <div className="grid grid-cols-4 gap-y-4 gap-x-2">
                {dashboardFeatures.map(feature => {
                    const isEnabled = featureVisibility[feature.id];
                    const isAdminOrDev = user.role === UserRole.ADMIN || user.role === UserRole.DEVELOPER;
                    
                    // Robustly handle cases where the icon might be a module object
                    const IconComponent = (feature.icon as any).default || feature.icon;

                    if (isEnabled) {
                        // Show for everyone if enabled
                        return (
                            <ActionButton
                              key={feature.id}
                              icon={IconComponent}
                              label={feature.label}
                              description={feature.description}
                              onClick={() => handleFeatureClick(feature)}
                              aria-label={feature.label}
                              bgClass={feature.bgClass}
                              iconClass={feature.iconClass}
                            />
                        );
                    }
                    
                    // At this point, feature is disabled
                    
                    if (isAdminOrDev) {
                        // Show placeholder for admin/dev if disabled
                        return (
                            <FeaturePlaceholder 
                                key={feature.id}
                                icon={IconComponent}
                                label={feature.label}
                                onClick={() => onShowComingSoon(feature.label)}
                            />
                        );
                    }
            
                    // Hide from members if disabled
                    return null;
                })}
              </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <SavingsChart data={savingsData} title="Pertumbuhan Saldo" theme={theme}/>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2">
            <EmbeddedFinancialAdvisor user={user} getTransactionData={getTransactionData} />
        </div>
        <div className="lg:col-span-1">
            <TransactionList 
              transactions={transactions} 
              title="Aktivitas Terbaru"
            />
        </div>
      </div>
      
      {isGoalModalOpen && (
        <EditGoalModal 
            goal={savingsGoal}
            onClose={() => setGoalModalOpen(false)}
            onSave={handleSaveGoal}
        />
      )}

      {isOjekModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-2xl p-6 w-full max-w-sm relative text-center">
            <button onClick={() => setOjekModalOpen(false)} className="absolute top-3 right-3 text-slate-400" aria-label="Tutup"><OutlineXMarkIcon className="w-6 h-6" /></button>
            <h2 className="text-xl font-bold mb-6">Pilih Peran Anda</h2>
            <div className="flex justify-around gap-4">
                <button onClick={() => { setActivePage('Ojek'); setOjekModalOpen(false); }} className="flex flex-col items-center gap-3 p-6 rounded-lg bg-slate-100 dark:bg-slate-700/50 w-1/2"><UserIcon className="w-12 h-12 text-primary dark:text-gold-light"/><span className="font-bold">Penumpang</span></button>
                <button onClick={() => { setActivePage('Pengemudi'); setOjekModalOpen(false); }} className="flex flex-col items-center gap-3 p-6 rounded-lg bg-slate-100 dark:bg-slate-700/50 w-1/2"><BriefcaseIcon className="w-12 h-12 text-primary dark:text-gold-light"/><span className="font-bold">Pengemudi</span></button>
            </div>
          </div>
        </div>
      )}
      
      {isLaundryModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-2xl p-6 w-full max-w-md relative">
            <button onClick={() => setLaundryModalOpen(false)} className="absolute top-3 right-3 text-slate-400" aria-label="Tutup"><OutlineXMarkIcon className="w-6 h-6" /></button>
            <h2 className="text-xl font-bold text-center mb-6">Pilih Layanan Laundry</h2>
            <div className="space-y-3">
              {(() => {
                  const feature = dashboardFeatures.find(f => f.id === 'laundry');
                  if (!feature) return null;
                  // Robustly handle cases where the icon might be a module object
                  const LaundryIcon = (feature.icon as any).default || feature.icon;
                  return (
                      <button onClick={() => { setActivePage('Laundry'); setLaundryModalOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-lg bg-slate-100 dark:bg-slate-700/50 text-left">
                          <div className="p-2 bg-violet-100 dark:bg-violet-900/50 rounded-lg">
                              <LaundryIcon className="w-8 h-8 text-violet-600 dark:text-violet-400" />
                          </div>
                          <div><span className="font-bold">Mencuci</span><p className="text-xs">Pesan layanan laundry antar-jemput untuk pakaian Anda.</p></div>
                      </button>
                  );
              })()}
              {(() => {
                  const feature = dashboardFeatures.find(f => f.id === 'laundryPartnerDashboard');
                  if (!feature) return null;
                  const PartnerDashboardIcon = (feature.icon as any).default || feature.icon;
                  return (
                      <button onClick={() => { setActivePage('Laundry Partner Dashboard'); setLaundryModalOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-lg bg-slate-100 dark:bg-slate-700/50 text-left">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                              <PartnerDashboardIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div><span className="font-bold">Mitra Cuci</span><p className="text-xs">Masuk ke dasbor Anda untuk mengelola pesanan.</p></div>
                      </button>
                  );
              })()}
              {(() => {
                  const feature = dashboardFeatures.find(f => f.id === 'laundryPartner');
                  if (!feature) return null;
                  const PartnerIcon = (feature.icon as any).default || feature.icon;
                  return (
                      <button onClick={() => { setActivePage('Laundry Partner'); setLaundryModalOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-lg bg-slate-100 dark:bg-slate-700/50 text-left">
                          <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                              <PartnerIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                          </div>
                          <div><span className="font-bold">Daftar Mitra Cuci</span><p className="text-xs">Gabung dan kembangkan usaha laundry Anda bersama kami.</p></div>
                      </button>
                  );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberDashboard;