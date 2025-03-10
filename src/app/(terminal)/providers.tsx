'use client';

import { ReactNode } from 'react';
import { MeshProvider } from '@/app/(terminal)/contexts/MeshContext';
import { TerminalProvider } from '@/app/(terminal)/contexts/TerminalContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MeshProvider>
      <TerminalProvider>{children}</TerminalProvider>
    </MeshProvider>
  );
}
