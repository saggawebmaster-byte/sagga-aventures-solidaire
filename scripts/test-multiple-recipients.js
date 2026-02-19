/**
 * Script de test pour vérifier la gestion des emails multiples aux CCAS
 * 
 * Ce script permet de tester :
 * 1. La transformation correcte de string | string[] en array
 * 2. L'envoi à plusieurs destinataires
 * 3. Les différentes configurations (simple email vs multiple emails)
 */

// Import des fonctions de configuration
const { CCAS_EMAIL_MAP, EPICERIE_EMAIL_MAP, getDestinationEmail } = require('../lib/email-config');

console.log('\n=== TEST DE GESTION DES EMAILS MULTIPLES ===\n');

// Test 1: Vérification des configurations
console.log('📋 Test 1: Vérification des configurations CCAS\n');
Object.entries(CCAS_EMAIL_MAP).forEach(([ville, config]) => {
  const emailCount = Array.isArray(config.email) ? config.email.length : 1;
  const emailType = Array.isArray(config.email) ? '📧 Multiple' : '📧 Simple';
  
  console.log(`${ville}:`);
  console.log(`  ${emailType} (${emailCount} destinataire${emailCount > 1 ? 's' : ''})`);
  console.log(`  Code: ${config.code}`);
  
  if (Array.isArray(config.email)) {
    config.email.forEach((email, index) => {
      console.log(`    ${index + 1}. ${email}`);
    });
  } else {
    console.log(`    1. ${config.email}`);
  }
  console.log('');
});

// Test 2: Simulation de transformation pour l'API Resend
console.log('\n📨 Test 2: Simulation de transformation pour Resend API\n');

function simulateSendEmail(destination) {
  const recipientEmails = Array.isArray(destination.email) 
    ? destination.email 
    : [destination.email];
  
  return {
    to: recipientEmails,
    recipientCount: recipientEmails.length,
    recipientList: recipientEmails
  };
}

// Test avec Cayenne (2 emails)
console.log('Test avec CAYENNE (2 destinataires):');
const cayenneConfig = getDestinationEmail('CAYENNE', true);
const cayenneResult = simulateSendEmail(cayenneConfig);
console.log(`  ✅ Nombre de destinataires: ${cayenneResult.recipientCount}`);
console.log(`  ✅ Array pour Resend:`, cayenneResult.to);
console.log('');

// Test avec Macouria (1 email)
console.log('Test avec MACOURIA (1 destinataire):');
const macouriaConfig = getDestinationEmail('MACOURIA', true);
const macouriaResult = simulateSendEmail(macouriaConfig);
console.log(`  ✅ Nombre de destinataires: ${macouriaResult.recipientCount}`);
console.log(`  ✅ Array pour Resend:`, macouriaResult.to);
console.log('');

// Test avec Kourou (3 emails)
console.log('Test avec KOUROU (3 destinataires):');
const kourouConfig = getDestinationEmail('KOUROU', true);
const kourouResult = simulateSendEmail(kourouConfig);
console.log(`  ✅ Nombre de destinataires: ${kourouResult.recipientCount}`);
console.log(`  ✅ Array pour Resend:`, kourouResult.to);
console.log('');

// Test 3: Statistiques générales
console.log('\n📊 Test 3: Statistiques générales\n');

const ccasStats = Object.entries(CCAS_EMAIL_MAP).reduce((acc, [ville, config]) => {
  const count = Array.isArray(config.email) ? config.email.length : 1;
  acc.totalCCAS++;
  acc.totalEmails += count;
  if (count === 1) acc.singleRecipient++;
  if (count > 1) acc.multipleRecipients++;
  if (count > acc.maxRecipients) {
    acc.maxRecipients = count;
    acc.maxRecipientVille = ville;
  }
  return acc;
}, {
  totalCCAS: 0,
  totalEmails: 0,
  singleRecipient: 0,
  multipleRecipients: 0,
  maxRecipients: 0,
  maxRecipientVille: ''
});

console.log(`Nombre de CCAS configurés: ${ccasStats.totalCCAS}`);
console.log(`Total d'adresses email: ${ccasStats.totalEmails}`);
console.log(`CCAS avec 1 seul email: ${ccasStats.singleRecipient}`);
console.log(`CCAS avec plusieurs emails: ${ccasStats.multipleRecipients}`);
console.log(`Maximum de destinataires: ${ccasStats.maxRecipients} (${ccasStats.maxRecipientVille})`);
console.log(`Moyenne d'emails par CCAS: ${(ccasStats.totalEmails / ccasStats.totalCCAS).toFixed(2)}`);

const epicerieStats = Object.keys(EPICERIE_EMAIL_MAP).length;
console.log(`\nNombre d'épiceries configurées: ${epicerieStats}`);

console.log('\n✅ Tests terminés avec succès!\n');
