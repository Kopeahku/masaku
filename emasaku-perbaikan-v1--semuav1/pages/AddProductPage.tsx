import React, { useState } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    PhotoIcon as PhotoIconSolid, 
    CheckCircleIcon as CheckCircleIconSolid 
} from '@heroicons/react/24/solid';
import { Product, User } from '../types.ts';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const PhotoIcon = (PhotoIconSolid as any).default || PhotoIconSolid;
const CheckCircleIcon = (CheckCircleIconSolid as any).default || CheckCircleIconSolid;

interface AddProductPageProps {
  setActivePage: (page: string) => void;
  currentUser: User;
  onAddProduct: (product: Omit<Product, 'id' | 'seller'>, seller: User) => void;
}

const AddProductPage: React.FC<AddProductPageProps> = ({ setActivePage, currentUser, onAddProduct }) => {
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [stock, setStock] = useState('');
    const [variants, setVariants] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!productName || !price || !category || !description || !stock || !imagePreview) {
            alert('Harap isi semua kolom (kecuali varian) dan unggah foto produk.');
            return;
        }
        onAddProduct({
            name: productName,
            price: Number(price),
            category,
            description,
            imageUrl: imagePreview,
            stock: Number(stock),
            variants: variants.split(',').map(v => v.trim()).filter(Boolean),
        }, currentUser);
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

    return (
        <div className="max-w-2xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex items-center mb-6">
                <button onClick={() => setActivePage('Jual Beli')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-4" aria-label="Kembali ke Jual Beli">
                    <ArrowLeftIcon className="w-6 h-6 text-text-primary dark:text-dark-text-primary" />
                </button>
                <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">Jual Barang</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-2">Foto Produk</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Preview" className="mx-auto h-32 w-auto rounded-md"/>
                                    <p className="text-xs text-green-500 flex items-center justify-center gap-1"><CheckCircleIcon className="w-4 h-4"/> Gambar berhasil diunggah!</p>
                                </>
                            ) : (
                                <>
                                <PhotoIcon className="mx-auto h-12 w-12 text-slate-400" />
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
                    <label htmlFor="productName" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Nama Produk</label>
                    <input type="text" id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600" required/>
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Harga (Rp)</label>
                        <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600" required/>
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Kategori</label>
                        <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600" required/>
                    </div>
                 </div>
                 
                 <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Stok Barang</label>
                    <input type="number" id="stock" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600" required/>
                 </div>

                 <div>
                    <label htmlFor="variants" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Varian (Opsional)</label>
                    <input type="text" id="variants" placeholder="Pisahkan dengan koma, cth: Merah, Biru" value={variants} onChange={(e) => setVariants(e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600"/>
                 </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Deskripsi Produk</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full p-2 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600" required></textarea>
                </div>

                <button
                    type="submit"
                    className="w-full bg-gradient-to-br from-gold-light to-gold-dark text-white hover:opacity-90 font-bold py-3 px-4 rounded-lg transition-colors"
                >
                    Jual Sekarang
                </button>
            </form>
        </div>
    );
};

export default AddProductPage;