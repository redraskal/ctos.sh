import { useRouter, usePathname } from 'next/navigation';
import { NAV_ITEMS } from './TerminalWindow.constants';

interface NavButtonsProps {
  isMobile: boolean;
}

export function NavButtons({ isMobile }: NavButtonsProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2 flex-wrap ml-auto">
      {NAV_ITEMS.map((item) => {
        const isCurrentPath = pathname === item.path;

        if (!isMobile) {
          return (
            <button
              key={item.path}
              onClick={() => !isCurrentPath && router.push(item.path)}
              disabled={isCurrentPath}
              className={`
                px-3 py-1
                border border-white/20
                rounded-sm
                transition-all duration-200
                whitespace-nowrap
                pointer-events-auto
                ${
                  isCurrentPath
                    ? 'bg-white/20 text-white shadow-[inset_0_0_10px_rgba(255,255,255,0.2)] opacity-50'
                    : 'bg-black/50 text-white/70 hover:bg-white/10 hover:text-white cursor-pointer'
                }
              `}
            >
              <span className="mr-2">{item.label}</span>
              {!isMobile && <span className="text-white/30">[{item.shortcut}]</span>}
            </button>
          );
        } else {
          return (
            <a href={item.path} key={item.path} className="px-3 py-1 transition-all duration-200 whitespace-nowrap">
              {item.label}
            </a>
          );
        }
      })}
    </div>
  );
}
