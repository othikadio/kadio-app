// ── Modules de formation pour les fournisseurs Kadio ──────────────

export const MOCK_MODULES_FOURNISSEUR = [
  {
    id: 1,
    titre: 'Gestion du catalogue',
    description: `Comment ajouter, modifier et organiser vos produits sur la plateforme Kadio.`,
    duree_minutes: 20,
    statut: 'complete',
    score: 92,
    date_complete: '2026-03-10',
    icon: '📦',
    guide: {
      titre: 'Gérer votre catalogue produits',
      description: `Tout ce que vous devez savoir pour présenter vos produits sur Kadio.`,
    },
    etapes: [
      { icon: 'catalogue_ajout', titre: 'Ajouter un produit', description: `Renseignez le nom, la description, le prix, les photos et la catégorie. Des fiches complètes génèrent plus de commandes.` },
      { icon: 'catalogue_photo', titre: 'Photos de qualité', description: `Ajoutez au minimum 2 photos par produit : une vue d'ensemble et un détail. Fond neutre, bonne lumière, haute résolution.` },
      { icon: 'catalogue_prix', titre: 'Politique de prix', description: `Fixez des prix compétitifs. Kadio affiche les prix TTC. Vous pouvez créer des promotions temporaires depuis votre espace.` },
      { icon: 'catalogue_stock', titre: 'Gestion des stocks', description: `Mettez à jour vos stocks en temps réel. Un produit en rupture est automatiquement masqué de la vitrine.` },
    ],
  },
  {
    id: 2,
    titre: 'Commandes et livraisons',
    description: `Processus de réception, préparation et livraison des commandes passées via Kadio.`,
    duree_minutes: 25,
    statut: 'en_cours',
    score: null,
    date_complete: null,
    icon: '🚚',
    guide: {
      titre: 'Gérer vos commandes de A à Z',
      description: `Du moment où la commande arrive jusqu'à la livraison au salon ou au partenaire.`,
    },
    etapes: [
      { icon: 'notification', titre: 'Réception de commande', description: `Vous recevez une notification pour chaque nouvelle commande. Confirmez la prise en charge sous 24h.` },
      { icon: 'conditions', titre: 'Préparation', description: `Vérifiez la disponibilité des produits. Emballez soigneusement avec protection contre les chocs et les fuites.` },
      { icon: 'deplacement', titre: 'Expédition', description: `Expédiez sous 48h après confirmation. Renseignez le numéro de suivi dans l'app pour que le client puisse suivre.` },
      { icon: 'fin', titre: 'Livraison confirmée', description: `Le partenaire ou le salon confirme la réception. En cas de problème (produit endommagé, manquant), vous êtes notifié.` },
      { icon: 'rappel', titre: 'Retours et échanges', description: `Les retours sont acceptés sous 7 jours si le produit est intact. Kadio gère la médiation en cas de litige.` },
    ],
  },
  {
    id: 3,
    titre: 'Paiements et facturation',
    description: `Comprendre le cycle de paiement, les commissions Kadio et la facturation.`,
    duree_minutes: 20,
    statut: 'verrouille',
    score: null,
    date_complete: null,
    icon: '💳',
    guide: {
      titre: 'Paiements et cycle de facturation',
      description: `Comment vous êtes payé et comment suivre vos revenus.`,
    },
    etapes: [
      { icon: 'paiement', titre: 'Commission Kadio', description: `Kadio prélève une commission de 15% sur chaque vente. Le reste est crédité dans votre portefeuille fournisseur.` },
      { icon: 'commission_autre', titre: 'Cycle de paiement', description: `Les virements sont effectués chaque 2 semaines. Minimum de retrait : 100$. Virement Interac ou bancaire.` },
      { icon: 'app_wallet', titre: 'Suivi des revenus', description: `Consultez votre tableau de bord : ventes du mois, commissions, solde disponible et historique des virements.` },
      { icon: 'conditions', titre: 'Facturation', description: `Kadio génère automatiquement les factures pour chaque commande. Téléchargez-les depuis votre espace pour votre comptabilité.` },
    ],
  },
  {
    id: 4,
    titre: `Standards qualité Kadio`,
    description: `Normes de qualité des produits, emballage, étiquetage et conditions de partenariat.`,
    duree_minutes: 25,
    statut: 'verrouille',
    score: null,
    date_complete: null,
    icon: '⭐',
    guide: {
      titre: `Les standards qualité Kadio pour les fournisseurs`,
      description: `Ce que Kadio attend de ses fournisseurs partenaires.`,
    },
    etapes: [
      { icon: 'mission', titre: 'Produits certifiés', description: `Tous les produits doivent respecter les normes canadiennes. Fournissez les certificats de conformité si demandé.` },
      { icon: 'desinfection', titre: 'Hygiène et sécurité', description: `Les produits capillaires doivent avoir une liste d'ingrédients complète, une date d'expiration et un numéro de lot.` },
      { icon: 'tenue', titre: 'Emballage professionnel', description: `Emballage soigné avec le nom du produit, les instructions d'utilisation et les précautions. Protection anti-fuite obligatoire.` },
      { icon: 'etoiles', titre: 'Satisfaction partenaire', description: `Les partenaires notent vos produits. Maintenez une note de 4.0+ pour rester référencé sur la plateforme.` },
      { icon: 'fin', titre: 'Engagement Kadio', description: `Répondez aux réclamations sous 48h. Proposez des remplacements pour les produits défectueux. La qualité est non négociable.` },
    ],
  },
]

