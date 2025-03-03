export function Title({ text }: { text: string }) {
  return (
    <div
      className="
        flex justify-center items-center w-full
        text-white/50 text-sm tracking-wider uppercase
        pointer-events-none
        "
    >
      {text}
    </div>
  );
}
