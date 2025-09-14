// Script pour vérifier directement le rôle dans la base
const { PrismaClient } = require('@prisma/client');

const DATABASE_URL = "postgresql://neondb_owner:npg_efNgYzWRd52S@ep-soft-base-adtg2vki-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
});

async function checkUserRole() {
  try {
    console.log('🔍 Vérification du rôle en base de données...\n');
    
    const user = await prisma.user.findUnique({
      where: { email: 'admin2@sagga.fr' }
    });
    
    if (user) {
      console.log('👤 Utilisateur en base:', {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      });
    } else {
      console.log('❌ Utilisateur non trouvé');
    }
    
    // Lister tous les utilisateurs admin
    console.log('\n📋 Tous les utilisateurs admin:');
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' }
    });
    
    if (admins.length > 0) {
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.email} (${admin.name}) - ${admin.role}`);
      });
    } else {
      console.log('Aucun administrateur trouvé');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserRole();
