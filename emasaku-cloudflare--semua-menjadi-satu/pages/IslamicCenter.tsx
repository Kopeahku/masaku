import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { ElementType } from 'react';
import { 
  ArrowLeftIcon as ArrowLeftIconSolid, 
  BookOpenIcon as BookOpenIconSolid, 
  MagnifyingGlassIcon as MagnifyingGlassIconSolid, 
  XMarkIcon as XMarkIconSolid, 
  PlayCircleIcon as PlayCircleIconSolid, 
  PauseCircleIcon as PauseCircleIconSolid, 
  SpeakerWaveIcon as SpeakerWaveIconSolid, 
  SpeakerXMarkIcon as SpeakerXMarkIconSolid, 
  SunIcon as SunIconSolid, 
  MoonIcon as MoonIconSolid, 
  Cog6ToothIcon as Cog6ToothIconSolid, 
  CheckIcon as CheckIconSolid, 
  ArrowPathIcon as ArrowPathIconSolid, 
  MinusIcon as MinusIconSolid, 
  PlusIcon as PlusIconSolid, 
  MapPinIcon as MapPinIconSolid, 
  BellIcon as BellIconSolid, 
  BellSlashIcon as BellSlashIconSolid, 
  HandRaisedIcon as HandRaisedIconSolid,
  ForwardIcon as ForwardIconSolid, 
  BackwardIcon as BackwardIconSolid, 
  PlayIcon as PlayIconSolid, 
  PauseIcon as PauseIconSolid, 
  QueueListIcon as QueueListIconSolid, 
  ChevronDownIcon as ChevronDownIconSolid, 
  ClockIcon as ClockIconSolid, 
  CalendarDaysIcon as CalendarDaysIconSolid, 
  SparklesIcon as SparklesIconSolid
} from '@heroicons/react/24/solid';
import useLocalStorage from '../hooks/useLocalStorage.ts';
import { formatToRupiah } from '../utils/formatter.ts';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const BookOpenIcon = (BookOpenIconSolid as any).default || BookOpenIconSolid;
const MagnifyingGlassIcon = (MagnifyingGlassIconSolid as any).default || MagnifyingGlassIconSolid;
const XMarkIcon = (XMarkIconSolid as any).default || XMarkIconSolid;
const PlayCircleIcon = (PlayCircleIconSolid as any).default || PlayCircleIconSolid;
const PauseCircleIcon = (PauseCircleIconSolid as any).default || PauseCircleIconSolid;
const SpeakerWaveIcon = (SpeakerWaveIconSolid as any).default || SpeakerWaveIconSolid;
const SpeakerXMarkIcon = (SpeakerXMarkIconSolid as any).default || SpeakerXMarkIconSolid;
const SunIcon = (SunIconSolid as any).default || SunIconSolid;
const MoonIcon = (MoonIconSolid as any).default || MoonIconSolid;
const Cog6ToothIcon = (Cog6ToothIconSolid as any).default || Cog6ToothIconSolid;
const CheckIcon = (CheckIconSolid as any).default || CheckIconSolid;
const ArrowPathIcon = (ArrowPathIconSolid as any).default || ArrowPathIconSolid;
const MinusIcon = (MinusIconSolid as any).default || MinusIconSolid;
const PlusIcon = (PlusIconSolid as any).default || PlusIconSolid;
const MapPinIcon = (MapPinIconSolid as any).default || MapPinIconSolid;
const BellIcon = (BellIconSolid as any).default || BellIconSolid;
const BellSlashIcon = (BellSlashIconSolid as any).default || BellSlashIconSolid;
const HandRaisedIcon = (HandRaisedIconSolid as any).default || HandRaisedIconSolid;
const ForwardIcon = (ForwardIconSolid as any).default || ForwardIconSolid;
const BackwardIcon = (BackwardIconSolid as any).default || BackwardIconSolid;
const PlayIcon = (PlayIconSolid as any).default || PlayIconSolid;
const PauseIcon = (PauseIconSolid as any).default || PauseIconSolid;
const QueueListIcon = (QueueListIconSolid as any).default || QueueListIconSolid;
const ChevronDownIcon = (ChevronDownIconSolid as any).default || ChevronDownIconSolid;
const ClockIcon = (ClockIconSolid as any).default || ClockIconSolid;
const CalendarDaysIcon = (CalendarDaysIconSolid as any).default || CalendarDaysIconSolid;
const SparklesIcon = (SparklesIconSolid as any).default || SparklesIconSolid;

// --- TYPES ---
interface IslamicCenterProps {
  setActivePage: (page: string) => void;
  onPayZakat: (amount: number) => void;
}

interface Surah {
  number: number;
  name: {
    short: string;
    long: string;
    transliteration: {
      id: string;
    };
  };
  revelation: {
    id: string;
  };
  numberOfVerses: number;
}

interface Verse {
  number: {
    inSurah: number;
    inQuran: number; 
  };
  text: {
    arab: string;
    transliteration: {
      en: string; // API uses 'en' for latin script
    };
    tajweed?: {
      html: string;
    }
  };
  translation: {
    id: string;
  };
  audio: {
    primary: string;
  };
  surah?: Surah; // Available in Juz API context
}

interface SurahDetail extends Surah {
  preBismillah: {
    text: {
      arab: string;
    };
  } | null;
  verses: Verse[];
}

interface CurrentPlayingVerse {
  surahNumber: number;
  verseNumberInSurah: number;
  audioUrl: string;
  surahName: string;
  totalVerses: number;
}

interface Doa {
    id: number;
    doa: string;
    arab: string;
    latin: string;
    artinya: string;
    riwayat: string;
}

interface SurahHistoryItem extends Surah {
  lastAccessed: string;
}

interface HijriDateInfo {
  date: string;
  format: string;
  day: string;
  weekday: { en: string; ar: string };
  month: { number: number; en: string; ar: string };
  year: string;
}

interface GregorianDateInfo {
  date: string;
  format: string;
  day: string;
  weekday: { en: string };
  month: { number: number; en: string };
  year: string;
}

interface CalendarDay {
  timings: Record<string, string>;
  date: {
    readable: string;
    timestamp: string;
    hijri: HijriDateInfo;
    gregorian: GregorianDateInfo;
  };
  meta: any;
  holidays?: string[];
}

