import React, { useState } from 'react';
import type { ElementType } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    PhoneIcon as PhoneIconSolid,
    EnvelopeIcon as EnvelopeIconSolid,
    MapPinIcon as MapPinIconSolid,
    PaperAirplaneIcon as PaperAirplaneIconSolid,
    PencilSquareIcon as PencilSquareIconSolid
} from '@heroicons/react/24/solid';
import { User, UserRole } from '../types.ts';
import useLocalStorage from '../hooks/useLocalStorage.ts';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const PhoneIcon = (PhoneIconSolid as any).default || PhoneIconSolid;
const EnvelopeIcon = (EnvelopeIconSolid as any).default || EnvelopeIconSolid;
const MapPinIcon = (MapPinIconSolid as any).default || MapPinIconSolid;
const PaperAirplaneIcon = (PaperAirplaneIconSolid as any).default || PaperAirplaneIconSolid;
const PencilSquareIcon = (PencilSquareIconSolid as any).default || PencilSquareIconSolid;


interface KontakKamiPageProps {
  setActivePage: (page: string) => void;
  currentUser: User;
}

interface ContactDetails {
    email: string;
    phone: string;
    address: string;
    instagram: string;
    facebook: string;
    twitter: string;
    youtube: string;
    tiktok: string;
    telegram: string;
}

const defaultContactDetails: ContactDetails = {
    email: "dukungan@emasaku.com",
    phone: "+62 812-3456-7890",
    address: "Jl. Jenderal Sudirman Kav. 52-53,<br/>Jakarta Selatan, DKI Jakarta, 12190",
    instagram: "https://instagram.com/emasaku",
    facebook: "https://facebook.com/emasaku",
    twitter: "https://x.com/emasaku",
    youtube: "https://youtube.com/emasaku",
    tiktok: "https://tiktok.com/@emasaku",
    telegram: "https://t.me/emasaku"
};


