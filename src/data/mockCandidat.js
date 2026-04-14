// ── Mariam — Candidat dev persona ──────────────────────────────

export const MOCK_CANDIDATURE_MARIAM = {
  id: 'cand-mariam',
  prenom: 'Mariam',
  nom: 'Touré',
  telephone: '514-777-0001',
  statut: 'accepte',   // 'en_attente' | 'en_revision' | 'accepte' | 'refuse'
  date_soumission: '2026-02-15',
  date_revision: '2026-02-18',
  date_acceptation: '2026-02-20',
  message_admin: `Bonjour Mariam, votre candidature a été examinée avec attention. Votre profil correspond parfaitement à nos critères. Bienvenue dans la famille Kadio ! Complétez les 4 modules de formation pour obtenir votre certification.`,
  specialites: ['Tresses', 'Knotless'],
  ville: 'Montréal',
}

export const MOCK_MODULES = [
  {
    id: 1,
    titre: 'Standards Kadio',
    description: `Valeurs, charte qualité, présentation de la plateforme et de la mission Kadio.`,
    duree_minutes: 20,
    statut: 'complete',   // 'verrouille' | 'disponible' | 'en_cours' | 'complete'
    score: 90,
    date_complete: '2026-02-22',
    icon: '⭐',
  },
  {
    id: 2,
    titre: 'Relation client',
    description: `Accueil, communication, gestion des attentes et des situations difficiles.`,
    duree_minutes: 25,
    statut: 'en_cours',
    score: null,
    date_complete: null,
    icon: '🤝',
  },
  {
    id: 3,
    titre: 'Application et outils',
    description: `Comment utiliser l'app Kadio, le scanner QR, le portefeuille et l'agenda.`,
    duree_minutes: 30,
    statut: 'verrouille',
    score: null,
    date_complete: null,
    icon: '📱',
  },
  {
    id: 4,
    titre: 'Hygiène et professionnalisme',
    description: `Normes sanitaires, présentation personnelle, matériel et espace de travail.`,
    duree_minutes: 20,
    statut: 'verrouille',
    score: null,
    date_complete: null,
    icon: '✨',
  },
]

export const MOCK_QUIZ = {
  1: [
    { id: 'q1_1', question: `Quelle est la mission principale de Kadio ?`, reponses: [`Vendre des produits capillaires`, `Connecter les clients afro à des coiffeurs certifiés`, `Former des coiffeurs en école`, `Proposer des abonnements de streaming`], correcte: 1 },
    { id: 'q1_2', question: `Quel est le délai minimal pour annuler un RDV sans pénalité ?`, reponses: [`1h avant`, `6h avant`, `24h avant`, `48h avant`], correcte: 2 },
    { id: 'q1_3', question: `Qu'est-ce que le code QR Kadio ?`, reponses: [`Un code de réduction`, `Un identifiant unique de réservation scanné à l'arrivée`, `Un code de parrainage`, `Un code d'accès au salon`], correcte: 1 },
    { id: 'q1_4', question: `Quel pourcentage de commission reçoit un partenaire pour son propre client ?`, reponses: [`50%`, `60%`, `72%`, `80%`], correcte: 2 },
    { id: 'q1_5', question: `Quels sont les niveaux de partenariat Kadio ?`, reponses: [`Bronze, Argent, Or`, `Débutant, Confirmé, Expert`, `Partenaire, Certifié, Élite, Ambassadeur`, `Standard, Premium, VIP`], correcte: 2 },
  ],
  2: [
    { id: 'q2_1', question: `Combien de temps avant le RDV doit-on confirmer ?`, reponses: [`1h avant`, `6h avant`, `12h avant`, `24h avant`], correcte: 3 },
    { id: 'q2_2', question: `Que faire si un client est en retard de plus de 15 min ?`, reponses: [`Annuler sans préavis`, `Attendre indéfiniment`, `Contacter via l'app Kadio`, `Facturer des frais supplémentaires`], correcte: 2 },
    { id: 'q2_3', question: `Comment gérer une cliente insatisfaite ?`, reponses: [`Ignorer la plainte`, `Argumenter pour défendre ton travail`, `Écouter, proposer une solution, contacter Kadio si besoin`, `Rembourser immédiatement sans discussion`], correcte: 2 },
    { id: 'q2_4', question: `Quel est le délai de réponse attendu pour un message client ?`, reponses: [`30 minutes`, `1h maximum`, `2h maximum`, `24h maximum`], correcte: 2 },
    { id: 'q2_5', question: `Que faire si tu dois annuler un RDV ?`, reponses: [`Envoyer un message WhatsApp personnel`, `Prévenir au moins 24h via l'app Kadio`, `Annuler le matin même`, `Ne rien faire et espérer que le client comprend`], correcte: 1 },
  ],
  3: [
    { id: 'q3_1', question: `Comment scanner le QR code d'un client ?`, reponses: [`Via l'appareil photo classique`, `Via l'onglet Scanner dans l'app Kadio`, `Via WhatsApp`, `Via Google Photos`], correcte: 1 },
    { id: 'q3_2', question: `Où voir son solde de portefeuille ?`, reponses: [`Dans les paramètres du téléphone`, `Dans l'onglet Portefeuille de l'app`, `Via email`, `En appelant Kadio`], correcte: 1 },
    { id: 'q3_3', question: `Comment bloquer des créneaux dans son agenda ?`, reponses: [`Appeler le support`, `Via l'onglet Disponibilités`, `Via WhatsApp à Othi`, `Impossible de bloquer`], correcte: 1 },
    { id: 'q3_4', question: `Quel est le délai minimum pour les demandes de retrait ?`, reponses: [`Instantané`, `1h`, `24h ouvrables`, `7 jours`], correcte: 2 },
    { id: 'q3_5', question: `Comment activer le mode vacances ?`, reponses: [`Désinstaller l'app`, `Via l'onglet Vacances dans l'espace partenaire`, `Contacter Kadio par email`, `Bloquer tous les créneaux manuellement`], correcte: 1 },
  ],
  4: [
    { id: 'q4_1', question: `À quelle fréquence minimum faut-il désinfecter son matériel ?`, reponses: [`Une fois par semaine`, `Entre chaque client`, `Une fois par jour`, `Une fois par mois`], correcte: 1 },
    { id: 'q4_2', question: `Que doit-on porter lors d'un service à domicile ?`, reponses: [`Des vêtements de ville`, `Une tenue professionnelle propre`, `Un uniforme Kadio obligatoire`, `Aucune obligation`], correcte: 1 },
    { id: 'q4_3', question: `Que faire si le domicile client est en désordre ?`, reponses: [`Refuser d'entrer`, `Nettoyer avant de commencer`, `Demander poliment un espace propre pour travailler`, `Ignorer et commencer quand même`], correcte: 2 },
    { id: 'q4_4', question: `Le tablier Kadio est-il obligatoire ?`, reponses: [`Non, au choix du partenaire`, `Oui, lors de tous les services`, `Seulement au salon`, `Seulement lors des événements`], correcte: 1 },
    { id: 'q4_5', question: `Quels produits doivent toujours être dans ton kit ?`, reponses: [`Uniquement les ciseaux`, `Matériel propre, désinfectant, tablier, peigne personnel`, `Produits de couleur`, `Un miroir`], correcte: 1 },
  ],
}
