-- ============================================================
-- KADIO — Migration 002 : Row Level Security
-- ============================================================

-- Activer RLS sur toutes les tables
ALTER TABLE users                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE partenaires             ENABLE ROW LEVEL SECURITY;
ALTER TABLE employes                ENABLE ROW LEVEL SECURITY;
ALTER TABLE fournisseurs            ENABLE ROW LEVEL SECURITY;
ALTER TABLE produits                ENABLE ROW LEVEL SECURITY;
ALTER TABLE commandes_materiel      ENABLE ROW LEVEL SECURITY;
ALTER TABLE chaises                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations_chaises    ENABLE ROW LEVEL SECURITY;
ALTER TABLE services                ENABLE ROW LEVEL SECURITY;
ALTER TABLE rendez_vous             ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans_abonnement        ENABLE ROW LEVEL SECURITY;
ALTER TABLE abonnements             ENABLE ROW LEVEL SECURITY;
ALTER TABLE portefeuille_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bonus_conversions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidatures            ENABLE ROW LEVEL SECURITY;
ALTER TABLE formation_modules       ENABLE ROW LEVEL SECURITY;
ALTER TABLE formation_progression   ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles                ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_logs                ENABLE ROW LEVEL SECURITY;
ALTER TABLE frais_deplacement       ENABLE ROW LEVEL SECURITY;
ALTER TABLE salon_config            ENABLE ROW LEVEL SECURITY;

-- ─── Helpers ────────────────────────────────────────────────
-- Vérifie si l'utilisateur authentifié a un rôle donné
CREATE OR REPLACE FUNCTION has_role(r text)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN users u ON u.id = ur.user_id
    WHERE u.telephone = auth.jwt()->>'phone'
      AND ur.role = r
      AND ur.statut = 'actif'
  )
$$ LANGUAGE sql SECURITY DEFINER;

-- ─── PUBLIC — lecture seule sans auth ────────────────────────

-- Services : visibles par tous
CREATE POLICY "services_public_read" ON services
  FOR SELECT USING (actif = true);

-- Plans abonnement : visibles par tous
CREATE POLICY "plans_public_read" ON plans_abonnement
  FOR SELECT USING (actif = true);

-- Articles publiés : visibles par tous
CREATE POLICY "articles_public_read" ON articles
  FOR SELECT USING (publie = true);

-- Partenaires actifs : coordonnées publiques (carte)
CREATE POLICY "partenaires_public_read" ON partenaires
  FOR SELECT USING (statut = 'actif' AND is_disponible = true);

-- Frais de déplacement : publics
CREATE POLICY "frais_deplacement_public_read" ON frais_deplacement
  FOR SELECT USING (true);

-- Salon config : publique (horaires, infos)
CREATE POLICY "salon_config_public_read" ON salon_config
  FOR SELECT USING (true);

-- Chaises : visibles (disponibilités)
CREATE POLICY "chaises_public_read" ON chaises
  FOR SELECT USING (actif = true);

-- Produits actifs : visibles par partenaires + admin
CREATE POLICY "produits_partenaire_read" ON produits
  FOR SELECT USING (actif = true AND has_role('partenaire'));

CREATE POLICY "produits_admin_all" ON produits
  FOR ALL USING (has_role('admin'));

-- Formation modules : visibles par candidats + partenaires
CREATE POLICY "formation_modules_read" ON formation_modules
  FOR SELECT USING (actif = true AND (has_role('candidat') OR has_role('partenaire') OR has_role('admin')));

-- ─── CLIENTS ─────────────────────────────────────────────────

-- Un client voit et modifie uniquement son profil
CREATE POLICY "clients_own_read" ON clients
  FOR SELECT USING (
    user_id IN (SELECT id FROM users WHERE telephone = auth.jwt()->>'phone')
  );

CREATE POLICY "clients_own_update" ON clients
  FOR UPDATE USING (
    user_id IN (SELECT id FROM users WHERE telephone = auth.jwt()->>'phone')
  );

-- Inscription : INSERT libre (via trigger after user creation)
CREATE POLICY "clients_insert_auth" ON clients
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Admin : tout
CREATE POLICY "clients_admin_all" ON clients
  FOR ALL USING (has_role('admin'));

