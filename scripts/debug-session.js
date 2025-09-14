// Debug session and cookies after login
async function debugSession() {
  console.log('🔍 Debugging session state and cookies...');
  
  try {
    // Check what cookies are available in the browser
    console.log('\n🍪 Current cookies:');
    if (typeof document !== 'undefined') {
      console.log('Document cookies:', document.cookie);
    }
    
    // Test session endpoint
    console.log('\n🔍 Testing session endpoint...');
    const sessionResponse = await fetch('http://localhost:3000/api/auth/session', {
      method: 'GET',
      credentials: 'include', // Include cookies
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log(`📊 Session status: ${sessionResponse.status}`);
    
    if (sessionResponse.ok) {
      const sessionData = await sessionResponse.json();
      console.log(`📊 Session data:`, sessionData);
    } else {
      const errorText = await sessionResponse.text();
      console.log(`❌ Session error:`, errorText.substring(0, 200));
    }
    
    // Check response headers for cookies
    const responseHeaders = sessionResponse.headers;
    console.log('\n📋 Response headers:');
    for (const [key, value] of responseHeaders.entries()) {
      if (key.toLowerCase().includes('cookie') || key.toLowerCase().includes('set-cookie')) {
        console.log(`${key}: ${value}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

// Run in browser console after login
debugSession();
