#!/usr/bin/env node

/**
 * Script pour créer ou vérifier un utilisateur admin en production
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  const email = 'admin2@sagga.fr';
  const password = 'Admin@2025!';
  const name = 'Administrateur';

  try {
    console.log('🔍 Vérification de l\'utilisateur admin...');

    // Vérifier si l'utilisateur existe déjà
    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (user) {
      console.log('👤 Utilisateur existant trouvé:', user.email);
      
      // Vérifier le rôle
      if (user.role === 'ADMIN') {
        console.log('✅ L\'utilisateur a déjà le rôle ADMIN');
      } else {
        console.log('🔄 Mise à jour du rôle vers ADMIN...');
        user = await prisma.user.update({
          where: { id: user.id },
          data: { role: 'ADMIN' }
        });
        console.log('✅ Rôle mis à jour vers ADMIN');
      }
    } else {
      console.log('➕ Création d\'un nouvel utilisateur admin...');
      
      // Créer l'utilisateur avec mot de passe hashé
      const hashedPassword = await bcrypt.hash(password, 10);
      
      user = await prisma.user.create({
        data: {
          email,
          name,
          emailVerified: true,
          role: 'ADMIN'
        }
      });

      // Créer l'account associé pour l'authentification par mot de passe
      await prisma.account.create({
        data: {
          userId: user.id,
          provider: 'credential',
          providerAccountId: user.id,
          password: hashedPassword
        }
      });

      console.log('✅ Utilisateur admin créé avec succès');
    }

    console.log('\n📊 Détails de l\'utilisateur admin:');
    console.log('  Email:', user.email);
    console.log('  Nom:', user.name);
    console.log('  Rôle:', user.role);
    console.log('  Email vérifié:', user.emailVerified);
    console.log('  ID:', user.id);

    console.log('\n🔑 Informations de connexion:');
    console.log('  Email:', email);
    console.log('  Mot de passe:', password);

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function listAllUsers() {
  try {
    console.log('\n👥 Liste de tous les utilisateurs:');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        createdAt: true
      }
    });

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.role}) - ${user.emailVerified ? '✅' : '❌'} vérifié`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de la liste des utilisateurs:', error.message);
  }
}

async function main() {
  console.log('🛠️  Setup utilisateur admin pour production\n');

  try {
    await createAdminUser();
    await listAllUsers();
    
    console.log('\n✨ Setup terminé avec succès !');
    console.log('\n📝 Prochaines étapes:');
    console.log('1. Déployez votre application sur Vercel');
    console.log('2. Assurez-vous que les variables d\'environnement sont configurées');
    console.log('3. Testez la connexion avec admin2@sagga.fr / Admin@2025!');
    console.log('4. Vérifiez l\'accès à /admin');

  } catch (error) {
    console.error('💥 Échec du setup:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { createAdminUser, listAllUsers };
