"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Menu, X, Home, Info, FileText, User, LogOut, LogIn } from 'lucide-react';
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
          >
            <Shield className="h-8 w-8" />
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
              
              const linkClass = isActive
                ? "text-[#752D8B] bg-purple-100 shadow-sm"
                : item.highlight
                ? "text-white bg-[#752D8B] hover:bg-[#5a2269] shadow-md hover:shadow-lg transform hover:scale-105"
                : "text-gray-600 hover:text-[#752D8B] hover:bg-purple-50";
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#752D8B] focus:ring-opacity-50",
                    linkClass
                  )}
                >
                  <IconComponent className="h-4 w-4" />
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

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/dashboard"
                  className="flex items-center space-x-2 text-sm text-gray-700 hover:text-[#752D8B]"
                >
                  <User className="h-4 w-4" />
                  <span>{session.user.name || session.user.email}</span>
                </Link>
                <Button 
                  onClick={handleSignOut} 
                  variant="outline" 
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Déconnexion</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/login">
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <LogIn className="h-4 w-4" />
                    <span>Connexion</span>
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" className="bg-[#752D8B] hover:bg-[#5a2269] flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Inscription</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-600 hover:text-[#752D8B] hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-[#752D8B] focus:ring-opacity-50 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
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
                
                const mobileLinkClass = isActive
                  ? "text-[#752D8B] bg-purple-100 border-l-4 border-[#752D8B]"
                  : item.highlight
                  ? "text-white bg-[#752D8B] shadow-md"
                  : "text-gray-600 hover:text-[#752D8B] hover:bg-purple-50";
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-3 text-base font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#752D8B] focus:ring-opacity-50",
                      mobileLinkClass
                    )}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span className="flex-1">{item.name}</span>
                    {item.highlight && (
                      <span className="px-2 py-1 text-xs font-bold bg-white/20 rounded-full">
                        ✨
                      </span>
                    )}
                  </Link>
                );
              })}
              
              {/* Mobile Auth Section */}
              <div className="border-t border-gray-200 pt-4">
                {session ? (
                  <div className="space-y-2">
                    <Link 
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-3 text-base font-medium text-gray-600 hover:text-[#752D8B] hover:bg-purple-50 rounded-md"
                    >
                      <User className="h-5 w-5" />
                      <span>Tableau de bord</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-3 py-3 text-base font-medium text-gray-600 hover:text-[#752D8B] hover:bg-purple-50 rounded-md w-full text-left"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link 
                      href="/auth/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-3 text-base font-medium text-gray-600 hover:text-[#752D8B] hover:bg-purple-50 rounded-md"
                    >
                      <LogIn className="h-5 w-5" />
                      <span>Connexion</span>
                    </Link>
                    <Link 
                      href="/auth/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-3 text-base font-medium text-white bg-[#752D8B] hover:bg-[#5a2269] rounded-md"
                    >
                      <User className="h-5 w-5" />
                      <span>Inscription</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
