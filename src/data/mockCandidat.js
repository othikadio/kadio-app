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
    guide: {
      titre: 'Bienvenue chez Kadio — Notre mission',
      description: `Découvrez comment Kadio connecte les clients afro à des coiffeurs certifiés. Valeurs, vision et fonctionnement de la plateforme.`,
    },
    etapes: [
      { icon: 'mission', titre: 'Notre mission', description: `Kadio connecte les clients afro et caribéens à des coiffeurs certifiés, partout au Québec.` },
      { icon: 'piliers', titre: 'Les 3 piliers', description: `Chaque partenaire représente la marque Kadio. Ponctualité, qualité et respect sont nos fondations.` },
      { icon: 'notation', titre: 'Système de notation', description: `Les clients notent chaque service. Votre note influence directement votre visibilité sur la plateforme.` },
      { icon: 'niveaux', titre: '4 niveaux de partenariat', description: `Partenaire → Certifié → Élite → Ambassadeur. Plus vous performez, plus vous êtes mis en avant.` },
    ],
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
    guide: {
      titre: 'Comment accueillir un client Kadio',
      description: `De l'arrivée du client à la fin du service : communication, professionnalisme et gestion des attentes.`,
    },
    etapes: [
      { icon: 'qr', titre: 'Scan du code QR', description: `Le client arrive avec un code QR ou un code numérique. Scannez-le dès son arrivée pour confirmer sa présence.` },
      { icon: 'identite', titre: 'Vérification identité', description: `Vérifiez que c'est bien la bonne personne : nom et service correspondent-ils à la réservation ?` },
      { icon: 'conditions', titre: 'Conditions respectées ?', description: `Notez immédiatement si le client est venu seul et s'il respecte les conditions (ex: cheveux lavés si requis).` },
      { icon: 'start', titre: 'Début de prestation', description: `Les deux parties confirment le début de la prestation dans l'app.` },
      { icon: 'rappel', titre: 'Rappel 1h avant la fin', description: `1h avant la fin prévue, vous recevez un rappel pour prolonger ou terminer le service.` },
      { icon: 'fin', titre: 'Fin et notation croisée', description: `Le client et vous confirmez que la prestation est terminée. Vous notez le client, il vous note en retour.` },
    ],
  },
  {
    id: 3,
    titre: 'Comment ça fonctionne au salon',
    description: `Vidéo formative complète : le parcours d'un RDV au salon Kadio de A à Z.`,
    duree_minutes: 30,
    statut: 'verrouille',
    score: null,
    date_complete: null,
    icon: '🎬',
    guide: {
      titre: 'Une journée au salon Kadio — Le parcours complet',
      description: `Suivez un RDV de bout en bout : de la réservation au paiement.`,
    },
    etapes: [
      { icon: 'carte', titre: 'Réservation via la carte', description: `Le client choisit un partenaire sur la carte, consulte sa fiche complète, et sélectionne un créneau.` },
      { icon: 'notification', titre: 'Notification de RDV', description: `Vous recevez une notification avec tous les détails : service, lieu, heure.` },
      { icon: 'deplacement', titre: 'Déplacement du client', description: `Le jour J : le client se déplace vers le salon ou votre emplacement.` },
      { icon: 'qr', titre: `Scan QR à l'arrivée`, description: `Le client présente son code QR ou numérique. Vous scannez → "Client arrivé".` },
      { icon: 'identite', titre: `Vérification`, description: `Vérifiez l'identité et les conditions (cheveux lavés, venu seul, etc.).` },
      { icon: 'start', titre: `Début de prestation`, description: `Les deux parties démarrent la prestation dans l'app → "En cours".` },
      { icon: 'rappel', titre: 'Rappel 1h avant la fin', description: `Notification de rappel. Option de prolonger ou préparer la clôture.` },
      { icon: 'fin', titre: 'Prestation terminée', description: `Vous confirmez tous les deux → "Terminé".` },
      { icon: 'etoiles', titre: 'Notation croisée', description: `Vous notez le client (ponctualité, conditions). Le client vous note (qualité, propreté, professionnalisme).` },
      { icon: 'paiement', titre: 'Avis Google + Commission', description: `Le client laisse un avis Google. 3 SMS post-RDV envoyés. Commission : 50% au salon, 75% ailleurs.` },
    ],
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
    guide: {
      titre: 'Hygiène et image professionnelle Kadio',
      description: `Les standards d'hygiène, de tenue et de matériel requis pour chaque service Kadio.`,
    },
    etapes: [
      { icon: 'desinfection', titre: 'Désinfection obligatoire', description: `Désinfectez votre matériel entre chaque client — c'est obligatoire, pas optionnel.` },
      { icon: 'tenue', titre: 'Tenue professionnelle', description: `Portez une tenue professionnelle propre. Le tablier Kadio est obligatoire lors de tous les services.` },
      { icon: 'kit', titre: 'Kit complet', description: `Votre kit doit toujours contenir : matériel propre, désinfectant, tablier, peigne personnel.` },
      { icon: 'domicile', titre: 'Service à domicile', description: `Si vous vous déplacez chez un client, demandez poliment un espace propre et dégagé pour travailler.` },
    ],
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
    { id: 'q3_1', question: `Que doit faire le client à son arrivée chez la coiffeuse ?`, reponses: [`Rien, la coiffeuse le reconnaît`, `Présenter son code QR ou son code numérique pour validation`, `Envoyer un SMS à Kadio`, `Montrer sa carte d'identité`], correcte: 1 },
    { id: 'q3_2', question: `Que vérifie la coiffeuse après avoir scanné le code QR ?`, reponses: [`Uniquement le nom du client`, `L'identité, le service réservé et si les conditions sont respectées`, `Le montant du paiement`, `L'heure d'arrivée seulement`], correcte: 1 },
    { id: 'q3_3', question: `Qui confirme le début de la prestation dans l'app ?`, reponses: [`Seulement la coiffeuse`, `Seulement le client`, `Les deux — le client et la coiffeuse`, `Le système automatiquement`], correcte: 2 },
    { id: 'q3_4', question: `Que se passe-t-il 1h avant la fin prévue de la prestation ?`, reponses: [`Le paiement est prélevé`, `Un rappel est envoyé pour prolonger ou terminer le service`, `Le RDV est annulé`, `Rien de particulier`], correcte: 1 },
    { id: 'q3_5', question: `Quelle est la commission au salon vs les autres modes ?`, reponses: [`50% partout`, `75% partout`, `50% au salon, 75% pour les autres modes`, `80% au salon, 60% ailleurs`], correcte: 2 },
  ],
  4: [
    { id: 'q4_1', question: `À quelle fréquence minimum faut-il désinfecter son matériel ?`, reponses: [`Une fois par semaine`, `Entre chaque client`, `Une fois par jour`, `Une fois par mois`], correcte: 1 },
    { id: 'q4_2', question: `Que doit-on porter lors d'un service à domicile ?`, reponses: [`Des vêtements de ville`, `Une tenue professionnelle propre`, `Un uniforme Kadio obligatoire`, `Aucune obligation`], correcte: 1 },
    { id: 'q4_3', question: `Que faire si le domicile client est en désordre ?`, reponses: [`Refuser d'entrer`, `Nettoyer avant de commencer`, `Demander poliment un espace propre pour travailler`, `Ignorer et commencer quand même`], correcte: 2 },
    { id: 'q4_4', question: `Le tablier Kadio est-il obligatoire ?`, reponses: [`Non, au choix du partenaire`, `Oui, lors de tous les services`, `Seulement au salon`, `Seulement lors des événements`], correcte: 1 },
    { id: 'q4_5', question: `Quels produits doivent toujours être dans ton kit ?`, reponses: [`Uniquement les ciseaux`, `Matériel propre, désinfectant, tablier, peigne personnel`, `Produits de couleur`, `Un miroir`], correcte: 1 },
  ],
}
