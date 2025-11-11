

import React, { useState, useEffect, useMemo } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    ShoppingCartIcon as ShoppingCartIconSolid, 
    PlusCircleIcon as PlusCircleIconSolid, 
    MagnifyingGlassIcon as MagnifyingGlassIconSolid 
} from '@heroicons/react/24/solid';
import { Product } from '../types.ts';
import { getProducts } from '../services/mockData.ts';
import { formatToRupiah } from '../utils/formatter.ts';
import ProductCard from '../components/products/ProductCard.tsx';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const ShoppingCartIcon = (ShoppingCartIconSolid as any).default || ShoppingCartIconSolid;
const PlusCircleIcon = (PlusCircleIconSolid as any).default || PlusCircleIconSolid;
const MagnifyingGlassIcon = (MagnifyingGlassIconSolid as any).default || MagnifyingGlassIconSolid;


interface JualBeliPageProps {
  setActivePage: (page: string) => void;
  navigateToProductDetail: (productId: number) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  onToggleFavorite: (product: Product) => void;
  favorites: number[];
}

const JualBeliPage: React.FC<JualBeliPageProps> = ({ setActivePage, navigateToProductDetail, onAddToCart, onBuyNow, onToggleFavorite, favorites }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getProducts();
            setProducts(data);
            setLoading(false);
        };
        fetchProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    if (loading) {
        return <div className="flex justify-center items-center h-full"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <button onClick={() => setActivePage('Dashboard')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-4" aria-label="Kembali ke Dasbor">
                        <ArrowLeftIcon className="w-6 h-6 text-text-primary dark:text-dark-text-primary" />
                    </button>
                    <div className="flex items-center gap-3">
                        <ShoppingCartIcon className="w-8 h-8 text-primary dark:text-gold-light" />
                        <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">Jual Beli</h1>
                    </div>
                </div>
                <button onClick={() => setActivePage('Tambah Produk')} className="flex items-center gap-2 bg-gradient-to-br from-gold-light to-gold-dark text-white hover:opacity-90 font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
                    <PlusCircleIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Jual Barang</span>
                </button>
            </div>

            {/* Search and Filter */}
             <div className="relative mb-4">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-dark-text-secondary" />
                <input 
                    type="text" 
                    placeholder="Cari barang..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-background dark:bg-dark-background focus:ring-2 focus:ring-primary focus:outline-none"
                />
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
                {filteredProducts.map(product => (
                    <ProductCard 
                        key={product.id} 
                        product={product} 
                        isFavorite={favorites.includes(product.id)}
                        onCardClick={() => navigateToProductDetail(product.id)} 
                        onToggleFavorite={() => onToggleFavorite(product)}
                    />
                ))}
            </div>
             {filteredProducts.length === 0 && (
                <div className="text-center col-span-full py-12">
                    <p className="text-text-secondary dark:text-dark-text-secondary">Produk tidak ditemukan.</p>
                </div>
            )}
        </div>
    );
};

export default JualBeliPage;
