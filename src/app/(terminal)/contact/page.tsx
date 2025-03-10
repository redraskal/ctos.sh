import ClientTerminal from '@/app/components/ClientTerminal';
import Contact from '@/app/components/Sections/Contact';
import { CONTACT_INFO } from '@/data/profile';

export default function ContactPage() {
  return (
    <ClientTerminal>
      <Contact contactInfo={CONTACT_INFO} />
    </ClientTerminal>
  );
}
