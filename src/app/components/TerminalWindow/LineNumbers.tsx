export function LineNumbers({ lineCount }: { lineCount: number }) {
  return (
    <div
      className="
          select-none
          pr-4 mr-4
          border-r border-white/20
          text-right text-white/30
          min-w-[3rem]
          hidden
          md:block
        "
    >
      {Array.from({ length: lineCount }, (_, i) => (
        <div key={i + 1} className="leading-6">
          {String(i + 1).padStart(2, '0')}
        </div>
      ))}
    </div>
  );
}
