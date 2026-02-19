#!/usr/bin/env node
/**
 * Script de diagnostic complet pour identifier le problème d'envoi d'emails
 * Compare ancienne vs nouvelle configuration
 * Usage: node scripts/diagnose-email-issue.js
 */

const { Resend } = require('resend');

// Configuration
const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_HzFn6rp2_8sYCffkBuc7W4hMDAV37sRmx';
const resend = new Resend(RESEND_API_KEY);

console.log('\n🔬 DIAGNOSTIC COMPLET DU SYSTÈME D\'EMAILS SAGGA');
console.log('='.repeat(80));
console.log(`\n📌 Configuration:`);
console.log(`   - API Key: ${RESEND_API_KEY.substring(0, 10)}...${RESEND_API_KEY.substring(RESEND_API_KEY.length - 3)}`);

// Test 1: Email simple avec ancienne config (sagga.org test)
async function testOldConfig() {
  console.log('\n\n📧 TEST 1: Configuration ANCIENNE (email simple @sagga.org)');
  console.log('-'.repeat(80));
  
  try {
    const result = await resend.emails.send({
      from: 'SAGGA <noreply@sagga.org>',
      to: 'thomas.awounfouet@gmail.com',  // String simple comme avant
      subject: '🧪 TEST OLD CONFIG - Demande AAU',
      html: '<h1>Test ancienne configuration</h1><p>Email unique en string</p>',
      cc: ['contact@sagga.org']
    });

    if (result.error) {
      console.log(`❌ ÉCHEC: ${result.error.message}`);
      console.log(`   Code: ${result.error.name}`);
      return { success: false, error: result.error };
    }

    console.log(`✅ SUCCÈS - Email envoyé avec ancienne config`);
    console.log(`   Message ID: ${result.data?.id}`);
    return { success: true, messageId: result.data?.id };
    
  } catch (error) {
    console.log(`❌ EXCEPTION:`, error.message);
    return { success: false, error };
  }
}

// Test 2: Email avec nouvelle config (array)
async function testNewConfigArray() {
  console.log('\n\n📧 TEST 2: Configuration NOUVELLE (array d\'emails)');
  console.log('-'.repeat(80));
  
  try {
    const recipientEmails = ['thomas.awounfouet@gmail.com']; // Array avec 1 email
    
    console.log(`   Destinataires (array): ${JSON.stringify(recipientEmails)}`);
    console.log(`   Type: ${Array.isArray(recipientEmails) ? 'Array' : 'String'}`);
    
    const result = await resend.emails.send({
      from: 'SAGGA <noreply@sagga.org>',
      to: recipientEmails,
      subject: '🧪 TEST NEW CONFIG ARRAY - Demande AAU',
      html: '<h1>Test nouvelle configuration</h1><p>Email en array</p>',
      cc: ['contact@sagga.org']
    });

    if (result.error) {
      console.log(`❌ ÉCHEC: ${result.error.message}`);
      console.log(`   Code: ${result.error.name}`);
      return { success: false, error: result.error };
    }

    console.log(`✅ SUCCÈS - Email envoyé avec nouvelle config (array)`);
    console.log(`   Message ID: ${result.data?.id}`);
    return { success: true, messageId: result.data?.id };
    
  } catch (error) {
    console.log(`❌ EXCEPTION:`, error.message);
    return { success: false, error };
  }
}

// Test 3: Email multi-destinataires (vraie config CCAS)
async function testMultipleRecipients() {
  console.log('\n\n📧 TEST 3: Multi-destinataires (config production CCAS)');
  console.log('-'.repeat(80));
  
  try {
    // Simuler config CCAS Cayenne (2 emails)
    const recipientEmails = [
      'thomas.awounfouet@gmail.com',
      'pathy.lutiku@gmail.com'
    ];
    
    console.log(`   Destinataires: ${recipientEmails.length}`);
    recipientEmails.forEach((email, i) => {
      console.log(`      ${i + 1}. ${email}`);
    });
    
    const result = await resend.emails.send({
      from: 'SAGGA <noreply@sagga.org>',
      to: recipientEmails,
      subject: '🧪 TEST MULTI-DESTINATAIRES - Demande AAU',
      html: '<h1>Test multi-destinataires</h1><p>Envoi à plusieurs CCAS</p>',
      cc: ['contact@sagga.org']
    });

    if (result.error) {
      console.log(`❌ ÉCHEC: ${result.error.message}`);
      console.log(`   Code: ${result.error.name}`);
      return { success: false, error: result.error };
    }

    console.log(`✅ SUCCÈS - Email multi-destinataires envoyé`);
    console.log(`   Message ID: ${result.data?.id}`);
    return { success: true, messageId: result.data?.id };
    
  } catch (error) {
    console.log(`❌ EXCEPTION:`, error.message);
    return { success: false, error };
  }
}

