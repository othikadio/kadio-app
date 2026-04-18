// ── Mock data — Espace Admin Module 9 ─────────────────────────

// Candidatures
export const MOCK_CANDIDATURES = [
  { id: 'c1', prenom: 'Mariam', nom: 'Diallo', telephone: '514-555-0201', email: 'mariam@email.com', ville: 'Longueuil', specialites: ['Tresses', 'Knotless'], experience: '3 ans', motivation: `J'ai toujours passionné par la coiffure afro. Je veux rejoindre Kadio pour développer ma clientèle professionnellement.`, statut: 'accepte', date: '2026-03-01', formation_complete: true, score_quiz: 88, note_entretien: null },
  { id: 'c2', prenom: 'Aïcha', nom: 'Traoré', telephone: '514-555-0202', email: 'aicha@email.com', ville: 'Montréal', specialites: ['Locs', 'Knotless'], experience: '5 ans', motivation: `Coiffeuse depuis 5 ans à domicile, je cherche à structurer mon activité avec un réseau professionnel.`, statut: 'en_attente', date: '2026-03-15', formation_complete: false, score_quiz: null, note_entretien: null },
  { id: 'c3', prenom: 'Bintou', nom: 'Koné', telephone: '514-555-0203', email: 'bintou@email.com', ville: 'Laval', specialites: ['Tresses', 'Tissage'], experience: '2 ans', motivation: `Diplômée en esthétique, je souhaite me spécialiser en coiffure afro via votre programme certifiant.`, statut: 'en_revision', date: '2026-03-20', formation_complete: false, score_quiz: null, note_entretien: null },
  { id: 'c4', prenom: 'Yves', nom: 'Kouakou', telephone: '514-555-0204', email: 'yves@email.com', ville: 'Brossard', specialites: ['Barbier', 'Coupes'], experience: '7 ans', motivation: `Barbier professionnel depuis 7 ans, je veux intégrer le réseau Kadio pour les clients masculins.`, statut: 'accepte', date: '2026-02-20', formation_complete: true, score_quiz: 92, note_entretien: null },
  { id: 'c5', prenom: 'Nadia', nom: 'Sanogo', telephone: '514-555-0205', email: 'nadia@email.com', ville: 'Montréal', specialites: ['Knotless', 'Crochet'], experience: '1 an', motivation: `Passionnée de coiffure naturelle, je débute et veux me former avec les meilleurs.`, statut: 'refusee', date: '2026-02-10', formation_complete: false, score_quiz: null, note_entretien: null },
]

// Partenaires admin
export const MOCK_PARTENAIRES_ADMIN = [
  { id: 'p1', prenom: 'Diane', nom: 'Mbaye', telephone: '514-000-0002', email: 'diane@kadio.ca', ville: 'Longueuil', note: 4.9, rdv_total: 127, niveau: 'elite', statut: 'actif', solde_portefeuille: 342.50, specialites: ['Tresses', 'Knotless'], date_adhesion: '2025-07-01', revenus_mois: 1840, commission_rate: 0.25, certifie: true },
  { id: 'p2', prenom: 'Fatou', nom: `Konaté`, telephone: '514-555-1002', email: 'fatou@kadio.ca', ville: 'Montréal', note: 4.7, rdv_total: 98, niveau: 'certifie', statut: 'actif', solde_portefeuille: 215.00, specialites: ['Locs', 'Knotless'], date_adhesion: '2025-09-15', revenus_mois: 1320, commission_rate: 0.25, certifie: true },
  { id: 'p3', prenom: 'Sandra', nom: 'Pierre', telephone: '514-555-1003', email: 'sandra@kadio.ca', ville: 'Montréal', note: 4.8, rdv_total: 74, niveau: 'certifie', statut: 'actif', solde_portefeuille: 180.00, specialites: ['Tresses', 'Coupes'], date_adhesion: '2025-10-01', revenus_mois: 1100, commission_rate: 0.25, certifie: true },
  { id: 'p4', prenom: 'Aminata', nom: 'Coulibaly', telephone: '514-555-1004', email: 'aminata.c@kadio.ca', ville: 'Laval', note: 4.6, rdv_total: 52, niveau: 'partenaire', statut: 'actif', solde_portefeuille: 95.00, specialites: ['Barbier', 'Coupes'], date_adhesion: '2025-11-20', revenus_mois: 780, commission_rate: 0.25, certifie: false },
  { id: 'p5', prenom: 'Rachel', nom: 'Ndoye', telephone: '514-555-1005', email: 'rachel@kadio.ca', ville: 'Brossard', note: 5.0, rdv_total: 163, niveau: 'ambassadeur', statut: 'actif', solde_portefeuille: 520.00, specialites: ['Knotless', 'Tresses'], date_adhesion: '2025-06-01', revenus_mois: 2340, commission_rate: 0.25, certifie: true },
  { id: 'p6', prenom: 'Marcus', nom: 'Durand', telephone: '514-000-0003', email: 'marcus@kadio.ca', ville: 'Longueuil', note: 4.5, rdv_total: 41, niveau: 'partenaire', statut: 'suspendu', solde_portefeuille: 0, specialites: ['Barbier', 'Locs'], date_adhesion: '2025-12-10', revenus_mois: 0, commission_rate: 0.25, certifie: false },
]