// --- DATA ---
const KUMPULAN_DOA: Doa[] = [
  {
    id: 1,
    doa: "Doa Sebelum Tidur",
    arab: "بِاسْمِكَ اللهُمَّ أَحْيَا وَأَمُوْتُ",
    latin: "Bismikallaahumma ahyaa wa amuutu.",
    artinya: "Dengan menyebut nama-Mu ya Allah, aku hidup dan aku mati.",
    riwayat: "HR. Bukhari dan Muslim",
  },
  {
    id: 2,
    doa: "Doa Bangun Tidur",
    arab: "اَلْحَمْدُ ِللهِ الَّذِى أَحْيَانَا بَعْدَمَا أَمَاتَنَا وَإِلَيْهِ النُّشُوْرُ",
    latin: "Alhamdu lillahil ladzii ahyaanaa ba'da maa amaa tanaa wa ilaihin nusyuur.",
    artinya: "Segala puji bagi Allah yang telah menghidupkan kami sesudah kami mati (tidur) dan hanya kepada-Nya kami dikembalikan.",
    riwayat: "HR. Bukhari dan Muslim",
  },
  {
    id: 3,
    doa: "Doa Sebelum Makan",
    arab: "اَللّٰهُمَّ بَارِكْ لَنَا فِيْمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّARِ",
    latin: "Allahumma baarik lanaa fiimaa rozaqtanaa wa qinaa 'adzaa ban naar.",
    artinya: "Ya Allah, berkahilah kami dalam rezeki yang telah Engkau berikan kepada kami dan peliharalah kami dari siksa api neraka.",
    riwayat: "HR. Ibnu as-Sunni",
  },
  {
    id: 4,
    doa: "Doa Sesudah Makan",
    arab: "اَلْحَمْدُ ِللهِ الَّذِى أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِيْنَ",
    latin: "Alhamdulillahilladzi ath-amanaa wa saqoonaa wa ja'alanaa minal muslimiin.",
    artinya: "Segala puji bagi Allah yang telah memberi kami makan dan minum, serta menjadikan kami seorang muslim.",
    riwayat: "HR. Abu Daud, Tirmidzi, dan Ibnu Majah",
  },
  {
    id: 5,
    doa: "Doa Masuk Kamar Mandi",
    arab: "اَللّٰهُمَّ اِنِّى اَعُوْذُبِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
    latin: "Allahumma innii a'uudzubika minal khubutsi wal khobaaitsi.",
    artinya: "Ya Allah, aku berlindung kepada-Mu dari godaan setan laki-laki dan setan perempuan.",
    riwayat: "HR. Bukhari dan Muslim",
  },
  {
    id: 6,
    doa: "Doa Keluar Kamar Mandi",
    arab: "غُفْرَانَكَ الْحَمْدُ ِللهِ الَّذِى أَذْهَبَ عَنِّى اْلأَذَى وَعَافَانِى",
    latin: "Ghufraanaka alhamdulillaahil ladzii adzhaba 'annil adzaa wa'aafaanii.",
    artinya: "Dengan mengharap ampunan-Mu, segala puji milik Allah yang telah menghilangkan kotoran dari badanku dan yang telah menyejahterakan.",
    riwayat: "HR. Abu Daud",
  },
];


// --- UTILS ---
const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " tahun lalu";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " bulan lalu";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " hari lalu";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " jam lalu";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " menit lalu";
  return "Baru saja";
};

/*
  CATATAN KEAMANAN: Penggunaan `dangerouslySetInnerHTML` dengan konten dari API eksternal 
  dapat menimbulkan risiko Cross-Site Scripting (XSS). Meskipun sumber API kemungkinan besar 
  terpercaya, praktik terbaik di lingkungan produksi adalah melakukan sanitasi HTML 
  menggunakan library seperti DOMPurify untuk memastikan tidak ada skrip berbahaya yang dieksekusi.
  Implementasi saat ini disederhanakan untuk konteks pengembangan ini.
*/
const renderTajweedText = (htmlText: string) => {
    const sanitized = htmlText.replace(/<f class="([a-z])">/g, '<span class="$1">').replace(/<\/f>/g, '</span>');
    return { __html: sanitized };
};

