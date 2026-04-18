// ── Diane Mbaye — Partenaire certifiée Longueuil ──────────────

export const MOCK_DIANE_PARTENAIRE = {
  id: 'part-diane',
  user_id: 'usr-diane',
  code_partenaire: 'KADIO-DIANE-001',
  prenom: 'Diane',
  nom: 'Mbaye',
  statut: 'actif',
  niveau: 'certifie',
  certificat_actif: true,
  note_moyenne: 4.8,
  total_services: 87,
  portefeuille_solde: 283.00,
  portefeuille_total_gagne: 4938.00,
  is_disponible: true,
  mode_vacances: false,
  ville: 'Longueuil',
  bio: `Coiffeuse spécialisée en tresses knotless depuis 6 ans. Je me déplace chez vous ou dans mon studio à Longueuil.`,
  specialites: ['Tresses', 'Knotless', 'Locs'],
  langues: ['fr', 'wo', 'en'],
  modes_travail: ['chez_coiffeur', 'deplacement_voiture', 'mode_mixte'],
  couleur_agenda: '#8B5CF6',
  portal_pin: '2222',
  instagram: '@diane.coiffure',
  tiktok: '@diane_tresses',
  photo_url: null,
}

export const MOCK_RDV_DIANE = [
  // Aujourd'hui
  { id: 'rdv-d1', code_qr: 'KADIO-RDV-D001', client: { prenom: 'Aminata', note_moyenne: 5.0 }, service: { nom: 'Knotless braids', duree_minutes: 180 }, lieu: 'domicile_client', date_rdv: '2026-03-27', heure_debut: '09:00', heure_fin: '12:00', statut: 'confirme', prix_total: 140, commission: 105, adresse: '145 rue Principale, Longueuil' },
  { id: 'rdv-d2', code_qr: 'KADIO-RDV-D002', client: { prenom: 'Sophie', note_moyenne: 4.5 }, service: { nom: 'Tresses classiques', duree_minutes: 120 }, lieu: 'domicile_client', date_rdv: '2026-03-27', heure_debut: '14:00', heure_fin: '16:00', statut: 'en_cours', prix_total: 95, commission: 71.25, adresse: '22 boul. Roland-Therrien, Longueuil' },
  { id: 'rdv-d3', code_qr: 'KADIO-RDV-D003', client: { prenom: 'Naomi', note_moyenne: 4.8 }, service: { nom: 'Soin cuir chevelu', duree_minutes: 60 }, lieu: 'domicile_client', date_rdv: '2026-03-27', heure_debut: '17:30', heure_fin: '18:30', statut: 'confirme', prix_total: 60, commission: 45, adresse: '78 rue des Patriotes, Brossard' },
  // À venir
  { id: 'rdv-d4', code_qr: 'KADIO-RDV-D004', client: { prenom: 'Fatoumata', note_moyenne: 5.0 }, service: { nom: 'Knotless braids', duree_minutes: 180 }, lieu: 'domicile_client', date_rdv: '2026-03-29', heure_debut: '10:00', heure_fin: '13:00', statut: 'confirme', prix_total: 140, commission: 105, adresse: '12 rue Victoria, Montréal' },
  { id: 'rdv-d5', code_qr: 'KADIO-RDV-D005', client: { prenom: 'Christelle', note_moyenne: 4.9 }, service: { nom: 'Locs resserrage', duree_minutes: 90 }, lieu: 'au_salon', date_rdv: '2026-04-01', heure_debut: '11:00', heure_fin: '12:30', statut: 'confirme', prix_total: 80, commission: 40 },
  // Passés
  { id: 'rdv-d6', code_qr: 'KADIO-RDV-D006', client: { prenom: 'Bintou', note_moyenne: 4.7 }, service: { nom: 'Knotless braids', duree_minutes: 180 }, lieu: 'domicile_client', date_rdv: '2026-03-25', heure_debut: '10:00', heure_fin: '13:00', statut: 'termine', prix_total: 140, commission: 105, note_partenaire: null },
  { id: 'rdv-d7', code_qr: 'KADIO-RDV-D007', client: { prenom: 'Reine', note_moyenne: 4.6 }, service: { nom: 'Tresses classiques', duree_minutes: 120 }, lieu: 'domicile_client', date_rdv: '2026-03-22', heure_debut: '13:00', heure_fin: '15:00', statut: 'termine', prix_total: 95, commission: 71.25, note_partenaire: 5 },
  { id: 'rdv-d8', code_qr: 'KADIO-RDV-D008', client: { prenom: 'Marthe', note_moyenne: null }, service: { nom: 'Knotless braids', duree_minutes: 180 }, lieu: 'domicile_client', date_rdv: '2026-03-20', heure_debut: '09:00', heure_fin: '12:00', statut: 'annule', prix_total: 140, commission: 0 },
]

