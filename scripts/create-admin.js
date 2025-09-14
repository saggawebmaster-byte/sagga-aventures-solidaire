const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('🔧 Création d\'un nouvel utilisateur administrateur...\n');

    // Informations du nouvel admin
    const adminData = {
      email: 'superadmin@sagga.fr',
      name: 'Super Admin',
      password: 'Admin@2025!'
    };

    console.log(`📧 Email: ${adminData.email}`);
    console.log(`👤 Nom: ${adminData.name}`);
    console.log(`🔑 Mot de passe: ${adminData.password}`);
    console.log('');

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: adminData.email }
    });

    if (existingUser) {
      console.log('⚠️  Un utilisateur avec cet email existe déjà.');
      console.log('   Mise à jour de ses permissions...\n');
      
      // Mettre à jour le rôle et le mot de passe
      const hashedPassword = await hash(adminData.password, 12);
      
      const updatedUser = await prisma.user.update({
        where: { email: adminData.email },
        data: {
          name: adminData.name,
          role: 'ADMIN'
        }
      });

      // Mettre à jour le mot de passe dans la table Account
      await prisma.account.updateMany({
        where: { userId: updatedUser.id },
        data: {
          password: hashedPassword
        }
      });

      console.log('✅ Utilisateur mis à jour avec succès!');
      return updatedUser;
    }

    // Créer un nouvel utilisateur
    const hashedPassword = await hash(adminData.password, 12);
    
    const newUser = await prisma.user.create({
      data: {
        email: adminData.email,
        name: adminData.name,
        role: 'ADMIN',
        emailVerified: true, // Marquer l'email comme vérifié
      }
    });

    // Créer l'account associé pour l'authentification
    await prisma.account.create({
      data: {
        accountId: newUser.email,
        userId: newUser.id,
        providerId: 'credential',
        type: 'credential',
        password: hashedPassword
      }
    });

    console.log('✅ Nouvel utilisateur administrateur créé avec succès!');
    console.log(`   ID: ${newUser.id}`);
    console.log(`   Créé le: ${newUser.createdAt.toLocaleDateString('fr-FR')}`);
    console.log('');
    
    console.log('🔐 Informations de connexion:');
    console.log(`   Email: ${adminData.email}`);
    console.log(`   Mot de passe: ${adminData.password}`);
    console.log('');
    console.log('🌐 Vous pouvez maintenant vous connecter sur:');
    console.log('   http://localhost:3000/auth/login');

    return newUser;

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'administrateur:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Vérifier que les arguments sont fournis ou utiliser les valeurs par défaut
if (require.main === module) {
  createAdminUser()
    .then(() => {
      console.log('\n🎉 Opération terminée avec succès!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Échec de l\'opération:', error.message);
      process.exit(1);
    });
}

module.exports = { createAdminUser };
