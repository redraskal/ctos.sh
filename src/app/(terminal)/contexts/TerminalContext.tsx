'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';

export interface Position {
  x: number;
  y: number;
}

interface TerminalState {
  position: Position;
  zIndex: number;
}

interface TerminalContextType {
  terminalStates: { [key: string]: TerminalState };
  updateTerminalPosition: (id: string, position: Position) => void;
  bringToFront: (id: string) => void;
}

const TerminalContext = createContext<TerminalContextType>({
  terminalStates: {},
  updateTerminalPosition: () => {},
  bringToFront: () => {},
});

export function TerminalProvider({ children }: { children: ReactNode }) {
  const isInitialized = useRef(false);

  const calculateCenteredPosition = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const isMobile = screenWidth < 768;

    const terminalWidth = isMobile ? screenWidth : Math.min(1024, screenWidth * 0.9);
    const terminalHeight = isMobile ? screenHeight : Math.min(700, screenHeight * 0.8);

    return {
      x: isMobile ? 0 : Math.max(0, (screenWidth - terminalWidth) / 2),
      y: isMobile ? 0 : Math.max(0, (screenHeight - terminalHeight) / 2),
    };
  };

  const [terminalStates, setTerminalStates] = useState<{ [key: string]: TerminalState }>(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('terminalStates');
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);

          return {
            main: parsedState.main,
            wargames: {
              position: calculateCenteredPosition(),
              zIndex: 2,
            },
          };
        } catch (error) {
          console.warn('Failed to parse saved terminal state:', error);
        }
      }

      // If no saved state, calculate initial centered position
      const centeredPos = calculateCenteredPosition();

      const initialState = {
        main: { position: centeredPos, zIndex: 1 },
        wargames: {
          position: centeredPos,
          zIndex: 2,
        },
      };

      localStorage.setItem('terminalStates', JSON.stringify(initialState));
      return initialState;
    }

    // Fallback for SSR
    return {
      main: { position: { x: 0, y: 0 }, zIndex: 1 },
      wargames: { position: { x: 0, y: 0 }, zIndex: 2 },
    };
  });
  const [maxZIndex, setMaxZIndex] = useState(2);

  // Save state to localStorage on change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('terminalStates', JSON.stringify(terminalStates));
    }
  }, [terminalStates]);

  // Only recalculate positions on window resize
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      return;
    }

    const handleResize = () => {
      const centeredPos = calculateCenteredPosition();

      setTerminalStates((prev) => {
        const newState = {
          main: { position: centeredPos, zIndex: prev.main.zIndex },
          wargames: {
            position: centeredPos,
            zIndex: prev.wargames.zIndex,
          },
        };
        localStorage.setItem('terminalStates', JSON.stringify(newState));
        return newState;
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateTerminalPosition = (id: string, position: Position) => {
    setTerminalStates((prev) => {
      const newState = {
        ...prev,
        [id]: { ...prev[id], position },
      };
      localStorage.setItem('terminalStates', JSON.stringify(newState));
      return newState;
    });
  };

  const bringToFront = (id: string) => {
    setMaxZIndex((prev) => prev + 1);

    // center the wargames terminal
    if (id === 'wargames') {
      setTerminalStates((prev) => {
        const newState = {
          ...prev,
          [id]: {
            position: calculateCenteredPosition(),
            zIndex: maxZIndex + 1,
          },
        };
        localStorage.setItem('terminalStates', JSON.stringify(newState));
        return newState;
      });
    } else {
      setTerminalStates((prev) => {
        const newState = {
          ...prev,
          [id]: { ...prev[id], zIndex: maxZIndex + 1 },
        };
        localStorage.setItem('terminalStates', JSON.stringify(newState));
        return newState;
      });
    }
  };

  return (
    <TerminalContext.Provider value={{ terminalStates, updateTerminalPosition, bringToFront }}>
      {children}
    </TerminalContext.Provider>
  );
}

export function useTerminal() {
  return useContext(TerminalContext);
}
