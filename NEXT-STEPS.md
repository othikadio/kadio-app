# Kadio — Feuille de route production · Lancement juin 2026

---

## 1. Variables d'environnement — `.env.local`

Créer à la racine du projet (jamais committer) :

```env
# ── Supabase ──────────────────────────────────────────────────
VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ── Square (paiements) ────────────────────────────────────────
# Sandbox : ids du Square Developer Dashboard
# Production : basculer sur les ids "Production"
VITE_SQUARE_APP_ID=sandbox-sq0idb-XXXXXXXXXXXXXXXXXXXX
VITE_SQUARE_LOCATION_ID=LXXXXXXXXXXXXXXXXX

# ── Stripe Connect (virements partenaires) ────────────────────
# Clé publique uniquement côté front
# La clé secrète va dans les Edge Functions Supabase UNIQUEMENT
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXX

# ── Twilio (SMS) ──────────────────────────────────────────────
# Ces valeurs doivent être dans les secrets Supabase Edge Functions
# NE PAS mettre les clés secrètes Twilio dans le .env front
VITE_TWILIO_FROM_NUMBER=+1XXXXXXXXXX

# ── App ──────────────────────────────────────────────────────
VITE_APP_URL=https://kadio.app
VITE_APP_ENV=production
```

> ⚠️ `STRIPE_SECRET_KEY`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` vont
> dans les **Secrets Supabase** (Dashboard → Edge Functions → Secrets),
> jamais dans le `.env` front.

---

## 2. Connexion Supabase — 5 étapes

### Étape 1 — Créer le projet
1. Aller sur [supabase.com](https://supabase.com) → New Project
2. Nom : `kadio-production` · Région : `Canada (ca-central-1)`
3. Mot de passe DB fort → noter dans 1Password

### Étape 2 — Récupérer les clés
Dashboard → Settings → API :
- `Project URL` → `VITE_SUPABASE_URL`
- `anon public` → `VITE_SUPABASE_ANON_KEY`

### Étape 3 — Configurer l'auth OTP SMS
Dashboard → Authentication → Providers → Phone :
- Activer Phone Auth
- Provider : Twilio
- Account SID + Auth Token + From Number → depuis Twilio Console

### Étape 4 — Exécuter les migrations SQL (voir section 3)

### Étape 5 — Configurer Row Level Security
Chaque table doit avoir RLS activé avec des policies adaptées au rôle :
```sql
-- Exemple policy RDV : un client ne voit que ses propres rdv
CREATE POLICY "client_own_rdv" ON rdv
  FOR ALL USING (auth.uid() = client_id);
```

---

## 3. Migrations SQL — ordre obligatoire

### Migration 1 — Profils & Rôles
```sql
-- Exécuter dans SQL Editor → New Query

CREATE TYPE user_role AS ENUM (
  'client', 'partenaire', 'employe', 'candidat', 'fournisseur', 'admin'
);

CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role          user_role NOT NULL DEFAULT 'client',
  prenom        TEXT,
  nom           TEXT,
  telephone     TEXT,
  email         TEXT,
  ville         TEXT,
  avatar_url    TEXT,
  statut        TEXT NOT NULL DEFAULT 'actif',
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Auto-créer profil à l'inscription
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, telephone)
  VALUES (NEW.id, NEW.phone);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_own" ON profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "profiles_admin_all" ON profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

