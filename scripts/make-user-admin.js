// Script pour donner le rôle admin à un utilisateur
const { PrismaClient } = require('@prisma/client');

// Utiliser la même URL PostgreSQL que pour les tests
const DATABASE_URL = "postgresql://neondb_owner:npg_efNgYzWRd52S@ep-soft-base-adtg2vki-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
});

async function makeUserAdmin() {
  try {
    console.log('🔧 Attribution du rôle admin...\n');
    
    const userId = 'Dr3LSdyllhGvWUrotH9uZCFjWZSRzUc3';
    const userEmail = 'admin2@sagga.fr';
    
    // Vérifier que l'utilisateur existe
    console.log('1️⃣ Vérification de l\'utilisateur...');
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      console.log('❌ Utilisateur non trouvé avec cet ID');
      return;
    }
    
    console.log('✅ Utilisateur trouvé:', {
      id: user.id,
      email: user.email,
      name: user.name,
      currentRole: user.role
    });
    
    // Mettre à jour le rôle
    console.log('\n2️⃣ Mise à jour du rôle vers ADMIN...');
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: 'ADMIN' }
    });
    
    console.log('✅ Rôle mis à jour avec succès!');
    console.log('👑 Nouvel utilisateur admin:', {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role
    });
    
    // Vérification finale
    console.log('\n3️⃣ Vérification finale...');
    const finalUser = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (finalUser?.role === 'ADMIN') {
      console.log('🎉 SUCCÈS! L\'utilisateur est maintenant administrateur');
      console.log('📧 Email admin:', finalUser.email);
      console.log('🔑 Mot de passe: Admin@2025!');
    } else {
      console.log('❌ Erreur: Le rôle n\'a pas été mis à jour');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

makeUserAdmin();
