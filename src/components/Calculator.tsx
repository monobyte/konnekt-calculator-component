import React, { useState } from 'react';

export interface CalculatorProps {
  className?: string;
}

export const Calculator: React.FC<CalculatorProps> = ({ className = '' }) => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const clearAll = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator) {
      const currentValue = prevValue || 0;
      const newValue = calculate(currentValue, inputValue, operator);
      setPrevValue(newValue);
      setDisplay(String(newValue));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (prevValue: number, nextValue: number, op: string) => {
    switch (op) {
      case '+': return prevValue + nextValue;
      case '-': return prevValue - nextValue;
      case '*': return prevValue * nextValue;
      case '/': return prevValue / nextValue;
      default: return nextValue;
    }
  };

  const handleEqual = () => {
    const inputValue = parseFloat(display);
    if (operator && prevValue !== null) {
      const newValue = calculate(prevValue, inputValue, operator);
      setDisplay(String(newValue));
      setPrevValue(null);
      setOperator(null);
      setWaitingForOperand(true);
    }
  };

  const toggleSign = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const inputPercent = () => {
    setDisplay(String(parseFloat(display) / 100));
  };

  const Button = ({ children, onClick, className = '', variant = 'default' }: any) => {
    const variants: any = {
      default: 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border-zinc-800',
      operator: 'bg-indigo-600 text-white hover:bg-indigo-500 border-indigo-500',
      function: 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border-zinc-700',
    };

    return (
      <button
        onClick={onClick}
        className={`flex h-full w-full items-center justify-center text-xl font-light transition-all active:scale-95 border ${variants[variant]} ${className}`}
      >
        {children}
      </button>
    );
  };

  return (
    <div className={`flex h-full w-full flex-col bg-zinc-950 font-sans text-white ${className}`}>
      {/* Header & Display Container */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between pb-4">
          <h1 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
            Precision / Calc
          </h1>
          <div className="flex gap-1">
            <div className="h-2 w-2 rounded-full bg-zinc-800" />
            <div className="h-2 w-2 rounded-full bg-zinc-800" />
          </div>
        </div>

        {/* Display Area - Shifted up */}
        <div className="flex flex-1 flex-col justify-start pt-4 text-right">
          {operator && prevValue !== null && (
            <div className="mb-1 text-lg font-light text-indigo-400 animate-in fade-in slide-in-from-right-4">
              {prevValue} {operator === '/' ? '÷' : operator === '*' ? '×' : operator}
            </div>
          )}
          <div className="text-8xl font-extralight tracking-tighter sm:text-9xl truncate leading-none">
            {display}
          </div>
        </div>
      </div>
      
      {/* Keypad - Occupies more height to eliminate dead space */}
      <div className="grid h-[75%] w-full grid-cols-4 grid-rows-5 gap-px bg-zinc-900/50 border-t border-zinc-900">
        <Button variant="function" onClick={clearAll}>AC</Button>
        <Button variant="function" onClick={toggleSign}>+/-</Button>
        <Button variant="function" onClick={inputPercent}>%</Button>
        <Button variant="operator" onClick={() => performOperation('/')}>÷</Button>
        
        <Button onClick={() => inputDigit('7')}>7</Button>
        <Button onClick={() => inputDigit('8')}>8</Button>
        <Button onClick={() => inputDigit('9')}>9</Button>
        <Button variant="operator" onClick={() => performOperation('*')}>×</Button>
        
        <Button onClick={() => inputDigit('4')}>4</Button>
        <Button onClick={() => inputDigit('5')}>5</Button>
        <Button onClick={() => inputDigit('6')}>6</Button>
        <Button variant="operator" onClick={() => performOperation('-')}>-</Button>
        
        <Button onClick={() => inputDigit('1')}>1</Button>
        <Button onClick={() => inputDigit('2')}>2</Button>
        <Button onClick={() => inputDigit('3')}>3</Button>
        <Button variant="operator" onClick={() => performOperation('+')}>+</Button>
        
        <Button className="col-span-2" onClick={() => inputDigit('0')}>0</Button>
        <Button onClick={inputDot}>.</Button>
        <Button variant="operator" onClick={handleEqual}>=</Button>
      </div>
    </div>
  );
};
