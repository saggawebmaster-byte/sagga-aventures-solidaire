// Script pour tester l'authentification en production
async function testAuthInProduction() {
  console.log('🔐 Test de l\'authentification avec PostgreSQL...\n');
  
  const testUser = {
    email: 'admin2@sagga.fr',
    password: 'Admin@2025!'
  };
  
  try {
    // Test 1: Connexion
    console.log('1️⃣ Test de connexion...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/sign-in/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    
    console.log(`📊 Status: ${loginResponse.status}`);
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Connexion réussie!');
      console.log('👤 Utilisateur:', {
        id: loginData.user.id,
        email: loginData.user.email,
        name: loginData.user.name,
        role: loginData.user.role || 'USER'
      });
      
      // Test 2: Vérification de session
      console.log('\n2️⃣ Test de session...');
      const sessionResponse = await fetch('http://localhost:3000/api/auth/session', {
        method: 'GET',
        headers: {
          'Cookie': loginResponse.headers.get('set-cookie') || ''
        }
      });
      
      if (sessionResponse.ok) {
        const sessionData = await sessionResponse.json();
        console.log('✅ Session valide!');
        console.log('📊 Session:', sessionData);
      } else {
        console.log('❌ Session invalide');
      }
      
    } else {
      const error = await loginResponse.text();
      console.log('❌ Échec de connexion:', error);
    }
    
  } catch (err) {
    console.error('❌ Erreur:', err.message);
  }
}

testAuthInProduction();