-- ─── USERS ───────────────────────────────────────────────────

CREATE POLICY "users_own" ON users
  FOR ALL USING (telephone = auth.jwt()->>'phone');

CREATE POLICY "users_admin_all" ON users
  FOR ALL USING (has_role('admin'));

-- ─── USER_ROLES ───────────────────────────────────────────────

CREATE POLICY "user_roles_own_read" ON user_roles
  FOR SELECT USING (
    user_id IN (SELECT id FROM users WHERE telephone = auth.jwt()->>'phone')
  );

CREATE POLICY "user_roles_admin_all" ON user_roles
  FOR ALL USING (has_role('admin'));

-- ─── PARTENAIRES ─────────────────────────────────────────────

-- Partenaire voit et modifie son propre profil
CREATE POLICY "partenaires_own" ON partenaires
  FOR ALL USING (
    user_id IN (SELECT id FROM users WHERE telephone = auth.jwt()->>'phone')
    AND has_role('partenaire')
  );

CREATE POLICY "partenaires_admin_all" ON partenaires
  FOR ALL USING (has_role('admin'));

-- ─── EMPLOYES ────────────────────────────────────────────────

CREATE POLICY "employes_own_read" ON employes
  FOR SELECT USING (
    user_id IN (SELECT id FROM users WHERE telephone = auth.jwt()->>'phone')
    AND has_role('employe')
  );

CREATE POLICY "employes_admin_all" ON employes
  FOR ALL USING (has_role('admin'));

-- ─── FOURNISSEURS ────────────────────────────────────────────

CREATE POLICY "fournisseurs_own" ON fournisseurs
  FOR ALL USING (
    user_id IN (SELECT id FROM users WHERE telephone = auth.jwt()->>'phone')
    AND has_role('fournisseur')
  );

CREATE POLICY "fournisseurs_admin_all" ON fournisseurs
  FOR ALL USING (has_role('admin'));

-- ─── RENDEZ_VOUS ─────────────────────────────────────────────

-- Client voit ses propres RDV
CREATE POLICY "rdv_client_read" ON rendez_vous
  FOR SELECT USING (
    client_id IN (
      SELECT c.id FROM clients c
      JOIN users u ON u.id = c.user_id
      WHERE u.telephone = auth.jwt()->>'phone'
    )
  );

-- Client peut créer un RDV
CREATE POLICY "rdv_client_insert" ON rendez_vous
  FOR INSERT WITH CHECK (
    client_id IN (
      SELECT c.id FROM clients c
      JOIN users u ON u.id = c.user_id
      WHERE u.telephone = auth.jwt()->>'phone'
    )
  );

-- Partenaire voit ses propres RDV
CREATE POLICY "rdv_partenaire_read" ON rendez_vous
  FOR SELECT USING (
    partenaire_id IN (
      SELECT p.id FROM partenaires p
      JOIN users u ON u.id = p.user_id
      WHERE u.telephone = auth.jwt()->>'phone'
    )
    AND has_role('partenaire')
  );

-- Partenaire peut mettre à jour le statut de ses RDV
CREATE POLICY "rdv_partenaire_update" ON rendez_vous
  FOR UPDATE USING (
    partenaire_id IN (
      SELECT p.id FROM partenaires p
      JOIN users u ON u.id = p.user_id
      WHERE u.telephone = auth.jwt()->>'phone'
    )
    AND has_role('partenaire')
  );

-- Employé voit ses propres RDV
CREATE POLICY "rdv_employe_read" ON rendez_vous
  FOR SELECT USING (
    employe_id IN (
      SELECT e.id FROM employes e
      JOIN users u ON u.id = e.user_id
      WHERE u.telephone = auth.jwt()->>'phone'
    )
    AND has_role('employe')
  );

-- Admin : tout
CREATE POLICY "rdv_admin_all" ON rendez_vous
  FOR ALL USING (has_role('admin'));

-- ─── ABONNEMENTS ─────────────────────────────────────────────

CREATE POLICY "abonnements_client_read" ON abonnements
  FOR SELECT USING (
    client_id IN (
      SELECT c.id FROM clients c
      JOIN users u ON u.id = c.user_id
      WHERE u.telephone = auth.jwt()->>'phone'
    )
  );

