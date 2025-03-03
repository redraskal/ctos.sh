'use client';

import { ReactNode, useEffect } from 'react';
import SmartMeshCanvas from "@/app/components/MeshCanvas/SmartMeshCanvas";
import GlyphDitherMesh from "@/app/components/GlyphDitherMesh";
import { MeshProvider, useMesh } from "../contexts/MeshContext";
import { WarGamesProvider, useWarGames } from "../contexts/WarGamesContext";

function ClientContent({ children }: { children: ReactNode }) {
  const { meshColor, timeFactor } = useMesh();
  const { toggleTerminal } = useWarGames();

  // Global tilde key handler
  useEffect(() => {
    const handleTildeKey = (e: KeyboardEvent) => {
      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        toggleTerminal();
      }
    };

    window.addEventListener('keydown', handleTildeKey);
    return () => window.removeEventListener('keydown', handleTildeKey);
  }, [toggleTerminal]);

  return (
    <>
      {/* cool background mesh thing */}
      <div className="fixed inset-0">
        <SmartMeshCanvas 
          mesh={GlyphDitherMesh}
          meshProps={{
            backgroundColor: "#000000",
            color: meshColor,
            whirlFactor: 200,
            timeFactor: timeFactor,
            gridSize: 50.0,
          }}
        />
        <div className="absolute inset-0" style={{
          boxShadow: 'inset 0 0 100px 50px black'
        }}></div>
      </div>

      <main className="relative">
        {children}
      </main>
    </>
  );
}

export default function ClientWrapper({ children }: { children: ReactNode }) {
  return (
    <MeshProvider>
      <WarGamesProvider>
        <ClientContent>{children}</ClientContent>
      </WarGamesProvider>
    </MeshProvider>
  );
} 