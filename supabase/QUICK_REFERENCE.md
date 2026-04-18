# Kadio Database — Quick Reference Guide

## Table Overview

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| **users** | User accounts | id, telephone, prenom, nom, email, langue |
| **roles** | User role assignments | user_id, role, statut |
| **clients** | Client profiles | user_id, is_abonne, no_show_count, is_bloque, credits_parrainage |
| **partenaires** | Partner/stylist profiles | user_id, code_partenaire, niveau, note_moyenne, portefeuille_solde |
| **employes** | Salon employee profiles | user_id, role_salon, specialites, pin_acces |
| **fournisseurs** | Supplier profiles | user_id, nom_entreprise |
| **candidatures** | Partner applications | telephone, prenom, nom, specialites, statut |
| **services** | Service catalog | nom, categorie, prix_salon, prix_domicile, duree_minutes |
| **rendez_vous** | Appointments | client_id, partenaire_id, service_id, date_rdv, heure_debut, statut |
| **plans** | Subscription plans | nom, prix, periode, features |
| **abonnements** | Active subscriptions | client_id, plan_id, statut, date_fin |
| **produits** | Product inventory | fournisseur_id, nom, prix, stock |
| **commandes** | Orders | partenaire_id, fournisseur_id, articles, total, statut |
| **transactions** | Financial transactions | type, montant, commission_kadio, reference_id |
| **virements** | Partner payouts | partenaire_id, montant, statut, date_demande |
| **chaises** | Chair rentals | nom, tarif_jour, tarif_semaine, tarif_mois |
| **reservations_chaise** | Chair bookings | chaise_id, partenaire_id, date_debut, date_fin |
| **articles_blog** | Blog content | titre, slug, contenu, publie, date_publication |
| **sms_logs** | SMS tracking | destinataire, template_id, contenu, statut |
| **formation_modules** | Training modules | titre, type, duree_minutes, ordre |
| **formation_etapes** | Module steps | module_id, titre, description, ordre |
| **formation_progression** | User training progress | user_id, module_id, statut, score |
| **quiz_questions** | Quiz questions | module_id, question, reponses, correcte |
| **salon_config** | Configuration | key, value |
| **parrainage** | Referral program | parrain_id, filleul_id, bonus_accorde |
| **cartes_cadeaux** | Gift cards | code, montant, solde_restant, statut |
| **tirage** | Lotteries | titre, date_tirage, lots |
| **tickets_tirage** | Lottery tickets | tirage_id, client_id, numero, statut |

## Common Queries

### Find a User
```sql
SELECT * FROM users WHERE telephone = '514-123-4567';
```

### Get Client's Upcoming Appointments
```sql
SELECT rv.*, s.nom as service_name, p.prenom, p.nom
FROM rendez_vous rv
JOIN clients c ON rv.client_id = c.id
JOIN services s ON rv.service_id = s.id
JOIN partenaires p ON rv.partenaire_id = p.id
WHERE c.id = 'CLIENT-UUID'
AND rv.date_rdv >= CURRENT_DATE
AND rv.statut IN ('confirme', 'en_attente')
ORDER BY rv.date_rdv;
```

### Get Partner's Available Time Slots
```sql
SELECT * FROM get_available_slots('PARTNER-UUID', '2026-05-01'::DATE);
```

### Book Appointment
```sql
INSERT INTO rendez_vous 
(code_qr, client_id, partenaire_id, service_id, date_rdv, heure_debut, heure_fin, lieu, montant, commission_kadio, statut)
VALUES 
('KADIO-RDV' || DATE_PART('epoch', NOW())::TEXT,
 'CLIENT-UUID',
 'PARTNER-UUID',
 (SELECT id FROM services WHERE nom = 'Knotless braids'),
 '2026-05-05'::DATE,
 '10:00'::TIME,
 '13:00'::TIME,
 'domicile',
 160.00,
 40.00,
 'confirme');
```

### Complete Appointment & Create Transaction
```sql
SELECT * FROM complete_rdv_with_transaction(
  'RDV-UUID'::UUID,
  5,  -- note (1-5)
  'Excellent service!'
);
```

### Get Partner Performance Metrics
```sql
SELECT * FROM get_partner_metrics('PARTNER-UUID'::UUID, 30);
```

