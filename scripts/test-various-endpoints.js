// Test with various Better Auth endpoint patterns
async function testVariousEndpoints() {
  console.log('🧪 Testing various Better Auth endpoint patterns...');
  
  const endpoints = [
    '/api/auth',
    '/api/auth/session',
    '/api/auth/signin',
    '/api/auth/sign-in',
    '/api/auth/signup',  
    '/api/auth/sign-up',
    '/api/auth/signout',
    '/api/auth/sign-out'
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n🔍 Testing: ${endpoint}`);
      
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'GET'
      });
      
      console.log(`📊 Status: ${response.status}`);
      
      if (response.status !== 404) {
        const text = await response.text();
        console.log(`📊 Response: ${text.substring(0, 200)}...`);
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
  
  // Test with POST to see if any respond
  console.log('\n📤 Testing POST requests...');
  
  const postEndpoints = [
    '/api/auth/sign-up',
    '/api/auth/signup',
    '/api/auth/signin',
    '/api/auth/sign-in'
  ];
  
  for (const endpoint of postEndpoints) {
    try {
      console.log(`\n📤 POST Testing: ${endpoint}`);
      
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'testpassword123'
        })
      });
      
      console.log(`📊 Status: ${response.status}`);
      
      if (response.status !== 404) {
        const text = await response.text();
        console.log(`📊 Response: ${text.substring(0, 200)}...`);
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
}

testVariousEndpoints();
