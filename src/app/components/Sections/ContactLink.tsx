interface ContactLinkProps {
  label: string;
  value: string;
  href: string;
  external?: boolean;
}

export default function ContactLink({ label, value, href, external = true }: ContactLinkProps) {
  const linkProps = external ? {
    target: "_blank",
  } : {};

  return (
    <>
      <span className="text-white/80 whitespace-nowrap">{label}:</span>
      <a 
        href={href}
        className="text-white hover:text-white/80 break-all inline-flex items-center"
        {...linkProps}
      >
        <span>{value}</span>
        {external && <span className="ml-1 shrink-0">↗</span>}
      </a>
    </>
  );
} 