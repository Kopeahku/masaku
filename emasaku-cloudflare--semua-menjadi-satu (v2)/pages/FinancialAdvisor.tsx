import React, { useState } from 'react';
// Fix: Add .ts extension to the import path
import { User, Transaction } from '../types.ts';
// Fix: Add .ts extension to the import path
import { getFinancialAdvice } from '../services/geminiService.ts';
import ReactMarkdown from 'react-markdown';
// Fix: Add guard for heroicons
import { PaperAirplaneIcon as PaperAirplaneIconSolid } from '@heroicons/react/24/solid';

// Fix: Add guard for heroicons
const PaperAirplaneIcon = (PaperAirplaneIconSolid as any).default || PaperAirplaneIconSolid;


interface FinancialAdvisorProps {
  user: User;
  getTransactionData: () => Promise<Transaction[]>;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const FinancialAdvisor: React.FC<FinancialAdvisorProps> = ({ user, getTransactionData }) => {
  const [prompt, setPrompt] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    "Apakah pola iuran saya sudah konsisten?",
  ];

  return (
    <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-lg p-4 md:p-6 flex flex-col h-full max-w-4xl mx-auto">
      <div className="text-center mb-4 border-b pb-4 border-slate-200 dark:border-slate-700">
        <h2 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-light to-gold-dark">EmaSaku AI Advisor</h2>
        <p className="text-text-secondary dark:text-dark-text-secondary text-sm md:text-base">Tanyakan apa saja tentang data keuangan Anda</p>
      </div>

      <div className="flex-grow overflow-y-auto pr-2 space-y-4">
        {conversation.length === 0 && (
          <div className="text-center text-text-secondary dark:text-dark-text-secondary p-8">
            <h3 className="font-semibold text-lg mb-2 text-text-primary dark:text-dark-text-primary">Contoh Pertanyaan:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {examplePrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(p)}
                  className="bg-background dark:bg-dark-background hover:bg-slate-100 dark:hover:bg-slate-800 text-left text-sm p-3 rounded-lg transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {conversation.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
             {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">AI</div>}
            <div className={`p-3 rounded-lg max-w-lg ${msg.sender === 'user' ? 'bg-gradient-to-r from-gold-light to-gold-dark text-white' : 'bg-slate-100 dark:bg-slate-700'}`}>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
            {msg.sender === 'user' && <img src={user.avatarUrl} alt="user" className="w-8 h-8 rounded-full flex-shrink-0" />}
          </div>
        ))}
        {isLoading && (
           <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">AI</div>
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

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ketik pertanyaan Anda di sini..."
          className="flex-grow p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition bg-white dark:bg-slate-800 dark:border-slate-600 dark:text-white"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="bg-gradient-to-r from-gold-light to-gold-dark text-white p-3 rounded-lg disabled:bg-slate-300 dark:disabled:bg-slate-600 hover:opacity-90 transition-opacity flex items-center justify-center w-12 h-12"
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

export default FinancialAdvisor;