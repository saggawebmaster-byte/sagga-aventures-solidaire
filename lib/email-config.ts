// Configuration des correspondances d'emails pour les demandes
export const EPICERIE_EMAIL_MAP: Record<string, { email: string; name: string }> = {
  "CAYENNE": {
    email: "epicerie.cayenne@sagga.fr",
    name: "Epicerie TI DEGRA"
  },
  "SAINT-LAURENT DU MARONI": {
    email: "epicerie.sl@sagga.fr", 
    name: "Epicerie TI BAKISCI"
  },
  "MACOURIA": {
    email: "epicerie.macouria@sagga.fr",
    name: "Epicerie TI KEKE"
  }
};

export const CCAS_EMAIL_MAP: Record<string, { email: string; name: string; code: string }> = {
  "CAYENNE": {
    // email: "ccas.cayenne@sagga.fr",
    email: "ccas.cayenne@sagga.org",
    name: "CCAS CAYENNE",
    code: "688192"
  },
  "MACOURIA": {
    email: "ccas.macouria@sagga.org",   
    name: "CCAS MACOURIA",
    code: "688547"
  },
  "REMIRE-MONTJOLY": {
    email: "ccas.rm@sagga.org",
    name: "CCAS REMIRE-MONTJOLY", 
    code: "688201"
  },
  "MATOURY": {
    email: "ccas.matoury@sagga.org",
    name: "CCAS MATOURY",
    code: "688204"
  },
  "ROURA": {
    email: "ccas.roura@sagga.org",
    name: "CCAS ROURA",
    code: "688206"
  },
  "KOUROU": {
    email: "ccas.kourou@sagga.org",
    name: "CCAS KOUROU", 
    code: "688612"
  },
  "MONTSINÉRY-TONNEGRANDE": {
    email: "ccas.montsinery@sagga.org",
    name: "CCAS MONTSINERY",
    code: "688212"
  },
  "SAINT-LAURENT DU MARONI": {
    email: "ccas.sl@sagga.org",
    name: "CCAS SAINT LAURENT",
    code: "762402"
  },
  "MANA": {
    email: "ccas.mana@sagga.org",
    name: "CCAS MANA",
    code: "762316"
  },
  "IRACOUBO": {
    email: "ccas.iracoubou@sagga.org",
    name: "CCAS IRACOUBO",
    code: "688197"
  }
};

// Mapping des codes postaux par ville
export const VILLE_CODE_POSTAL_MAP: Record<string, string> = {
  'CAYENNE': '97300',
  'SAINT-LAURENT DU MARONI': '97320',
  'MACOURIA': '97355',
  'REMIRE-MONTJOLY': '97354',
  'MATOURY': '97351',
  'ROURA': '97311',
  'KOUROU': '97310',
  'MONTSINÉRY-TONNEGRANDE': '97356',
  'MANA': '97318',
  'IRACOUBO': '97350'
};

// Messages types pour les emails
export const EMAIL_MESSAGES = {
  GROCERY_STORE: `Bonjour, 
Une nouvelle demande d'aide alimentaire a été déposée et nécessite votre examen. 
Merci de la traiter dans les plus brefs délais.`,

  CCAS: `Bonjour,
Une requête pour une aide alimentaire d'urgence a été déposée. 
Nous vous remercions de procéder à son instruction et de nous faire part de votre décision aux adresses mails suivantes : 
• contact@sagga.org 
• administratif@sagga.org`
};

// Fonction pour normaliser les noms de villes
export function normalizeVille(ville: string): string {
  return ville.toUpperCase().trim();
}

// Fonction pour obtenir l'email de destination selon le type de demande
export function getDestinationEmail(ville: string, isAAU: boolean) {
  const normalizedVille = normalizeVille(ville);
  
  if (isAAU) {
    return CCAS_EMAIL_MAP[normalizedVille] || null;
  } else {
    return EPICERIE_EMAIL_MAP[normalizedVille] || null;
  }
}

// Fonction pour obtenir le message d'accompagnement pour AAU
export function getEmailMessageForAAU() {
  return EMAIL_MESSAGES.CCAS;
}

// Fonction pour obtenir le message d'accompagnement pour demande standard
export function getEmailMessageForStandard() {
  return EMAIL_MESSAGES.GROCERY_STORE;
}

