"use client";

import Link from 'next/link';
import { Shield, Mail, Phone, MapPin, FileText, Info, Home, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Logo et Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3 text-white hover:text-purple-300 transition-colors">
              <Shield className="h-8 w-8" />
              <div>
                <span className="font-bold text-xl">Sagga</span>
                <div className="text-sm text-gray-300">L'aventure Solidaire</div>
              </div>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Association d'aide alimentaire en Guyane française, dédiée à soutenir les familles dans le besoin 
              à travers nos épiceries solidaires et notre programme d'Aide Alimentaire d'Urgence (AAU).
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-purple-300">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                  <Home className="h-4 w-4" />
                  <span>Accueil</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                  <Info className="h-4 w-4" />
                  <span>À propos</span>
                </Link>
              </li>
              <li>
                <Link href="/informations" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                  <FileText className="h-4 w-4" />
                  <span>Informations</span>
                </Link>
              </li>
              <li>
                <Link href="/demande" className="flex items-center space-x-2 text-purple-300 hover:text-white transition-colors font-medium">
                  <Heart className="h-4 w-4" />
                  <span>Faire une demande</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-purple-300">Nos Services</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Épiceries solidaires</li>
              <li>• Aide Alimentaire d'Urgence (AAU)</li>
              <li>• Accompagnement social</li>
              <li>• Soutien aux familles</li>
            </ul>
            <div className="pt-2">
              <h4 className="font-medium text-purple-300 mb-2">Nos épiceries :</h4>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>• TI DEGRA - Cayenne</li>
                <li>• TI BAKISCI - Saint-Laurent</li>
                <li>• TI KEKE - Macouria</li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-purple-300">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-purple-300 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">
                    <a href="mailto:contact@sagga.fr" className="hover:text-white transition-colors">
                      contact@sagga.fr
                    </a>
                  </p>
                  <p className="text-gray-300 text-sm">
                    <a href="mailto:administratif@sagga.fr" className="hover:text-white transition-colors">
                      administratif@sagga.fr
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-purple-300 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">05 94 XX XX XX</p>
                  <p className="text-gray-400 text-xs">Du lundi au vendredi</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-purple-300 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">Guyane française</p>
                  <p className="text-gray-400 text-xs">Cayenne, Saint-Laurent, Macouria</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm text-center md:text-left">
              <p>&copy; 2024 Sagga - L'aventure Solidaire. Tous droits réservés.</p>
              <p className="mt-1">Association d'aide alimentaire en Guyane française</p>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <Link href="/mentions-legales" className="hover:text-white transition-colors">
                Mentions légales
              </Link>
              <Link href="/politique-confidentialite" className="hover:text-white transition-colors">
                Politique de confidentialité
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;