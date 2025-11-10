import React from 'react';
import { 
    HomeIcon as HomeIconOutline, 
    SparklesIcon as SparklesIconOutline, 
    UsersIcon as UsersIconOutline, 
    UserCircleIcon as UserCircleIconOutline, 
    ShieldCheckIcon as ShieldCheckIconOutline, 
    QueueListIcon as QueueListIconOutline, 
    BuildingStorefrontIcon as BuildingStorefrontIconOutline, 
    BriefcaseIcon as BriefcaseIconOutline 
} from '@heroicons/react/24/outline';
// Fix: Add .ts extension to the import path
import { UserRole, User } from '../../types.ts';

const HomeIcon = (HomeIconOutline as any).default || HomeIconOutline;
const SparklesIcon = (SparklesIconOutline as any).default || SparklesIconOutline;
const UsersIcon = (UsersIconOutline as any).default || UsersIconOutline;
const UserCircleIcon = (UserCircleIconOutline as any).default || UserCircleIconOutline;
const ShieldCheckIcon = (ShieldCheckIconOutline as any).default || ShieldCheckIconOutline;
const QueueListIcon = (QueueListIconOutline as any).default || QueueListIconOutline;
const BuildingStorefrontIcon = (BuildingStorefrontIconOutline as any).default || BuildingStorefrontIconOutline;
const BriefcaseIcon = (BriefcaseIconOutline as any).default || BriefcaseIconOutline;

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  currentUser: User;
  setViewingUserId: (id: string | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, currentUser, setViewingUserId }) => {
  const userRole = currentUser.role;

  const handleNavClick = (page: string) => {
    // Reset viewing user when navigating away from profile via sidebar
    if (page !== 'Profile') {
      setViewingUserId(null);
    }
    setActivePage(page);
  };

  const baseNavItems = [
    { name: 'Dashboard', icon: HomeIcon, label: 'Beranda' },
    { name: 'Peluang Mitra', icon: BriefcaseIcon, label: 'Peluang' },
  ];

  const navItemsByRole = {
    [UserRole.MEMBER]: [
        ...baseNavItems,
        { name: 'Profile', icon: UserCircleIcon, label: 'Profile' },
    ],
    [UserRole.ADMIN]: [
        ...baseNavItems,
        { name: 'Members', icon: UsersIcon, label: 'Anggota' },
        { name: 'Pengaturan Fitur', icon: QueueListIcon, label: 'Fitur' },
        { name: 'Profile', icon: UserCircleIcon, label: 'Profile' },
    ],
    [UserRole.DEVELOPER]: [
        ...baseNavItems,
        { name: 'Admins', icon: ShieldCheckIcon, label: 'Admin' },
        { name: 'Pengaturan Fitur', icon: QueueListIcon, label: 'Fitur' },
        { name: 'Profile', icon: UserCircleIcon, label: 'Profile' },
    ],
  };

  const navItems = navItemsByRole[userRole];
  
  // Conditionally add Partner Dashboard Hub for any partner role
  if (currentUser.isRetailPartner || currentUser.isLaundryPartner || typeof currentUser.driverBalance === 'number' || currentUser.isSeller) {
      const profileIndex = navItems.findIndex(item => item.name === 'Profile');
      const insertIndex = profileIndex !== -1 ? profileIndex : navItems.length;

      // Check if 'Dasbor Mitra' already exists to avoid duplicates on re-render
      if (!navItems.some(item => item.name === 'Dasbor Mitra')) {
          navItems.splice(insertIndex, 0, {
              name: 'Dasbor Mitra',
              icon: BuildingStorefrontIcon, // Generic Partner Icon
              label: 'Mitra',
          });
      }
  }


  return (
    <aside className="w-16 md:w-64 bg-gradient-to-b from-gold-dark to-gold-DEFAULT text-white flex-col transition-all duration-300 hidden md:flex">
      <div className="flex items-center justify-center md:justify-start md:pl-6 h-16 border-b border-amber-700">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25-2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 3a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m-1.5-3.375C2.063 7.843 2.5 7.5 3 7.5h18c.5 0 .938.343 1.5.875M3 7.5h18" />
        </svg>
        <h1 className="text-2xl font-bold ml-2 hidden md:block">EmaSaku</h1>
      </div>
      <nav className="flex-1 px-2 md:px-4 py-4">
        <ul>
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.name}>
                <button
                  onClick={() => handleNavClick(item.name)}
                  className={`flex items-center w-full p-3 my-1 rounded-lg transition-colors ${
                    activePage === item.name
                      ? 'bg-amber-700'
                      : 'hover:bg-amber-700'
                  }`}
                >
                  <IconComponent className="w-6 h-6" />
                  <span className="ml-4 hidden md:block">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
