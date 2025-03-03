'use client';

import { ReactNode } from 'react';
import { MeshProvider } from '@/app/contexts/MeshContext';
import { TerminalProvider } from '@/app/contexts/TerminalContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MeshProvider>
      <TerminalProvider>{children}</TerminalProvider>
    </MeshProvider>
  );
}
