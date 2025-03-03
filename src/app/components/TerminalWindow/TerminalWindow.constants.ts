export interface NavItem {
  label: string;
  path: string;
  shortcut: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'PROFILE', path: '/', shortcut: 'Alt+1' },
  { label: 'PROJECTS', path: '/projects', shortcut: 'Alt+2' },
  { label: 'EXPERIENCE', path: '/experience', shortcut: 'Alt+3' },
  { label: 'CONTACT', path: '/contact', shortcut: 'Alt+4' },
];
