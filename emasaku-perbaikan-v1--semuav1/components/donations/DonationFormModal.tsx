import React, { useState, useEffect } from 'react';
import { DonationProgram } from '../../types.ts';
import { 
    XMarkIcon as XMarkIconSolid,
    CameraIcon as CameraIconSolid
} from '@heroicons/react/24/solid';

const XMarkIcon = (XMarkIconSolid as any).default || XMarkIconSolid;
const CameraIcon = (CameraIconSolid as any).default || CameraIconSolid;

interface DonationFormModalProps {
    programToEdit: DonationProgram | null;
    onClose: () => void;
    onSave: (program: DonationProgram | Omit<DonationProgram, 'id' | 'currentAmount'>) => void;
}

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.id} className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
            {label}
        </label>
        <input
            {...props}
            className="w-full p-2 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600 focus:ring-2 focus:ring-primary focus:outline-none"
        />
    </div>
);

const DonationFormModal: React.FC<DonationFormModalProps> = ({ programToEdit, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        targetAmount: '',
        currentAmount: '0',
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const isEditing = !!programToEdit;

    useEffect(() => {
        if (programToEdit) {
            setFormData({
                title: programToEdit.title,
                description: programToEdit.description,
                category: programToEdit.category,
                targetAmount: String(programToEdit.targetAmount),
                currentAmount: String(programToEdit.currentAmount),
            });
            setImagePreview(programToEdit.imageUrl);
        }
    }, [programToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!imagePreview) {
            alert('Harap unggah gambar untuk program donasi.');
            return;
        }
        const programData = {
            title: formData.title,
            description: formData.description,
            imageUrl: imagePreview,
            category: formData.category,
            targetAmount: Number(formData.targetAmount),
            currentAmount: Number(formData.currentAmount),
        };
        
        if (isEditing) {
            onSave({ ...programToEdit, ...programData });
        } else {
            const { currentAmount, ...newProgramData } = programData;
            onSave(newProgramData);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-2xl p-6 w-full max-w-lg relative max-h-[90vh] flex flex-col">
                <button onClick={onClose} className="absolute top-3 right-3 text-slate-400">
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-bold mb-4">{isEditing ? 'Ubah Program Donasi' : 'Tambah Program Donasi Baru'}</h2>
                
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-2 space-y-4">
                    <InputField label="Judul Program" id="title" name="title" value={formData.title} onChange={handleChange} required />
                    
                    <div>
                        <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-2">Gambar Program</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                {imagePreview ? (
                                    <>
                                        <img src={imagePreview} alt="Preview" className="mx-auto h-32 w-auto rounded-md object-contain"/>
                                        <label htmlFor="file-upload" className="relative cursor-pointer text-sm font-medium text-primary dark:text-gold-light hover:underline">
                                            Ganti gambar
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" />
                                        </label>
                                    </>
                                ) : (
                                    <>
                                        <CameraIcon className="mx-auto h-12 w-12 text-slate-400" />
                                        <div className="flex text-sm text-slate-600 dark:text-slate-400">
                                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-dark-surface rounded-md font-medium text-primary dark:text-gold-light hover:text-primary-focus dark:hover:text-gold-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                                                <span>Unggah file</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" />
                                            </label>
                                            <p className="pl-1">atau seret dan lepas</p>
                                        </div>
                                        <p className="text-xs text-slate-500">PNG, JPG, GIF hingga 10MB</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
                            Deskripsi
                        </label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full p-2 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600 focus:ring-2 focus:ring-primary focus:outline-none" required />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="Kategori" id="category" name="category" value={formData.category} onChange={handleChange} placeholder="Contoh: Bencana Alam" required />
                        <InputField label="Target Donasi (Rp)" id="targetAmount" name="targetAmount" type="number" value={formData.targetAmount} onChange={handleChange} required />
                    </div>

                    {isEditing && (
                        <InputField label="Jumlah Terkumpul (Rp)" id="currentAmount" name="currentAmount" type="number" value={formData.currentAmount} onChange={handleChange} required />
                    )}
                    
                    <div className="flex-shrink-0 flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700 mt-auto">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 rounded-md text-sm font-semibold">Batal</button>
                        <button type="submit" className="px-6 py-2 bg-primary text-white font-bold rounded-md text-sm">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DonationFormModal;