### Migration 2 — Réservations & Services
```sql
CREATE TABLE services (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom         TEXT NOT NULL,
  categorie   TEXT,
  prix_salon  NUMERIC(10,2),
  prix_dom    NUMERIC(10,2),
  prix_dep    NUMERIC(10,2),
  duree_min   INTEGER DEFAULT 60,
  actif       BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE rdv (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id       UUID REFERENCES profiles(id),
  partenaire_id   UUID REFERENCES profiles(id),
  service_id      UUID REFERENCES services(id),
  date_heure      TIMESTAMPTZ NOT NULL,
  lieu            TEXT NOT NULL DEFAULT 'salon',
  statut          TEXT NOT NULL DEFAULT 'confirme',
  depot_paye      NUMERIC(10,2) DEFAULT 0,
  montant_total   NUMERIC(10,2),
  notes           TEXT,
  qr_code         TEXT UNIQUE,
  created_at      TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE rdv ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rdv_client" ON rdv
  FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "rdv_partenaire" ON rdv
  FOR ALL USING (auth.uid() = partenaire_id);

CREATE POLICY "rdv_admin" ON rdv
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

### Migration 3 — Financier (transactions, abonnements, virements)
```sql
CREATE TABLE transactions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rdv_id          UUID REFERENCES rdv(id),
  client_id       UUID REFERENCES profiles(id),
  partenaire_id   UUID REFERENCES profiles(id),
  montant         NUMERIC(10,2) NOT NULL,
  commission_taux NUMERIC(5,2) DEFAULT 20.0,
  commission      NUMERIC(10,2),
  methode         TEXT DEFAULT 'square',
  stripe_id       TEXT,
  square_id       TEXT,
  statut          TEXT DEFAULT 'complete',
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE abonnements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id       UUID REFERENCES profiles(id),
  forfait_id      TEXT NOT NULL,
  forfait_nom     TEXT,
  prix_mensuel    NUMERIC(10,2),
  statut          TEXT DEFAULT 'actif',
  date_debut      DATE DEFAULT CURRENT_DATE,
  date_fin        DATE,
  square_sub_id   TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE virements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partenaire_id   UUID REFERENCES profiles(id),
  montant         NUMERIC(10,2) NOT NULL,
  methode         TEXT DEFAULT 'stripe_connect',
  stripe_account  TEXT,
  statut          TEXT DEFAULT 'en_attente',
  processed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE abonnements  ENABLE ROW LEVEL SECURITY;
ALTER TABLE virements    ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tx_own"  ON transactions FOR SELECT USING (auth.uid() = client_id OR auth.uid() = partenaire_id);
CREATE POLICY "abo_own" ON abonnements  FOR ALL    USING (auth.uid() = client_id);
CREATE POLICY "vir_own" ON virements    FOR SELECT USING (auth.uid() = partenaire_id);
```

---

## 4. Désactiver les guards bypass avant production

⚠️ **CRITIQUE** — Tous les guards retournent `children` directement en dev.
Remplacer chaque fichier avant déploiement production :

| Fichier | Rôle | Action |
|---|---|---|
| `src/components/guards/AdminGuard.jsx` | Admin | Vérifier `profile.role === 'admin'` |
| `src/components/guards/ClientGuard.jsx` | Client | Vérifier `profile.role === 'client'` |
| `src/components/guards/PartenaireGuard.jsx` | Partenaire | Vérifier `profile.role === 'partenaire'` |
| `src/components/guards/EmployeGuard.jsx` | Employé | Vérifier `profile.role === 'employe'` |
| `src/components/guards/CandidatGuard.jsx` | Candidat | Vérifier `profile.role === 'candidat'` |
| `src/components/guards/FournisseurGuard.jsx` | Fournisseur | Vérifier `profile.role === 'fournisseur'` |

Pattern type pour chaque guard :
```jsx
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export default function AdminGuard({ children }) {
  const { profile, loading } = useAuthStore()
  if (loading) return null
  if (!profile || profile.role !== 'admin') return <Navigate to="/connexion" replace />
  return children
}
```

---

## 5. Passer Square et Stripe en mode production

### Square
1. Square Developer Dashboard → Applications → Production
2. Remplacer dans `.env.local` :
   - `VITE_SQUARE_APP_ID` → ID Production
   - `VITE_SQUARE_LOCATION_ID` → Location ID Production
3. Dans `src/lib/square.js` → remplacer la simulation par appels à la **Supabase Edge Function** `/api/square-payment`
4. Créer la Edge Function avec le SDK Square Node.js (clé secrète côté serveur uniquement)

### Stripe Connect
1. Stripe Dashboard → Activer le mode Live
2. Remplacer `VITE_STRIPE_PUBLISHABLE_KEY` → `pk_live_...`
3. Dans `src/lib/stripe.js` → remplacer la simulation par appels à la **Supabase Edge Function** `/api/stripe-transfer`
4. Créer les comptes Connect des partenaires via l'API Stripe (onboarding Stripe Express)
5. Configurer les webhooks Stripe → `https://xxxx.supabase.co/functions/v1/stripe-webhook`

