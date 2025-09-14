// Test script to verify Better Auth endpoints with correct paths
async function testBetterAuthEndpoints() {
  console.log('🧪 Testing Better Auth endpoints with correct paths...');
  
  try {
    // Test 1: Check session endpoint
    console.log('\n1️⃣ Testing session endpoint...');
    
    const sessionResponse = await fetch('http://localhost:3000/api/auth/session', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log(`📊 Session endpoint status: ${sessionResponse.status}`);
    const sessionText = await sessionResponse.text();
    console.log(`📊 Session response: ${sessionText.substring(0, 200)}...`);
    
    // Test 2: Test sign-up endpoint
    console.log('\n2️⃣ Testing sign-up endpoint...');
    
    const signUpResponse = await fetch('http://localhost:3000/api/auth/sign-up/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpassword123',
        name: 'Test User'
      })
    });
    
    console.log(`📊 Sign-up endpoint status: ${signUpResponse.status}`);
    const signUpText = await signUpResponse.text();
    console.log(`📊 Sign-up response: ${signUpText.substring(0, 200)}...`);
    
    // Test 3: Test sign-in endpoint
    console.log('\n3️⃣ Testing sign-in endpoint...');
    
    const signInResponse = await fetch('http://localhost:3000/api/auth/sign-in/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
    });
    
    console.log(`📊 Sign-in endpoint status: ${signInResponse.status}`);
    const signInText = await signInResponse.text();
    console.log(`📊 Sign-in response: ${signInText.substring(0, 200)}...`);
    
    console.log('\n✅ Better Auth endpoints test completed!');
    
  } catch (error) {
    console.error('❌ Better Auth endpoints test failed:', error);
  }
}

testBetterAuthEndpoints();