// Test 4: Conversion string -> array (logique email-service.ts)
async function testConversionLogic() {
  console.log('\n\n📧 TEST 4: Logique de conversion (email-service.ts)');
  console.log('-'.repeat(80));
  
  try {
    // Simuler la logique de conversion dans email-service.ts
    const destination1 = { email: 'thomas.awounfouet@gmail.com', name: 'Test Single' };
    const destination2 = { email: ['thomas.awounfouet@gmail.com', 'pathy.lutiku@gmail.com'], name: 'Test Multi' };
    
    // Test avec email unique
    console.log('\n   Test A: Email unique (string)');
    const recipientEmails1 = Array.isArray(destination1.email) 
      ? destination1.email 
      : [destination1.email];
    console.log(`      Input: ${JSON.stringify(destination1.email)}`);
    console.log(`      Output: ${JSON.stringify(recipientEmails1)}`);
    console.log(`      Type: ${Array.isArray(recipientEmails1) ? '✅ Array' : '❌ Not Array'}`);
    
    const result1 = await resend.emails.send({
      from: 'SAGGA <noreply@sagga.org>',
      to: recipientEmails1,
      subject: '🧪 TEST CONVERSION - Email unique',
      html: '<h1>Test conversion email unique</h1>',
    });
    
    console.log(`      Resend: ${result1.error ? '❌ ' + result1.error.message : '✅ Envoyé'}`);
    
    // Test avec multiple emails
    console.log('\n   Test B: Emails multiples (array)');
    const recipientEmails2 = Array.isArray(destination2.email) 
      ? destination2.email 
      : [destination2.email];
    console.log(`      Input: ${JSON.stringify(destination2.email)}`);
    console.log(`      Output: ${JSON.stringify(recipientEmails2)}`);
    console.log(`      Type: ${Array.isArray(recipientEmails2) ? '✅ Array' : '❌ Not Array'}`);
    
    const result2 = await resend.emails.send({
      from: 'SAGGA <noreply@sagga.org>',
      to: recipientEmails2,
      subject: '🧪 TEST CONVERSION - Emails multiples',
      html: '<h1>Test conversion emails multiples</h1>',
    });
    
    console.log(`      Resend: ${result2.error ? '❌ ' + result2.error.message : '✅ Envoyé'}`);
    
    return { 
      success: !result1.error && !result2.error, 
      messageIds: [result1.data?.id, result2.data?.id]
    };
    
  } catch (error) {
    console.log(`❌ EXCEPTION:`, error.message);
    return { success: false, error };
  }
}

// Test 5: Vérifier domaines Resend
async function checkResendDomains() {
  console.log('\n\n🌐 VÉRIFICATION DES DOMAINES RESEND');
  console.log('-'.repeat(80));
  
  try {
    const response = await fetch('https://api.resend.com/domains', {
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}` }
    });
    
    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      data.data.forEach(domain => {
        console.log(`\n📧 Domaine: ${domain.name}`);
        console.log(`   Status: ${domain.status === 'verified' ? '✅ Vérifié' : '⚠️ ' + domain.status}`);
        console.log(`   Région: ${domain.region}`);
        
        // Vérifier si sagga.org et sagga.fr sont configurés
        if (domain.name === 'sagga.org') {
          console.log(`   ⚠️  ATTENTION: Le domaine sagga.org est configuré`);
        }
        if (domain.name === 'sagga.fr') {
          console.log(`   ⚠️  ATTENTION: Le domaine sagga.fr est configuré`);
        }
      });
    } else {
      console.log('⚠️  Aucun domaine trouvé');
    }
    
  } catch (error) {
    console.log(`❌ Erreur:`, error.message);
  }
}

async function main() {
  // Tests séquentiels avec délai
  const test1 = await testOldConfig();
  await new Promise(r => setTimeout(r, 2000));
  
  const test2 = await testNewConfigArray();
  await new Promise(r => setTimeout(r, 2000));
  
  const test3 = await testMultipleRecipients();
  await new Promise(r => setTimeout(r, 2000));
  
  const test4 = await testConversionLogic();
  await new Promise(r => setTimeout(r, 2000));
  
  await checkResendDomains();
  
  // Résumé
  console.log('\n\n' + '='.repeat(80));
  console.log('📊 RÉSUMÉ DU DIAGNOSTIC');
  console.log('='.repeat(80));
  console.log(`1. Ancienne config (string):       ${test1.success ? '✅ OK' : '❌ ÉCHEC'}`);
  console.log(`2. Nouvelle config (array 1):      ${test2.success ? '✅ OK' : '❌ ÉCHEC'}`);
  console.log(`3. Multi-destinataires (array 2):  ${test3.success ? '✅ OK' : '❌ ÉCHEC'}`);
  console.log(`4. Logique conversion:             ${test4.success ? '✅ OK' : '❌ ÉCHEC'}`);
  
  console.log('\n🔍 ANALYSE:');
  
  if (test1.success && !test2.success) {
    console.log('❌ Le problème vient de l\'utilisation d\'arrays pour les destinataires');
    console.log('💡 Solution: Vérifier que Resend accepte les arrays ou changer la logique');
  } else if (!test1.success && !test2.success && !test3.success) {
    console.log('❌ Problème général avec l\'API Resend ou les domaines');
    console.log('💡 Solution: Vérifier la clé API et la configuration du domaine sagga.org');
  } else if (test1.success && test2.success && !test3.success) {
    console.log('❌ Le problème vient spécifiquement du multi-destinataires (2+ emails)');
    console.log('💡 Solution: Envoyer des emails séparés ou utiliser BCC');
  } else if (test1.success && test2.success && test3.success) {
    console.log('✅ TOUS LES TESTS PASSENT !');
    console.log('💡 Le problème peut venir:');
    console.log('   - Des adresses emails de production (non configurées/invalides)');
    console.log('   - Du contenu HTML des emails (trop lourd ou mal formaté)');
    console.log('   - Des pièces jointes/URLs dans les emails réels');
  }
  
  console.log('\n📧 Vérifiez vos emails: thomas.awounfouet@gmail.com (+ dossier spam)');
  console.log('\n');
}

main().catch(console.error);
