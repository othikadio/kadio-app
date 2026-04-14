-- ============================================================
-- KADIO — Migration 003 : Données initiales
-- Barème 16 services × 3 modes, 9 plans, frais déplacement,
-- 4 chaises salon, 4 modules formation, salon_config
-- ============================================================

-- ─── SERVICES + BARÈME ───────────────────────────────────────
-- Barème fixe partenaires (tel que spécifié dans le cahier des charges)
-- commission_employe = 50% du prix_salon
-- Frais de déplacement NON inclus ici (table séparée)

INSERT INTO services (nom, categorie, duree, prix_salon, prix_domicile, prix_deplacement,
  commission_employe, commission_partenaire_salon, commission_partenaire_domicile, commission_partenaire_deplacement,
  require_deposit, deposit_percentage) VALUES

-- Tresses
('Knotless Braids',      'tresses', 240, 160, 120, 136, 80,  78, 58, 66, true,  20),
('Box Braids',           'tresses', 210, 130, 98,  111, 65,  65, 49, 55, true,  20),
('Cornrows',             'tresses', 120,  90, 68,   77, 45,  45, 34, 38, true,  20),
('Tresses Collées',      'tresses', 150, 104, 78,   89, 52,  52, 39, 44, true,  20),
('Extension Tresses',    'tresses', 180, 124, 93,  105, 62,  62, 46, 53, true,  20),

-- Locs
('Tissage',              'locs',    180, 142, 107, 121, 71,  71, 53, 60, true,  20),
('Lace Frontale',        'locs',    150, 116, 87,   99, 58,  58, 44, 49, true,  20),
('Locks Resserrage',     'locs',     90,  78, 59,   66, 39,  39, 29, 33, false, 0),
('Locks Réparation',     'locs',     60,  64, 48,   54, 32,  32, 24, 27, false, 0),
('Lavage + Soin',        'soins',    60,  58, 44,   49, 29,  29, 22, 25, false, 0),

-- Coloration
('Coloration',           'coloration', 150, 104, 78, 89, 52, 52, 39, 44, true, 30),
('Défritage',            'soins',    120,  90, 68,  77, 45,  45, 34, 38, true,  20),

-- Barbier
('Coupe Homme',          'barbier',   45,  46, 35,  39, 23,  23, 17, 20, false, 0),
('Coupe + Barbe',        'barbier',   60,  72, 54,  61, 36,  36, 27, 31, false, 0),
('Barbe seulement',      'barbier',   30,  26, 20,  22, 13,  13, 10, 11, false, 0),

-- Kids
('Coupe Enfant',         'kids',      40,  32, 24,  27, 16,  16, 12, 14, false, 0);

-- ─── FRAIS DE DÉPLACEMENT ────────────────────────────────────
INSERT INTO frais_deplacement (distance_min_km, distance_max_km, tarif_normal, tarif_abonne) VALUES
(0,   5,  15,  8),
(6,  10,  20, 12),
(11, 20,  30, 18),
(21, 30,  40, 25),
(31, 50,  55, 35);

-- ─── PLANS D'ABONNEMENT ──────────────────────────────────────
INSERT INTO plans_abonnement (nom, categorie, prix_mensuel, services_inclus) VALUES
-- Barbier
('Barbier Essentiel',    'barbier',   29, ARRAY['Coupe Homme']),
('Barbier Premium',      'barbier',   45, ARRAY['Coupe Homme','Barbe seulement']),
('Coupe + Barbe Illimité','barbier',  69, ARRAY['Coupe + Barbe','Barbe seulement']),

-- Kids
('Kids Pass',            'kids',      25, ARRAY['Coupe Enfant']),

-- Tresses & Locs
('Tresses Rapides',      'tresses',   59, ARRAY['Cornrows','Tresses Collées']),
('Knotless Signature',   'tresses',  149, ARRAY['Knotless Braids','Box Braids']),
('Locs Illimité',        'locs',      89, ARRAY['Locks Resserrage','Lavage + Soin']),
('Microlocs Premium',    'locs',     119, ARRAY['Locks Resserrage','Locks Réparation','Lavage + Soin']),

-- Soin
('Soin & Beauté',        'soins',     49, ARRAY['Lavage + Soin','Défritage']);

-- ─── CHAISES SALON ───────────────────────────────────────────
INSERT INTO chaises (numero, nom, actif) VALUES
(1, 'Chaise 1',   true),
(2, 'Chaise 2',   true),
(3, 'Chaise VIP', true),
(4, 'Chaise 4',   true);

-- ─── MODULES DE FORMATION ────────────────────────────────────
INSERT INTO formation_modules (titre, description, video_url, ordre, actif) VALUES
('Bienvenue chez Kadio',
 'Introduction au réseau Kadio, valeurs, mission et fonctionnement du programme partenaire.',
 'https://vimeo.com/placeholder/module1', 1, true),

('Maîtrise du barème',
 'Comprendre le système de rémunération, les commissions par mode de travail et les bonus de conversion.',
 'https://vimeo.com/placeholder/module2', 2, true),

('Expérience client d''exception',
 'Standards de service, communication avec les clients, gestion des avis et des situations difficiles.',
 'https://vimeo.com/placeholder/module3', 3, true),

('Utiliser le portail partenaire',
 'Tutoriel complet : scanner QR, gérer son agenda, son portefeuille, commander du matériel.',
 'https://vimeo.com/placeholder/module4', 4, true);

-- ─── SALON CONFIG ────────────────────────────────────────────
INSERT INTO salon_config (cle, valeur) VALUES
('salon_nom',           'Kadio Coiffure & Esthétique'),
('salon_adresse',       '615 rue Antoinette-Robidoux, Local 100, Longueuil QC J4J 2V8'),
('salon_telephone',     '514-919-5970'),
('salon_email',         'info@kadio.ca'),
('deposit_defaut_pct',  '20'),
('noshow_seuil',        '4'),
('noshow_fenetre_jours','30'),
('sms_actif',           'false'),
('square_mode',         'sandbox'),
('horaires', '{
  "lun": {"ouvert": true,  "debut": "12:00", "fin": "19:00"},
  "mar": {"ouvert": false, "debut": "10:00", "fin": "18:00"},
  "mer": {"ouvert": true,  "debut": "10:00", "fin": "19:00"},
  "jeu": {"ouvert": true,  "debut": "10:00", "fin": "21:00"},
  "ven": {"ouvert": true,  "debut": "10:00", "fin": "21:00"},
  "sam": {"ouvert": true,  "debut": "10:00", "fin": "21:00"},
  "dim": {"ouvert": true,  "debut": "10:00", "fin": "17:00"}
}')
ON CONFLICT (cle) DO UPDATE SET valeur = EXCLUDED.valeur;
