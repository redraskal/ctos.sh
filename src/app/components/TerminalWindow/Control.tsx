export function Control({
  label,
  color,
  pulseColor,
  onClick,
}: {
  label: string;
  color: string;
  pulseColor: string;
  onClick?: () => void;
}) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick?.();
  };

  return (
    <div className="group relative hover:cursor-pointer" onClick={handleClick}>
      {/* button */}
      <div
        className={`
          w-12 h-5
          ${color}
          border border-white/20
          shadow-[inset_0_0_2px_rgba(255,255,255,0.5)]
          skew-x-12
          select-none
        `}
      >
        {/* LED */}
        <div
          className={`
            absolute right-1 top-1/2 -translate-y-1/2
            w-1.5 h-1.5
            ${pulseColor}
            rounded-full
            shadow-[0_0_5px_currentColor]
            animate-pulse
          `}
        />
      </div>

      {/* label */}
      <span
        className="
          absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          text-[8px] font-bold tracking-wider
          text-white/70
          group-hover:text-white
          transition-colors
          select-none
        "
      >
        {label}
      </span>

      {/* glow */}
      <div
        className={`
          absolute inset-0
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
          shadow-[0_0_10px_rgba(255,255,255,0.3)]
          skew-x-12
        `}
      />
    </div>
  );
}
