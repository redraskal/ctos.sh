import ClientTerminal from '@/app/components/ClientTerminal';
import Projects from '@/app/components/Sections/Projects';
import { PROJECTS } from '@/data/profile';

export default function ProjectsPage() {
  return (
    <ClientTerminal>
      <Projects projects={PROJECTS} />
    </ClientTerminal>
  );
}
