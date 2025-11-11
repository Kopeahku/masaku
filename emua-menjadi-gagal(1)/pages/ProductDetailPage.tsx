import React, { useState, useEffect } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    ShoppingCartIcon as ShoppingCartIconSolid, 
    ChatBubbleOvalLeftEllipsisIcon as ChatBubbleOvalLeftEllipsisIconSolid, 
    // Fix: Rename import alias to HeartSolidIcon to avoid name collision.
    HeartIcon as HeartSolidIcon, 
    MinusIcon as MinusIconSolid, 
    PlusIcon as PlusIconSolid, 
    ShoppingBagIcon as ShoppingBagIconSolid 
} from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutlineIcon, MapPinIcon as MapPinIconOutline } from '@heroicons/react/24/outline';
import { Product } from '../types.ts';
import { getProductById } from '../services/mockData.ts';
import { formatToRupiah } from '../utils/formatter.ts';
import ContactAdminModal from '../components/profile/ContactAdminModal.tsx';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const ShoppingCartIcon = (ShoppingCartIconSolid as any).default || ShoppingCartIconSolid;
const ChatBubbleOvalLeftEllipsisIcon = (ChatBubbleOvalLeftEllipsisIconSolid as any).default || ChatBubbleOvalLeftEllipsisIconSolid;
const MinusIcon = (MinusIconSolid as any).default || MinusIconSolid;
const PlusIcon = (PlusIconSolid as any).default || PlusIconSolid;
const ShoppingBagIcon = (ShoppingBagIconSolid as any).default || ShoppingBagIconSolid;
const MapPinIcon = (MapPinIconOutline as any).default || MapPinIconOutline;
const HeartIconOutline = (HeartOutlineIcon as any).default || HeartOutlineIcon;
// Fix: Use the renamed import alias 'HeartSolidIcon' to prevent "used before declaration" error.
const HeartIconSolid = (HeartSolidIcon as any).default || HeartSolidIcon;

interface ProductDetailPageProps {
    setActivePage: (page: string) => void;
    productId: number;
    onAddToCart: (product: Product, quantity: number) => void;
    onBuyNow: (product: Product, quantity: number) => void;
    onToggleFavorite: (product: Product) => void;
    isFavorite: boolean;
    navigateToProfile: (userId: string) => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ setActivePage, productId, onAddToCart, onBuyNow, onToggleFavorite, isFavorite, navigateToProfile }) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isChatModalOpen, setChatModalOpen] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            const data = await getProductById(productId);
            setProduct(data || null);
            setLoading(false);
        };
        fetchProduct();
    }, [productId]);
    
    const handleQuantityChange = (delta: number) => {
        if (!product) return;
        setQuantity(prev => {
            const newQuantity = prev + delta;
            if (newQuantity < 1) return 1;
            if (newQuantity > product.stock) {
                alert(`Stok hanya tersisa ${product.stock}`);
                return product.stock;
            }
            return newQuantity;
        });
    };

    if (loading) {
        return <div className="flex justify-center items-center h-full"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
    }

    if (!product) {
        return <div className="text-center">Produk tidak ditemukan.</div>;
    }

    return (
        <div className="max-w-5xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex items-center mb-4">
                <button onClick={() => setActivePage('Jual Beli')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-2" aria-label="Kembali ke Jual Beli">
                    <ArrowLeftIcon className="w-6 h-6 text-text-primary dark:text-dark-text-primary" />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 bg-surface dark:bg-dark-surface rounded-xl shadow-md p-4">
                {/* Kolom Gambar */}
                <div className="lg:col-span-2">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-auto aspect-square object-cover rounded-lg shadow-lg"/>
                </div>
                
                {/* Kolom Info & Aksi */}
                <div className="lg:col-span-3 flex flex-col">
                    <div>
                        <div className="flex justify-between items-start">
                             <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary pr-4">{product.name}</h1>
                             <button onClick={() => onToggleFavorite(product)} className="p-2 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors flex-shrink-0">
                                {isFavorite ? <HeartIconSolid className="w-7 h-7"/> : <HeartIconOutline className="w-7 h-7" />}
                            </button>
                        </div>
                        <p className="text-3xl font-bold text-primary dark:text-gold-light my-3">{formatToRupiah(product.price)}</p>
                    </div>

                    {/* Info Penjual */}
                    <div className="my-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex items-center justify-between">
                        <button onClick={() => navigateToProfile(product.seller.id)} className="flex items-center gap-3 text-left group">
                            <img src={product.seller.avatarUrl} alt={product.seller.name} className="w-10 h-10 rounded-full group-hover:ring-2 group-hover:ring-primary transition-all"/>
                            <div>
                                <p className="font-bold text-sm text-text-primary dark:text-dark-text-primary group-hover:text-primary dark:group-hover:text-gold-light transition-colors">{product.seller.name}</p>
                                <p className="text-xs text-text-secondary dark:text-dark-text-secondary flex items-center gap-1"><MapPinIcon className="w-3 h-3"/>{product.seller.location}</p>
                            </div>
                        </button>
                        <button onClick={() => setChatModalOpen(true)} className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-text-primary dark:text-dark-text-primary text-xs font-semibold rounded-lg transition-colors">
                            <ChatBubbleOvalLeftEllipsisIcon className="w-4 h-4"/> Chat
                        </button>
                    </div>

                    {/* Detail Produk */}
                    <div className="text-sm space-y-3 border-t border-b border-slate-200 dark:border-slate-700 py-4">
                        <div className="flex items-center"><p className="w-24 text-text-secondary dark:text-dark-text-secondary">Kategori</p><p className="font-semibold text-primary dark:text-gold-light">{product.category}</p></div>
                        <div className="flex items-center"><p className="w-24 text-text-secondary dark:text-dark-text-secondary">Stok</p><p className="font-semibold">{product.stock} buah</p></div>
                        {product.variants && product.variants.length > 0 && (
                             <div className="flex items-start"><p className="w-24 text-text-secondary dark:text-dark-text-secondary flex-shrink-0">Varian</p><div className="flex flex-wrap gap-2">{product.variants.map(v => <span key={v} className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-xs rounded-md">{v}</span>)}</div></div>
                        )}
                        <div className="flex items-center">
                            <p className="w-24 text-text-secondary dark:text-dark-text-secondary">Jumlah</p>
                            <div className="flex items-center gap-2">
                                <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="w-8 h-8 flex items-center justify-center border rounded-md disabled:opacity-50 dark:border-slate-600 dark:disabled:text-slate-500"><MinusIcon className="w-4 h-4"/></button>
                                <input type="number" value={quantity} readOnly className="w-12 text-center border rounded-md bg-background dark:bg-dark-background dark:border-slate-600" />
                                <button onClick={() => handleQuantityChange(1)} disabled={quantity >= product.stock} className="w-8 h-8 flex items-center justify-center border rounded-md disabled:opacity-50 dark:border-slate-600 dark:disabled:text-slate-500"><PlusIcon className="w-4 h-4"/></button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Deskripsi */}
                    <div className="my-4">
                        <h3 className="font-bold mb-2 text-text-primary dark:text-dark-text-primary">Deskripsi Produk</h3>
                        <p className="text-sm text-text-secondary dark:text-dark-text-secondary leading-relaxed">{product.description}</p>
                    </div>

                    {/* Aksi (Desktop) */}
                    <div className="mt-auto pt-4 hidden sm:flex gap-3">
                        <button 
                            onClick={() => onAddToCart(product, quantity)} 
                            disabled={product.stock === 0} 
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gold-light/40 dark:bg-gold-light/20 hover:bg-gold-light/60 text-gold-dark dark:text-gold-light font-bold rounded-lg transition-colors disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:text-slate-500 dark:disabled:text-slate-400 disabled:cursor-not-allowed">
                            <ShoppingCartIcon className="w-5 h-5"/> 
                            + Keranjang
                        </button>
                        <button 
                            onClick={() => onBuyNow(product, quantity)} 
                            disabled={product.stock === 0} 
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gold-DEFAULT hover:bg-gold-dark text-slate-900 dark:bg-gold-dark dark:text-white dark:hover:bg-amber-800 font-bold rounded-lg transition-colors disabled:bg-slate-400 disabled:text-slate-500 disabled:cursor-not-allowed">
                           <ShoppingBagIcon className="w-5 h-5"/> 
                           Beli Sekarang
                        </button>
                    </div>
                </div>
            </div>

            {isChatModalOpen && (
                <ContactAdminModal
                    onClose={() => setChatModalOpen(false)}
                    recipientName={product.seller.name}
                    recipientAvatarUrl={product.seller.avatarUrl}
                />
            )}

            {/* Mobile Action Bar (Fixed at bottom) */}
            <div className="fixed bottom-0 left-0 right-0 bg-surface dark:bg-dark-surface p-2 border-t dark:border-slate-700 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] sm:hidden z-30">
              <div className="flex items-center justify-center gap-4 max-w-5xl mx-auto">
                <button onClick={() => setChatModalOpen(true)} className="px-3 flex flex-col items-center justify-center text-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-gold-light transition-colors">
                  <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6"/>
                  <span className="text-xs">Chat</span>
                </button>
                <div className="flex gap-2">
                    <button 
                        onClick={() => onAddToCart(product, quantity)} 
                        disabled={product.stock === 0} 
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gold-light/40 dark:bg-gold-light/20 hover:bg-gold-light/60 text-gold-dark dark:text-gold-light font-bold rounded-lg transition-colors disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:text-slate-500 dark:disabled:text-slate-400 disabled:cursor-not-allowed text-sm">
                        <ShoppingCartIcon className="w-5 h-5"/> 
                        + Keranjang
                    </button>
                    <button 
                        onClick={() => onBuyNow(product, quantity)} 
                        disabled={product.stock === 0} 
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gold-DEFAULT hover:bg-gold-dark text-slate-900 dark:bg-gold-dark dark:text-white dark:hover:bg-amber-800 font-bold rounded-lg transition-colors disabled:bg-slate-400 disabled:text-slate-500 disabled:cursor-not-allowed text-sm">
                       <ShoppingBagIcon className="w-5 h-5"/> 
                       Beli Sekarang
                    </button>
                </div>
              </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;