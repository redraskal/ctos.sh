export default function Scanlines() {
  return (
    <div
      className="
        absolute inset-0
        bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.1)_50%)]
        bg-[length:100%_4px]
        mix-blend-overlay
        animate-scanlines
      "
    />
  );
}
