-- ══════════════════════════════════════════════════════════════════════════════
-- KADIO SUPABASE — HELPER FUNCTIONS & VIEWS
-- ══════════════════════════════════════════════════════════════════════════════
-- Additional SQL functions, views, and utilities for common operations

-- ──────────────────────────────────────────────────────────────────────────────
-- FUNCTIONS
-- ──────────────────────────────────────────────────────────────────────────────

-- ─── Check if user has a specific role ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION user_has_role(user_id UUID, role_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM roles
    WHERE roles.user_id = user_id
    AND roles.role = role_name
    AND roles.statut = 'actif'
  );
END;
$$ LANGUAGE plpgsql;

-- ─── Get user's active roles ──────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_user_roles(user_id UUID)
RETURNS TABLE(role TEXT, statut TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT roles.role, roles.statut FROM roles
  WHERE roles.user_id = user_id AND roles.statut = 'actif';
END;
$$ LANGUAGE plpgsql;

-- ─── Generate unique partner code ──────────────────────────────────────────────
CREATE OR REPLACE FUNCTION generate_partner_code(nom TEXT)
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  counter INTEGER := 0;
BEGIN
  code := 'KADIO-' || UPPER(SUBSTR(nom, 1, 1)) || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');

  WHILE EXISTS(SELECT 1 FROM partenaires WHERE code_partenaire = code) LOOP
    counter := counter + 1;
    code := 'KADIO-' || UPPER(SUBSTR(nom, 1, 1)) || LPAD((FLOOR(RANDOM() * 10000) + counter)::TEXT, 4, '0');
  END LOOP;

  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- ─── Generate unique referral code ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION generate_referral_code(prenom TEXT)
RETURNS TEXT AS $$
DECLARE
  code TEXT;
BEGIN
  code := UPPER(prenom) || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- ─── Calculate partner commission ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION calculate_commission(montant NUMERIC, location TEXT)
RETURNS NUMERIC AS $$
BEGIN
  CASE WHEN location = 'salon' THEN
    RETURN montant * 0.50;
  ELSE
    RETURN montant * 0.75;
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- ─── Calculate Kadio commission (the inverse) ──────────────────────────────────
CREATE OR REPLACE FUNCTION calculate_kadio_commission(montant NUMERIC, location TEXT)
RETURNS NUMERIC AS $$
BEGIN
  CASE WHEN location = 'salon' THEN
    RETURN montant * 0.25;
  ELSE
    RETURN montant * 0.25;
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- ─── Mark appointment as completed and create transaction ─────────────────────
CREATE OR REPLACE FUNCTION complete_rdv_with_transaction(
  rdv_id UUID,
  client_note INTEGER,
  client_avis TEXT
)
RETURNS TABLE(rdv_id UUID, transaction_id UUID) AS $$
DECLARE
  v_rdv RECORD;
  v_transaction_id UUID;
BEGIN
  -- Get RDV details
  SELECT * INTO v_rdv FROM rendez_vous WHERE id = rdv_id;

  IF v_rdv IS NULL THEN
    RAISE EXCEPTION 'Rendez-vous not found';
  END IF;

  -- Update RDV status and review
  UPDATE rendez_vous
  SET
    statut = 'termine',
    avis_note = client_note,
    avis_texte = client_avis,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = rdv_id;

  -- Create transaction record
  INSERT INTO transactions (
    type, source, montant, commission_kadio, description,
    reference_id, reference_type, statut
  )
  VALUES (
    CASE WHEN v_rdv.lieu = 'salon' THEN 'rdv_salon' ELSE 'rdv_domicile' END,
    'client',
    v_rdv.montant,
    v_rdv.commission_kadio,
    'RDV: ' || v_rdv.service_nom,
    rdv_id,
    'rdv',
    'recu'
  )
  RETURNING id INTO v_transaction_id;

  RETURN QUERY SELECT rdv_id, v_transaction_id;
END;
$$ LANGUAGE plpgsql;

-- ─── Update partner rating after review ────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_partner_rating(partenaire_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  new_rating NUMERIC;
BEGIN
  SELECT AVG(avis_note)::NUMERIC(3,2) INTO new_rating
  FROM rendez_vous
  WHERE partenaire_id = partenaire_id
  AND avis_note IS NOT NULL
  AND statut = 'termine';

  IF new_rating IS NOT NULL THEN
    UPDATE partenaires
    SET
      note_moyenne = new_rating,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = partenaire_id;
  END IF;

  RETURN COALESCE(new_rating, 0);
END;
$$ LANGUAGE plpgsql;

-- ─── Trigger to auto-update partner rating ────────────────────────────────────
CREATE OR REPLACE FUNCTION trigger_update_partner_rating()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.avis_note IS NOT NULL AND NEW.statut = 'termine' THEN
    PERFORM update_partner_rating(NEW.partenaire_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER rdv_update_partner_rating AFTER UPDATE ON rendez_vous
FOR EACH ROW EXECUTE FUNCTION trigger_update_partner_rating();

-- ─── Check if client is blocked ────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION is_client_blocked(client_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT is_bloque FROM clients WHERE id = client_id
  );
END;
$$ LANGUAGE plpgsql;

-- ─── Increment no-show count and block if needed ────────────────────────────────
CREATE OR REPLACE FUNCTION record_no_show(rdv_id UUID)
RETURNS TABLE(client_id UUID, no_show_count INTEGER, is_bloque BOOLEAN) AS $$
DECLARE
  v_client_id UUID;
  v_new_count INTEGER;
BEGIN
  -- Get client from RDV
  SELECT client_id INTO v_client_id FROM rendez_vous WHERE id = rdv_id;

  IF v_client_id IS NULL THEN
    RAISE EXCEPTION 'RDV not found or has no client';
  END IF;

  -- Increment no-show count
  UPDATE clients
  SET no_show_count = no_show_count + 1
  WHERE id = v_client_id
  RETURNING no_show_count INTO v_new_count;

  -- Block if reached threshold (2 no-shows)
  IF v_new_count >= 2 THEN
    UPDATE clients
    SET
      is_bloque = TRUE,
      motif_blocage = 'No-shows répétés sans annulation préalable.',
      updated_at = CURRENT_TIMESTAMP
    WHERE id = v_client_id;
  END IF;

  -- Update RDV status
  UPDATE rendez_vous
  SET statut = 'no_show'
  WHERE id = rdv_id;

  -- Return updated client info
  RETURN QUERY
  SELECT v_client_id, v_new_count, (v_new_count >= 2);
END;
$$ LANGUAGE plpgsql;

-- ─── Get available time slots for a partner on a specific date ─────────────────
CREATE OR REPLACE FUNCTION get_available_slots(partenaire_id UUID, slot_date DATE)
RETURNS TABLE(heure TIME, dispo BOOLEAN) AS $$
BEGIN
  -- Generate hourly slots from 9 AM to 6 PM
  RETURN QUERY
  WITH slots AS (
    SELECT
      gs::TIME AS heure
    FROM generate_series('09:00'::TIME, '18:00'::TIME, '1 hour'::INTERVAL) gs
  )
  SELECT
    slots.heure,
    NOT EXISTS(
      SELECT 1 FROM rendez_vous
      WHERE partenaire_id = get_available_slots.partenaire_id
      AND date_rdv = slot_date
      AND heure_debut <= slots.heure
      AND heure_fin > slots.heure
      AND statut IN ('confirme', 'en_cours')
    ) AS dispo
  FROM slots;
END;
$$ LANGUAGE plpgsql;

-- ─── Get partner performance metrics ───────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_partner_metrics(partenaire_id UUID, days INTEGER DEFAULT 30)
RETURNS TABLE(
  total_rdv INTEGER,
  completed_rdv INTEGER,
  avg_rating NUMERIC,
  total_revenue NUMERIC,
  no_shows INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM rendez_vous
     WHERE partenaire_id = get_partner_metrics.partenaire_id
     AND date_rdv >= CURRENT_DATE - (days || ' days')::INTERVAL)::INTEGER,
    (SELECT COUNT(*) FROM rendez_vous
     WHERE partenaire_id = get_partner_metrics.partenaire_id
     AND statut = 'termine'
     AND date_rdv >= CURRENT_DATE - (days || ' days')::INTERVAL)::INTEGER,
    (SELECT AVG(avis_note)::NUMERIC(3,2) FROM rendez_vous
     WHERE partenaire_id = get_partner_metrics.partenaire_id
     AND avis_note IS NOT NULL),
    (SELECT SUM(montant)::NUMERIC FROM rendez_vous
     WHERE partenaire_id = get_partner_metrics.partenaire_id
     AND statut = 'termine'
     AND date_rdv >= CURRENT_DATE - (days || ' days')::INTERVAL),
    (SELECT COUNT(*) FROM rendez_vous
     WHERE partenaire_id = get_partner_metrics.partenaire_id
     AND statut = 'no_show'
     AND date_rdv >= CURRENT_DATE - (days || ' days')::INTERVAL)::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- ──────────────────────────────────────────────────────────────────────────────
-- MATERIALIZED VIEWS (for reporting/analytics)
-- ──────────────────────────────────────────────────────────────────────────────

-- ─── Monthly revenue summary ──────────────────────────────────────────────────
CREATE MATERIALIZED VIEW IF NOT EXISTS monthly_revenue_summary AS
SELECT
  DATE_TRUNC('month', date)::DATE AS mois,
  SUM(montant) AS total_montant,
  SUM(commission_kadio) AS total_commission_kadio,
  COUNT(*) AS nombre_transactions
FROM transactions
WHERE statut = 'recu'
GROUP BY DATE_TRUNC('month', date)
ORDER BY mois DESC;

-- ─── Partner performance leaderboard ──────────────────────────────────────────
CREATE MATERIALIZED VIEW IF NOT EXISTS partner_leaderboard AS
SELECT
  p.id,
  p.code_partenaire,
  u.prenom,
  u.nom,
  p.note_moyenne,
  COUNT(rv.id) AS total_rdv,
  SUM(CASE WHEN rv.statut = 'termine' THEN 1 ELSE 0 END) AS completed_rdv,
  SUM(rv.montant) AS total_revenue,
  p.niveau,
  p.portefeuille_solde
FROM partenaires p
JOIN users u ON p.user_id = u.id
LEFT JOIN rendez_vous rv ON p.id = rv.partenaire_id
WHERE p.statut = 'actif'
GROUP BY p.id, p.code_partenaire, u.prenom, u.nom, p.note_moyenne, p.niveau, p.portefeuille_solde
ORDER BY p.note_moyenne DESC, total_rdv DESC;

-- ─── Top services by volume ───────────────────────────────────────────────────
CREATE MATERIALIZED VIEW IF NOT EXISTS top_services_view AS
SELECT
  service_nom,
  COUNT(*) AS total_bookings,
  SUM(montant) AS total_revenue,
  AVG(EXTRACT(EPOCH FROM (heure_fin - heure_debut))/60)::INTEGER AS avg_duration_minutes,
  COUNT(CASE WHEN statut = 'termine' THEN 1 END) AS completed_count
FROM rendez_vous
WHERE date_rdv >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY service_nom
ORDER BY total_bookings DESC;

-- ─── Client subscription status ───────────────────────────────────────────────
CREATE MATERIALIZED VIEW IF NOT EXISTS client_subscription_status AS
SELECT
  c.id,
  u.prenom,
  u.nom,
  u.telephone,
  c.is_abonne,
  COALESCE(a.plan_id, NULL) AS plan_id,
  COALESCE(p.nom, 'N/A') AS plan_name,
  COALESCE(a.statut, 'inactive') AS subscription_status,
  COALESCE(a.date_fin, NULL) AS expiration_date,
  c.no_show_count,
  c.is_bloque,
  c.credits_parrainage,
  COUNT(rv.id) AS total_rdv,
  MAX(rv.date_rdv) AS last_rdv_date
FROM clients c
JOIN users u ON c.user_id = u.id
LEFT JOIN abonnements a ON c.id = a.client_id AND a.statut = 'actif'
LEFT JOIN plans p ON a.plan_id = p.id
LEFT JOIN rendez_vous rv ON c.id = rv.client_id
GROUP BY c.id, u.prenom, u.nom, u.telephone, c.is_abonne, a.plan_id, p.nom, a.statut, a.date_fin, c.no_show_count, c.is_bloque, c.credits_parrainage
ORDER BY u.prenom, u.nom;

-- ──────────────────────────────────────────────────────────────────────────────
-- INDEXES ON MATERIALIZED VIEWS
-- ──────────────────────────────────────────────────────────────────────────────

CREATE INDEX idx_monthly_revenue_mois ON monthly_revenue_summary(mois DESC);
CREATE INDEX idx_partner_leaderboard_note ON partner_leaderboard(note_moyenne DESC);
CREATE INDEX idx_partner_leaderboard_niveau ON partner_leaderboard(niveau);
CREATE INDEX idx_top_services_bookings ON top_services_view(total_bookings DESC);
CREATE INDEX idx_client_subscription_status_bloque ON client_subscription_status(is_bloque);

-- ──────────────────────────────────────────────────────────────────────────────
-- REFRESH FUNCTION FOR MATERIALIZED VIEWS
-- ──────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION refresh_all_materialized_views()
RETURNS TEXT AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_revenue_summary;
  REFRESH MATERIALIZED VIEW CONCURRENTLY partner_leaderboard;
  REFRESH MATERIALIZED VIEW CONCURRENTLY top_services_view;
  REFRESH MATERIALIZED VIEW CONCURRENTLY client_subscription_status;
  RETURN 'All materialized views refreshed successfully';
END;
$$ LANGUAGE plpgsql;

-- Schedule daily refresh (in production, use a pg_cron extension or external scheduler)
-- SELECT cron.schedule('refresh-materialized-views', '0 2 * * *', 'SELECT refresh_all_materialized_views()');

-- ──────────────────────────────────────────────────────────────────────────────
-- AGGREGATION FUNCTIONS
-- ──────────────────────────────────────────────────────────────────────────────

-- ─── Get dashboard statistics ─────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS TABLE(
  total_users BIGINT,
  active_clients BIGINT,
  active_partners BIGINT,
  active_employees BIGINT,
  today_rdv COUNT,
  pending_payout NUMERIC,
  blocked_clients BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM users),
    (SELECT COUNT(*) FROM clients WHERE NOT is_bloque),
    (SELECT COUNT(*) FROM partenaires WHERE statut = 'actif'),
    (SELECT COUNT(*) FROM employes WHERE actif),
    (SELECT COUNT(*) FROM rendez_vous WHERE date_rdv = CURRENT_DATE),
    (SELECT COALESCE(SUM(montant), 0) FROM virements WHERE statut = 'en_attente'),
    (SELECT COUNT(*) FROM clients WHERE is_bloque);
END;
$$ LANGUAGE plpgsql;

-- ──────────────────────────────────────────────────────────────────────────────
-- ADVANCED RLS POLICIES (Additional security)
-- ──────────────────────────────────────────────────────────────────────────────

-- ─── Admins can do anything (implicit with bypass)
-- ─── Partners can only read RDV with them as partenaire_id
CREATE POLICY "Partners can read own RDV details" ON rendez_vous
  FOR SELECT
  USING (
    auth.uid()::text = (SELECT user_id::text FROM partenaires WHERE id = partenaire_id)
  );

-- ─── Employees can read salon RDV
CREATE POLICY "Employees can read salon RDV" ON rendez_vous
  FOR SELECT
  USING (
    auth.uid()::text = (SELECT user_id::text FROM employes WHERE id = employe_id)
  );

-- ─── Suppliers can read their own product catalog
CREATE POLICY "Suppliers can manage own products" ON produits
  FOR UPDATE
  USING (
    auth.uid()::text = (SELECT user_id::text FROM fournisseurs WHERE id = fournisseur_id)
  );

-- ──────────────────────────────────────────────────────────────────────────────
-- UTILITY VIEWS
-- ──────────────────────────────────────────────────────────────────────────────

-- ─── Today's schedule ─────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW vw_today_schedule AS
SELECT
  rv.id,
  rv.code_qr,
  u_client.prenom AS client_prenom,
  u_client.nom AS client_nom,
  u_client.telephone AS client_telephone,
  u_partner.prenom AS partner_prenom,
  u_partner.nom AS partner_nom,
  rv.service_nom,
  rv.heure_debut,
  rv.heure_fin,
  rv.lieu,
  rv.statut,
  rv.montant,
  p.note_moyenne AS partner_rating
FROM rendez_vous rv
LEFT JOIN clients c ON rv.client_id = c.id
LEFT JOIN users u_client ON c.user_id = u_client.id
LEFT JOIN partenaires p ON rv.partenaire_id = p.id
LEFT JOIN users u_partner ON p.user_id = u_partner.id
WHERE rv.date_rdv = CURRENT_DATE
ORDER BY rv.heure_debut;

-- ─── Client's upcoming appointments ───────────────────────────────────────────
CREATE OR REPLACE VIEW vw_client_upcoming_rdv AS
SELECT
  rv.id,
  rv.code_qr,
  rv.date_rdv,
  rv.heure_debut,
  rv.heure_fin,
  rv.service_nom,
  u_partner.prenom AS partner_prenom,
  u_partner.nom AS partner_nom,
  p.note_moyenne,
  p.specialites,
  p.ville,
  rv.lieu,
  rv.montant,
  rv.statut
FROM rendez_vous rv
JOIN clients c ON rv.client_id = c.id
JOIN partenaires p ON rv.partenaire_id = p.id
JOIN users u_partner ON p.user_id = u_partner.id
WHERE c.user_id = auth.uid()
AND rv.date_rdv >= CURRENT_DATE
AND rv.statut IN ('en_attente', 'confirme')
ORDER BY rv.date_rdv, rv.heure_debut;

-- ─── Partner's upcoming appointments ──────────────────────────────────────────
CREATE OR REPLACE VIEW vw_partner_upcoming_rdv AS
SELECT
  rv.id,
  rv.code_qr,
  rv.date_rdv,
  rv.heure_debut,
  rv.heure_fin,
  rv.service_nom,
  u_client.prenom AS client_prenom,
  u_client.nom AS client_nom,
  u_client.telephone AS client_telephone,
  rv.lieu,
  rv.montant,
  rv.statut
FROM rendez_vous rv
JOIN partenaires p ON rv.partenaire_id = p.id
JOIN clients c ON rv.client_id = c.id
JOIN users u_client ON c.user_id = u_client.id
WHERE p.user_id = auth.uid()
AND rv.date_rdv >= CURRENT_DATE
AND rv.statut IN ('en_attente', 'confirme')
ORDER BY rv.date_rdv, rv.heure_debut;

-- ──────────────────────────────────────────────────────────────────────────────
-- ENABLE RLS ON VIEWS (optional for additional security)
-- ──────────────────────────────────────────────────────────────────────────────

-- Views inherit security from underlying tables, but explicit policies can be added:
-- ALTER TABLE vw_client_upcoming_rdv ENABLE ROW LEVEL SECURITY;

-- ──────────────────────────────────────────────────────────────────────────────
-- END OF FUNCTIONS AND HELPERS
-- ──────────────────────────────────────────────────────────────────────────────

COMMENT ON FUNCTION user_has_role IS 'Check if a user has a specific active role';
COMMENT ON FUNCTION get_user_roles IS 'Get all active roles for a user';
COMMENT ON FUNCTION generate_partner_code IS 'Generate a unique partner code (KADIO-XXXX-YYYY)';
COMMENT ON FUNCTION generate_referral_code IS 'Generate a unique referral code (PRENOM-YYYY)';
COMMENT ON FUNCTION calculate_commission IS 'Calculate partner commission (50% salon, 75% elsewhere)';
COMMENT ON FUNCTION calculate_kadio_commission IS 'Calculate Kadio commission';
COMMENT ON FUNCTION complete_rdv_with_transaction IS 'Mark appointment as completed and create transaction record';
COMMENT ON FUNCTION update_partner_rating IS 'Update partner average rating based on RDV reviews';
COMMENT ON FUNCTION is_client_blocked IS 'Check if a client account is blocked';
COMMENT ON FUNCTION record_no_show IS 'Record no-show and block client if threshold reached';
COMMENT ON FUNCTION get_available_slots IS 'Get available hourly time slots for partner on a date';
COMMENT ON FUNCTION get_partner_metrics IS 'Get partner performance metrics for period';
COMMENT ON FUNCTION get_dashboard_stats IS 'Get overall platform statistics';
COMMENT ON FUNCTION refresh_all_materialized_views IS 'Refresh all reporting materialized views';

COMMENT ON MATERIALIZED VIEW monthly_revenue_summary IS 'Monthly revenue aggregation for reporting';
COMMENT ON MATERIALIZED VIEW partner_leaderboard IS 'Partner rankings by rating and performance';
COMMENT ON MATERIALIZED VIEW top_services_view IS 'Most popular services by booking volume';
COMMENT ON MATERIALIZED VIEW client_subscription_status IS 'Client subscription and engagement status';

COMMENT ON VIEW vw_today_schedule IS 'Today''s full schedule (all partners and clients)';
COMMENT ON VIEW vw_client_upcoming_rdv IS 'Client''s upcoming appointments (RLS applied)';
COMMENT ON VIEW vw_partner_upcoming_rdv IS 'Partner''s upcoming appointments (RLS applied)';