// --- JADWAL SHOLAT ---
const PrayerTimesCard: React.FC = () => {
    const [times, setTimes] = useState<Record<string, string> | null>(null);
    const [location, setLocation] = useState<string | null>(null);
    const [hijriDate, setHijriDate] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [nextPrayer, setNextPrayer] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());


    const PRAYER_NAMES: { [key: string]: string } = {
        Fajr: 'Subuh',
        Dhuhr: 'Dzuhur',
        Asr: 'Ashar',
        Maghrib: 'Maghrib',
        Isha: 'Isya',
    };

    const fetchTimes = useCallback(async (latitude: number, longitude: number) => {
        setLoading(true);
        setError(null);
        try {
            const geoResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            if (geoResponse.ok) {
                const geoData = await geoResponse.json();
                setLocation(geoData.address.city || geoData.address.town || geoData.address.village || 'Lokasi Anda');
            } else {
                setLocation('Lokasi Anda');
            }
            
            const today = new Date();
            const dateString = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
            const prayerResponse = await fetch(`https://api.aladhan.com/v1/timings/${dateString}?latitude=${latitude}&longitude=${longitude}&method=3`);
            if (!prayerResponse.ok) throw new Error('Gagal memuat jadwal sholat.');
            
            const prayerData = await prayerResponse.json();
            if (prayerData.code !== 200) throw new Error(prayerData.data || 'Gagal memuat data.');

            const relevantTimings = Object.keys(PRAYER_NAMES).reduce((acc, key) => {
                acc[key] = prayerData.data.timings[key];
                return acc;
            }, {} as Record<string, string>);

            setTimes(relevantTimings);

            const hijri = prayerData.data.date.hijri;
            const formattedHijri = `${hijri.day} ${hijri.month.en} ${hijri.year} H`;
            setHijriDate(formattedHijri);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan tidak diketahui.');
        } finally {
            setLoading(false);
        }
    }, []);
    
    const requestLocation = useCallback(() => {
        setError(null);
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchTimes(position.coords.latitude, position.coords.longitude);
            },
            (err) => {
                setError('Izin lokasi ditolak. Aktifkan lokasi untuk melihat jadwal sholat.');
                setLoading(false);
            }
        );
    }, [fetchTimes]);

    useEffect(() => {
        requestLocation();
    }, [requestLocation]);

    useEffect(() => {
        let timeoutId: number;

        const scheduleNextUpdate = () => {
            const now = new Date();
            // Calculate time until the start of the next minute
            const seconds = now.getSeconds();
            const millis = now.getMilliseconds();
            const millisUntilNextMinute = (60 - seconds) * 1000 - millis;

            timeoutId = window.setTimeout(() => {
                setCurrentTime(new Date());
                scheduleNextUpdate(); // Reschedule for the next minute
            }, millisUntilNextMinute);
        };

        scheduleNextUpdate();

        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

    useEffect(() => {
        if (!times) return;

        const now = currentTime;
        const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();
        
        let nextPrayerName: string | null = null;
        let found = false;
        
        const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

        for (const prayer of prayerOrder) {
            const [h, m] = times[prayer].split(':').map(Number);
            const prayerTotalMinutes = h * 60 + m;
            if (prayerTotalMinutes > currentTotalMinutes) {
                nextPrayerName = prayer;
                found = true;
                break;
            }
        }
        
        if (!found) {
            nextPrayerName = 'Fajr';
        }

        setNextPrayer(nextPrayerName);

    }, [times, currentTime]);
    
    const todayFormatted = new Date().toLocaleDateString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center h-48">
                    <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            );
        }
        if (error) {
            return (
                <div className="text-center h-48 flex flex-col justify-center items-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button onClick={requestLocation} className="bg-primary text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-primary-focus">
                        Coba Lagi
                    </button>
                </div>
            );
        }
        if (times) {
            return (
                <div className="space-y-1 mt-4">
                    {Object.entries(PRAYER_NAMES).map(([key, name]) => (
                         <div key={key} className={`flex justify-between items-center py-2.5 px-3 rounded-lg transition-colors ${key === nextPrayer ? 'bg-emerald-100 dark:bg-emerald-900/50' : ''}`}>
                            <span className={`font-semibold ${key === nextPrayer ? 'text-emerald-700 dark:text-emerald-300' : 'text-text-primary dark:text-dark-text-primary'}`}>{name}</span>
                            <span className={`font-bold text-lg font-mono tracking-wider ${key === nextPrayer ? 'text-emerald-800 dark:text-emerald-200' : 'text-text-secondary dark:text-dark-text-secondary'}`}>{times[key]}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    }

    return (
        <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-4 md:p-6 mb-6">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">Jadwal Sholat</h2>
                     <div className="flex items-center gap-1 text-sm text-text-secondary dark:text-dark-text-secondary mt-1">
                        <MapPinIcon className="w-4 h-4" />
                        <span>{location || 'Mencari lokasi...'}</span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-semibold text-text-primary dark:text-dark-text-primary text-sm">{todayFormatted}</p>
                    {hijriDate && <p className="text-xs text-text-secondary dark:text-dark-text-secondary">{hijriDate}</p>}
                </div>
            </div>
            {renderContent()}
        </div>
    );
}

// --- TASBIH MODAL ---
const TasbihModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [count, setCount] = useLocalStorage('tasbih_count', 0);
    const [sessionTotal, setSessionTotal] = useState(0);
    const [target, setTarget] = useLocalStorage('tasbih_target', 33);
    const [soundEnabled, setSoundEnabled] = useLocalStorage('tasbih_sound', true);
    const [vibrateEnabled, setVibrateEnabled] = useLocalStorage('tasbih_vibrate', true);
    const isSystemDark = document.documentElement.classList.contains('dark');

    const [showSettings, setShowSettings] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [showTargetReached, setShowTargetReached] = useState(false);

    const audioCtx = useRef<AudioContext | null>(null);
    const longPressTimeout = useRef<number | null>(null);

    const playSound = (type: 'pop' | 'ding') => {
        if (!soundEnabled || !audioCtx.current) return;
        const oscillator = audioCtx.current.createOscillator();
        const gainNode = audioCtx.current.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.current.destination);

        if (type === 'pop') {
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(150, audioCtx.current.currentTime);
            gainNode.gain.setValueAtTime(0.3, audioCtx.current.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.current.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.current.currentTime + 0.1);
        } else { // ding
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(600, audioCtx.current.currentTime);
            gainNode.gain.setValueAtTime(0.4, audioCtx.current.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioCtx.current.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.current.currentTime + 0.4);
        }
        oscillator.start(audioCtx.current.currentTime);
        oscillator.stop(audioCtx.current.currentTime + 0.4);
    };

    const doVibrate = (duration: number | number[]) => {
        if (vibrateEnabled && navigator.vibrate) navigator.vibrate(duration);
    };
    
    const handleIncrement = (amount: number) => {
        const newCount = count + amount;
        if (newCount % target === 0 && newCount !== 0) {
            setCount(0);
            playSound('ding');
            doVibrate([100, 50, 100]);
            setShowTargetReached(true);
        } else {
            setCount(newCount);
            playSound('pop');
            doVibrate(25);
        }
        setSessionTotal(prev => prev + amount);
    };
    
    const handleMouseDown = () => {
        handleIncrement(1);
        longPressTimeout.current = window.setTimeout(() => {
            handleIncrement(9); // Total 10
        }, 600);
    };

    const handleMouseUp = () => {
        if (longPressTimeout.current) clearTimeout(longPressTimeout.current);
    };
    
    const handleReset = () => {
        setCount(0);
        setSessionTotal(0);
        setShowResetConfirm(false);
    };
    
    useEffect(() => {
        if (!audioCtx.current) {
            audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    }, []);

    const progress = (count / target) * 100;
    const strokeDashoffset = 339.292 * (1 - progress / 100);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 tasbih-modal-backdrop animate-fade-in">
            <div className="absolute inset-0" onClick={onClose}></div>
            <div className={`relative w-full max-w-sm rounded-3xl shadow-2xl p-6 text-white transition-colors duration-300 tasbih-modal-enter tasbih-modal-enter-active ${isSystemDark ? 'bg-slate-800' : 'bg-gradient-to-br from-slate-600 to-slate-800'}`}>
                
                <div className="absolute top-4 right-4">
                  <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1">
                      <XMarkIcon className="w-7 h-7" />
                  </button>
                </div>
              
                <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
                    <svg className="absolute w-full h-full" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="54" fill="none" stroke={isSystemDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)'} strokeWidth="8"/>
                        <circle
                            className="progress-ring"
                            cx="60" cy="60" r="54" fill="none" stroke="url(#gradient)" strokeWidth="8"
                            strokeDasharray="339.292" strokeDashoffset={strokeDashoffset} strokeLinecap="round"
                        />
                        <defs>
                            <linearGradient id="gradient">
                                <stop offset="0%" stopColor="#F59E0B"/>
                                <stop offset="100%" stopColor="#FDE047"/>
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="text-center">
                        <div className="text-6xl font-bold tracking-tighter">{count}</div>
                        <div className="text-lg opacity-60">/ {target}</div>
                    </div>
                </div>

                <div className="text-center text-sm opacity-50 mt-2">Sesi ini: {sessionTotal}</div>

                <div className="flex justify-center items-center gap-4 my-6">
                    <button onClick={() => setCount(c => Math.max(0, c - 1))} className="pressable bg-white/10 rounded-full w-14 h-14 flex items-center justify-center text-2xl font-bold"><MinusIcon className="w-6 h-6"/></button>
                    <button 
                        onMouseDown={handleMouseDown} 
                        onMouseUp={handleMouseUp} 
                        onTouchStart={handleMouseDown}
                        onTouchEnd={handleMouseUp}
                        className="pressable w-40 h-40 bg-gradient-to-br from-gold-light to-gold-dark rounded-full text-slate-800 text-3xl font-bold shadow-lg"
                    >
                        Tap
                    </button>
                    <button onClick={() => handleIncrement(5)} className="pressable bg-white/10 rounded-full w-14 h-14 flex items-center justify-center text-xl font-bold">+5</button>
                </div>

                <div className="flex justify-center gap-4">
                    <button onClick={() => setShowResetConfirm(true)} className="pressable bg-white/10 rounded-full p-3"><ArrowPathIcon className="w-6 h-6"/></button>
                    <button onClick={() => setShowSettings(s => !s)} className={`pressable rounded-full p-3 transition-colors ${showSettings ? 'bg-white/20' : 'bg-white/10'}`}><Cog6ToothIcon className="w-6 h-6"/></button>
                </div>

                {showSettings && (
                    <div className="bg-black/20 rounded-xl p-4 mt-4 space-y-3 animate-fade-in">
                        <div className="flex items-center justify-between">
                            <label htmlFor="target" className="font-medium">Target Hitungan</label>
                            <input id="target" type="number" value={target} onChange={e => setTarget(parseInt(e.target.value) || 1)} className="w-20 bg-transparent border-b-2 border-white/20 text-right focus:outline-none focus:border-amber-400"/>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-medium">Suara</span>
                            <button onClick={() => setSoundEnabled(s => !s)} className={`p-2 rounded-full ${soundEnabled ? 'text-amber-400' : ''}`}><SpeakerWaveIcon className="w-6 h-6"/></button>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-medium">Getar</span>
                            <button onClick={() => setVibrateEnabled(v => !v)} className={`p-2 rounded-full ${vibrateEnabled ? 'text-amber-400' : ''}`}><SpeakerXMarkIcon className="w-6 h-6"/></button>
                        </div>
                    </div>
                )}
                
                {showResetConfirm && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center animate-fade-in p-4">
                        <div className={`rounded-2xl p-6 w-full text-center shadow-2xl ${isSystemDark ? 'bg-slate-700' : 'bg-slate-600'} max-w-xs`}>
                            <h3 className="font-bold text-lg mb-2">Reset Hitungan?</h3>
                            <p className="text-sm opacity-80 mb-6">Aksi ini akan mengembalikan hitungan ke 0.</p>
                            <div className="flex justify-center gap-4">
                                <button onClick={() => setShowResetConfirm(false)} className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors font-semibold">Batal</button>
                                <button onClick={handleReset} className="px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition-colors font-semibold">Reset</button>
                            </div>
                        </div>
                    </div>
                )}
                
                {showTargetReached && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center animate-fade-in p-4">
                        <div className={`rounded-2xl p-6 w-full max-w-xs text-center shadow-2xl ${isSystemDark ? 'bg-slate-700' : 'bg-slate-600'}`}>
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckIcon className="w-10 h-10"/>
                            </div>
                            <h3 className="font-bold text-lg mb-2">Target Tercapai!</h3>
                            <p className="text-sm opacity-80 mb-6">Masya Allah, Anda telah menyelesaikan {target} hitungan.</p>
                            <button onClick={() => setShowTargetReached(false)} className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-600 transition-colors font-semibold">Lanjutkan</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- FLOATING AUDIO PLAYER ---
interface FloatingAudioPlayerProps {
    verse: CurrentPlayingVerse;
    isPlaying: boolean;
    progress: number;
    onPlayPause: () => void;
    onNext: () => void;
    onPrev: () => void;
    onClose: () => void;
}

const FloatingAudioPlayer: React.FC<FloatingAudioPlayerProps> = ({ verse, isPlaying, progress, onPlayPause, onNext, onPrev, onClose }) => {
    return (
        <div className="fixed bottom-20 md:bottom-4 inset-x-4 z-40">
            <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-2xl p-3 flex items-center gap-3 animate-fade-in max-w-2xl mx-auto border border-slate-200 dark:border-slate-700">
                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <p className="font-bold text-sm text-text-primary dark:text-dark-text-primary truncate">
                           {verse.surahName} : {verse.verseNumberInSurah}
                        </p>
                        <button onClick={onClose} className="text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary p-1">
                            <XMarkIcon className="w-5 h-5"/>
                        </button>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-1 mt-1">
                        <div className="bg-primary h-1 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-text-primary dark:text-dark-text-primary">
                    <button onClick={onPrev} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"><BackwardIcon className="w-6 h-6"/></button>
                    <button onClick={onPlayPause} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-primary">
                        {isPlaying ? <PauseIcon className="w-8 h-8"/> : <PlayIcon className="w-8 h-8"/>}
                    </button>
                    <button onClick={onNext} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"><ForwardIcon className="w-6 h-6"/></button>
                </div>
            </div>
        </div>
    )
}

// --- VERSE ITEM (REUSABLE) ---
const VerseItem: React.FC<{
    verse: Verse;
    surahNumber: number;
    onPlay: () => void;
    isCurrentlyPlaying: boolean;
}> = ({ verse, surahNumber, onPlay, isCurrentlyPlaying }) => (
    <div className="border-b border-slate-200 dark:border-slate-700 pb-6">
        <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-amber-600 dark:text-amber-400 px-3 py-1 bg-amber-100 dark:bg-amber-900/50 rounded-full text-sm">
                {surahNumber}:{verse.number.inSurah}
            </span>
            <button onClick={onPlay} className="text-text-secondary dark:text-dark-text-secondary hover:text-amber-500 transition-colors">
                {isCurrentlyPlaying ? <PauseCircleIcon className="w-7 h-7" /> : <PlayCircleIcon className="w-7 h-7" />}
            </button>
        </div>
        {verse.text.tajweed?.html ? (
            <p
                className="text-right text-3xl leading-loose font-amiri text-text-primary dark:text-dark-text-primary mb-4"
                dangerouslySetInnerHTML={renderTajweedText(verse.text.tajweed.html)}
            />
        ) : (
            <p className="text-right text-3xl leading-loose font-amiri text-text-primary dark:text-dark-text-primary mb-4">
                {verse.text.arab}
            </p>
        )}
        <p className="text-sm text-amber-700 dark:text-amber-500 italic mb-2">{verse.text.transliteration.en}</p>
        <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{verse.translation.id}</p>
    </div>
);


// --- SURAH VIEW ---
const SurahView: React.FC<{ 
    surahNumber: number;
    onPlayVerse: (verse: Verse, surah: SurahDetail, playlist: Verse[]) => void;
    currentPlayingVerse: CurrentPlayingVerse | null;
    isPlaying: boolean;
}> = ({ surahNumber, onPlayVerse, currentPlayingVerse, isPlaying }) => {
    const [surah, setSurah] = useState<SurahDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchSurah = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`https://api.quran.gading.dev/surah/${surahNumber}`);
                if (!response.ok) throw new Error('Gagal memuat data surah');
                const data = await response.json();
                setSurah(data.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
            } finally {
                setLoading(false);
            }
        };
        fetchSurah();
    }, [surahNumber]);

    if (loading) return <div className="text-center p-8"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div></div>;
    if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
    if (!surah) return null;

    return (
        <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-4 md:p-6 space-y-6">
            <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-4">
                <h2 className="text-3xl font-bold font-amiri text-text-primary dark:text-dark-text-primary">{surah.name.long}</h2>
                <h3 className="text-xl font-semibold text-amber-600 dark:text-amber-400">{surah.name.transliteration.id}</h3>
                <p className="text-text-secondary dark:text-dark-text-secondary">{surah.revelation.id} • {surah.numberOfVerses} Ayat</p>
            </div>
            {surah.preBismillah && (
                <div className="text-center font-amiri text-2xl py-4 text-text-primary dark:text-dark-text-primary">
                    {surah.preBismillah.text.arab}
                </div>
            )}
            <div className="space-y-8">
                {surah.verses.map((verse) => (
                    <VerseItem
                        key={verse.number.inSurah}
                        verse={verse}
                        surahNumber={surah.number}
                        onPlay={() => onPlayVerse(verse, surah, surah.verses)}
                        isCurrentlyPlaying={
                            currentPlayingVerse?.surahNumber === surah.number &&
                            currentPlayingVerse?.verseNumberInSurah === verse.number.inSurah &&
                            isPlaying
                        }
                    />
                ))}
            </div>
        </div>
    );
};