---

## 6. Déploiement Vercel

```bash
# 1. Build de production
npm run build

# 2. Vérifier le dossier dist/
ls dist/

# 3. Installer Vercel CLI (si pas déjà fait)
npm i -g vercel

# 4. Premier déploiement
vercel

# 5. Configurer les variables d'env dans Vercel
# Dashboard Vercel → Settings → Environment Variables
# Ajouter toutes les variables du .env.local

# 6. Déploiement production
vercel --prod

# 7. Configurer le domaine custom
# Vercel → Settings → Domains → Add → kadio.app
```

Configuration `vercel.json` à créer à la racine pour le SPA routing :
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

---

## 7. Checklist complète de lancement — Juin 2026

### Infrastructure
- [ ] Projet Supabase créé en région `ca-central-1`
- [ ] Variables d'environnement configurées dans Vercel
- [ ] 3 migrations SQL exécutées dans l'ordre
- [ ] Row Level Security activé et testé sur toutes les tables
- [ ] Auth OTP SMS configuré avec Twilio (numéro canadien)
- [ ] Domaine `kadio.app` pointé vers Vercel

### Sécurité
- [ ] Tous les 6 guards remplacés (bypass supprimé)
- [ ] Clés secrètes uniquement dans Supabase Secrets (pas dans .env)
- [ ] CORS configuré sur les Edge Functions
- [ ] Rate limiting activé sur les endpoints SMS/auth

### Paiements
- [ ] Square basculé en mode Production
- [ ] Stripe Connect basculé en mode Live
- [ ] Comptes Connect créés pour chaque partenaire actif
- [ ] Webhooks Stripe configurés et testés
- [ ] Test paiement réel avec une carte physique
- [ ] Test virement partenaire bout en bout

### Contenu & UX
- [ ] Icônes PWA réelles créées (`/icons/icon-192.png`, `/icons/icon-512.png`)
- [ ] OG tags vérifiés (partage WhatsApp / réseaux sociaux)
- [ ] Textes finalisés (pas de Lorem ipsum ni placeholder)
- [ ] 6 articles blog publiés avec contenu réel
- [ ] Photos des partenaires ajoutées aux profils

### Tests pré-lancement
- [ ] Parcours complet client : inscription → réservation → paiement → confirmation
- [ ] Parcours complet partenaire : connexion → agenda → validation QR → virement
- [ ] Parcours admin : dashboard → virements → SMS campagne
- [ ] Test PWA installable sur iOS (Safari) et Android (Chrome)
- [ ] Test 11 langues — vérifier les traductions critiques
- [ ] Test responsive sur iPhone SE, iPhone 14, Samsung Galaxy S23
- [ ] Lighthouse score > 85 (Performance, Accessibility, PWA)

### Lancement
- [ ] Annoncer via WhatsApp aux partenaires existants
- [ ] Publication Instagram / Facebook
- [ ] Activer les 6 premiers partenaires certifiés
- [ ] Surveiller les erreurs dans Supabase Logs les 24 premières heures

---

*Kadio Coiffure & Esthétique — 615, rue Antoinette-Robidoux, Local 100, Longueuil (QC) J4J 2V8*
*514-919-5970 · kadio.app*
