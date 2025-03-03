import ClientTerminal from '@/app/components/ClientTerminal';
import Experience from '@/app/components/Sections/Experience';
import { EXPERIENCE } from '@/data/profile';

export default function ExperiencePage() {
  return (
    <ClientTerminal>
      <Experience experience={EXPERIENCE} />
    </ClientTerminal>
  );
}
