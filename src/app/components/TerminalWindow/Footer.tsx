import { ReactNode } from 'react';
import { NavButtons } from './NavButtons';
import { Control } from './Control';

interface FooterProps {
  isGameTerminal?: boolean;
  isMobile: boolean;
  children?: ReactNode;
  onHalClick?: () => void;
}

export function Footer({ isGameTerminal = false, isMobile, children, onHalClick }: FooterProps) {
  return (
    <div
      className="
        relative
        flex items-center justify-between
        px-4 py-2
        bg-gradient-to-r from-white/10 via-white/5 to-white/10
        border-t-2 border-white/20
        text-xs text-white/50
        flex-wrap gap-2
      "
    >
      {!isGameTerminal && !isMobile && onHalClick && (
        <div className="flex gap-3 z-10">
          <Control
            label="HAL"
            color="bg-gradient-to-r from-red-900/50 to-red-700/50"
            pulseColor="bg-red-400"
            onClick={onHalClick}
          />
        </div>
      )}

      {children}

      {!isGameTerminal && <NavButtons isMobile={isMobile} />}
    </div>
  );
}
