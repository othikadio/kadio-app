-- ══════════════════════════════════════════════════════════════════════════════
-- KADIO SALON MANAGEMENT APP — SEED DATA
-- ══════════════════════════════════════════════════════════════════════════════
-- Initial data for salon configuration, plans, services, and formations

-- ══════════════════════════════════════════════════════════════════════════════
-- 1. SALON CONFIGURATION
-- ══════════════════════════════════════════════════════════════════════════════

INSERT INTO salon_config (key, value) VALUES
('salon_nom', '"Kadio Coiffure"'),
('salon_adresse', '"1234 Rue de la Paix, Longueuil, QC J4H 1A1"'),
('salon_telephone', '"514-919-5970"'),
('salon_email', '"contact@kadio.ca"'),
('commission_defaut_salon', '25'),
('commission_defaut_domicile', '25'),
('policy_no_show_avertissement', '1'),
('policy_no_show_blocage', '2'),
('horaires', '{
  "lundi": {"ouvert": true, "debut": "09:00", "fin": "18:00"},
  "mardi": {"ouvert": true, "debut": "09:00", "fin": "18:00"},
  "mercredi": {"ouvert": true, "debut": "09:00", "fin": "18:00"},
  "jeudi": {"ouvert": true, "debut": "09:00", "fin": "20:00"},
  "vendredi": {"ouvert": true, "debut": "09:00", "fin": "20:00"},
  "samedi": {"ouvert": true, "debut": "09:00", "fin": "17:00"},
  "dimanche": {"ouvert": false, "debut": null, "fin": null}
}'),
('deplacement_grille', '[
  {"distance_min_km": 0, "distance_max_km": 5, "tarif_normal": 15, "tarif_abonne": 10},
  {"distance_min_km": 5, "distance_max_km": 10, "tarif_normal": 25, "tarif_abonne": 18},
  {"distance_min_km": 10, "distance_max_km": 20, "tarif_normal": 40, "tarif_abonne": 28},
  {"distance_min_km": 20, "distance_max_km": 99, "tarif_normal": 55, "tarif_abonne": 35}
]');

-- ══════════════════════════════════════════════════════════════════════════════
-- 2. SUBSCRIPTION PLANS
-- ══════════════════════════════════════════════════════════════════════════════

INSERT INTO plans (nom, prix, periode, features, actif) VALUES
(
  'Knotless Signature',
  110,
  'mensuel',
  '["1 session knotless", "Consultation style", "SMS rappels", "Priorité booking", "Réduction 15% extras"]',
  true
),
(
  'Tresses Signature',
  175,
  'mensuel',
  '["1 session tresses", "Consultation style", "SMS rappels", "Priorité booking", "Réduction 15% extras"]',
  true
),
(
  'Barbier Premium',
  45,
  'mensuel',
  '["4 coupes barbier", "Taille barbe incluse", "SMS rappels", "Priorité booking"]',
  true
),
(
  'Barbier Essentiel',
  29,
  'mensuel',
  '["2 coupes barbier", "SMS rappels"]',
  true
),
(
  'Locs Mensuel',
  60,
  'mensuel',
  '["1 session locs", "Consultation", "SMS rappels"]',
  true
),
(
  'Multi-services Annuel',
  450,
  'annuel',
  '["Accès illimité réseau", "Toutes les spécialités", "Consultations offertes", "Support prioritaire", "Réduction 20% tous services"]',
  true
);

-- ══════════════════════════════════════════════════════════════════════════════
-- 3. SERVICES
-- ══════════════════════════════════════════════════════════════════════════════

INSERT INTO services (nom, categorie, prix_salon, prix_domicile, duree_minutes, actif) VALUES
-- Tresses services
('Tresses classiques', 'Tresses', 80.00, 100.00, 120, true),
('Tresses enfant', 'Tresses', 50.00, 70.00, 90, true),
('Retouche tresses', 'Tresses', 40.00, 60.00, 60, true),

-- Knotless services
('Knotless braids', 'Knotless', 140.00, 160.00, 180, true),
('Knotless retouche', 'Knotless', 60.00, 80.00, 90, true),
('Knotless court', 'Knotless', 100.00, 120.00, 120, true),

