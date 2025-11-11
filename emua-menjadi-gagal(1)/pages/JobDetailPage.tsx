import React, { useState, useEffect } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    BriefcaseIcon as BriefcaseIconSolid, 
    MapPinIcon as MapPinIconSolid, 
    TagIcon as TagIconSolid, 
    BanknotesIcon as BanknotesIconSolid, 
    PaperAirplaneIcon as PaperAirplaneIconSolid, 
    XMarkIcon as XMarkIconSolid 
} from '@heroicons/react/24/solid';
import { Job, User } from '../types.ts';
import { getJobById } from '../services/mockData.ts';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const BriefcaseIcon = (BriefcaseIconSolid as any).default || BriefcaseIconSolid;
const MapPinIcon = (MapPinIconSolid as any).default || MapPinIconSolid;
const TagIcon = (TagIconSolid as any).default || TagIconSolid;
const BanknotesIcon = (BanknotesIconSolid as any).default || BanknotesIconSolid;
const PaperAirplaneIcon = (PaperAirplaneIconSolid as any).default || PaperAirplaneIconSolid;
const XMarkIcon = (XMarkIconSolid as any).default || XMarkIconSolid;


interface JobDetailPageProps {
    jobId: number;
    currentUser: User;
    setActivePage: (page: string) => void;
    onApplyForJob: (jobTitle: string) => void;
}

const JobApplicationModal: React.FC<{ job: Job, user: User, onClose: () => void, onSubmit: (jobTitle: string) => void }> = ({ job, user, onClose, onSubmit }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(job.title);
        onClose();
    };

    return (
         <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-2xl p-6 w-full max-w-lg relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-slate-400"><XMarkIcon className="w-6 h-6" /></button>
                <h2 className="text-xl font-bold mb-2">Lamar Posisi: {job.title}</h2>
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-4">di {job.company}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Nama Lengkap</label>
                        <input type="text" value={user.name} readOnly className="w-full p-2 border rounded-md bg-slate-100 dark:bg-slate-700" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input type="email" value={user.email || ''} readOnly className="w-full p-2 border rounded-md bg-slate-100 dark:bg-slate-700" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Surat Lamaran (Opsional)</label>
                        <textarea placeholder="Tulis pesan singkat untuk HRD..." rows={4} className="w-full p-2 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600"></textarea>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 rounded-md">Batal</button>
                        <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md"><PaperAirplaneIcon className="w-5 h-5"/> Kirim Lamaran</button>
                    </div>
                </form>
            </div>
         </div>
    );
};


const JobDetailPage: React.FC<JobDetailPageProps> = ({ jobId, currentUser, setActivePage, onApplyForJob }) => {
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [isApplying, setIsApplying] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            setLoading(true);
            const data = await getJobById(jobId);
            setJob(data || null);
            setLoading(false);
        };
        fetchJob();
    }, [jobId]);

    if (loading) {
        return <div className="flex justify-center items-center h-full"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
    }

    if (!job) {
        return <div className="text-center">Lowongan pekerjaan tidak ditemukan.</div>;
    }

    const DetailSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
        <div>
            <h3 className="font-bold text-lg text-text-primary dark:text-dark-text-primary mb-2 border-b-2 border-primary/20 pb-1">{title}</h3>
            {children}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
             {isApplying && <JobApplicationModal job={job} user={currentUser} onClose={() => setIsApplying(false)} onSubmit={onApplyForJob} />}
            {/* Header */}
            <div className="flex items-center mb-6">
                <button onClick={() => setActivePage('Loker')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-4" aria-label="Kembali ke Info Loker">
                    <ArrowLeftIcon className="w-6 h-6 text-text-primary dark:text-dark-text-primary" />
                </button>
            </div>

            <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6">
                <div className="flex flex-col sm:flex-row items-start gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                    <img src={job.logo} alt={`${job.company} logo`} className="w-16 h-16 rounded-lg flex-shrink-0" />
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">{job.title}</h1>
                        <p className="text-lg font-medium text-text-secondary dark:text-dark-text-secondary">{job.company}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-secondary dark:text-dark-text-secondary mt-2">
                            <div className="flex items-center gap-1.5"><MapPinIcon className="w-4 h-4"/> {job.location}</div>
                            <div className="flex items-center gap-1.5"><TagIcon className="w-4 h-4"/> {job.type}</div>
                            <div className="flex items-center gap-1.5"><BanknotesIcon className="w-4 h-4"/> {job.salary}</div>
                        </div>
                    </div>
                </div>

                <div className="py-6 space-y-6">
                    <DetailSection title="Deskripsi Pekerjaan">
                        <p className="text-sm text-text-secondary dark:text-dark-text-secondary leading-relaxed">{job.description}</p>
                    </DetailSection>

                    <DetailSection title="Tanggung Jawab">
                        <ul className="list-disc pl-5 space-y-1 text-sm text-text-secondary dark:text-dark-text-secondary">
                            {job.responsibilities.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    </DetailSection>

                    <DetailSection title="Persyaratan">
                         <ul className="list-disc pl-5 space-y-1 text-sm text-text-secondary dark:text-dark-text-secondary">
                            {job.requirements.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    </DetailSection>
                </div>

                <button
                    onClick={() => setIsApplying(true)}
                    className="w-full bg-gradient-to-br from-gold-light to-gold-dark text-white font-bold py-3 px-8 rounded-lg transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
                >
                    <BriefcaseIcon className="w-5 h-5"/>
                    Lamar Sekarang
                </button>
            </div>
        </div>
    );
};

export default JobDetailPage;