export const MOCK_QUIZ_FOURNISSEUR = {
  1: [
    { id: 'qf1_1', question: `Combien de photos minimum par produit ?`, reponses: [`1`, `2`, `5`, `Aucune`], correcte: 1 },
    { id: 'qf1_2', question: `Que se passe-t-il quand un produit est en rupture ?`, reponses: [`Rien`, `Il est automatiquement masqué`, `Le prix augmente`, `Une alerte est envoyée au client`], correcte: 1 },
    { id: 'qf1_3', question: `Comment afficher les prix sur Kadio ?`, reponses: [`HT uniquement`, `TTC`, `Les deux`, `Pas de prix affiché`], correcte: 1 },
    { id: 'qf1_4', question: `Peut-on créer des promotions ?`, reponses: [`Non`, `Oui, depuis votre espace fournisseur`, `Seulement via le support`, `Uniquement à Noël`], correcte: 1 },
    { id: 'qf1_5', question: `Qu'est-ce qui génère plus de commandes ?`, reponses: [`Des prix très bas`, `Des fiches produit complètes et détaillées`, `Beaucoup de stock`, `Le nom de la marque`], correcte: 1 },
  ],
  2: [
    { id: 'qf2_1', question: `Sous combien de temps confirmer une commande ?`, reponses: [`1h`, `24h`, `48h`, `1 semaine`], correcte: 1 },
    { id: 'qf2_2', question: `Sous combien de temps expédier après confirmation ?`, reponses: [`24h`, `48h`, `1 semaine`, `Pas de délai`], correcte: 1 },
    { id: 'qf2_3', question: `Que renseigner après l'expédition ?`, reponses: [`Rien`, `Le numéro de suivi dans l'app`, `Un email au client`, `La date estimée seulement`], correcte: 1 },
    { id: 'qf2_4', question: `Sous combien de jours un retour est-il accepté ?`, reponses: [`3 jours`, `7 jours`, `14 jours`, `30 jours`], correcte: 1 },
    { id: 'qf2_5', question: `Qui gère la médiation en cas de litige ?`, reponses: [`Le fournisseur seul`, `Le client`, `Kadio`, `Personne`], correcte: 2 },
  ],
  3: [
    { id: 'qf3_1', question: `Quelle est la commission Kadio sur les ventes ?`, reponses: [`5%`, `10%`, `15%`, `20%`], correcte: 2 },
    { id: 'qf3_2', question: `À quelle fréquence sont les virements ?`, reponses: [`Chaque semaine`, `Chaque 2 semaines`, `Chaque mois`, `Sur demande`], correcte: 1 },
    { id: 'qf3_3', question: `Quel est le minimum de retrait ?`, reponses: [`25$`, `50$`, `100$`, `Pas de minimum`], correcte: 2 },
    { id: 'qf3_4', question: `Qui génère les factures ?`, reponses: [`Le fournisseur`, `Le client`, `Kadio automatiquement`, `Personne`], correcte: 2 },
    { id: 'qf3_5', question: `Où consulter votre historique de revenus ?`, reponses: [`Par email`, `Dans le tableau de bord de l'app`, `Sur le site web`, `Il faut appeler le support`], correcte: 1 },
  ],
  4: [
    { id: 'qf4_1', question: `Les produits doivent respecter quelles normes ?`, reponses: [`Aucune`, `Les normes canadiennes`, `Les normes européennes`, `Les normes américaines`], correcte: 1 },
    { id: 'qf4_2', question: `Que doit contenir l'étiquetage ?`, reponses: [`Juste le nom`, `Ingrédients, date d'expiration et numéro de lot`, `Le prix`, `Le code-barres uniquement`], correcte: 1 },
    { id: 'qf4_3', question: `Quelle note maintenir pour rester référencé ?`, reponses: [`3.0+`, `3.5+`, `4.0+`, `4.5+`], correcte: 2 },
    { id: 'qf4_4', question: `Sous combien de temps répondre aux réclamations ?`, reponses: [`24h`, `48h`, `1 semaine`, `Pas de délai`], correcte: 1 },
    { id: 'qf4_5', question: `Que faire pour un produit défectueux ?`, reponses: [`Ignorer`, `Proposer un remplacement`, `Rembourser sans discussion`, `Attendre que le client rappelle`], correcte: 1 },
  ],
}
