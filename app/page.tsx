import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, HandHeart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#752D8B] to-[#5a2269] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Sagga
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-8">
            L'aventure Solidaire
          </h2>
          <p className="text-xl md:text-2xl mb-12 text-purple-100 max-w-3xl mx-auto">
            Ensemble, construisons un avenir solidaire. Notre organisme s'engage à accompagner
            chaque personne dans son parcours vers l'autonomie et l'épanouissement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-[#752D8B] hover:bg-gray-100">
              <Link href="/demande">
                Faire une demande
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-[#752D8B] hover:bg-white hover:text-[#752D8B]">
              <Link href="/about">En savoir plus</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Notre Mission
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Sagga - L'aventure Solidaire œuvre pour créer des liens durables et offrir un soutien
              concret aux personnes en situation de vulnérabilité.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-[#752D8B] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Accompagnement</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  Nous accompagnons chaque personne dans son parcours personnel et professionnel
                  avec bienveillance et professionnalisme.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-[#752D8B] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Communauté</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  Nous créons du lien social et favorisons l'entraide au sein de notre communauté
                  pour construire un avenir commun.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-[#752D8B] rounded-full flex items-center justify-center mx-auto mb-4">
                  <HandHeart className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Solidarité</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  Notre action s'appuie sur des valeurs de solidarité, d'égalité et de respect
                  mutuel pour un impact durable.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Prêt à commencer votre aventure solidaire ?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Découvrez comment nous pouvons vous accompagner dans votre démarche.
            Consultez les informations nécessaires ou faites directement votre demande.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-[#752D8B] hover:bg-[#5a2269]">
              <Link href="/informations">
                Consulter les informations
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-[#752D8B] text-[#752D8B] hover:bg-[#752D8B] hover:text-white">
              <Link href="/demande">
                Faire une demande
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}