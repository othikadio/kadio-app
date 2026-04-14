// ─── Règles de rémunération complètes ────────────────────────

// Calcule le prix client selon le lieu
export const prixClient = (service, lieu) => {
  if (!service) return 0
  if (lieu === 'chez_coiffeur') return service.prix_domicile  || service.prix_salon * 0.75
  if (lieu === 'domicile_client')         return service.prix_deplacement || service.prix_salon * 0.85
  return service.prix_salon
}

// Calcule la commission partenaire selon le lieu
export const commissionPartenaire = (service, lieu) => {
  if (!service) return 0
  if (lieu === 'chez_coiffeur') return service.commission_partenaire_domicile
  if (lieu === 'domicile_client')         return service.commission_partenaire_deplacement
  return service.commission_partenaire_salon
}

// Calcule la commission employé (75% du prix client)
export const commissionEmploye = (prixClient) => prixClient * 0.75

// Calcule la commission partenaire selon le mode de travail
// au_salon → 50% (Kadio fournit l'espace), tous les autres → 75%
export function calculerCommission(prix, mode) {
  if (mode === 'au_salon') return prix * 0.50
  return prix * 0.75
}

// Calcule les frais de déplacement
export const fraisDeplacement = (distanceKm, isAbonne, grille = GRILLE_DEFAUT) => {
  const row = grille.find(r => distanceKm >= r.min && distanceKm <= r.max)
  if (!row) return isAbonne ? 35 : 55
  return isAbonne ? row.abonne : row.normal
}

// Bonus conversion abonnement
export const bonusConversion = (planNom = '') => {
  const n = planNom.toLowerCase()
  if (n.includes('knotless') || n.includes('locs illim') || n.includes('microlocs')) return 15
  return 10
}

// Grille de déplacement (fallback si non chargée depuis DB)
export const GRILLE_DEFAUT = [
  { min: 0,  max: 5,  normal: 15, abonne: 8  },
  { min: 6,  max: 10, normal: 20, abonne: 12 },
  { min: 11, max: 20, normal: 30, abonne: 18 },
  { min: 21, max: 30, normal: 40, abonne: 25 },
  { min: 31, max: 50, normal: 55, abonne: 35 },
]

// Barème complet en fallback local (si DB non disponible)
export const BAREME_LOCAL = [
  { nom: 'Knotless Braids',     salon: 78, domicile: 58, deplacement: 66 },
  { nom: 'Box Braids',          salon: 65, domicile: 49, deplacement: 55 },
  { nom: 'Cornrows',            salon: 45, domicile: 34, deplacement: 38 },
  { nom: 'Tresses Collées',     salon: 52, domicile: 39, deplacement: 44 },
  { nom: 'Extension Tresses',   salon: 62, domicile: 46, deplacement: 53 },
  { nom: 'Tissage',             salon: 71, domicile: 53, deplacement: 60 },
  { nom: 'Lace Frontale',       salon: 58, domicile: 44, deplacement: 49 },
  { nom: 'Locks Resserrage',    salon: 39, domicile: 29, deplacement: 33 },
  { nom: 'Locks Réparation',    salon: 32, domicile: 24, deplacement: 27 },
  { nom: 'Lavage + Soin',       salon: 29, domicile: 22, deplacement: 25 },
  { nom: 'Coloration',          salon: 52, domicile: 39, deplacement: 44 },
  { nom: 'Défritage',           salon: 45, domicile: 34, deplacement: 38 },
  { nom: 'Coupe Homme',         salon: 23, domicile: 17, deplacement: 20 },
  { nom: 'Coupe + Barbe',       salon: 36, domicile: 27, deplacement: 31 },
  { nom: 'Barbe seulement',     salon: 13, domicile: 10, deplacement: 11 },
  { nom: 'Coupe Enfant',        salon: 16, domicile: 12, deplacement: 14 },
]
