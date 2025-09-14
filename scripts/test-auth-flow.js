// Test script to verify authentication database and setup
const { PrismaClient } = require('@prisma/client');

async function testAuthSetup() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Testing database connection...');
    
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test User model
    console.log('\n📊 Testing User model...');
    const userCount = await prisma.user.count();
    console.log(`📈 Users in database: ${userCount}`);
    
    // Test Account model
    console.log('\n📊 Testing Account model...');
    const accountCount = await prisma.account.count();
    console.log(`📈 Accounts in database: ${accountCount}`);
    
    // Test Session model
    console.log('\n📊 Testing Session model...');
    const sessionCount = await prisma.session.count();
    console.log(`📈 Sessions in database: ${sessionCount}`);
    
    // Test VerificationToken model
    console.log('\n📊 Testing VerificationToken model...');
    const tokenCount = await prisma.verificationToken.count();
    console.log(`📈 Verification tokens in database: ${tokenCount}`);
    
    console.log('\n✅ All database models are working correctly!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuthSetup();
