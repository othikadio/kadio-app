# Kadio Supabase Migrations

Complete SQL migration files for the Kadio salon management app database.

## Files Overview

### 001_initial_schema.sql
Main schema definition with 28 tables covering:

**Core User Management:**
- `users` - User accounts with phone, email, name
- `roles` - Role assignments (admin, client, partenaire, employe, candidat, fournisseur)

**Profiles:**
- `clients` - Client profiles with subscription and referral data
- `partenaires` - Partner/stylist profiles with wallet and performance metrics
- `employes` - Salon employee profiles
- `fournisseurs` - Product supplier profiles
- `candidatures` - Partner applications with formation tracking

**Services & Appointments:**
- `services` - Hair service catalog with pricing
- `rendez_vous` - Appointments with QR codes, status, and reviews

**Subscriptions & Products:**
- `plans` - Subscription plan definitions
- `abonnements` - Client subscription instances
- `produits` - Product catalog from suppliers
- `commandes` - Orders placed with suppliers

**Financial:**
- `transactions` - All financial transactions
- `virements` - Partner payouts to bank accounts

**Salon Management:**
- `chaises` - Chair rental inventory
- `reservations_chaise` - Chair bookings
- `articles_blog` - Blog content management
- `sms_logs` - SMS delivery tracking

**Training & Onboarding:**
- `formation_modules` - Training modules (4 for candidats, 6 for partenaires, 4 for fournisseurs)
- `formation_etapes` - Steps within modules
- `formation_progression` - User progress tracking
- `quiz_questions` - Quiz questions for modules

**Configuration:**
- `salon_config` - Salon settings, commissions, hours, policies

**Loyalty & Marketing:**
- `parrainage` - Referral program
- `cartes_cadeaux` - Gift cards
- `tirage` - Lottery/giveaway definitions
- `tickets_tirage` - Lottery tickets

## Key Features

### UUID Primary Keys
All tables use `gen_random_uuid()` for primary keys instead of auto-increment integers, providing better distributed system support.

### Timestamps
Every table includes `created_at` and `updated_at` fields with automatic timestamp management via triggers.

### Foreign Keys
Proper referential integrity with:
- `ON DELETE CASCADE` for dependent records (e.g., when a user is deleted, their profile records are deleted)
- `ON DELETE SET NULL` for optional references (e.g., RDV can have null client_id)
- `ON DELETE RESTRICT` for protected references (e.g., services cannot be deleted if RDV exist)

### Indexes
Strategic indexes on:
- `user_id` columns for quick profile lookups
- `date` fields for date range queries
- `statut` fields for filtering by status
- Unique constraints where appropriate (phone, email, codes)

### Row Level Security (RLS)
Fine-grained access control policies:
- Users can read/update their own profiles
- Admins can access everything
- Partners can see their own appointments and transactions
- Public can read active services, plans, articles, and partners

### Triggers
Auto-update `updated_at` timestamp on all tables when records are modified.

### Data Types
- `UUID` for all IDs
- `JSONB` for flexible data (specialites, features, lots, etc.)
- `NUMERIC(10,2)` for financial fields (prevents float rounding errors)
- `TIMESTAMP` for audit trails
- `TEXT` for phone numbers (to preserve formatting)

## 002_seed_data.sql
Initial data:

**Configuration:**
- Salon information (address, hours, phone)
- Commission rates and displacement pricing grid
- No-show policy thresholds

**Subscription Plans (6):**
- Knotless Signature - 110$/month
- Tresses Signature - 175$/month
- Barbier Premium - 45$/month
- Barbier Essentiel - 29$/month
- Locs Mensuel - 60$/month
- Multi-services Annuel - 450$/year

**Services (18):**
- Tresses (3 variants)
- Knotless (3 variants)
- Locs (3 variants)
- Tissage (2 variants)
- Barber (4 variants)
- Soins (3 variants)

**Training Modules & Content:**
- 4 modules for candidats (partners) with 4-10 steps each
- 6 modules for partenaires (experienced stylists) with 5 steps each
- 4 modules for fournisseurs (suppliers) with 4 steps each
- 25 quiz questions total

## Installation

### Via Supabase CLI

```bash
supabase db push
```

