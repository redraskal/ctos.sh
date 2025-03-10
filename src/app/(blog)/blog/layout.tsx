import { berkeleyMono, inter } from '@/app/fonts';
import '@/app/globals.css';
import Analytics from '@/app/components/Analytics';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${berkeleyMono.variable}`}>
      <body className="bg-black text-white antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
