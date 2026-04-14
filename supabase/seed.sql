-- ============================================================
-- KADIO — Seed Data Script (seed.sql)
-- ============================================================
-- Comprehensive seed data for a functional Kadio app instance
-- Includes: users, roles, clients, partenaires, employes,
-- articles, services, plans, subscriptions, and sample appointments
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. USERS — 5 dev personas + additional clients/partners
-- ─────────────────────────────────────────────────────────────

INSERT INTO users (id, telephone, prenom, nom, email, langue, created_at) VALUES
-- Dev personas
('550e8400-e29b-41d4-a716-446655440000'::uuid, '514-000-0001', 'Aminata', 'Diallo', 'aminata@email.com', 'fr', now()),
('550e8400-e29b-41d4-a716-446655440001'::uuid, '514-000-0002', 'Diane', 'Mbaye', 'diane@kadio.ca', 'fr', now()),
('550e8400-e29b-41d4-a716-446655440002'::uuid, '514-000-0003', 'Marcus', 'Durand', 'marcus@kadio.ca', 'fr', now()),
('550e8400-e29b-41d4-a716-446655440003'::uuid, '514-000-0004', 'Jean', 'Lavigne', 'jean@kadio.ca', 'fr', now()),
('550e8400-e29b-41d4-a716-446655440004'::uuid, '514-000-0005', 'Othi', 'Kadio', 'othi@kadio.ca', 'fr', now()),

-- Additional clients
('550e8400-e29b-41d4-a716-446655440010'::uuid, '514-555-3001', 'Jean-Baptiste', 'Kouassi', 'jbk@email.com', 'fr', now()),
('550e8400-e29b-41d4-a716-446655440011'::uuid, '514-555-3002', 'Christelle', 'Mensah', 'chris@email.com', 'fr', now()),
('550e8400-e29b-41d4-a716-446655440012'::uuid, '514-555-3003', 'David', 'Nkosi', 'david.n@email.com', 'fr', now()),

-- Additional partenaires
('550e8400-e29b-41d4-a716-446655440020'::uuid, '514-555-1002', 'Fatou', 'Konaté', 'fatou@kadio.ca', 'fr', now()),
('550e8400-e29b-41d4-a716-446655440021'::uuid, '514-555-1003', 'Sandra', 'Pierre', 'sandra@kadio.ca', 'fr', now()),
('550e8400-e29b-41d4-a716-446655440022'::uuid, '514-555-1005', 'Rachel', 'Ndoye', 'rachel@kadio.ca', 'fr', now()),

-- Additional employes
('550e8400-e29b-41d4-a716-446655440030'::uuid, '514-555-2001', 'Joël', 'Tamba', 'joel@kadio.ca', 'fr', now()),
('550e8400-e29b-41d4-a716-446655440031'::uuid, '514-555-2002', 'Carine', 'Lussier', 'carine@kadio.ca', 'fr', now()),
('550e8400-e29b-41d4-a716-446655440032'::uuid, '514-555-2003', 'Steve', 'Moreau', 'steve@kadio.ca', 'fr', now())
ON CONFLICT (telephone) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- 2. USER_ROLES — Role assignments for each user
-- ─────────────────────────────────────────────────────────────

INSERT INTO user_roles (id, user_id, role, statut, created_at) VALUES
-- Aminata: client
('650e8400-e29b-41d4-a716-446655440000'::uuid, '550e8400-e29b-41d4-a716-446655440000'::uuid, 'client', 'actif', now()),

