import { Title } from './Title';
import { Control } from './Control';

interface TitleBarProps {
  title: string;
  isGameTerminal?: boolean;
  isMobile: boolean;
  onClose?: () => void;
}

export function TitleBar({ title, isGameTerminal = false, isMobile, onClose }: TitleBarProps) {
  return (
    <div
      className={`
        terminal-title-bar
        relative
        flex items-center
        px-4 py-2
        bg-gradient-to-r from-white/10 via-white/5 to-white/10
        border-b-2 border-white/20
        ${!isMobile ? 'cursor-grab active:cursor-grabbing' : ''}
        select-none
      `}
    >
      <Title text={title} />

      {isGameTerminal && (
        <div className="flex gap-3 z-10">
          <Control
            label="EXIT"
            color="bg-gradient-to-r from-red-900/50 to-red-700/50"
            pulseColor="bg-red-400"
            onClick={onClose}
          />
        </div>
      )}
    </div>
  );
}