// Employés salon
export const MOCK_EMPLOYES_ADMIN = [
  { id: 'e1', prenom: 'Marcus', nom: 'Durand', telephone: '514-000-0003', email: 'marcus@kadio.ca', poste: 'Barbier', specialites: ['Barbier', 'Coupes'], couleur_agenda: '#3B82F6', statut: 'actif', rdv_semaine: 18, revenus_semaine: 540, date_embauche: '2025-08-01', commission_rate: 0.75 },
  { id: 'e2', prenom: 'Joël', nom: 'Tamba', telephone: '514-555-2001', email: 'joel@kadio.ca', poste: 'Coiffeur', specialites: ['Tresses', 'Knotless'], couleur_agenda: '#10B981', statut: 'actif', rdv_semaine: 22, revenus_semaine: 680, date_embauche: '2025-09-15', commission_rate: 0.75 },
  { id: 'e3', prenom: 'Carine', nom: 'Lussier', telephone: '514-555-2002', email: 'carine@kadio.ca', poste: 'Coiffeuse', specialites: ['Locs', 'Tissage'], couleur_agenda: '#8B5CF6', statut: 'actif', rdv_semaine: 19, revenus_semaine: 610, date_embauche: '2025-10-01', commission_rate: 0.75 },
  { id: 'e4', prenom: 'Steve', nom: 'Moreau', telephone: '514-555-2003', email: 'steve@kadio.ca', poste: 'Barbier', specialites: ['Barbier', 'Fade'], couleur_agenda: '#F59E0B', statut: 'actif', rdv_semaine: 24, revenus_semaine: 720, date_embauche: '2025-11-10', commission_rate: 0.75 },
  { id: 'e5', prenom: 'Amina', nom: 'Ba', telephone: '514-555-2004', email: 'amina.b@kadio.ca', poste: 'Coiffeuse', specialites: ['Knotless', 'Tresses enfant'], couleur_agenda: '#EC4899', statut: 'conge', rdv_semaine: 0, revenus_semaine: 0, date_embauche: '2026-01-05', commission_rate: 0.75 },
]

