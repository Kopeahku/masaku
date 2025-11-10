import React from 'react';
import { 
    HomeIcon as HomeIconSolid, 
    UsersIcon as UsersIconSolid, 
    UserCircleIcon as UserCircleIconSolid, 
    ShieldCheckIcon as ShieldCheckIconSolid, 
    QueueListIcon as QueueListIconSolid, 
    BuildingStorefrontIcon as BuildingStorefrontIconSolid, 
    BriefcaseIcon as BriefcaseIconSolid
} from '@heroicons/react/24/solid';
// Fix: Add .ts extension to the import path
import { UserRole, User } from '../../types.ts';

const HomeIcon = (HomeIconSolid as any).default || HomeIconSolid;
const UsersIcon = (UsersIconSolid as any).default || UsersIconSolid;
const UserCircleIcon = (UserCircleIconSolid as any).default || UserCircleIconSolid;
const ShieldCheckIcon = (ShieldCheckIconSolid as any).default || ShieldCheckIconSolid;
const QueueListIcon = (QueueListIconSolid as any).default || QueueListIconSolid;
const BuildingStorefrontIcon = (BuildingStorefrontIconSolid as any).default || BuildingStorefrontIconSolid;
const BriefcaseIcon = (BriefcaseIconSolid as any).default || BriefcaseIconSolid;


interface BottomNavProps {
  activePage: string;
  setActivePage: (page: string) => void;
  currentUser: User;
  setViewingUserId: (id: string | null) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activePage, setActivePage, currentUser, setViewingUserId }) => {
  
  const handleNavClick = (page: string) => {
    if (page !== 'Profile') {
      setViewingUserId(null);
    }
    setActivePage(page);
  };
  
  const userRole = currentUser.role;

  const navItemsByRole = {
    [UserRole.MEMBER]: [
      { name: 'Dashboard', icon: HomeIcon, label: 'Beranda' },
      { name: 'Peluang Mitra', icon: BriefcaseIcon, label: 'Peluang' },
      { name: 'Profile', icon: UserCircleIcon, label: 'Profil' },
    ],
    [UserRole.ADMIN]: [
      { name: 'Dashboard', icon: HomeIcon, label: 'Beranda' },
      { name: 'Peluang Mitra', icon: BriefcaseIcon, label: 'Peluang' },
      { name: 'Members', icon: UsersIcon, label: 'Anggota' },
      { name: 'Pengaturan Fitur', icon: QueueListIcon, label: 'Fitur' },
      { name: 'Profile', icon: UserCircleIcon, label: 'Profil' },
    ],
    [UserRole.DEVELOPER]: [
      { name: 'Dashboard', icon: HomeIcon, label: 'Beranda' },
      { name: 'Peluang Mitra', icon: BriefcaseIcon, label: 'Peluang' },
      { name: 'Admins', icon: ShieldCheckIcon, label: 'Admin' },
      { name: 'Pengaturan Fitur', icon: QueueListIcon, label: 'Fitur' },
      { name: 'Profile', icon: UserCircleIcon, label: 'Profil' },
    ],
  };

  // Conditionally add Partner Dashboard Hub for any partner role
  if (currentUser.isRetailPartner || currentUser.isLaundryPartner || typeof currentUser.driverBalance === 'number' || currentUser.isSeller) {
      const roleNavItems = navItemsByRole[currentUser.role];
      const profileIndex = roleNavItems.findIndex(item => item.name === 'Profile');
      const insertIndex = profileIndex !== -1 ? profileIndex : roleNavItems.length;

      // Check if 'Dasbor Mitra' already exists to avoid duplicates on re-render
      if (!roleNavItems.some(item => item.name === 'Dasbor Mitra')) {
          roleNavItems.splice(insertIndex, 0, {
              name: 'Dasbor Mitra',
              icon: BuildingStorefrontIcon, // Generic Partner Icon
              label: 'Mitra',
          });
      }
  }


  const navItems = navItemsByRole[userRole];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-surface dark:bg-dark-surface border-t border-slate-200 dark:border-slate-700 shadow-t-lg md:hidden z-20">
    <nav className="flex justify-around items-center h-full">
        {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = activePage === item.name;

        return (
            <button
            key={item.name}
            onClick={() => handleNavClick(item.name)}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                isActive ? 'text-amber-600 dark:text-amber-400' : 'text-text-secondary dark:text-dark-text-secondary hover:text-amber-600 dark:hover:text-amber-400'
            }`}
            aria-current={isActive ? 'page' : undefined}
            >
            <IconComponent className="w-6 h-6" />
            <span className="text-xs mt-1">{item.label}</span>
            </button>
        );
        })}
    </nav>
    </div>
  );
};

export default BottomNav;