const ContactInfoItem: React.FC<{ icon: ElementType, title: string, content: React.ReactNode, href?: string }> = ({ icon: IconComponent, title, content, href }) => {
    const Icon = (IconComponent as any).default || IconComponent;
    const isLink = !!href;
    const Tag = isLink ? 'a' : 'div';

    return (
        <Tag href={href} target={isLink ? "_blank" : undefined} rel={isLink ? "noopener noreferrer" : undefined} className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${isLink ? 'hover:bg-slate-50 dark:hover:bg-slate-700/50' : ''}`}>
            <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                <Icon className="w-6 h-6 text-primary dark:text-gold-light" />
            </div>
            <div>
                <h4 className="font-bold text-text-primary dark:text-dark-text-primary">{title}</h4>
                <div className={`text-sm text-text-secondary dark:text-dark-text-secondary ${isLink ? 'underline' : ''}`} dangerouslySetInnerHTML={{ __html: content as string }}/>
            </div>
        </Tag>
    );
};

// --- Social Media Icons & Link Component ---

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" aria-hidden="true">
        <defs>
            <radialGradient id="ig-gradient" cx="30%" cy="107%" r="150%">
                <stop offset="0%" stopColor="#fdf497" />
                <stop offset="5%" stopColor="#fdf497" />
                <stop offset="45%" stopColor="#fd5949" />
                <stop offset="60%" stopColor="#d6249f" />
                <stop offset="90%" stopColor="#285AEB" />
            </radialGradient>
        </defs>
        <path fill="url(#ig-gradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664 4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.441c-3.161 0-3.51.012-4.734.069-2.704.123-3.963 1.383-4.085 4.085-.057 1.224-.069 1.574-.069 4.734s.012 3.51.069 4.734c.122 2.703 1.382 3.962 4.085 4.085 1.224.057 1.574.069 4.734.069s3.51-.012 4.734-.069c2.703-.123 3.962-1.382 4.085-4.085.057-1.224.069-1.574.069-4.734s-.012-3.51-.069-4.734c-.123-2.703-1.382-3.962-4.085-4.085C15.51 3.615 15.16 3.604 12 3.604z"/>
        <path className="fill-black dark:fill-white" d="M12 8.114a3.886 3.886 0 1 0 0 7.772 3.886 3.886 0 0 0 0-7.772zm0 6.331a2.445 2.445 0 1 1 0-4.89 2.445 2.445 0 0 1 0 4.89z"/>
        <circle className="fill-black dark:fill-white" cx="16.85" cy="7.65" r="1.225"/>
    </svg>
);
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="#1877F2" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path></svg>
);
const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="#000000" viewBox="0 0 24 24" aria-hidden="true" className="dark:fill-white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
);
const YouTubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#FF0000" d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z"></path>
        <path className="fill-black dark:fill-white" d="M10 15.464V8.536L16 12L10 15.464z"></path>
    </svg>
);
const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="#000000" className="dark:fill-white" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.03-4.83-1-6.72-2.8-1.8-1.7-2.91-3.9-3-6.26.02-1.51.38-3.01.99-4.38.64-1.42 1.54-2.71 2.65-3.87 1.14-1.17 2.54-2.14 4.08-2.82.02-.01.03-.02.05-.03v4.34c-1.31.32-2.56.84-3.66 1.56-.7.47-1.33 1.03-1.85 1.68-.43.54-.78 1.13-1.07 1.76-.32.68-.53 1.4-.64 2.14-.13 1.14.04 2.3.44 3.4.45 1.2 1.18 2.28 2.13 3.21.93.9 2.05 1.59 3.29 2.03.8.28 1.64.44 2.49.5.98.06 1.97-.04 2.92-.33.95-.28 1.85-.75 2.65-1.38.83-.64 1.52-1.44 2.04-2.35.45-.83.75-1.73.92-2.67.03-.2.03-.4.03-.6v-3.72c-2.4-.44-4.41-1.85-5.7-3.66-1.04-1.46-1.5-3.19-1.4-4.96-.01-.79.09-1.59.24-2.37.02-.09.03-.18.05-.27z"></path>
    </svg>
);
const TelegramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" aria-hidden="true">
        <defs>
            <linearGradient id="telegram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#37AEE2"/>
                <stop offset="100%" stopColor="#1E96C8"/>
            </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="12" fill="url(#telegram-gradient)" />
        <path fill="#FFFFFF" d="M9.78 17.21a.79.79 0 0 1-1.05-.54l-1.31-4.11L17.24 8.4A.2.2 0 0 0 17 8.16l-7.75 4.67-3.55-1.1a.79.79 0 0 1-.4-1.46l13.07-5a.79.79 0 0 1 1 .7l-2.47 11.72a.79.79 0 0 1-.76.65h-.02a.79.79 0 0 1-.57-.24l-3.23-3.1-1.88 1.81z" />
    </svg>
);


const socialIconMap: { [key in keyof Omit<ContactDetails, 'email' | 'phone' | 'address'>]: ElementType } = {
    instagram: InstagramIcon,
    facebook: FacebookIcon,
    twitter: XIcon,
    youtube: YouTubeIcon,
    tiktok: TikTokIcon,
    telegram: TelegramIcon,
};

const SocialLink: React.FC<{ href: string, icon: ElementType, label: string }> = ({ href, icon: Icon, label }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full text-text-secondary dark:text-dark-text-secondary hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" aria-label={label}>
        <Icon className="w-6 h-6" />
    </a>
);


const KontakKamiPage: React.FC<KontakKamiPageProps> = ({ setActivePage, currentUser }) => {
    const [contactDetails, setContactDetails] = useLocalStorage<ContactDetails>('contact_details', defaultContactDetails);
    const [isEditing, setIsEditing] = useState(false);
    const [editDetails, setEditDetails] = useState<ContactDetails>(contactDetails);
    
    const [formState, setFormState] = useState({ name: '', email: '', message: '' });

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Pesan terkirim!\nNama: ${formState.name}\nEmail: ${formState.email}\nPesan: ${formState.message}`);
        setFormState({ name: '', email: '', message: '' });
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditDetails(prev => ({...prev, [name]: value}));
    };
    
    const handleSave = () => {
        setContactDetails(editDetails);
        setIsEditing(false);
    };
    
    const handleCancel = () => {
        setEditDetails(contactDetails);
        setIsEditing(false);
    };

    const socialLinks = Object.entries(socialIconMap).map(([key, Icon]) => {
        const url = contactDetails[key as keyof typeof socialIconMap];
        if (url) {
            return <SocialLink key={key} href={url} icon={Icon} label={key.charAt(0).toUpperCase() + key.slice(1)} />;
        }
        return null;
    }).filter(Boolean);

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex items-center mb-6">
                <button
                    onClick={() => setActivePage('Profile')}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-4"
                    aria-label="Kembali ke Profil"
                >
                    <ArrowLeftIcon className="w-6 h-6 text-text-primary dark:text-dark-text-primary" />
                </button>
                <div className="flex items-center gap-3">
                    <EnvelopeIcon className="w-8 h-8 text-primary dark:text-gold-light" />
                    <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">
                        Kontak Kami
                    </h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contact Form */}
                <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Kirim Pesan</h2>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <input type="text" name="name" value={formState.name} onChange={handleFormChange} placeholder="Nama Anda" className="w-full p-2 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600" required />
                        <input type="email" name="email" value={formState.email} onChange={handleFormChange} placeholder="Email Anda" className="w-full p-2 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600" required />
                        <textarea name="message" value={formState.message} onChange={handleFormChange} placeholder="Pesan Anda..." rows={5} className="w-full p-2 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600" required></textarea>
                        <button type="submit" className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-gold-light to-gold-dark text-white font-bold py-2.5 rounded-lg">
                            <PaperAirplaneIcon className="w-5 h-5"/> Kirim Pesan
                        </button>
                    </form>
                </div>
                
                {/* Contact Info */}
                <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6 relative">
                    {currentUser.role === UserRole.DEVELOPER && !isEditing && (
                        <button onClick={() => setIsEditing(true)} className="absolute top-4 right-4 p-2 text-primary dark:text-gold-light bg-primary/10 dark:bg-gold-light/10 rounded-full">
                            <PencilSquareIcon className="w-5 h-5" />
                        </button>
                    )}
                    <h2 className="text-xl font-bold mb-4">Informasi Kontak</h2>
                    {isEditing ? (
                        <div className="space-y-2">
                             {Object.keys(editDetails).map(key => (
                                <div key={key}>
                                    <label className="text-xs font-medium capitalize">{key}</label>
                                    <input name={key} value={editDetails[key as keyof ContactDetails]} onChange={handleEditChange} className="w-full p-1 border-b bg-white dark:bg-slate-800 dark:border-slate-600"/>
                                </div>
                            ))}
                            <div className="flex justify-end gap-2 pt-2">
                                <button onClick={handleCancel}>Batal</button>
                                <button onClick={handleSave} className="font-bold text-primary">Simpan</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <ContactInfoItem icon={EnvelopeIcon} title="Email" content={contactDetails.email} href={`mailto:${contactDetails.email}`} />
                                <ContactInfoItem icon={PhoneIcon} title="Telepon" content={contactDetails.phone} href={`tel:${contactDetails.phone.replace(/\s|-/g, '')}`} />
                                <ContactInfoItem icon={MapPinIcon} title="Alamat Kantor" content={contactDetails.address} />
                            </div>
                            <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-4">
                                <h4 className="font-bold text-center mb-2">Ikuti Kami</h4>
                                <div className="flex justify-center gap-2 flex-wrap">
                                    {socialLinks}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default KontakKamiPage;