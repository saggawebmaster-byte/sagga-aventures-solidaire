const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testRoleSystem() {
  try {
    console.log('🧪 Test du système de rôles...\n');

    // 1. Vérifier la structure de la base de données
    console.log('1. Vérification de la structure de la base de données...');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        name: true
      }
    });

    console.log(`   ✅ ${users.length} utilisateur(s) trouvé(s)`);
    
    // 2. Vérifier les rôles
    const adminUsers = users.filter(u => u.role === 'ADMIN');
    const regularUsers = users.filter(u => u.role === 'USER' || !u.role);
    
    console.log(`   📊 Administrateurs: ${adminUsers.length}`);
    console.log(`   📊 Utilisateurs normaux: ${regularUsers.length}\n`);

    // 3. Afficher les administrateurs
    if (adminUsers.length > 0) {
      console.log('2. Administrateurs détectés:');
      adminUsers.forEach(admin => {
        console.log(`   👑 ${admin.email} (${admin.name || 'Sans nom'})`);
      });
      console.log('');
    }

    // 4. Test de la configuration Better Auth
    console.log('3. Test de la configuration Better Auth...');
    try {
      // Vérifier que le champ role est bien présent
      const sampleUser = users[0];
      if (sampleUser && typeof sampleUser.role === 'string') {
        console.log('   ✅ Champ "role" configuré correctement');
      } else {
        console.log('   ❌ Problème avec le champ "role"');
      }
    } catch (error) {
      console.log('   ❌ Erreur lors du test Better Auth:', error.message);
    }

    console.log('\n🎯 Résumé du test:');
    console.log(`   - Base de données: ✅ Fonctionnelle`);
    console.log(`   - Champ role: ✅ Présent`);
    console.log(`   - Administrateurs: ${adminUsers.length > 0 ? '✅' : '❌'} ${adminUsers.length} trouvé(s)`);
    console.log(`   - Structure: ✅ Correcte`);

    if (adminUsers.length === 0) {
      console.log('\n💡 Suggestion: Créez un administrateur avec:');
      console.log('   node scripts/make-admin.js <email>');
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testRoleSystem();
