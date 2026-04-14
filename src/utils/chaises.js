// ── Logique centralisée réservation chaises salon ─────────────

export const TARIF_HORAIRE_SEUIL_H = 6 // < 6h → tarif horaire, ≥ 6h → tarif journée
export const DUREE_MIN_H           = 2 // minimum 2h de réservation
export const HEURES_OUVERTURE      = { debut: '09:00', fin: '19:00' }

/** 'HH:MM' → minutes since midnight */
export function toMin(heure) {
  const [h, m] = heure.split(':').map(Number)
  return h * 60 + m
}

/** minutes → 'HH:MM' */
export function fromMin(min) {
  const h = Math.floor(min / 60).toString().padStart(2, '0')
  const m = (min % 60).toString().padStart(2, '0')
  return `${h}:${m}`
}

/**
 * true si le créneau [a1,a2[ chevauche [b1,b2[
 */
function chevauche(a1, a2, b1, b2) {
  return a1 < b2 && a2 > b1
}

/**
 * Retourne true si la date est un mardi (salon fermé)
 */
export function estMardi(dateStr) {
  if (!dateStr) return false
  const d = new Date(dateStr + 'T12:00:00')
  return d.getDay() === 2 // 0=dim, 1=lun, 2=mar…
}

/**
 * Retourne true si la durée est suffisante (≥ DUREE_MIN_H)
 */
export function dureeSuffisante(heureDebut, heureFin) {
  if (!heureDebut || !heureFin) return false
  return (toMin(heureFin) - toMin(heureDebut)) >= DUREE_MIN_H * 60
}

/**
 * Retourne les chaises libres pour le créneau demandé
 * @param {Array} reservations — toutes les réservations actives
 * @param {Array} chaises      — liste des chaises
 * @param {string} date
 * @param {string} heureDebut
 * @param {string} heureFin
 * @returns {Array} chaises disponibles
 */
export function getChaisesDisponibles(reservations, chaises, date, heureDebut, heureFin) {
  if (!date || !heureDebut || !heureFin) return chaises
  const debut = toMin(heureDebut)
  const fin   = toMin(heureFin)

  const reserveeIds = new Set(
    reservations
      .filter(r => r.date === date && r.statut !== 'annule')
      .filter(r => chevauche(debut, fin, toMin(r.heure_debut), toMin(r.heure_fin)))
      .map(r => r.chaise_id)
  )

  return chaises.filter(ch => !reserveeIds.has(ch.id))
}

/**
 * Calcule le tarif pour un créneau
 * < 6h → tarif_heure × nombre d'heures (arrondi au-dessus)
 * ≥ 6h → tarif_journee
 */
export function calculerTarif(chaise, heureDebut, heureFin) {
  if (!chaise || !heureDebut || !heureFin) return 0
  const minutes = toMin(heureFin) - toMin(heureDebut)
  if (minutes <= 0) return 0
  const heures = minutes / 60
  if (heures >= TARIF_HORAIRE_SEUIL_H) return chaise.tarif_journee
  return Math.ceil(heures) * chaise.tarif_heure
}

/**
 * Crée une réservation (objet — sans persistance)
 */
export function creerReservation({ chaiseId, chaiseNom, partenaire, date, heureDebut, heureFin, tarif, service = '' }) {
  return {
    id: `rc-${Date.now()}`,
    chaise_id:   chaiseId,
    chaise_nom:  chaiseNom,
    partenaire,
    date,
    heure_debut: heureDebut,
    heure_fin:   heureFin,
    tarif,
    service,
    statut: 'confirme',
  }
}
