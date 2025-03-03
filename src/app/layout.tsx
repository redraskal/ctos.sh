import { metadata } from './metadata';
import { berkeleyMono, inter } from "./fonts";
import ClientWrapper from './components/ClientWrapper';
import "./globals.css";
import { Providers } from './providers';

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${berkeleyMono.variable}`}>
      <body className="bg-black text-white antialiased">
        <Providers>
          <ClientWrapper>{children}</ClientWrapper>
        </Providers>
      </body>
    </html>
  );
}
