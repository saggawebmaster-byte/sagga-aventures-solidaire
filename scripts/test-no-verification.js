// Test authentication with email verification disabled
async function testAuthWithoutEmailVerification() {
  console.log('🧪 Testing authentication without email verification...');
  
  const testEmail = `user${Date.now()}@example.com`;
  const testPassword = 'testpassword123';
  const testName = 'Test User';
  
  try {
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
    
    if (registerResponse.ok) {
      console.log('✅ Registration successful!');
      const registerData = await registerResponse.json();
      console.log(`📊 User created: ${JSON.stringify(registerData, null, 2)}`);
      
      // Test login immediately
      console.log('\n2️⃣ Testing immediate login...');
      
      const loginResponse = await fetch('http://localhost:3000/api/auth/sign-in/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword
        })
      });
      
      console.log(`📊 Login status: ${loginResponse.status}`);
      
      if (loginResponse.ok) {
        console.log('✅ Login successful!');
        const loginData = await loginResponse.json();
        console.log(`📊 Session: ${JSON.stringify(loginData, null, 2)}`);
      } else {
        const errorData = await loginResponse.text();
        console.log(`❌ Login failed: ${errorData}`);
      }
    } else {
      const errorData = await registerResponse.text();
      console.log(`❌ Registration failed: ${errorData}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAuthWithoutEmailVerification();
