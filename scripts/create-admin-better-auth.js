const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdminUserViaBetterAuth() {
  try {
    console.log('🔧 Création d\'un nouvel utilisateur administrateur via Better Auth...\n');

    // Informations du nouvel admin
    const adminData = {
      email: 'admin2@sagga.fr',
      name: 'Super Admin 2',
      password: 'Admin@2025!'
    };

    console.log(`📧 Email: ${adminData.email}`);
    console.log(`👤 Nom: ${adminData.name}`);
    console.log(`🔑 Mot de passe: ${adminData.password}`);
    console.log('');

    // Utiliser l'API Better Auth pour créer l'utilisateur
    const response = await fetch('http://localhost:3000/api/auth/sign-up/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: adminData.email,
        password: adminData.password,
        name: adminData.name,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erreur HTTP ${response.status}: ${error}`);
    }

    const result = await response.json();
    console.log('✅ Utilisateur créé via Better Auth!');
    console.log('   Résultat:', result);

    // Maintenant mettre à jour le rôle en admin
    if (result.user) {
      const updatedUser = await prisma.user.update({
        where: { id: result.user.id },
        data: { 
          role: 'ADMIN',
          emailVerified: true 
        }
      });

      console.log('✅ Rôle mis à jour vers ADMIN!');
      console.log(`   ID: ${updatedUser.id}`);
      console.log(`   Email: ${updatedUser.email}`);
      console.log(`   Rôle: ${updatedUser.role}`);
    }

    console.log('');
    console.log('🔐 Informations de connexion:');
    console.log(`   Email: ${adminData.email}`);
    console.log(`   Mot de passe: ${adminData.password}`);
    console.log('');
    console.log('🌐 Vous pouvez maintenant vous connecter sur:');
    console.log('   http://localhost:3000/auth/login');

    return result;

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'administrateur:', error);
    
    // Si l'utilisateur existe déjà, juste mettre à jour le rôle
    if (error.message.includes('already exists') || error.message.includes('409')) {
      console.log('📝 L\'utilisateur existe déjà, mise à jour du rôle...');
      
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: 'admin2@sagga.fr' }
        });
        
        if (existingUser) {
          const updatedUser = await prisma.user.update({
            where: { id: existingUser.id },
            data: { 
              role: 'ADMIN',
              emailVerified: true 
            }
          });
          
          console.log('✅ Rôle mis à jour vers ADMIN!');
          return { user: updatedUser };
        }
      } catch (updateError) {
        console.error('❌ Erreur lors de la mise à jour:', updateError);
      }
    }
    
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Vérifier que le serveur dev est en cours d'exécution
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000/api/auth/session');
    return true;
  } catch (error) {
    console.error('❌ Le serveur de développement n\'est pas en cours d\'exécution!');
    console.log('   Veuillez démarrer le serveur avec: npm run dev');
    return false;
  }
}

if (require.main === module) {
  checkServer()
    .then((serverRunning) => {
      if (!serverRunning) {
        process.exit(1);
      }
      return createAdminUserViaBetterAuth();
    })
    .then(() => {
      console.log('\n🎉 Opération terminée avec succès!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Échec de l\'opération:', error.message);
      process.exit(1);
    });
}

module.exports = { createAdminUserViaBetterAuth };
