'use client';

import { ReactNode } from 'react';
import { MeshProvider } from './contexts/MeshContext';
import { TerminalProvider } from './contexts/TerminalContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MeshProvider>
      <TerminalProvider>
        {children}
      </TerminalProvider>
    </MeshProvider>
  );
} 