interface AboutProps {
  text: string;
}

export default function About({ text }: AboutProps) {
  return (
    <section>
      <div className="border-l-2 border-white/50 pl-4 py-2">
        <h3 className="text-white font-bold mb-2 text-xl">ABOUT</h3>
        <p className="leading-relaxed mb-2 text-white">{text}</p>
      </div>
    </section>
  );
}
