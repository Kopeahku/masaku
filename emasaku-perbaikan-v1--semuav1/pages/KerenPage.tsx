import React, { useState } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    SparklesIcon as SparklesIconSolid, 
    ArrowPathIcon as ArrowPathIconSolid 
} from '@heroicons/react/24/solid';
import { generateDreamImage } from '../services/geminiService.ts';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const SparklesIcon = (SparklesIconSolid as any).default || SparklesIconSolid;
const ArrowPathIcon = (ArrowPathIconSolid as any).default || ArrowPathIconSolid;

interface DreamWeaverPageProps {
  setActivePage: (page: string) => void;
}

const DreamWeaverPage: React.FC<DreamWeaverPageProps> = ({ setActivePage }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const imageBase64 = await generateDreamImage(prompt);
            setGeneratedImage(imageBase64);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan tidak diketahui.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setPrompt('');
        setGeneratedImage(null);
        setError(null);
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="text-center p-8 animate-fade-in">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h3 className="font-semibold text-lg text-text-primary dark:text-dark-text-primary">Sedang melukis impianmu...</h3>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-1">AI kami sedang bekerja, mohon tunggu beberapa saat.</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center p-8 animate-fade-in">
                     <p className="text-red-500 mb-4">{error}</p>
                    <button onClick={handleReset} className="bg-gradient-to-br from-gold-light to-gold-dark text-white hover:opacity-90 font-bold py-2 px-6 rounded-lg transition-colors">
                        Coba Lagi
                    </button>
                </div>
            )
        }

        if (generatedImage) {
            return (
                <div className="text-center animate-fade-in">
                    <img 
                        src={`data:image/png;base64,${generatedImage}`} 
                        alt={prompt}
                        className="rounded-xl shadow-lg w-full aspect-square object-cover"
                    />
                     <button 
                        onClick={handleReset} 
                        className="mt-6 flex items-center gap-2 mx-auto px-6 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-sm font-semibold rounded-lg transition-colors"
                    >
                        <ArrowPathIcon className="w-5 h-5"/>
                        Buat Gambar Lain
                    </button>
                </div>
            );
        }

        return (
             <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-center text-text-secondary dark:text-dark-text-secondary">
                    Apa impian finansialmu? Sebuah rumah baru, mobil idaman, atau liburan keliling dunia? Biarkan AI membantu memvisualisasikannya untukmu!
                </p>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Contoh: Sebuah rumah minimalis modern di tepi danau saat matahari terbenam"
                    className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition bg-white dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                    required
                />
                <button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="w-full bg-gradient-to-r from-gold-light to-gold-dark text-white font-bold py-3 px-8 rounded-lg transition-opacity hover:opacity-90 flex items-center justify-center gap-2 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed"
                >
                    <SparklesIcon className="w-5 h-5" />
                    Wujudkan Impian ✨
                </button>
            </form>
        );
    };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
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
          <SparklesIcon className="w-8 h-8 text-primary dark:text-gold-light" />
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">
            Dream Weaver
          </h1>
        </div>
      </div>

      <div className="bg-surface dark:bg-dark-surface p-6 rounded-xl shadow-md">
        {renderContent()}
      </div>
    </div>
  );
};

export default DreamWeaverPage;