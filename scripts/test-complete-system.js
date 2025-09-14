#!/usr/bin/env node

/**
 * Script de test complet du système d'authentification et de rôles
 * Usage: node scripts/test-complete-system.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testCompleteSystem() {
  console.log('🧪 Test Complet du Système d\'Authentification et de Rôles\n');
  
  let passed = 0;
  let failed = 0;

  function test(name, condition, details = '') {
    if (condition) {
      console.log(`✅ ${name}`);
      passed++;
    } else {
      console.log(`❌ ${name}${details ? ` - ${details}` : ''}`);
      failed++;
    }
  }

  try {
    // 1. Test de la base de données
    console.log('1️⃣ Tests de la Base de Données');
    console.log('─'.repeat(40));
    
    const users = await prisma.user.findMany();
    test('Base de données accessible', users.length > 0, `${users.length} utilisateurs trouvés`);
    
    const adminUsers = users.filter(u => u.role === 'ADMIN');
    test('Administrateurs présents', adminUsers.length > 0, `${adminUsers.length} admin(s)`);
    
    const hasRoleField = users.every(u => u.hasOwnProperty('role'));
    test('Champ role présent', hasRoleField);
    
    console.log('');

    // 2. Test des modèles Prisma
    console.log('2️⃣ Tests des Modèles Prisma');
    console.log('─'.repeat(40));
    
    const accounts = await prisma.account.findMany();
    test('Modèle Account fonctionnel', Array.isArray(accounts));
    
    const sessions = await prisma.session.findMany();
    test('Modèle Session fonctionnel', Array.isArray(sessions));
    
    console.log('');

    // 3. Test des fichiers de configuration
    console.log('3️⃣ Tests de Configuration');
    console.log('─'.repeat(40));
    
    const fs = require('fs');
    
    test('Fichier middleware.ts existe', fs.existsSync('middleware.ts'));
    test('Fichier auth.ts existe', fs.existsSync('lib/auth.ts'));
    test('Fichier auth-client.ts existe', fs.existsSync('lib/auth-client.ts'));
    test('Composant AdminGuard existe', fs.existsSync('components/admin-guard.tsx'));
    test('Schéma Prisma existe', fs.existsSync('prisma/schema.prisma'));
    
    console.log('');

    // 4. Test des variables d'environnement
    console.log('4️⃣ Tests d\'Environnement');
    console.log('─'.repeat(40));
    
    const envFile = fs.existsSync('.env.local');
    test('Fichier .env.local existe', envFile);
    
    if (envFile) {
      const envContent = fs.readFileSync('.env.local', 'utf8');
      test('BETTER_AUTH_SECRET configuré', envContent.includes('BETTER_AUTH_SECRET'));
      test('BETTER_AUTH_URL configuré', envContent.includes('BETTER_AUTH_URL'));
    }
    
    console.log('');

    // Résumé
    console.log('📊 RÉSUMÉ DES TESTS');
    console.log('═'.repeat(40));
    console.log(`✅ Tests réussis: ${passed}`);
    console.log(`❌ Tests échoués: ${failed}`);
    console.log(`📈 Taux de réussite: ${Math.round((passed / (passed + failed)) * 100)}%`);
    
    if (failed === 0) {
      console.log('\n🎉 Tous les tests sont passés ! Le système est opérationnel.');
    } else {
      console.log('\n⚠️ Certains tests ont échoué. Vérifiez les points ci-dessus.');
    }

    // Informations utiles
    console.log('\n💡 INFORMATIONS UTILES');
    console.log('─'.repeat(40));
    console.log('🔗 Application: http://localhost:3000');
    const adminEmails = adminUsers.map(u => u.email).join(', ');
    console.log('👤 Admin actuel: ' + adminEmails);
    console.log('📝 Total utilisateurs: ' + users.length);
    console.log('🔧 Commandes utiles:');
    console.log('   npm run dev                    # Démarrer le serveur');
    console.log('   node scripts/list-users.js     # Lister les utilisateurs');
    console.log('   node scripts/make-admin.js     # Créer un admin');
    console.log('   npx prisma studio              # Interface base de données');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
    failed++;
  } finally {
    await prisma.$disconnect();
  }
}

// Exécution du script
if (require.main === module) {
  testCompleteSystem().catch(console.error);
}

module.exports = { testCompleteSystem };