export const MOCK_TRANSACTIONS_DIANE = [
  { id: 't1', type: 'commission',   date: '2026-03-25', description: 'Knotless braids — Bintou',   montant: +105.00, solde_apres: 283.00 },
  { id: 't2', type: 'commission',   date: '2026-03-22', description: 'Tresses classiques — Reine', montant: +71.25,  solde_apres: 178.00 },
  { id: 't3', type: 'bonus',        date: '2026-03-15', description: 'Bonus conversion Aminata',   montant: +15.00,  solde_apres: 106.75 },
  { id: 't4', type: 'retrait',      date: '2026-03-10', description: 'Virement Stripe',            montant: -150.00, solde_apres: 91.75  },
  { id: 't5', type: 'commission',   date: '2026-03-08', description: 'Knotless braids — Fatoumata',montant: +105.00, solde_apres: 241.75 },
  { id: 't6', type: 'commission',   date: '2026-03-05', description: 'Locs resserrage — Christelle (salon)',montant: +40.00, solde_apres: 136.75 },
  { id: 't7', type: 'bonus',        date: '2026-03-01', description: 'Bonus conversion Naomi',     montant: +10.00,  solde_apres: 96.75  },
  { id: 't8', type: 'retrait',      date: '2026-02-28', description: 'Virement Stripe',            montant: -200.00, solde_apres: 86.75  },
]

export const MOCK_STATS_DIANE = {
  revenus_semaine: 221.25,
  revenus_mois: 429.25,
  revenus_annee: 4918.00,
  services_mois: 8,
  services_total: 87,
  note_moyenne: 4.8,
  repartition_notes: { 5: 52, 4: 28, 3: 5, 2: 1, 1: 1 },
  top_services: [
    { nom: 'Knotless braids', count: 41, revenus: 4305 },
    { nom: 'Tresses classiques', count: 28, revenus: 1995 },
    { nom: 'Locs resserrage', count: 12, revenus: 720 },
  ],
  clients_fideles: [
    { prenom: 'Aminata', rdv_count: 8 },
    { prenom: 'Fatoumata', rdv_count: 6 },
    { prenom: 'Christelle', rdv_count: 5 },
  ],
}

export const MOCK_CHAISES = [
  { id: 'ch1', numero: 1, nom: 'Chaise 1', couleur: '#B8922A', tarif_heure: 15, tarif_journee: 80 },
  { id: 'ch2', numero: 2, nom: 'Chaise 2', couleur: '#10B981', tarif_heure: 15, tarif_journee: 80 },
  { id: 'ch3', numero: 3, nom: 'Chaise VIP', couleur: '#8B5CF6', tarif_heure: 25, tarif_journee: 120 },
  { id: 'ch4', numero: 4, nom: 'Chaise 4', couleur: '#3B82F6', tarif_heure: 15, tarif_journee: 80 },
]

export const MOCK_RESERVATIONS_CHAISES = [
  { id: 'rc1', chaise_id: 'ch1', chaise_nom: 'Chaise 1', date: '2026-04-05', heure_debut: '09:00', heure_fin: '13:00', statut: 'confirme', tarif: 60 },
  { id: 'rc2', chaise_id: 'ch3', chaise_nom: 'Chaise VIP', date: '2026-04-12', heure_debut: '10:00', heure_fin: '17:00', statut: 'confirme', tarif: 120 },
]

export const MOCK_MATERIEL = [
  { id: 'm1', nom: `Mèches knotless noires 26"`, cat: 'Mèches', prix: 18.99, stock: true, image: null },
  { id: 'm2', nom: `Mèches knotless brun 24"`, cat: 'Mèches', prix: 18.99, stock: true, image: null },
  { id: 'm3', nom: 'Mèches braiding hair blond', cat: 'Mèches', prix: 14.99, stock: true, image: null },
  { id: 'm4', nom: 'Huile de coco Kadio 250ml', cat: 'Produits', prix: 12.50, stock: true, image: null },
  { id: 'm5', nom: 'Spray démêlant professionnel', cat: 'Produits', prix: 16.00, stock: false, image: null },
  { id: 'm6', nom: 'Gel fixant sans résidu', cat: 'Produits', prix: 9.99, stock: true, image: null },
  { id: 'm7', nom: `Peigne à queue acier`, cat: 'Accessoires', prix: 6.50, stock: true, image: null },
  { id: 'm8', nom: 'Élastiques invisibles x100', cat: 'Accessoires', prix: 4.99, stock: true, image: null },
  { id: 'm9', nom: 'Tablier professionnel Kadio', cat: 'Accessoires', prix: 24.99, stock: true, image: null },
]

export const MOCK_COMMANDES_DIANE = [
  { id: 'cmd1', numero: 'CMD-2026-031', date: '2026-03-15', items: [`Mèches knotless noires 26" ×3`, 'Huile de coco Kadio 250ml ×1'], total: 69.47, statut: 'livree' },
  { id: 'cmd2', numero: 'CMD-2026-018', date: '2026-02-28', items: [`Peigne à queue acier ×2`, 'Élastiques invisibles x100 ×2'], total: 23.00, statut: 'livree' },
]
