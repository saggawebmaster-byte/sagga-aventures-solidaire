"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Users, DollarSign, Receipt, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const DocumentSection = ({ title, icon: Icon, documents }: {
  title: string;
  icon: any;
  documents: string[];
}) => (
  <Card className="border-0 shadow-md">
    <CardHeader className="bg-gradient-to-r from-[#752D8B] to-[#5a2269] text-white rounded-t-lg">
      <CardTitle className="flex items-center text-lg">
        <Icon className="h-5 w-5 mr-2" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-6">
      <ul className="space-y-3">
        {documents.map((doc, index) => (
          <li key={index} className="flex items-start">
            <ChevronRight className="h-4 w-4 text-[#752D8B] mt-0.5 mr-2 flex-shrink-0" />
            <span className="text-gray-700 text-sm leading-relaxed">{doc}</span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

export default function Informations() {
  const [selectedProfile, setSelectedProfile] = useState<'employed' | 'unemployed' | 'social_benefits' | null>(null);

  const scrollToSection = (profileType: 'employed' | 'unemployed' | 'social_benefits') => {
    setSelectedProfile(profileType);
    const element = document.getElementById(profileType);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const unemployedDocs = {
    identity: [
      "Photocopie de la Carte d'identité ou passeport (en cours de validité).",
      "Photocopie de la Carte de résident en cours de validité (1an).",
      "Photocopie du Livret de famille ou Extrait de naissance des enfants."
    ],
    resources: [
      "Contrat CER - DICS.",
      "Justificatif de ressources (CAF - Sécurité Sociale).",
      "Notification \"Maison Départementale des Personnes Handicapées [MDPH]\".",
      "Photocopie de la Carte d'invalidité."
    ],
    charges: [
      "Photocopie du dernier Avis d'imposition ou de non-imposition N-1.",
      "Contrat de location et les 3 dernières quittances de loyer.",
      "Attestation d'hébergement + Photocopie de la pièce d'identité de la personne qui héberge.",
      "Factures EDF, SGDE et téléphone.",
      "Justificatif des dettes."
    ]
  };

  const employedDocs = {
    identity: [
      "Photocopie de la Carte d'identité ou passeport (en cours de validité).",
      "Photocopie de la Carte de résident en cours de validité (1an).",
      "Photocopie du Livret de famille ou Extrait de naissance des enfants."
    ],
    resources: [
      "Bulletins de salaires (3 derniers).",
      "Justificatif de ressources (CAF - Sécurité Sociale).",
      "Notification \"Maison Départementale des Personnes Handicapées [MDPH]\".",
      "Photocopie de la Carte d'invalidité.",
      "Contrat CER."
    ],
    charges: [
      "Photocopie du dernier Avis d'imposition ou de non-imposition.",
      "Contrat de location et les 3 dernières quittances de loyer.",
      "Justificatifs autres revenus (loyers-pensions alimentaires).",
      "Titre de propriété de biens déjà détenus.",
      "Tableau d'amortissement ou décompte des prêts en cours.",
      "Attestation d'hébergement + Photocopie de la pièce d'identité de la personne qui héberge.",
      "Factures EDF, SGDE et téléphone.",
      "Justificatif des dettes."
    ]
  };

  const socialBenefitsDocs = {
    identity: [
      "Photocopie de la Carte d'identité ou passeport (en cours de validité).",
      "Photocopie de la Carte de résident en cours de validité (1an).",
      "Photocopie du Livret de famille ou Extrait de naissance des enfants."
    ],
    resources: [
      "Notification CAF (RSA, AAH, Prime d'activité, etc.).",
      "Justificatif de ressources (CAF - Sécurité Sociale).",
      "Notification \"Maison Départementale des Personnes Handicapées [MDPH]\".",
      "Photocopie de la Carte d'invalidité.",
      "Justificatif de pension de retraite ou d'invalidité.",
      "Attestation de versement des minimas sociaux."
    ],
    charges: [
      "Photocopie du dernier Avis d'imposition ou de non-imposition N-1.",
      "Contrat de location et les 3 dernières quittances de loyer.",
      "Attestation d'hébergement + Photocopie de la pièce d'identité de la personne qui héberge.",
      "Factures EDF, SGDE et téléphone.",
      "Justificatif des dettes.",
      "Relevés bancaires (3 derniers mois)."
    ]
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#752D8B] to-[#5a2269] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Informations
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-8">
            Pièces justificatives nécessaires
          </h2>
          <p className="text-xl md:text-2xl mb-12 text-purple-100 max-w-4xl mx-auto">
            Selon votre profil, découvrez les documents à fournir pour votre demande d&apos;aide alimentaire.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-[#752D8B] hover:bg-gray-100">
              <Link href="/demande">
                Faire une demande
                <FileText className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-[#752D8B]">
              <Link href="/about">
                À propos de SAGGA
                <Users className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Les pièces jointes à fournir
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              En fonction de votre situation, les justificatifs à fournir ne seront pas les mêmes.
            </p>
            <p className="text-lg text-gray-700 mb-8">
              Cliquez sur une des situations afin d&apos;atteindre la section de la page vous correspondant.
            </p>

            {/* Profile Selection Buttons */}
            <div className="flex flex-col md:flex-row gap-4 justify-center max-w-6xl mx-auto">
              <Button
                onClick={() => scrollToSection('employed')}
                variant="outline"
                size="lg"
                className={`p-6 h-auto text-left border-2 transition-all hover:bg-[#752D8B] hover:text-white hover:border-[#752D8B] ${selectedProfile === 'employed' ? 'bg-[#752D8B] text-white border-[#752D8B]' : 'border-gray-300'
                  }`}
              >
                <div>
                  <div className="font-semibold mb-2">HP - HORS PLAFOND</div>
                  <div className="text-sm opacity-90">
                    Vous exercez une activité professionnelle <br /> (Ressources liées à l&apos;emploi)
                  </div>
                </div>
              </Button>

              <Button
                onClick={() => scrollToSection('unemployed')}
                variant="outline"
                size="lg"
                className={`p-6 h-auto text-left border-2 transition-all hover:bg-[#752D8B] hover:text-white hover:border-[#752D8B] ${selectedProfile === 'unemployed' ? 'bg-[#752D8B] text-white border-[#752D8B]' : 'border-gray-300'
                  }`}
              >
                <div>
                  <div className="font-semibold mb-2">HMS - HORS MINIMA SOCIAL</div>
                  <div className="text-sm opacity-90">
                    Vous n&apos;exercez pas d&apos;activité professionnelle <br /> (Ressources sans activité)
                  </div>
                </div>
              </Button>

              <Button
                onClick={() => scrollToSection('social_benefits')}
                variant="outline"
                size="lg"
                className={`p-6 h-auto text-left border-2 transition-all hover:bg-[#752D8B] hover:text-white hover:border-[#752D8B] ${selectedProfile === 'social_benefits' ? 'bg-[#752D8B] text-white border-[#752D8B]' : 'border-gray-300'
                  }`}
              >
                <div>
                  <div className="font-semibold mb-2">MS - MINIMA SOCIAL</div>
                  <div className="text-sm opacity-90">
                    Vous percevez un minima social <br /> (Ressources sociales)
                  </div>
                </div>
              </Button>
            </div>
          </div>

          <Separator className="my-12" />

          {/* Employed Profile */}
          <section id="employed" className="mb-16">
            <div className="mb-8">
              <Badge variant="secondary" className="mb-4 bg-[#752D8B] text-white">
                HP - HORS PLAFOND
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Vous exercez une activité professionnelle
              </h2>
              <p className="text-gray-600">
                Ressources liées à l&apos;emploi - Vous travaillez actuellement
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <DocumentSection
                title="IDENTITÉ"
                icon={Users}
                documents={employedDocs.identity}
              />
              <DocumentSection
                title="RESSOURCES"
                icon={DollarSign}
                documents={employedDocs.resources}
              />
              <DocumentSection
                title="CHARGES"
                icon={Receipt}
                documents={employedDocs.charges}
              />
            </div>
          </section>

          <Separator className="my-12" />

          {/* Unemployed Profile */}
          <section id="unemployed" className="mb-16">
            <div className="mb-8">
              <Badge variant="secondary" className="mb-4 bg-[#752D8B] text-white">
                HMS - HORS MINIMA SOCIAL
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Vous n&apos;exercez pas d&apos;activité professionnelle
              </h2>
              <p className="text-gray-600">
                Ressources sans activité - Vous ne travaillez pas et ne bénéficiez pas de minimas sociaux
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <DocumentSection
                title="IDENTITÉ"
                icon={Users}
                documents={unemployedDocs.identity}
              />
              <DocumentSection
                title="RESSOURCES"
                icon={DollarSign}
                documents={unemployedDocs.resources}
              />
              <DocumentSection
                title="CHARGES"
                icon={Receipt}
                documents={unemployedDocs.charges}
              />
            </div>
          </section>

          <Separator className="my-12" />

          {/* Social Benefits Profile */}
          <section id="social_benefits" className="mb-16">
            <div className="mb-8">
              <Badge variant="secondary" className="mb-4 bg-[#752D8B] text-white">
                MS - MINIMA SOCIAL
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Vous percevez un minima social
              </h2>
              <p className="text-gray-600">
                Ressources sociales - Vous bénéficiez de prestations sociales (RSA, AAH, etc.)
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <DocumentSection
                title="IDENTITÉ"
                icon={Users}
                documents={socialBenefitsDocs.identity}
              />
              <DocumentSection
                title="RESSOURCES"
                icon={DollarSign}
                documents={socialBenefitsDocs.resources}
              />
              <DocumentSection
                title="CHARGES"
                icon={Receipt}
                documents={socialBenefitsDocs.charges}
              />
            </div>
          </section>

          {/* Call to Action */}
          <div className="text-center bg-gray-100 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Prêt à faire votre demande ?
            </h3>
            <p className="text-gray-600 mb-6">
              Assurez-vous d&apos;avoir tous les documents requis selon votre catégorie avant de procéder à votre demande.
            </p>
            <Button asChild size="lg" className="bg-[#752D8B] hover:bg-[#5a2269]">
              <a href="/demande">Faire une demande</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}