import React, { useState } from 'react';
import { UserRole } from '../types.ts';
import { 
    UserCircleIcon as UserCircleIconSolid, 
    ShieldCheckIcon as ShieldCheckIconSolid, 
    CodeBracketSquareIcon as CodeBracketSquareIconSolid 
} from '@heroicons/react/24/solid';

const UserCircleIcon = (UserCircleIconSolid as any).default || UserCircleIconSolid;
const ShieldCheckIcon = (ShieldCheckIconSolid as any).default || ShieldCheckIconSolid;
const CodeBracketSquareIcon = (CodeBracketSquareIconSolid as any).default || CodeBracketSquareIconSolid;

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.MEMBER);

  const roles = [
    { role: UserRole.MEMBER, label: 'Member', icon: UserCircleIcon },
    { role: UserRole.ADMIN, label: 'Admin', icon: ShieldCheckIcon },
    { role: UserRole.DEVELOPER, label: 'Developer', icon: CodeBracketSquareIcon },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-background dark:bg-dark-background p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-surface dark:bg-dark-surface rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
        <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gold-DEFAULT dark:text-gold-light mx-auto">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25-2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 3a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m-1.5-3.375C2.063 7.843 2.5 7.5 3 7.5h18c.5 0 .938.343 1.5.875M3 7.5h18" />
            </svg>
            <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary mt-4">Selamat Datang</h1>
            <p className="mt-2 text-text-secondary dark:text-dark-text-secondary">Pilih peran untuk masuk ke aplikasi EmaSaku.</p>
        </div>

        <div className="mt-8 space-y-3">
            {roles.map(({ role, label, icon: Icon }) => {
                const isSelected = selectedRole === role;
                return (
                    <button 
                        key={role}
                        onClick={() => setSelectedRole(role)}
                        className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all duration-200 ${
                            isSelected 
                            ? 'bg-gold-DEFAULT/10 border-gold-DEFAULT shadow-inner' 
                            : 'border-slate-300 dark:border-slate-600 hover:border-gold-DEFAULT/50 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }`}
                    >
                        <Icon className={`w-6 h-6 transition-colors ${isSelected ? 'text-gold-DEFAULT' : 'text-text-secondary dark:text-dark-text-secondary'}`} />
                        <span className={`font-bold transition-colors ${isSelected ? 'text-gold-dark dark:text-gold-light' : 'text-text-primary dark:text-dark-text-primary'}`}>Masuk sebagai {label}</span>
                    </button>
                );
            })}
        </div>

        <button
          onClick={() => onLogin(selectedRole)}
          className="w-full mt-8 bg-gradient-to-br from-gold-light to-gold-dark text-white font-bold py-3 px-4 rounded-lg transition-opacity hover:opacity-90 shadow-lg shadow-gold-DEFAULT/30"
        >
          Masuk
        </button>
      </div>
    </div>
  );
};

export default LoginPage;