// Clients admin
export const MOCK_CLIENTS_ADMIN = [
  { id: 'cl1', prenom: 'Aminata', nom: 'Diallo', telephone: '514-000-0001', email: 'aminata@email.com', ville: 'Montréal', abonne: true, plan: 'Knotless Signature', rdv_total: 14, no_shows: 0, statut: 'actif', credits_parrainage: 2, date_inscription: '2025-08-15', dernier_rdv: '2026-03-22' },
  { id: 'cl2', prenom: 'Jean-Baptiste', nom: 'Kouassi', telephone: '514-555-3001', email: 'jbk@email.com', ville: 'Longueuil', abonne: true, plan: 'Barbier Premium', rdv_total: 31, no_shows: 1, statut: 'actif', credits_parrainage: 0, date_inscription: '2025-07-01', dernier_rdv: '2026-03-25' },
  { id: 'cl3', prenom: 'Christelle', nom: 'Mensah', telephone: '514-555-3002', email: 'chris@email.com', ville: 'Brossard', abonne: true, plan: 'Tresses Signature', rdv_total: 8, no_shows: 0, statut: 'actif', credits_parrainage: 3, date_inscription: '2025-11-20', dernier_rdv: '2026-03-18' },
  { id: 'cl4', prenom: 'David', nom: 'Nkosi', telephone: '514-555-3003', email: 'david.n@email.com', ville: 'Montréal', abonne: false, plan: null, rdv_total: 5, no_shows: 2, statut: 'actif', credits_parrainage: 0, date_inscription: '2026-01-10', dernier_rdv: '2026-03-01' },
  { id: 'cl5', prenom: 'Sophie', nom: 'Tremblay', telephone: '514-555-3004', email: 'sophie.t@email.com', ville: 'Laval', abonne: false, plan: null, rdv_total: 2, no_shows: 2, statut: 'bloque', credits_parrainage: 0, date_inscription: '2026-02-01', dernier_rdv: '2026-02-15', motif_blocage: `No-shows répétés sans annulation préalable.` },
  { id: 'cl6', prenom: 'Kofi', nom: 'Asante', telephone: '514-555-3005', email: 'kofi@email.com', ville: 'Longueuil', abonne: true, plan: 'Barbier Essentiel', rdv_total: 19, no_shows: 0, statut: 'actif', credits_parrainage: 1, date_inscription: '2025-09-30', dernier_rdv: '2026-03-27' },
]

// Abonnements
export const MOCK_ABONNEMENTS_ADMIN = [
  { id: 'ab1', client: { prenom: 'Aminata', nom: 'Diallo', tel: '514-000-0001' }, plan: 'Knotless Signature', prix: 110, statut: 'actif', prochain_paiement: '2026-04-15', date_debut: '2025-08-15', sessions_restantes: 1 },
  { id: 'ab2', client: { prenom: 'Jean-Baptiste', nom: 'Kouassi', tel: '514-555-3001' }, plan: 'Barbier Premium', prix: 45, statut: 'actif', prochain_paiement: '2026-04-01', date_debut: '2025-07-01', sessions_restantes: 2 },
  { id: 'ab3', client: { prenom: 'Christelle', nom: 'Mensah', tel: '514-555-3002' }, plan: 'Tresses Signature', prix: 175, statut: 'actif', prochain_paiement: '2026-04-18', date_debut: '2025-11-20', sessions_restantes: 1 },
  { id: 'ab4', client: { prenom: 'Kofi', nom: 'Asante', tel: '514-555-3005' }, plan: 'Barbier Essentiel', prix: 29, statut: 'actif', prochain_paiement: '2026-04-10', date_debut: '2025-09-30', sessions_restantes: 0 },
  { id: 'ab5', client: { prenom: 'Marie', nom: 'Duval', tel: '514-555-3006' }, plan: 'Locs Mensuel', prix: 60, statut: 'en_attente', prochain_paiement: '2026-03-28', date_debut: '2026-02-28', sessions_restantes: 1 },
  { id: 'ab6', client: { prenom: 'Omar', nom: 'Bah', tel: '514-555-3007' }, plan: 'Knotless Signature', prix: 110, statut: 'suspendu', prochain_paiement: null, date_debut: '2025-10-01', sessions_restantes: 0 },
]

