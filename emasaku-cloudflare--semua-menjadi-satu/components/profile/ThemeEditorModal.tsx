import React, { useState, useEffect } from 'react';
import { XMarkIcon as XMarkIconSolid, ArrowPathIcon as ArrowPathIconSolid } from '@heroicons/react/24/solid';
import { defaultColorsHex, themeColorLabels, hexToRgb } from '../../theme.ts';

const XMarkIcon = (XMarkIconSolid as any).default || XMarkIconSolid;
const ArrowPathIcon = (ArrowPathIconSolid as any).default || ArrowPathIconSolid;

interface ThemeEditorModalProps {
  onClose: () => void;
  onSave: (newColorsHex: { [key: string]: string }) => void;
}

const ThemeEditorModal: React.FC<ThemeEditorModalProps> = ({ onClose, onSave }) => {
    // Get persisted colors from localStorage or use default
    const getInitialColors = () => {
        try {
            const item = window.localStorage.getItem('appThemeColors');
            if (item) {
                const rgbColors = JSON.parse(item);
                const hexColors: { [key: string]: string } = {};
                for (const key in defaultColorsHex) {
                    const cssVar = `--color-${key.replace(/-/g, '-')}`;
                    const rgb = rgbColors[cssVar];
                    if (rgb) {
                        const [r, g, b] = rgb.split(' ').map(Number);
                        hexColors[key] = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
                    } else {
                         hexColors[key] = defaultColorsHex[key];
                    }
                }
                return hexColors;
            }
        } catch (error) {
            console.error("Failed to parse theme colors from localStorage", error);
        }
        return defaultColorsHex;
    };
    
    const [editableColors, setEditableColors] = useState(getInitialColors());
    
    // Live preview effect
    useEffect(() => {
        const root = document.documentElement;
        for (const key in editableColors) {
            const cssVarName = `--color-${key.replace(/-/g, '-')}`;
            const rgbString = hexToRgb(editableColors[key]);
            root.style.setProperty(cssVarName, rgbString);
        }
    }, [editableColors]);

    const handleColorChange = (key: string, value: string) => {
        setEditableColors(prev => ({ ...prev, [key]: value }));
    };

    const handleReset = () => {
        setEditableColors(defaultColorsHex);
    };

    const handleSave = () => {
        onSave(editableColors);
    };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-2xl p-6 w-full max-w-2xl relative flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute top-3 right-3 text-slate-400">
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold mb-4">Ubah Warna Tema</h2>
        
        <div className="flex-grow overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {Object.entries(editableColors).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                    <label htmlFor={`color-${key}`} className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
                      {themeColorLabels[key] || key}
                    </label>
                    <div className="flex items-center gap-2 border border-slate-300 dark:border-slate-600 rounded-md p-1">
                        <input
                            id={`color-${key}`}
                            type="color"
                            value={value}
                            onChange={(e) => handleColorChange(key, e.target.value.toUpperCase())}
                            className="w-8 h-8 p-0 border-none rounded-md cursor-pointer bg-transparent"
                            style={{'backgroundColor': 'transparent'}}
                        />
                         <input
                            type="text"
                            value={value}
                            onChange={(e) => handleColorChange(key, e.target.value.toUpperCase())}
                            className="w-20 p-1 font-mono text-sm rounded bg-transparent focus:outline-none"
                         />
                    </div>
                </div>
            ))}
        </div>
        
        <div className="flex-shrink-0 flex justify-between items-center pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
          <button 
             onClick={handleReset}
             className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md text-sm font-semibold"
            >
             <ArrowPathIcon className="w-4 h-4" />
            Reset
          </button>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md text-sm font-semibold">Batal</button>
            <button type="button" onClick={handleSave} className="px-6 py-2 bg-primary text-white font-bold rounded-md text-sm">Simpan</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeEditorModal;