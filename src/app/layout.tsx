import { metadata } from './metadata';
import { berkeleyMono, inter } from './fonts';
import ClientWrapper from '@/app/components/ClientWrapper';
import './globals.css';
import { Providers } from './providers';
import Analytics from '@/app/components/Analytics';

export { metadata };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${berkeleyMono.variable}`}>
      <body className="bg-black text-white antialiased">
        <Providers>
          <ClientWrapper>{children}</ClientWrapper>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
