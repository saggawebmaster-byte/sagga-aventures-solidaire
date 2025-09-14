const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        emailVerified: true
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`📋 Liste des utilisateurs (${users.length} trouvé(s)):\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`);
      console.log(`   - ID: ${user.id}`);
      console.log(`   - Nom: ${user.name || 'Non défini'}`);
      console.log(`   - Rôle: ${user.role || 'USER'}`);
      console.log(`   - Email vérifié: ${user.emailVerified ? '✅' : '❌'}`);
      console.log(`   - Créé le: ${user.createdAt.toLocaleDateString('fr-FR')}`);
      console.log('');
    });

    // Statistiques
    const adminCount = users.filter(u => u.role === 'ADMIN').length;
    const userCount = users.filter(u => u.role === 'USER' || !u.role).length;
    
    console.log('📊 Statistiques:');
    console.log(`   - Administrateurs: ${adminCount}`);
    console.log(`   - Utilisateurs: ${userCount}`);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();
