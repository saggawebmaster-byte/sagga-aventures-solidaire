"use client";

import { AdminGuard } from '@/components/admin-guard';

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Administration
            </h1>
            <p className="text-gray-600">
              Panneau d&apos;administration réservé aux administrateurs
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Tableau de bord</h2>
            <p className="text-gray-600">
              Bienvenue dans l&apos;interface d&apos;administration de Sagga.
            </p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-primary/10 p-4 rounded-lg">
                <h3 className="font-medium text-primary">Utilisateurs</h3>
                <p className="text-sm text-gray-600 mt-1">Gérer les comptes utilisateurs</p>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">
                <h3 className="font-medium text-primary">Demandes</h3>
                <p className="text-sm text-gray-600 mt-1">Traiter les demandes soumises</p>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">
                <h3 className="font-medium text-primary">Statistiques</h3>
                <p className="text-sm text-gray-600 mt-1">Voir les analyses et rapports</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