CREATE POLICY "abonnements_admin_all" ON abonnements
  FOR ALL USING (has_role('admin'));

-- ─── PORTEFEUILLE TRANSACTIONS ───────────────────────────────

CREATE POLICY "ptrans_partenaire_read" ON portefeuille_transactions
  FOR SELECT USING (
    partenaire_id IN (
      SELECT p.id FROM partenaires p
      JOIN users u ON u.id = p.user_id
      WHERE u.telephone = auth.jwt()->>'phone'
    )
    AND has_role('partenaire')
  );

CREATE POLICY "ptrans_admin_all" ON portefeuille_transactions
  FOR ALL USING (has_role('admin'));

-- ─── COMMANDES_MATERIEL ──────────────────────────────────────

CREATE POLICY "commandes_partenaire_own" ON commandes_materiel
  FOR ALL USING (
    partenaire_id IN (
      SELECT p.id FROM partenaires p
      JOIN users u ON u.id = p.user_id
      WHERE u.telephone = auth.jwt()->>'phone'
    )
    AND has_role('partenaire')
  );

CREATE POLICY "commandes_fournisseur_read" ON commandes_materiel
  FOR SELECT USING (
    fournisseur_id IN (
      SELECT f.id FROM fournisseurs f
      JOIN users u ON u.id = f.user_id
      WHERE u.telephone = auth.jwt()->>'phone'
    )
    AND has_role('fournisseur')
  );

CREATE POLICY "commandes_admin_all" ON commandes_materiel
  FOR ALL USING (has_role('admin'));

-- ─── RESERVATIONS_CHAISES ────────────────────────────────────

CREATE POLICY "resas_chaises_partenaire_own" ON reservations_chaises
  FOR ALL USING (
    partenaire_id IN (
      SELECT p.id FROM partenaires p
      JOIN users u ON u.id = p.user_id
      WHERE u.telephone = auth.jwt()->>'phone'
    )
    AND has_role('partenaire')
  );

CREATE POLICY "resas_chaises_admin_all" ON reservations_chaises
  FOR ALL USING (has_role('admin'));

-- Lecture publique (disponibilités)
CREATE POLICY "resas_chaises_public_read" ON reservations_chaises
  FOR SELECT USING (true);

-- ─── CANDIDATURES ────────────────────────────────────────────

-- Insertion publique (formulaire candidature)
CREATE POLICY "candidatures_public_insert" ON candidatures
  FOR INSERT WITH CHECK (true);

-- Lecture par le candidat (via son téléphone)
CREATE POLICY "candidatures_own_read" ON candidatures
  FOR SELECT USING (telephone = auth.jwt()->>'phone');

CREATE POLICY "candidatures_admin_all" ON candidatures
  FOR ALL USING (has_role('admin'));

-- ─── FORMATION_PROGRESSION ───────────────────────────────────

CREATE POLICY "formation_prog_own" ON formation_progression
  FOR ALL USING (
    partenaire_id IN (
      SELECT p.id FROM partenaires p
      JOIN users u ON u.id = p.user_id
      WHERE u.telephone = auth.jwt()->>'phone'
    )
  );

CREATE POLICY "formation_prog_admin_all" ON formation_progression
  FOR ALL USING (has_role('admin'));

-- ─── BONUS_CONVERSIONS ───────────────────────────────────────

CREATE POLICY "bonus_partenaire_read" ON bonus_conversions
  FOR SELECT USING (
    partenaire_id IN (
      SELECT p.id FROM partenaires p
      JOIN users u ON u.id = p.user_id
      WHERE u.telephone = auth.jwt()->>'phone'
    )
    AND has_role('partenaire')
  );

CREATE POLICY "bonus_admin_all" ON bonus_conversions
  FOR ALL USING (has_role('admin'));

-- ─── SMS_LOGS ────────────────────────────────────────────────

CREATE POLICY "sms_logs_admin_all" ON sms_logs
  FOR ALL USING (has_role('admin'));

-- ─── ARTICLES (admin gestion) ────────────────────────────────

CREATE POLICY "articles_admin_all" ON articles
  FOR ALL USING (has_role('admin'));
