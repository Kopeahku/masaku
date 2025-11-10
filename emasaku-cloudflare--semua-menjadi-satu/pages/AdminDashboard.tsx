import React from 'react';
import { User, Transaction } from '../types.ts';
import MemberDashboard from './MemberDashboard.tsx';

interface AdminDashboardProps {
  user: User;
  transactions: Transaction[];
  theme: 'light' | 'dark';
  setActivePage: (page: string) => void;
  featureVisibility: Record<string, boolean>;
  onShowComingSoon: (featureName: string) => void;
  getTransactionData: () => Promise<Transaction[]>;
  setInitialWithdrawalTab: (tab: 'bank' | 'ewallet' | 'retail') => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    user, 
    transactions, 
    theme, 
    setActivePage, 
    featureVisibility,
    onShowComingSoon,
    getTransactionData,
    setInitialWithdrawalTab
}) => {
  return (
    <div className="space-y-6">
        {/* The MemberDashboard component now handles rendering admin controls */}
        <MemberDashboard 
            user={user}
            transactions={transactions}
            theme={theme}
            setActivePage={setActivePage}
            featureVisibility={featureVisibility}
            onShowComingSoon={onShowComingSoon}
            getTransactionData={getTransactionData}
            setInitialWithdrawalTab={setInitialWithdrawalTab}
        />
    </div>
  );
};

export default AdminDashboard;