import React from 'react';
// Fix: Add .ts extension to the import path
import { Notification, NotificationType, User, UserRole, Transaction, TransactionStatus } from '../../types.ts';
// Fix: Add .ts extension to the import path
import { formatDate } from '../../utils/formatter.ts';
// Fix: Add guard for heroicons
import { 
    CheckIcon as CheckIconSolid, 
    XMarkIcon as XMarkIconSolid 
} from '@heroicons/react/24/solid';

// Fix: Add guard for heroicons
const CheckIcon = (CheckIconSolid as any).default || CheckIconSolid;
const XMarkIcon = (XMarkIconSolid as any).default || XMarkIconSolid;


interface NotificationsPanelProps {
  currentUser: User;
  notifications: Notification[];
  transactions: Transaction[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onTransactionApproval: (transactionId: string, approved: boolean) => void;
  onViewNotifications: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ currentUser, notifications, transactions, onClose, onMarkAsRead, onMarkAllAsRead, onTransactionApproval, onViewNotifications }) => {
  const unreadCount = notifications.filter(n => !n.read).length;
  const isAdmin = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.DEVELOPER;

  const handleApproval = (e: React.MouseEvent, transactionId: string, approved: boolean) => {
    e.stopPropagation(); // Prevent the notification item click
    onTransactionApproval(transactionId, approved);
  };
  
  return (
    <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-surface dark:bg-dark-surface rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in-down flex flex-col">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <h3 className="font-semibold text-text-primary dark:text-dark-text-primary">Notifikasi</h3>
        {unreadCount > 0 && (
          <button 
            onClick={onMarkAllAsRead} 
            className="text-sm text-amber-600 dark:text-amber-400 hover:underline"
          >
            Tandai semua dibaca
          </button>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          <ul>
            {notifications.map((notif) => {
              const isApprovalRequest = notif.type === NotificationType.APPROVAL_REQUEST;
              const relatedTransaction = isApprovalRequest ? transactions.find(t => t.id === notif.relatedId) : null;
              const isPending = relatedTransaction?.status === TransactionStatus.PENDING;

              return (
              <li key={notif.id} className={`${!notif.read ? 'bg-sky-50 dark:bg-sky-900/20' : ''}`}>
                <button 
                  onClick={() => onMarkAsRead(notif.id)}
                  className="w-full text-left p-4 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors flex items-start space-x-3"
                >
                  {!notif.read && <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>}
                  <div className={`flex-1 ${notif.read ? 'pl-5' : ''}`}>
                    <p className="font-semibold text-sm text-text-primary dark:text-dark-text-primary">{notif.title}</p>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{notif.message}</p>
                    <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1">{formatDate(notif.date)}</p>

                    {isAdmin && isApprovalRequest && notif.relatedId && (
                      <div className="mt-3">
                        {isPending ? (
                          <div className="flex gap-2">
                             <button 
                                onClick={(e) => handleApproval(e, notif.relatedId!, true)}
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-1 px-2 rounded-md flex items-center justify-center gap-1 transition-colors"
                             >
                                <CheckIcon className="w-4 h-4"/> Terima
                             </button>
                             <button 
                                onClick={(e) => handleApproval(e, notif.relatedId!, false)}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-1 px-2 rounded-md flex items-center justify-center gap-1 transition-colors"
                             >
                                <XMarkIcon className="w-4 h-4"/> Tolak
                             </button>
                          </div>
                        ) : (
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 italic mt-2">
                            Permintaan ini telah ditindaklanjuti.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              </li>
            )})}
          </ul>
        ) : (
          <div className="text-center p-8 text-sm text-text-secondary dark:text-dark-text-secondary">
            Tidak ada notifikasi.
          </div>
        )}
      </div>
       <div className="p-2 border-t border-slate-200 dark:border-slate-700">
            <button
                onClick={() => {
                    onViewNotifications();
                    onClose();
                }}
                className="w-full text-center text-sm font-semibold text-primary dark:text-gold-light py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
            >
                Lihat Semua Notifikasi
            </button>
        </div>
    </div>
  );
};

export default NotificationsPanel;