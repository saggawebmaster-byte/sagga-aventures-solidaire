const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function makeUserAdmin(email) {
  try {
    // Trouver l'utilisateur par email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log(`❌ Utilisateur avec l'email ${email} non trouvé`);
      return;
    }

    // Mettre à jour le rôle
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { role: 'ADMIN' }
    });

    console.log(`✅ Utilisateur ${email} promu administrateur:`);
    console.log(`   - ID: ${updatedUser.id}`);
    console.log(`   - Nom: ${updatedUser.name}`);
    console.log(`   - Email: ${updatedUser.email}`);
    console.log(`   - Rôle: ${updatedUser.role}`);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Récupérer l'email depuis les arguments de ligne de commande
const email = process.argv[2];

if (!email) {
  console.log('Usage: node scripts/make-admin.js <email>');
  console.log('Exemple: node scripts/make-admin.js admin@sagga.com');
  process.exit(1);
}

makeUserAdmin(email);
