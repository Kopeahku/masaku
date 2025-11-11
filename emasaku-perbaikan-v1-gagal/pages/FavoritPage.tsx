import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon as ArrowLeftIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { Product } from '../types.ts';
import { getProducts } from '../services/mockData.ts';
import ProductCard from '../components/products/ProductCard.tsx';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const HeartIcon = (HeartIconSolid as any).default || HeartIconSolid;

interface FavoritPageProps {
  setActivePage: (page: string) => void;
  navigateToProductDetail: (productId: number) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  onToggleFavorite: (product: Product) => void;
  favorites: number[];
}

const FavoritPage: React.FC<FavoritPageProps> = ({ setActivePage, navigateToProductDetail, onAddToCart, onBuyNow, onToggleFavorite, favorites }) => {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getProducts();
            setAllProducts(data);
            setLoading(false);
        };
        fetchProducts();
    }, []);

    const favoriteProducts = allProducts.filter(p => favorites.includes(p.id));

    if (loading) {
        return <div className="flex justify-center items-center h-full"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex items-center mb-6">
                <button onClick={() => setActivePage('Profile')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-4" aria-label="Kembali ke Profil">
                    <ArrowLeftIcon className="w-6 h-6 text-text-primary dark:text-dark-text-primary" />
                </button>
                <div className="flex items-center gap-3">
                    <HeartIcon className="w-8 h-8 text-primary dark:text-gold-light" />
                    <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">Favorit Saya</h1>
                </div>
            </div>

            {favoriteProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                    {favoriteProducts.map(product => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            isFavorite={true}
                            onCardClick={() => navigateToProductDetail(product.id)} 
                            onToggleFavorite={() => onToggleFavorite(product)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center bg-surface dark:bg-dark-surface p-8 rounded-xl shadow-md">
                    <HeartIcon className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                    <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">Anda belum punya barang favorit</h2>
                    <p className="text-text-secondary dark:text-dark-text-secondary mt-2 mb-6">Klik ikon hati pada produk yang Anda sukai untuk menyimpannya di sini.</p>
                    <button
                        onClick={() => setActivePage('Jual Beli')}
                        className="bg-gradient-to-br from-gold-light to-gold-dark text-white hover:opacity-90 font-bold py-2 px-6 rounded-lg transition-colors"
                    >
                        Cari Barang
                    </button>
                </div>
            )}
        </div>
    );
};

export default FavoritPage;