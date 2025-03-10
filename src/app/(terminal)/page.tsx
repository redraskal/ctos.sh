'use client';

import TerminalWindow from '@/app/components/TerminalWindow';
import About from '@/app/components/Sections/About';
import { ABOUT_TEXT } from '@/data/profile';
import { useMesh } from '@/app/(terminal)/contexts/MeshContext';

export default function Home() {
  const { handleHalClick } = useMesh();

  return (
    <main className="min-h-screen flex items-center justify-center">
      <TerminalWindow onHalClick={handleHalClick} terminalId="main">
        <About text={ABOUT_TEXT} />
      </TerminalWindow>
    </main>
  );
}
