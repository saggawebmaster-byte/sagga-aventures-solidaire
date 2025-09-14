// Test du système d'envoi d'emails
const { sendDemandeNotification } = require('../lib/email-service.ts');

// Données de test pour une demande normale
const demandeNormale = {
  prenom: 'Jean',
  nom: 'Dupont',
  dateNaissance: '1985-05-15',
  sexe: 'homme',
  situation: 'marié',
  telephone: '06 94 12 34 56',
  email: 'jean.dupont@email.com',
  adresse: '123 Rue de la République',
  ville: 'CAYENNE',
  codePostal: '97300',
  aau: false,
  commentaires: 'Situation financière difficile suite à une perte d\'emploi',
  membres: [
    {
      prenom: 'Marie',
      nom: 'Dupont',
      dateNaissance: '1987-08-20',
      sexe: 'femme'
    },
    {
      prenom: 'Pierre',
      nom: 'Dupont', 
      dateNaissance: '2010-03-10',
      sexe: 'homme'
    }
  ],
  fichierJustificatifs: '3 fichier(s) joint(s) (Identité, Ressources, Charges)',
  createdAt: new Date()
};

// Données de test pour une demande AAU
const demandeAAU = {
  ...demandeNormale,
  prenom: 'Sophie',
  nom: 'Martin',
  email: 'sophie.martin@email.com',
  ville: 'CAYENNE',
  aau: true,
  commentaires: 'Situation d\'urgence alimentaire - Plus de ressources depuis 3 jours',
  membres: []
};

async function testEmailSystem() {
  console.log('🧪 Test du système d\'envoi d\'emails SAGGA\n');

  // Test 1: Demande normale
  console.log('📧 Test 1: Demande normale (Épicerie)');
  console.log(`Destinataire: ${demandeNormale.ville} - AAU: ${demandeNormale.aau}`);
  
  try {
    const result1 = await sendDemandeNotification(demandeNormale);
    if (result1.success) {
      console.log('✅ Email envoyé avec succès');
      console.log(`📮 Message ID: ${result1.messageId}\n`);
    } else {
      console.log('❌ Échec de l\'envoi');
      console.log(`🚨 Erreur: ${result1.error}\n`);
    }
  } catch (error) {
    console.log('💥 Erreur lors du test 1:', error.message, '\n');
  }

  // Test 2: Demande AAU 
  console.log('🚨 Test 2: Demande AAU (CCAS)');
  console.log(`Destinataire: ${demandeAAU.ville} - AAU: ${demandeAAU.aau}`);
  
  try {
    const result2 = await sendDemandeNotification(demandeAAU);
    if (result2.success) {
      console.log('✅ Email urgent envoyé avec succès');
      console.log(`📮 Message ID: ${result2.messageId}\n`);
    } else {
      console.log('❌ Échec de l\'envoi urgent');
      console.log(`🚨 Erreur: ${result2.error}\n`);
    }
  } catch (error) {
    console.log('💥 Erreur lors du test 2:', error.message, '\n');
  }

  // Test 3: Ville non supportée
  console.log('🧪 Test 3: Ville non supportée');
  const demandeVilleInconnue = { ...demandeNormale, ville: 'VILLE_INCONNUE' };
  
  try {
    const result3 = await sendDemandeNotification(demandeVilleInconnue);
    if (result3.success) {
      console.log('✅ Email envoyé (inattendu)');
    } else {
      console.log('❌ Échec attendu pour ville non supportée');
      console.log(`🚨 Erreur: ${result3.error}\n`);
    }
  } catch (error) {
    console.log('💥 Erreur lors du test 3:', error.message, '\n');
  }

  console.log('🏁 Tests terminés');
}

// Vérifier que RESEND_API_KEY est configuré
if (!process.env.RESEND_API_KEY) {
  console.log('⚠️  RESEND_API_KEY n\'est pas configuré dans .env.local');
  console.log('   Les emails ne pourront pas être envoyés.');
  process.exit(1);
}

testEmailSystem().catch(console.error);
