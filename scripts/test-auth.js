#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAuth() {
  try {
    console.log('🔍 Vérification de la base de données...');
    
    // Vérifier les tables d'authentification
    const users = await prisma.user.findMany();
    console.log(`📊 Nombre d'utilisateurs: ${users.length}`);
    
    const sessions = await prisma.session.findMany();
    console.log(`🔗 Nombre de sessions: ${sessions.length}`);
    
    console.log('✅ Base de données prête pour l\'authentification');
    
    if (users.length > 0) {
      console.log('👥 Utilisateurs existants:');
      users.forEach(user => {
        console.log(`  - ${user.email} (${user.name || 'Sans nom'})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test de la base de données:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuth();
