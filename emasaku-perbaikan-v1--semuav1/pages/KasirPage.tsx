import React, { useState, useEffect, useMemo } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    BuildingStorefrontIcon as BuildingStorefrontIconSolid,
    MagnifyingGlassIcon as MagnifyingGlassIconSolid,
    ShoppingCartIcon as ShoppingCartIconSolid,
    TrashIcon as TrashIconSolid,
    PlusIcon as PlusIconSolid,
    MinusIcon as MinusIconSolid,
    XMarkIcon as XMarkIconSolid,
    BanknotesIcon as BanknotesIconSolid
} from '@heroicons/react/24/solid';
import { Product, CartItem } from '../types.ts';
import { formatToRupiah } from '../utils/formatter.ts';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const BuildingStorefrontIcon = (BuildingStorefrontIconSolid as any).default || BuildingStorefrontIconSolid;
const MagnifyingGlassIcon = (MagnifyingGlassIconSolid as any).default || MagnifyingGlassIconSolid;
const ShoppingCartIcon = (ShoppingCartIconSolid as any).default || ShoppingCartIconSolid;
const TrashIcon = (TrashIconSolid as any).default || TrashIconSolid;
const PlusIcon = (PlusIconSolid as any).default || PlusIconSolid;
const MinusIcon = (MinusIconSolid as any).default || MinusIconSolid;
const XMarkIcon = (XMarkIconSolid as any).default || XMarkIconSolid;
const BanknotesIcon = (BanknotesIconSolid as any).default || BanknotesIconSolid;


interface KasirPageProps {
  setActivePage: (page: string) => void;
  getProducts: () => Promise<Product[]>;
  onSale: (cartItems: CartItem[], total: number, paymentMethod: string) => void;
}

interface PaymentModalProps {
    onClose: () => void;
    onConfirm: (paymentMethod: string) => void;
    total: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, onConfirm, total }) => {
    const [amountPaid, setAmountPaid] = useState('');
    const change = useMemo(() => {
        const paid = parseFloat(amountPaid);
        if (!isNaN(paid) && paid >= total) {
            return paid - total;
        }
        return 0;
    }, [amountPaid, total]);

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-2xl p-6 w-full max-w-sm relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-slate-400"><XMarkIcon className="w-6 h-6" /></button>
                <h2 className="text-xl font-bold text-center mb-4">Pembayaran</h2>
                <div className="my-4 p-3 bg-slate-100 dark:bg-dark-surface/50 rounded-lg text-center">
                    <p className="text-sm">Total Belanja</p>
                    <p className="text-4xl font-bold text-gold-dark dark:text-gold-light">{formatToRupiah(total)}</p>
                </div>
                <div>
                    <label htmlFor="amountPaid" className="block text-sm font-medium mb-1">Jumlah Uang Tunai</label>
                    <div className="relative">
                       <span className="absolute inset-y-0 left-3 flex items-center text-lg font-bold">Rp</span>
                       <input type="number" id="amountPaid" value={amountPaid} onChange={e => setAmountPaid(e.target.value)} placeholder="0" className="w-full pl-10 pr-4 py-2 border rounded-md font-bold text-lg"/>
                    </div>
                </div>
                <div className="mt-4 flex justify-between text-sm">
                    <span>Kembalian</span>
                    <span className="font-bold">{formatToRupiah(change)}</span>
                </div>
                <button onClick={() => onConfirm('Tunai')} className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 rounded-lg text-lg">
                    Konfirmasi Pembayaran
                </button>
            </div>
        </div>
    );
};