// --- QURAN VIEW ---
const SurahList: React.FC<{ surahs: Surah[], onSelectSurah: (num: number) => void }> = ({ surahs, onSelectSurah }) => (
    <ul className="divide-y divide-slate-200 dark:divide-slate-700">
        {surahs.map(surah => (
            <li key={surah.number}>
                <button onClick={() => onSelectSurah(surah.number)} className="w-full flex items-center space-x-4 p-4 text-left hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors rounded-lg">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 font-bold text-amber-600 dark:text-amber-400">
                        {surah.number}
                    </span>
                    <div className="flex-1">
                        <p className="font-semibold text-text-primary dark:text-dark-text-primary">{surah.name.transliteration.id}</p>
                        <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{surah.revelation.id} • {surah.numberOfVerses} ayat</p>
                    </div>
                    <p className="font-amiri text-xl text-text-primary dark:text-dark-text-primary">{surah.name.short}</p>
                </button>
            </li>
        ))}
    </ul>
);

const RiwayatList: React.FC<{ history: SurahHistoryItem[], onSelectSurah: (num: number) => void }> = ({ history, onSelectSurah }) => (
  history.length === 0 ? (
    <p className="text-center text-text-secondary dark:text-dark-text-secondary py-8">Belum ada riwayat bacaan.</p>
  ) : (
    <ul className="divide-y divide-slate-200 dark:divide-slate-700">
        {history.map(surah => (
            <li key={surah.number}>
                <button onClick={() => onSelectSurah(surah.number)} className="w-full flex items-center space-x-4 p-4 text-left hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors rounded-lg">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 font-bold text-amber-600 dark:text-amber-400">
                        {surah.number}
                    </span>
                    <div className="flex-1">
                        <p className="font-semibold text-text-primary dark:text-dark-text-primary">{surah.name.transliteration.id}</p>
                        <div className="flex items-center gap-2 text-xs text-text-secondary dark:text-dark-text-secondary">
                            <ClockIcon className="w-3 h-3" />
                            <span>{timeAgo(surah.lastAccessed)}</span>
                        </div>
                    </div>
                    <p className="font-amiri text-xl text-text-primary dark:text-dark-text-primary">{surah.name.short}</p>
                </button>
            </li>
        ))}
    </ul>
  )
);

