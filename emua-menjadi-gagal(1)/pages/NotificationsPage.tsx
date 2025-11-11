import React from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    BellIcon as BellIconSolid,
    CheckIcon as CheckIconSolid,
    XMarkIcon as XMarkIconSolid,
    SpeakerWaveIcon as SpeakerWaveIconSolid,
    SpeakerXMarkIcon as SpeakerXMarkIconSolid
} from '@heroicons/react/24/solid';
import { Notification, NotificationType, User, UserRole, Transaction, TransactionStatus } from '../types.ts';
import { formatDate } from '../utils/formatter.ts';
import useLocalStorage from '../hooks/useLocalStorage.ts';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const BellIcon = (BellIconSolid as any).default || BellIconSolid;
const CheckIcon = (CheckIconSolid as any).default || CheckIconSolid;
const XMarkIcon = (XMarkIconSolid as any).default || XMarkIconSolid;
const SpeakerWaveIcon = (SpeakerWaveIconSolid as any).default || SpeakerWaveIconSolid;
const SpeakerXMarkIcon = (SpeakerXMarkIconSolid as any).default || SpeakerXMarkIconSolid;

interface NotificationsPageProps {
  currentUser: User;
  notifications: Notification[];
  transactions: Transaction[];
  setActivePage: (page: string) => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onTransactionApproval: (transactionId: string, approved: boolean) => void;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ 
    currentUser, 
    notifications, 
    transactions, 
    setActivePage,
    onMarkAsRead,
    onMarkAllAsRead,
    onTransactionApproval
}) => {
    const unreadCount = notifications.filter(n => !n.read).length;
    const isAdmin = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.DEVELOPER;
    const [notificationSoundEnabled, setNotificationSoundEnabled] = useLocalStorage('notificationSoundEnabled', true);

    const handleApproval = (e: React.MouseEvent, transactionId: string, approved: boolean) => {
        e.stopPropagation(); // Prevent the notification item click
        onTransactionApproval(transactionId, approved);
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex items-center mb-6">
                <div className="flex items-center">
                    <button
                        onClick={() => setActivePage('Dashboard')}
                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-4"
                        aria-label="Kembali ke Dasbor"
                    >
                        <ArrowLeftIcon className="w-6 h-6 text-text-primary dark:text-dark-text-primary" />
                    </button>
                    <div className="flex items-center gap-3">
                        <BellIcon className="w-8 h-8 text-primary dark:text-gold-light" />
                        <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">
                            Notifikasi
                        </h1>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-between items-center mb-4 px-1">
                 <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Suara Notifikasi</span>
                    <label htmlFor="sound-toggle" className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            id="sound-toggle"
                            className="sr-only peer"
                            checked={notificationSoundEnabled}
                            onChange={() => setNotificationSoundEnabled((prev: boolean) => !prev)}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 dark:peer-focus:ring-gold-light/50 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                    </label>
                </div>
                {unreadCount > 0 && (
                    <button 
                        onClick={onMarkAllAsRead} 
                        className="text-sm font-semibold text-primary dark:text-gold-light hover:underline"
                    >
                        Tandai semua dibaca
                    </button>
                )}
            </div>

            <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md">
                {notifications.length > 0 ? (
                    <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                        {notifications.map((notif) => {
                            const isApprovalRequest = notif.type === NotificationType.APPROVAL_REQUEST;
                            const relatedTransaction = isApprovalRequest ? transactions.find(t => t.id === notif.relatedId) : null;
                            const isPending = relatedTransaction?.status === TransactionStatus.PENDING;


                            return (
                                <li key={notif.id} className={`${!notif.read ? 'bg-sky-50 dark:bg-sky-900/20' : ''}`}>
                                    <div className="p-4 flex items-start space-x-3">
                                        {!notif.read && <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>}
                                        <div className={`flex-1 ${notif.read ? 'pl-[10px]' : ''}`}>
                                            <p className="font-semibold text-text-primary dark:text-dark-text-primary">{notif.title}</p>
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
                                        {!notif.read && (
                                            <button onClick={() => onMarkAsRead(notif.id)} className="text-xs font-semibold text-blue-600 hover:underline flex-shrink-0">Tandai dibaca</button>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className="text-center p-8 text-sm text-text-secondary dark:text-dark-text-secondary">
                        Tidak ada notifikasi.
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;