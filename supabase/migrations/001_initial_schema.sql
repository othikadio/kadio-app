-- ══════════════════════════════════════════════════════════════════════════════
-- KADIO SALON MANAGEMENT APP — SUPABASE INITIAL SCHEMA
-- ══════════════════════════════════════════════════════════════════════════════
-- Comprehensive database schema for the Kadio salon network platform
-- Includes user management, appointments, transactions, formations, and more

-- ──────────────────────────────────────────────────────────────────────────────
-- EXTENSIONS
-- ──────────────────────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ──────────────────────────────────────────────────────────────────────────────
-- 1. USERS TABLE — Core user accounts
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telephone TEXT UNIQUE NOT NULL,
  prenom TEXT NOT NULL,
  nom TEXT NOT NULL,
  email TEXT UNIQUE,
  langue TEXT DEFAULT 'fr',
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 2. ROLES TABLE — User role assignments (many-to-many)
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'client', 'partenaire', 'employe', 'candidat', 'fournisseur')),
  statut TEXT DEFAULT 'actif' CHECK (statut IN ('actif', 'suspendu', 'inactif')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, role)
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 3. CLIENTS TABLE — Client profiles (abonnés, points de fidélité)
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  is_abonne BOOLEAN DEFAULT FALSE,
  no_show_count INTEGER DEFAULT 0,
  is_bloque BOOLEAN DEFAULT FALSE,
  motif_blocage TEXT,
  credits_parrainage INTEGER DEFAULT 0,
  code_parrainage TEXT UNIQUE,
  portal_pin TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 4. PARTENAIRES TABLE — Partner profiles (stylists/service providers)
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS partenaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  code_partenaire TEXT UNIQUE,
  statut TEXT DEFAULT 'actif' CHECK (statut IN ('actif', 'suspendu', 'inactif')),
  niveau TEXT DEFAULT 'partenaire' CHECK (niveau IN ('partenaire', 'certifie', 'elite', 'ambassadeur')),
  certificat_actif BOOLEAN DEFAULT FALSE,
  note_moyenne NUMERIC(3,2) DEFAULT 0,
  total_services INTEGER DEFAULT 0,
  portefeuille_solde NUMERIC(10,2) DEFAULT 0,
  portefeuille_total_gagne NUMERIC(10,2) DEFAULT 0,
  is_disponible BOOLEAN DEFAULT TRUE,
  mode_vacances BOOLEAN DEFAULT FALSE,
  ville TEXT,
  couleur_agenda TEXT,
  specialites JSONB DEFAULT '[]',
  modes_travail JSONB DEFAULT '[]', -- ["salon", "domicile", "studio"]
  bio TEXT,
  tarif_base NUMERIC(8,2),
  frais_deplacement NUMERIC(8,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 5. EMPLOYES TABLE — Salon employees
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS employes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  role_salon TEXT NOT NULL, -- "coiffeur", "directeur", "receptionniste", etc.
  specialites JSONB DEFAULT '[]',
  couleur_agenda TEXT,
  pin_acces TEXT,
  actif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 6. FOURNISSEURS TABLE — Product/supply suppliers
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS fournisseurs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  nom_entreprise TEXT NOT NULL,
  actif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 7. CANDIDATURES TABLE — Partner/employee applications
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS candidatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telephone TEXT NOT NULL,
  prenom TEXT NOT NULL,
  nom TEXT NOT NULL,
  email TEXT,
  experience TEXT,
  specialites JSONB DEFAULT '[]',
  motivation TEXT,
  ville TEXT,
  statut TEXT DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'en_revision', 'accepte', 'refusee')),
  date_soumission TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_revision TIMESTAMP,
  date_acceptation TIMESTAMP,
  message_admin TEXT,
  formation_complete BOOLEAN DEFAULT FALSE,
  score_quiz INTEGER,
  note_entretien TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 8. SERVICES TABLE — Hair services offered
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL UNIQUE,
  categorie TEXT, -- "Tresses", "Locs", "Knotless", "Barbier", "Soin", etc.
  prix_salon NUMERIC(8,2) NOT NULL,
  prix_domicile NUMERIC(8,2) NOT NULL,
  duree_minutes INTEGER NOT NULL,
  actif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 9. RENDEZ_VOUS TABLE — Appointments
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS rendez_vous (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code_qr TEXT UNIQUE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  partenaire_id UUID REFERENCES partenaires(id) ON DELETE SET NULL,
  employe_id UUID REFERENCES employes(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE RESTRICT,
  service_nom TEXT, -- denormalized for quick access
  date_rdv DATE NOT NULL,
  heure_debut TIME NOT NULL,
  heure_fin TIME NOT NULL,
  lieu TEXT CHECK (lieu IN ('salon', 'domicile', 'studio')),
  statut TEXT DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'confirme', 'en_cours', 'termine', 'annule', 'no_show')),
  montant NUMERIC(10,2),
  commission_kadio NUMERIC(10,2),
  avis_note INTEGER CHECK (avis_note >= 1 AND avis_note <= 5),
  avis_texte TEXT,
  adresse TEXT,
  stripe_payment_intent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 10. PLANS TABLE — Subscription plans (abonnements)
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL UNIQUE,
  prix NUMERIC(8,2) NOT NULL,
  periode TEXT NOT NULL DEFAULT 'mensuel', -- "mensuel", "trimestriel", "annuel"
  features JSONB DEFAULT '[]', -- ["1 session knotless", "Consultation style", etc.]
  stripe_price_id TEXT,
  actif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 11. ABONNEMENTS TABLE — Client subscriptions
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS abonnements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE RESTRICT,
  statut TEXT DEFAULT 'actif' CHECK (statut IN ('actif', 'suspendu', 'resilie', 'en_attente')),
  date_debut DATE NOT NULL,
  date_fin DATE,
  date_prochain_renouvellement DATE,
  sessions_restantes INTEGER,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 12. PRODUITS TABLE — Products from suppliers
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS produits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fournisseur_id UUID NOT NULL REFERENCES fournisseurs(id) ON DELETE CASCADE,
  nom TEXT NOT NULL,
  categorie TEXT, -- "Mèches", "Produits", "Accessoires", "Équipements"
  prix NUMERIC(8,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  actif BOOLEAN DEFAULT TRUE,
  description TEXT,
  photos JSONB DEFAULT '[]', -- URLs to product images
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 13. COMMANDES TABLE — Orders for products
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS commandes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero TEXT UNIQUE,
  partenaire_id UUID REFERENCES partenaires(id) ON DELETE SET NULL,
  fournisseur_id UUID NOT NULL REFERENCES fournisseurs(id) ON DELETE RESTRICT,
  articles JSONB NOT NULL, -- [{nom, qte, prix_unit}, ...]
  total NUMERIC(10,2) NOT NULL,
  statut TEXT DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'confirmee', 'preparee', 'expediee', 'livree')),
  date_commande DATE NOT NULL,
  numero_suivi TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 14. TRANSACTIONS TABLE — All financial transactions
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- "abonnement", "rdv_salon", "rdv_domicile", "materiel", "virement", etc.
  source TEXT, -- "client", "partenaire", "fournisseur", "admin"
  montant NUMERIC(10,2) NOT NULL,
  commission_kadio NUMERIC(10,2) DEFAULT 0,
  description TEXT,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reference_id UUID,
  reference_type TEXT, -- "rdv", "abonnement", "commande", etc.
  statut TEXT DEFAULT 'recu' CHECK (statut IN ('recu', 'en_attente', 'refuse')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 15. VIREMENTS TABLE — Partner payouts
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS virements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partenaire_id UUID NOT NULL REFERENCES partenaires(id) ON DELETE CASCADE,
  montant NUMERIC(10,2) NOT NULL,
  statut TEXT DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'effectue', 'refusee')),
  date_demande TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_traite TIMESTAMP,
  methode TEXT, -- "Interac", "Virement bancaire"
  stripe_transfer_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 16. CHAISES TABLE — Salon chair rentals
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS chaises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID, -- Future: reference to salon table
  nom TEXT NOT NULL,
  tarif_jour NUMERIC(8,2),
  tarif_semaine NUMERIC(8,2),
  tarif_mois NUMERIC(8,2),
  couleur TEXT,
  actif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 17. RESERVATIONS_CHAISE TABLE — Chair bookings
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS reservations_chaise (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chaise_id UUID NOT NULL REFERENCES chaises(id) ON DELETE CASCADE,
  partenaire_id UUID NOT NULL REFERENCES partenaires(id) ON DELETE CASCADE,
  date_debut DATE NOT NULL,
  date_fin DATE NOT NULL,
  statut TEXT DEFAULT 'active' CHECK (statut IN ('active', 'annulee', 'expirée')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 18. ARTICLES_BLOG TABLE — Blog articles
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS articles_blog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre TEXT NOT NULL,
  slug TEXT UNIQUE,
  contenu TEXT,
  image_url TEXT,
  auteur TEXT,
  categorie TEXT,
  publie BOOLEAN DEFAULT FALSE,
  date_publication TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 19. SMS_LOGS TABLE — SMS tracking
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS sms_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destinataire TEXT NOT NULL,
  template_id TEXT,
  template_nom TEXT,
  contenu TEXT,
  statut TEXT DEFAULT 'envoye' CHECK (statut IN ('envoye', 'en_attente', 'echec')),
  date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 20. FORMATION_MODULES TABLE — Training modules
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS formation_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre TEXT NOT NULL,
  description TEXT,
  duree_minutes INTEGER,
  icon TEXT,
  type TEXT NOT NULL CHECK (type IN ('candidat', 'partenaire', 'fournisseur')),
  ordre INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 21. FORMATION_ETAPES TABLE — Steps within modules
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS formation_etapes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES formation_modules(id) ON DELETE CASCADE,
  icon TEXT,
  titre TEXT NOT NULL,
  description TEXT,
  ordre INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 22. FORMATION_PROGRESSION TABLE — User progress tracking
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS formation_progression (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES formation_modules(id) ON DELETE CASCADE,
  statut TEXT DEFAULT 'disponible' CHECK (statut IN ('verrouille', 'disponible', 'en_cours', 'complete')),
  score INTEGER,
  date_complete TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, module_id)
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 23. QUIZ_QUESTIONS TABLE — Training quiz questions
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES formation_modules(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  reponses JSONB NOT NULL, -- ["Réponse 1", "Réponse 2", "Réponse 3", "Réponse 4"]
  correcte INTEGER NOT NULL, -- index of correct answer (0-3)
  ordre INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 24. SALON_CONFIG TABLE — Salon configuration & settings
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS salon_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 25. PARRAINAGE TABLE — Referral tracking
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS parrainage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parrain_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  filleul_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  code_utilise TEXT,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  bonus_accorde NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(parrain_id, filleul_id)
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 26. CARTES_CADEAUX TABLE — Gift cards
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS cartes_cadeaux (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  montant NUMERIC(10,2) NOT NULL,
  solde_restant NUMERIC(10,2) NOT NULL,
  acheteur_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  beneficiaire_email TEXT,
  statut TEXT DEFAULT 'active' CHECK (statut IN ('active', 'epuisee', 'expiree')),
  date_achat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_expiration TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 27. TIRAGE TABLE — Giveaways/lotteries
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS tirage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre TEXT NOT NULL,
  description TEXT,
  date_tirage DATE NOT NULL,
  prix_ticket NUMERIC(8,2),
  lots JSONB DEFAULT '[]', -- [{nom, valeur, description}, ...]
  actif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 28. TICKETS_TIRAGE TABLE — Lottery tickets
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS tickets_tirage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tirage_id UUID NOT NULL REFERENCES tirage(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  numero TEXT UNIQUE NOT NULL,
  statut TEXT DEFAULT 'actif' CHECK (statut IN ('actif', 'gagnant', 'reclame')),
  date_achat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ══════════════════════════════════════════════════════════════════════════════
-- INDEXES — Performance optimization
-- ══════════════════════════════════════════════════════════════════════════════

CREATE INDEX idx_users_telephone ON users(telephone);
CREATE INDEX idx_users_email ON users(email);

CREATE INDEX idx_roles_user_id ON roles(user_id);
CREATE INDEX idx_roles_role ON roles(role);

CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_clients_is_bloque ON clients(is_bloque);

CREATE INDEX idx_partenaires_user_id ON partenaires(user_id);
CREATE INDEX idx_partenaires_niveau ON partenaires(niveau);
CREATE INDEX idx_partenaires_statut ON partenaires(statut);
CREATE INDEX idx_partenaires_ville ON partenaires(ville);

CREATE INDEX idx_employes_user_id ON employes(user_id);

CREATE INDEX idx_fournisseurs_user_id ON fournisseurs(user_id);

CREATE INDEX idx_candidatures_statut ON candidatures(statut);
CREATE INDEX idx_candidatures_date_soumission ON candidatures(date_soumission);

CREATE INDEX idx_services_actif ON services(actif);

CREATE INDEX idx_rendez_vous_client_id ON rendez_vous(client_id);
CREATE INDEX idx_rendez_vous_partenaire_id ON rendez_vous(partenaire_id);
CREATE INDEX idx_rendez_vous_employe_id ON rendez_vous(employe_id);
CREATE INDEX idx_rendez_vous_date_rdv ON rendez_vous(date_rdv);
CREATE INDEX idx_rendez_vous_statut ON rendez_vous(statut);
CREATE INDEX idx_rendez_vous_code_qr ON rendez_vous(code_qr);

CREATE INDEX idx_plans_actif ON plans(actif);

CREATE INDEX idx_abonnements_client_id ON abonnements(client_id);
CREATE INDEX idx_abonnements_statut ON abonnements(statut);

CREATE INDEX idx_produits_fournisseur_id ON produits(fournisseur_id);
CREATE INDEX idx_produits_actif ON produits(actif);
CREATE INDEX idx_produits_categorie ON produits(categorie);

CREATE INDEX idx_commandes_partenaire_id ON commandes(partenaire_id);
CREATE INDEX idx_commandes_fournisseur_id ON commandes(fournisseur_id);
CREATE INDEX idx_commandes_statut ON commandes(statut);

CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_reference_id ON transactions(reference_id);

CREATE INDEX idx_virements_partenaire_id ON virements(partenaire_id);
CREATE INDEX idx_virements_statut ON virements(statut);

CREATE INDEX idx_reservations_chaise_partenaire_id ON reservations_chaise(partenaire_id);
CREATE INDEX idx_reservations_chaise_date_debut ON reservations_chaise(date_debut);

CREATE INDEX idx_articles_blog_slug ON articles_blog(slug);
CREATE INDEX idx_articles_blog_publie ON articles_blog(publie);

CREATE INDEX idx_sms_logs_destinataire ON sms_logs(destinataire);
CREATE INDEX idx_sms_logs_date_envoi ON sms_logs(date_envoi);

CREATE INDEX idx_formation_modules_type ON formation_modules(type);

CREATE INDEX idx_formation_progression_user_id ON formation_progression(user_id);
CREATE INDEX idx_formation_progression_module_id ON formation_progression(module_id);
CREATE INDEX idx_formation_progression_statut ON formation_progression(statut);

CREATE INDEX idx_quiz_questions_module_id ON quiz_questions(module_id);

CREATE INDEX idx_parrainage_parrain_id ON parrainage(parrain_id);
CREATE INDEX idx_parrainage_filleul_id ON parrainage(filleul_id);

CREATE INDEX idx_cartes_cadeaux_code ON cartes_cadeaux(code);
CREATE INDEX idx_cartes_cadeaux_statut ON cartes_cadeaux(statut);

CREATE INDEX idx_tickets_tirage_tirage_id ON tickets_tirage(tirage_id);
CREATE INDEX idx_tickets_tirage_client_id ON tickets_tirage(client_id);

-- ══════════════════════════════════════════════════════════════════════════════
-- TRIGGERS — Auto-update timestamps
-- ══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_update_timestamp BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER roles_update_timestamp BEFORE UPDATE ON roles
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER clients_update_timestamp BEFORE UPDATE ON clients
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER partenaires_update_timestamp BEFORE UPDATE ON partenaires
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER employes_update_timestamp BEFORE UPDATE ON employes
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER fournisseurs_update_timestamp BEFORE UPDATE ON fournisseurs
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER candidatures_update_timestamp BEFORE UPDATE ON candidatures
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER services_update_timestamp BEFORE UPDATE ON services
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER rendez_vous_update_timestamp BEFORE UPDATE ON rendez_vous
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER plans_update_timestamp BEFORE UPDATE ON plans
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER abonnements_update_timestamp BEFORE UPDATE ON abonnements
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER produits_update_timestamp BEFORE UPDATE ON produits
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER commandes_update_timestamp BEFORE UPDATE ON commandes
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER transactions_update_timestamp BEFORE UPDATE ON transactions
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER virements_update_timestamp BEFORE UPDATE ON virements
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER chaises_update_timestamp BEFORE UPDATE ON chaises
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER reservations_chaise_update_timestamp BEFORE UPDATE ON reservations_chaise
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER articles_blog_update_timestamp BEFORE UPDATE ON articles_blog
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER formation_modules_update_timestamp BEFORE UPDATE ON formation_modules
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER formation_etapes_update_timestamp BEFORE UPDATE ON formation_etapes
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER formation_progression_update_timestamp BEFORE UPDATE ON formation_progression
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER quiz_questions_update_timestamp BEFORE UPDATE ON quiz_questions
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER salon_config_update_timestamp BEFORE UPDATE ON salon_config
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER parrainage_update_timestamp BEFORE UPDATE ON parrainage
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER cartes_cadeaux_update_timestamp BEFORE UPDATE ON cartes_cadeaux
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER tirage_update_timestamp BEFORE UPDATE ON tirage
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER tickets_tirage_update_timestamp BEFORE UPDATE ON tickets_tirage
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ══════════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS) — Fine-grained access control
-- ══════════════════════════════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE partenaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE employes ENABLE ROW LEVEL SECURITY;
ALTER TABLE fournisseurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE rendez_vous ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE abonnements ENABLE ROW LEVEL SECURITY;
ALTER TABLE produits ENABLE ROW LEVEL SECURITY;
ALTER TABLE commandes ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE virements ENABLE ROW LEVEL SECURITY;
ALTER TABLE chaises ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations_chaise ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles_blog ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE formation_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE formation_etapes ENABLE ROW LEVEL SECURITY;
ALTER TABLE formation_progression ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE salon_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE parrainage ENABLE ROW LEVEL SECURITY;
ALTER TABLE cartes_cadeaux ENABLE ROW LEVEL SECURITY;
ALTER TABLE tirage ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets_tirage ENABLE ROW LEVEL SECURITY;

-- ─── Users RLS ─────────────────────────────────────────────────────────────────

-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT
  USING (auth.uid()::text = id::text);

-- Admins can read all users (future: add is_admin check)
CREATE POLICY "Public can read limited user info" ON users
  FOR SELECT
  USING (true); -- Allow public read for now (phone lookup, etc.)

-- ─── Clients RLS ────────────────────────────────────────────────────────────────

-- Clients can read their own profile
CREATE POLICY "Clients can read own profile" ON clients
  FOR SELECT
  USING (auth.uid()::text = user_id::text);

-- Clients can update their own profile
CREATE POLICY "Clients can update own profile" ON clients
  FOR UPDATE
  USING (auth.uid()::text = user_id::text);

-- ─── Partenaires RLS ────────────────────────────────────────────────────────────

-- Partenaires can read their own profile
CREATE POLICY "Partenaires can read own profile" ON partenaires
  FOR SELECT
  USING (auth.uid()::text = user_id::text);

-- Partenaires can update their own profile
CREATE POLICY "Partenaires can update own profile" ON partenaires
  FOR UPDATE
  USING (auth.uid()::text = user_id::text);

-- Public can read active partenaire profiles (for booking)
CREATE POLICY "Public can read active partenaires" ON partenaires
  FOR SELECT
  USING (statut = 'actif' AND is_disponible = true);

-- ─── Services RLS ──────────────────────────────────────────────────────────────

-- Everyone can read active services
CREATE POLICY "Public can read active services" ON services
  FOR SELECT
  USING (actif = true);

-- ─── Rendez-vous RLS ───────────────────────────────────────────────────────────

-- Clients can read their own appointments
CREATE POLICY "Clients can read own appointments" ON rendez_vous
  FOR SELECT
  USING (
    auth.uid()::text = (SELECT user_id::text FROM clients WHERE id = client_id)
  );

-- Partenaires can read their own appointments
CREATE POLICY "Partenaires can read own appointments" ON rendez_vous
  FOR SELECT
  USING (
    auth.uid()::text = (SELECT user_id::text FROM partenaires WHERE id = partenaire_id)
  );

-- ─── Articles Blog RLS ──────────────────────────────────────────────────────────

-- Everyone can read published articles
CREATE POLICY "Public can read published articles" ON articles_blog
  FOR SELECT
  USING (publie = true);

-- ─── Plans RLS ──────────────────────────────────────────────────────────────────

-- Everyone can read active plans
CREATE POLICY "Public can read active plans" ON plans
  FOR SELECT
  USING (actif = true);

-- ─── Abonnements RLS ────────────────────────────────────────────────────────────

-- Clients can read their own subscriptions
CREATE POLICY "Clients can read own subscriptions" ON abonnements
  FOR SELECT
  USING (
    auth.uid()::text = (SELECT user_id::text FROM clients WHERE id = client_id)
  );

-- ─── Produits RLS ──────────────────────────────────────────────────────────────

-- Everyone can read active products
CREATE POLICY "Public can read active products" ON produits
  FOR SELECT
  USING (actif = true);

-- Suppliers can read their own products
CREATE POLICY "Suppliers can read own products" ON produits
  FOR SELECT
  USING (
    auth.uid()::text = (SELECT user_id::text FROM fournisseurs WHERE id = fournisseur_id)
  );

-- ─── Tirage RLS ────────────────────────────────────────────────────────────────

-- Everyone can read active lotteries
CREATE POLICY "Public can read active lotteries" ON tirage
  FOR SELECT
  USING (actif = true);

-- ──────────────────────────────────────────────────────────────────────────────
-- END OF INITIAL SCHEMA
-- ──────────────────────────────────────────────────────────────────────────────
