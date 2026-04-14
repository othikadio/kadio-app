// ── Centralized QR code verification ─────────────────────────

const RDV_DATABASE = {
  // Aminata (client) RDVs
  'KADIO-RDV001AA': { client: 'Aminata Diallo', service: 'Knotless braids',      date: '2026-04-05', heure: '10:00', statut: 'confirme',   isAbonne: true,  paiementOK: true,  statut_paiement: 'Abonnée ✓' },
  'KADIO-RDV002BB': { client: 'Aminata Diallo', service: 'Knotless braids',      date: '2026-05-03', heure: '09:00', statut: 'confirme',   isAbonne: true,  paiementOK: true,  statut_paiement: 'Abonnée ✓' },
  'KADIO-RDV003CC': { client: 'Aminata Diallo', service: 'Soin cuir chevelu',    date: '2026-04-20', heure: '14:00', statut: 'en_attente', isAbonne: true,  paiementOK: false, statut_paiement: 'En attente paiement' },
  'KADIO-RDV004DD': { client: 'Aminata Diallo', service: 'Knotless braids',      date: '2026-03-08', heure: '10:00', statut: 'termine',    isAbonne: true,  paiementOK: true,  statut_paiement: 'Payé ✓' },
  'KADIO-RDV005EE': { client: 'Aminata Diallo', service: 'Knotless braids',      date: '2026-02-07', heure: '10:00', statut: 'termine',    isAbonne: true,  paiementOK: true,  statut_paiement: 'Payé ✓' },

  // Partenaire demo codes
  'KADIO-RDV-D001': { client: 'Aminata Diallo', service: 'Knotless braids',      date: '2026-03-27', heure: '09:00', statut: 'confirme',   isAbonne: true,  paiementOK: true,  statut_paiement: 'Abonnée ✓' },
  'KADIO-RDV-D002': { client: 'Sophie Tremblay', service: 'Tresses classiques',  date: '2026-03-27', heure: '14:00', statut: 'confirme',   isAbonne: false, paiementOK: true,  statut_paiement: 'Payé ✓' },
  'KADIO-RDV-C001': { client: 'Christelle Mensah', service: 'Tresses signature', date: '2026-03-28', heure: '11:00', statut: 'confirme',   isAbonne: true,  paiementOK: true,  statut_paiement: 'Abonnée ✓' },
  'KADIO-RDV-C002': { client: 'Jean-Baptiste K.', service: 'Coupe dégradé',      date: '2026-03-28', heure: '15:00', statut: 'confirme',   isAbonne: false, paiementOK: true,  statut_paiement: 'Payé ✓' },

  // Employé demo codes
  'KADIO-EMP-M001': { client: 'Jean-Paul Leblanc', service: 'Coupe homme fade',  date: '2026-03-28', heure: '09:00', statut: 'termine',    isAbonne: false, paiementOK: true,  statut_paiement: 'Payé ✓', commission: 17.50 },
  'KADIO-EMP-M002': { client: 'Kevin Traoré',      service: 'Coupe dégradé',     date: '2026-03-28', heure: '10:00', statut: 'en_cours',   isAbonne: false, paiementOK: true,  statut_paiement: 'Payé ✓', commission: 20.00 },
  'KADIO-EMP-M003': { client: 'Omar Bah',          service: 'Barbe complète',    date: '2026-03-28', heure: '11:30', statut: 'confirme',   isAbonne: false, paiementOK: true,  statut_paiement: 'Payé ✓', commission: 12.50 },
}

/**
 * Verify a QR code scanned from a client
 * @param {string} code — raw scanned or typed code
 * @returns {{ valide: boolean, client?, service?, date?, heure?, statut?, isAbonne?, paiementOK?, statut_paiement?, commission? }}
 */
export function verifyQRCode(code) {
  if (!code) return { valide: false }
  const normalized = code.trim().toUpperCase()
  const rdv = RDV_DATABASE[normalized]
  if (!rdv) return { valide: false }
  return { valide: true, ...rdv }
}

export const DEMO_CODES = Object.keys(RDV_DATABASE)
