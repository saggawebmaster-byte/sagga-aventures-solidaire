// Test script for complete auth flow
async function testCompleteAuthFlow() {
  console.log('🧪 Testing complete authentication flow...');
  
  const testEmail = `user${Date.now()}@example.com`;
  const testPassword = 'testpassword123';
  const testName = 'Test User';
  
  try {
    // Test 1: Register a new user
    console.log('\n1️⃣ Testing user registration...');
    console.log(`📧 Email: ${testEmail}`);
    
    const registerResponse = await fetch('http://localhost:3000/api/auth/sign-up/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        name: testName
      })
    });
    
    console.log(`📊 Registration status: ${registerResponse.status}`);
    const registerData = await registerResponse.text();
    console.log(`📊 Registration response: ${registerData.substring(0, 300)}...`);
    
    if (registerResponse.status === 200 || registerResponse.status === 201) {
      console.log('✅ Registration successful!');
      
      // Test 2: Login with the new user
      console.log('\n2️⃣ Testing user login...');
      
      const loginResponse = await fetch('http://localhost:3000/api/auth/sign-in/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword
        })
      });
      
      console.log(`📊 Login status: ${loginResponse.status}`);
      const loginData = await loginResponse.text();
      console.log(`📊 Login response: ${loginData.substring(0, 300)}...`);
      
      if (loginResponse.status === 200) {
        console.log('✅ Login successful!');
        
        // Extract session cookie if available
        const setCookieHeader = loginResponse.headers.get('set-cookie');
        if (setCookieHeader) {
          console.log(`🍪 Session cookie set: ${setCookieHeader.substring(0, 100)}...`);
        }
      } else {
        console.log('❌ Login failed');
      }
    } else {
      console.log('❌ Registration failed');
    }
    
    console.log('\n✅ Complete authentication flow test completed!');
    
  } catch (error) {
    console.error('❌ Authentication flow test failed:', error);
  }
}

testCompleteAuthFlow();
