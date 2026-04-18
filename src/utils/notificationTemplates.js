/**
 * Push Notification Templates
 * Pre-defined notification messages for common Kadio events
 */

export const NOTIFICATION_TEMPLATES = {
  // Appointment Reminders
  rdv_reminder_1day: {
    type: 'rdv_reminder',
    title: 'Rappel RDV demain',
    bodyTemplate: (rdv) =>
      `Votre rendez-vous avec ${rdv.stylist} est demain à ${rdv.time}`,
    data: (rdv) => ({
      rdvId: rdv.id,
      type: 'rdv_reminder',
      url: `/client/rdv/${rdv.id}`,
    }),
  },

  rdv_reminder_2hours: {
    type: 'rdv_reminder',
    title: 'Votre RDV dans 2 heures',
    bodyTemplate: (rdv) =>
      `${rdv.service} chez ${rdv.salon} à ${rdv.time}`,
    data: (rdv) => ({
      rdvId: rdv.id,
      type: 'rdv_reminder',
      url: `/client/rdv/${rdv.id}`,
    }),
  },

  // Confirmation
  rdv_confirmed: {
    type: 'rdv_confirmed',
    title: 'RDV confirmé',
    bodyTemplate: (rdv) =>
      `${rdv.date} à ${rdv.time} - ${rdv.service}`,
    data: (rdv) => ({
      rdvId: rdv.id,
      type: 'rdv_confirmed',
      url: `/client/rdv/${rdv.id}`,
    }),
  },

  rdv_rescheduled: {
    type: 'rdv_confirmed',
    title: 'RDV reprogrammé',
    bodyTemplate: (rdv) =>
      `Nouvelle date: ${rdv.date} à ${rdv.time}`,
    data: (rdv) => ({
      rdvId: rdv.id,
      type: 'rdv_confirmed',
      url: `/client/rdv/${rdv.id}`,
    }),
  },

  rdv_cancelled: {
    type: 'system',
    title: 'RDV annulé',
    bodyTemplate: (rdv) =>
      `Votre RDV du ${rdv.date} a été annulé`,
    data: (rdv) => ({
      rdvId: rdv.id,
      type: 'system',
      url: `/client/reserver`,
    }),
  },

  // Formation/Training
  formation_complete: {
    type: 'formation_complete',
    title: 'Formation terminée',
    bodyTemplate: (formation) =>
      `Bravo! Vous avez complété "${formation.title}"`,
    data: (formation) => ({
      formationId: formation.id,
      type: 'formation_complete',
      url: `/employe/formations/${formation.id}`,
    }),
  },

  formation_reminder: {
    type: 'system',
    title: 'Formation à suivre',
    bodyTemplate: (formation) =>
      `"${formation.title}" est maintenant disponible`,
    data: (formation) => ({
      formationId: formation.id,
      type: 'system',
      url: `/employe/formations`,
    }),
  },

  // Promotions & Offers
  promo_new: {
    type: 'promo',
    title: 'Nouvelle offre!',
    bodyTemplate: (promo) =>
      `${promo.title} - ${promo.discount}% de rabais`,
    data: (promo) => ({
      promoId: promo.id,
      type: 'promo',
      url: `/client/offres`,
    }),
  },

  promo_expiring: {
    type: 'promo',
    title: 'Offre se termine bientôt',
    bodyTemplate: (promo) =>
      `${promo.title} expire dans ${promo.daysLeft} jours`,
    data: (promo) => ({
      promoId: promo.id,
      type: 'promo',
      url: `/client/offres`,
    }),
  },

  // Subscription/Abonnement
  subscription_expiring: {
    type: 'system',
    title: 'Abonnement expire bientôt',
    bodyTemplate: (subscription) =>
      `Votre abonnement expire le ${subscription.expiryDate}`,
    data: (subscription) => ({
      subscriptionId: subscription.id,
      type: 'system',
      url: `/client/abonnement`,
    }),
  },

  subscription_renewed: {
    type: 'system',
    title: 'Abonnement renouvelé',
    bodyTemplate: (subscription) =>
      `Votre abonnement ${subscription.name} est actif jusqu'au ${subscription.expiryDate}`,
    data: (subscription) => ({
      subscriptionId: subscription.id,
      type: 'system',
      url: `/client/abonnement`,
    }),
  },

  // Payments
  payment_received: {
    type: 'system',
    title: 'Paiement reçu',
    bodyTemplate: (payment) =>
      `Paiement de ${payment.amount} reçu pour ${payment.description}`,
    data: (payment) => ({
      paymentId: payment.id,
      type: 'system',
      url: `/client/historique`,
    }),
  },

  payment_failed: {
    type: 'system',
    title: 'Échec du paiement',
    bodyTemplate: (payment) =>
      `Votre paiement pour ${payment.description} a échoué`,
    data: (payment) => ({
      paymentId: payment.id,
      type: 'system',
      url: `/client/profil`,
    }),
  },

  // Loyalty/Rewards
  points_earned: {
    type: 'system',
    title: 'Points gagnés!',
    bodyTemplate: (reward) =>
      `Vous avez gagné ${reward.points} points (Total: ${reward.totalPoints})`,
    data: (reward) => ({
      rewardId: reward.id,
      type: 'system',
      url: `/client/carte`,
    }),
  },

  reward_available: {
    type: 'promo',
    title: 'Récompense disponible',
    bodyTemplate: (reward) =>
      `Vous pouvez réclamer: ${reward.title}`,
    data: (reward) => ({
      rewardId: reward.id,
      type: 'promo',
      url: `/client/recompenses`,
    }),
  },

  // Admin Notifications
  booking_new: {
    type: 'system',
    title: 'Nouvelle réservation',
    bodyTemplate: (booking) =>
      `${booking.clientName} a réservé le ${booking.date} à ${booking.time}`,
    data: (booking) => ({
      bookingId: booking.id,
      type: 'system',
      url: `/admin/reservations`,
    }),
  },

  application_received: {
    type: 'system',
    title: 'Nouvelle candidature',
    bodyTemplate: (app) =>
      `Candidature reçue de ${app.candidateName} pour ${app.position}`,
    data: (app) => ({
      applicationId: app.id,
      type: 'system',
      url: `/admin/candidats`,
    }),
  },
}

/**
 * Generate notification payload from template
 */
export function generateNotification(templateKey, data) {
  const template = NOTIFICATION_TEMPLATES[templateKey]
  if (!template) {
    console.warn(`Unknown notification template: ${templateKey}`)
    return null
  }

  return {
    title: template.title,
    body: template.bodyTemplate(data),
    type: template.type,
    data: template.data(data),
  }
}

/**
 * Get all available template keys
 */
export function getAvailableTemplates() {
  return Object.keys(NOTIFICATION_TEMPLATES)
}
