import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

interface OracleContextType {
  isOpen: boolean;
  openOracle: () => void;
  closeOracle: () => void;
  toggleOracle: () => void;
}

const OracleContext = createContext<OracleContextType | null>(null);

export function OracleProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openOracle = useCallback(() => setIsOpen(true), []);
  const closeOracle = useCallback(() => setIsOpen(false), []);
  const toggleOracle = useCallback(() => setIsOpen(prev => !prev), []);

  // Keyboard shortcut: Press 'O' to toggle Oracle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.key === 'o' || e.key === 'O') {
        e.preventDefault();
        toggleOracle();
      }

      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        closeOracle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, toggleOracle, closeOracle]);

  return (
    <OracleContext.Provider value={{ isOpen, openOracle, closeOracle, toggleOracle }}>
      {children}
    </OracleContext.Provider>
  );
}

export function useOracle() {
  const context = useContext(OracleContext);
  if (!context) {
    throw new Error('useOracle must be used within OracleProvider');
  }
  return context;
}