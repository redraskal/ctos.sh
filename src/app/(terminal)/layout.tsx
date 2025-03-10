import { berkeleyMono, inter } from '@/app/fonts';
import ClientWrapper from '@/app/components/ClientWrapper';
import '@/app/globals.css';
import { Providers } from './providers';
import Analytics from '@/app/components/Analytics';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Benjamin Ryan',
};

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
