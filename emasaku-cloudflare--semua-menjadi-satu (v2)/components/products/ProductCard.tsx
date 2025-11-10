import React from 'react';
import { Product } from '../../types.ts';
import { formatToRupiah } from '../../utils/formatter.ts';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline';

const HeartIconSolid = (HeartSolidIcon as any).default || HeartSolidIcon;
const HeartIconOutline = (HeartOutlineIcon as any).default || HeartOutlineIcon;

interface ProductCardProps {
    product: Product; 
    isFavorite: boolean;
    onCardClick: () => void;
    onToggleFavorite: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isFavorite, onCardClick, onToggleFavorite }) => {
    
    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Mencegah card click saat mengklik ikon hati
        onToggleFavorite();
    };

    return (
        <div onClick={onCardClick} className="bg-surface dark:bg-dark-surface rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group flex flex-col cursor-pointer border border-slate-200 dark:border-slate-700">
            <div className="relative">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <button onClick={handleFavoriteClick} className="absolute top-2 right-2 bg-white/70 dark:bg-black/50 backdrop-blur-sm p-1.5 rounded-full text-red-500 hover:text-red-600 transition-colors z-10">
                    {isFavorite ? <HeartIconSolid className="w-5 h-5"/> : <HeartIconOutline className="w-5 h-5" />}
                </button>
            </div>
            <div className="p-3 flex flex-col flex-grow">
                <h3 className="font-bold text-sm text-text-primary dark:text-dark-text-primary line-clamp-2" style={{ height: '2.5rem' }}>{product.name}</h3>
                <p className="text-base font-extrabold text-primary dark:text-gold-light mb-1">{formatToRupiah(product.price)}</p>
                <div className="flex-grow">
                    <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-400">{product.category}</span>
                    <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1 line-clamp-2">{product.description}</p>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;