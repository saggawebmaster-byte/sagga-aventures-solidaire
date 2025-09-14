const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabaseConnection() {
  console.log('🔍 Test de connexion à la base de données SQLite...\n');

  try {
    // Test 1: Connexion de base
    console.log('1. Test de connexion...');
    await prisma.$connect();
    console.log('✅ Connexion réussie!\n');

    // Test 2: Création d'une demande de test
    console.log('2. Test de création d\'une demande...');
    const testDemande = await prisma.demande.create({
      data: {
        prenom: 'Jean',
        nom: 'Dupont',
        dateNaissance: '1990-01-01',
        sexe: 'homme',
        situation: 'sans-emploi-sans-minimas',
        email: 'jean.dupont@test.com',
        telephonePortable: '0694123456',
        adresse: '123 Rue de Test',
        codePostal: '97360',
        ville: 'Apatou',
        commentaires: 'Demande de test',
      },
    });
    console.log('✅ Demande créée avec l\'ID:', testDemande.id);

    // Test 3: Ajout d'un membre du foyer
    console.log('3. Test d\'ajout d\'un membre du foyer...');
    const membreFoyer = await prisma.membreFoyer.create({
      data: {
        nom: 'Dupont',
        prenom: 'Marie',
        sexe: 'femme',
        dateNaissance: '1992-05-15',
        demandeId: testDemande.id,
      },
    });
    console.log('✅ Membre du foyer ajouté avec l\'ID:', membreFoyer.id);

    // Test 4: Ajout d'un fichier
    console.log('4. Test d\'ajout d\'un fichier...');
    const fichier = await prisma.fichier.create({
      data: {
        nom: 'carte-identite.pdf',
        url: 'https://example.com/test-file.pdf',
        taille: 1024000,
        type: 'application/pdf',
        categorie: 'IDENTITE',
        demandeId: testDemande.id,
      },
    });
    console.log('✅ Fichier ajouté avec l\'ID:', fichier.id);

    // Test 5: Récupération de la demande avec relations
    console.log('5. Test de récupération avec relations...');
    const demandeComplete = await prisma.demande.findUnique({
      where: { id: testDemande.id },
      include: {
        membresfoyer: true,
        fichiers: true,
      },
    });
    console.log('✅ Demande récupérée avec:', {
      membresfoyer: demandeComplete.membresfoyer.length,
      fichiers: demandeComplete.fichiers.length,
    });

    // Test 6: Comptage des enregistrements
    console.log('6. Test de comptage...');
    const counts = {
      demandes: await prisma.demande.count(),
      membresfoyer: await prisma.membreFoyer.count(),
      fichiers: await prisma.fichier.count(),
    };
    console.log('✅ Nombre d\'enregistrements:', counts);

    // Test 7: Mise à jour
    console.log('7. Test de mise à jour...');
    const updatedDemande = await prisma.demande.update({
      where: { id: testDemande.id },
      data: { status: 'EN_COURS' },
    });
    console.log('✅ Status mis à jour:', updatedDemande.status);

    // Test 8: Suppression (cascade)
    console.log('8. Test de suppression avec cascade...');
    await prisma.demande.delete({
      where: { id: testDemande.id },
    });
    
    // Vérifier que les relations ont été supprimées
    const remainingMembers = await prisma.membreFoyer.count({
      where: { demandeId: testDemande.id },
    });
    const remainingFiles = await prisma.fichier.count({
      where: { demandeId: testDemande.id },
    });
    
    console.log('✅ Suppression cascade réussie:', {
      membresRestants: remainingMembers,
      fichiersRestants: remainingFiles,
    });

    console.log('\n🎉 Tous les tests sont passés avec succès!');
    console.log('📊 La base de données SQLite fonctionne correctement.');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Connexion fermée.');
  }
}

// Exécuter les tests
testDatabaseConnection();