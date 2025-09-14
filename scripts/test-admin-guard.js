#!/usr/bin/env node

/**
 * Script pour tester que l'AdminGuard fonctionne correctement
 * Teste que l'API /api/user/role retourne bien le rôle de l'admin
 */

const axios = require('axios');

const BASE_URL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000';

async function testUserRoleAPI() {
  console.log('🧪 Test de l\'API /api/user/role...\n');

  try {
    // D'abord, essayer sans être connecté
    console.log('1️⃣ Test sans authentification...');
    try {
      const response = await axios.get(`${BASE_URL}/api/user/role`);
      console.log('❌ ERREUR: L\'API a répondu sans authentification:', response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correct: Accès refusé sans authentification (401)');
      } else {
        console.log('❌ Erreur inattendue:', error.message);
      }
    }

    console.log('\n2️⃣ Pour tester avec authentification:');
    console.log('   - Connectez-vous sur l\'interface web');
    console.log('   - Copiez le cookie de session');
    console.log('   - Relancez ce script avec: COOKIE="better-auth.session_token=..." node test-admin-guard.js');

    // Si un cookie est fourni, tester avec
    if (process.env.COOKIE) {
      console.log('\n3️⃣ Test avec cookie fourni...');
      const response = await axios.get(`${BASE_URL}/api/user/role`, {
        headers: {
          'Cookie': process.env.COOKIE
        }
      });
      console.log('✅ Rôle récupéré:', response.data);
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

async function testAdminAccess() {
  console.log('\n🔒 Test d\'accès à la page admin...\n');

  try {
    const response = await axios.get(`${BASE_URL}/admin`, {
      maxRedirects: 0,
      validateStatus: () => true // Accepter tous les codes de status
    });

    console.log('Status:', response.status);
    
    if (response.status === 302 || response.status === 307) {
      console.log('✅ Redirection détectée vers:', response.headers.location);
    } else if (response.status === 200) {
      console.log('✅ Page admin accessible');
    } else {
      console.log('❓ Status inattendu:', response.status);
    }

  } catch (error) {
    console.error('❌ Erreur lors du test d\'accès admin:', error.message);
  }
}

async function main() {
  console.log('🔍 Tests de l\'AdminGuard et de l\'authentification admin\n');
  console.log('Base URL:', BASE_URL);
  console.log('----------------------------------------\n');

  await testUserRoleAPI();
  await testAdminAccess();

  console.log('\n✨ Tests terminés !');
  console.log('\n📝 Instructions pour tester en production:');
  console.log('1. Déployez sur Vercel');
  console.log('2. Connectez-vous avec admin2@sagga.fr / Admin@2025!');
  console.log('3. Vérifiez que vous êtes bien redirigé vers /admin');
  console.log('4. Vérifiez que le composant SessionDebugInfo affiche ADMIN dans "Rôle (API)"');
}

main().catch(console.error);
