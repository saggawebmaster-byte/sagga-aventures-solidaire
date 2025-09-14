"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { AdminGuard } from '@/components/admin-guard';
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
  XCircle,
  User,
  Home,
  BarChart3,
  Shield
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

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const statusConfig = {
  'EN_ATTENTE': { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  'EN_COURS': { label: 'En cours', color: 'bg-blue-100 text-blue-800', icon: RefreshCw },
  'ACCEPTEE': { label: 'Acceptée', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  'REFUSEE': { label: 'Refusée', color: 'bg-red-100 text-red-800', icon: XCircle },
};

const StatusBadge = ({ status }: { status: string }) => {
  const config = statusConfig[status as keyof typeof statusConfig];
  const Icon = config.icon;
  
  return (
    <Badge className={`${config.color} flex items-center gap-1`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'demandes' | 'users'>('overview');
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredDemandes, setFilteredDemandes] = useState<Demande[]>([]);
  const [selectedDemande, setSelectedDemande] = useState<Demande | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Statistiques
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    totalDemandes: 0,
    enAttente: 0,
    enCours: 0,
    acceptees: 0,
    refusees: 0,
  });

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    filterDemandes();
  }, [demandes, searchTerm, statusFilter, dateFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Simuler des données de demandes
      const mockDemandes: Demande[] = [
        {
          id: '1',
          createdAt: new Date().toISOString(),
          prenom: 'Jean',
          nom: 'Dupont',
          dateNaissance: '1985-05-15',
          sexe: 'Homme',
          situation: 'Marié',
          email: 'jean.dupont@email.com',
          telephonePortable: '06 12 34 56 78',
          adresse: '123 Rue de la Paix',
          codePostal: '75001',
          ville: 'Paris',
          status: 'EN_ATTENTE',
          membresfoyer: [
            {
              id: '1',
              nom: 'Dupont',
              prenom: 'Marie',
              sexe: 'Femme',
              dateNaissance: '1987-03-22'
            }
          ],
          fichiers: []
        },
        {
          id: '2',
          createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          prenom: 'Sophie',
          nom: 'Martin',
          dateNaissance: '1990-08-10',
          sexe: 'Femme',
          situation: 'Célibataire',
          email: 'sophie.martin@email.com',
          telephonePortable: '06 98 76 54 32',
          adresse: '456 Avenue des Champs',
          codePostal: '69000',
          ville: 'Lyon',
          status: 'EN_COURS',
          membresfoyer: [],
          fichiers: [
            {
              id: '1',
              nom: 'justificatif_revenus.pdf',
              url: '#',
              taille: 1024000,
              type: 'application/pdf',
              categorie: 'Revenus',
              createdAt: new Date().toISOString()
            }
          ]
        }
      ];

      // Simuler des données d'utilisateurs
      const mockUsers: UserData[] = [
        {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'ADMIN',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'USER',
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'USER',
          createdAt: new Date().toISOString()
        }
      ];

      setDemandes(mockDemandes);
      setUsers(mockUsers);
      calculateStats(mockDemandes, mockUsers);
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (demandesData: Demande[], usersData: UserData[]) => {
    const stats = {
      totalUsers: usersData.length,
      adminUsers: usersData.filter(u => u.role === 'ADMIN').length,
      totalDemandes: demandesData.length,
      enAttente: demandesData.filter(d => d.status === 'EN_ATTENTE').length,
      enCours: demandesData.filter(d => d.status === 'EN_COURS').length,
      acceptees: demandesData.filter(d => d.status === 'ACCEPTEE').length,
      refusees: demandesData.filter(d => d.status === 'REFUSEE').length,
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
      // Simuler la mise à jour du statut
      const updatedDemandes = demandes.map(demande =>
        demande.id === demandeId ? { ...demande, status: newStatus } : demande
      );
      setDemandes(updatedDemandes);
      
      if (selectedDemande && selectedDemande.id === demandeId) {
        setSelectedDemande({ ...selectedDemande, status: newStatus });
      }
      
      calculateStats(updatedDemandes, users);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      setError('Erreur lors de la mise à jour du statut');
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
              Administration
            </h1>
            <p className="text-gray-600">
              Panneau d&apos;administration réservé aux administrateurs
            </p>
          </div>

          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'overview'
                      ? 'border-[#752D8B] text-[#752D8B]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <BarChart3 className="h-4 w-4 inline-block mr-2" />
                  Vue d&apos;ensemble
                </button>
                <button
                  onClick={() => setActiveTab('demandes')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'demandes'
                      ? 'border-[#752D8B] text-[#752D8B]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <FileText className="h-4 w-4 inline-block mr-2" />
                  Demandes
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'users'
                      ? 'border-[#752D8B] text-[#752D8B]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Users className="h-4 w-4 inline-block mr-2" />
                  Utilisateurs
                </button>
              </nav>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Statistiques principales */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                      </div>
                      <Users className="h-8 w-8 text-[#752D8B]" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600">Administrateurs</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.adminUsers}</p>
                      </div>
                      <Shield className="h-8 w-8 text-[#752D8B]" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600">Total Demandes</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalDemandes}</p>
                      </div>
                      <FileText className="h-8 w-8 text-[#752D8B]" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600">En Attente</p>
                        <p className="text-3xl font-bold text-yellow-600">{stats.enAttente}</p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Répartition des demandes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Répartition des demandes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-yellow-600" />
                          En attente
                        </span>
                        <span className="font-semibold">{stats.enAttente}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <RefreshCw className="h-4 w-4 text-blue-600" />
                          En cours
                        </span>
                        <span className="font-semibold">{stats.enCours}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Acceptées
                        </span>
                        <span className="font-semibold">{stats.acceptees}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-600" />
                          Refusées
                        </span>
                        <span className="font-semibold">{stats.refusees}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Actions rapides</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                      <Button
                        onClick={() => setActiveTab('demandes')}
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Voir toutes les demandes
                      </Button>
                      <Button
                        onClick={() => setActiveTab('users')}
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Gérer les utilisateurs
                      </Button>
                      <Button
                        onClick={fetchData}
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Actualiser les données
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Demandes Tab */}
          {activeTab === 'demandes' && (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Liste des demandes */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Liste des demandes</span>
                      <Button
                        onClick={fetchData}
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
                          <SelectItem value="EN_ATTENTE">En attente</SelectItem>
                          <SelectItem value="EN_COURS">En cours</SelectItem>
                          <SelectItem value="ACCEPTEE">Acceptée</SelectItem>
                          <SelectItem value="REFUSEE">Refusée</SelectItem>
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
                            className={`cursor-pointer transition-all hover:shadow-md ${
                              selectedDemande?.id === demande.id ? 'ring-2 ring-[#752D8B]' : ''
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
                            variant={selectedDemande.status === 'EN_COURS' ? 'default' : 'outline'}
                            onClick={() => updateStatus(selectedDemande.id, 'EN_COURS')}
                            className="text-xs"
                          >
                            En cours
                          </Button>
                          <Button
                            size="sm"
                            variant={selectedDemande.status === 'ACCEPTEE' ? 'default' : 'outline'}
                            onClick={() => updateStatus(selectedDemande.id, 'ACCEPTEE')}
                            className="text-xs bg-green-600 hover:bg-green-700"
                          >
                            Accepter
                          </Button>
                          <Button
                            size="sm"
                            variant={selectedDemande.status === 'REFUSEE' ? 'default' : 'outline'}
                            onClick={() => updateStatus(selectedDemande.id, 'REFUSEE')}
                            className="text-xs bg-red-600 hover:bg-red-700"
                          >
                            Refuser
                          </Button>
                          <Button
                            size="sm"
                            variant={selectedDemande.status === 'EN_ATTENTE' ? 'default' : 'outline'}
                            onClick={() => updateStatus(selectedDemande.id, 'EN_ATTENTE')}
                            className="text-xs"
                          >
                            En attente
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
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <Card>
              <CardHeader>
                <CardTitle>Gestion des utilisateurs</CardTitle>
                <CardDescription>
                  Gérez les comptes utilisateurs et leurs permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <Card key={user.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <User className="h-8 w-8 text-gray-400" />
                            <div>
                              <h3 className="font-semibold text-gray-900">{user.name}</h3>
                              <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                              className={user.role === 'ADMIN' ? 'bg-[#752D8B] hover:bg-[#752D8B]/90' : ''}
                            >
                              {user.role}
                            </Badge>
                            <div className="text-sm text-gray-500">
                              {format(new Date(user.createdAt), 'dd/MM/yyyy', { locale: fr })}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}