// Test script to verify authentication endpoints
async function testAuthEndpoints() {
  console.log('🧪 Testing Better Auth endpoints...');
  
  try {
    // Test 1: Check if auth endpoints are accessible
    console.log('\n1️⃣ Testing auth endpoint accessibility...');
    
    const healthResponse = await fetch('http://localhost:3000/api/auth/sign-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: '', password: '' })
    });
    
    console.log(`📊 Auth endpoint status: ${healthResponse.status}`);
    
    if (healthResponse.status === 400 || healthResponse.status === 401) {
      console.log('✅ Auth endpoint is responding (expected error for empty credentials)');
    } else {
      console.log('⚠️ Unexpected response from auth endpoint');
    }
    
    // Test 2: Test registration endpoint structure
    console.log('\n2️⃣ Testing registration endpoint...');
    
    const registerResponse = await fetch('http://localhost:3000/api/auth/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'test123',
        name: 'Test User'
      })
    });
    
    console.log(`📊 Registration endpoint status: ${registerResponse.status}`);
    const registerData = await registerResponse.text();
    console.log(`📊 Registration response: ${registerData.substring(0, 100)}...`);
    
    // Test 3: Check session endpoint
    console.log('\n3️⃣ Testing session endpoint...');
    
    const sessionResponse = await fetch('http://localhost:3000/api/auth/session', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log(`📊 Session endpoint status: ${sessionResponse.status}`);
    const sessionData = await sessionResponse.text();
    console.log(`📊 Session response: ${sessionData.substring(0, 100)}...`);
    
    console.log('\n✅ Authentication endpoints test completed!');
    
  } catch (error) {
    console.error('❌ Auth endpoints test failed:', error);
  }
}

testAuthEndpoints();
