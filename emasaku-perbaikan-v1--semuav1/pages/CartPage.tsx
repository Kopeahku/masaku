import React from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    ShoppingCartIcon as ShoppingCartIconSolid, 
    TrashIcon as TrashIconSolid, 
    MinusIcon as MinusIconSolid, 
    PlusIcon as PlusIconSolid 
} from '@heroicons/react/24/solid';
import { Product, CartItem } from '../types.ts';
import { formatToRupiah } from '../utils/formatter.ts';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const ShoppingCartIcon = (ShoppingCartIconSolid as any).default || ShoppingCartIconSolid;
const TrashIcon = (TrashIconSolid as any).default || TrashIconSolid;
const MinusIcon = (MinusIconSolid as any).default || MinusIconSolid;
const PlusIcon = (PlusIconSolid as any).default || PlusIconSolid;


interface CartPageProps {
  cart: CartItem[];
  onRemoveFromCart: (productId: number) => void;
  onUpdateCartQuantity: (productId: number, quantity: number) => void;
  setActivePage: (page: string) => void;
}

const QuantitySelector: React.FC<{ 
    item: CartItem;
    onUpdateCartQuantity: (productId: number, quantity: number) => void;
}> = ({ item, onUpdateCartQuantity }) => {
    const { product, quantity } = item;

    const handleQuantityChange = (delta: number) => {
      const newQuantity = quantity + delta;
      onUpdateCartQuantity(product.id, newQuantity);
    }
    
    return (
      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={() => handleQuantityChange(-1)}
          className="w-7 h-7 flex items-center justify-center border rounded-md disabled:opacity-50 dark:border-slate-600"
        >
          <MinusIcon className="w-4 h-4"/>
        </button>
        <input
          type="number"
          value={quantity}
          readOnly
          className="w-12 text-center border rounded-md bg-transparent dark:border-slate-600"
        />
        <button
          onClick={() => handleQuantityChange(1)}
          disabled={quantity >= product.stock}
          className="w-7 h-7 flex items-center justify-center border rounded-md disabled:opacity-50 dark:border-slate-600"
        >
          <PlusIcon className="w-4 h-4"/>
        </button>
      </div>
    );
};

const CartPage: React.FC<CartPageProps> = ({ cart, onRemoveFromCart, onUpdateCartQuantity, setActivePage }) => {
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button onClick={() => setActivePage('Jual Beli')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-4" aria-label="Kembali ke Jual Beli">
            <ArrowLeftIcon className="w-6 h-6 text-text-primary dark:text-dark-text-primary" />
        </button>
        <div className="flex items-center gap-3">
          <ShoppingCartIcon className="w-8 h-8 text-primary dark:text-gold-light" />
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">Keranjang Belanja</h1>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="text-center bg-surface dark:bg-dark-surface p-8 rounded-xl shadow-md">
          <ShoppingCartIcon className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">Keranjang Anda kosong</h2>
          <p className="text-text-secondary dark:text-dark-text-secondary mt-2 mb-6">Ayo, temukan barang impianmu di marketplace!</p>
          <button
            onClick={() => setActivePage('Jual Beli')}
            className="bg-gradient-to-br from-gold-light to-gold-dark hover:opacity-90 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Mulai Belanja
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 bg-surface dark:bg-dark-surface rounded-xl shadow-md p-4 space-y-3">
            {cart.map(item => (
              <div key={item.product.id} className="flex items-start gap-4 p-2 border border-slate-200 dark:border-slate-700 rounded-lg">
                <img src={item.product.imageUrl} alt={item.product.name} className="w-20 h-20 object-cover rounded-md flex-shrink-0" />
                <div className="flex-grow">
                  <h3 className="font-bold text-text-primary dark:text-dark-text-primary text-sm">{item.product.name}</h3>
                  <p className="text-lg font-bold text-primary dark:text-gold-light mt-1">{formatToRupiah(item.product.price)}</p>
                  <QuantitySelector item={item} onUpdateCartQuantity={onUpdateCartQuantity} />
                </div>
                <button
                  onClick={() => onRemoveFromCart(item.product.id)}
                  className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500 transition-colors"
                  aria-label={`Hapus ${item.product.name}`}
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6 h-fit">
            <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary mb-4 border-b pb-3 border-slate-200 dark:border-slate-700">Ringkasan Pesanan</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary dark:text-dark-text-secondary">Subtotal ({totalItems} barang)</span>
                <span className="font-semibold text-text-primary dark:text-dark-text-primary">{formatToRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary dark:text-dark-text-secondary">Biaya Pengiriman</span>
                <span className="font-semibold text-text-primary dark:text-dark-text-primary">Rp -</span>
              </div>
            </div>
            <div className="flex justify-between font-bold text-lg pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
              <span className="text-text-primary dark:text-dark-text-primary">Total</span>
              <span className="text-primary dark:text-gold-light">{formatToRupiah(subtotal)}</span>
            </div>
            <button
              onClick={() => setActivePage('Checkout')}
              className="w-full mt-6 bg-gradient-to-br from-gold-light to-gold-dark text-white font-bold py-3 rounded-lg transition-opacity hover:opacity-90"
            >
              Lanjutkan ke Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;