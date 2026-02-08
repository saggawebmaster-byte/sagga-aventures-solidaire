// Script pour vérifier le statut du domaine sur Resend
require('dotenv').config();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function checkDomain() {
  console.log('🔍 VÉRIFICATION DU DOMAINE SAGGA.FR SUR RESEND');
  console.log('='.repeat(80));
  console.log();

  try {
    // 1. Lister tous les domaines
    console.log('📋 DOMAINES ENREGISTRÉS:');
    console.log('-'.repeat(80));
    const { data: domains } = await resend.domains.list();
    
    if (!domains || domains.length === 0) {
      console.log('⚠️  Aucun domaine trouvé sur votre compte Resend');
      console.log();
      console.log('💡 SOLUTION: Vous devez ajouter le domaine sagga.fr sur Resend:');
      console.log('   1. Allez sur https://resend.com/domains');
      console.log('   2. Cliquez sur "Add Domain"');
      console.log('   3. Entrez: sagga.fr');
      console.log('   4. Suivez les instructions pour configurer les DNS (SPF, DKIM, etc.)');
      console.log();
      return;
    }

    domains.forEach((domain, i) => {
      console.log(`\n${i + 1}. Domaine: ${domain.name}`);
      console.log(`   ID: ${domain.id}`);
      console.log(`   Statut: ${domain.status}`);
      console.log(`   Créé le: ${domain.created_at}`);
      console.log(`   Région: ${domain.region || 'N/A'}`);
    });

    console.log();
    console.log('='.repeat(80));

    // 2. Vérifier si sagga.fr existe
    const saggaDomain = domains.find(d => d.name === 'sagga.fr');
    
    if (!saggaDomain) {
      console.log('❌ Le domaine sagga.fr n\'est PAS enregistré sur Resend');
      console.log();
      console.log('💡 SOLUTION:');
      console.log('   1. Allez sur https://resend.com/domains');
      console.log('   2. Ajoutez le domaine: sagga.fr');
      console.log('   3. Configurez les enregistrements DNS chez votre hébergeur');
      console.log();
      console.log('📧 EN ATTENDANT: Utilisez un domaine vérifié ou "onboarding@resend.dev"');
      console.log('   Pour modifier, changez dans lib/email-service.ts:');
      console.log('   from: "SAGGA <noreply@sagga.fr>" → from: "SAGGA <onboarding@resend.dev>"');
    } else {
      console.log('✅ Le domaine sagga.fr EST enregistré');
      console.log();
      
      // Obtenir les détails du domaine
      console.log('📊 DÉTAILS DU DOMAINE:');
      console.log('-'.repeat(80));
      const { data: domainDetails } = await resend.domains.get(saggaDomain.id);
      
      console.log(`Nom: ${domainDetails.name}`);
      console.log(`Statut: ${domainDetails.status}`);
      console.log(`Région: ${domainDetails.region}`);
      console.log();
      
      if (domainDetails.status === 'verified') {
        console.log('✅ Le domaine est VÉRIFIÉ - Les emails devraient fonctionner');
      } else if (domainDetails.status === 'pending') {
        console.log('⚠️  Le domaine est EN ATTENTE de vérification');
        console.log();
        console.log('💡 ACTION REQUISE:');
        console.log('   1. Allez sur https://resend.com/domains/' + saggaDomain.id);
        console.log('   2. Vérifiez les enregistrements DNS requis');
        console.log('   3. Ajoutez-les chez votre hébergeur DNS');
        console.log('   4. Attendez la propagation DNS (peut prendre quelques heures)');
      } else {
        console.log('❌ Statut inconnu:', domainDetails.status);
      }

      // Afficher les enregistrements DNS si disponibles
      if (domainDetails.records && domainDetails.records.length > 0) {
        console.log();
        console.log('📝 ENREGISTREMENTS DNS À CONFIGURER:');
        console.log('-'.repeat(80));
        domainDetails.records.forEach((record, i) => {
          console.log(`\n${i + 1}. Type: ${record.record_type}`);
          console.log(`   Nom: ${record.name}`);
          console.log(`   Valeur: ${record.value}`);
          console.log(`   Statut: ${record.status || 'N/A'}`);
        });
      }
    }

    console.log();
    console.log('='.repeat(80));

    // 3. Lister les emails récents
    console.log();
    console.log('📬 EMAILS RÉCENTS (dernières 24h):');
    console.log('-'.repeat(80));
    
    try {
      const { data: emails } = await resend.emails.list({ limit: 10 });
      
      if (!emails || emails.length === 0) {
        console.log('⚠️  Aucun email trouvé');
      } else {
        emails.forEach((email, i) => {
          console.log(`\n${i + 1}. ${email.subject || 'Sans sujet'}`);
          console.log(`   De: ${email.from}`);
          console.log(`   À: ${email.to}`);
          console.log(`   Statut: ${email.last_event || email.status || 'N/A'}`);
          console.log(`   Créé: ${email.created_at}`);
          console.log(`   ID: ${email.id}`);
        });
      }
    } catch (listError) {
      console.log('⚠️  Impossible de lister les emails:', listError.message);
    }

  } catch (error) {
    console.error('❌ ERREUR:', error.message);
    console.error('Détails:', error);
  }

  console.log();
  console.log('='.repeat(80));
}

checkDomain();
