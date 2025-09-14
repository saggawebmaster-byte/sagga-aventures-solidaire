// Test complet auth avec vérification du rôle admin
async function testAdminAuth() {
  console.log('👑 Test de l\'authentification admin...\n');
  
  try {
    // 1. Déconnexion pour vider le cache
    console.log('1️⃣ Déconnexion...');
    const logoutResponse = await fetch('http://localhost:3000/api/auth/sign-out', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('📊 Logout status:', logoutResponse.status);
    
    // 2. Nouvelle connexion
    console.log('\n2️⃣ Nouvelle connexion...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/sign-in/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin2@sagga.fr',
        password: 'Admin@2025!'
      })
    });
    
    console.log('📊 Login status:', loginResponse.status);
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Connexion réussie!');
      console.log('👤 Données utilisateur complètes:');
      console.log(JSON.stringify(loginData, null, 2));
      
      // 3. Test session avec cookie
      console.log('\n3️⃣ Test de session avec cookie...');
      const cookies = loginResponse.headers.get('set-cookie');
      console.log('🍪 Cookies reçus:', cookies ? 'Oui' : 'Non');
      
      if (cookies) {
        const sessionResponse = await fetch('http://localhost:3000/api/auth/session', {
          method: 'GET',
          headers: {
            'Cookie': cookies
          }
        });
        
        console.log('📊 Session status:', sessionResponse.status);
        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json();
          console.log('✅ Session active!');
          console.log('📊 Données de session:');
          console.log(JSON.stringify(sessionData, null, 2));
        }
      }
      
    } else {
      const error = await loginResponse.text();
      console.log('❌ Échec de connexion:', error);
    }
    
  } catch (err) {
    console.error('❌ Erreur:', err.message);
  }
}

testAdminAuth();
