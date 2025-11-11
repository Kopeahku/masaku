import React, { useState } from 'react';
import { ArrowLeftIcon as ArrowLeftIconSolid, CalculatorIcon as CalculatorIconSolid } from '@heroicons/react/24/solid';

const ArrowLeftIcon = (ArrowLeftIconSolid as any).default || ArrowLeftIconSolid;
const CalculatorIcon = (CalculatorIconSolid as any).default || CalculatorIconSolid;


interface AlatHitungPageProps {
  setActivePage: (page: string) => void;
}

const Button: React.FC<{ onClick: () => void, children: React.ReactNode, className?: string }> = ({ onClick, children, className }) => (
  <button
    onClick={onClick}
    className={`bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-2xl font-semibold text-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${className}`}
  >
    {children}
  </button>
);

const AlatHitungPage: React.FC<AlatHitungPageProps> = ({ setActivePage }) => {
    const [display, setDisplay] = useState('0');
    const [currentValue, setCurrentValue] = useState<number | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [waitingForOperand, setWaitingForOperand] = useState(true);

    const inputDigit = (digit: string) => {
        if (waitingForOperand) {
            setDisplay(digit);
            setWaitingForOperand(false);
        } else {
            setDisplay(display === '0' ? digit : display + digit);
        }
    };

    const inputDecimal = () => {
        if (!display.includes('.')) {
            setDisplay(display + '.');
            setWaitingForOperand(false);
        }
    };

    const clearDisplay = () => {
        setDisplay('0');
        setCurrentValue(null);
        setOperator(null);
        setWaitingForOperand(true);
    };

    const performOperation = (nextOperator: string) => {
        const inputValue = parseFloat(display);

        if (currentValue === null) {
            setCurrentValue(inputValue);
        } else if (operator) {
            const result = calculate(currentValue, inputValue, operator);
            setCurrentValue(result);
            setDisplay(String(result));
        }

        setWaitingForOperand(true);
        setOperator(nextOperator);
    };

    const calculate = (firstOperand: number, secondOperand: number, op: string) => {
        switch (op) {
            case '+': return firstOperand + secondOperand;
            case '-': return firstOperand - secondOperand;
            case '×': return firstOperand * secondOperand;
            case '÷': return firstOperand / secondOperand;
            default: return secondOperand;
        }
    };
    
    const handleEquals = () => {
        const inputValue = parseFloat(display);
        if (operator && currentValue !== null) {
            const result = calculate(currentValue, inputValue, operator);
            setCurrentValue(result);
            setDisplay(String(result));
            setOperator(null);
            setWaitingForOperand(true);
        }
    };

  return (
    <div className="max-w-md mx-auto animate-fade-in">
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
          <CalculatorIcon className="w-8 h-8 text-primary dark:text-gold-light" />
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-dark-text-primary">
            Alat Hitung
          </h1>
        </div>
      </div>

      {/* Calculator Body */}
      <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-md p-4 space-y-4">
        {/* Display */}
        <div className="bg-background dark:bg-dark-background text-right rounded-lg p-4 text-4xl font-mono break-all">
          {display}
        </div>
        {/* Buttons */}
        <div className="grid grid-cols-4 gap-2">
            <Button onClick={clearDisplay} className="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/60 col-span-2">C</Button>
            <Button onClick={() => performOperation('÷')} className="bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-800/60">÷</Button>
            <Button onClick={() => performOperation('×')} className="bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-800/60">×</Button>

            <Button onClick={() => inputDigit('7')}>7</Button>
            <Button onClick={() => inputDigit('8')}>8</Button>
            <Button onClick={() => inputDigit('9')}>9</Button>
            <Button onClick={() => performOperation('-')} className="bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-800/60">-</Button>

            <Button onClick={() => inputDigit('4')}>4</Button>
            <Button onClick={() => inputDigit('5')}>5</Button>
            <Button onClick={() => inputDigit('6')}>6</Button>
            <Button onClick={() => performOperation('+')} className="bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-800/60">+</Button>
            
            <div className="col-span-3 grid grid-cols-3 gap-2">
                <Button onClick={() => inputDigit('1')}>1</Button>
                <Button onClick={() => inputDigit('2')}>2</Button>
                <Button onClick={() => inputDigit('3')}>3</Button>
                <Button onClick={() => inputDigit('0')} className="col-span-2">0</Button>
                <Button onClick={inputDecimal}>.</Button>
            </div>
            <Button onClick={handleEquals} className="bg-gradient-to-br from-gold-light to-gold-dark text-white hover:opacity-90 row-span-2">=</Button>
        </div>
      </div>
    </div>
  );
};

export default AlatHitungPage;