// Test to check what cookies are set by Better Auth
async function testCookies() {
  console.log('🍪 Testing cookies set by Better Auth...');
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/sign-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'user1754849784569@example.com',
        password: 'testpassword123'
      })
    });
    
    console.log(`📊 Login status: ${response.status}`);
    
    // Check all cookies set by the response
    const cookies = response.headers.get('set-cookie');
    if (cookies) {
      console.log('🍪 Cookies set by Better Auth:');
      console.log(cookies);
    } else {
      console.log('❌ No cookies found in response');
    }
    
    const responseBody = await response.text();
    console.log(`📊 Response body: ${responseBody.substring(0, 200)}...`);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testCookies();
