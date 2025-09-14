"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, Menu, X, Home, Info, FileText, User, LogOut, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useSession, signOut } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { AdminLink } from '@/components/admin-guard';

const Navigation = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  const navigation = [
    { name: 'Accueil', href: '/', icon: Home },
    { name: 'À propos', href: '/about', icon: Info },
    { name: 'Informations', href: '/informations', icon: FileText },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth/login');
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
                </Link>
              );
            })}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <AdminLink>
                  <Link
                    href="/admin"
                    className="flex items-center space-x-2 text-sm text-gray-700 hover:text-[#752D8B] px-2 py-1 rounded-md hover:bg-purple-50"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                </AdminLink>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <User className="h-4 w-4" />
                  <span>{session.user.name || session.user.email}</span>
                </div>
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
              <Link href="/demande">
                <Button size="sm" className="bg-[#752D8B] hover:bg-[#5a2269] shadow-md hover:shadow-lg transform hover:scale-105 flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Faire une demande</span>
                  <span className="ml-2 px-2 py-1 text-xs font-bold bg-white/20 rounded-full">
                    ✨
                  </span>
                </Button>
              </Link>
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
                  </Link>
                );
              })}

              {/* Mobile Auth Section */}
              <div className="border-t border-gray-200 pt-4">
                {session ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 px-3 py-3 text-base font-medium text-gray-600">
                      <User className="h-5 w-5" />
                      <span>{session.user.name || session.user.email}</span>
                    </div>
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
                      href="/demande"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-3 text-base font-medium text-white bg-[#752D8B] hover:bg-[#5a2269] rounded-md shadow-md"
                    >
                      <FileText className="h-5 w-5" />
                      <span className="flex-1">Faire une demande</span>
                      <span className="px-2 py-1 text-xs font-bold bg-white/20 rounded-full">
                        ✨
                      </span>
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
