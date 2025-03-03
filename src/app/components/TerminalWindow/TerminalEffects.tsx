'use client';

export default function TerminalEffects() {
  return (
    <>
      {/* scanlines */}
      <div className="
        pointer-events-none
        absolute inset-0
        bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.1)_50%)]
        bg-[length:100%_4px]
        mix-blend-overlay
        animate-scanlines
      "/>

      {/* crt glow */}
      <div className="
        pointer-events-none
        absolute inset-0
        bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_100%)]
        opacity-50
      "/>

      {/* screen flicker */}
      <div className="
        pointer-events-none
        absolute inset-0
        bg-white/5
        mix-blend-overlay
        animate-flicker
      "/>
    </>
  );
} 