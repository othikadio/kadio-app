-- ============================================================
-- KADIO — Migration 001 : Toutes les tables
-- ============================================================
-- Ordre de création respectant les contraintes FK :
-- users → user_roles → clients → partenaires → employes →
-- fournisseurs → produits → commandes_materiel →
-- chaises → reservations_chaises → services → rendez_vous →
-- plans_abonnement → abonnements → portefeuille_transactions →
-- bonus_conversions → candidatures → formation_modules →
-- formation_progression → articles → sms_logs
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- pour geo (optionnel)

-- ─── ENUM helpers ────────────────────────────────────────────
-- On utilise text + contraintes CHECK pour la flexibilité

-- ============================================================
-- 1. USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  telephone     text UNIQUE NOT NULL,
  prenom        text,
  nom           text,
  email         text,
  photo_url     text,
  langue        text DEFAULT 'fr',
  created_at    timestamptz DEFAULT now()
);

CREATE INDEX idx_users_telephone ON users(telephone);

-- ============================================================
-- 2. USER_ROLES
-- ============================================================
CREATE TABLE IF NOT EXISTS user_roles (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role       text NOT NULL CHECK (role IN ('client','partenaire','employe','fournisseur','admin','candidat')),
  statut     text NOT NULL DEFAULT 'actif' CHECK (statut IN ('actif','suspendu','inactif')),
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, role)
);

CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role);

-- ============================================================
-- 3. CLIENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS clients (
  id                  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_abonne           boolean DEFAULT false,
  abonnement_id       uuid, -- FK ajoutée après abonnements
  no_show_count       integer DEFAULT 0,
  is_bloque           boolean DEFAULT false,
  motif_blocage       text,
  credits_parrainage  integer DEFAULT 0,
  code_parrainage     text UNIQUE,
  portal_pin          text,
  square_customer_id  text,
  created_at          timestamptz DEFAULT now()
);

CREATE INDEX idx_clients_user ON clients(user_id);
CREATE INDEX idx_clients_code_parrainage ON clients(code_parrainage);

-- ============================================================
-- 4. PARTENAIRES
-- ============================================================
CREATE TABLE IF NOT EXISTS partenaires (
  id                      uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                 uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code_partenaire         text UNIQUE, -- KADIO-PRENOM-001
  statut                  text DEFAULT 'candidat' CHECK (statut IN ('candidat','actif','suspendu','inactif')),
  niveau                  text DEFAULT 'partenaire' CHECK (niveau IN ('partenaire','certifie','elite','ambassadeur')),
  certificat_actif        boolean DEFAULT false,
  certificat_date         timestamptz,
  note_moyenne            numeric(3,2) DEFAULT 0,
  total_services          integer DEFAULT 0,
  specialites             text[],
  modes_travail           text[], -- domicile | deplacement_voiture | deplacement_transport | salon_kadio
  a_voiture               boolean DEFAULT false,
  langue_preferee         text DEFAULT 'fr',
  portefeuille_solde      numeric(10,2) DEFAULT 0,
  portefeuille_total_gagne numeric(10,2) DEFAULT 0,
  stripe_account_id       text,
  square_account_id       text,
  is_disponible           boolean DEFAULT true,
  mode_vacances           boolean DEFAULT false,
  mode_vacances_debut     date,
  mode_vacances_fin       date,
  adresse                 text,
  ville                   text,
  code_postal             text,
  latitude                numeric(10,7),
  longitude               numeric(10,7),
  notes_admin             text,
  created_at              timestamptz DEFAULT now()
);

CREATE INDEX idx_partenaires_user ON partenaires(user_id);
CREATE INDEX idx_partenaires_statut ON partenaires(statut);
CREATE INDEX idx_partenaires_disponible ON partenaires(is_disponible);
CREATE INDEX idx_partenaires_geo ON partenaires(latitude, longitude);

-- ============================================================
-- 5. EMPLOYES
-- ============================================================
CREATE TABLE IF NOT EXISTS employes (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_salon   text DEFAULT 'coiffeur' CHECK (role_salon IN ('coiffeur','barbier','estheticienne','manager')),
  specialites  text[],
  couleur_agenda text DEFAULT '#D4AF37',
  pin_acces    text,
  actif        boolean DEFAULT true,
  created_at   timestamptz DEFAULT now()
);

CREATE INDEX idx_employes_user ON employes(user_id);
CREATE INDEX idx_employes_actif ON employes(actif);

