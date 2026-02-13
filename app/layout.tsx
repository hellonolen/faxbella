import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ConvexClientProvider } from './ConvexClientProvider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
});

export const metadata: Metadata = {
  title: 'FaxBella - AI-Powered Fax Routing | faxbella.com',
  description: 'Route incoming faxes to the right person automatically using AI. Send and receive faxes with intelligent routing.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
