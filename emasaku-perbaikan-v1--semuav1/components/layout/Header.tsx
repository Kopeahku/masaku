import React from 'react';
// Fix: Add guard for heroicons
import { 
    BellIcon as BellIconSolid, 
    SunIcon as SunIconSolid, 
    MoonIcon as MoonIconSolid, 
    ShoppingCartIcon as ShoppingCartIconSolid 
} from '@heroicons/react/24/solid';
import { HeaderProps } from '../../types.ts'; // Import HeaderProps

// Fix: Add guard for heroicons
const BellIcon = (BellIconSolid as any).default || BellIconSolid;
const SunIcon = (SunIconSolid as any).default || SunIconSolid;
const MoonIcon = (MoonIconSolid as any).default || MoonIconSolid;
const ShoppingCartIcon = (ShoppingCartIconSolid as any).default || ShoppingCartIconSolid;


const Header: React.FC<HeaderProps> = ({ 
    currentUser, 
    notifications,
    cart,
    theme, 
    onToggleTheme, 
    onViewProfile,
    onViewNotifications,
    onViewCart,
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;
  const cartItemCount = cart.length;

  return (
    <header className="flex items-center justify-between p-4 bg-header-background dark:bg-dark-header-background border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
      {/* Left side: Logo and Title */}
       <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gold-DEFAULT dark:text-gold-light">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25-2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 3a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m-1.5-3.375C2.063 7.843 2.5 7.5 3 7.5h18c.5 0 .938.343 1.5.875M3 7.5h18" />
        </svg>
        <h1 className="text-2xl font-bold ml-2 hidden md:block text-text-primary dark:text-dark-text-primary">EmaSaku</h1>
      </div>

      {/* Right-side controls */}
      <div className="flex items-center gap-4">
        <button onClick={onToggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          {theme === 'light' ? <MoonIcon className="w-6 h-6 text-text-secondary" /> : <SunIcon className="w-6 h-6 text-dark-text-secondary" />}
        </button>
        
        <button onClick={onViewCart} className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <ShoppingCartIcon className="w-6 h-6 text-text-secondary dark:text-dark-text-secondary" />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-[10px] ring-2 ring-surface dark:ring-dark-surface">{cartItemCount}</span>
            )}
        </button>

        <div className="relative">
          <button onClick={onViewNotifications} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <BellIcon className="w-6 h-6 text-text-secondary dark:text-dark-text-secondary" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-[10px] ring-2 ring-surface dark:ring-dark-surface">{unreadCount}</span>
            )}
          </button>
        </div>

        <button onClick={onViewProfile} className="flex items-center gap-2">
          <img src={currentUser.avatarUrl} alt="User Avatar" className="w-8 h-8 rounded-full" />
          <span className="hidden sm:inline font-semibold text-sm text-text-primary dark:text-dark-text-primary">{currentUser.name}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;