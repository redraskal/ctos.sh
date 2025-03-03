'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import WarGamesTerminal from '../components/WarGamesTerminal/WarGamesTerminal';

interface WarGamesContextType {
  isOpen: boolean;
  toggleTerminal: () => void;
}

const WarGamesContext = createContext<WarGamesContextType>({
  isOpen: false,
  toggleTerminal: () => {},
});

export function useWarGames() {
  return useContext(WarGamesContext);
}

export function WarGamesProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleTerminal = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <WarGamesContext.Provider value={{ isOpen, toggleTerminal }}>
      {children}
      {isOpen && <WarGamesTerminal />}
    </WarGamesContext.Provider>
  );
} 