-- ============================================================
-- 6. FOURNISSEURS
-- ============================================================
CREATE TABLE IF NOT EXISTS fournisseurs (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        uuid REFERENCES users(id) ON DELETE SET NULL,
  nom_entreprise text NOT NULL,
  contact_nom    text,
  telephone      text,
  email          text,
  site_web       text,
  categories     text[], -- meches | produits | accessoires | equipements
  actif          boolean DEFAULT true,
  created_at     timestamptz DEFAULT now()
);

CREATE INDEX idx_fournisseurs_actif ON fournisseurs(actif);

-- ============================================================
-- 7. PRODUITS
-- ============================================================
CREATE TABLE IF NOT EXISTS produits (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  fournisseur_id    uuid NOT NULL REFERENCES fournisseurs(id) ON DELETE CASCADE,
  nom               text NOT NULL,
  description       text,
  categorie         text,
  prix_fournisseur  numeric(10,2),
  marge_kadio       numeric(10,2) DEFAULT 0,
  prix_partenaire   numeric(10,2), -- prix_fournisseur + marge_kadio
  stock_disponible  integer DEFAULT 0,
  photo_url         text,
  actif             boolean DEFAULT true,
  created_at        timestamptz DEFAULT now()
);

CREATE INDEX idx_produits_fournisseur ON produits(fournisseur_id);
CREATE INDEX idx_produits_categorie ON produits(categorie);
CREATE INDEX idx_produits_actif ON produits(actif);

-- ============================================================
-- 8. COMMANDES_MATERIEL
-- ============================================================
CREATE TABLE IF NOT EXISTS commandes_materiel (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  partenaire_id     uuid NOT NULL REFERENCES partenaires(id),
  fournisseur_id    uuid NOT NULL REFERENCES fournisseurs(id),
  items             jsonb NOT NULL DEFAULT '[]', -- [{produit_id, nom, quantite, prix_unitaire}]
  montant_total     numeric(10,2) NOT NULL,
  statut            text DEFAULT 'en_attente' CHECK (statut IN ('en_attente','confirmee','preparee','expediee','livree','annulee')),
  numero_suivi      text,
  adresse_livraison text,
  paiement_methode  text CHECK (paiement_methode IN ('portefeuille','carte')),
  created_at        timestamptz DEFAULT now()
);

CREATE INDEX idx_commandes_partenaire ON commandes_materiel(partenaire_id);
CREATE INDEX idx_commandes_statut ON commandes_materiel(statut);

-- ============================================================
-- 9. CHAISES
-- ============================================================
CREATE TABLE IF NOT EXISTS chaises (
  id     uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero integer NOT NULL,
  nom    text, -- ex: Chaise 1, Chaise VIP
  actif  boolean DEFAULT true
);

-- ============================================================
-- 10. RESERVATIONS_CHAISES
-- ============================================================
CREATE TABLE IF NOT EXISTS reservations_chaises (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  chaise_id      uuid NOT NULL REFERENCES chaises(id),
  partenaire_id  uuid NOT NULL REFERENCES partenaires(id),
  date           date NOT NULL,
  heure_debut    time NOT NULL,
  heure_fin      time NOT NULL,
  statut         text DEFAULT 'confirmee' CHECK (statut IN ('confirmee','annulee','terminee')),
  created_at     timestamptz DEFAULT now(),
  UNIQUE (chaise_id, date, heure_debut)
);

CREATE INDEX idx_resas_chaises_date ON reservations_chaises(date);
CREATE INDEX idx_resas_chaises_partenaire ON reservations_chaises(partenaire_id);

-- ============================================================
-- 11. SERVICES
-- ============================================================
CREATE TABLE IF NOT EXISTS services (
  id                               uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom                              text NOT NULL,
  categorie                        text CHECK (categorie IN ('tresses','locs','barbier','kids','soins','coloration')),
  duree                            integer NOT NULL, -- minutes
  prix_salon                       numeric(10,2) NOT NULL,
  prix_domicile                    numeric(10,2), -- prix_salon - 25%
  prix_deplacement                 numeric(10,2), -- prix_salon - 15%
  commission_employe               numeric(10,2), -- 50% prix selon lieu
  commission_partenaire_salon      numeric(10,2), -- montant fixe barème
  commission_partenaire_domicile   numeric(10,2), -- montant fixe barème
  commission_partenaire_deplacement numeric(10,2), -- montant fixe barème
  require_deposit                  boolean DEFAULT true,
  deposit_percentage               integer DEFAULT 20,
  actif                            boolean DEFAULT true,
  created_at                       timestamptz DEFAULT now()
);

