const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateExistingDemandesStatus() {
  console.log('🔄 Mise à jour des statuts des demandes existantes...\n');

  try {
    // 1. Compter les demandes avec l'ancien statut
    const oldStatusCount = await prisma.demande.count({
      where: { status: 'EN_ATTENTE' }
    });

    console.log(`📊 Nombre de demandes avec statut "EN_ATTENTE": ${oldStatusCount}`);

    if (oldStatusCount > 0) {
      // 2. Mettre à jour toutes les demandes EN_ATTENTE vers ENVOYE
      const result = await prisma.demande.updateMany({
        where: { status: 'EN_ATTENTE' },
        data: { status: 'ENVOYE' }
      });

      console.log(`✅ ${result.count} demandes mises à jour vers "ENVOYE"`);
    } else {
      console.log('ℹ️  Aucune demande à mettre à jour');
    }

    // 3. Vérifier les autres statuts et les convertir si nécessaire
    const autresStatuts = await prisma.demande.findMany({
      where: { 
        status: { 
          notIn: ['ENVOYE', 'TRAITE'] 
        } 
      },
      select: {
        id: true,
        prenom: true,
        nom: true,
        status: true,
      }
    });

    if (autresStatuts.length > 0) {
      console.log('\n🔍 Autres statuts trouvés:');
      autresStatuts.forEach((demande, index) => {
        console.log(`   ${index + 1}. ${demande.prenom} ${demande.nom} - Status: "${demande.status}"`);
      });

      // Convertir les anciens statuts vers les nouveaux
      const statusMapping = {
        'EN_COURS': 'ENVOYE',
        'ACCEPTEE': 'TRAITE',
        'REFUSEE': 'TRAITE',
        'TERMINEE': 'TRAITE',
        'VALIDEE': 'TRAITE',
        'REJETEE': 'TRAITE'
      };

      for (const [oldStatus, newStatus] of Object.entries(statusMapping)) {
        const updateResult = await prisma.demande.updateMany({
          where: { status: oldStatus },
          data: { status: newStatus }
        });

        if (updateResult.count > 0) {
          console.log(`   ✅ ${updateResult.count} demandes "${oldStatus}" → "${newStatus}"`);
        }
      }
    }

    // 4. Statistiques finales
    console.log('\n📊 Statistiques finales:');
    const finalStats = {
      total: await prisma.demande.count(),
      envoyes: await prisma.demande.count({ where: { status: 'ENVOYE' } }),
      traites: await prisma.demande.count({ where: { status: 'TRAITE' } }),
    };

    console.log(`   Total demandes: ${finalStats.total}`);
    console.log(`   Statut ENVOYE: ${finalStats.envoyes}`);
    console.log(`   Statut TRAITE: ${finalStats.traites}`);

    // 5. Vérifier qu'il n'y a plus d'autres statuts
    const remainingOtherStatus = await prisma.demande.count({
      where: { 
        status: { 
          notIn: ['ENVOYE', 'TRAITE'] 
        } 
      }
    });

    if (remainingOtherStatus === 0) {
      console.log('✅ Tous les statuts sont maintenant conformes (ENVOYE/TRAITE)');
    } else {
      console.log(`⚠️  Il reste ${remainingOtherStatus} demandes avec des statuts non-conformes`);
    }

    console.log('\n🎉 Migration des statuts terminée!');

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateExistingDemandesStatus();