-- Locs services
('Locs installation', 'Locs', 150.00, 180.00, 240, true),
('Locs resserrage', 'Locs', 80.00, 110.00, 120, true),
('Locs lavage/soin', 'Locs', 40.00, 60.00, 60, true),

-- Tissage services
('Tissage complet', 'Tissage', 120.00, 150.00, 150, true),
('Retouche tissage', 'Tissage', 60.00, 80.00, 90, true),

-- Barber services
('Coupe barbier fade', 'Barbier', 35.00, 45.00, 45, true),
('Coupe dégradé', 'Barbier', 40.00, 50.00, 45, true),
('Barbe complète', 'Barbier', 25.00, 35.00, 30, true),
('Coupe + barbe', 'Barbier', 60.00, 75.00, 60, true),

-- Soins services
('Soin cuir chevelu', 'Soins', 60.00, 80.00, 60, true),
('Soin hydratation', 'Soins', 50.00, 70.00, 45, true),
('Traitement cheveux naturels', 'Soins', 80.00, 110.00, 90, true);

-- ══════════════════════════════════════════════════════════════════════════════
-- 4. FORMATION MODULES — FOR CANDIDATS (Partners/Stylists)
-- ══════════════════════════════════════════════════════════════════════════════

INSERT INTO formation_modules (titre, description, duree_minutes, icon, type, ordre) VALUES
('Standards Kadio', 'Valeurs, charte qualité, présentation de la plateforme et de la mission Kadio.', 20, '⭐', 'candidat', 1),
('Relation client', 'Accueil, communication, gestion des attentes et des situations difficiles.', 25, '🤝', 'candidat', 2),
('Comment ça fonctionne au salon', 'Vidéo formative complète : le parcours d''un RDV au salon Kadio de A à Z.', 30, '🎬', 'candidat', 3),
('Hygiène et professionnalisme', 'Normes sanitaires, présentation personnelle, matériel et espace de travail.', 20, '✨', 'candidat', 4);

-- ══════════════════════════════════════════════════════════════════════════════
-- 5. FORMATION ETAPES — FOR CANDIDATS
-- ══════════════════════════════════════════════════════════════════════════════

INSERT INTO formation_etapes (module_id, icon, titre, description, ordre) VALUES
-- Module 1: Standards Kadio
((SELECT id FROM formation_modules WHERE titre = 'Standards Kadio'), 'mission', 'Notre mission', 'Kadio connecte les clients afro et caribéens à des coiffeurs certifiés, partout au Québec.', 1),
((SELECT id FROM formation_modules WHERE titre = 'Standards Kadio'), 'piliers', 'Les 3 piliers', 'Chaque partenaire représente la marque Kadio. Ponctualité, qualité et respect sont nos fondations.', 2),
((SELECT id FROM formation_modules WHERE titre = 'Standards Kadio'), 'notation', 'Système de notation', 'Les clients notent chaque service. Votre note influence directement votre visibilité sur la plateforme.', 3),
((SELECT id FROM formation_modules WHERE titre = 'Standards Kadio'), 'niveaux', '4 niveaux de partenariat', 'Partenaire → Certifié → Élite → Ambassadeur. Plus vous performez, plus vous êtes mis en avant.', 4),

-- Module 2: Relation client
((SELECT id FROM formation_modules WHERE titre = 'Relation client'), 'qr', 'Scan du code QR', 'Le client arrive avec un code QR ou un code numérique. Scannez-le dès son arrivée pour confirmer sa présence.', 1),
((SELECT id FROM formation_modules WHERE titre = 'Relation client'), 'identite', 'Vérification identité', 'Vérifiez que c''est bien la bonne personne : nom et service correspondent-ils à la réservation ?', 2),
((SELECT id FROM formation_modules WHERE titre = 'Relation client'), 'conditions', 'Conditions respectées ?', 'Notez immédiatement si le client est venu seul et s''il respecte les conditions (ex: cheveux lavés si requis).', 3),
((SELECT id FROM formation_modules WHERE titre = 'Relation client'), 'start', 'Début de prestation', 'Les deux parties confirment le début de la prestation dans l''app.', 4),
((SELECT id FROM formation_modules WHERE titre = 'Relation client'), 'rappel', 'Rappel 1h avant la fin', '1h avant la fin prévue, vous recevez un rappel pour prolonger ou terminer le service.', 5),
((SELECT id FROM formation_modules WHERE titre = 'Relation client'), 'fin', 'Fin et notation croisée', 'Le client et vous confirmez que la prestation est terminée. Vous notez le client, il vous note en retour.', 6),

-- Module 3: Comment ça fonctionne au salon
((SELECT id FROM formation_modules WHERE titre = 'Comment ça fonctionne au salon'), 'carte', 'Réservation via la carte', 'Le client choisit un partenaire sur la carte, consulte sa fiche complète, et sélectionne un créneau.', 1),
((SELECT id FROM formation_modules WHERE titre = 'Comment ça fonctionne au salon'), 'notification', 'Notification de RDV', 'Vous recevez une notification avec tous les détails : service, lieu, heure.', 2),
((SELECT id FROM formation_modules WHERE titre = 'Comment ça fonctionne au salon'), 'deplacement', 'Déplacement du client', 'Le jour J : le client se déplace vers le salon ou votre emplacement.', 3),
((SELECT id FROM formation_modules WHERE titre = 'Comment ça fonctionne au salon'), 'qr', 'Scan QR à l''arrivée', 'Le client présente son code QR ou numérique. Vous scannez → "Client arrivé".', 4),
((SELECT id FROM formation_modules WHERE titre = 'Comment ça fonctionne au salon'), 'identite', 'Vérification', 'Vérifiez l''identité et les conditions (cheveux lavés, venu seul, etc.).', 5),
((SELECT id FROM formation_modules WHERE titre = 'Comment ça fonctionne au salon'), 'start', 'Début de prestation', 'Les deux parties démarrent la prestation dans l''app → "En cours".', 6),
((SELECT id FROM formation_modules WHERE titre = 'Comment ça fonctionne au salon'), 'rappel', 'Rappel 1h avant la fin', 'Notification de rappel. Option de prolonger ou préparer la clôture.', 7),
((SELECT id FROM formation_modules WHERE titre = 'Comment ça fonctionne au salon'), 'fin', 'Prestation terminée', 'Vous confirmez tous les deux → "Terminé".', 8),
((SELECT id FROM formation_modules WHERE titre = 'Comment ça fonctionne au salon'), 'etoiles', 'Notation croisée', 'Vous notez le client (ponctualité, conditions). Le client vous note (qualité, propreté, professionnalisme).', 9),
((SELECT id FROM formation_modules WHERE titre = 'Comment ça fonctionne au salon'), 'paiement', 'Avis Google + Commission', 'Le client laisse un avis Google. 3 SMS post-RDV envoyés. Commission : 50% au salon, 75% ailleurs.', 10),

-- Module 4: Hygiène et professionnalisme
((SELECT id FROM formation_modules WHERE titre = 'Hygiène et professionnalisme'), 'desinfection', 'Désinfection obligatoire', 'Désinfectez votre matériel entre chaque client — c''est obligatoire, pas optionnel.', 1),
((SELECT id FROM formation_modules WHERE titre = 'Hygiène et professionnalisme'), 'tenue', 'Tenue professionnelle', 'Portez une tenue professionnelle propre. Le tablier Kadio est obligatoire lors de tous les services.', 2),
((SELECT id FROM formation_modules WHERE titre = 'Hygiène et professionnalisme'), 'kit', 'Kit complet', 'Votre kit doit toujours contenir : matériel propre, désinfectant, tablier, peigne personnel.', 3),
((SELECT id FROM formation_modules WHERE titre = 'Hygiène et professionnalisme'), 'domicile', 'Service à domicile', 'Si vous vous déplacez chez un client, demandez poliment un espace propre et dégagé pour travailler.', 4);

-- ══════════════════════════════════════════════════════════════════════════════
-- 6. QUIZ QUESTIONS — FOR CANDIDATS (Module 1: Standards Kadio)
-- ══════════════════════════════════════════════════════════════════════════════

INSERT INTO quiz_questions (module_id, question, reponses, correcte, ordre) VALUES
((SELECT id FROM formation_modules WHERE titre = 'Standards Kadio'), 'Quelle est la mission principale de Kadio ?', '["Vendre des produits capillaires", "Connecter les clients afro à des coiffeurs certifiés", "Former des coiffeurs en école", "Proposer des abonnements de streaming"]', 1, 1),
((SELECT id FROM formation_modules WHERE titre = 'Standards Kadio'), 'Quel est le délai minimal pour annuler un RDV sans pénalité ?', '["1h avant", "6h avant", "24h avant", "48h avant"]', 2, 2),
((SELECT id FROM formation_modules WHERE titre = 'Standards Kadio'), 'Qu''est-ce que le code QR Kadio ?', '["Un code de réduction", "Un identifiant unique de réservation scanné à l''arrivée", "Un code de parrainage", "Un code d''accès au salon"]', 1, 3),
((SELECT id FROM formation_modules WHERE titre = 'Standards Kadio'), 'Quel pourcentage de commission reçoit un partenaire pour son propre client ?', '["50%", "60%", "72%", "80%"]', 2, 4),
((SELECT id FROM formation_modules WHERE titre = 'Standards Kadio'), 'Quels sont les niveaux de partenariat Kadio ?', '["Bronze, Argent, Or", "Débutant, Confirmé, Expert", "Partenaire, Certifié, Élite, Ambassadeur", "Standard, Premium, VIP"]', 2, 5);

-- Quiz for Module 2: Relation client
INSERT INTO quiz_questions (module_id, question, reponses, correcte, ordre) VALUES
((SELECT id FROM formation_modules WHERE titre = 'Relation client'), 'Combien de temps avant le RDV doit-on confirmer ?', '["1h avant", "6h avant", "12h avant", "24h avant"]', 3, 1),
((SELECT id FROM formation_modules WHERE titre = 'Relation client'), 'Que faire si un client est en retard de plus de 15 min ?', '["Annuler sans préavis", "Attendre indéfiniment", "Contacter via l''app Kadio", "Facturer des frais supplémentaires"]', 2, 2),
((SELECT id FROM formation_modules WHERE titre = 'Relation client'), 'Comment gérer une cliente insatisfaite ?', '["Ignorer la plainte", "Argumenter pour défendre ton travail", "Écouter, proposer une solution, contacter Kadio si besoin", "Rembourser immédiatement sans discussion"]', 2, 3),
((SELECT id FROM formation_modules WHERE titre = 'Relation client'), 'Quel est le délai de réponse attendu pour un message client ?', '["30 minutes", "1h maximum", "2h maximum", "24h maximum"]', 2, 4),
((SELECT id FROM formation_modules WHERE titre = 'Relation client'), 'Que faire si tu dois annuler un RDV ?', '["Envoyer un message WhatsApp personnel", "Prévenir au moins 24h via l''app Kadio", "Annuler le matin même", "Ne rien faire et espérer que le client comprend"]', 1, 5);

-- Quiz for Module 3: Comment ça fonctionne au salon
INSERT INTO quiz_questions (module_id, question, reponses, correcte, ordre) VALUES
((SELECT id FROM formation_modules WHERE titre = 'Comment ça fonctionne au salon'), 'Que doit faire le client à son arrivée chez la coiffeuse ?', '["Rien, la coiffeuse le reconnaît", "Présenter son code QR ou son code numérique pour validation", "Envoyer un SMS à Kadio", "Montrer sa carte d''identité"]', 1, 1),
((SELECT id FROM formation_modules WHERE titre = 'Comment ça fonctionne au salon'), 'Que vérifie la coiffeuse après avoir scanné le code QR ?', '["Uniquement le nom du client", "L''identité, le service réservé et si les conditions sont respectées", "Le montant du paiement", "L''heure d''arrivée seulement"]', 1, 2),
((SELECT id FROM formation_modules WHERE titre = 'Comment ça fonctionne au salon'), 'Qui confirme le début de la prestation dans l''app ?', '["Seulement la coiffeuse", "Seulement le client", "Les deux — le client et la coiffeuse", "Le système automatiquement"]', 2, 3),
((SELECT id FROM formation_modules WHERE titre = 'Comment ça fonctionne au salon'), 'Que se passe-t-il 1h avant la fin prévue de la prestation ?', '["Le paiement est prélevé", "Un rappel est envoyé pour prolonger ou terminer le service", "Le RDV est annulé", "Rien de particulier"]', 1, 4),
((SELECT id FROM formation_modules WHERE titre = 'Comment ça fonctionne au salon'), 'Quelle est la commission au salon vs les autres modes ?', '["50% partout", "75% partout", "50% au salon, 75% pour les autres modes", "80% au salon, 60% ailleurs"]', 2, 5);

-- Quiz for Module 4: Hygiène et professionnalisme
INSERT INTO quiz_questions (module_id, question, reponses, correcte, ordre) VALUES
((SELECT id FROM formation_modules WHERE titre = 'Hygiène et professionnalisme'), 'À quelle fréquence minimum faut-il désinfecter son matériel ?', '["Une fois par semaine", "Entre chaque client", "Une fois par jour", "Une fois par mois"]', 1, 1),
((SELECT id FROM formation_modules WHERE titre = 'Hygiène et professionnalisme'), 'Que doit-on porter lors d''un service à domicile ?', '["Des vêtements de ville", "Une tenue professionnelle propre", "Un uniforme Kadio obligatoire", "Aucune obligation"]', 1, 2),
((SELECT id FROM formation_modules WHERE titre = 'Hygiène et professionnalisme'), 'Que faire si le domicile client est en désordre ?', '["Refuser d''entrer", "Nettoyer avant de commencer", "Demander poliment un espace propre pour travailler", "Ignorer et commencer quand même"]', 2, 3),
((SELECT id FROM formation_modules WHERE titre = 'Hygiène et professionnalisme'), 'Le tablier Kadio est-il obligatoire ?', '["Non, au choix du partenaire", "Oui, lors de tous les services", "Seulement au salon", "Seulement lors des événements"]', 1, 4),
((SELECT id FROM formation_modules WHERE titre = 'Hygiène et professionnalisme'), 'Quels produits doivent toujours être dans ton kit ?', '["Uniquement les ciseaux", "Matériel propre, désinfectant, tablier, peigne personnel", "Produits de couleur", "Un miroir"]', 1, 5);

-- ══════════════════════════════════════════════════════════════════════════════
-- 7. FORMATION MODULES — FOR PARTENAIRES (Experienced stylists)
-- ══════════════════════════════════════════════════════════════════════════════

INSERT INTO formation_modules (titre, description, duree_minutes, icon, type, ordre) VALUES
('Utiliser l''app Kadio', 'Maîtrisez toutes les fonctionnalités de l''application : profil, RDV, scanner, portefeuille et notifications.', 25, '📱', 'partenaire', 1),
('Commissions et niveaux', 'Comprendre le système de rémunération, les commissions et les niveaux de partenariat Kadio.', 20, '💰', 'partenaire', 2),
('Livraison et déplacement', 'Protocoles pour les services à domicile, en studio et au salon. Organisation et ponctualité.', 20, '🚗', 'partenaire', 3),
('Standards et relation client', 'Les règles d''or Kadio : accueil, communication, gestion des attentes et professionnalisme.', 25, '🤝', 'partenaire', 4),
('Hygiène et image professionnelle', 'Normes sanitaires, présentation personnelle, matériel et espace de travail pour chaque service.', 20, '✨', 'partenaire', 5),
('Marketing et visibilité', 'Comment développer votre clientèle via Kadio : avis Google, réseaux sociaux et fidélisation.', 20, '📈', 'partenaire', 6);

-- ══════════════════════════════════════════════════════════════════════════════
-- 8. FORMATION MODULES — FOR FOURNISSEURS (Suppliers)
-- ══════════════════════════════════════════════════════════════════════════════

INSERT INTO formation_modules (titre, description, duree_minutes, icon, type, ordre) VALUES
('Gestion du catalogue', 'Comment ajouter, modifier et organiser vos produits sur la plateforme Kadio.', 20, '📦', 'fournisseur', 1),
('Commandes et livraisons', 'Processus de réception, préparation et livraison des commandes passées via Kadio.', 25, '🚚', 'fournisseur', 2),
('Paiements et facturation', 'Comprendre le cycle de paiement, les commissions Kadio et la facturation.', 20, '💳', 'fournisseur', 3),
('Standards qualité Kadio', 'Normes de qualité des produits, emballage, étiquetage et conditions de partenariat.', 25, '⭐', 'fournisseur', 4);

-- ══════════════════════════════════════════════════════════════════════════════
-- 9. FORMATION ETAPES — FOR PARTENAIRES
-- ══════════════════════════════════════════════════════════════════════════════

INSERT INTO formation_etapes (module_id, icon, titre, description, ordre) VALUES
-- Module 1: Utiliser l'app Kadio
((SELECT id FROM formation_modules WHERE titre = 'Utiliser l''app Kadio'), 'app_profil', 'Votre profil partenaire', 'Complétez votre fiche : photo, bio, spécialités, modes de travail et langues parlées. Un profil complet = plus de visibilité.', 1),
((SELECT id FROM formation_modules WHERE titre = 'Utiliser l''app Kadio'), 'app_dispo', 'Gérer vos disponibilités', 'Définissez vos créneaux disponibles dans l''app. Activez/désactivez votre statut "en ligne" en un clic.', 2),
((SELECT id FROM formation_modules WHERE titre = 'Utiliser l''app Kadio'), 'notification', 'Notifications de RDV', 'Vous recevez une notification pour chaque nouvelle réservation. Confirmez ou proposez un autre créneau sous 2h.', 3),
((SELECT id FROM formation_modules WHERE titre = 'Utiliser l''app Kadio'), 'qr', 'Scanner le client', 'À l''arrivée du client, scannez son code QR ou entrez son code numérique pour valider sa présence.', 4),
((SELECT id FROM formation_modules WHERE titre = 'Utiliser l''app Kadio'), 'app_wallet', 'Votre portefeuille', 'Suivez vos gains en temps réel. Demandez un virement vers votre compte bancaire à tout moment.', 5),

-- Module 2: Commissions et niveaux
((SELECT id FROM formation_modules WHERE titre = 'Commissions et niveaux'), 'commission_salon', 'Commission au salon', 'Au salon Kadio, vous touchez 50% du montant du service. Le salon fournit l''espace, le matériel de base et la clientèle.', 1),
((SELECT id FROM formation_modules WHERE titre = 'Commissions et niveaux'), 'commission_autre', 'Commission hors salon', 'À domicile ou dans votre studio, vous touchez 75% du montant. Vous gérez votre espace et votre matériel.', 2),
((SELECT id FROM formation_modules WHERE titre = 'Commissions et niveaux'), 'niveaux', '4 niveaux de partenariat', 'Partenaire → Certifié → Élite → Ambassadeur. Chaque niveau débloque plus de visibilité et d''avantages.', 3),
((SELECT id FROM formation_modules WHERE titre = 'Commissions et niveaux'), 'progression', 'Comment progresser', 'Votre note moyenne, nombre de services, régularité et avis Google déterminent votre progression. Maintenez 4.5+ étoiles.', 4),
((SELECT id FROM formation_modules WHERE titre = 'Commissions et niveaux'), 'paiement', 'Cycle de paiement', 'Les virements sont traités chaque semaine. Minimum de retrait : 50$. Vous choisissez votre méthode (Interac ou virement bancaire).', 5);

-- ══════════════════════════════════════════════════════════════════════════════
-- 10. FORMATION ETAPES — FOR FOURNISSEURS
-- ══════════════════════════════════════════════════════════════════════════════

