interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  description: string;
}

interface ExperienceProps {
  experience: ExperienceItem[];
}

export default function Experience({ experience }: ExperienceProps) {
  return (
    <section>
      <div className="border-l-2 border-white/50 pl-4 py-2">
        <h3 className="text-white font-bold mb-6 text-xl">EXPERIENCE</h3>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {experience.map((item, index) => (
            <div key={index} className="hover:bg-white/5 transition-colors p-4 rounded">
              <h4 className="font-bold text-white text-lg">{item.title}</h4>
              <p className="text-white/80 text-sm mb-3">
                {item.company} • {item.period}
              </p>
              <p className="text-white leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