CREATE INDEX idx_services_categorie ON services(categorie);
CREATE INDEX idx_services_actif ON services(actif);

-- ============================================================
-- 12. RENDEZ_VOUS
-- ============================================================
CREATE TABLE IF NOT EXISTS rendez_vous (
  id                           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id                    uuid NOT NULL REFERENCES clients(id),
  prestataire_type             text NOT NULL CHECK (prestataire_type IN ('employe','partenaire')),
  employe_id                   uuid REFERENCES employes(id),
  partenaire_id                uuid REFERENCES partenaires(id),
  service_id                   uuid REFERENCES services(id),
  service_nom                  text,
  lieu                         text CHECK (lieu IN ('salon_kadio','domicile_partenaire','deplacement')),
  date                         date NOT NULL,
  heure_debut                  time NOT NULL,
  heure_fin                    time,
  duree                        integer, -- minutes
  prix_client                  numeric(10,2),
  prix_prestataire             numeric(10,2), -- montant fixe barème
  frais_deplacement            numeric(10,2) DEFAULT 0,
  statut                       text DEFAULT 'confirme' CHECK (statut IN ('confirme','en_cours','termine','annule','no_show')),
  qr_code                      text UNIQUE,
  client_arrive_at             timestamptz,
  service_debut_at             timestamptz,
  service_fin_at               timestamptz,
  note_client_sur_prestataire  integer CHECK (note_client_sur_prestataire BETWEEN 1 AND 5),
  note_prestataire_sur_client  integer CHECK (note_prestataire_sur_client BETWEEN 1 AND 5),
  commentaire_client           text,
  commentaire_prestataire      text,
  source_client                text DEFAULT 'kadio',
  deposit_amount               numeric(10,2) DEFAULT 0,
  deposit_paid                 boolean DEFAULT false,
  booking_source               text DEFAULT 'web' CHECK (booking_source IN ('web','app','walk_in','phone')),
  created_at                   timestamptz DEFAULT now()
);

CREATE INDEX idx_rdv_client ON rendez_vous(client_id);
CREATE INDEX idx_rdv_employe ON rendez_vous(employe_id);
CREATE INDEX idx_rdv_partenaire ON rendez_vous(partenaire_id);
CREATE INDEX idx_rdv_date ON rendez_vous(date);
CREATE INDEX idx_rdv_statut ON rendez_vous(statut);
CREATE INDEX idx_rdv_qr ON rendez_vous(qr_code);

-- ============================================================
-- 13. PLANS_ABONNEMENT
-- ============================================================
CREATE TABLE IF NOT EXISTS plans_abonnement (
  id               uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom              text NOT NULL,
  categorie        text,
  prix_mensuel     numeric(10,2) NOT NULL,
  services_inclus  text[],
  actif            boolean DEFAULT true,
  created_at       timestamptz DEFAULT now()
);

-- ============================================================
-- 14. ABONNEMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS abonnements (
  id                      uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id               uuid NOT NULL REFERENCES clients(id),
  plan_id                 uuid REFERENCES plans_abonnement(id),
  plan_nom                text,
  prix_mensuel            numeric(10,2),
  statut                  text DEFAULT 'actif' CHECK (statut IN ('actif','suspendu','annule','expire')),
  square_subscription_id  text,
  date_debut              date,
  date_renouvellement     date,
  visits_used_this_month  integer DEFAULT 0,
  auto_renewal            boolean DEFAULT true,
  created_at              timestamptz DEFAULT now()
);

CREATE INDEX idx_abonnements_client ON abonnements(client_id);
CREATE INDEX idx_abonnements_statut ON abonnements(statut);
CREATE INDEX idx_abonnements_renouvellement ON abonnements(date_renouvellement);

-- FK circulaire clients ↔ abonnements : ajout après coup
ALTER TABLE clients ADD CONSTRAINT fk_clients_abonnement
  FOREIGN KEY (abonnement_id) REFERENCES abonnements(id) ON DELETE SET NULL;

-- ============================================================
-- 15. PORTEFEUILLE_TRANSACTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS portefeuille_transactions (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  partenaire_id  uuid NOT NULL REFERENCES partenaires(id),
  type           text NOT NULL CHECK (type IN (
    'credit_service','credit_bonus','retrait_virement',
    'retrait_salon','deduction_materiel'
  )),
  montant        numeric(10,2) NOT NULL,
  description    text,
  rdv_id         uuid REFERENCES rendez_vous(id),
  statut         text DEFAULT 'complete' CHECK (statut IN ('pending','complete','echec')),
  created_at     timestamptz DEFAULT now()
);

