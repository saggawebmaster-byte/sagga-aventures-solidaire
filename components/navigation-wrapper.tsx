"use client";

import { usePathname } from 'next/navigation';
import Navigation from '@/components/navigation';

interface NavigationWrapperProps {
  readonly children: React.ReactNode;
}

export function NavigationWrapper({ children }: Readonly<NavigationWrapperProps>) {
  const pathname = usePathname();
  
  // Ne pas afficher la navigation sur les pages d'authentification
  const isAuthPage = pathname?.startsWith('/auth/') || pathname === '/login';
  
  if (isAuthPage) {
    return <>{children}</>;
  }
  
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50">
        {children}
      </main>
    </>
  );
}
