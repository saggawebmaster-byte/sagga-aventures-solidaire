const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAAU() {
  try {
    console.log('🧪 Test du champ AAU...');
    
    // Créer une demande de test avec AAU = true
    const demandeAAU = await prisma.demande.create({
      data: {
        prenom: 'Marie',
        nom: 'Test',
        dateNaissance: '1990-01-01',
        sexe: 'femme',
        situation: 'celibataire',
        email: 'marie.test@example.com',
        adresse: '123 Test Street',
        codePostal: '12345',
        ville: 'Apatou',
        aau: true, // AAU demandée
        commentaires: 'Demande de test avec AAU'
      }
    });
    
    console.log('✅ Demande avec AAU créée:', {
      id: demandeAAU.id,
      nom: demandeAAU.nom,
      prenom: demandeAAU.prenom,
      aau: demandeAAU.aau
    });
    
    // Créer une demande de test avec AAU = false
    const demandeSansAAU = await prisma.demande.create({
      data: {
        prenom: 'Jean',
        nom: 'Test',
        dateNaissance: '1985-06-15',
        sexe: 'homme',
        situation: 'marie',
        email: 'jean.test@example.com',
        adresse: '456 Test Avenue',
        codePostal: '67890',
        ville: 'Apatou',
        aau: false, // AAU non demandée
        commentaires: 'Demande de test sans AAU'
      }
    });
    
    console.log('✅ Demande sans AAU créée:', {
      id: demandeSansAAU.id,
      nom: demandeSansAAU.nom,
      prenom: demandeSansAAU.prenom,
      aau: demandeSansAAU.aau
    });
    
    // Récupérer toutes les demandes et vérifier le champ AAU
    const demandes = await prisma.demande.findMany({
      select: {
        id: true,
        prenom: true,
        nom: true,
        aau: true,
        email: true
      }
    });
    
    console.log('\n📋 Toutes les demandes avec statut AAU:');
    demandes.forEach((demande, index) => {
      const aauStatus = demande.aau ? '✅ AAU demandée' : '❌ AAU non demandée';
      console.log(`${index + 1}. ${demande.prenom} ${demande.nom} - ${aauStatus}`);
    });
    
    // Statistiques AAU
    const totalAAU = demandes.filter(d => d.aau).length;
    const totalSansAAU = demandes.filter(d => !d.aau).length;
    
    console.log('\n📊 Statistiques AAU:');
    console.log(`   • Demandes avec AAU: ${totalAAU}`);
    console.log(`   • Demandes sans AAU: ${totalSansAAU}`);
    console.log(`   • Total: ${demandes.length}`);
    
    console.log('\n🎉 Test AAU terminé avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test AAU:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAAU();
