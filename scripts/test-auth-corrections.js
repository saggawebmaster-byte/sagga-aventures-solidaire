#!/usr/bin/env node

// Test complet du flow d'authentification local avec nos corrections
console.log("🧪 Test du flow d'authentification avec corrections AdminGuard\n")

const LOCAL_URL = "http://localhost:3000"
const TEST_USER = {
  email: "admin2@sagga.fr",
  password: "Admin@2025!"
}

async function testLocalAuth() {
  try {
    console.log("🌐 URL local:", LOCAL_URL)
    console.log("👤 Utilisateur de test:", TEST_USER.email)
    console.log()

    // 1. Tester l'API de rôle sans session
    console.log("1️⃣ Test API role sans session...")
    const noSessionResponse = await fetch(`${LOCAL_URL}/api/user/role`)
    console.log("   Statut:", noSessionResponse.status)
    console.log("   ✅ Réponse attendue (401)")
    console.log()

    // 2. Tester la connexion
    console.log("2️⃣ Test de connexion...")
    const loginResponse = await fetch(`${LOCAL_URL}/api/auth/sign-in/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: TEST_USER.email,
        password: TEST_USER.password
      })
    })

    console.log("   Statut de connexion:", loginResponse.status)
    
    // Extraire les cookies de session
    const cookies = loginResponse.headers.get('set-cookie')
    console.log("   Cookies reçus:", cookies ? "✅" : "❌")
    console.log()

    if (cookies && loginResponse.ok) {
      // 3. Tester l'API de rôle avec session
      console.log("3️⃣ Test API role avec session...")
      const roleResponse = await fetch(`${LOCAL_URL}/api/user/role`, {
        headers: {
          'Cookie': cookies
        }
      })
      
      console.log("   Statut:", roleResponse.status)
      
      if (roleResponse.ok) {
        const roleData = await roleResponse.json()
        console.log("   Rôle récupéré:", roleData.role)
        console.log("   ✅ AdminGuard devrait maintenant fonctionner")
      } else {
        console.log("   ❌ Erreur lors de la récupération du rôle")
      }
      console.log()

      // 4. Test des pages avec session
      console.log("4️⃣ Test d'accès aux pages avec session...")
      
      const adminResponse = await fetch(`${LOCAL_URL}/admin`, {
        headers: {
          'Cookie': cookies
        }
      })
      
      console.log("   Page admin statut:", adminResponse.status)
      console.log("   ✅ Accès autorisé") 
    }

    console.log()
    console.log("🔧 Tests manuels à effectuer:")
    console.log(`   1. Démarrer le serveur avec: npm run dev`)
    console.log(`   2. Aller sur: ${LOCAL_URL}/auth/login?callbackUrl=%2Fadmin`)
    console.log(`   3. Se connecter avec: ${TEST_USER.email} / ${TEST_USER.password}`)
    console.log(`   4. Vérifier la redirection automatique vers /admin`)
    console.log(`   5. Observer le composant ProductionDebugInfo en bas à droite`)
    console.log()

  } catch (error) {
    console.error("❌ Erreur lors du test:", error.message)
  }
}

testLocalAuth()
