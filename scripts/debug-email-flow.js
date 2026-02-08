#!/usr/bin/env node
/**
 * Script de débogage pour tester l'envoi d'emails SAGGA
 * Usage: node scripts/debug-email-flow.js
 */

const { Resend } = require('resend');

// Configuration
const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_HzFn6rp2_8sYCffkBuc7W4hMDAV37sRmx';
const resend = new Resend(RESEND_API_KEY);

console.log('\n🔍 ANALYSE DU SYSTÈME D\'ENVOI D\'EMAILS SAGGA');
console.log('='.repeat(80));
console.log(`\n📌 Configuration:`);
console.log(`   - API Key: ${RESEND_API_KEY.substring(0, 10)}...`);
console.log(`   - Email organisme (CCAS Cayenne): thomas.awounfouet@gmail.com`);
console.log(`   - Email confirmation: [même email pour test]`);

async function testEmailOrganisme() {
  console.log('\n\n📧 TEST 1: Email vers l\'organisme (CCAS)');
  console.log('-'.repeat(80));
  
  try {
    const result = await resend.emails.send({
      from: 'SAGGA <noreply@sagga.fr>',
      to: ['thomas.awounfouet@gmail.com'],
      subject: '🧪 TEST - Demande AAU - Jean DUPONT',
      html: '<h1>Email de test vers organisme</h1><p>Lien document: <a href="https://s3-sagga-fichiers.s3.sbg.io.cloud.ovh.net/TEST/test-20260208-235311.txt">Fichier</a></p>',
    //   cc: ['contact@sagga.fr']
    });

    if (result.error) {
      console.log(`❌ ÉCHEC: ${result.error.message}`);
      console.log(`   Détails:`, result.error);
      return { success: false, error: result.error };
    }

    console.log(`✅ SUCCÈS`);
    console.log(`   Message ID: ${result.data?.id}`);
    return { success: true, messageId: result.data?.id };
    
  } catch (error) {
    console.log(`❌ EXCEPTION:`, error.message);
    return { success: false, error };
  }
}

async function testEmailConfirmation() {
  console.log('\n\n📧 TEST 2: Email de confirmation au demandeur');
  console.log('-'.repeat(80));
  
  try {
    const result = await resend.emails.send({
      from: 'SAGGA <noreply@sagga.fr>',
      to: ['thomas.awounfouet@gmail.com'],
      subject: '✅ Confirmation - Votre demande a été transmise',
      html: '<h1>Confirmation de demande</h1><p>Votre demande a bien été reçue.</p>',
      bcc: ['contact@sagga.org']
    });

    if (result.error) {
      console.log(`❌ ÉCHEC: ${result.error.message}`);
      return { success: false, error: result.error };
    }

    console.log(`✅ SUCCÈS`);
    console.log(`   Message ID: ${result.data?.id}`);
    return { success: true, messageId: result.data?.id };
    
  } catch (error) {
    console.log(`❌ EXCEPTION:`, error.message);
    return { success: false, error };
  }
}

async function checkDomains() {
  console.log('\n\n🌐 VÉRIFICATION DU DOMAINE');
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
      });
    } else {
      console.log('⚠️  Aucun domaine trouvé');
    }
    
  } catch (error) {
    console.log(`❌ Erreur:`, error.message);
  }
}

async function checkRecentEmails() {
  console.log('\n\n📬 EMAILS RÉCENTS (5 derniers)');
  console.log('-'.repeat(80));
  
  try {
    const response = await fetch('https://api.resend.com/emails', {
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}` }
    });
    
    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      data.data.slice(0, 5).forEach((email, i) => {
        console.log(`\n${i + 1}. ${email.subject}`);
        console.log(`   De: ${email.from}`);
        console.log(`   À: ${email.to.join(', ')}`);
        console.log(`   Status: ${email.last_event || 'pending'}`);
        console.log(`   Date: ${new Date(email.created_at).toLocaleString('fr-FR')}`);
      });
    } else {
      console.log('Aucun email trouvé');
    }
    
  } catch (error) {
    console.log(`❌ Erreur:`, error.message);
  }
}

async function main() {
  const test1 = await testEmailOrganisme();
  await new Promise(r => setTimeout(r, 2000));
  
  const test2 = await testEmailConfirmation();
  await new Promise(r => setTimeout(r, 2000));
  
  await checkDomains();
  await checkRecentEmails();
  
  console.log('\n\n' + '='.repeat(80));
  console.log('📊 RÉSUMÉ');
  console.log('='.repeat(80));
  console.log(`Email organisme:     ${test1.success ? '✅ OK' : '❌ ÉCHEC'}`);
  console.log(`Email confirmation:  ${test2.success ? '✅ OK' : '❌ ÉCHEC'}`);
  
  if (test1.success && test2.success) {
    console.log('\n✅ LES DEUX EMAILS ONT ÉTÉ ENVOYÉS');
    console.log('📧 Vérifiez: thomas.awounfouet@gmail.com (et spams)');
  } else {
    console.log('\n❌ PROBLÈME DÉTECTÉ');
    if (!test1.success) console.log('   - L\'email vers l\'organisme a échoué');
    if (!test2.success) console.log('   - L\'email de confirmation a échoué');
  }
  
  console.log('\n');
}

main().catch(console.error);