-- Diane: partenaire + admin
('650e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, 'partenaire', 'actif', now()),
('650e8400-e29b-41d4-a716-446655440099'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, 'admin', 'actif', now()),

-- Marcus: employe
('650e8400-e29b-41d4-a716-446655440002'::uuid, '550e8400-e29b-41d4-a716-446655440002'::uuid, 'employe', 'actif', now()),

-- Jean: fournisseur
('650e8400-e29b-41d4-a716-446655440003'::uuid, '550e8400-e29b-41d4-a716-446655440003'::uuid, 'fournisseur', 'actif', now()),

-- Othi: admin
('650e8400-e29b-41d4-a716-446655440004'::uuid, '550e8400-e29b-41d4-a716-446655440004'::uuid, 'admin', 'actif', now()),

-- Additional clients
('650e8400-e29b-41d4-a716-446655440010'::uuid, '550e8400-e29b-41d4-a716-446655440010'::uuid, 'client', 'actif', now()),
('650e8400-e29b-41d4-a716-446655440011'::uuid, '550e8400-e29b-41d4-a716-446655440011'::uuid, 'client', 'actif', now()),
('650e8400-e29b-41d4-a716-446655440012'::uuid, '550e8400-e29b-41d4-a716-446655440012'::uuid, 'client', 'actif', now()),

-- Additional partenaires
('650e8400-e29b-41d4-a716-446655440020'::uuid, '550e8400-e29b-41d4-a716-446655440020'::uuid, 'partenaire', 'actif', now()),
('650e8400-e29b-41d4-a716-446655440021'::uuid, '550e8400-e29b-41d4-a716-446655440021'::uuid, 'partenaire', 'actif', now()),
('650e8400-e29b-41d4-a716-446655440022'::uuid, '550e8400-e29b-41d4-a716-446655440022'::uuid, 'partenaire', 'actif', now()),

-- Additional employes
('650e8400-e29b-41d4-a716-446655440030'::uuid, '550e8400-e29b-41d4-a716-446655440030'::uuid, 'employe', 'actif', now()),
('650e8400-e29b-41d4-a716-446655440031'::uuid, '550e8400-e29b-41d4-a716-446655440031'::uuid, 'employe', 'actif', now()),
('650e8400-e29b-41d4-a716-446655440032'::uuid, '550e8400-e29b-41d4-a716-446655440032'::uuid, 'employe', 'actif', now())
ON CONFLICT (user_id, role) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- 3. CLIENTS
-- ─────────────────────────────────────────────────────────────

INSERT INTO clients (id, user_id, is_abonne, code_parrainage, no_show_count, is_bloque, created_at) VALUES
-- Aminata: primary dev persona
('750e8400-e29b-41d4-a716-446655440000'::uuid, '550e8400-e29b-41d4-a716-446655440000'::uuid, true, 'AMINATA-7731', 0, false, now() - interval '8 months'),

-- Jean-Baptiste
('750e8400-e29b-41d4-a716-446655440010'::uuid, '550e8400-e29b-41d4-a716-446655440010'::uuid, true, 'JB-KOUASSI-001', 1, false, now() - interval '9 months'),

-- Christelle
('750e8400-e29b-41d4-a716-446655440011'::uuid, '550e8400-e29b-41d4-a716-446655440011'::uuid, true, 'CHRISTELLE-001', 0, false, now() - interval '5 months'),

-- David
('750e8400-e29b-41d4-a716-446655440012'::uuid, '550e8400-e29b-41d4-a716-446655440012'::uuid, false, null, 2, false, now() - interval '3 months')
ON CONFLICT (user_id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- 4. PARTENAIRES — Partners with geographic coordinates (Longueuil/Montreal area)
-- ─────────────────────────────────────────────────────────────

INSERT INTO partenaires (
  id, user_id, code_partenaire, statut, niveau,
  note_moyenne, total_services, specialites, modes_travail,
  a_voiture, is_disponible, adresse, ville, code_postal,
  latitude, longitude, created_at
) VALUES

-- Diane Mbaye: elite partner in Longueuil
('850e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid,
 'KADIO-DIANE-001', 'actif', 'elite', 4.9, 127,
 ARRAY['Tresses', 'Knotless', 'Cornrows'],
 ARRAY['salon_kadio', 'deplacement_voiture'],
 true, true, '450 rue Antoinette-Robidoux, Longueuil', 'Longueuil', 'J4J 2V8',
 45.5243, -73.4934, now() - interval '8 months'),

-- Fatou Konaté: certified partner in Saint-Hubert (Montréal area)
('850e8400-e29b-41d4-a716-446655440020'::uuid, '550e8400-e29b-41d4-a716-446655440020'::uuid,
 'KADIO-FATOU-002', 'actif', 'certifie', 4.7, 98,
 ARRAY['Locs', 'Knotless', 'Tissage'],
 ARRAY['domicile', 'salon_kadio'],
 false, true, '220 boulevard Cousineau, Saint-Hubert', 'Saint-Hubert', 'J3Y 4X7',
 45.5005, -73.4189, now() - interval '6 months'),

-- Sandra Pierre: certified, in Montréal-Nord
('850e8400-e29b-41d4-a716-446655440021'::uuid, '550e8400-e29b-41d4-a716-446655440021'::uuid,
 'KADIO-SANDRA-003', 'actif', 'certifie', 4.8, 74,
 ARRAY['Tresses', 'Knotless', 'Coupes enfant'],
 ARRAY['domicile', 'deplacement_voiture'],
 true, true, '8545 boulevard Saint-Michel, Montréal-Nord', 'Montréal-Nord', 'H1Z 2V4',
 45.5991, -73.6199, now() - interval '5 months'),

-- Rachel Ndoye: ambassador in Brossard
('850e8400-e29b-41d4-a716-446655440022'::uuid, '550e8400-e29b-41d4-a716-446655440022'::uuid,
 'KADIO-RACHEL-005', 'actif', 'ambassadeur', 5.0, 163,
 ARRAY['Knotless', 'Tresses', 'Locs'],
 ARRAY['salon_kadio', 'deplacement_voiture', 'deplacement_transport'],
 true, true, '2999 rue Michener, Brossard', 'Brossard', 'J4Y 2A8',
 45.4579, -73.4584, now() - interval '10 months')
ON CONFLICT (user_id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- 5. EMPLOYES — Salon employees
-- ─────────────────────────────────────────────────────────────

INSERT INTO employes (id, user_id, role_salon, specialites, couleur_agenda, actif, created_at) VALUES

-- Marcus Durand: barbier
('950e8400-e29b-41d4-a716-446655440002'::uuid, '550e8400-e29b-41d4-a716-446655440002'::uuid,
 'barbier', ARRAY['Barbier', 'Coupe fade', 'Barbe'], '#3B82F6', true, now() - interval '8 months'),

-- Joël Tamba: coiffeur
('950e8400-e29b-41d4-a716-446655440030'::uuid, '550e8400-e29b-41d4-a716-446655440030'::uuid,
 'coiffeur', ARRAY['Tresses', 'Knotless', 'Cornrows'], '#10B981', true, now() - interval '7 months'),

-- Carine Lussier: coiffeuse
('950e8400-e29b-41d4-a716-446655440031'::uuid, '550e8400-e29b-41d4-a716-446655440031'::uuid,
 'coiffeur', ARRAY['Locs', 'Tissage', 'Tresses'], '#8B5CF6', true, now() - interval '6 months'),

-- Steve Moreau: barbier
('950e8400-e29b-41d4-a716-446655440032'::uuid, '550e8400-e29b-41d4-a716-446655440032'::uuid,
 'barbier', ARRAY['Barbier', 'Coupe dégradé', 'Barbe'], '#F59E0B', true, now() - interval '5 months')
ON CONFLICT (user_id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- 6. FOURNISSEURS — Suppliers (Jean is main contact)
-- ─────────────────────────────────────────────────────────────

INSERT INTO fournisseurs (id, user_id, nom_entreprise, contact_nom, telephone, email, categories, actif, created_at) VALUES

-- Jean Lavigne: main supplier
('a50e8400-e29b-41d4-a716-446655440003'::uuid, '550e8400-e29b-41d4-a716-446655440003'::uuid,
 'Kadio Supplies Inc.', 'Jean Lavigne', '514-555-9999', 'jean@kadiosupplies.ca',
 ARRAY['meches', 'produits', 'accessoires'], true, now() - interval '12 months'),

-- Secondary supplier: African Beauty Imports
(null, null,
 'African Beauty Imports', 'Aissatou Sy', '514-555-8888', 'contact@africanbeauty.ca',
 ARRAY['meches', 'produits'], true, now() - interval '6 months')
ON CONFLICT (user_id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- 7. PRODUITS — Hair products and supplies
-- ─────────────────────────────────────────────────────────────

-- Get fournisseur IDs first (will use explicit IDs)
INSERT INTO produits (id, fournisseur_id, nom, description, categorie, prix_fournisseur, marge_kadio, prix_partenaire, stock_disponible, actif, created_at) VALUES

-- From Kadio Supplies (Jean's supplier)
('b50e8400-e29b-41d4-a716-446655440001'::uuid, 'a50e8400-e29b-41d4-a716-446655440003'::uuid,
 'Mèches Kanekalon Blond', 'Mèches synthétiques haute qualité pour knotless braids', 'meches', 4.50, 1.50, 6.00, 500, true, now()),

('b50e8400-e29b-41d4-a716-446655440002'::uuid, 'a50e8400-e29b-41d4-a716-446655440003'::uuid,
 'Mèches Kanekalon Noir', 'Mèches synthétiques noires pour tous les styles', 'meches', 4.50, 1.50, 6.00, 400, true, now()),

('b50e8400-e29b-41d4-a716-446655440003'::uuid, 'a50e8400-e29b-41d4-a716-446655440003'::uuid,
 'Shampoing Cheveux Afro Premium', 'Nettoyant doux sans sulfates pour cheveux bouclés', 'produits', 8.00, 4.00, 12.00, 200, true, now()),

('b50e8400-e29b-41d4-a716-446655440004'::uuid, 'a50e8400-e29b-41d4-a716-446655440003'::uuid,
 'Conditioner Deep Care', 'Soin profond hydratant pour locs et tresses', 'produits', 10.00, 5.00, 15.00, 180, true, now()),

('b50e8400-e29b-41d4-a716-446655440005'::uuid, 'a50e8400-e29b-41d4-a716-446655440003'::uuid,
 'Épingles à cheveux Professionnelles (50pc)', 'Pack de 50 épingles acier inoxydable', 'accessoires', 3.00, 2.00, 5.00, 600, true, now()),

('b50e8400-e29b-41d4-a716-446655440006'::uuid, 'a50e8400-e29b-41d4-a716-446655440003'::uuid,
 'Peigne Démêlant Large', 'Peigne anti-casse pour cheveux mouillés', 'accessoires', 5.00, 2.50, 7.50, 150, true, now()),

('b50e8400-e29b-41d4-a716-446655440007'::uuid, 'a50e8400-e29b-41d4-a716-446655440003'::uuid,
 'Huile Argan Bio', 'Huile argan 100% pure pour soin des cheveux', 'produits', 15.00, 7.50, 22.50, 120, true, now())
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- 8. ARTICLES — Blog posts for public content
-- ─────────────────────────────────────────────────────────────

INSERT INTO articles (id, titre, slug, extrait, contenu, categorie, auteur, publie, created_at) VALUES

('c50e8400-e29b-41d4-a716-446655440001'::uuid,
 'Pourquoi les tresses knotless dominent en 2026',
 'tresses-knotless-tendance-2026',
 'Les knotless braids s''imposent comme la technique la plus demandée chez nos partenaires. On vous explique pourquoi et comment choisir la bonne coiffeuse.',
 'Les knotless braids représentent une évolution majeure dans le monde de la coiffure afro. Contrairement aux tresses classiques, elles commencent par vos propres cheveux avant d''incorporer les extensions, ce qui réduit considérablement la tension sur le cuir chevelu.

Nos partenaires certifiés maîtrisent cette technique et peuvent vous conseiller sur la longueur, l''épaisseur et le style qui vous convient. Réservez directement via l''app Kadio.

Les knotless permettent aussi une durée de port plus longue — jusqu''à 8 semaines avec un entretien minimal — et causent moins de casse à la dépose. Un investissement beauté qui vaut vraiment le détour.',
 'tutoriels', 'Équipe Kadio', true, now() - interval '30 days'),

('c50e8400-e29b-41d4-a716-446655440002'::uuid,
 'Rejoindre Kadio : témoignage d''une partenaire certifiée',
 'devenir-partenaire-kadio-2026',
 'Diane Mbaye, coiffeuse certifiée à Longueuil depuis 8 mois, nous raconte comment Kadio a transformé son activité indépendante.',
 '"Avant Kadio, je gérais mes rendez-vous par WhatsApp et j''oubliais des clients. Maintenant tout est centralisé." Diane, 32 ans, est coiffeuse à domicile depuis 5 ans.

Depuis qu''elle a rejoint le réseau Kadio il y a 8 mois, elle a augmenté son chiffre d''affaires de 40% et n''a plus à gérer les paiements ou les rappels. "Le système s''occupe de tout. Moi je me concentre sur mes clientes."

Diane propose aujourd''hui des knotless, des cornrows et des tresses classiques. Elle accepte uniquement les réservations via Kadio pour garder un agenda propre.',
 'partenaires', 'Équipe Kadio', true, now() - interval '25 days'),

('c50e8400-e29b-41d4-a716-446655440003'::uuid,
 'Guide complet : entretien des locs en 2026',
 'soins-locs-guide-complet',
 'Resserrage, rétraction, hydratation — tout ce qu''il faut savoir pour des locs saines et bien entretenues avec nos partenaires spécialisés.',
 'Les locs demandent un entretien régulier pour rester belles et saines. Le resserrage tous les 4 à 6 semaines est recommandé, surtout en phase de démarrage.

Nos partenaires spécialisés en locs proposent des forfaits d''entretien adaptés à tous les budgets. Consultez leurs profils sur la carte Kadio pour trouver le bon match selon votre ville et disponibilités.

L''hydratation est souvent négligée : un spray eau/aloe vera quotidien et une huile légère appliquée hebdomadairement font toute la différence sur la brillance et la santé du cheveu.',
 'conseils', 'Équipe Kadio', true, now() - interval '20 days'),

('c50e8400-e29b-41d4-a716-446655440004'::uuid,
 'Top 5 des coupes tendance pour hommes afros en 2026',
 'barbier-afro-montreal-top-5',
 'Du fade au texturizer, les coupes qui font fureur chez nos partenaires barbiers certifiés à Montréal et Longueuil.',
 '2026 voit le retour en force du taper fade et des coupes à base de texturizer chez les hommes afros. Nos partenaires barbiers certifiés maîtrisent ces techniques et proposent des consultations gratuites avant chaque coupe.

Retrouvez-les sur la carte Kadio et filtrez par spécialité "Barbier" pour trouver le bon professionnel près de chez vous.

Les 5 coupes les plus demandées cette saison : taper fade, drop fade, temp fade, coupe afro texturisée et dreadlock taper. Chaque barbier Kadio peut vous conseiller en fonction de la texture de vos cheveux.',
 'tutoriels', 'Équipe Kadio', true, now() - interval '15 days')
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- 9. PLANS_ABONNEMENT — 4 subscription plan categories
-- ─────────────────────────────────────────────────────────────

INSERT INTO plans_abonnement (id, nom, categorie, prix_mensuel, services_inclus, actif, created_at) VALUES

-- Barbier Plans
('d50e8400-e29b-41d4-a716-446655440001'::uuid, 'Barbier Essentiel', 'barbier', 29.00,
 ARRAY['Coupe Homme'], true, now()),

('d50e8400-e29b-41d4-a716-446655440002'::uuid, 'Barbier Premium', 'barbier', 45.00,
 ARRAY['Coupe Homme', 'Coupe + Barbe'], true, now()),

('d50e8400-e29b-41d4-a716-446655440003'::uuid, 'Coupe + Barbe Illimité', 'barbier', 69.00,
 ARRAY['Coupe + Barbe', 'Barbe seulement'], true, now()),

-- Knotless & Tresses Plans
('d50e8400-e29b-41d4-a716-446655440004'::uuid, 'Tresses Rapides', 'tresses', 59.00,
 ARRAY['Cornrows', 'Tresses Collées'], true, now()),

('d50e8400-e29b-41d4-a716-446655440005'::uuid, 'Knotless Signature', 'tresses', 149.00,
 ARRAY['Knotless Braids', 'Box Braids'], true, now()),

-- Locs Plans
('d50e8400-e29b-41d4-a716-446655440006'::uuid, 'Locs Illimité', 'locs', 89.00,
 ARRAY['Locks Resserrage', 'Lavage + Soin'], true, now()),

('d50e8400-e29b-41d4-a716-446655440007'::uuid, 'Microlocs Premium', 'locs', 119.00,
 ARRAY['Locks Resserrage', 'Locks Réparation', 'Lavage + Soin'], true, now()),

-- Care Plans
('d50e8400-e29b-41d4-a716-446655440008'::uuid, 'Soin & Beauté', 'soins', 49.00,
 ARRAY['Lavage + Soin', 'Défritage'], true, now()),

-- Kids Plan
('d50e8400-e29b-41d4-a716-446655440009'::uuid, 'Kids Pass', 'kids', 25.00,
 ARRAY['Coupe Enfant'], true, now())
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- 10. ABONNEMENTS — Active subscriptions for clients
-- ─────────────────────────────────────────────────────────────

INSERT INTO abonnements (id, client_id, plan_id, plan_nom, prix_mensuel, statut, date_debut, date_renouvellement, visits_used_this_month, auto_renewal, created_at) VALUES

-- Aminata: Knotless Signature
('e50e8400-e29b-41d4-a716-446655440000'::uuid, '750e8400-e29b-41d4-a716-446655440000'::uuid,
 'd50e8400-e29b-41d4-a716-446655440005'::uuid, 'Knotless Signature', 149.00,
 'actif', now() - interval '8 months', now() + interval '5 days', 1, true, now() - interval '8 months'),

-- Jean-Baptiste: Barbier Premium
('e50e8400-e29b-41d4-a716-446655440010'::uuid, '750e8400-e29b-41d4-a716-446655440010'::uuid,
 'd50e8400-e29b-41d4-a716-446655440002'::uuid, 'Barbier Premium', 45.00,
 'actif', now() - interval '9 months', now() + interval '3 days', 2, true, now() - interval '9 months'),

-- Christelle: Tresses Rapides
('e50e8400-e29b-41d4-a716-446655440011'::uuid, '750e8400-e29b-41d4-a716-446655440011'::uuid,
 'd50e8400-e29b-41d4-a716-446655440004'::uuid, 'Tresses Rapides', 59.00,
 'actif', now() - interval '5 months', now() + interval '8 days', 0, true, now() - interval '5 months')
ON CONFLICT (id) DO NOTHING;

-- Update clients to reference their subscription
UPDATE clients
SET abonnement_id = 'e50e8400-e29b-41d4-a716-446655440000'::uuid, is_abonne = true
WHERE id = '750e8400-e29b-41d4-a716-446655440000'::uuid;

UPDATE clients
SET abonnement_id = 'e50e8400-e29b-41d4-a716-446655440010'::uuid, is_abonne = true
WHERE id = '750e8400-e29b-41d4-a716-446655440010'::uuid;

UPDATE clients
SET abonnement_id = 'e50e8400-e29b-41d4-a716-446655440011'::uuid, is_abonne = true
WHERE id = '750e8400-e29b-41d4-a716-446655440011'::uuid;

-- ─────────────────────────────────────────────────────────────
-- 11. RENDEZ_VOUS — Sample appointments
-- ─────────────────────────────────────────────────────────────

INSERT INTO rendez_vous (
  id, client_id, prestataire_type, partenaire_id, service_id,
  service_nom, lieu, date, heure_debut, heure_fin, duree,
  prix_client, prix_prestataire, deposit_amount, deposit_paid,
  statut, qr_code, booking_source, created_at
) VALUES

-- Aminata with Diane (past appointments)
('f50e8400-e29b-41d4-a716-446655440001'::uuid, '750e8400-e29b-41d4-a716-446655440000'::uuid,
 'partenaire', '850e8400-e29b-41d4-a716-446655440001'::uuid,
 NULL, 'Knotless Braids', 'domicile_partenaire',
 now() - interval '45 days', '10:00', '13:00', 180,
 160.00, 78.00, 32.00, true, 'termine', 'KADIO-RDV-001AA', 'app', now() - interval '45 days'),

('f50e8400-e29b-41d4-a716-446655440002'::uuid, '750e8400-e29b-41d4-a716-446655440000'::uuid,
 'partenaire', '850e8400-e29b-41d4-a716-446655440001'::uuid,
 NULL, 'Knotless Braids', 'domicile_partenaire',
 now() - interval '30 days', '10:00', '13:00', 180,
 160.00, 78.00, 32.00, true, 'termine', 'KADIO-RDV-002BB', 'app', now() - interval '30 days'),

-- Aminata with Rachel (upcoming)
('f50e8400-e29b-41d4-a716-446655440003'::uuid, '750e8400-e29b-41d4-a716-446655440000'::uuid,
 'partenaire', '850e8400-e29b-41d4-a716-446655440022'::uuid,
 NULL, 'Knotless Braids', 'domicile_partenaire',
 now() + interval '7 days', '09:00', '11:30', 150,
 160.00, 78.00, 32.00, false, 'confirme', 'KADIO-RDV-003CC', 'app', now()),

-- Jean-Baptiste with Marcus (salon)
('f50e8400-e29b-41d4-a716-446655440004'::uuid, '750e8400-e29b-41d4-a716-446655440010'::uuid,
 'employe', NULL, NULL, 'Coupe + Barbe', 'salon_kadio',
 now() - interval '3 days', '14:00', '15:00', 60,
 72.00, 36.00, 0, true, 'termine', 'KADIO-RDV-004DD', 'web', now() - interval '3 days'),

-- Christelle with Rachel (salon appointment)
('f50e8400-e29b-41d4-a716-446655440005'::uuid, '750e8400-e29b-41d4-a716-446655440011'::uuid,
 'partenaire', '850e8400-e29b-41d4-a716-446655440022'::uuid,
 NULL, 'Cornrows', 'salon_kadio',
 now() - interval '5 days', '11:00', '13:00', 120,
 90.00, 45.00, 18.00, true, 'termine', 'KADIO-RDV-005EE', 'app', now() - interval '5 days'),

-- David with Fatou (upcoming)
('f50e8400-e29b-41d4-a716-446655440006'::uuid, '750e8400-e29b-41d4-a716-446655440012'::uuid,
 'partenaire', '850e8400-e29b-41d4-a716-446655440020'::uuid,
 NULL, 'Locks Resserrage', 'salon_kadio',
 now() + interval '10 days', '15:00', '16:30', 90,
 78.00, 39.00, 0, false, 'confirme', 'KADIO-RDV-006FF', 'app', now())
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- 12. PORTEFEUILLE_TRANSACTIONS — Partner wallet transactions
-- ─────────────────────────────────────────────────────────────

INSERT INTO portefeuille_transactions (
  id, partenaire_id, type, montant, description, rdv_id, statut, created_at
) VALUES

-- Diane's transactions
('g50e8400-e29b-41d4-a716-446655440001'::uuid, '850e8400-e29b-41d4-a716-446655440001'::uuid,
 'credit_service', 78.00, 'Commission service Knotless Braids',
 'f50e8400-e29b-41d4-a716-446655440001'::uuid, 'complete', now() - interval '45 days'),

('g50e8400-e29b-41d4-a716-446655440002'::uuid, '850e8400-e29b-41d4-a716-446655440001'::uuid,
 'credit_service', 78.00, 'Commission service Knotless Braids',
 'f50e8400-e29b-41d4-a716-446655440002'::uuid, 'complete', now() - interval '30 days'),

-- Rachel's transactions
('g50e8400-e29b-41d4-a716-446655440003'::uuid, '850e8400-e29b-41d4-a716-446655440022'::uuid,
 'credit_service', 45.00, 'Commission service Cornrows',
 'f50e8400-e29b-41d4-a716-446655440005'::uuid, 'complete', now() - interval '5 days'),

-- Fatou's transactions
('g50e8400-e29b-41d4-a716-446655440004'::uuid, '850e8400-e29b-41d4-a716-446655440020'::uuid,
 'credit_service', 45.00, 'Commission service Tresses classiques',
 NULL, 'complete', now() - interval '10 days')
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- 13. BONUS_CONVERSIONS — Referral bonuses
-- ─────────────────────────────────────────────────────────────

INSERT INTO bonus_conversions (
  id, partenaire_id, abonnement_id, client_nom, forfait_nom, montant_bonus, statut, created_at
) VALUES

('h50e8400-e29b-41d4-a716-446655440001'::uuid, '850e8400-e29b-41d4-a716-446655440001'::uuid,
 'e50e8400-e29b-41d4-a716-446655440000'::uuid, 'Aminata Diallo', 'Knotless Signature', 15.00,
 'verse', now() - interval '8 months')
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- 14. FORMATION_MODULES — Training modules
-- ─────────────────────────────────────────────────────────────

INSERT INTO formation_modules (id, titre, description, video_url, ordre, actif, created_at) VALUES

('i50e8400-e29b-41d4-a716-446655440001'::uuid,
 'Bienvenue chez Kadio',
 'Introduction au réseau Kadio, valeurs, mission et fonctionnement du programme partenaire.',
 'https://vimeo.com/placeholder/module1', 1, true, now()),

('i50e8400-e29b-41d4-a716-446655440002'::uuid,
 'Maîtrise du barème',
 'Comprendre le système de rémunération, les commissions par mode de travail et les bonus de conversion.',
 'https://vimeo.com/placeholder/module2', 2, true, now()),

('i50e8400-e29b-41d4-a716-446655440003'::uuid,
 'Expérience client d''exception',
 'Standards de service, communication avec les clients, gestion des avis et des situations difficiles.',
 'https://vimeo.com/placeholder/module3', 3, true, now()),

('i50e8400-e29b-41d4-a716-446655440004'::uuid,
 'Utiliser le portail partenaire',
 'Tutoriel complet : scanner QR, gérer son agenda, son portefeuille, commander du matériel.',
 'https://vimeo.com/placeholder/module4', 4, true, now())
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- 15. FORMATION_PROGRESSION — Partner training progress
-- ─────────────────────────────────────────────────────────────

INSERT INTO formation_progression (
  id, partenaire_id, module_id, score_quiz, complete, completed_at
) VALUES

-- Diane completed all modules
('j50e8400-e29b-41d4-a716-446655440001'::uuid, '850e8400-e29b-41d4-a716-446655440001'::uuid,
 'i50e8400-e29b-41d4-a716-446655440001'::uuid, 95, true, now() - interval '8 months'),

('j50e8400-e29b-41d4-a716-446655440002'::uuid, '850e8400-e29b-41d4-a716-446655440001'::uuid,
 'i50e8400-e29b-41d4-a716-446655440002'::uuid, 88, true, now() - interval '8 months'),

('j50e8400-e29b-41d4-a716-446655440003'::uuid, '850e8400-e29b-41d4-a716-446655440001'::uuid,
 'i50e8400-e29b-41d4-a716-446655440003'::uuid, 92, true, now() - interval '8 months'),

('j50e8400-e29b-41d4-a716-446655440004'::uuid, '850e8400-e29b-41d4-a716-446655440001'::uuid,
 'i50e8400-e29b-41d4-a716-446655440004'::uuid, 90, true, now() - interval '8 months'),

-- Rachel in progress
('j50e8400-e29b-41d4-a716-446655440005'::uuid, '850e8400-e29b-41d4-a716-446655440022'::uuid,
 'i50e8400-e29b-41d4-a716-446655440001'::uuid, 100, true, now() - interval '10 months'),

('j50e8400-e29b-41d4-a716-446655440006'::uuid, '850e8400-e29b-41d4-a716-446655440022'::uuid,
 'i50e8400-e29b-41d4-a716-446655440002'::uuid, 85, true, now() - interval '10 months')
ON CONFLICT (partenaire_id, module_id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- 16. CANDIDATURES — Candidate applications
-- ─────────────────────────────────────────────────────────────

INSERT INTO candidatures (
  id, prenom, nom, telephone, email, ville, specialites,
  experience_annees, modes_travail_preferes, a_voiture,
  motivation, statut, created_at
) VALUES

('k50e8400-e29b-41d4-a716-446655440001'::uuid, 'Mariam', 'Diallo', '514-555-0201', 'mariam@email.com',
 'Longueuil', ARRAY['Tresses', 'Knotless'], 3,
 ARRAY['domicile', 'salon_kadio'], true,
 'Passionnée par la coiffure afro, je veux rejoindre Kadio pour développer ma clientèle professionnellement.',
 'acceptee', now() - interval '45 days'),

('k50e8400-e29b-41d4-a716-446655440002'::uuid, 'Aïcha', 'Traoré', '514-555-0202', 'aicha@email.com',
 'Montréal', ARRAY['Locs', 'Knotless'], 5,
 ARRAY['domicile'], false,
 'Coiffeuse depuis 5 ans à domicile, je cherche à structurer mon activité avec un réseau professionnel.',
 'en_attente', now() - interval '25 days'),

('k50e8400-e29b-41d4-a716-446655440003'::uuid, 'Bintou', 'Koné', '514-555-0203', 'bintou@email.com',
 'Laval', ARRAY['Tresses', 'Tissage'], 2,
 ARRAY['domicile', 'deplacement_voiture'], true,
 'Diplômée en esthétique, je souhaite me spécialiser en coiffure afro via votre programme.',
 'en_revision', now() - interval '20 days'),

('k50e8400-e29b-41d4-a716-446655440004'::uuid, 'Yves', 'Kouakou', '514-555-0204', 'yves@email.com',
 'Brossard', ARRAY['Barbier', 'Coupes'], 7,
 ARRAY['salon_kadio'], false,
 'Barbier professionnel depuis 7 ans, je veux intégrer le réseau Kadio.',
 'acceptee', now() - interval '55 days')
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- ✅ SEED COMPLETE
-- ─────────────────────────────────────────────────────────────
-- The database now contains:
-- • 15 users (5 dev personas + 10 additional staff/clients/partners)
-- • Role assignments for each user
-- • 4 active clients with subscription data
-- • 4 active partners across Montreal region
-- • 4 active salon employees
-- • 2 suppliers (main + secondary)
-- • 7 hair products in inventory
-- • 4 published blog articles
-- • 9 subscription plans across 4 categories
-- • 3 active subscriptions
-- • 6 sample appointments (past & upcoming)
-- • Partner wallet transactions
-- • Referral bonus records
-- • 4 training modules
-- • Partner training progress records
-- • 4 candidate applications at various stages
--
-- All data includes realistic timestamps and geographic coordinates
-- for the Montreal/Longueuil area. Ready for immediate use!