// Fonctions utilitaires pour obtenir les listes de villes
export function getAvailableCitiesForAAU(): Array<{ value: string; label: string; type: string }> {
  // Pour les demandes AAU, toutes les villes avec CCAS sont disponibles
  return Object.keys(CCAS_EMAIL_MAP).map(ville => ({
    value: formatVilleForForm(ville),
    label: formatVilleForDisplay(ville),
    type: 'CCAS'
  })).sort((a, b) => a.label.localeCompare(b.label));
}

export function getAvailableCitiesForStandard(): Array<{ value: string; label: string; type: string }> {
  // Pour les demandes standard, seulement les villes avec épiceries
  return Object.keys(EPICERIE_EMAIL_MAP).map(ville => ({
    value: formatVilleForForm(ville),
    label: formatVilleForDisplay(ville),
    type: 'Épicerie'
  })).sort((a, b) => a.label.localeCompare(b.label));
}

export function getAvailableCities(isAAU: boolean): Array<{ value: string; label: string; type: string }> {
  if (isAAU) {
    return getAvailableCitiesForAAU();
  }
  return getAvailableCitiesForStandard();
}

// Fonction pour formater le nom de ville pour le formulaire (cohérence avec les valeurs actuelles)
export function formatVilleForForm(ville: string): string {
  const mapping: Record<string, string> = {
    'CAYENNE': 'Cayenne',
    'SAINT-LAURENT DU MARONI': 'Saint-Laurent',
    'MACOURIA': 'Macouria',
    'REMIRE-MONTJOLY': 'Remire',
    'MATOURY': 'Matoury',
    'ROURA': 'Roura',
    'KOUROU': 'Kourou',
    'MONTSINÉRY-TONNEGRANDE': 'Montsinéry',
    'MANA': 'Mana',
    'IRACOUBO': 'Iracoubo'
  };
  return mapping[ville] || ville;
}

// Fonction pour formater le nom de ville pour l'affichage
export function formatVilleForDisplay(ville: string): string {
  const mapping: Record<string, string> = {
    'CAYENNE': 'Cayenne',
    'SAINT-LAURENT DU MARONI': 'Saint-Laurent du Maroni',
    'MACOURIA': 'Macouria',
    'REMIRE-MONTJOLY': 'Rémire-Montjoly',
    'MATOURY': 'Matoury',
    'ROURA': 'Roura',
    'KOUROU': 'Kourou',
    'MONTSINÉRY-TONNEGRANDE': 'Montsinéry-Tonnegrande',
    'MANA': 'Mana',
    'IRACOUBO': 'Iracoubo'
  };
  return mapping[ville] || ville;
}

// Fonction pour convertir la valeur du formulaire vers le format email-config
export function convertFormVilleToEmailFormat(formVille: string): string {
  const reverseMapping: Record<string, string> = {
    'Cayenne': 'CAYENNE',
    'Saint-Laurent': 'SAINT-LAURENT DU MARONI',
    'Macouria': 'MACOURIA',
    'Remire': 'REMIRE-MONTJOLY',
    'Matoury': 'MATOURY',
    'Roura': 'ROURA',
    'Kourou': 'KOUROU',
    'Montsinéry': 'MONTSINÉRY-TONNEGRANDE',
    'Mana': 'MANA',
    'Iracoubo': 'IRACOUBO'
  };
  return reverseMapping[formVille] || formVille.toUpperCase();
}

// Fonction pour obtenir le code postal d'une ville
export function getCodePostalForVille(ville: string): string {
  const normalizedVille = normalizeVille(ville);
  return VILLE_CODE_POSTAL_MAP[normalizedVille] || '';
}

// Fonction pour obtenir le code postal à partir du format formulaire
export function getCodePostalForFormVille(formVille: string): string {
  const emailFormatVille = convertFormVilleToEmailFormat(formVille);
  return getCodePostalForVille(emailFormatVille);
}

// Interface pour les données de demande
export interface DemandeData {
  id?: number;
  prenom: string;
  nom: string;
  dateNaissance: string;
  telephone: string;
  email: string;
  adresse: string;
  ville: string;
  codePostal: string;
  situationFamiliale: string;
  nombreEnfants: number;
  sourcesRevenus: string[];
  montantRevenus: number;
  chargesLogement: number;
  autresCharges: number;
  prestationsCaf: string[];
  dettesActuelles: string;
  difficultesRencontrees: string;
  demandesPrecedentes: string;
  attentesBesoins: string;
  fichierJustificatifs?: string;
  aau: boolean;
  membres?: Array<{
    prenom: string;
    nom: string;
    dateNaissance: string;
    lienParente: string;
  }>;
  createdAt?: Date;
}