This automatically runs migrations in order, starting with `001_`, then `002_`, etc.

### Manual SQL Execution

1. Connect to your Supabase database
2. Open SQL editor
3. Copy and paste `001_initial_schema.sql` and execute
4. Copy and paste `002_seed_data.sql` and execute

### Verify Installation

```sql
-- Check tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check row count examples
SELECT COUNT(*) FROM services;
SELECT COUNT(*) FROM plans;
SELECT COUNT(*) FROM formation_modules;
```

## Schema Design Notes

### JSONB Fields
Used for semi-structured data that doesn't need strict schema:
- `specialites` - Array of skill strings
- `modes_travail` - Array of work location strings
- `features` - Array of subscription features
- `photos` - Array of image URLs
- `lots` - Lottery prize details
- `reponses` - Quiz answer options

### Denormalization
Some fields are intentionally denormalized for performance:
- `service_nom` in `rendez_vous` (duplicates `services.nom`)
- `commission_kadio` in `transactions` (for quick calculation audits)

This is acceptable for read-heavy operations; updates are minimal.

### Statut Fields
Most entities have a `statut` field with predefined values:
- `actif` / `suspendu` / `inactif`
- `confirme` / `en_attente` / `termine` / `annule`
- Etc.

This enables easy filtering and status transitions.

### Code Fields
Unique code fields for user-facing references:
- `code_partenaire` - Partner identifier (KADIO-DIANE-001)
- `code_parrainage` - Referral code (AMINATA-7731)
- `code_qr` - QR code for appointments
- `code` - Gift card code

## Extending the Schema

### Adding a New Table

```sql
CREATE TABLE IF NOT EXISTS new_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add trigger
CREATE TRIGGER new_table_update_timestamp BEFORE UPDATE ON new_table
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Add RLS
ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can read own records" ON new_table
  FOR SELECT
  USING (auth.uid()::text = user_id::text);
```

### Adding Indexes

```sql
CREATE INDEX idx_new_table_user_id ON new_table(user_id);
CREATE INDEX idx_new_table_created_at ON new_table(created_at);
```

## Performance Considerations

### Query Optimization
- Most queries will use indexed columns (user_id, date_rdv, statut)
- JSONB fields are queryable with `->` operators
- Consider materialized views for complex aggregations

### Storage
- Current seed data is minimal
- Plan for growth with ~1M appointments/year: ~500MB
- JSONB fields compress well with pg_dump

### Backup Strategy
- Supabase automatically backs up daily
- Export full backup: `supabase db dump > backup.sql`
- Use point-in-time restore for disasters

## Testing

### Sample Queries

```sql
-- Active partners
SELECT COUNT(*) FROM partenaires WHERE statut = 'actif';

-- Today's appointments
SELECT COUNT(*) FROM rendez_vous 
WHERE date_rdv = CURRENT_DATE;

-- Partner wallet
SELECT SUM(montant) FROM virements 
WHERE partenaire_id = 'partner-uuid' 
AND statut = 'effectue';

-- Formation progress
SELECT user_id, COUNT(*) 
FROM formation_progression 
WHERE statut = 'complete' 
GROUP BY user_id;
```

## Common Issues

### UUID vs String IDs
- Auth.uid() returns UUID type, compare directly without casting when possible
- `auth.uid()::text = id::text` is safe for string comparisons

### JSONB Queries
```sql
-- Query JSONB arrays
WHERE specialites @> '["Tresses"]'::jsonb
```

### RLS Debugging
```sql
-- Check active policies
SELECT * FROM pg_policies WHERE tablename = 'clients';

-- Test policy as user
SET "request.jwt.claims" = '{"sub": "user-id"}';
SELECT * FROM clients;
```

## Migration Safety

### Rollback Strategy
Each migration is idempotent:
- `CREATE TABLE IF NOT EXISTS`
- `CREATE TRIGGER ... IF NOT EXISTS` patterns
- Safe to re-run without side effects

### Zero-Downtime Updates
- Add new columns as nullable
- Populate in background jobs
- Add constraints later if needed
- Drop old columns after verification

## Support

For questions about the schema:
1. Check the COMMENT statements for table descriptions
2. Review the mock data files in `src/data/` for usage patterns
3. Consult the authStore.js for role/profile relationships
