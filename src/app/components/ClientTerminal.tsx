'use client';

import { ReactNode } from 'react';
import TerminalWindow from "./TerminalWindow/TerminalWindow";
import { useMesh } from '../contexts/MeshContext';

export default function ClientTerminal({ children }: { children: ReactNode }) {
  const { handleHalClick } = useMesh();

  return (
    <div className="min-h-screen flex items-center justify-center p-0 sm:p-8">
      <TerminalWindow onHalClick={handleHalClick} terminalId="main">
        <div className="p-4 sm:p-8">
          {children}
        </div>
      </TerminalWindow>
    </div>
  );
} 