const QuranView: React.FC<{ 
    onSelectSurah: (num: number) => void;
    surahs: Surah[];
    surahHistory: SurahHistoryItem[];
}> = ({ onSelectSurah, surahs, surahHistory }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'surah' | 'riwayat'>('surah');

    const filteredSurahs = surahs.filter(surah =>
        surah.name.transliteration.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        surah.number.toString().includes(searchTerm)
    );

    const activeClass = 'bg-gradient-to-br from-gold-light to-gold-dark text-white shadow';
    const inactiveClass = 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600';

    return (
        <div className="animate-fade-in">
            <div className="relative mb-4">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-dark-text-secondary" />
                <input
                    type="text"
                    placeholder="Cari surah (e.g. Al-Fatihah atau 1)"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-background dark:bg-dark-background focus:ring-2 focus:ring-primary focus:outline-none"
                    disabled={activeTab !== 'surah'}
                />
            </div>
            
            <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-slate-200 dark:bg-slate-800 mb-4">
                <button onClick={() => setActiveTab('surah')} className={`py-2 px-4 text-sm font-semibold rounded-md transition-colors ${activeTab === 'surah' ? activeClass : inactiveClass}`}>Surah</button>
                <button onClick={() => setActiveTab('riwayat')} className={`py-2 px-4 text-sm font-semibold rounded-md transition-colors ${activeTab === 'riwayat' ? activeClass : inactiveClass}`}>Riwayat</button>
            </div>

            <div className="max-h-[500px] overflow-y-auto pr-2">
                {surahs.length === 0 && activeTab === 'surah' && <div className="text-center p-4">Memuat daftar surah...</div>}
                {activeTab === 'surah' && <SurahList surahs={filteredSurahs} onSelectSurah={onSelectSurah} />}
                {activeTab === 'riwayat' && <RiwayatList history={surahHistory} onSelectSurah={onSelectSurah} />}
            </div>
        </div>
    );
};

