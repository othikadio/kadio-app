// ── BeautyPro Supply Canada — Jean Kouassi ───────────────────

export const MOCK_FOURNISSEUR_JEAN = {
  id: 'four-jean',
  nom_entreprise: 'BeautyPro Supply Canada',
  contact_prenom: 'Jean',
  contact_nom: 'Kouassi',
  telephone: '514-444-0001',
  email: 'jean@beautypro.ca',
  actif: true,
}

export const MOCK_PRODUITS_JEAN = [
  { id: 'fp1', nom: `Mèches knotless noires 26"`,  cat: 'Mèches',       prix: 18.99, stock: 142, actif: true,  description: `Mèches synthétiques haute qualité pour knotless braids. Longueur 26", couleur noir naturel.` },
  { id: 'fp2', nom: `Mèches knotless brun 24"`,    cat: 'Mèches',       prix: 18.99, stock: 87,  actif: true,  description: `Mèches synthétiques pour knotless braids. Longueur 24", teinte brun chocolat.` },
  { id: 'fp3', nom: 'Mèches braiding hair blond',  cat: 'Mèches',       prix: 14.99, stock: 53,  actif: true,  description: `Mèches légères pour tresses classiques. Couleur blond miel.` },
  { id: 'fp4', nom: 'Huile de coco Kadio 250ml',   cat: 'Produits',     prix: 12.50, stock: 200, actif: true,  description: `Huile de coco vierge pressée à froid. Idéale pour hydratation cuir chevelu et mèches.` },
  { id: 'fp5', nom: 'Spray démêlant professionnel',cat: 'Produits',     prix: 16.00, stock: 0,   actif: false, description: `Spray démêlant sans sulfates. Convient aux cheveux naturels et tressés.` },
  { id: 'fp6', nom: 'Gel fixant sans résidu',      cat: 'Produits',     prix: 9.99,  stock: 75,  actif: true,  description: `Gel coiffant longue durée, séchage invisible, sans résidu blanc.` },
  { id: 'fp7', nom: 'Peigne à queue acier',        cat: 'Accessoires',  prix: 6.50,  stock: 310, actif: true,  description: `Peigne professionnel queue acier inoxydable. Dents fines pour tressage précis.` },
  { id: 'fp8', nom: 'Tablier professionnel Kadio', cat: 'Équipements',  prix: 24.99, stock: 28,  actif: true,  description: `Tablier imperméable noir logo Kadio brodé. Taille universelle, ajustable.` },
]

export const MOCK_COMMANDES_JEAN = [
  {
    id: 'cmd-j1',
    numero: 'CMD-2026-044',
    date: '2026-03-27',
    partenaire: { prenom: 'Diane', nom: 'Mbaye', code: 'KADIO-DIANE-001' },
    articles: [
      { nom: `Mèches knotless noires 26"`, qte: 3, prix_unit: 18.99 },
      { nom: 'Huile de coco Kadio 250ml',  qte: 1, prix_unit: 12.50 },
    ],
    total: 69.47,
    statut: 'en_attente',
    nouvelle: true,
    numero_suivi: null,
  },
  {
    id: 'cmd-j2',
    numero: 'CMD-2026-031',
    date: '2026-03-20',
    partenaire: { prenom: 'Fatou', nom: `Konaté`, code: 'KADIO-FATOU-002' },
    articles: [
      { nom: `Mèches knotless brun 24"`, qte: 2, prix_unit: 18.99 },
      { nom: 'Gel fixant sans résidu',   qte: 2, prix_unit: 9.99  },
    ],
    total: 57.96,
    statut: 'expediee',
    nouvelle: false,
    numero_suivi: 'CPC-4421887-YUL',
  },
  {
    id: 'cmd-j3',
    numero: 'CMD-2026-018',
    date: '2026-03-10',
    partenaire: { prenom: 'Rachel', nom: 'Ndoye', code: 'KADIO-RACHEL-005' },
    articles: [
      { nom: 'Peigne à queue acier',         qte: 4, prix_unit: 6.50  },
      { nom: 'Tablier professionnel Kadio',  qte: 1, prix_unit: 24.99 },
      { nom: 'Mèches braiding hair blond',   qte: 3, prix_unit: 14.99 },
    ],
    total: 95.94,
    statut: 'livree',
    nouvelle: false,
    numero_suivi: 'CPC-4398211-YUL',
  },
]

export const MOCK_PAIEMENTS_JEAN = [
  { id: 'pj1', date: '2026-03-25', commande: 'CMD-2026-031', montant: 57.96,  statut: 'recu' },
  { id: 'pj2', date: '2026-03-15', commande: 'CMD-2026-018', montant: 95.94,  statut: 'recu' },
  { id: 'pj3', date: '2026-03-05', commande: 'CMD-2026-009', montant: 43.50,  statut: 'recu' },
  { id: 'pj4', date: '2026-03-27', commande: 'CMD-2026-044', montant: 69.47,  statut: 'en_attente' },
  { id: 'pj5', date: '2026-02-28', commande: 'CMD-2026-003', montant: 115.12, statut: 'recu' },
  { id: 'pj6', date: '2026-02-14', commande: 'CMD-2026-001', montant: 88.45,  statut: 'recu' },
]

export const CATS_FOURNISSEUR = ['Tous', 'Mèches', 'Produits', 'Accessoires', 'Équipements']

export const STATUTS_COMMANDE = [
  { val: 'en_attente', label: `En attente`,  color: '#F59E0B', next: 'confirmee',  nextLabel: 'Confirmer' },
  { val: 'confirmee',  label: 'Confirmée',   color: '#3B82F6', next: 'preparee',   nextLabel: `Prête à expédier` },
  { val: 'preparee',   label: 'Préparée',    color: '#8B5CF6', next: 'expediee',   nextLabel: 'Expédier' },
  { val: 'expediee',   label: 'Expédiée',    color: '#10B981', next: 'livree',     nextLabel: 'Marquer livrée' },
  { val: 'livree',     label: 'Livrée',      color: '#22c55e', next: null,         nextLabel: null },
]
