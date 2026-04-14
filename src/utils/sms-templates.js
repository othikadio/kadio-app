// ── Templates SMS Kadio Coiffure ─────────────────────────────────
// Variables : {{prenom}} {{service}} {{date}} {{montant}} etc.
// renderTemplate(id, vars) → message final ≤ 160 caractères

export const CATEGORIES_SMS = ['Client', 'Partenaire', 'Fournisseur', 'Othi']

export const SMS_TEMPLATES = [

  // ── CLIENTS ────────────────────────────────────────────────────
  {
    id: 'client-rdv-confirm',
    cat: 'Client',
    nom: 'Confirmation RDV + QR',
    trigger: 'Automatique à la réservation',
    message: `Bonjour {{prenom}} ! Votre RDV chez Kadio est confirmé le {{date}} à {{heure}} pour {{service}}. Code QR : {{code_qr}}. — Kadio`,
  },
  {
    id: 'client-rappel-24h',
    cat: 'Client',
    nom: 'Rappel 24h avant RDV',
    trigger: 'Automatique J-1 à 9h',
    message: `Rappel Kadio : votre RDV demain {{date}} à {{heure}} pour {{service}}. Annulation : 514-919-5970. À bientôt {{prenom}} !`,
  },
  {
    id: 'client-rappel-2h',
    cat: 'Client',
    nom: 'Rappel 2h avant RDV',
    trigger: 'Automatique H-2',
    message: `Kadio : votre RDV est dans 2h ({{heure}}) pour {{service}}. Adresse : {{adresse}}. On vous attend {{prenom}} !`,
  },
  {
    id: 'client-service-termine',
    cat: 'Client',
    nom: 'Service terminé + facture',
    trigger: 'Manuel après service',
    message: `Merci {{prenom}} ! Votre service {{service}} est terminé. Montant : {{montant}} $. Merci de votre confiance — Kadio Coiffure.`,
  },
  {
    id: 'client-notation',
    cat: 'Client',
    nom: 'Demande de notation (30 min après)',
    trigger: 'Automatique +30 min après service',
    message: `{{prenom}}, comment s'est passé votre service {{service}} chez Kadio ? Notez en 30 sec : {{lien_notation}} Merci !`,
  },
  {
    id: 'client-abo-j10',
    cat: 'Client',
    nom: 'Abonnement expirant J-10',
    trigger: 'Automatique J-10',
    message: `{{prenom}}, votre abonnement Kadio expire dans 10 jours ({{date_expiry}}). Renouvelez dès maintenant pour garder vos avantages. — Kadio`,
  },
  {
    id: 'client-abo-j3',
    cat: 'Client',
    nom: 'Abonnement expirant J-3',
    trigger: 'Automatique J-3',
    message: `Urgent {{prenom}} : votre abonnement Kadio expire dans 3 jours ! Renouvelez avant le {{date_expiry}} pour ne pas perdre vos services. — Kadio`,
  },
  {
    id: 'client-abo-j0',
    cat: 'Client',
    nom: `Abonnement expiré aujourd'hui`,
    trigger: 'Automatique J-0',
    message: `{{prenom}}, votre abonnement Kadio a expiré aujourd'hui. Réabonnez-vous pour continuer à profiter de nos services prioritaires. — Kadio`,
  },
  {
    id: 'client-bienvenue-abo',
    cat: 'Client',
    nom: 'Bienvenue nouvel abonné',
    trigger: 'Automatique à la souscription',
    message: `Bienvenue dans la famille Kadio {{prenom}} ! Votre abonnement {{forfait}} est actif jusqu'au {{date_expiry}}. Merci de votre confiance !`,
  },
  {
    id: 'client-anniversaire',
    cat: 'Client',
    nom: 'Anniversaire (9h)',
    trigger: 'Automatique le jour J à 9h',
    message: `Joyeux anniversaire {{prenom}} ! Kadio vous offre {{cadeau}} pour célébrer ce jour spécial. Valable aujourd'hui seulement. — Kadio`,
  },
  {
    id: 'client-reactivation',
    cat: 'Client',
    nom: 'Réactivation 30 jours sans visite',
    trigger: 'Automatique J+30 sans RDV',
    message: `{{prenom}}, ça fait 30 jours qu'on ne vous a pas vu chez Kadio ! Revenez — offre spéciale {{offre}} vous attend. — Kadio Coiffure`,
  },
  {
    id: 'client-parrainage',
    cat: 'Client',
    nom: 'Récompense parrainage',
    trigger: 'Automatique à la validation parrainage',
    message: `Bravo {{prenom}} ! Votre filleul(e) a rejoint Kadio. {{montant}} $ ont été crédités sur votre portefeuille. Solde : {{solde}} $. Merci !`,
  },
  {
    id: 'client-rdv-note-coiffeur',
    cat: 'Client',
    nom: 'Note coiffeur après RDV',
    trigger: 'Automatique immédiatement après service terminé',
    message: `Bonjour {{prenom}} 🌟 Comment s'est passé votre soin avec {{coiffeur}} ? Notez votre expérience en 30 secondes : {{lien_note}}`,
  },
  {
    id: 'client-rdv-comment-connu',
    cat: 'Client',
    nom: 'Comment avez-vous connu Kadio ?',
    trigger: 'Automatique 10 min après service terminé',
    message: `Bonjour {{prenom}} ! On aimerait savoir — comment avez-vous entendu parler de Kadio ? Répondez par SMS : 1-Bouche à oreille 2-Instagram 3-TikTok 4-Facebook 5-Google 6-Épicerie africaine 7-Autre`,
  },
  {
    id: 'client-rdv-avis-google',
    cat: 'Client',
    nom: 'Avis Google après RDV',
    trigger: 'Automatique 30 min après service terminé',
    message: `Bonjour {{prenom}} 😊 Votre avis nous aide énormément ! Laissez-nous un avis Google ici (30 secondes) : https://g.page/r/CekIGz7Cw580EBE/review — Merci 🙏 Kadio Coiffure`,
  },

  // ── PARTENAIRES ─────────────────────────────────────────────────
  {
    id: 'part-nouveau-rdv',
    cat: 'Partenaire',
    nom: 'Nouveau RDV reçu',
    trigger: 'Automatique à la réservation client',
    message: `Nouveau RDV Kadio : {{prenom_client}} le {{date}} à {{heure}} pour {{service}}. Confirmé via l'app. — Kadio`,
  },
  {
    id: 'part-rdv-annule',
    cat: 'Partenaire',
    nom: 'Client annulé',
    trigger: `Automatique à l'annulation`,
    message: `Annulation : {{prenom_client}} a annulé son RDV du {{date}} à {{heure}} ({{service}}). Créneau libéré. — Kadio`,
  },
  {
    id: 'part-rappel-2h',
    cat: 'Partenaire',
    nom: 'Rappel RDV dans 2h',
    trigger: 'Automatique H-2',
    message: `Rappel Kadio : {{prenom_client}} arrive dans 2h pour {{service}} ({{heure}}). Préparez-vous ! — Kadio`,
  },
  {
    id: 'part-chaise-confirmee',
    cat: 'Partenaire',
    nom: 'Chaise salon confirmée',
    trigger: 'Automatique à la réservation chaise',
    message: `Votre chaise {{chaise}} au salon Kadio est confirmée le {{date}} de {{heure_debut}} à {{heure_fin}}. Tarif : {{montant}} $. — Kadio`,
  },
  {
    id: 'part-virement',
    cat: 'Partenaire',
    nom: 'Virement reçu',
    trigger: 'Automatique au virement',
    message: `Virement Kadio reçu ! {{montant}} $ ont été ajoutés à votre portefeuille. Nouveau solde : {{solde}} $. — Kadio Coiffure`,
  },
  {
    id: 'part-bonus-abo',
    cat: 'Partenaire',
    nom: 'Bonus conversion abonné',
    trigger: 'Automatique à la conversion',
    message: `Félicitations {{prenom}} ! {{prenom_client}} a souscrit un abonnement via votre lien. Bonus : {{montant}} $ crédité. Solde : {{solde}} $.`,
  },
  {
    id: 'part-note-recue',
    cat: 'Partenaire',
    nom: 'Note reçue du client',
    trigger: 'Automatique après notation',
    message: `{{prenom_client}} vous a attribué {{note}}/5 pour {{service}} du {{date}}. Commentaire : "{{commentaire}}" — Kadio`,
  },
  {
    id: 'part-commande-confirmee',
    cat: 'Partenaire',
    nom: 'Commande matériel confirmée',
    trigger: 'Automatique à la confirmation fournisseur',
    message: `Commande {{numero_cmd}} confirmée par {{fournisseur}} ! Préparation en cours. Total : {{montant}} $. — Kadio`,
  },
  {
    id: 'part-commande-expediee',
    cat: 'Partenaire',
    nom: `Commande expédiée + suivi`,
    trigger: `Automatique à l'expédition`,
    message: `Commande {{numero_cmd}} expédiée ! Suivi : {{numero_suivi}}. Livraison estimée : {{date_livraison}}. — Kadio Coiffure`,
  },
  {
    id: 'part-note-baisse',
    cat: 'Partenaire',
    nom: 'Alerte note en baisse',
    trigger: 'Automatique si note < 4.0',
    message: `Kadio Alert : votre note moyenne est à {{note}}/5. Consultez les avis récents dans votre app pour améliorer votre service. — Kadio`,
  },

  // ── FOURNISSEURS ────────────────────────────────────────────────
  {
    id: 'four-nouvelle-commande',
    cat: 'Fournisseur',
    nom: 'Nouvelle commande reçue',
    trigger: 'Automatique à la commande partenaire',
    message: `Nouvelle commande Kadio {{numero_cmd}} — {{nb_articles}} article(s), montant : {{montant}} $. Partenaire : {{prenom_partenaire}}. Confirmez dans l'app.`,
  },
  {
    id: 'four-paiement-recu',
    cat: 'Fournisseur',
    nom: 'Paiement reçu confirmé',
    trigger: 'Automatique au paiement',
    message: `Paiement reçu pour la commande {{numero_cmd}} — {{montant}} $. Merci pour votre collaboration. — Kadio Coiffure`,
  },

  // ── OTHI (admin) ────────────────────────────────────────────────
  {
    id: 'othi-candidature',
    cat: 'Othi',
    nom: 'Nouvelle candidature',
    trigger: 'Automatique à la soumission',
    message: `Kadio : nouvelle candidature de {{prenom}} {{nom}} ({{ville}}). Services : {{services}}. Consultez l'app pour traiter.`,
  },
  {
    id: 'othi-nouveau-rdv',
    cat: 'Othi',
    nom: 'Nouveau RDV réseau',
    trigger: 'Automatique à chaque RDV',
    message: `Nouveau RDV réseau : {{prenom_client}} chez {{prenom_partenaire}} le {{date}} à {{heure}} pour {{service}}. Montant : {{montant}} $.`,
  },
  {
    id: 'othi-nouvel-abo',
    cat: 'Othi',
    nom: 'Nouvel abonné',
    trigger: 'Automatique à la souscription',
    message: `Nouvel abonné Kadio : {{prenom}} {{nom}} — forfait {{forfait}} ({{montant}} $/mois). Total abonnés actifs : {{total_abo}}.`,
  },
  {
    id: 'othi-paiement-echoue',
    cat: 'Othi',
    nom: 'Paiement échoué',
    trigger: 'Automatique sur échec paiement',
    message: `ALERT Kadio : paiement échoué — {{prenom}} {{nom}}, {{montant}} $, motif : {{motif}}. À traiter manuellement.`,
  },
  {
    id: 'othi-note-alerte',
    cat: 'Othi',
    nom: 'Note partenaire sous 3.5',
    trigger: 'Automatique si note < 3.5',
    message: `ALERT Kadio : {{prenom_partenaire}} a une note de {{note}}/5 ({{nb_avis}} avis). Intervention recommandée. — Kadio App`,
  },
  {
    id: 'othi-retrait',
    cat: 'Othi',
    nom: 'Demande retrait portefeuille',
    trigger: 'Automatique à la demande',
    message: `Demande retrait : {{prenom}} {{nom}} ({{code}}) — {{montant}} $. Solde portefeuille : {{solde}} $. À approuver dans l'app.`,
  },
  {
    id: 'othi-chaise',
    cat: 'Othi',
    nom: 'Nouvelle réservation chaise salon',
    trigger: 'Automatique à la réservation',
    message: `Réservation chaise salon : {{prenom_partenaire}} — {{chaise}} le {{date}} de {{heure_debut}} à {{heure_fin}}. Tarif : {{montant}} $.`,
  },
  {
    id: 'othi-resume-quotidien',
    cat: 'Othi',
    nom: 'Résumé quotidien (8h)',
    trigger: 'Automatique chaque matin à 8h',
    message: `Résumé Kadio {{date}} : {{nb_rdv}} RDV, {{nb_nouveaux}} nouveaux clients, {{chiffre}} $ générés. {{nb_alertes}} alerte(s) en attente.`,
  },
]