const KasirPage: React.FC<KasirPageProps> = ({ setActivePage, getProducts, onSale }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
    
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const data = await getProducts();
            setProducts(data);
            setLoading(false);
        };
        fetchProducts();
    }, [getProducts]);
    
    const filteredProducts = useMemo(() => {
        return products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [products, searchTerm]);
    
    const { subtotal, tax, total } = useMemo(() => {
        const sub = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
        const taxAmount = sub * 0.11; // PPN 11%
        const totalAmount = sub + taxAmount;
        return { subtotal: sub, tax: taxAmount, total: totalAmount };
    }, [cart]);
    
    const handleAddToCart = (product: Product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.product.id === product.id);
            if (existingItem) {
                if (existingItem.quantity >= product.stock) {
                    alert(`Stok ${product.name} tidak mencukupi.`);
                    return prevCart;
                }
                return prevCart.map(item =>
                    item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                 if (product.stock < 1) {
                    alert(`${product.name} habis terjual.`);
                    return prevCart;
                }
                return [...prevCart, { product, quantity: 1 }];
            }
        });
    };

    const handleUpdateQuantity = (productId: number, delta: number) => {
        setCart(prevCart => {
            return prevCart.map(item => {
                if (item.product.id === productId) {
                    const newQuantity = item.quantity + delta;
                    if (newQuantity < 1) return null; // Akan difilter nanti
                    if (newQuantity > item.product.stock) {
                        alert(`Stok ${item.product.name} tidak mencukupi.`);
                        return item;
                    }
                    return { ...item, quantity: newQuantity };
                }
                return item;
            }).filter(Boolean) as CartItem[];
        });
    };
    
    const handleRemoveFromCart = (productId: number) => {
        setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    };
    
    const handleClearCart = () => {
        if(window.confirm('Anda yakin ingin mengosongkan keranjang?')) {
            setCart([]);
        }
    };
    
    const handleConfirmPayment = (paymentMethod: string) => {
        onSale(cart, total, paymentMethod);
        setPaymentModalOpen(false);
        setCart([]);
    };

    return (
        <div className="h-full flex flex-col">
            {isPaymentModalOpen && <PaymentModal 
                onClose={() => setPaymentModalOpen(false)}
                onConfirm={handleConfirmPayment}
                total={total}
            />}
            <div className="flex-shrink-0 flex items-center mb-4">
                <button onClick={() => setActivePage('Dashboard')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 mr-4">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3">
                    <BuildingStorefrontIcon className="w-8 h-8 text-primary dark:text-gold-light" />
                    <h1 className="text-2xl md:text-3xl font-bold">Kasir (POS)</h1>
                </div>
            </div>
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden">
                {/* Product Grid */}
                <div className="lg:col-span-2 flex flex-col bg-surface dark:bg-dark-surface rounded-xl shadow-md p-4 overflow-hidden">
                    <div className="relative mb-3 flex-shrink-0">
                        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                        <input type="text" placeholder="Cari produk..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 p-2 border rounded-lg bg-background dark:bg-dark-background"/>
                    </div>
                    {loading ? (
                         <div className="flex-grow flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
                    ) : (
                         <div className="flex-grow overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 pr-2">
                            {filteredProducts.map(product => (
                                <button key={product.id} onClick={() => handleAddToCart(product)} className="border rounded-lg p-2 text-left hover:border-primary transition-colors disabled:opacity-50" disabled={product.stock <= 0}>
                                    <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden">
                                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover"/>
                                    </div>
                                    <p className="font-bold text-xs mt-2 line-clamp-2">{product.name}</p>
                                    <p className="text-xs text-primary dark:text-gold-light font-semibold">{formatToRupiah(product.price)}</p>
                                    <p className={`text-xs ${product.stock > 0 ? 'text-slate-500' : 'text-red-500 font-bold'}`}>Stok: {product.stock}</p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Cart/Sale */}
                <div className="lg:col-span-1 flex flex-col bg-surface dark:bg-dark-surface rounded-xl shadow-md p-4 overflow-hidden">
                    <div className="flex-shrink-0 flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="font-bold text-lg flex items-center gap-2"><ShoppingCartIcon className="w-5 h-5"/> Keranjang</h2>
                        <button onClick={handleClearCart} className="text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5"/></button>
                    </div>
                    {cart.length === 0 ? (
                        <div className="flex-grow flex items-center justify-center text-center text-sm text-slate-500">Pilih produk untuk memulai</div>
                    ) : (
                        <div className="flex-grow overflow-y-auto my-3 space-y-2 pr-2">
                           {cart.map(item => (
                                <div key={item.product.id} className="flex items-center gap-3">
                                    <img src={item.product.imageUrl} alt={item.product.name} className="w-12 h-12 rounded-md object-cover"/>
                                    <div className="flex-grow">
                                        <p className="text-xs font-bold line-clamp-1">{item.product.name}</p>
                                        <p className="text-xs">{formatToRupiah(item.product.price)}</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => handleUpdateQuantity(item.product.id, -1)} className="w-5 h-5 flex items-center justify-center border rounded-md"><MinusIcon className="w-3 h-3"/></button>
                                        <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                                        <button onClick={() => handleUpdateQuantity(item.product.id, 1)} className="w-5 h-5 flex items-center justify-center border rounded-md"><PlusIcon className="w-3 h-3"/></button>
                                    </div>
                                </div>
                           ))}
                        </div>
                    )}
                    <div className="flex-shrink-0 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2 text-sm">
                        <div className="flex justify-between"><span>Subtotal</span><span className="font-semibold">{formatToRupiah(subtotal)}</span></div>
                        <div className="flex justify-between"><span>PPN (11%)</span><span className="font-semibold">{formatToRupiah(tax)}</span></div>
                        <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t"><span>Total</span><span>{formatToRupiah(total)}</span></div>
                        <button onClick={() => setPaymentModalOpen(true)} disabled={cart.length === 0} className="w-full mt-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 rounded-lg text-lg disabled:bg-slate-300">
                            Bayar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KasirPage;