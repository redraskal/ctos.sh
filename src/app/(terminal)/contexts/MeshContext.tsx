'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface Position {
  x: number;
  y: number;
}

interface TerminalPositionContextType {
  position: Position;
  setPosition: (position: Position | ((prev: Position) => Position)) => void;
}

interface MeshContextType {
  meshColor: string;
  timeFactor: number;
  handleHalClick: () => void;
}

const MeshContext = createContext<MeshContextType | undefined>(undefined);
const TerminalPositionContext = createContext<TerminalPositionContextType>({
  position: { x: 0, y: 0 },
  setPosition: () => {},
});

export function TerminalPositionProvider({ children }: { children: ReactNode }) {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  return (
    <TerminalPositionContext.Provider value={{ position, setPosition }}>{children}</TerminalPositionContext.Provider>
  );
}

export function useTerminalPosition() {
  return useContext(TerminalPositionContext);
}

export function MeshProvider({ children }: { children: ReactNode }) {
  const [meshColor, setMeshColor] = useState('#a7a7a7');
  const [timeFactor, setTimeFactor] = useState(0.2);

  const handleHalClick = () => {
    setMeshColor((prev) => (prev === '#a7a7a7' ? '#cc0000' : '#a7a7a7'));
    setTimeFactor((prev) => prev * -1);
  };

  return (
    <MeshContext.Provider value={{ meshColor, timeFactor, handleHalClick }}>
      <TerminalPositionProvider>{children}</TerminalPositionProvider>
    </MeshContext.Provider>
  );
}

export function useMesh() {
  const context = useContext(MeshContext);
  if (context === undefined) {
    throw new Error('useMesh must be used within a MeshProvider');
  }
  return context;
}
