import React, { useState } from 'react';
import { User } from '../../types.ts';
// Fix: Add guard for heroicons
import { 
    XMarkIcon as XMarkIconSolid, 
    UserCircleIcon as UserCircleIconSolid, 
    DevicePhoneMobileIcon as DevicePhoneMobileIconSolid, 
    EnvelopeIcon as EnvelopeIconSolid, 
    CameraIcon as CameraIconSolid 
} from '@heroicons/react/24/solid';

// Fix: Add guard for heroicons
const XMarkIcon = (XMarkIconSolid as any).default || XMarkIconSolid;
const UserCircleIcon = (UserCircleIconSolid as any).default || UserCircleIconSolid;
const DevicePhoneMobileIcon = (DevicePhoneMobileIconSolid as any).default || DevicePhoneMobileIconSolid;
const EnvelopeIcon = (EnvelopeIconSolid as any).default || EnvelopeIconSolid;
const CameraIcon = (CameraIconSolid as any).default || CameraIconSolid;

interface EditProfileModalProps {
  user: User;
  onClose: () => void;
  onSave: (userId: string, updates: Partial<User>) => Promise<void>;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose, onSave }) => {
  const [name, setName] = useState(user.name);
  const [whatsapp, setWhatsapp] = useState(user.whatsapp || '');
  const [email, setEmail] = useState(user.email || '');
  const [avatarPreview, setAvatarPreview] = useState(user.avatarUrl);
  const [isSaving, setIsSaving] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(user.id, {
      name,
      whatsapp,
      email,
      avatarUrl: avatarPreview
    });
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-2xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          aria-label="Tutup"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary mb-6">Ubah Profil</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center">
            <div className="relative">
              <img src={avatarPreview} alt="Avatar Preview" className="w-24 h-24 rounded-full object-cover" />
              <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-gold-DEFAULT text-amber-900 p-1.5 rounded-full cursor-pointer hover:bg-gold-dark transition-colors">
                <CameraIcon className="w-4 h-4" />
                <input id="avatar-upload" type="file" className="sr-only" accept="image/*" onChange={handleAvatarChange} />
              </label>
            </div>
            <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-2">Ganti Foto Profil</p>
          </div>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Nama Lengkap</label>
            <div className="relative">
              <UserCircleIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-10 p-2 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600" required />
            </div>
          </div>
          
          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">No. WhatsApp</label>
            <div className="relative">
              <DevicePhoneMobileIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="tel" id="whatsapp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="w-full pl-10 p-2 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600" />
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Email</label>
            <div className="relative">
              <EnvelopeIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 p-2 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600" />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md text-sm font-semibold">
              Batal
            </button>
            <button type="submit" disabled={isSaving} className="px-4 py-2 bg-gradient-to-r from-gold-light to-gold-dark text-amber-900 font-bold hover:opacity-90 rounded-md text-sm disabled:opacity-50">
              {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;