// --- DOA VIEW ---
const DoaView: React.FC = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleDoa = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-4 md:p-6 animate-fade-in">
      <div className="space-y-2">
        {KUMPULAN_DOA.map((doa) => (
          <div key={doa.id} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleDoa(doa.id)}
              className="w-full flex justify-between items-center p-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
              aria-expanded={expandedId === doa.id}
              aria-controls={`doa-content-${doa.id}`}
            >
              <span className="font-semibold text-text-primary dark:text-dark-text-primary">{doa.doa}</span>
              <ChevronDownIcon
                className={`w-5 h-5 text-text-secondary dark:text-dark-text-secondary transition-transform duration-300 ${
                  expandedId === doa.id ? 'rotate-180' : ''
                }`}
              />
            </button>
            {expandedId === doa.id && (
              <div
                id={`doa-content-${doa.id}`}
                className="px-4 pb-4 border-t border-slate-200 dark:border-slate-700 space-y-4 animate-fade-in"
              >
                <p className="text-right text-2xl leading-relaxed font-amiri text-text-primary dark:text-dark-text-primary mt-4">
                  {doa.arab}
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-500 italic">{doa.latin}</p>
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                  <span className="font-semibold text-text-primary dark:text-dark-text-primary">Artinya:</span> "{doa.artinya}"
                </p>
                <p className="text-xs text-right text-text-secondary dark:text-dark-text-secondary font-medium">
                  ( {doa.riwayat} )
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- HIJRI CALENDAR ---
const HijriCalendarView: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarData, setCalendarData] = useState<CalendarDay[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCalendar = useCallback(async (date: Date) => {
        setLoading(true);
        setError(null);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        try {
            const response = await fetch(`https://api.aladhan.com/v1/calendarByCity?city=Jakarta&country=Indonesia&method=3&month=${month}&year=${year}`);
            if (!response.ok) throw new Error('Gagal memuat data kalender.');
            
            const data = await response.json();
            if (data.code !== 200 || !data.data) throw new Error(data.data || 'Gagal memuat data kalender.');
            
            setCalendarData(data.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan tidak diketahui.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCalendar(currentDate);
    }, [currentDate, fetchCalendar]);

    const changeMonth = (delta: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + delta);
            return newDate;
        });
    };

    const todayGregorian = new Date();
    const todayString = `${String(todayGregorian.getDate()).padStart(2,'0')}-${String(todayGregorian.getMonth() + 1).padStart(2,'0')}-${todayGregorian.getFullYear()}`;

    const renderCalendarGrid = () => {
        if (loading) {
            return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
        }
        if (error) {
            return <div className="text-center h-64 flex flex-col justify-center items-center"><p className="text-red-500 mb-4">{error}</p><button onClick={() => fetchCalendar(currentDate)} className="bg-primary text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-primary-focus">Coba Lagi</button></div>;
        }
        if (calendarData.length === 0) return <div className="text-center h-64 flex items-center justify-center"><p>Tidak ada data untuk bulan ini.</p></div>;

        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // Sunday - Saturday : 0 - 6
        const daysOfWeek = ['Ahd', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

        return (
            <>
                <div className="grid grid-cols-7 gap-1 text-center font-bold text-text-secondary dark:text-dark-text-secondary text-sm mb-2">
                    {daysOfWeek.map(day => <div key={day} className="p-1">{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} className="border border-transparent rounded-lg"></div>)}
                    {calendarData.map(day => {
                        const isToday = day.date.gregorian.date === todayString;
                        const hasHoliday = day.holidays && day.holidays.length > 0;
                        
                        return (
                            <div key={day.date.readable} className={`h-24 p-1.5 border rounded-lg flex flex-col text-xs transition-colors ${isToday ? 'bg-primary/20 border-primary' : 'border-slate-200 dark:border-slate-700'} ${hasHoliday ? 'bg-green-50 dark:bg-green-900/20' : ''}`}>
                                <div className="flex justify-between items-start">
                                    <span className={`font-bold text-sm ${isToday ? 'text-primary' : 'text-text-primary dark:text-dark-text-primary'}`}>{day.date.gregorian.day}</span>
                                    <span className="font-semibold text-amber-700 dark:text-amber-500">{day.date.hijri.day}</span>
                                </div>
                                {hasHoliday && <div className="text-[10px] text-green-700 dark:text-green-400 font-semibold truncate leading-tight mt-auto text-center">{day.holidays[0]}</div>}
                            </div>
                        )
                    })}
                </div>
            </>
        );
    };
    
    const hijriMonthYear = calendarData.length > 0 ? `${calendarData[15]?.date.hijri.month.en} ${calendarData[15]?.date.hijri.year}` : '';

    return (
        <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-4 md:p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"><BackwardIcon className="w-5 h-5"/></button>
                <div className="text-center">
                    <h3 className="font-bold text-lg text-text-primary dark:text-dark-text-primary">{currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</h3>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{hijriMonthYear}</p>
                </div>
                <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"><ForwardIcon className="w-5 h-5"/></button>
            </div>
            {renderCalendarGrid()}
        </div>
    );
};

// --- ZAKAT VIEW ---
const ZakatInputField: React.FC<{ id: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ id, label, value, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">{label}</label>
        <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-text-secondary dark:text-dark-text-secondary">Rp</span>
            <input
                type="number"
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                placeholder="0"
                className="w-full pl-10 p-2 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600 focus:ring-2 focus:ring-primary"
            />
        </div>
    </div>
);

const ZakatView: React.FC<{ onPayZakat: (amount: number) => void; setActivePage: (page: string) => void; }> = ({ onPayZakat, setActivePage }) => {
    // Nisab hardcoded based on 85 grams of gold @ Rp 1,300,000/gram
    const NISAB = 85 * 1300000;
    const ZAKAT_RATE = 0.025;

    const [inputs, setInputs] = useState({
        savings: '',
        goldSilver: '',
        investments: '',
        debts: ''
    });
    const [result, setResult] = useState<{
        netWealth: number;
        isWajib: boolean;
        zakatAmount: number;
    } | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInputs(prev => ({...prev, [name]: value}));
    };

    const handleCalculate = () => {
        const totalWealth = Number(inputs.savings) + Number(inputs.goldSilver) + Number(inputs.investments);
        const netWealth = totalWealth - Number(inputs.debts);
        const isWajib = netWealth >= NISAB;
        const zakatAmount = isWajib ? Math.floor(netWealth * ZAKAT_RATE) : 0;
        setResult({ netWealth, isWajib, zakatAmount });
    };
    
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="bg-surface dark:bg-dark-surface p-4 rounded-xl shadow-md">
            <h3 className="font-bold text-lg mb-2">Apa itu Nisab?</h3>
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                Nisab adalah batas minimum kekayaan seorang Muslim yang wajib dikenakan zakat. Saat ini, kami menetapkan nisab berdasarkan <strong>85 gram emas</strong>.
            </p>
            <p className="mt-2 text-center font-bold text-lg bg-amber-50 dark:bg-amber-900/50 p-3 rounded-lg text-amber-700 dark:text-amber-400">
                Estimasi Nisab: {formatToRupiah(NISAB)}
            </p>
        </div>

        <div className="bg-surface dark:bg-dark-surface p-4 rounded-xl shadow-md">
            <h3 className="font-bold text-lg mb-4 text-center">Kalkulator Zakat Maal (Harta)</h3>
            <div className="space-y-4">
                <ZakatInputField id="savings" label="Uang Tunai, Tabungan, Deposito" value={inputs.savings} onChange={handleInputChange} />
                <ZakatInputField id="goldSilver" label="Nilai Emas, Perak, & Logam Mulia" value={inputs.goldSilver} onChange={handleInputChange} />
                <ZakatInputField id="investments" label="Investasi, Saham, & Aset Produktif" value={inputs.investments} onChange={handleInputChange} />
                <ZakatInputField id="debts" label="Hutang Jangka Pendek (yang jatuh tempo tahun ini)" value={inputs.debts} onChange={handleInputChange} />
                <button
                    onClick={handleCalculate}
                    className="w-full bg-primary text-white font-bold py-3 rounded-lg"
                >
                    Hitung Zakat
                </button>
            </div>
        </div>

        {result && (
            <div className="bg-surface dark:bg-dark-surface p-4 rounded-xl shadow-md animate-fade-in">
                <h3 className="font-bold text-lg mb-4 text-center">Hasil Perhitungan</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800/50 rounded"><span>Total Harta</span> <span className="font-semibold">{formatToRupiah(Number(inputs.savings) + Number(inputs.goldSilver) + Number(inputs.investments))}</span></div>
                    <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800/50 rounded"><span>Hutang</span> <span className="font-semibold">{formatToRupiah(Number(inputs.debts))}</span></div>
                    <div className="flex justify-between p-2 bg-slate-100 dark:bg-slate-700 rounded font-bold"><span>Total Harta Bersih</span> <span>{formatToRupiah(result.netWealth)}</span></div>
                </div>
                
                {result.isWajib ? (
                    <div className="mt-4 text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="font-semibold text-green-700 dark:text-green-300">Anda sudah memenuhi nisab dan wajib membayar zakat.</p>
                        <p className="text-sm mt-2">Jumlah Zakat Maal Anda (2.5%):</p>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{formatToRupiah(result.zakatAmount)}</p>
                        <button
                            onClick={() => onPayZakat(result.zakatAmount)}
                            className="mt-4 bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold py-2 px-6 rounded-lg"
                        >
                            Tunaikan Zakat Sekarang
                        </button>
                    </div>
                ) : (
                    <div className="mt-4 text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <p className="font-semibold text-yellow-700 dark:text-yellow-400">Total harta bersih Anda belum mencapai nisab.</p>
                        <p className="text-sm mt-1">Anda belum diwajibkan untuk membayar Zakat Maal saat ini. Namun, Anda tetap bisa berinfak dan bersedekah.</p>
                         <button
                            onClick={() => setActivePage('Donasi')}
                            className="mt-4 bg-gradient-to-br from-gold-light to-gold-dark text-white font-bold py-2 px-6 rounded-lg"
                        >
                            Lihat Program Donasi Lainnya
                        </button>
                    </div>
                )}
            </div>
        )}
      </div>
    );
};


// --- FEATURE BUTTON ---
const FeatureButton: React.FC<{ icon: ElementType; label: string; onClick: () => void }> = ({ icon: IconComponent, label, onClick }) => {
    const Icon = (IconComponent as any).default || IconComponent;
    return (
        <button
            onClick={onClick}
            className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-dark-background flex flex-col items-center justify-center"
        >
            <Icon className="w-10 h-10 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
            <span className="font-semibold text-sm text-text-primary dark:text-dark-text-primary">{label}</span>
        </button>
    );
};


// --- MAIN VIEW ---
interface MainViewProps {
    onOpenQuran: () => void;
    onOpenTasbih: () => void;
    onOpenDoa: () => void;
    onOpenHijri: () => void;
    onOpenZakat: () => void;
}

const MainView: React.FC<MainViewProps> = ({ onOpenQuran, onOpenTasbih, onOpenDoa, onOpenHijri, onOpenZakat }) => {
    return (
        <div className="animate-fade-in">
            <PrayerTimesCard />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-0">
                <FeatureButton icon={BookOpenIcon} label="Al-Qur'an" onClick={onOpenQuran} />
                <FeatureButton icon={HandRaisedIcon} label="Tasbih Digital" onClick={onOpenTasbih} />
                <FeatureButton icon={SparklesIcon} label="Zakat" onClick={onOpenZakat} />
                <FeatureButton icon={QueueListIcon} label="Kumpulan Doa" onClick={onOpenDoa} />
                <FeatureButton icon={CalendarDaysIcon} label="Kalender Hijriah" onClick={onOpenHijri} />
            </div>
        </div>
    );
};


// --- HEADER ---
const Header: React.FC<{ onBack: () => void; title: string }> = ({ onBack, title }) => (
    <div className="flex items-center mb-6">
        <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-4"
            aria-label="Kembali"
        >
            <ArrowLeftIcon className="w-6 h-6 text-text-primary dark:text-dark-text-primary" />
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">
            {title}
        </h1>
    </div>
);


// --- ISLAMIC CENTER MAIN COMPONENT ---
const IslamicCenter: React.FC<IslamicCenterProps> = ({ setActivePage, onPayZakat }) => {
    type ViewState = 'main' | 'quran' | 'surah' | 'doa' | 'hijri' | 'zakat';
    const [view, setView] = useState<ViewState>('main');
    const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
    const [isTasbihOpen, setTasbihOpen] = useState(false);
    const [surahsList, setSurahsList] = useState<Surah[]>([]);
    const [surahHistory, setSurahHistory] = useLocalStorage<SurahHistoryItem[]>('quran_history', []);
    
    // Audio Player State
    const [currentPlayingVerse, setCurrentPlayingVerse] = useState<CurrentPlayingVerse | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioProgress, setAudioProgress] = useState(0);
    const [currentPlaylist, setCurrentPlaylist] = useState<Verse[]>([]);
    const [activeSurahDetail, setActiveSurahDetail] = useState<SurahDetail | Surah | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch Surah List
                const surahResponse = await fetch('https://api.quran.gading.dev/surah');
                if (!surahResponse.ok) console.error('Gagal memuat daftar surah');
                else {
                    const surahData = await surahResponse.json();
                    setSurahsList(surahData.data);
                }
            } catch (err) {
                console.error('Failed to fetch surah list', err);
            }
        };
        fetchInitialData();
    }, []);

    const playAudioForVerse = useCallback((verse: Verse, surahContext: Surah, playlist: Verse[]) => {
        setCurrentPlaylist(playlist);
        setActiveSurahDetail(surahContext);
        setCurrentPlayingVerse({
            surahNumber: surahContext.number,
            verseNumberInSurah: verse.number.inSurah,
            audioUrl: verse.audio.primary,
            surahName: surahContext.name.transliteration.id,
            totalVerses: surahContext.numberOfVerses
        });

        if (audioRef.current) {
            audioRef.current.src = verse.audio.primary;
            audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.error("Audio play failed", e));
        }
    }, []);
    
    const handleNextVerse = useCallback(() => {
        if (!currentPlayingVerse || !currentPlaylist || currentPlaylist.length === 0 || !activeSurahDetail) return;
    
        const currentIndex = currentPlaylist.findIndex(v => {
            const verseSurahNum = v.surah?.number || activeSurahDetail.number;
            return verseSurahNum === currentPlayingVerse.surahNumber && v.number.inSurah === currentPlayingVerse.verseNumberInSurah;
        });
    
        if (currentIndex > -1 && currentIndex < currentPlaylist.length - 1) {
            const nextVerse = currentPlaylist[currentIndex + 1];
            const surahContextForNextVerse = nextVerse.surah || activeSurahDetail;
            playAudioForVerse(nextVerse, surahContextForNextVerse, currentPlaylist);
        } else {
            setIsPlaying(false);
        }
    }, [currentPlayingVerse, currentPlaylist, activeSurahDetail, playAudioForVerse]);

    const handlePrevVerse = useCallback(() => {
        if (!currentPlayingVerse || !currentPlaylist || currentPlaylist.length === 0 || !activeSurahDetail) return;
    
        const currentIndex = currentPlaylist.findIndex(v => {
            const verseSurahNum = v.surah?.number || activeSurahDetail.number;
            return verseSurahNum === currentPlayingVerse.surahNumber && v.number.inSurah === currentPlayingVerse.verseNumberInSurah;
        });
    
        if (currentIndex > 0) {
            const prevVerse = currentPlaylist[currentIndex - 1];
            const surahContextForPrevVerse = prevVerse.surah || activeSurahDetail;
            playAudioForVerse(prevVerse, surahContextForPrevVerse, currentPlaylist);
        }
    }, [currentPlayingVerse, currentPlaylist, activeSurahDetail, playAudioForVerse]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
    
        const handleTimeUpdate = () => {
            if (audio.duration) {
                setAudioProgress((audio.currentTime / audio.duration) * 100);
            }
        };
        const handleEnded = () => {
            handleNextVerse(); // Autoplay next
        };
    
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);
    
        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [handleNextVerse]);

    const handlePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play().then(() => setIsPlaying(true));
            }
        }
    };
    
    const handleClosePlayer = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
        }
        setCurrentPlayingVerse(null);
        setIsPlaying(false);
    };
    
    const handlePlayVerseToggle = useCallback((verse: Verse, surahContext: Surah, playlist: Verse[]) => {
        const verseIdentifier = `${surahContext.number}:${verse.number.inSurah}`;
        const currentIdentifier = currentPlayingVerse ? `${currentPlayingVerse.surahNumber}:${currentPlayingVerse.verseNumberInSurah}` : null;
    
        if (verseIdentifier === currentIdentifier) {
            handlePlayPause();
        } else {
            playAudioForVerse(verse, surahContext, playlist);
        }
    }, [currentPlayingVerse, playAudioForVerse, handlePlayPause]);

    const handleSelectSurah = (surahNumber: number) => {
        setSelectedSurah(surahNumber);
        setView('surah');
        
        const surahInfo = surahsList.find(s => s.number === surahNumber);
        if (surahInfo) {
            setSurahHistory(prev => {
                const newHistory = prev.filter(s => s.number !== surahNumber);
                return [{ ...surahInfo, lastAccessed: new Date().toISOString() }, ...newHistory].slice(0, 10);
            });
        }
    };

    const handleBack = () => {
        if (view === 'surah') {
            setView('quran');
            setSelectedSurah(null);
        } else if (view === 'quran' || view === 'doa' || view === 'hijri' || view === 'zakat') {
            setView('main');
        } else {
            setActivePage('Dashboard');
        }
    };

    const getHeaderTitle = useCallback(() => {
        if (view === 'hijri') {
            return 'Kalender Hijriah';
        }
        if (view === 'zakat') {
            return 'Kalkulator Zakat';
        }
        if (view === 'surah' && selectedSurah) {
            const surah = surahsList.find(s => s.number === selectedSurah);
            return surah ? `Surah ${surah.name.transliteration.id}` : 'Al-Qur\'an';
        }
        if (view === 'quran') {
            return `Al-Qur'an`;
        }
        if (view === 'doa') {
            return 'Kumpulan Doa';
        }
        return 'Pusat Islami';
    }, [view, selectedSurah, surahsList]);

    return (
        <div className="max-w-4xl mx-auto">
            <Header onBack={handleBack} title={getHeaderTitle()} />
            <audio ref={audioRef} className="hidden" />
            
            {view === 'main' && (
              <MainView 
                onOpenQuran={() => setView('quran')} 
                onOpenTasbih={() => setTasbihOpen(true)}
                onOpenDoa={() => setView('doa')}
                onOpenHijri={() => setView('hijri')}
                onOpenZakat={() => setView('zakat')}
              />
            )}
            
            {view === 'quran' && (
              <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-4 md:p-6">
                  <QuranView 
                    onSelectSurah={handleSelectSurah} 
                    surahs={surahsList} 
                    surahHistory={surahHistory}
                  />
              </div>
            )}
            
            {view === 'doa' && <DoaView />}

            {view === 'hijri' && <HijriCalendarView />}

            {view === 'zakat' && <ZakatView onPayZakat={onPayZakat} setActivePage={setActivePage} />}
            
            {view === 'surah' && selectedSurah && (
                <SurahView 
                    surahNumber={selectedSurah} 
                    onPlayVerse={handlePlayVerseToggle}
                    currentPlayingVerse={currentPlayingVerse}
                    isPlaying={isPlaying}
                />
            )}

            {currentPlayingVerse && (
                <FloatingAudioPlayer 
                    verse={currentPlayingVerse}
                    isPlaying={isPlaying}
                    progress={audioProgress}
                    onPlayPause={handlePlayPause}
                    onNext={handleNextVerse}
                    onPrev={handlePrevVerse}
                    onClose={handleClosePlayer}
                />
            )}

            {isTasbihOpen && <TasbihModal onClose={() => setTasbihOpen(false)} />}
        </div>
    );
};

export default IslamicCenter;
