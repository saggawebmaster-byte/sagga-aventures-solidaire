// Test session verification with proper credentials
async function testSessionWithCredentials() {
  console.log('🔐 Testing session verification...');
  
  try {
    // First, login to get a session
    console.log('\n1️⃣ Logging in...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/sign-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        email: 'user1754850240137@example.com',
        password: 'testpassword123'
      })
    });
    
    console.log(`📊 Login status: ${loginResponse.status}`);
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log(`✅ Login successful. Token: ${loginData.token}`);
      
      // Check cookies from login response
      const cookies = loginResponse.headers.get('set-cookie');
      if (cookies) {
        console.log(`🍪 Cookies from login: ${cookies}`);
      }
      
      // Now test session endpoint
      console.log('\n2️⃣ Testing session endpoint...');
      const sessionResponse = await fetch('http://localhost:3000/api/auth/session', {
        method: 'GET',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json',
          'Cookie': cookies || ''
        }
      });
      
      console.log(`📊 Session status: ${sessionResponse.status}`);
      
      if (sessionResponse.ok) {
        const sessionData = await sessionResponse.json();
        console.log(`✅ Session data:`, sessionData);
      } else {
        const errorText = await sessionResponse.text();
        console.log(`❌ Session error: ${errorText.substring(0, 200)}`);
      }
    } else {
      console.log('❌ Login failed');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testSessionWithCredentials();
