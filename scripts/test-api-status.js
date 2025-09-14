// Test complet du système de statuts
async function testCompletStatusSystem() {
  console.log('🧪 Test complet du système de statuts...\n');

  try {
    // 1. Tester l'API GET pour récupérer les demandes
    console.log('1. Test de récupération des demandes...');
    const getResponse = await fetch('http://localhost:3000/api/demandes');
    const getResult = await getResponse.json();

    if (getResult.success) {
      console.log(`✅ ${getResult.demandes.length} demandes récupérées`);
      
      // Vérifier les statuts
      const statusCounts = getResult.demandes.reduce((acc, demande) => {
        acc[demande.status] = (acc[demande.status] || 0) + 1;
        return acc;
      }, {});

      console.log('   Répartition des statuts:', statusCounts);
      
      if (getResult.demandes.length > 0) {
        const firstDemande = getResult.demandes[0];
        
        // 2. Tester la mise à jour de statut
        console.log('\n2. Test de mise à jour de statut...');
        console.log(`   Demande test: ${firstDemande.prenom} ${firstDemande.nom} (${firstDemande.status})`);
        
        const newStatus = firstDemande.status === 'ENVOYE' ? 'TRAITE' : 'ENVOYE';
        
        const updateResponse = await fetch(`http://localhost:3000/api/demandes/${firstDemande.id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        });

        const updateResult = await updateResponse.json();

        if (updateResult.success) {
          console.log(`✅ Statut mis à jour: ${firstDemande.status} → ${newStatus}`);
          
          // 3. Remettre le statut original
          const revertResponse = await fetch(`http://localhost:3000/api/demandes/${firstDemande.id}/status`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: firstDemande.status }),
          });

          const revertResult = await revertResponse.json();
          
          if (revertResult.success) {
            console.log(`✅ Statut restauré: ${newStatus} → ${firstDemande.status}`);
          } else {
            console.log(`❌ Erreur lors de la restauration:`, revertResult.error);
          }
        } else {
          console.log(`❌ Erreur lors de la mise à jour:`, updateResult.error);
        }

        // 4. Tester un statut invalide
        console.log('\n3. Test de statut invalide...');
        const invalidResponse = await fetch(`http://localhost:3000/api/demandes/${firstDemande.id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'INVALID_STATUS' }),
        });

        const invalidResult = await invalidResponse.json();
        
        if (!invalidResult.success) {
          console.log('✅ Statut invalide correctement rejeté:', invalidResult.error);
        } else {
          console.log('❌ Le statut invalide a été accepté (problème)');
        }
      }
    } else {
      console.log('❌ Erreur lors de la récupération:', getResult.error);
    }

    console.log('\n🎉 Test complet terminé!');

  } catch (error) {
    console.error('❌ Erreur pendant le test:', error.message);
  }
}

// Attendre un peu que le serveur soit prêt
setTimeout(() => {
  testCompletStatusSystem();
}, 2000);
