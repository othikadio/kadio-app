// ─── Couleurs thème ──────────────────────────────────────────
export const OR    = '#B8922A'
export const CREME = '#FAFAF8'
export const NOIR  = '#0E0C09'
export const IVOIRE = '#F5F0E8'
export const SABLE  = '#EDE7DC'
export const CARD  = '#F5F0E8'
export const CARD2 = '#EDE7DC'
export const MUTED = 'rgba(14,12,9,0.45)'
export const BORDER_OR = 'rgba(184,146,42,0.2)'

// ─── Formatters ──────────────────────────────────────────────
export const formatMontant = (n) =>
  n === null || n === undefined ? '—' : `${Number(n).toFixed(2).replace('.', ',')} $`

export const formatDate = (d) => {
  if (!d) return '—'
  const date = new Date(d)
  return date.toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' })
}

export const formatDateShort = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-CA', { month: 'short', day: 'numeric' })
}

export const formatHeure = (h) => h ? h.slice(0, 5) : '—'

export const formatTelephone = (t) => {
  if (!t) return ''
  const clean = t.replace(/\D/g, '')
  if (clean.length === 10) return `${clean.slice(0,3)}-${clean.slice(3,6)}-${clean.slice(6)}`
  if (clean.length === 11) return `+${clean[0]} ${clean.slice(1,4)}-${clean.slice(4,7)}-${clean.slice(7)}`
  return t
}

// ─── Génération codes ─────────────────────────────────────────
export const genQRCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  return `KADIO-${Array.from({length: 8}, () => chars[Math.floor(Math.random() * chars.length)]).join('')}`
}

export const genCodeParrainage = (prenom) => {
  const suffix = Math.floor(1000 + Math.random() * 9000)
  return `${(prenom || 'USER').toUpperCase().slice(0, 5)}-${suffix}`
}

export const genCodePartenaire = (prenom, index) => {
  const n = String(index).padStart(3, '0')
  return `KADIO-${(prenom || 'PRT').toUpperCase().slice(0, 5)}-${n}`
}

// ─── Calcul barème ────────────────────────────────────────────
export const calcCommissionPartenaire = (service, mode) => {
  if (!service) return 0
  if (mode === 'au_salon')           return service.commission_partenaire_salon
  if (mode === 'chez_coiffeur')   return service.commission_partenaire_domicile
  if (mode === 'domicile_client')           return service.commission_partenaire_deplacement
  return service.commission_partenaire_salon
}

export const calcCommissionEmploye = (service, prixReel) => {
  return prixReel ? prixReel * 0.5 : service?.commission_employe || 0
}

// ─── Distance Haversine (km) ──────────────────────────────────
export const haversineKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371
  const toRad = (deg) => deg * Math.PI / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat/2)**2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

export const tarifDeplacement = (km, isAbonne, grille) => {
  const row = grille?.find(r => km >= r.distance_min_km && km <= r.distance_max_km)
  if (!row) return isAbonne ? 35 : 55 // fallback max
  return isAbonne ? row.tarif_abonne : row.tarif_normal
}

// ─── Bonus conversion ─────────────────────────────────────────
export const calcBonusConversion = (planNom) => {
  if (!planNom) return 0
  const nom = planNom.toLowerCase()
  if (nom.includes('knotless') || nom.includes('locs illim') || nom.includes('microlocs')) return 15
  return 10
}

// ─── Helpers UI ───────────────────────────────────────────────
export const statutColor = (statut) => ({
  actif:       '#22c55e',
  confirme:    '#22c55e',
  termine:     '#22c55e',
  verse:       '#22c55e',
  complete:    '#22c55e',
  livree:      '#22c55e',
  certifie:    OR,
  elite:       OR,
  ambassadeur: OR,
  en_attente:  '#f59e0b',
  en_revision: '#f59e0b',
  confirmee:   '#f59e0b',
  en_cours:    '#f59e0b',
  pending:     '#f59e0b',
  expediee:    '#60a5fa',
  suspendu:    '#ef4444',
  inactif:     '#6b7280',
  annule:      '#ef4444',
  annulee:     '#ef4444',
  no_show:     '#ef4444',
  bloque:      '#ef4444',
  refusee:     '#ef4444',
  echec:       '#ef4444',
}[statut] || '#6b7280')

export const niveauLabel = (n) => ({
  partenaire:  'Partenaire',
  certifie:    'Certifié ✓',
  elite:       'Élite ★',
  ambassadeur: 'Ambassadeur 👑',
}[n] || n)

// ─── Misc ─────────────────────────────────────────────────────
export const sleep = (ms) => new Promise(r => setTimeout(r, ms))

export const chunk = (arr, size) => {
  const result = []
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size))
  return result
}

export const initiales = (prenom, nom) =>
  `${(prenom || '?')[0]}${(nom || '?')[0]}`.toUpperCase()
