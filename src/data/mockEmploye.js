// ── Marcus Pierre — Employé barbier ──────────────────────────

export const MOCK_MARCUS_EMPLOYE = {
  id: 'emp-marcus',
  user_id: 'usr-marcus',
  prenom: 'Marcus',
  nom: 'Pierre',
  role_salon: 'coiffeur',
  specialites: ['Barbier', 'Tresses', 'Locs', 'Coupes'],
  couleur_agenda: '#10B981',
  pin_acces: '3333',
  actif: true,
  recompenses: {
    note_moyenne_mois: 4.7,
    no_shows_mois: 0,
    services_mois: 18,
    nouveaux_clients_mois: 7,
    badges_obtenus: ['fiabilite'],
    bonus_ce_mois: 25,
    historique_badges: [
      { mois: 'Février 2026', badges: ['excellence', 'fiabilite'], bonus: 75 },
      { mois: 'Janvier 2026', badges: ['mvp'], bonus: 75 },
    ],
  },
}

// Today = 2026-03-28 (samedi)
export const MOCK_RDV_MARCUS = [
  // Aujourd'hui — 4 RDV
  { id: 'rm1', code_qr: 'KADIO-EMP-M001', client: { prenom: 'Jean-Paul', telephone: '514-555-0101' }, service: { nom: 'Coupe homme fade', duree_minutes: 45, prix: 35 }, heure_debut: '09:00', heure_fin: '09:45', date_rdv: '2026-03-28', statut: 'termine', commission: 26.25, lieu: 'au_salon', walk_in: false },
  { id: 'rm2', code_qr: 'KADIO-EMP-M002', client: { prenom: 'Kevin', telephone: '514-555-0202' }, service: { nom: 'Coupe dégradé', duree_minutes: 45, prix: 40 }, heure_debut: '10:00', heure_fin: '10:45', date_rdv: '2026-03-28', statut: 'en_cours', commission: 30, lieu: 'au_salon', walk_in: false },
  { id: 'rm3', code_qr: 'KADIO-EMP-M003', client: { prenom: 'Omar', telephone: '514-555-0303' }, service: { nom: 'Barbe complète', duree_minutes: 30, prix: 25 }, heure_debut: '11:30', heure_fin: '12:00', date_rdv: '2026-03-28', statut: 'confirme', commission: 18.75, lieu: 'au_salon', walk_in: false },
  { id: 'rm4', code_qr: 'KADIO-EMP-M004', client: { prenom: 'Walk-in', telephone: null }, service: { nom: 'Coupe homme fade', duree_minutes: 45, prix: 35 }, heure_debut: '14:00', heure_fin: '14:45', date_rdv: '2026-03-28', statut: 'confirme', commission: 26.25, lieu: 'au_salon', walk_in: true },
  // Semaine en cours
  { id: 'rm5', code_qr: 'KADIO-EMP-M005', client: { prenom: 'David', telephone: '514-555-0505' }, service: { nom: 'Coupe homme fade', duree_minutes: 45, prix: 35 }, heure_debut: '10:00', heure_fin: '10:45', date_rdv: '2026-03-29', statut: 'confirme', commission: 26.25, lieu: 'au_salon', walk_in: false },
  { id: 'rm6', code_qr: 'KADIO-EMP-M006', client: { prenom: 'Samuel', telephone: '514-555-0606' }, service: { nom: 'Barbe complète', duree_minutes: 30, prix: 25 }, heure_debut: '14:00', heure_fin: '14:30', date_rdv: '2026-03-30', statut: 'confirme', commission: 18.75, lieu: 'au_salon', walk_in: false },
  { id: 'rm7', code_qr: 'KADIO-EMP-M007', client: { prenom: 'Théo', telephone: '514-555-0707' }, service: { nom: 'Coupe dégradé', duree_minutes: 45, prix: 40 }, heure_debut: '11:00', heure_fin: '11:45', date_rdv: '2026-03-31', statut: 'confirme', commission: 30, lieu: 'au_salon', walk_in: false },
  // Semaine dernière (terminés)
  { id: 'rm8', code_qr: 'KADIO-EMP-M008', client: { prenom: 'Alex', telephone: '514-555-0808' }, service: { nom: 'Coupe homme fade', duree_minutes: 45, prix: 35 }, heure_debut: '10:00', heure_fin: '10:45', date_rdv: '2026-03-22', statut: 'termine', commission: 26.25, lieu: 'au_salon', walk_in: false },
  { id: 'rm9', code_qr: 'KADIO-EMP-M009', client: { prenom: 'Chris', telephone: '514-555-0909' }, service: { nom: 'Coupe dégradé', duree_minutes: 45, prix: 40 }, heure_debut: '13:00', heure_fin: '13:45', date_rdv: '2026-03-22', statut: 'termine', commission: 30, lieu: 'au_salon', walk_in: false },
  { id: 'rm10', code_qr: 'KADIO-EMP-M010', client: { prenom: 'Louis', telephone: null }, service: { nom: 'Barbe complète', duree_minutes: 30, prix: 25 }, heure_debut: '15:00', heure_fin: '15:30', date_rdv: '2026-03-23', statut: 'no_show', commission: 0, lieu: 'au_salon', walk_in: false },
]

export const MOCK_STATS_MARCUS = {
  commission_semaine: 101.25,
  commission_mois: 367.50,
  services_semaine: 4,
  services_mois: 14,
  services_total: 89,
  note_moyenne: 4.7,
  repartition_notes: { 5: 48, 4: 28, 3: 8, 2: 3, 1: 2 },
  top_services: [
    { nom: 'Coupe homme fade', count: 42, commission: 1102.50 },
    { nom: 'Coupe dégradé', count: 31, commission: 930 },
    { nom: 'Barbe complète', count: 16, commission: 300 },
  ],
}

export const MOCK_CONGES_MARCUS = [
  { id: 'cg1', type: 'Vacances', date_debut: '2026-05-18', date_fin: '2026-05-25', duree: 7, motif: 'Voyage famille', statut: 'approuve' },
  { id: 'cg2', type: 'Personnel', date_debut: '2026-04-10', date_fin: '2026-04-10', duree: 1, motif: `Rendez-vous médical`, statut: 'en_attente' },
]

export const SOLDE_CONGES_MARCUS = {
  disponibles: 12,
  pris: 3,
  en_attente: 1,
}
