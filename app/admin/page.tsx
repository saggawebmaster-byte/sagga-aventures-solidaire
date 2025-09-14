"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { AdminGuard } from '@/components/admin-guard';
import { SessionDebugInfo } from '@/components/session-debug-info';
import { ProductionDebugInfo } from '@/components/production-debug-info';
import {
  Users,
  FileText,
  Calendar,
  Mail,
  Eye,
  Download,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Home
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Demande {
  id: string;
  createdAt: string;
  prenom: string;
  nom: string;
  dateNaissance: string;
  sexe: string;
  situation: string;
  email: string;
  telephoneFixe?: string;
  telephonePortable?: string;
  adresse: string;
  complementAdresse?: string;
  codePostal: string;
  ville: string;
  aau: boolean;
  commentaires?: string;
  status: string;
  membresfoyer: Array<{
    id: string;
    nom: string;
    prenom: string;
    sexe: string;
    dateNaissance: string;
  }>;
  fichiers: Array<{
    id: string;
    nom: string;
    url: string;
    taille: number;
    type: string;
    categorie: string;
    createdAt: string;
  }>;
}

const statusConfig = {
  'ENVOYE': { label: 'Envoyée', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  'TRAITE': { label: 'Traitée', color: 'bg-green-100 text-green-800', icon: CheckCircle },
};

const StatusBadge = ({ status }: { status: string }) => {
  const config = statusConfig[status as keyof typeof statusConfig];

  // Fallback pour les statuts non définis
  if (!config) {
    return (
      <Badge className="bg-gray-100 text-gray-800 flex items-center gap-1">
        <AlertCircle className="h-3 w-3" />
        {status || 'Inconnu'}
      </Badge>
    );
  }

  const Icon = config.icon;

  return (
    <Badge className={`${config.color} flex items-center gap-1`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

export default function AdminDashboard() {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [filteredDemandes, setFilteredDemandes] = useState<Demande[]>([]);
  const [selectedDemande, setSelectedDemande] = useState<Demande | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Statistiques
  const [stats, setStats] = useState({
    total: 0,
    envoyes: 0,
    traites: 0,
    epiceries: 0,
    ccas: 0,
  });

  useEffect(() => {
    fetchDemandes();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    filterDemandes();
  }, [demandes, searchTerm, statusFilter, dateFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchDemandes = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/demandes');
      const result = await response.json();

      if (result.success) {
        // Adapter les données de l'API pour l'interface
        const adaptedDemandes = result.demandes.map((demande: any) => ({
          ...demande,
          status: demande.status || 'ENVOYE', // Statut par défaut si pas défini
        }));

        setDemandes(adaptedDemandes);
        calculateStats(adaptedDemandes);
      } else {
        setError(result.error || 'Erreur lors du chargement des demandes');
      }
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  //  Les Nouveaux Status : ENVOYE, TRAITE
  const calculateStats = (demandesData: Demande[]) => {
    const stats = {
      total: demandesData.length,
      envoyes: demandesData.filter(d => d.status === 'ENVOYE').length,
      traites: demandesData.filter(d => d.status === 'TRAITE').length,
      epiceries: demandesData.filter(d => !d.aau).length, // Demandes non-AAU vont aux épiceries
      ccas: demandesData.filter(d => d.aau).length, // Demandes AAU vont aux CCAS
    };
    setStats(stats);
  };

  const filterDemandes = () => {
    let filtered = [...demandes];

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(demande =>
        `${demande.prenom} ${demande.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demande.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(demande => demande.status === statusFilter);
    }

    // Filtre par date
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();

      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(demande => new Date(demande.createdAt) >= filterDate);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(demande => new Date(demande.createdAt) >= filterDate);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(demande => new Date(demande.createdAt) >= filterDate);
          break;
      }
    }

    setFilteredDemandes(filtered);
  };

  const updateStatus = async (demandeId: string, newStatus: string) => {
    try {
      setError('');

      // Appel API pour mettre à jour le statut
      const response = await fetch(`/api/demandes/${demandeId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (result.success) {
        // Mettre à jour localement en cas de succès
        const updatedDemandes = demandes.map(demande =>
          demande.id === demandeId ? { ...demande, status: newStatus } : demande
        );
        setDemandes(updatedDemandes);
        calculateStats(updatedDemandes);

        if (selectedDemande && selectedDemande.id === demandeId) {
          setSelectedDemande({ ...selectedDemande, status: newStatus });
        }
      } else {
        // Si l'API échoue, on met à jour quand même localement (pour l'instant)
        const updatedDemandes = demandes.map(demande =>
          demande.id === demandeId ? { ...demande, status: newStatus } : demande
        );
        setDemandes(updatedDemandes);
        calculateStats(updatedDemandes);

        if (selectedDemande && selectedDemande.id === demandeId) {
          setSelectedDemande({ ...selectedDemande, status: newStatus });
        }

        console.warn('API status update failed, updated locally:', result.error);
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);

      // En cas d'erreur réseau, on met à jour quand même localement
      const updatedDemandes = demandes.map(demande =>
        demande.id === demandeId ? { ...demande, status: newStatus } : demande
      );
      setDemandes(updatedDemandes);
      calculateStats(updatedDemandes);

      if (selectedDemande && selectedDemande.id === demandeId) {
        setSelectedDemande({ ...selectedDemande, status: newStatus });
      }

      setError('Attention: Le statut a été mis à jour localement mais pourrait ne pas être sauvegardé sur le serveur');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <AdminGuard>
        <div className="min-h-screen py-12 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-[#752D8B]" />
            <p>Chargement des données...</p>
          </div>
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Administration des demandes
            </h1>
            <p className="text-gray-600">
              Gérez et administrez toutes les demandes soumises via le formulaire
            </p>
          </div>

          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">Total demandes</div>
              </CardContent>
            </Card>
            {/* <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.envoyes}</div>
                <div className="text-sm text-gray-600">Envoyées</div>
              </CardContent>
            </Card> */}
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.traites}</div>
                <div className="text-sm text-gray-600">Traitées</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[#752D8B]">{stats.epiceries}</div>
                <div className="text-sm text-gray-600">Épiceries</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.ccas}</div>
                <div className="text-sm text-gray-600">CCAS (AAU)</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Liste des demandes */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Liste des demandes</span>
                    <Button
                      onClick={fetchDemandes}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Actualiser
                    </Button>
                  </CardTitle>

                  {/* Filtres */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Rechercher par nom ou email..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="ENVOYE">Envoyées</SelectItem>
                        <SelectItem value="TRAITE">Traitées</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Période" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les dates</SelectItem>
                        <SelectItem value="today">Aujourd&apos;hui</SelectItem>
                        <SelectItem value="week">Cette semaine</SelectItem>
                        <SelectItem value="month">Ce mois</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredDemandes.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Aucune demande trouvée</p>
                      </div>
                    ) : (
                      filteredDemandes.map((demande) => (
                        <Card
                          key={demande.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${selectedDemande?.id === demande.id ? 'ring-2 ring-[#752D8B]' : ''
                            }`}
                          onClick={() => setSelectedDemande(demande)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <User className="h-5 w-5 text-gray-400" />
                                <div>
                                  <h3 className="font-semibold text-gray-900">
                                    {demande.prenom} {demande.nom}
                                  </h3>
                                  <p className="text-sm text-gray-600">{demande.email}</p>
                                </div>
                              </div>
                              <StatusBadge status={demande.status} />
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {format(new Date(demande.createdAt), 'dd/MM/yyyy', { locale: fr })}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {demande.membresfoyer.length + 1} personne{demande.membresfoyer.length > 0 ? 's' : ''}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FileText className="h-4 w-4" />
                                  {demande.fichiers.length} fichier{demande.fichiers.length !== 1 ? 's' : ''}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Détails de la demande sélectionnée */}
            <div className="lg:col-span-1">
              {selectedDemande ? (
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Détails de la demande</span>
                      <StatusBadge status={selectedDemande.status} />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Actions */}
                    <div>
                      <Label className="text-sm font-medium">Changer le statut</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Button
                          size="sm"
                          variant={selectedDemande.status === 'ENVOYE' ? 'default' : 'outline'}
                          onClick={() => updateStatus(selectedDemande.id, 'ENVOYE')}
                          className="text-xs"
                        >
                          Envoyée
                        </Button>
                        <Button
                          size="sm"
                          variant={selectedDemande.status === 'TRAITE' ? 'default' : 'outline'}
                          onClick={() => updateStatus(selectedDemande.id, 'TRAITE')}
                          className="text-xs bg-green-600 hover:bg-green-700"
                        >
                          Traitée
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    {/* Informations personnelles */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Informations personnelles
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Nom :</strong> {selectedDemande.nom}</div>
                        <div><strong>Prénom :</strong> {selectedDemande.prenom}</div>
                        <div><strong>Date de naissance :</strong> {selectedDemande.dateNaissance}</div>
                        <div><strong>Sexe :</strong> {selectedDemande.sexe}</div>
                        <div><strong>Situation :</strong> {selectedDemande.situation}</div>
                        <div className="flex items-center gap-2">
                          <strong>AAU (Aide Alimentaire d'Urgence) :</strong>
                          {selectedDemande.aau ? (
                            <Badge className="bg-orange-100 text-orange-800 text-xs">✓ Demandée</Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-600 text-xs">Non demandée</Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Contact */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Contact
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Email :</strong> {selectedDemande.email}</div>
                        {selectedDemande.telephonePortable && (
                          <div><strong>Portable :</strong> {selectedDemande.telephonePortable}</div>
                        )}
                        {selectedDemande.telephoneFixe && (
                          <div><strong>Fixe :</strong> {selectedDemande.telephoneFixe}</div>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Adresse */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        Adresse
                      </h4>
                      <div className="space-y-1 text-sm">
                        <div>{selectedDemande.adresse}</div>
                        {selectedDemande.complementAdresse && (
                          <div>{selectedDemande.complementAdresse}</div>
                        )}
                        <div>{selectedDemande.codePostal} {selectedDemande.ville}</div>
                      </div>
                    </div>

                    {/* Membres du foyer */}
                    {selectedDemande.membresfoyer.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Membres du foyer ({selectedDemande.membresfoyer.length})
                          </h4>
                          <div className="space-y-2">
                            {selectedDemande.membresfoyer.map((membre) => (
                              <div key={membre.id} className="text-sm p-2 bg-gray-50 rounded">
                                <div><strong>{membre.prenom} {membre.nom}</strong></div>
                                <div className="text-gray-600">{membre.sexe} - {membre.dateNaissance}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Fichiers */}
                    {selectedDemande.fichiers.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Fichiers ({selectedDemande.fichiers.length})
                          </h4>
                          <div className="space-y-2">
                            {selectedDemande.fichiers.map((fichier) => (
                              <div key={fichier.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                                <div>
                                  <div className="font-medium">{fichier.nom}</div>
                                  <div className="text-gray-600">
                                    {fichier.categorie} - {formatFileSize(fichier.taille)}
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => window.open(fichier.url, '_blank')}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Commentaires */}
                    {selectedDemande.commentaires && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-semibold mb-3">Commentaires</h4>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                            {selectedDemande.commentaires}
                          </p>
                        </div>
                      </>
                    )}

                    {/* Date de création */}
                    <Separator />
                    <div className="text-xs text-gray-500">
                      Demande créée le {format(new Date(selectedDemande.createdAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-gray-500">
                    <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Sélectionnez une demande pour voir les détails</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Debug temporaire - sera retiré en production finale */}
      {process.env.NODE_ENV === 'development' && <ProductionDebugInfo />}
    </AdminGuard>
  );
}


