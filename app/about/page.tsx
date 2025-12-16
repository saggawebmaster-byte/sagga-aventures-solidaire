import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, Eye, Award, Users, MapPin, Calendar, Network, Heart, ShoppingCart, Handshake, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#752D8B] to-[#5a2269] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            SAGGA
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-8">
            Solidarité Alimentaire Groupe Guyane Antilles
          </h2>
          <p className="text-xl md:text-2xl mb-12 text-purple-100 max-w-4xl mx-auto">
            Fédérer les épiceries sociales et solidaires pour lutter contre la précarité
            alimentaire en Guyane et aux Antilles. Ensemble, construisons un réseau solidaire.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-[#752D8B] hover:bg-gray-100">
              <Link href="/demande">
                Faire une demande d&apos;aide
                <Heart className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-[#752D8B]">
              <Link href="/informations">
                Consulter les informations
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Qui sommes-nous ?
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              SAGGA (Solidarité Alimentaire Groupe Guyane Antilles) est une association loi 1901, créée en 2021
              qui fédère des épiceries sociales et/ou solidaires. Mais aussi les structures habilitées par les
              services de l&apos;État à distribuer de l&apos;aide alimentaire. L&apos;objectif est de participer à la lutte
              contre la précarité alimentaire en Guyane et aux Antilles.
            </p>
          </div>

          {/* Statistics */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-0 shadow-lg text-center bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-[#752D8B] rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-[#752D8B]">630+</CardTitle>
                <CardDescription className="text-gray-600">Épiceries solidaires</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg text-center bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-[#5a2269] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-[#5a2269]">260K</CardTitle>
                <CardDescription className="text-gray-600">Bénéficiaires aidés</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg text-center bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-[#8B4A9C] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-[#8B4A9C]">44M</CardTitle>
                <CardDescription className="text-gray-600">Repas distribués par an</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Mission and Vision */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-[#752D8B] to-[#5a2269] text-white rounded-t-lg">
                <div className="flex items-center">
                  <Target className="h-6 w-6 mr-3" />
                  <CardTitle className="text-xl">Notre Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 leading-relaxed">
                  Lutter contre la précarité alimentaire en fédérant les épiceries sociales et solidaires
                  de Guyane et des Antilles. Nous accompagnons les structures dans leur développement
                  et garantissons l&apos;accès à une alimentation de qualité pour tous, dans le respect de
                  la dignité de chaque personne.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-[#752D8B] to-[#5a2269] text-white rounded-t-lg">
                <div className="flex items-center">
                  <Eye className="h-6 w-6 mr-3" />
                  <CardTitle className="text-xl">Notre Vision</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 leading-relaxed">
                  Construire un territoire où l&apos;accès à une alimentation de qualité est garanti pour tous,
                  en développant un réseau solidaire d'épiceries sociales qui favorise l'autonomie,
                  la dignité et le lien social au sein de nos communautés ultramarines.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
              Nos Valeurs
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-md text-center p-6">
                <div className="w-12 h-12 bg-[#752D8B] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Solidarité</h4>
                <p className="text-sm text-gray-600">L'entraide et le soutien mutuel au cœur de nos actions</p>
              </Card>

              <Card className="border-0 shadow-md text-center p-6">
                <div className="w-12 h-12 bg-[#5a2269] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Dignité</h4>
                <p className="text-sm text-gray-600">Respecter la personne humaine dans toute sa richesse</p>
              </Card>

              <Card className="border-0 shadow-md text-center p-6">
                <div className="w-12 h-12 bg-[#8B4A9C] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Network className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Collaboration</h4>
                <p className="text-sm text-gray-600">Agir ensemble pour plus d'efficacité et d'impact</p>
              </Card>

              <Card className="border-0 shadow-md text-center p-6">
                <div className="w-12 h-12 bg-[#9A5AAD] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Excellence</h4>
                <p className="text-sm text-gray-600">Viser la qualité dans tous nos services et actions</p>
              </Card>
            </div>
          </div>

          {/* Partnership with ANDES and REVIVRE */}
          <Card className="border-0 shadow-lg mb-16 bg-gradient-to-r from-purple-50 to-blue-50">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Handshake className="h-8 w-8 text-[#752D8B] mr-3" />
                <CardTitle className="text-2xl text-gray-900">Partenariat</CardTitle>
              </div>
              <CardDescription className="text-lg">
                Réseau ANDES et Réseau humanitaire REVIVRE
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
                SAGGA est fière d&apos;être partenaire du réseau ANDES, qui regroupe plus de 630 épiceries
                solidaires à travers la France et du réseau humanitaire REVIVRE. Cette collaboration nous permet
                de bénéficier d&apos;une expertise de deux têtes de réseaux nationales tout en adaptant nos actions
                aux spécificités de nos territoires ultramarins.
              </p>
            </CardContent>
          </Card>

          {/* Key Information */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gray-50 rounded-t-lg">
                <div className="flex items-center">
                  <Calendar className="h-6 w-6 text-[#752D8B] mr-3" />
                  <CardTitle className="text-xl text-gray-900">Informations clés</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-[#752D8B] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <p className="font-semibold text-gray-900">Création</p>
                      <p className="text-gray-600">2021</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-[#752D8B] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <p className="font-semibold text-gray-900">Type</p>
                      <p className="text-gray-600">Association loi 1901</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-[#752D8B] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <p className="font-semibold text-gray-900">Réseau</p>
                      <p className="text-gray-600">ANDES, REVIVRE</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gray-50 rounded-t-lg">
                <div className="flex items-center">
                  <MapPin className="h-6 w-6 text-[#752D8B] mr-3" />
                  <CardTitle className="text-xl text-gray-900">Zone d'intervention</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-[#752D8B] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <p className="font-semibold text-gray-900">Guadeloupe</p>
                      <p className="text-gray-600">Épiceries sociales et solidaires</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-[#752D8B] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <p className="font-semibold text-gray-900">Martinique</p>
                      <p className="text-gray-600">Épiceries sociales et solidaires</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-[#752D8B] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <p className="font-semibold text-gray-900">Guyane</p>
                      <p className="text-gray-600">Épiceries sociales et solidaires</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}