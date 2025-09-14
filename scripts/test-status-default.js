const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testStatusDefault() {
  console.log('🔍 Test du statut par défaut des demandes...\n');

  try {
    // Test 1: Créer une demande de test
    console.log('1. Création d\'une demande de test...');
    const testDemande = await prisma.demande.create({
      data: {
        prenom: 'Test',
        nom: 'Statut',
        dateNaissance: '1990-01-01',
        sexe: 'homme',
        situation: 'sans-emploi-sans-minimas',
        email: 'test.statut@example.com',
        adresse: '123 Rue Test',
        codePostal: '97360',
        ville: 'Apatou',
        aau: false,
        commentaires: 'Test du statut par défaut',
      },
    });

    console.log('✅ Demande créée avec le statut:', testDemande.status);
    console.log('   ID:', testDemande.id);

    // Test 2: Vérifier que le statut par défaut est bien "ENVOYE"
    if (testDemande.status === 'ENVOYE') {
      console.log('✅ Le statut par défaut est correct: ENVOYE');
    } else {
      console.log('❌ Le statut par défaut est incorrect:', testDemande.status);
      console.log('   Attendu: ENVOYE');
    }

    // Test 3: Compter les demandes par statut
    console.log('\n2. Statistiques des statuts actuels...');
    const stats = {
      total: await prisma.demande.count(),
      envoyes: await prisma.demande.count({ where: { status: 'ENVOYE' } }),
      traites: await prisma.demande.count({ where: { status: 'TRAITE' } }),
      autres: await prisma.demande.count({ 
        where: { 
          status: { 
            notIn: ['ENVOYE', 'TRAITE'] 
          } 
        } 
      }),
    };

    console.log('📊 Statistiques:');
    console.log(`   Total demandes: ${stats.total}`);
    console.log(`   Statut ENVOYE: ${stats.envoyes}`);
    console.log(`   Statut TRAITE: ${stats.traites}`);
    console.log(`   Autres statuts: ${stats.autres}`);

    // Test 4: Lister les autres statuts s'il y en a
    if (stats.autres > 0) {
      console.log('\n3. Statuts non-standard trouvés:');
      const autresDemandes = await prisma.demande.findMany({
        where: { 
          status: { 
            notIn: ['ENVOYE', 'TRAITE'] 
          } 
        },
        select: {
          id: true,
          prenom: true,
          nom: true,
          status: true,
          createdAt: true,
        }
      });

      autresDemandes.forEach((demande, index) => {
        console.log(`   ${index + 1}. ${demande.prenom} ${demande.nom} - Status: "${demande.status}"`);
      });
    }

    // Test 5: Nettoyer - supprimer la demande de test
    await prisma.demande.delete({
      where: { id: testDemande.id },
    });
    console.log('\n✅ Demande de test supprimée');

    console.log('\n🎉 Test terminé avec succès!');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testStatusDefault();
