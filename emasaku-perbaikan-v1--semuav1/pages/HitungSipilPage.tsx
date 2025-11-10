import React, { useState } from 'react';
import { 
    ArrowLeftIcon as ArrowLeftIconSolid, 
    BuildingOfficeIcon as BuildingOfficeIconSolid, 
    CalculatorIcon as CalculatorIconSolid 
} from '@heroicons/react/24/solid';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const BuildingOfficeIcon = (BuildingOfficeIconSolid as any).default || BuildingOfficeIconSolid;
const CalculatorIcon = (CalculatorIconSolid as any).default || CalculatorIconSolid;


interface HitungSipilPageProps {
  setActivePage: (page: string) => void;
}

const CalculatorCard: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/10 p-2 rounded-lg">
                <CalculatorIcon className="w-6 h-6 text-primary dark:text-gold-light" />
            </div>
            <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">{title}</h2>
        </div>
        {children}
    </div>
);

const InputField: React.FC<{ label: string, unit: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string }> = ({ label, unit, value, onChange, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
            {label}
        </label>
        <div className="relative">
            <input
                type="number"
                value={value}
                onChange={onChange}
                placeholder={placeholder || "0"}
                className="w-full p-2 pr-12 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none bg-background dark:bg-dark-background dark:border-slate-600"
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-text-secondary dark:text-dark-text-secondary">{unit}</span>
        </div>
    </div>
);

const ResultDisplay: React.FC<{ label: string, value: string | number, unit: string }> = ({ label, value, unit }) => (
    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center animate-fade-in">
        <p className="text-sm text-green-800 dark:text-green-300">{label}</p>
        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {value} <span className="text-lg font-medium">{unit}</span>
        </p>
    </div>
);


const HitungSipilPage: React.FC<HitungSipilPageProps> = ({ setActivePage }) => {
    // State for Brick Calculator
    const [brickInputs, setBrickInputs] = useState({ length: '', height: '' });
    const [brickResult, setBrickResult] = useState<number | null>(null);
    
    // State for Concrete Calculator
    const [concreteInputs, setConcreteInputs] = useState({ length: '', width: '', height: '' });
    const [concreteResult, setConcreteResult] = useState<string | null>(null);

    // State for Paint Calculator
    const [paintInputs, setPaintInputs] = useState({ length: '', height: '', coats: '2' });
    const [paintResult, setPaintResult] = useState<string | null>(null);

    const handleBrickCalc = () => {
        const { length, height } = brickInputs;
        if (length && height) {
            // Standard approx: 70 bricks per m2 for a single-layer wall
            const area = parseFloat(length) * parseFloat(height);
            setBrickResult(Math.ceil(area * 70));
        }
    };

    const handleConcreteCalc = () => {
        const { length, width, height } = concreteInputs;
        if (length && width && height) {
            const volume = parseFloat(length) * parseFloat(width) * parseFloat(height);
            setConcreteResult(volume.toFixed(2));
        }
    };

    const handlePaintCalc = () => {
        const { length, height, coats } = paintInputs;
        if (length && height && coats) {
            // Standard approx: 1 litre of paint covers 12 m2 per coat
            const area = parseFloat(length) * parseFloat(height);
            const totalArea = area * parseInt(coats);
            setPaintResult(Math.ceil(totalArea / 12).toFixed(1));
        }
    };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => setActivePage('Dashboard')}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-4"
          aria-label="Kembali ke Dasbor"
        >
          <ArrowLeftIcon className="w-6 h-6 text-text-primary dark:text-dark-text-primary" />
        </button>
        <div className="flex items-center gap-3">
          <BuildingOfficeIcon className="w-8 h-8 text-primary dark:text-gold-light" />
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">
            Kalkulator Konstruksi
          </h1>
        </div>
      </div>

      {/* Calculator Cards */}
      <div className="space-y-4">
        {/* Brick Calculator */}
        <CalculatorCard title="Kebutuhan Bata">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Panjang Dinding" unit="meter" value={brickInputs.length} onChange={e => setBrickInputs({...brickInputs, length: e.target.value})}/>
                <InputField label="Tinggi Dinding" unit="meter" value={brickInputs.height} onChange={e => setBrickInputs({...brickInputs, height: e.target.value})}/>
            </div>
            <button onClick={handleBrickCalc} className="w-full mt-4 bg-gradient-to-br from-gold-light to-gold-dark text-white hover:opacity-90 font-bold py-2 px-4 rounded-lg transition-colors">
                Hitung Kebutuhan Bata
            </button>
            {brickResult !== null && <ResultDisplay label="Estimasi Kebutuhan Bata" value={brickResult.toLocaleString('id-ID')} unit="buah" />}
        </CalculatorCard>

        {/* Concrete Calculator */}
        <CalculatorCard title="Kebutuhan Beton (Cor)">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField label="Panjang Area" unit="meter" value={concreteInputs.length} onChange={e => setConcreteInputs({...concreteInputs, length: e.target.value})}/>
                <InputField label="Lebar Area" unit="meter" value={concreteInputs.width} onChange={e => setConcreteInputs({...concreteInputs, width: e.target.value})}/>
                <InputField label="Tinggi/Tebal Cor" unit="meter" value={concreteInputs.height} onChange={e => setConcreteInputs({...concreteInputs, height: e.target.value})} placeholder="0.1"/>
            </div>
            <button onClick={handleConcreteCalc} className="w-full mt-4 bg-gradient-to-br from-gold-light to-gold-dark text-white hover:opacity-90 font-bold py-2 px-4 rounded-lg transition-colors">
                Hitung Volume Beton
            </button>
            {concreteResult !== null && <ResultDisplay label="Estimasi Volume Beton" value={concreteResult} unit="m³" />}
        </CalculatorCard>

        {/* Paint Calculator */}
        <CalculatorCard title="Kebutuhan Cat Dinding">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField label="Panjang Dinding" unit="meter" value={paintInputs.length} onChange={e => setPaintInputs({...paintInputs, length: e.target.value})}/>
                <InputField label="Tinggi Dinding" unit="meter" value={paintInputs.height} onChange={e => setPaintInputs({...paintInputs, height: e.target.value})}/>
                <InputField label="Jumlah Lapisan Cat" unit="lapis" value={paintInputs.coats} onChange={e => setPaintInputs({...paintInputs, coats: e.target.value})}/>
            </div>
            <button onClick={handlePaintCalc} className="w-full mt-4 bg-gradient-to-br from-gold-light to-gold-dark text-white hover:opacity-90 font-bold py-2 px-4 rounded-lg transition-colors">
                Hitung Kebutuhan Cat
            </button>
            {paintResult !== null && <ResultDisplay label="Estimasi Kebutuhan Cat" value={paintResult} unit="liter" />}
        </CalculatorCard>
      </div>
    </div>
  );
};

export default HitungSipilPage;