### Get Dashboard Statistics
```sql
SELECT * FROM get_dashboard_stats();
```

### List Active Partners
```sql
SELECT u.prenom, u.nom, p.note_moyenne, p.niveau, p.portefeuille_solde
FROM partenaires p
JOIN users u ON p.user_id = u.id
WHERE p.statut = 'actif'
AND p.is_disponible = true
ORDER BY p.note_moyenne DESC;
```

### Get Top Services This Month
```sql
SELECT service_nom, COUNT(*) as bookings, SUM(montant) as revenue
FROM rendez_vous
WHERE statut = 'termine'
AND date_rdv >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY service_nom
ORDER BY bookings DESC;
```

### Partner's Monthly Revenue
```sql
SELECT 
  DATE_TRUNC('month', rv.date_rdv)::DATE as mois,
  SUM(rv.montant * 0.75) as revenue,  -- assuming domicile commission
  COUNT(*) as num_services
FROM rendez_vous rv
WHERE rv.partenaire_id = 'PARTNER-UUID'
AND rv.statut = 'termine'
GROUP BY mois
ORDER BY mois DESC;
```

### Client's Loyalty Points (from transactions)
```sql
SELECT SUM(montant) as total_spent, COUNT(*) as visits
FROM rendez_vous
WHERE client_id = 'CLIENT-UUID'
AND statut = 'termine'
AND date_rdv >= DATE_TRUNC('year', CURRENT_DATE);
```

### Check Client Block Status
```sql
SELECT is_bloque, no_show_count, motif_blocage
FROM clients
WHERE id = 'CLIENT-UUID';
```

### Record No-Show
```sql
SELECT * FROM record_no_show('RDV-UUID'::UUID);
```

### Get Client's Subscription Status
```sql
SELECT 
  c.id, u.prenom, u.nom, c.is_abonne,
  p.nom as plan_name, a.date_fin as expires,
  a.statut as subscription_status
FROM clients c
JOIN users u ON c.user_id = u.id
LEFT JOIN abonnements a ON c.id = a.client_id AND a.statut = 'actif'
LEFT JOIN plans p ON a.plan_id = p.id
WHERE c.id = 'CLIENT-UUID';
```

### Get Partner Training Progress
```sql
SELECT m.titre, fp.statut, fp.score, fp.date_complete
FROM formation_progression fp
JOIN formation_modules m ON fp.module_id = m.id
WHERE fp.user_id = 'USER-UUID'
AND m.type = 'partenaire'
ORDER BY m.ordre;
```

### Pending Partner Payouts
```sql
SELECT u.prenom, u.nom, v.montant, v.date_demande
FROM virements v
JOIN partenaires p ON v.partenaire_id = p.id
JOIN users u ON p.user_id = u.id
WHERE v.statut = 'en_attente'
ORDER BY v.date_demande;
```

## Common RLS Queries

### Check User's Roles
```sql
SELECT role, statut FROM roles WHERE user_id = auth.uid();
```

### View My Appointments (as Client)
```sql
SELECT * FROM vw_client_upcoming_rdv;
```

### View My Appointments (as Partner)
```sql
SELECT * FROM vw_partner_upcoming_rdv;
```

### View Today's Full Schedule (Admin Only)
```sql
SELECT * FROM vw_today_schedule ORDER BY heure_debut;
```

## Materialized Views for Reporting

### Monthly Revenue
```sql
SELECT * FROM monthly_revenue_summary LIMIT 12;
```

### Partner Leaderboard
```sql
SELECT * FROM partner_leaderboard WHERE niveau = 'elite' LIMIT 10;
```

### Top Services Analysis
```sql
SELECT * FROM top_services_view LIMIT 10;
```

### Client Subscription Status
```sql
SELECT * FROM client_subscription_status WHERE is_bloque = true;
```

## Data Insertion Examples

### Create New Service
```sql
INSERT INTO services (nom, categorie, prix_salon, prix_domicile, duree_minutes, actif)
VALUES ('Soin détox', 'Soins', 100, 140, 90, true);
```

### Create New Subscription Plan
```sql
INSERT INTO plans (nom, prix, periode, features, actif)
VALUES ('Locs Elite', 250, 'mensuel', '["Illimité", "Conseils", "Support VIP"]'::jsonb, true);
```

### Record SMS Send
```sql
INSERT INTO sms_logs (destinataire, template_id, contenu, statut)
VALUES ('514-123-4567', 'rdv-reminder-24h', 'Rappel: RDV demain à 10h avec Diane', 'envoye');
```

### Create Gift Card
```sql
INSERT INTO cartes_cadeaux (code, montant, solde_restant, beneficiaire_email, statut)
VALUES ('KADIO-GC-' || UPPER(MD5(RANDOM()::TEXT)::TEXT), 50.00, 50.00, 'client@email.com', 'active');
```

### Create Lottery
```sql
INSERT INTO tirage (titre, date_tirage, prix_ticket, lots, actif)
VALUES (
  'Grand Tirage Avril 2026',
  '2026-04-30'::DATE,
  5.00,
  '[{"nom": "Mèches Knotless", "valeur": 100}, {"nom": "Produits Kadio", "valeur": 50}]'::jsonb,
  true
);
```

## Functions & Stored Procedures

### Check if User Has Role
```sql
SELECT user_has_role('USER-UUID'::UUID, 'partenaire');
```

### Get User's Active Roles
```sql
SELECT * FROM get_user_roles('USER-UUID'::UUID);
```

### Generate Unique Partner Code
```sql
SELECT generate_partner_code('Diane Mbaye');
```

### Generate Referral Code
```sql
SELECT generate_referral_code('Aminata');
```

### Calculate Commission
```sql
SELECT calculate_commission(140.00, 'domicile');  -- Returns 105.00
SELECT calculate_commission(140.00, 'salon');     -- Returns 70.00
```

### Refresh All Materialized Views
```sql
SELECT refresh_all_materialized_views();
```

## Data Validation

### Ensure unique codes
```sql
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_partner_code ON partenaires(code_partenaire);
```

### Check service pricing consistency
```sql
SELECT nom FROM services WHERE prix_salon >= prix_domicile;
```

### Find orphaned records
```sql
SELECT * FROM rendez_vous WHERE client_id NOT IN (SELECT id FROM clients);
```

### Verify all users have roles
```sql
SELECT u.id FROM users u LEFT JOIN roles r ON u.id = r.user_id WHERE r.id IS NULL;
```

## Performance Optimization

### Analyze table statistics
```sql
ANALYZE users;
ANALYZE rendez_vous;
ANALYZE transactions;
```

### Check unused indexes
```sql
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;
```

### Monitor slow queries
```sql
SELECT query, mean_exec_time, calls 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;
```

## Troubleshooting

### Reset no-show count (admin)
```sql
UPDATE clients SET no_show_count = 0 WHERE id = 'CLIENT-UUID';
```

### Unblock client (admin)
```sql
UPDATE clients SET is_bloque = false, motif_blocage = NULL WHERE id = 'CLIENT-UUID';
```

### Manually update partner rating
```sql
SELECT update_partner_rating('PARTNER-UUID'::UUID);
```

### Check RLS policies
```sql
SELECT * FROM pg_policies WHERE tablename = 'rendez_vous';
```

### Disable RLS temporarily (admin)
```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
-- ... do work ...
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

## Useful Constants

### Commission Rates
- Salon: 50% partner / 25% Kadio
- Domicile: 75% partner / 25% Kadio

### No-Show Policy
- 1 warning (no-show count = 1)
- 2 blocks account (no_show_count >= 2)

### Partner Levels
- Partenaire (default)
- Certifié (4.5+ rating, 50+ services)
- Élite (4.7+ rating, 100+ services)
- Ambassadeur (4.8+ rating, 150+ services)

### Service Categories
- Tresses, Knotless, Locs, Tissage, Barbier, Soins

### RDV Status Flow
- en_attente → confirme → en_cours → termine
- Any → annule (can cancel anytime)
- Any → no_show (if client doesn't show)

### Subscription Statuses
- actif (paying, active)
- suspendu (paused)
- resilie (cancelled)
- en_attente (awaiting payment)

## Version History
- **v1.0** — April 2026 — Initial schema, 28 tables, 13 functions, 7 views

---

For detailed information, see:
- `README.md` — Full documentation
- `MIGRATION_SUMMARY.md` — Complete overview
- `/migrations/001_initial_schema.sql` — Source of truth for schema
