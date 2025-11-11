import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    BriefcaseIcon as BriefcaseIconSolid, 
    MagnifyingGlassIcon as MagnifyingGlassIconSolid, 
    MapPinIcon as MapPinIconSolid, 
    TagIcon as TagIconSolid, 
    BanknotesIcon as BanknotesIconSolid, 
    XMarkIcon as XMarkIconSolid, 
    PaperAirplaneIcon as PaperAirplaneIconSolid 
} from '@heroicons/react/24/solid';
import { Job, User } from '../types.ts';
import { getJobs } from '../services/mockData.ts';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const BriefcaseIcon = (BriefcaseIconSolid as any).default || BriefcaseIconSolid;
const MagnifyingGlassIcon = (MagnifyingGlassIconSolid as any).default || MagnifyingGlassIconSolid;
const MapPinIcon = (MapPinIconSolid as any).default || MapPinIconSolid;
const TagIcon = (TagIconSolid as any).default || TagIconSolid;
const BanknotesIcon = (BanknotesIconSolid as any).default || BanknotesIconSolid;
const XMarkIcon = (XMarkIconSolid as any).default || XMarkIconSolid;
const PaperAirplaneIcon = (PaperAirplaneIconSolid as any).default || PaperAirplaneIconSolid;


interface LokerPageProps {
  setActivePage: (page: string) => void;
  currentUser: User;
  onApplyForJob: (jobTitle: string) => void;
  onViewJobDetail: (jobId: number) => void;
}

const JobCard: React.FC<{ job: Job, onViewDetail: () => void, onApply: () => void }> = ({ job, onViewDetail, onApply }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, { threshold: 0.1 });

        const currentRef = cardRef.current;
        if (currentRef) observer.observe(currentRef);
        return () => { if (currentRef) observer.unobserve(currentRef); };
    }, []);

    return (
        <div ref={cardRef} className={`job-card ${isVisible ? 'is-visible' : ''} bg-surface dark:bg-dark-surface rounded-xl shadow-md p-4 transition-all hover:shadow-lg hover:ring-2 hover:ring-primary/50`}>
            <div className="flex flex-col sm:flex-row items-start gap-4">
                <img src={job.logo} alt={`${job.company} logo`} className="w-12 h-12 rounded-lg flex-shrink-0" />
                <div className="flex-grow">
                    <h3 className="font-bold text-lg text-text-primary dark:text-dark-text-primary">{job.title}</h3>
                    <p className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary">{job.company}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary dark:text-dark-text-secondary mt-2">
                        <div className="flex items-center gap-1"><MapPinIcon className="w-3.5 h-3.5"/> {job.location}</div>
                        <div className="flex items-center gap-1"><TagIcon className="w-3.5 h-3.5"/> {job.type}</div>
                        <div className="flex items-center gap-1"><BanknotesIcon className="w-3.5 h-3.5"/> {job.salary}</div>
                    </div>
                </div>
                <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                    <button onClick={onApply} className="w-full sm:w-auto px-4 py-2 bg-primary hover:bg-primary-focus text-white text-sm font-semibold rounded-lg transition-colors">
                        Lamar Sekarang
                    </button>
                    <button onClick={onViewDetail} className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-text-primary dark:text-dark-text-primary text-sm font-semibold rounded-lg transition-colors">
                        Lihat Detail
                    </button>
                </div>
            </div>
        </div>
    );
};

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

const LokerPage: React.FC<LokerPageProps> = ({ setActivePage, currentUser, onApplyForJob, onViewJobDetail }) => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('Semua Lokasi');
    const [typeFilter, setTypeFilter] = useState('Semua Tipe');
    const [applyingJob, setApplyingJob] = useState<Job | null>(null);

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            const data = await getJobs();
            setJobs(data);
            setLoading(false);
        };
        fetchJobs();
    }, []);
    
    const { filteredJobs, locations, types } = useMemo(() => {
        const locations = ['Semua Lokasi', ...new Set(jobs.map(j => j.location.split(',')[0]))];
        const types = ['Semua Tipe', ...new Set(jobs.map(j => j.type))];

        const filtered = jobs.filter(job => 
            (job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.company.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (locationFilter === 'Semua Lokasi' || job.location.startsWith(locationFilter)) &&
            (typeFilter === 'Semua Tipe' || job.type === typeFilter)
        );

        return { filteredJobs: filtered, locations, types };
    }, [jobs, searchTerm, locationFilter, typeFilter]);


  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {applyingJob && <JobApplicationModal job={applyingJob} user={currentUser} onClose={() => setApplyingJob(null)} onSubmit={onApplyForJob} />}
      {/* Header */}
      <div className="flex items-center mb-6">
        <button onClick={() => setActivePage('Dashboard')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-4" aria-label="Kembali ke Dasbor">
          <ArrowLeftIcon className="w-6 h-6 text-text-primary dark:text-dark-text-primary" />
        </button>
        <div className="flex items-center gap-3">
          <BriefcaseIcon className="w-8 h-8 text-primary dark:text-gold-light" />
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">Info Lowongan Kerja</h1>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative lg:col-span-2">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-dark-text-secondary" />
            <input 
              type="text" 
              placeholder="Cari jabatan atau perusahaan..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-background dark:bg-dark-background focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <div>
              <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-background dark:bg-dark-background focus:ring-2 focus:ring-primary focus:outline-none appearance-none bg-no-repeat bg-right" style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em'}}>
                {locations.map(loc => <option key={loc}>{loc}</option>)}
              </select>
          </div>
          <div>
              <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-background dark:bg-dark-background focus:ring-2 focus:ring-primary focus:outline-none appearance-none bg-no-repeat bg-right" style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em'}}>
                {types.map(type => <option key={type}>{type}</option>)}
              </select>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      {loading ? (
        <div className="text-center p-8"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div></div>
      ) : (
        <div className="space-y-3">
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
                <JobCard key={job.id} job={job} onViewDetail={() => onViewJobDetail(job.id)} onApply={() => setApplyingJob(job)} />
            ))
          ) : (
            <p className="text-center text-text-secondary py-8">Tidak ada lowongan yang sesuai dengan kriteria Anda.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LokerPage;
