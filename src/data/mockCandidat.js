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
    video: {
      titre: 'Bienvenue chez Kadio — Notre mission',
      description: `Découvrez comment Kadio connecte les clients afro à des coiffeurs certifiés. Valeurs, vision et fonctionnement de la plateforme.`,
      duree: '8 min',
      url: null, // Remplacer par l'URL YouTube/Vimeo de la vidéo
    },
    contenu: [
      `La mission de Kadio est de connecter les clients afro et caribéens à des coiffeurs certifiés, partout au Québec.`,
      `Chaque partenaire représente la marque Kadio. Ponctualité, qualité et respect sont nos 3 piliers.`,
      `Le système de notation assure la qualité : les clients notent chaque service, et votre note influence votre visibilité.`,
      `4 niveaux de partenariat : Partenaire → Certifié → Élite → Ambassadeur. Plus vous performez, plus vous êtes mis en avant.`,
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
    video: {
      titre: 'Comment accueillir un client Kadio',
      description: `De l'arrivée du client à la fin du service : communication, professionnalisme et gestion des attentes.`,
      duree: '10 min',
      url: null,
    },
    contenu: [
      `Le client arrive avec un code QR ou un code numérique. Scannez-le dès son arrivée pour confirmer sa présence.`,
      `Vérifiez que c'est bien la bonne personne : nom et service correspondent-ils à la réservation ?`,
      `Notez immédiatement si le client est venu seul et s'il respecte les conditions (ex: cheveux lavés si requis).`,
      `Les deux parties confirment le début de la prestation dans l'app.`,
      `1h avant la fin prévue, vous recevez un rappel pour prolonger ou terminer le service.`,
      `À la fin : le client et vous confirmez que la prestation est terminée. Vous notez le client, il vous note en retour.`,
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
    video: {
      titre: 'Une journée au salon Kadio — Le parcours complet',
      description: `Suivez un RDV de bout en bout : arrivée du client, scan QR, prestation, notation croisée et paiement.`,
      duree: '15 min',
      url: null,
    },
    contenu: [
      `Le client réserve via l'app : il choisit un partenaire sur la carte, consulte sa fiche complète, et sélectionne un créneau.`,
      `Vous recevez une notification de nouveau RDV avec tous les détails (service, lieu, heure).`,
      `Le jour J : le client se déplace. À son arrivée, il présente son code QR ou son code numérique.`,
      `Vous scannez le code dans l'app → "Client arrivé". Vérifiez l'identité et les conditions.`,
      `Les deux parties démarrent la prestation dans l'app → "En cours".`,
      `1h avant la fin : notification de rappel. Option de prolonger ou préparer la clôture.`,
      `Prestation terminée : vous confirmez tous les deux → "Terminé".`,
      `Vous notez le client (ponctualité, conditions respectées). Le client vous note (qualité, propreté, professionnalisme).`,
      `Le client est invité à laisser un avis Google. 3 SMS post-RDV sont envoyés automatiquement.`,
      `Votre commission est créditée : 50% au salon, 75% pour les autres modes de travail.`,
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
    video: {
      titre: 'Hygiène et image professionnelle Kadio',
      description: `Les standards d'hygiène, de tenue et de matériel requis pour chaque service Kadio.`,
      duree: '7 min',
      url: null,
    },
    contenu: [
      `Désinfectez votre matériel entre chaque client — c'est obligatoire, pas optionnel.`,
      `Portez une tenue professionnelle propre. Le tablier Kadio est obligatoire lors de tous les services.`,
      `Votre kit doit toujours contenir : matériel propre, désinfectant, tablier, peigne personnel.`,
      `Si vous vous déplacez chez un client, demandez poliment un espace propre et dégagé pour travailler.`,
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
