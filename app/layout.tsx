import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { NavigationWrapper } from '@/components/navigation-wrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sagga - L\'aventure Solidaire',
  description: 'Organisme solidaire - Sagga, l\'aventure solidaire',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <NavigationWrapper>
          {children}
        </NavigationWrapper>
        <Toaster />
      </body>
    </html>
  );
}