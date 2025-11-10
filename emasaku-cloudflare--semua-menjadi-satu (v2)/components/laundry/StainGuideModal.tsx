import React, { useState, useRef } from 'react';
import { 
    XMarkIcon as XMarkIconSolid, 
    CameraIcon as CameraIconSolid, 
    SparklesIcon as SparklesIconSolid, 
    ArrowPathIcon as ArrowPathIconSolid 
} from '@heroicons/react/24/solid';
import ReactMarkdown from 'react-markdown';
import { getStainAdvice } from '../../services/geminiService.ts';

const XMarkIcon = (XMarkIconSolid as any).default || XMarkIconSolid;
const CameraIcon = (CameraIconSolid as any).default || CameraIconSolid;
const SparklesIcon = (SparklesIconSolid as any).default || SparklesIconSolid;
const ArrowPathIcon = (ArrowPathIconSolid as any).default || ArrowPathIconSolid;


interface StainGuideModalProps {
    onClose: () => void;
}

const StainGuideModal: React.FC<StainGuideModalProps> = ({ onClose }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setAnalysisResult(null); // Reset result when new image is uploaded
                setError(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyse = async () => {
        if (!imagePreview) return;

        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const [metadata, base64Data] = imagePreview.split(',');
            const mimeType = metadata.split(':')[1].split(';')[0];
            
            const result = await getStainAdvice(base64Data, mimeType);
            setAnalysisResult(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Gagal menganalisis gambar.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleReset = () => {
        setImagePreview(null);
        setAnalysisResult(null);
        setError(null);
        setIsLoading(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-2xl p-6 w-full max-w-lg relative flex flex-col max-h-[90vh]">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                    aria-label="Tutup"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3 mb-4">
                    <SparklesIcon className="w-7 h-7 text-primary dark:text-gold-light" />
                    <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">Panduan Noda AI</h2>
                </div>
                
                <div className="flex-grow overflow-y-auto pr-2">
                    {!imagePreview && (
                        <div 
                            className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-center p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <CameraIcon className="w-12 h-12 text-slate-400 mb-2"/>
                            <p className="font-semibold text-text-primary dark:text-dark-text-primary">Unggah Foto Noda</p>
                            <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Klik di sini untuk memilih gambar dari perangkat Anda.</p>
                        </div>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden"/>

                    {imagePreview && (
                         <div className="mb-4">
                            <img src={imagePreview} alt="Preview Noda" className="w-full max-h-64 object-contain rounded-lg bg-slate-100 dark:bg-slate-800"/>
                        </div>
                    )}
                    
                    {isLoading && (
                        <div className="text-center p-8">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="font-semibold text-text-primary dark:text-dark-text-primary">Menganalisis noda...</p>
                            <p className="text-sm text-text-secondary dark:text-dark-text-secondary">AI kami sedang bekerja, mohon tunggu sebentar.</p>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-center">
                            <p className="font-semibold">Terjadi Kesalahan</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {analysisResult && (
                         <div className="prose prose-sm max-w-none dark:prose-invert bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                            <ReactMarkdown>{analysisResult}</ReactMarkdown>
                        </div>
                    )}
                </div>

                <div className="flex-shrink-0 pt-4 mt-4 border-t border-slate-200 dark:border-slate-700 flex items-center gap-3">
                    <button 
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-sm font-semibold rounded-lg transition-colors"
                    >
                        <ArrowPathIcon className="w-5 h-5"/> Reset
                    </button>
                    <button
                        onClick={handleAnalyse}
                        disabled={!imagePreview || isLoading}
                        className="flex-1 bg-gradient-to-br from-gold-light to-gold-dark text-white font-bold py-2.5 rounded-lg transition-opacity hover:opacity-90 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Menganalisis...' : 'Analisis Noda'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StainGuideModal;