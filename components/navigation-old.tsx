"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Menu, X, Home, Info, FileText, Settings, User, LogOut, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useSession, signOut } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  const navigation = [
    { name: 'Accueil', href: '/', icon: Home },
    { name: 'À propos', href: '/about', icon: Info },
    { name: 'Informations', href: '/informations', icon: FileText },
    { name: 'Faire une demande', href: '/demande', icon: FileText, highlight: true },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 text-[#752D8B] hover:text-[#5a2269] transition-colors focus:outline-none focus:ring-2 focus:ring-[#752D8B] focus:ring-opacity-50 rounded-md p-1"
            aria-label="Retour à l'accueil - Saga, L'aventure Solidaire"
          >
            <Shield className="h-8 w-8" aria-hidden="true" />
            <div className="hidden sm:block">
              <span className="font-bold text-lg">Sagga</span>
              <div className="text-xs text-gray-600">L&apos;aventure Solidaire</div>
            </div>
            <span className="font-bold text-lg sm:hidden">Sagga</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-2">
            {navigation.map((item) => {
              const IconComponent = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#752D8B] focus:ring-opacity-50",
                    isActive
                      ? "text-[#752D8B] bg-purple-100 shadow-sm"
                      : item.highlight
                      ? "text-white bg-[#752D8B] hover:bg-[#5a2269] shadow-md hover:shadow-lg transform hover:scale-105"
                      : "text-gray-600 hover:text-[#752D8B] hover:bg-purple-50"
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <IconComponent className="h-4 w-4" aria-hidden="true" />
                  <span>{item.name}</span>
                  {item.highlight && (
                    <span className="ml-2 px-2 py-1 text-xs font-bold bg-white/20 rounded-full">
                      ✨
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* User account and authentication links */}
          <div className="hidden md:flex items-center space-x-4">
            {!session?.user ? (
              <>
                <Link 
                  href="/login" 
                  className="text-gray-600 hover:text-[#752D8B] transition-colors"
                  aria-label="Se connecter"
                >
                  <LogIn className="h-5 w-5" aria-hidden="true" />
                </Link>
                <Link 
                  href="/register" 
                  className="text-gray-600 hover:text-[#752D8B] transition-colors"
                  aria-label="S'inscrire"
                >
                  <User className="h-5 w-5" aria-hidden="true" />
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">{session.user.name}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => signOut()}
                  className="text-gray-600 hover:text-[#752D8B] transition-colors"
                  aria-label="Se déconnecter"
                >
                  <LogOut className="h-5 w-5" aria-hidden="true" />
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-600 hover:text-[#752D8B] hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-[#752D8B] focus:ring-opacity-50 transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label="Ouvrir le menu de navigation"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-3 text-base font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#752D8B] focus:ring-opacity-50",
                      isActive
                        ? "text-[#752D8B] bg-purple-100 border-l-4 border-[#752D8B]"
                        : item.highlight
                        ? "text-white bg-[#752D8B] shadow-md"
                        : "text-gray-600 hover:text-[#752D8B] hover:bg-purple-50"
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <IconComponent className="h-5 w-5" aria-hidden="true" />
                    <span className="flex-1">{item.name}</span>
                    {item.highlight && (
                      <span className="px-2 py-1 text-xs font-bold bg-white/20 rounded-full">
                        ✨
                      </span>
                    )}
                    {isActive && (
                      <span className="sr-only">(page actuelle)</span>
                    )}
                  </Link>
                );
              })}
            </div>
            
            {/* Contact info in mobile menu */}
            <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
              <div className="text-xs text-gray-600 space-y-1">
                <p className="font-medium">Besoin d&apos;aide ?</p>
                <p>📞 05 94 XX XX XX</p>
                <p>📧 aide@commune-apatou.fr</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;