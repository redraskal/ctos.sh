import ContactLink from './ContactLink';

interface ContactInfo {
  email: string;
  github: string;
  linkedin: string;
  publicKeys: string;
}

interface ContactProps {
  contactInfo: ContactInfo;
}

export default function Contact({ contactInfo }: ContactProps) {
  return (
    <section>
      <div className="border-l-2 border-white/50 pl-4 py-2">
        <h3 className="text-white font-bold mb-3 text-xl">CONTACT</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 sm:gap-y-2 gap-x-2 mb-4 text-base">
          <ContactLink
            label="EMAIL"
            value={contactInfo.email}
            href={`mailto:${contactInfo.email}`}
            external={false}
          />
          
          <ContactLink
            label="GITHUB"
            value={contactInfo.github}
            href={`https://github.com/${contactInfo.github}`}
          />
          
          <ContactLink
            label="LINKEDIN"
            value={contactInfo.linkedin}
            href={`https://www.linkedin.com/in/${contactInfo.linkedin}`}
          />
          
          <ContactLink
            label="PUBLIC KEYS"
            value={contactInfo.publicKeys}
            href={`https://${contactInfo.publicKeys}`}
          />
        </div>
      </div>
    </section>
  );
} 