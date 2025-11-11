import React, { useState } from 'react';
// Fix: Add guard for heroicons
import { XMarkIcon as XMarkIconSolid } from '@heroicons/react/24/solid';
import { UserRole } from '../../types.ts';

// Fix: Add guard for heroicons
const XMarkIcon = (XMarkIconSolid as any).default || XMarkIconSolid;

// Definition for a navigation item, used for configuration.
export interface NavItem {
    id: string;
    section: string;
    iconName: string; 
    label: string;
    actionType: 'page' | 'modal' | 'function';
    actionValue: string;
    isDestructive?: boolean;
    roles?: UserRole[];
}

interface EditNavigationModalProps {
  initialNavItems: NavItem[];
  onClose: () => void;
  onSave: (updatedNavItems: NavItem[]) => void;
}

const EditNavigationModal: React.FC<EditNavigationModalProps> = ({ initialNavItems, onClose, onSave }) => {
  const [navItems, setNavItems] = useState<NavItem[]>(initialNavItems);

  const handleLabelChange = (id: string, newLabel: string) => {
    setNavItems(prev => prev.map(item => item.id === id ? { ...item, label: newLabel } : item));
  };
  
  const handleSave = () => {
    onSave(navItems);
  };

  const sections = [...new Set(initialNavItems.map(item => item.section))];

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-2xl p-6 w-full max-w-2xl relative flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute top-3 right-3 text-slate-400">
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold mb-4">Ubah Navigasi Profil</h2>
        
        <div className="flex-grow overflow-y-auto pr-2 space-y-4">
          {sections.map(section => (
            <div key={section}>
              <h3 className="font-semibold text-lg mb-2 text-primary dark:text-gold-light">{section}</h3>
              <div className="space-y-3">
                {initialNavItems.filter(item => item.section === section).map(item => {
                  const currentItem = navItems.find(i => i.id === item.id) || item;
                  return (
                    <div key={item.id}>
                      <label htmlFor={`nav-item-${item.id}`} className="block text-xs font-medium text-text-secondary dark:text-dark-text-secondary">
                        ID: {item.id} (Action: {item.actionType} &rarr; {item.actionValue})
                      </label>
                      <input
                        id={`nav-item-${item.id}`}
                        type="text"
                        value={currentItem.label}
                        onChange={(e) => handleLabelChange(item.id, e.target.value)}
                        className="w-full p-2 border rounded-md bg-white dark:bg-slate-800 dark:border-slate-600 focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex-shrink-0 flex justify-end gap-3 pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 rounded-md text-sm font-semibold">Batal</button>
          <button type="button" onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold">Simpan Perubahan</button>
        </div>
      </div>
    </div>
  );
};

export default EditNavigationModal;