// Transactions / finances
export const MOCK_TRANSACTIONS_ADMIN = [
  { id: 't1', date: '2026-03-27', type: 'abonnement', client: 'Aminata Diallo', montant: 110, commission_kadio: 110, partenaire: null, statut: 'recu' },
  { id: 't2', date: '2026-03-27', type: 'rdv_salon', client: 'Jean-Baptiste K.', montant: 120, commission_kadio: 30, partenaire: 'Diane Mbaye', statut: 'recu' },
  { id: 't3', date: '2026-03-26', type: 'rdv_domicile', client: 'Christelle Mensah', montant: 140, commission_kadio: 35, partenaire: 'Rachel Ndoye', statut: 'recu' },
  { id: 't4', date: '2026-03-25', type: 'abonnement', client: 'Kofi Asante', montant: 29, commission_kadio: 29, partenaire: null, statut: 'recu' },
  { id: 't5', date: '2026-03-24', type: 'materiel', client: null, montant: 69.47, commission_kadio: 6.95, partenaire: 'Diane Mbaye', statut: 'recu' },
  { id: 't6', date: '2026-03-23', type: 'rdv_salon', client: 'David Nkosi', montant: 80, commission_kadio: 20, partenaire: `Fatou Konaté`, statut: 'recu' },
  { id: 't7', date: '2026-03-22', type: 'abonnement', client: 'Marie Duval', montant: 60, commission_kadio: 60, partenaire: null, statut: 'en_attente' },
  { id: 't8', date: '2026-03-21', type: 'rdv_domicile', client: 'Kofi Asante', montant: 95, commission_kadio: 23.75, partenaire: 'Diane Mbaye', statut: 'recu' },
]

// Virements
export const MOCK_VIREMENTS_ADMIN = [
  { id: 'v1', date: '2026-03-21', partenaire: 'Diane Mbaye', montant: 280.00, statut: 'effectue', methode: 'Virement Interac' },
  { id: 'v2', date: '2026-03-21', partenaire: 'Rachel Ndoye', montant: 390.00, statut: 'effectue', methode: 'Virement Interac' },
  { id: 'v3', date: '2026-03-21', partenaire: `Fatou Konaté`, montant: 175.00, statut: 'effectue', methode: 'Virement Interac' },
  { id: 'v4', date: '2026-03-21', partenaire: 'Sandra Pierre', montant: 145.00, statut: 'effectue', methode: 'Virement Interac' },
  { id: 'v5', date: '2026-03-28', partenaire: 'Diane Mbaye', montant: 342.50, statut: 'en_attente', methode: null },
  { id: 'v6', date: '2026-03-28', partenaire: 'Rachel Ndoye', montant: 520.00, statut: 'en_attente', methode: null },
  { id: 'v7', date: '2026-03-28', partenaire: `Fatou Konaté`, montant: 215.00, statut: 'en_attente', methode: null },
  { id: 'v8', date: '2026-03-28', partenaire: 'Sandra Pierre', montant: 180.00, statut: 'en_attente', methode: null },
  { id: 'v9', date: '2026-03-28', partenaire: 'Aminata Coulibaly', montant: 95.00, statut: 'en_attente', methode: null },
]

// Chaises / Réservations salon
export const CHAISES_SALON = [
  { id: 'ch1', nom: 'Chaise 1', couleur: '#3B82F6' },
  { id: 'ch2', nom: 'Chaise 2', couleur: '#10B981' },
  { id: 'ch3', nom: 'Chaise 3', couleur: '#8B5CF6' },
  { id: 'ch4', nom: 'Chaise 4', couleur: '#F59E0B' },
]

export const MOCK_RESERVATIONS_ADMIN = [
  { id: 'r1', chaise_id: 'ch1', partenaire: 'Diane Mbaye', date: '2026-03-28', heure_debut: '09:00', heure_fin: '13:00', service: 'Knotless braids' },
  { id: 'r2', chaise_id: 'ch2', partenaire: 'Rachel Ndoye', date: '2026-03-28', heure_debut: '10:00', heure_fin: '14:00', service: 'Tresses classiques' },
  { id: 'r3', chaise_id: 'ch3', partenaire: `Fatou Konaté`, date: '2026-03-28', heure_debut: '14:00', heure_fin: '17:00', service: 'Locs resserrage' },
  { id: 'r4', chaise_id: 'ch1', partenaire: 'Sandra Pierre', date: '2026-03-29', heure_debut: '09:00', heure_fin: '12:00', service: 'Tissage' },
  { id: 'r5', chaise_id: 'ch2', partenaire: 'Diane Mbaye', date: '2026-03-29', heure_debut: '13:00', heure_fin: '17:00', service: 'Knotless braids' },
]

