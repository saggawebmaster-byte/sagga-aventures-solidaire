// Test du système d'envoi d'emails avec confirmation
const { sendDemandeNotification } = require('../lib/email-service.ts');

// Données de test
const demandeTest = {
  prenom: 'Marie',
  nom: 'Martin',
  dateNaissance: '1990-03-15',
  telephone: '06 94 12 34 56',
  email: 'marie.martin@email.com',
  adresse: '456 Avenue des Palmiers',
  ville: 'Cayenne',
  codePostal: '97300',
  aau: false,
  commentaires: 'Test de confirmation d\'email',
  membres: [],
  createdAt: new Date()
};

// Demande AAU pour test urgence
const demandeAAU = {
  ...demandeTest,
  prenom: 'Paul',
  nom: 'Urgent',
  email: 'paul.urgent@email.com',
  aau: true,
  commentaires: 'Test de confirmation pour demande AAU urgente'
};

async function testEmailConfirmation() {
  console.log('🧪 Test du système d\'emails avec confirmation\n');

  // Test 1: Demande normale avec confirmation
  console.log('📧 Test 1: Demande normale avec confirmation');
  try {
    const result1 = await sendDemandeNotification(demandeTest);
    if (result1.success) {
      console.log('✅ Email principal envoyé avec succès');
      console.log(`📮 Message ID: ${result1.messageId}`);
      console.log(`✉️  Confirmation envoyée: ${result1.confirmationSent ? 'OUI' : 'NON'}\n`);
    } else {
      console.log('❌ Échec de l\'envoi');
      console.log(`🚨 Erreur: ${result1.error}\n`);
    }
  } catch (error) {
    console.log('💥 Erreur lors du test 1:', error.message, '\n');
  }

  // Test 2: Demande AAU avec confirmation
  console.log('🚨 Test 2: Demande AAU avec confirmation');
  try {
    const result2 = await sendDemandeNotification(demandeAAU);
    if (result2.success) {
      console.log('✅ Email AAU envoyé avec succès');
      console.log(`📮 Message ID: ${result2.messageId}`);
      console.log(`✉️  Confirmation envoyée: ${result2.confirmationSent ? 'OUI' : 'NON'}\n`);
    } else {
      console.log('❌ Échec de l\'envoi AAU');
      console.log(`🚨 Erreur: ${result2.error}\n`);
    }
  } catch (error) {
    console.log('💥 Erreur lors du test 2:', error.message, '\n');
  }

  console.log('🏁 Tests terminés');
  console.log('\n📋 Résumé des emails qui devraient être envoyés:');
  console.log('1. Email à l\'organisme (Épicerie TI DEGRA pour Cayenne)');
  console.log('2. Email de confirmation au demandeur');
  console.log('3. Email AAU au CCAS + copie admin SAGGA');
  console.log('4. Email de confirmation au demandeur AAU');
}

// Vérifier que RESEND_API_KEY est configuré
if (!process.env.RESEND_API_KEY) {
  console.log('⚠️  RESEND_API_KEY n\'est pas configuré dans .env.local');
  console.log('   Les emails ne pourront pas être envoyés.');
  console.log('   Le test montrera seulement la structure sans envoi réel.');
  process.exit(1);
}

testEmailConfirmation().catch(console.error);
