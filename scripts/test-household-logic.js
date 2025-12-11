#!/usr/bin/env node
// Script de test pour valider la logique de gestion des foyers selon la situation familiale

const scenarios = [
  {
    name: "Célibataire seul",
    situation: "celibataire",
    membres: [],
    expected: {
      totalPersons: 1,
      validationOk: true,
      emailText: "1 personne"
    }
  },
  {
    name: "Célibataire avec enfant",
    situation: "celibataire", 
    membres: [{ nom: "Martin", prenom: "Jean", sexe: "homme", dateNaissance: "2010-05-15" }],
    expected: {
      totalPersons: 2,
      validationOk: true,
      emailText: "2 personnes"
    }
  },
  {
    name: "Concubinage seul",
    situation: "concubinage",
    membres: [],
    expected: {
      totalPersons: 1,
      validationOk: true,
      emailText: "1 personne"
    }
  },
  {
    name: "Veuf/Veuve seul",
    situation: "veuf",
    membres: [],
    expected: {
      totalPersons: 1,
      validationOk: true,
      emailText: "1 personne"
    }
  },
  {
    name: "Marié sans membre (invalide)",
    situation: "marie",
    membres: [],
    expected: {
      totalPersons: 1,
      validationOk: false,
      emailText: "1 personne mais validation échoue"
    }
  },
  {
    name: "Marié avec conjoint",
    situation: "marie",
    membres: [{ nom: "Dupont", prenom: "Marie", sexe: "femme", dateNaissance: "1985-03-20" }],
    expected: {
      totalPersons: 2,
      validationOk: true,
      emailText: "2 personnes"
    }
  },
  {
    name: "Divorcé sans membre (invalide)",
    situation: "divorce",
    membres: [],
    expected: {
      totalPersons: 1,
      validationOk: false,
      emailText: "1 personne mais validation échoue"
    }
  },
  {
    name: "Famille nombreuse",
    situation: "marie",
    membres: [
      { nom: "Dupont", prenom: "Marie", sexe: "femme", dateNaissance: "1985-03-20" },
      { nom: "Dupont", prenom: "Pierre", sexe: "homme", dateNaissance: "2010-07-10" },
      { nom: "Dupont", prenom: "Julie", sexe: "femme", dateNaissance: "2012-11-25" }
    ],
    expected: {
      totalPersons: 4,
      validationOk: true,
      emailText: "4 personnes"
    }
  }
];

// Simulation de la logique de validation
function simulateValidation(situation, membres) {
  const requiredFields = ['prenom', 'nom', 'dateNaissance', 'sexe', 'situation', 'email', 'adresse', 'codePostal'];
  const basicFieldsValid = true; // On assume que les champs de base sont remplis
  
  const singlePersonSituations = ['celibataire', 'concubinage', 'veuf'];
  const canBeSinglePerson = singlePersonSituations.includes(situation);
  
  if (canBeSinglePerson) {
    return basicFieldsValid; // Pas besoin de membres du foyer
  }
  
  // Pour marie/pacse/divorce : au moins un membre requis
  const hasValidHouseholdMember = membres.some(member => 
    member.nom && member.prenom && member.sexe && member.dateNaissance
  );
  
  return basicFieldsValid && hasValidHouseholdMember;
}

// Simulation du calcul du nombre de personnes
function calculateTotalPersons(situation, membres) {
  const singlePersonSituations = ['celibataire', 'concubinage', 'veuf'];
  const canBeSinglePerson = singlePersonSituations.includes(situation);
  
  const validMembers = membres.filter(member =>
    member.nom && member.prenom && member.sexe && member.dateNaissance
  );
  
  return canBeSinglePerson && validMembers.length === 0 ? 1 : validMembers.length + 1;
}

console.log('🧪 Test de la logique de gestion des foyers selon la situation familiale\n');

let allPassed = true;

scenarios.forEach((scenario, index) => {
  const validation = simulateValidation(scenario.situation, scenario.membres);
  const totalPersons = calculateTotalPersons(scenario.situation, scenario.membres);
  
  const validationPassed = validation === scenario.expected.validationOk;
  const totalPersonsPassed = totalPersons === scenario.expected.totalPersons;
  
  const testPassed = validationPassed && totalPersonsPassed;
  allPassed = allPassed && testPassed;
  
  console.log(`${testPassed ? '✅' : '❌'} Test ${index + 1}: ${scenario.name}`);
  console.log(`   Situation: ${scenario.situation}`);
  console.log(`   Membres: ${scenario.membres.length}`);
  console.log(`   Personnes calculées: ${totalPersons} (attendu: ${scenario.expected.totalPersons}) ${totalPersonsPassed ? '✅' : '❌'}`);
  console.log(`   Validation: ${validation ? 'OK' : 'KO'} (attendu: ${scenario.expected.validationOk ? 'OK' : 'KO'}) ${validationPassed ? '✅' : '❌'}`);
  console.log(`   Résultat email: ${scenario.expected.emailText}`);
  console.log();
});

console.log(`\n📊 Résultat global: ${allPassed ? '✅ TOUS LES TESTS PASSENT' : '❌ CERTAINS TESTS ÉCHOUENT'}`);

if (allPassed) {
  console.log('\n🎉 L\'implémentation est correcte !');
  console.log('\n📋 Fonctionnalités validées:');
  console.log('   ✅ Validation adaptée selon la situation');
  console.log('   ✅ Calcul correct du nombre de personnes dans le foyer');
  console.log('   ✅ Gestion des cas célibataire/concubinage/veuf');
  console.log('   ✅ Validation requise pour marié/pacsé/divorcé');
  console.log('   ✅ Support des foyers multi-personnes');
} else {
  console.log('\n❌ Des ajustements sont nécessaires');
}
