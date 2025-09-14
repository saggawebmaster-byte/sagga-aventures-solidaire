// Script to inspect database contents
const { PrismaClient } = require('@prisma/client');

async function inspectDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Inspecting database contents...');
    
    // Get all users
    console.log('\n👥 Users:');
    const users = await prisma.user.findMany();
    users.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Name: ${user.name || 'N/A'}`);
      console.log(`   Email Verified: ${user.emailVerified}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log('');
    });
    
    // Get all accounts
    console.log('\n🔑 Accounts:');
    const accounts = await prisma.account.findMany();
    if (accounts.length === 0) {
      console.log('No accounts found in database');
    } else {
      accounts.forEach((account, index) => {
        console.log(`${index + 1}. ID: ${account.id}`);
        console.log(`   Account ID: ${account.accountId}`);
        console.log(`   User ID: ${account.userId}`);
        console.log(`   Provider ID: ${account.providerId}`);
        console.log(`   Type: ${account.type}`);
        console.log('');
      });
    }
    
    // Get all sessions
    console.log('\n🛡️ Sessions:');
    const sessions = await prisma.session.findMany();
    if (sessions.length === 0) {
      console.log('No sessions found in database');
    } else {
      sessions.forEach((session, index) => {
        console.log(`${index + 1}. ID: ${session.id}`);
        console.log(`   Token: ${session.token.substring(0, 20)}...`);
        console.log(`   User ID: ${session.userId}`);
        console.log(`   Expires: ${session.expiresAt}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('❌ Database inspection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

inspectDatabase();