// RDV réseau (pour dashboard + calendrier)
export const MOCK_RDV_RESEAU = [
  { id: 'rdv1', date: '2026-03-28', heure: '09:00', client: 'Aminata Diallo', coiffeur: 'Diane Mbaye', service: 'Knotless braids', lieu: 'salon', statut: 'confirme', montant: 120 },
  { id: 'rdv2', date: '2026-03-28', heure: '10:30', client: 'Jean-Baptiste K.', coiffeur: 'Steve Moreau', service: 'Coupe + Barbe', lieu: 'salon', statut: 'confirme', montant: 60 },
  { id: 'rdv3', date: '2026-03-28', heure: '11:00', client: 'Kofi Asante', coiffeur: 'Marcus Durand', service: 'Barbier fade', lieu: 'salon', statut: 'en_cours', montant: 35 },
  { id: 'rdv4', date: '2026-03-28', heure: '14:00', client: 'Christelle Mensah', coiffeur: 'Rachel Ndoye', service: 'Tresses signature', lieu: 'domicile', statut: 'confirme', montant: 230 },
  { id: 'rdv5', date: '2026-03-27', heure: '09:30', client: 'David Nkosi', coiffeur: `Fatou Konaté`, service: 'Tresses classiques', lieu: 'salon', statut: 'termine', montant: 80 },
  { id: 'rdv6', date: '2026-03-27', heure: '13:00', client: 'Sophie Tremblay', coiffeur: 'Joël Tamba', service: 'Locs installation', lieu: 'salon', statut: 'no_show', montant: 150 },
  { id: 'rdv7', date: '2026-03-26', heure: '10:00', client: 'Marie Duval', coiffeur: 'Carine Lussier', service: 'Locs entretien', lieu: 'salon', statut: 'termine', montant: 60 },
]

