// Test the correct Better Auth endpoints
async function testCorrectEndpoints() {
  console.log('🧪 Testing correct Better Auth endpoints...');
  
  try {
    // Test 1: Test sign-up with correct endpoint
    console.log('\n1️⃣ Testing sign-up endpoint...');
    
    const signUpResponse = await fetch('http://localhost:3000/api/auth/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `newuser${Date.now()}@example.com`,
        password: 'testpassword123',
        name: 'New Test User'
      })
    });
    
    console.log(`📊 Sign-up status: ${signUpResponse.status}`);
    const signUpText = await signUpResponse.text();
    console.log(`📊 Sign-up response: ${signUpText.substring(0, 300)}...`);
    
    // Test 2: Test sign-in
    console.log('\n2️⃣ Testing sign-in endpoint...');
    
    const signInResponse = await fetch('http://localhost:3000/api/auth/sign-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpassword123'
      })
    });
    
    console.log(`📊 Sign-in status: ${signInResponse.status}`);
    const signInText = await signInResponse.text();
    console.log(`📊 Sign-in response: ${signInText.substring(0, 300)}...`);
    
    // Test 3: List all available endpoints
    console.log('\n3️⃣ Testing base auth endpoint...');
    
    const baseResponse = await fetch('http://localhost:3000/api/auth', {
      method: 'GET'
    });
    
    console.log(`📊 Base auth status: ${baseResponse.status}`);
    const baseText = await baseResponse.text();
    console.log(`📊 Base auth response: ${baseText.substring(0, 300)}...`);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testCorrectEndpoints();
