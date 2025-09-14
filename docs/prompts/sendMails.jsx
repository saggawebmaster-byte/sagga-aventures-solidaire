export const STRUCTURE_EMAILS: Record<string, string[]> = {
  "Cayenne": ["tidegra@sagga.fr"],
  "Saint-Laurent": ["tibakicsi@gmail.com"],
  "Macouria": ["contact.a3pguyane@gmail.com"],
  // Valeur par défaut pour les autres villes
  "Apatou": ["tidegra@sagga.fr"], // ou une adresse par défaut
  "Remire": ["tidegra@sagga.fr"],
  "Matoury": ["tidegra@sagga.fr"],
  "Roura": ["tidegra@sagga.fr"],
  "Kourou": ["tidegra@sagga.fr"],
  "Montsinéry": ["tidegra@sagga.fr"],
  "Mana": ["tidegra@sagga.fr"],
  "Iracoubo": ["tidegra@sagga.fr"]
};

export const CCAS_EMAILS: Record<string, string[]> = {
  "Cayenne": [
    "direction@ccas-cayenne.org",
    "coordinatriceaau@ccas-cayenne.org"
  ],
  "Macouria": [
    "alsainteluce@ccasmacouria.fr",
    "ccas.rm.lpulcherie@orange.fr",
    "ccas.rm.simonnet@orange.fr"
  ],
  "Remire": [
    "ccas.rm.stanislas@orange.fr",
    "ccas.rm.albertrogier@orange.fr"
  ],
  "Matoury": [
    "ccas@mairie-matoury.fr",
    "ccasmt@orange.fr",
    "line.atticot@mairie-matoury.fr"
  ],
  "Roura": [
    "nicole.gomes-caldas@roura.gf",
    "centresocio.roura@orange.fr",
    "mariechantal.dominique@roura.gf"
  ],
  "Kourou": [
    "henriol.murielle@ctguyane.fr",
    "jeanne.varlin@ciass-guyane.fr",
    "virginie.dias@ciass-guyane.fr"
  ],
  "Montsinéry": [
    "line.bourdon@montsinery-tonnegrande.fr",
    "celly.popo@montsinery-tonnegrande.fr",
    "yannis.manguer@montsinery-tonnegrande.fr"
  ],
  "Saint-Laurent": [
    "ccas97320c.nanhou@orange.fr",
    "ccas97320educateur1@orange.fr"
  ],
  "Mana": [
    "ccas.mana@orange.fr",
    "bazilie@mairie-mana.fr"
  ],
  "Iracoubo": [
    "louise.alexis@ctguyane.fr",
    "accueil.iracoubo@gmail.fr"
  ],
  // Valeur par défaut pour Apatou (pas de CCAS défini)
  "Apatou": ["tidegra@sagga.fr"]
};

export function getEmailRecipients(ville: string, aau: boolean): string[] {
  if (aau) {
    return CCAS_EMAILS[ville] || STRUCTURE_EMAILS[ville] || ["tidegra@sagga.fr"];
  } else {
    return STRUCTURE_EMAILS[ville] || ["tidegra@sagga.fr"];
  }
}