import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { NAV_ITEMS } from './TerminalWindow.constants';

interface NavButtonsProps {
  isMobile: boolean;
}

export function NavButtons({ isMobile }: NavButtonsProps) {
  const pathname = usePathname();

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mb-2 flex-wrap justify-center w-full md:justify-normal md:w-auto">
      {NAV_ITEMS.map((item) => {
        const isCurrentPath = pathname === item.path;

        return (
          <Link
            key={item.path}
            href={item.path}
            prefetch={true}
            className={`
              px-3 py-1
              border border-white/20
              rounded-sm
              transition-all duration-200
              whitespace-nowrap
              pointer-events-auto
              ${
                isCurrentPath
                  ? 'bg-white/20 text-white shadow-[inset_0_0_10px_rgba(255,255,255,0.2)] opacity-50 pointer-events-none'
                  : 'bg-black/50 text-white/70 hover:bg-white/10 hover:text-white cursor-pointer'
              }
            `}
          >
            <span className="md:mr-2">{item.label}</span>
            {!isMobile && <span className="text-white/30">[{item.shortcut}]</span>}
          </Link>
        );
      })}
    </div>
  );
}