CREATE INDEX idx_ptrans_partenaire ON portefeuille_transactions(partenaire_id);
CREATE INDEX idx_ptrans_type ON portefeuille_transactions(type);

-- ============================================================
-- 16. BONUS_CONVERSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS bonus_conversions (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  partenaire_id  uuid NOT NULL REFERENCES partenaires(id),
  abonnement_id  uuid REFERENCES abonnements(id),
  client_nom     text,
  forfait_nom    text,
  montant_bonus  numeric(10,2),
  statut         text DEFAULT 'verse' CHECK (statut IN ('verse','en_attente','annule')),
  created_at     timestamptz DEFAULT now()
);

CREATE INDEX idx_bonus_partenaire ON bonus_conversions(partenaire_id);

-- ============================================================
-- 17. CANDIDATURES
-- ============================================================
CREATE TABLE IF NOT EXISTS candidatures (
  id                       uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  prenom                   text NOT NULL,
  nom                      text NOT NULL,
  telephone                text NOT NULL,
  email                    text,
  ville                    text,
  langue                   text DEFAULT 'fr',
  specialites              text[],
  experience_annees        integer DEFAULT 0,
  modes_travail_preferes   text[],
  a_voiture                boolean DEFAULT false,
  disponibilites           text[],
  motivation               text,
  lien_instagram           text,
  lien_tiktok              text,
  source_decouverte        text,
  statut                   text DEFAULT 'en_attente' CHECK (statut IN ('en_attente','en_revision','acceptee','refusee')),
  notes_admin              text,
  created_at               timestamptz DEFAULT now()
);

CREATE INDEX idx_candidatures_statut ON candidatures(statut);
CREATE INDEX idx_candidatures_telephone ON candidatures(telephone);

-- ============================================================
-- 18. FORMATION_MODULES
-- ============================================================
CREATE TABLE IF NOT EXISTS formation_modules (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  titre       text NOT NULL,
  description text,
  video_url   text,
  ordre       integer NOT NULL,
  actif       boolean DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

-- ============================================================
-- 19. FORMATION_PROGRESSION
-- ============================================================
CREATE TABLE IF NOT EXISTS formation_progression (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  partenaire_id  uuid NOT NULL REFERENCES partenaires(id) ON DELETE CASCADE,
  module_id      uuid NOT NULL REFERENCES formation_modules(id) ON DELETE CASCADE,
  score_quiz     integer,
  complete       boolean DEFAULT false,
  completed_at   timestamptz,
  UNIQUE (partenaire_id, module_id)
);

CREATE INDEX idx_formation_prog_partenaire ON formation_progression(partenaire_id);

-- ============================================================
-- 20. ARTICLES (blog)
-- ============================================================
CREATE TABLE IF NOT EXISTS articles (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  titre      text NOT NULL,
  slug       text UNIQUE NOT NULL,
  extrait    text,
  contenu    text,
  categorie  text CHECK (categorie IN ('communaute','conseils','partenaires','evenements','tutoriels')),
  image_url  text,
  auteur     text DEFAULT 'Kadio',
  publie     boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_publie ON articles(publie);
CREATE INDEX idx_articles_categorie ON articles(categorie);

-- ============================================================
-- 21. SMS_LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS sms_logs (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  destinataire text NOT NULL,
  message      text NOT NULL,
  template_id  text,
  statut       text DEFAULT 'simule' CHECK (statut IN ('envoye','echec','simule')),
  twilio_sid   text,
  created_at   timestamptz DEFAULT now()
);

CREATE INDEX idx_sms_logs_statut ON sms_logs(statut);
CREATE INDEX idx_sms_logs_date ON sms_logs(created_at);

-- ============================================================
-- 22. FRAIS_DEPLACEMENT (table de référence)
-- ============================================================
CREATE TABLE IF NOT EXISTS frais_deplacement (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  distance_min_km   integer NOT NULL,
  distance_max_km   integer NOT NULL,
  tarif_normal      numeric(10,2) NOT NULL,
  tarif_abonne      numeric(10,2) NOT NULL
);

-- ============================================================
-- 23. SALON_CONFIG
-- ============================================================
CREATE TABLE IF NOT EXISTS salon_config (
  id      uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  cle     text UNIQUE NOT NULL,
  valeur  text,
  updated_at timestamptz DEFAULT now()
);
