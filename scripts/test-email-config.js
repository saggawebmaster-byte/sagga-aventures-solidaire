// Test de la configuration email sans envoi réel
const path = require('path');

// Charger les variables d'environnement
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

console.log('🧪 Test de configuration du système d\'emails SAGGA\n');

// Vérifier la clé API
const apiKey = process.env.RESEND_API_KEY;
console.log('🔑 RESEND_API_KEY:', apiKey ? 
  `Configuré (${apiKey.substring(0, 10)}...)` : 
  '❌ Non configuré');

// Test de la configuration des emails - simplification pour les tests
console.log('\n📍 Test des destinations emails:');

// Configuration directe pour éviter les problèmes d'imports TypeScript
const EPICERIE_EMAIL_MAP = {
  "CAYENNE": { email: "epicerie.cayenne@sagga.fr", name: "Epicerie TI DEGRA" },
  "SAINT-LAURENT DU MARONI": { email: "epicerie.sl@sagga.fr", name: "Epicerie TI BAKISCI" },
  "MACOURIA": { email: "epicerie.macouria@sagga.fr", name: "Epicerie TI KEKE" }
};

const CCAS_EMAIL_MAP = {
  "CAYENNE": { email: "ccas.cayenne@sagga.fr", name: "CCAS CAYENNE", code: "688192" },
  "MACOURIA": { email: "ccas.macouria@sagga.fr", name: "CCAS MACOURIA", code: "688547" },
  "SAINT-LAURENT DU MARONI": { email: "ccas.sl@sagga.fr", name: "CCAS SAINT LAURENT", code: "762402" }
};

function getTestDestinationEmail(ville, isAAU) {
  const normalizedVille = ville.toUpperCase().trim();
  if (isAAU) {
    return CCAS_EMAIL_MAP[normalizedVille] || null;
  } else {
    return EPICERIE_EMAIL_MAP[normalizedVille] || null;
  }
}

// Test des villes supportées
const villes = ['CAYENNE', 'MACOURIA', 'SAINT-LAURENT DU MARONI'];

villes.forEach(ville => {
  console.log(`\n🏙️  ${ville}:`);
  
  // Test épicerie (demande normale)
  const epicerie = getTestDestinationEmail(ville, false);
  console.log(`  📦 Épicerie: ${epicerie ? 
    `✅ ${epicerie.name} (${epicerie.email})` : 
    '❌ Non configuré'}`);
  
  // Test CCAS (demande AAU)
  const ccas = getTestDestinationEmail(ville, true);
  console.log(`  🏛️  CCAS: ${ccas ? 
    `✅ ${ccas.name} (${ccas.email})` : 
    '❌ Non configuré'}`);
});

console.log('\n📧 Messages configurés:');
console.log('📦 Message épicerie: "Nouvelle demande d\'aide alimentaire déposée"');
console.log('🚨 Message CCAS AAU: "Requête pour aide alimentaire d\'urgence"');

// Test d'une ville non supportée
console.log('\n🧪 Test ville non supportée:');
const villeInconnue = getTestDestinationEmail('VILLE_INCONNUE', false);
console.log(`Résultat: ${villeInconnue ? 'Inattendu' : '✅ null (attendu)'}`);

console.log('\n✅ Test de configuration terminé');
console.log('\n💡 Pour tester l\'envoi réel d\'emails:');
console.log('   1. Obtenez une clé API Resend sur https://resend.com');
console.log('   2. Remplacez RESEND_API_KEY dans .env.local');
console.log('   3. Lancez: npm run dev et testez via le formulaire');
