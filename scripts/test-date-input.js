/**
 * Script de test pour valider le comportement du composant DateInput
 * Ce script simule les transformations qui se produisent dans le composant
 */

console.log('🧪 Test du composant DateInput - Gestion des formats de date\n');

// Simulation de la logique de parsing des dates dans DateInput
function testDateParsing() {
  console.log('📅 Test 1: Parsing des dates d\'entrée');
  
  const testDates = [
    '2023-09-15',  // Septembre avec zéro
    '2023-9-15',   // Septembre sans zéro
    '2023-12-01',  // Décembre avec zéro
    '2023-1-5',    // Janvier sans zéro
    '1990-02-28',  // Février avec zéro
    '1990-2-28',   // Février sans zéro
  ];

  const months = [
    { value: '1', label: 'Janvier' },
    { value: '2', label: 'Février' },
    { value: '3', label: 'Mars' },
    { value: '4', label: 'Avril' },
    { value: '5', label: 'Mai' },
    { value: '6', label: 'Juin' },
    { value: '7', label: 'Juillet' },
    { value: '8', label: 'Août' },
    { value: '9', label: 'Septembre' },
    { value: '10', label: 'Octobre' },
    { value: '11', label: 'Novembre' },
    { value: '12', label: 'Décembre' }
  ];

  testDates.forEach(dateStr => {
    console.log(`  📍 Test date: ${dateStr}`);
    
    const [yearPart, monthPart, dayPart] = dateStr.split('-');
    const year = yearPart || '';
    
    // Ancienne logique (qui causait le problème)
    const monthOld = monthPart || '';
    const dayOld = dayPart || '';
    
    // Nouvelle logique (corrigée)
    const monthNew = monthPart ? parseInt(monthPart, 10).toString() : '';
    const dayNew = dayPart ? parseInt(dayPart, 10).toString() : '';
    
    // Vérification de la correspondance avec les mois
    const monthNameOld = months.find(m => m.value === monthOld)?.label;
    const monthNameNew = months.find(m => m.value === monthNew)?.label;
    
    console.log(`    Ancienne logique: mois="${monthOld}" → ${monthNameOld || 'UNDEFINED!'}`);
    console.log(`    Nouvelle logique: mois="${monthNew}" → ${monthNameNew || 'UNDEFINED!'}`);
    console.log(`    ${monthNameNew ? '✅ Corrigé' : '❌ Problème persiste'}\n`);
  });
}

// Simulation de la logique de formatage des dates de sortie
function testDateFormatting() {
  console.log('📅 Test 2: Formatage des dates de sortie');
  
  const testCases = [
    { day: '15', month: '9', year: '2023' },
    { day: '1', month: '12', year: '2023' },
    { day: '28', month: '2', year: '1990' },
  ];

  testCases.forEach(({ day, month, year }) => {
    console.log(`  📍 Test: jour=${day}, mois=${month}, année=${year}`);
    
    if (day && month && year) {
      const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      console.log(`    Date formatée: ${formattedDate}`);
      
      // Re-parsing pour vérifier la cohérence
      const [yearPart, monthPart, dayPart] = formattedDate.split('-');
      const parsedMonth = monthPart ? parseInt(monthPart, 10).toString() : '';
      const parsedDay = dayPart ? parseInt(dayPart, 10).toString() : '';
      
      console.log(`    Re-parsing: jour=${parsedDay}, mois=${parsedMonth}, année=${yearPart}`);
      console.log(`    ✅ Cohérent: ${day === parsedDay && month === parsedMonth && year === yearPart ? 'OUI' : 'NON'}\n`);
    }
  });
}

// Exécution des tests
testDateParsing();
testDateFormatting();

console.log('🎯 Conclusion:');
console.log('   La correction appliquée utilise parseInt() pour normaliser');
console.log('   les valeurs de mois et jour, éliminant les zéros de tête');
console.log('   qui causaient les problèmes d\'affichage "undefined".');