// SMS Templates
export const MOCK_SMS_TEMPLATES = [
  { id: 's1', cat: 'RDV', nom: 'Rappel RDV 24h', message: `Bonjour {prenom} ! Rappel de votre RDV demain {date} à {heure} avec {coiffeur}. Pour annuler : kadio.ca/annuler. Kadio 💛` },
  { id: 's2', cat: 'RDV', nom: 'Confirmation RDV', message: `✅ RDV confirmé ! {prenom}, votre rendez-vous du {date} à {heure} avec {coiffeur} est bien enregistré. À bientôt ! — Kadio` },
  { id: 's3', cat: 'RDV', nom: 'No-show avertissement', message: `Bonjour {prenom}. Nous avons noté votre absence au RDV du {date}. 2 absences → suspension de compte. Contactez-nous : kadio.ca — Kadio` },
  { id: 's4', cat: 'RDV', nom: 'Annulation partenaire', message: `Bonjour {prenom}. Votre RDV du {date} a dû être annulé par {coiffeur}. Reprenez RDV : kadio.ca. Désolés pour la gêne. — Kadio` },
  { id: 's5', cat: 'Abonnement', nom: 'Bienvenue abonné', message: `Bienvenue dans le plan {plan}, {prenom} ! Votre abonnement est actif. Réservez votre 1ère session : kadio.ca — Kadio 💛` },
  { id: 's6', cat: 'Abonnement', nom: 'Renouvellement proche', message: `{prenom}, votre abonnement {plan} se renouvelle le {date} ({prix}$). Questions ? Répondez à ce message. — Kadio` },
  { id: 's7', cat: 'Abonnement', nom: 'Paiement échoué', message: `{prenom}, le renouvellement de votre abonnement {plan} a échoué. Mettez à jour votre paiement : kadio.ca/profil — Kadio` },
  { id: 's8', cat: 'Abonnement', nom: 'Suspension abonnement', message: `{prenom}, votre abonnement a été suspendu suite à un impayé. Contactez-nous pour le réactiver. — Kadio` },
  { id: 's9', cat: 'Parrainage', nom: 'Code parrainage', message: `{prenom} vous parraine ! Utilisez le code {code} sur kadio.ca pour obtenir votre 1ère session à -20%. Offre valide 30 jours. — Kadio 💛` },
  { id: 's10', cat: 'Parrainage', nom: 'Crédit parrainage gagné', message: `🎉 {prenom}, {filleul} vient de compléter son 1er RDV ! Vous avez gagné 1 crédit de parrainage. Total : {total} crédits. — Kadio` },
  { id: 's11', cat: 'Marketing', nom: 'Promo flash 24h', message: `⚡ PROMO KADIO 24H : -15% sur tous les RDV aujourd'hui ! Code : FLASH15. Réservez maintenant : kadio.ca — Offre expire ce soir.` },
  { id: 's12', cat: 'Marketing', nom: 'Nouveau partenaire zone', message: `📍 Nouveau ! {coiffeur} rejoint Kadio à {ville}. Spécialiste en {specialite}. Réservez dès maintenant : kadio.ca — Kadio 💛` },
  { id: 's13', cat: 'Marketing', nom: 'Réactivation client inactif', message: `{prenom}, ça fait {jours} jours qu'on ne vous a pas vu ! Revenez avec -10% sur votre prochaine session. Code : RETOUR10 — Kadio` },
  { id: 's14', cat: 'Partenaire', nom: 'Nouveau RDV reçu', message: `📅 Nouveau RDV, {prenom} ! {client} a réservé le {date} à {heure} ({service}). Confirmez dans l'app Kadio. — Kadio` },
  { id: 's15', cat: 'Partenaire', nom: 'Virement effectué', message: `💸 Virement de {montant}$ effectué vers votre compte. Délai bancaire : 1-2 jours ouvrables. Merci pour votre travail ! — Kadio` },
  { id: 's16', cat: 'Partenaire', nom: 'Alerte note basse', message: `{prenom}, votre note Kadio est à {note}/5. Nous avons des ressources pour vous aider. Contactez votre responsable Kadio. — Kadio` },
  { id: 's17', cat: 'OTP', nom: 'Code de vérification', message: `Votre code Kadio : {code}. Valide 10 minutes. Ne le partagez jamais. — Kadio` },
  { id: 's18', cat: 'OTP', nom: 'Changement mot de passe', message: `Code de sécurité Kadio : {code}. Si vous n'êtes pas à l'origine de cette demande, ignorez ce message. — Kadio` },
  { id: 's19', cat: 'Formation', nom: 'Candidature reçue', message: `Bonjour {prenom} ! Votre candidature Kadio a bien été reçue. Nous vous contactons sous 5 jours ouvrables. — Kadio 💛` },
  { id: 's20', cat: 'Formation', nom: 'Candidature acceptée', message: `🎉 Félicitations {prenom} ! Votre candidature est acceptée. Connectez-vous à kadio.ca pour commencer votre formation. — Kadio` },
  { id: 's21', cat: 'Formation', nom: 'Formation complétée', message: `🏆 Bravo {prenom} ! Vous avez complété la formation Kadio. Votre certificat est disponible dans l'app. Bienvenue dans le réseau ! — Kadio` },
  { id: 's22', cat: 'Formation', nom: 'Rappel module en cours', message: `{prenom}, votre module {module} vous attend ! Complétez-le pour débloquer la suite de votre certification Kadio. — Kadio` },
  { id: 's23', cat: 'RDV', nom: 'Feedback post-RDV', message: `{prenom}, comment s'est passée votre session avec {coiffeur} ? Notez votre expérience : kadio.ca/avis — Merci ! 💛 — Kadio` },
  { id: 's24', cat: 'Marketing', nom: `Invitation événement`, message: `{prenom}, Kadio sera présent à {evenement} le {date}. Venez nous rencontrer ! Infos : kadio.ca/events — Kadio 💛` },
  { id: 's25', cat: 'Abonnement', nom: `Rappel session inutilisée`, message: `{prenom}, votre session {plan} expire le {date} ! Ne la perdez pas, réservez maintenant : kadio.ca — Kadio` },
]

