#!/usr/bin/env node

// Script de test complet pour vérifier l'authentification en production sur Vercel
console.log("🧪 Test d'authentification en production Vercel\n")

const PROD_URL = "https://sagga-aventures-solidaire.vercel.app"
const TEST_USER = {
  email: "admin2@sagga.fr",
  password: "Admin@2025!"
}

async function testProductionAuth() {
  console.log("🌐 URL de production:", PROD_URL)
  console.log("👤 Utilisateur de test:", TEST_USER.email)
  console.log()

  try {
    // 1. Tester l'API de statut
    console.log("1️⃣ Test de l'API de statut...")
    const statusResponse = await fetch(`${PROD_URL}/api/user/role`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    console.log("   Statut API sans session:", statusResponse.status)
    
    if (statusResponse.status === 401) {
      console.log("   ✅ API répond correctement (401 attendu sans session)")
    } else {
      console.log("   ⚠️ Réponse inattendue:", await statusResponse.text())
    }
    console.log()

    // 2. Tester la connexion
    console.log("2️⃣ Test de connexion...")
    const loginResponse = await fetch(`${PROD_URL}/api/auth/sign-in/email`, {
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
    const loginData = await loginResponse.text()
    console.log("   Réponse:", loginData.substring(0, 200) + "...")
    console.log()

    // 3. Vérifier les cookies
    const cookies = loginResponse.headers.get('set-cookie')
    console.log("3️⃣ Cookies reçus:")
    if (cookies) {
      console.log("   ✅ Cookies présents")
      console.log("   ", cookies.substring(0, 100) + "...")
    } else {
      console.log("   ❌ Aucun cookie reçu")
    }
    console.log()

    // 4. Test de l'URL de callback
    console.log("4️⃣ Test de l'URL de callback...")
    const callbackResponse = await fetch(`${PROD_URL}/api/auth/callback?callbackUrl=/admin`, {
      method: 'GET',
      headers: {
        'Cookie': cookies || '',
      }
    })
    console.log("   Statut callback:", callbackResponse.status)
    console.log("   Headers de redirection:", callbackResponse.headers.get('location'))
    console.log()

    // 5. Instructions pour les tests manuels
    console.log("🔧 Tests manuels à effectuer:")
    console.log(`   1. Aller sur: ${PROD_URL}/auth/login?callbackUrl=%2Fadmin`)
    console.log(`   2. Se connecter avec: ${TEST_USER.email} / ${TEST_USER.password}`)
    console.log(`   3. Vérifier la redirection vers: ${PROD_URL}/admin`)
    console.log(`   4. Vérifier que le SessionDebugInfo s'affiche correctement`)
    console.log()

    console.log("✅ Script de test terminé")

  } catch (error) {
    console.error("❌ Erreur lors du test:", error.message)
  }
}

testProductionAuth()
