#!/usr/bin/env node

/**
 * Script de test pour vérifier le routage des emails selon AAU
 */

import { getDestinationEmail } from '../lib/email-config.js';

console.log('\n🧪 TEST DU ROUTAGE DES EMAILS SELON AAU');
console.log('='.repeat(80));

const testCases = [
  {
    ville: 'CAYENNE',
    aau: false,
    description: 'Demande STANDARD à Cayenne'
  },
  {
    ville: 'CAYENNE',
    aau: true,
    description: 'Demande AAU (URGENTE) à Cayenne'
  },
  {
    ville: 'MACOURIA',
    aau: false,
    description: 'Demande STANDARD à Macouria'
  },
  {
    ville: 'SAINT-LAURENT DU MARONI',
    aau: true,
    description: 'Demande AAU à Saint-Laurent'
  }
];

testCases.forEach((test, index) => {
  console.log(`\n📋 Test ${index + 1}: ${test.description}`);
  console.log('-'.repeat(80));
  console.log(`   Ville: ${test.ville}`);
  console.log(`   AAU: ${test.aau ? '✅ OUI (URGENCE)' : '❌ NON (Standard)'}`);
  
  const destination = getDestinationEmail(test.ville, test.aau);
  
  if (destination) {
    console.log(`   ✅ Destinataire trouvé:`);
    console.log(`      Organisme: ${destination.name}`);
    console.log(`      Email: ${destination.email}`);
    console.log(`      Type: ${test.aau ? 'CCAS (AAU)' : 'ÉPICERIE (Standard)'}`);
  } else {
    console.log(`   ❌ Aucun destinataire configuré`);
  }
});

console.log('\n' + '='.repeat(80));
console.log('✨ Tests terminés\n');

// Afficher un résumé de la configuration actuelle
console.log('📊 RÉSUMÉ DE LA CONFIGURATION ACTUELLE');
console.log('='.repeat(80));
console.log('\n🏪 ÉPICERIES (Demandes STANDARD, AAU=false):');
console.log('   - CAYENNE → thomas.awounfouet@gmail.com');
console.log('   - SAINT-LAURENT DU MARONI → epicerie.sl@sagga.fr');
console.log('   - MACOURIA → epicerie.macouria@sagga.fr');

console.log('\n🏛️  CCAS (Demandes AAU/URGENTES, AAU=true):');
console.log('   - CAYENNE → thomas.awounfouet@gmail.com');
console.log('   - MACOURIA → ccas.macouria@sagga.org');
console.log('   - REMIRE-MONTJOLY → ccas.rm@sagga.org');
console.log('   - MATOURY → ccas.matoury@sagga.org');
console.log('   - ROURA → ccas.roura@sagga.org');
console.log('   - KOUROU → ccas.kourou@sagga.org');
console.log('   - MONTSINÉRY-TONNEGRANDE → ccas.montsinery@sagga.org');
console.log('   - SAINT-LAURENT DU MARONI → ccas.sl@sagga.org');
console.log('   - MANA → ccas.mana@sagga.org');
console.log('   - IRACOUBO → ccas.iracoubou@sagga.org');

console.log('\n💡 IMPORTANT:');
console.log('   - Décochez AAU (Aide Alimentaire d\'Urgence) → Email vers ÉPICERIE');
console.log('   - Cochez AAU (Aide Alimentaire d\'Urgence) → Email vers CCAS');
console.log('\n');