// Stats globales
export const MOCK_STATS_ADMIN = {
  rdv_semaine: 87,
  rdv_semaine_prev: 74,
  revenus_mois: 12840,
  revenus_mois_prev: 10920,
  abonnes_actifs: 4,
  partenaires_actifs: 5,
  no_shows_mois: 3,
  taux_no_show: 3.4,
  revenus_par_source: [
    { source: 'Abonnements', montant: 4220 },
    { source: 'RDV salon', montant: 5340 },
    { source: 'RDV domicile', montant: 2680 },
    { source: 'Matériel', montant: 600 },
  ],
  revenus_par_mois: [
    { mois: 'Nov', montant: 7200 },
    { mois: 'Déc', montant: 8100 },
    { mois: 'Jan', montant: 9300 },
    { mois: 'Fév', montant: 10920 },
    { mois: 'Mar', montant: 12840 },
  ],
  top_services: [
    { service: 'Knotless braids', count: 34 },
    { service: 'Coupe barbier', count: 28 },
    { service: 'Tresses classiques', count: 22 },
    { service: 'Locs resserrage', count: 15 },
    { service: 'Tissage', count: 8 },
  ],
}

// Alertes dashboard
export const MOCK_ALERTES = [
  { id: 'a1', type: 'no_show', message: `Sophie Tremblay — 2e no-show (2026-03-27 avec Joël Tamba)`, action: 'Bloquer le client', severity: 'high' },
  { id: 'a2', type: 'paiement', message: `Abonnement Marie Duval (Locs Mensuel 60$) en attente depuis 3 jours`, action: 'Envoyer rappel', severity: 'medium' },
  { id: 'a3', type: 'virement', message: `5 virements en attente — Total : 1 352,50$`, action: 'Effectuer virements', severity: 'medium' },
  { id: 'a4', type: 'candidature', message: `2 nouvelles candidatures à examiner (Aïcha Traoré, Bintou Koné)`, action: 'Voir candidatures', severity: 'low' },
]

// Config salon
export const MOCK_CONFIG_SALON = {
  nom: 'Kadio Coiffure',
  adresse: '1234 Rue de la Paix, Longueuil, QC J4H 1A1',
  telephone: '514-919-5970',
  email: 'contact@kadio.ca',
  horaires: {
    lundi:    { ouvert: true,  debut: '09:00', fin: '18:00' },
    mardi:    { ouvert: true,  debut: '09:00', fin: '18:00' },
    mercredi: { ouvert: true,  debut: '09:00', fin: '18:00' },
    jeudi:    { ouvert: true,  debut: '09:00', fin: '20:00' },
    vendredi: { ouvert: true,  debut: '09:00', fin: '20:00' },
    samedi:   { ouvert: true,  debut: '09:00', fin: '17:00' },
    dimanche: { ouvert: false, debut: '',      fin: ''      },
  },
  politique_no_show: { seuil_avertissement: 1, seuil_blocage: 2 },
  commission_defaut_salon: 25,
  commission_defaut_domicile: 25,
  deplacement_grille: [
    { distance_min_km: 0,  distance_max_km: 5,  tarif_normal: 15, tarif_abonne: 10 },
    { distance_min_km: 5,  distance_max_km: 10, tarif_normal: 25, tarif_abonne: 18 },
    { distance_min_km: 10, distance_max_km: 20, tarif_normal: 40, tarif_abonne: 28 },
    { distance_min_km: 20, distance_max_km: 99, tarif_normal: 55, tarif_abonne: 35 },
  ],
  stripe_actif: true,
  twilio_actif: true,
  supabase_actif: true,
}