// ── Helpers ───────────────────────────────────────────────────────

/** Retourne les noms bruts des variables {{...}} du message */
export function extractVariableNames(message) {
  const matches = message.match(/\{\{([^}]+)\}\}/g) || []
  return [...new Set(matches.map(m => m.slice(2, -2)))]
}

/**
 * Remplace les variables {{nom}} par les valeurs fournies.
 * Tronque proprement à 160 caractères si le message dépasse.
 * @param {string} templateId
 * @param {Object} variables — { prenom: 'Aminata', service: 'Knotless', ... }
 * @returns {string} message final
 */
export function renderTemplate(templateId, variables = {}) {
  const tpl = SMS_TEMPLATES.find(t => t.id === templateId)
  if (!tpl) return ''

  let msg = tpl.message
  for (const [key, val] of Object.entries(variables)) {
    msg = msg.replaceAll(`{{${key}}}`, val)
  }

  if (msg.length > 160) {
    msg = msg.slice(0, 157).trimEnd() + '...'
  }

  return msg
}

/** Retourne les templates d'une catégorie */
export function getTemplatesByCategory(cat) {
  return SMS_TEMPLATES.filter(t => t.cat === cat)
}

/** Compte de templates par catégorie */
export function countByCategory() {
  const counts = {}
  for (const cat of CATEGORIES_SMS) {
    counts[cat] = SMS_TEMPLATES.filter(t => t.cat === cat).length
  }
  return counts
}