INSERT INTO formation_etapes (module_id, icon, titre, description, ordre) VALUES
-- Module 1: Gestion du catalogue
((SELECT id FROM formation_modules WHERE titre = 'Gestion du catalogue'), 'catalogue_ajout', 'Ajouter un produit', 'Renseignez le nom, la description, le prix, les photos et la catégorie. Des fiches complètes génèrent plus de commandes.', 1),
((SELECT id FROM formation_modules WHERE titre = 'Gestion du catalogue'), 'catalogue_photo', 'Photos de qualité', 'Ajoutez au minimum 2 photos par produit : une vue d''ensemble et un détail. Fond neutre, bonne lumière, haute résolution.', 2),
((SELECT id FROM formation_modules WHERE titre = 'Gestion du catalogue'), 'catalogue_prix', 'Politique de prix', 'Fixez des prix compétitifs. Kadio affiche les prix TTC. Vous pouvez créer des promotions temporaires depuis votre espace.', 3),
((SELECT id FROM formation_modules WHERE titre = 'Gestion du catalogue'), 'catalogue_stock', 'Gestion des stocks', 'Mettez à jour vos stocks en temps réel. Un produit en rupture est automatiquement masqué de la vitrine.', 4);

-- ══════════════════════════════════════════════════════════════════════════════
-- 11. SMS TEMPLATES (for reference — typically managed in code)
-- ══════════════════════════════════════════════════════════════════════════════

-- This table should be populated as needed by the application
-- SMS templates are typically hardcoded in the application layer

-- ══════════════════════════════════════════════════════════════════════════════
-- COMMENTS & DOCUMENTATION
-- ══════════════════════════════════════════════════════════════════════════════

COMMENT ON TABLE users IS 'Core user accounts - all personas (clients, partners, employees, suppliers, candidates, admins)';
COMMENT ON TABLE roles IS 'User role assignments (many-to-many relationship for multi-role support)';
COMMENT ON TABLE clients IS 'Client profiles with subscription and loyalty data';
COMMENT ON TABLE partenaires IS 'Partner profiles (stylists/service providers) with wallet and metrics';
COMMENT ON TABLE employes IS 'Salon employee profiles';
COMMENT ON TABLE fournisseurs IS 'Product/supply supplier profiles';
COMMENT ON TABLE candidatures IS 'Partner/employee applications with progression tracking';
COMMENT ON TABLE services IS 'Hair services catalog with pricing for different locations';
COMMENT ON TABLE rendez_vous IS 'Appointments with payment and review data';
COMMENT ON TABLE plans IS 'Subscription plan definitions';
COMMENT ON TABLE abonnements IS 'Client subscription instances';
COMMENT ON TABLE produits IS 'Products from suppliers';
COMMENT ON TABLE commandes IS 'Orders placed with suppliers';
COMMENT ON TABLE transactions IS 'All financial transactions in the system';
COMMENT ON TABLE virements IS 'Partner payouts/transfers';
COMMENT ON TABLE chaises IS 'Salon chair rental inventory';
COMMENT ON TABLE reservations_chaise IS 'Chair bookings by partners';
COMMENT ON TABLE articles_blog IS 'Blog content';
COMMENT ON TABLE sms_logs IS 'SMS sending logs for auditing';
COMMENT ON TABLE formation_modules IS 'Training modules for three user types (candidat, partenaire, fournisseur)';
COMMENT ON TABLE formation_etapes IS 'Steps within training modules';
COMMENT ON TABLE formation_progression IS 'User progress tracking in formations';
COMMENT ON TABLE quiz_questions IS 'Quiz questions for training modules';
COMMENT ON TABLE salon_config IS 'Configuration and settings (commissions, hours, policies, etc.)';
COMMENT ON TABLE parrainage IS 'Referral program tracking';
COMMENT ON TABLE cartes_cadeaux IS 'Gift card system';
COMMENT ON TABLE tirage IS 'Lottery/giveaway definitions';
COMMENT ON TABLE tickets_tirage IS 'Lottery ticket purchases';

-- ══════════════════════════════════════════════════════════════════════════════
-- END OF SEED DATA
-- ══════════════════════════════════════════════════════════════════════════════
