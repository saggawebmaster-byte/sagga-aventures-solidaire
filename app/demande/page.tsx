"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import HouseholdMemberForm, { HouseholdMember } from '@/components/household-member-form';
import FileUploadSection, { FileInfo } from '@/components/file-upload-section';
import FormProgressIndicator from '@/components/form-progress-indicator';
import HelpSidebar from '@/components/help-sidebar';
import DateInput from '@/components/date-input';
import { getAvailableCities, getCodePostalForFormVille } from '@/lib/email-config';
import { AlertCircle, Plus, Users, DollarSign, Receipt, Send, FileText, Info, Phone, MapPin, User, Mail, MessageSquare, ArrowRight, Clock, Heart } from 'lucide-react';
import Link from 'next/link';

export default function Demande() {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    dateNaissance: '',
    sexe: '',
    situation: '',
    email: '',
    telephoneFixe: '',
    telephonePortable: '',
    adresse: '',
    complementAdresse: '',
    codePostal: '',
    ville: 'Cayenne',
    aau: false,
    commentaires: ''
  });

  // Initialisation avec 0 membres par défaut
  // L'utilisateur qui remplit le formulaire compte déjà comme 1 personne
  const [householdMembers, setHouseholdMembers] = useState<HouseholdMember[]>([]);
  const [identityFiles, setIdentityFiles] = useState<FileInfo[]>([]);
  const [resourceFiles, setResourceFiles] = useState<FileInfo[]>([]);
  const [chargeFiles, setChargeFiles] = useState<FileInfo[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  // Gérer le changement de ville quand le statut AAU change
  useEffect(() => {
    // Obtenir les villes disponibles pour le statut AAU actuel
    const availableCities = getAvailableCities(formData.aau);
    const currentCityAvailable = availableCities.some(city => city.value === formData.ville);

    // Si la ville actuelle n'est pas disponible pour le nouveau statut AAU,
    // on sélectionne automatiquement la première ville disponible
    if (!currentCityAvailable && availableCities.length > 0) {
      handleInputChange('ville', availableCities[0].value);
    }
  }, [formData.aau, formData.ville]); // Se déclenche quand le statut AAU ou la ville change

  // Gérer les membres du foyer selon la situation familiale
  useEffect(() => {
    const singlePersonSituations = ['celibataire', 'concubinage', 'veuf'];

    if (singlePersonSituations.includes(formData.situation)) {
      // Pour les situations permettant d'être seul, on vide les membres s'ils sont tous vides
      // Cela permet de nettoyer quand on passe de "marié" à "célibataire"
      const hasAnyFilledMember = householdMembers.some(member =>
        member.nom || member.prenom || member.sexe || member.dateNaissance
      );

      if (!hasAnyFilledMember && householdMembers.length > 0) {
        setHouseholdMembers([]);
      }
    } else if (formData.situation && householdMembers.length === 0) {
      // Pour les autres situations, s'il n'y a pas de membre, on en ajoute un par défaut
      const newMember: HouseholdMember = {
        id: `member-${Date.now()}`,
        nom: '',
        prenom: '',
        sexe: '',
        dateNaissance: ''
      };
      setHouseholdMembers([newMember]);
    }
  }, [formData.situation, householdMembers]);

  // Déterminer la section actuelle basée sur l'état du formulaire
  const getCurrentSection = () => {
    const requiredPersonalFields = ['prenom', 'nom', 'dateNaissance', 'sexe', 'situation', 'email', 'adresse', 'codePostal'];
    const personalInfoComplete = requiredPersonalFields.every(field => formData[field as keyof typeof formData]);

    if (!personalInfoComplete) return 'personal-info';
    if (householdMembers.length === 0 && identityFiles.length === 0 && resourceFiles.length === 0 && chargeFiles.length === 0) return 'household';
    if (identityFiles.length === 0 || resourceFiles.length === 0 || chargeFiles.length === 0) return 'documents';
    return 'submission';
  };

  const currentSection = getCurrentSection();

  // Données d'aide contextuelle
  const helpTips = [
    {
      id: 'personal-info',
      title: 'Informations personnelles',
      content: 'Remplissez tous les champs obligatoires avec les informations exactes de votre pièce d\'identité. Assurez-vous que l\'orthographe correspond exactement.',
      type: 'info' as const
    },
    {
      id: 'household',
      title: 'Composition du foyer',
      content: 'Ajoutez toutes les personnes vivant sous votre toit : conjoint(e), enfants, parents à charge, etc. Ces informations sont importantes pour le calcul de vos droits.',
      type: 'tip' as const
    },
    {
      id: 'documents',
      title: 'Documents requis',
      content: 'Uploadez des documents lisibles et récents. Si un document est manquant, votre demande pourra être retardée. Consultez la page informations pour la liste complète.',
      type: 'warning' as const
    },
    {
      id: 'submission',
      title: 'Envoi de la demande',
      content: 'Une fois envoyée, votre demande sera traitée sous 5 jours ouvrés. Vous recevrez un accusé de réception par email.',
      type: 'success' as const
    }
  ];

  const getStepStatus = (stepId: string) => {
    const stepOrder = ['personal-info', 'household', 'documents', 'submission'];
    const currentIndex = stepOrder.indexOf(currentSection);
    const stepIndex = stepOrder.indexOf(stepId);

    if (stepIndex < currentIndex) return 'completed' as const;
    if (stepIndex === currentIndex) return 'current' as const;
    return 'upcoming' as const;
  };

  const progressSteps = [
    {
      id: 'personal-info',
      title: 'Informations personnelles',
      description: 'Vos données personnelles et de contact',
      status: getStepStatus('personal-info')
    },
    {
      id: 'household',
      title: 'Composition foyer',
      description: 'Membres de votre famille',
      status: getStepStatus('household')
    },
    {
      id: 'documents',
      title: 'Documents',
      description: 'Pièces justificatives',
      status: getStepStatus('documents')
    },
    {
      id: 'submission',
      title: 'Validation',
      description: 'Vérification et envoi',
      status: getStepStatus('submission')
    }
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => {
      const newFormData = { ...prev, [field]: value };

      // Si la ville change, remplir automatiquement le code postal
      if (field === 'ville' && typeof value === 'string') {
        const codePostal = getCodePostalForFormVille(value);
        if (codePostal) {
          newFormData.codePostal = codePostal;
        }
      }

      return newFormData;
    });
  };

  const addHouseholdMember = () => {
    const newMember: HouseholdMember = {
      id: `member-${Date.now()}`,
      nom: '',
      prenom: '',
      sexe: '',
      dateNaissance: ''
    };
    setHouseholdMembers(prev => [...prev, newMember]);
  };

  const updateHouseholdMember = (updatedMember: HouseholdMember) => {
    setHouseholdMembers(prev =>
      prev.map(member => member.id === updatedMember.id ? updatedMember : member)
    );
  };

  const removeHouseholdMember = (id: string) => {
    setHouseholdMembers(prev => prev.filter(member => member.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Filtrer les membres du foyer valides
      const validHouseholdMembers = householdMembers.filter(member =>
        member.nom && member.prenom && member.sexe && member.dateNaissance
      );

      // Situations où le demandeur peut être seul dans le foyer
      const singlePersonSituations = ['celibataire', 'concubinage', 'veuf'];
      const canBeSinglePerson = singlePersonSituations.includes(formData.situation);

      // Calculer le nombre total de personnes dans le foyer
      const totalPersons = canBeSinglePerson && validHouseholdMembers.length === 0 ? 1 : validHouseholdMembers.length + 1;

      // Préparer les données pour l'API
      const demandeData = {
        ...formData,
        membresfoyer: validHouseholdMembers,
        nombrePersonnesFoyer: totalPersons, // Nouveau champ pour le calcul correct
        fichiers: [
          ...identityFiles.map(file => ({ ...file, categorie: 'IDENTITE' as const })),
          ...resourceFiles.map(file => ({ ...file, categorie: 'RESSOURCES' as const })),
          ...chargeFiles.map(file => ({ ...file, categorie: 'CHARGES' as const })),
        ],
      };

      const response = await fetch('/api/demandes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(demandeData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitMessage('Votre demande a été envoyée avec succès. Nous vous contacterons dans les plus brefs délais.');
        // Réinitialiser le formulaire
        setFormData({
          prenom: '',
          nom: '',
          dateNaissance: '',
          sexe: '',
          situation: '',
          email: '',
          telephoneFixe: '',
          telephonePortable: '',
          adresse: '',
          complementAdresse: '',
          codePostal: '',
          ville: 'Cayenne',
          aau: false,
          commentaires: ''
        });
        setHouseholdMembers([]);
        setIdentityFiles([]);
        setResourceFiles([]);
        setChargeFiles([]);
      } else {
        setSubmitMessage(`Erreur lors de l'envoi de votre demande: ${result.error}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setSubmitMessage('Une erreur est survenue lors de l\'envoi de votre demande. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    const requiredFields = ['prenom', 'nom', 'dateNaissance', 'sexe', 'situation', 'email', 'adresse', 'codePostal'];
    const basicFieldsValid = requiredFields.every(field => formData[field as keyof typeof formData]);

    // Situations permettant un foyer d'une seule personne
    const singlePersonSituations = ['celibataire', 'concubinage', 'veuf'];
    const canBeSinglePerson = singlePersonSituations.includes(formData.situation);

    if (canBeSinglePerson) {
      return basicFieldsValid; // Pas besoin de membres du foyer
    }

    // Pour marie/pacse/divorce : au moins un membre requis
    const hasValidHouseholdMember = householdMembers.some(member =>
      member.nom && member.prenom && member.sexe && member.dateNaissance
    );

    return basicFieldsValid && hasValidHouseholdMember;
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        {/* Hero Section */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-8 sm:mb-12">
          <div className="relative">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#752D8B]/10 to-blue-50/30 z-0 opacity-70"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23752D8B' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}>
            </div>

            <div className="relative z-10 px-6 py-10 md:px-12 md:py-16 flex flex-col md:flex-row items-center">
              {/* Left side - Text content */}
              <div className="md:w-3/5 text-center md:text-left md:pr-10">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#752D8B]/10 text-[#752D8B] font-medium text-sm mb-4">
                  <div className="w-2 h-2 bg-[#752D8B] rounded-full mr-2"></div>
                  <span>Étape 1: Remplir le formulaire</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                  Faire votre demande <span className="text-[#752D8B]">d&apos;aide sociale</span>
                </h1>

                <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 leading-relaxed">
                  Remplissez ce formulaire avec attention. Tous les champs marqués
                  d&apos;un astérisque <span className="text-[#752D8B] font-semibold">(*)</span> sont obligatoires.
                </p>

                <div className="bg-gradient-to-r from-[#752D8B]/10 to-blue-100/30 rounded-lg p-4 sm:p-5 border-l-4 border-[#752D8B] flex items-start space-x-3 sm:space-x-4 mb-4 md:mb-0 text-left">
                  <div className="bg-white rounded-full p-2 shadow-sm flex-shrink-0">
                    <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-[#752D8B]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Préparez vos documents</p>
                    <p className="text-gray-700 text-xs sm:text-sm">
                      Assurez-vous d&apos;avoir tous vos justificatifs sous format numérique.
                      <br className="hidden sm:block" />
                      <span className="sm:hidden"> </span>Vous pouvez sauvegarder et reprendre votre demande à tout moment.
                    </p>
                    <Link href="/informations" className="inline-flex items-center text-xs sm:text-sm font-medium text-[#752D8B] hover:text-[#5a2269] mt-2">
                      Voir la liste des documents requis
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right side - Illustration */}
              <div className="hidden md:block md:w-2/5 mt-8 md:mt-0">
                <div className="relative">
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#752D8B]/10 rounded-full"></div>
                  <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-100/50 rounded-full"></div>
                  <div className="relative z-10 bg-white p-6 rounded-lg shadow-md border border-gray-100">
                    <div className="w-full h-48 bg-gradient-to-br from-[#752D8B]/20 to-blue-100/30 rounded-lg flex items-center justify-center">
                      <FileText className="h-20 w-20 text-[#752D8B]/70" />
                    </div>
                    <div className="mt-6 space-y-3">
                      <div className="h-2 bg-gray-200 rounded-full w-full"></div>
                      <div className="h-2 bg-gray-200 rounded-full w-5/6"></div>
                      <div className="h-2 bg-gray-200 rounded-full w-4/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Helper bar */}
          <div className="bg-gray-50 px-4 sm:px-6 py-4 flex flex-col sm:flex-row flex-wrap items-center justify-between gap-3 sm:gap-2 border-t border-gray-100">
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span>Durée estimée: 10-15 minutes</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#752D8B] hover:text-[#5a2269] hover:bg-[#752D8B]/10 text-xs sm:text-sm"
              onClick={() => setShowHelp(!showHelp)}
            >
              <Info className="h-4 w-4 mr-2" />
              <span>Besoin d&apos;aide ?</span>
            </Button>
          </div>
        </div>

        {/* Progress Indicator - Version simplifiée pour mobile */}
        <div className="mb-8 hidden md:block">
          <FormProgressIndicator
            steps={progressSteps}
            currentStep={currentSection}
          />
        </div>

        {/* Progress Indicator simplifié pour mobile */}
        <div className="mb-8 md:hidden px-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex flex-col items-center space-y-1 flex-1">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#752D8B] text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm">1</div>
              <span className="text-gray-700 text-center">Info</span>
            </div>
            <div className="w-6 sm:w-8 h-0.5 bg-gray-300 -mt-4"></div>
            <div className="flex flex-col items-center space-y-1 flex-1">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm">2</div>
              <span className="text-gray-500 text-center">Docs</span>
            </div>
            <div className="w-6 sm:w-8 h-0.5 bg-gray-300 -mt-4"></div>
            <div className="flex flex-col items-center space-y-1 flex-1">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm">3</div>
              <span className="text-gray-500 text-center">Envoi</span>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <Alert className="mb-8 border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 sm:h-4 sm:w-4 text-orange-600 flex-shrink-0" />
          <AlertDescription className="text-orange-800 text-xs sm:text-sm">
            <strong>Information importante :</strong> Avant de procéder à la demande, veuillez vous assurer que vous possédez toutes les pièces jointes requises.
            Si vous avez un doute, consultez la liste des pièces jointes nécessaires{' '}
            <Link href="/informations" className="underline font-medium hover:text-orange-900">
              ici
            </Link>.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-[#752D8B] to-[#5a2269] text-white rounded-t-lg">
              <CardTitle className="text-lg sm:text-xl flex items-center">
                <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
                <span className="truncate">Informations personnelles</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="prenom" className="text-sm font-medium text-gray-700 flex items-center">
                    Prénom *
                    <Info className="h-4 w-4 ml-1 text-gray-400" />
                  </Label>
                  <Input
                    id="prenom"
                    type="text"
                    value={formData.prenom}
                    onChange={(e) => handleInputChange('prenom', e.target.value)}
                    placeholder="Ex: Marie, Jean, Pierre..."
                    className="transition-all duration-200 focus:ring-2 focus:ring-[#752D8B] focus:border-[#752D8B]"
                    required
                    aria-describedby="prenom-help"
                  />
                  <p id="prenom-help" className="text-xs text-gray-500">
                    Votre prénom tel qu&apos;il apparaît sur votre pièce d&apos;identité
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nom" className="text-sm font-medium text-gray-700 flex items-center">
                    Nom *
                    <Info className="h-4 w-4 ml-1 text-gray-400" />
                  </Label>
                  <Input
                    id="nom"
                    type="text"
                    value={formData.nom}
                    onChange={(e) => handleInputChange('nom', e.target.value)}
                    placeholder="Ex: Dupont, Martin, Bernard..."
                    className="transition-all duration-200 focus:ring-2 focus:ring-[#752D8B] focus:border-[#752D8B]"
                    required
                    aria-describedby="nom-help"
                  />
                  <p id="nom-help" className="text-xs text-gray-500">
                    Votre nom de famille tel qu&apos;il apparaît sur votre pièce d&apos;identité
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <DateInput
                    id="dateNaissance"
                    value={formData.dateNaissance}
                    onChange={(value) => handleInputChange('dateNaissance', value)}
                    label="Date de naissance"
                    placeholder="Votre date de naissance"
                    required={true}
                    helpText="Sélectionnez votre date de naissance complète"
                    aria-describedby="date-help"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sexe" className="text-sm font-medium text-gray-700">
                    Sexe *
                  </Label>
                  <Select value={formData.sexe} onValueChange={(value) => handleInputChange('sexe', value)}>
                    <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-[#752D8B] focus:border-[#752D8B] w-full">
                      <SelectValue placeholder="Sélectionner votre sexe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="femme">Femme</SelectItem>
                      <SelectItem value="homme">Homme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="situation" className="text-sm font-medium text-gray-700">
                    Situation *
                  </Label>
                  <Select value={formData.situation} onValueChange={(value) => handleInputChange('situation', value)}>
                    <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-[#752D8B] focus:border-[#752D8B] w-full">
                      <SelectValue placeholder="Sélectionner votre situation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="celibataire">Célibataire</SelectItem>
                      <SelectItem value="marie">Marié(e)</SelectItem>
                      <SelectItem value="pacse">Pacsé(e)</SelectItem>
                      <SelectItem value="divorce">Divorcé(e)</SelectItem>
                      <SelectItem value="veuf">Veuf/Veuve</SelectItem>
                      <SelectItem value="concubinage">En concubinage</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    Choisissez la situation qui correspond le mieux à votre cas
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    Adresse email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Ex: marie.dupont@email.com"
                    className="transition-all duration-200 focus:ring-2 focus:ring-[#752D8B] focus:border-[#752D8B]"
                    required
                    aria-describedby="email-help"
                  />
                  <p id="email-help" className="text-xs text-gray-500">
                    Nous utiliserons cette adresse pour vous contacter
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telephonePortable" className="text-sm font-medium text-gray-700 flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    Téléphone portable
                  </Label>
                  <Input
                    id="telephonePortable"
                    type="tel"
                    value={formData.telephonePortable}
                    onChange={(e) => handleInputChange('telephonePortable', e.target.value)}
                    placeholder="Ex: 06 94 XX XX XX"
                    className="transition-all duration-200 focus:ring-2 focus:ring-[#752D8B] focus:border-[#752D8B]"
                    aria-describedby="mobile-help"
                  />
                  <p id="mobile-help" className="text-xs text-gray-500">
                    Format recommandé: 06 94 XX XX XX
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telephoneFixe" className="text-sm font-medium text-gray-700 flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  Téléphone fixe
                </Label>
                <Input
                  id="telephoneFixe"
                  type="tel"
                  value={formData.telephoneFixe}
                  onChange={(e) => handleInputChange('telephoneFixe', e.target.value)}
                  placeholder="Ex: 05 94 XX XX XX"
                  className="transition-all duration-200 focus:ring-2 focus:ring-[#752D8B] focus:border-[#752D8B]"
                  aria-describedby="phone-help"
                />
                <p id="phone-help" className="text-xs text-gray-500">
                  Optionnel - Format: 05 94 XX XX XX
                </p>
              </div>
            </CardContent>
          </Card>

          {/* AAU - Aide Alimentaire d'Urgence */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-[#752D8B] to-[#5a2269] text-white rounded-t-lg">
              <CardTitle className="text-lg sm:text-xl flex items-center">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
                <span className="truncate">AAU - Aide Alimentaire d&apos;Urgence</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <Checkbox
                    id="aau"
                    checked={formData.aau}
                    onCheckedChange={(checked) => handleInputChange('aau', checked)}
                    className="data-[state=checked]:bg-[#752D8B] data-[state=checked]:border-[#752D8B]"
                  />
                  <div className="flex-1">
                    <Label htmlFor="aau" className="text-sm font-medium text-gray-700 cursor-pointer">
                      Je souhaite bénéficier de l&apos;Aide Alimentaire d&apos;Urgence (AAU)
                    </Label>
                    <p className="text-xs text-gray-600 mt-1">
                      Cette aide est destinée aux personnes en situation de précarité alimentaire urgente
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>


          {/* Address */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-[#752D8B] to-[#5a2269] text-white rounded-t-lg">
              <CardTitle className="text-lg sm:text-xl flex items-center">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
                <span className="truncate">Adresse de résidence</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="adresse" className="text-sm font-medium text-gray-700">
                  Adresse principale *
                </Label>
                <Input
                  id="adresse"
                  type="text"
                  value={formData.adresse}
                  onChange={(e) => handleInputChange('adresse', e.target.value)}
                  placeholder="Ex: 123 Rue de la République"
                  className="transition-all duration-200 focus:ring-2 focus:ring-[#752D8B] focus:border-[#752D8B]"
                  required
                  aria-describedby="adresse-help"
                />
                <p id="adresse-help" className="text-xs text-gray-500">
                  Numéro et nom de la rue, avenue, boulevard...
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="complementAdresse" className="text-sm font-medium text-gray-700">
                  Complément d&apos;adresse
                </Label>
                <Input
                  id="complementAdresse"
                  type="text"
                  value={formData.complementAdresse}
                  onChange={(e) => handleInputChange('complementAdresse', e.target.value)}
                  placeholder="Ex: Appartement 3B, Résidence Les Palmiers, Bâtiment A..."
                  className="transition-all duration-200 focus:ring-2 focus:ring-[#752D8B] focus:border-[#752D8B]"
                  aria-describedby="complement-help"
                />
                <p id="complement-help" className="text-xs text-gray-500">
                  Optionnel - Appartement, résidence, bâtiment, étage...
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="codePostal" className="text-sm font-medium text-gray-700">
                    Code postal *
                  </Label>
                  <Input
                    id="codePostal"
                    type="text"
                    value={formData.codePostal}
                    onChange={(e) => handleInputChange('codePostal', e.target.value)}
                    placeholder="Ex: 97300"
                    className="transition-all duration-200 focus:ring-2 focus:ring-[#752D8B] focus:border-[#752D8B]"
                    required
                    pattern="[0-9]{5}"
                    maxLength={5}
                    aria-describedby="cp-help"
                  />
                  <p id="cp-help" className="text-xs text-gray-500">
                    5 chiffres - Ex: 97300 pour Cayenne
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ville" className="text-sm font-medium text-gray-700">
                    Ville *
                  </Label>
                  <Select value={formData.ville} onValueChange={(value) => handleInputChange('ville', value)}>
                    <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-[#752D8B] focus:border-[#752D8B]">
                      <SelectValue placeholder="Sélectionner votre ville" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableCities(formData.aau).map((city) => (
                        <SelectItem key={city.value} value={city.value}>
                          {city.label} {city.type === 'CCAS' && '(CCAS)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p id="ville-help" className="text-xs text-gray-500">
                    Sélectionnez votre commune de résidence
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>


          {/* Household Members */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-[#752D8B] to-[#5a2269] text-white rounded-t-lg">
              <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span className="text-lg sm:text-xl flex items-center">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
                  <span className="truncate">Membres du foyer</span>
                </span>
                {formData.situation && (
                  <Badge className="bg-white text-[#752D8B] text-xs sm:text-sm whitespace-nowrap">
                    {(() => {
                      const singlePersonSituations = ['celibataire', 'concubinage', 'veuf'];
                      const canBeSinglePerson = singlePersonSituations.includes(formData.situation);
                      const validMembers = householdMembers.filter(member =>
                        member.nom && member.prenom && member.sexe && member.dateNaissance
                      ).length;

                      // Si c'est une situation de personne seule ET qu'il n'y a pas de membres ajoutés
                      if (canBeSinglePerson && validMembers === 0) {
                        return '1 personne';
                      }

                      // Sinon, on compte les membres valides + la personne qui remplit le formulaire
                      const totalPersons = validMembers + 1;
                      return `${totalPersons} ${totalPersons > 1 ? 'personnes' : 'personne'}`;
                    })()}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Message informatif basé sur la situation */}
              {formData.situation && (
                <div className="mb-6">
                  {['celibataire', 'concubinage', 'veuf'].includes(formData.situation) ? (
                    <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start space-x-2 sm:space-x-3">
                        <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-blue-800">
                            Foyer d&apos;une seule personne
                          </p>
                          <p className="text-xs text-blue-700 mt-1">
                            Pour votre situation ({(() => {
                              if (formData.situation === 'celibataire') return 'célibataire';
                              if (formData.situation === 'concubinage') return 'en concubinage';
                              return 'veuf/veuve';
                            })()}),
                            vous pouvez laisser cette section vide si vous vivez seul(e).
                            Ajoutez uniquement les personnes qui vivent sous votre toit et à votre charge.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 sm:p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-start space-x-2 sm:space-x-3">
                        <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-orange-800">
                            Membres du foyer requis
                          </p>
                          <p className="text-xs text-orange-700 mt-1">
                            Pour votre situation, veuillez ajouter au moins un membre de votre foyer
                            (conjoint(e), enfants, personnes à charge, etc.).
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div>
                <div className="hidden md:grid grid-cols-12 text-xs font-semibold text-gray-500 px-14 py-2 border-b border-gray-100 bg-gray-50 rounded-t-lg">
                  <div className="col-span-3">Prénom</div>
                  <div className="col-span-3">Nom</div>
                  <div className="col-span-2">Sexe</div>
                  <div className="col-span-4">Date de naissance</div>
                </div>

                {/* Liste des membres */}
                <div className="space-y-2 py-2">
                  {householdMembers.map((member, index) => (
                    <HouseholdMemberForm
                      key={member.id}
                      member={member}
                      onUpdate={updateHouseholdMember}
                      onRemove={() => removeHouseholdMember(member.id)}
                      index={index}
                    />
                  ))}
                </div>
              </div>

              {/* Bouton pour ajouter un autre membre */}
              <div className="mt-4 text-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addHouseholdMember}
                  className="border-dashed border-gray-400 hover:border-[#752D8B] text-gray-600 hover:text-[#752D8B]"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter un membre du foyer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* File Uploads */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-[#752D8B] to-[#5a2269] text-white rounded-t-lg">
              <CardTitle className="text-lg sm:text-xl flex items-center">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
                <span className="truncate">Documents justificatifs</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-6 p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-800 text-xs sm:text-sm">
                  <strong>📄 Documents requis :</strong> Uploadez vos documents dans les catégories correspondantes.
                  Formats acceptés: PDF, JPG, PNG, Word. Taille max: 1MB par fichier.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <FileUploadSection
                  title="IDENTITÉ"
                  icon={Users}
                  files={identityFiles}
                  onFilesChange={setIdentityFiles}
                  categorie="IDENTITE"
                />
                <FileUploadSection
                  title="RESSOURCES"
                  icon={DollarSign}
                  files={resourceFiles}
                  onFilesChange={setResourceFiles}
                  categorie="RESSOURCES"
                />
                <FileUploadSection
                  title="CHARGES"
                  icon={Receipt}
                  files={chargeFiles}
                  onFilesChange={setChargeFiles}
                  categorie="CHARGES"
                />
              </div>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-[#752D8B] to-[#5a2269] text-white rounded-t-lg">
              <CardTitle className="text-lg sm:text-xl flex items-center">
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
                <span className="truncate">Informations complémentaires</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="commentaires" className="text-sm font-medium text-gray-700">
                  Commentaires et précisions
                </Label>
                <Textarea
                  id="commentaires"
                  placeholder="Décrivez votre situation particulière, vos difficultés, ou toute information que vous jugez utile pour votre demande...

Exemples:
- Difficultés financières particulières
- Situation de santé
- Urgence de la demande
- Autres aides déjà perçues..."
                  value={formData.commentaires}
                  onChange={(e) => handleInputChange('commentaires', e.target.value)}
                  rows={6}
                  className="transition-all duration-200 focus:ring-2 focus:ring-[#752D8B] focus:border-[#752D8B] resize-none"
                  aria-describedby="commentaires-help"
                />
                <p id="commentaires-help" className="text-xs text-gray-500">
                  Optionnel - Ces informations nous aideront à mieux comprendre votre situation
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="text-center bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
            {submitMessage && (
              <Alert className={`mb-6 ${submitMessage.includes('succès') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                <AlertCircle className={`h-4 w-4 flex-shrink-0 ${submitMessage.includes('succès') ? 'text-green-600' : 'text-red-600'}`} />
                <AlertDescription className={`text-xs sm:text-sm ${submitMessage.includes('succès') ? 'text-green-800' : 'text-red-800'}`}>
                  {submitMessage}
                </AlertDescription>
              </Alert>
            )}

            <div className="mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Prêt à envoyer votre demande ?
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Vérifiez que toutes les informations sont correctes avant l&apos;envoi.
              </p>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={!isFormValid() || isSubmitting}
              className="bg-[#752D8B] hover:bg-[#5a2269] disabled:opacity-50 text-white px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                  <span className="text-sm sm:text-base">Envoi en cours...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  <span className="text-sm sm:text-base">Envoyer ma demande</span>
                </>
              )}
            </Button>

            {!isFormValid() && (
              <div className="mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs sm:text-sm text-red-700 font-medium mb-2">
                  ⚠️ Informations manquantes
                </p>
                <div className="text-xs text-red-600 space-y-1">
                  <p>Veuillez remplir tous les champs marqués d&apos;un astérisque (*).</p>
                  {!['celibataire', 'concubinage', 'veuf'].includes(formData.situation) &&
                    !householdMembers.some(member => member.nom && member.prenom && member.sexe && member.dateNaissance) && (
                      <p>Pour votre situation, au moins un membre du foyer doit être ajouté.</p>
                    )}
                </div>
              </div>
            )}

            <div className="mt-6 text-xs sm:text-sm text-gray-500 space-y-1">
              <p>🔒 Vos données sont sécurisées et traitées en conformité avec le RGPD</p>
              <p>📞 Besoin d&apos;aide ? Contactez-nous au 05 94 XX XX XX</p>
            </div>
          </div>
        </form>

        {/* Help Sidebar */}
        <HelpSidebar
          tips={helpTips}
          isVisible={showHelp}
          onToggle={() => setShowHelp(!showHelp)}
        />
      </div>
    </div>
  );
}