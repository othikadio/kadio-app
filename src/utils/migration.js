/**
 * migration.js — Kadio
 * Migration Base44 → Supabase
 *
 * Usage:
 *   import { runMigration } from '@/utils/migration'
 *   await runMigration(supabase, (progress) => console.log(progress))
 */

import { supabase as supabaseClient } from '@/lib/supabase'

// ─── Configuration ────────────────────────────────────────────
const BATCH_SIZE = 50

export const ENTITIES = [
  { key: 'clients',     label: 'Clients',         table: 'clients',     icon: '👥' },
  { key: 'coiffeurs',   label: 'Coiffeurs',        table: 'coiffeurs',   icon: '✂️' },
  { key: 'services',    label: 'Services',         table: 'services',    icon: '💈' },
  { key: 'rdvs',        label: 'Rendez-vous',      table: 'rendez_vous', icon: '📅' },
  { key: 'abonnements', label: 'Abonnements',      table: 'abonnements', icon: '💳' },
  { key: 'gift_cards',  label: 'Cartes cadeaux',   table: 'gift_cards',  icon: '🎁' },
  { key: 'promos',      label: 'Codes promo',      table: 'promos',      icon: '🏷️' },
  { key: 'sms_logs',    label: 'SMS logs',         table: 'sms_logs',    icon: '📱' },
  { key: 'waitlist',    label: `Liste d'attente`,  table: 'waitlist',    icon: '⏳' },
]

// ═══════════════════════════════════════════════════════════════
// 1. EXPORT DEPUIS BASE44
// ═══════════════════════════════════════════════════════════════
export async function exportFromBase44() {
  const mockClients = [
    { id: 'b44-c1',  first_name: 'Aminata',   last_name: 'Sow',     phone: '514-919-5970', email: 'aminata.sow@email.com',    subscription_active: true,  plan_name: 'Tresses & Locs Premium', referral_code: 'KADIO-AMI8', no_show_count: 0, created: '2025-09-15T10:00:00Z' },
    { id: 'b44-c2',  first_name: 'Kadiatou',  last_name: 'Bah',     phone: '514-555-0101', email: 'kadiatou.bah@email.com',   subscription_active: true,  plan_name: 'Locs Illimité',          referral_code: 'KADIO-KAD4', no_show_count: 0, created: '2025-10-02T14:30:00Z' },
    { id: 'b44-c3',  first_name: 'Marcus',    last_name: 'Bell',    phone: '450-555-0202', email: 'marcus.bell@email.com',    subscription_active: true,  plan_name: 'Barbe Illimitée',        referral_code: 'KADIO-MAR7', no_show_count: 1, created: '2025-10-15T09:00:00Z' },
    { id: 'b44-c4',  first_name: 'Rokhaya',   last_name: 'Fall',    phone: '438-555-0303', email: 'rokhaya.fall@email.com',   subscription_active: true,  plan_name: 'Knotless Signature',     referral_code: 'KADIO-ROK2', no_show_count: 0, created: '2025-11-01T11:00:00Z' },
    { id: 'b44-c5',  first_name: 'Coumba',    last_name: 'Sarr',    phone: '514-555-0404', email: 'coumba.sarr@email.com',    subscription_active: false, plan_name: null,                     referral_code: 'KADIO-COU9', no_show_count: 0, created: '2025-11-20T16:00:00Z' },
    { id: 'b44-c6',  first_name: 'Fatoumata', last_name: 'Barry',   phone: '514-555-0505', email: 'fatoumata@email.com',      subscription_active: false, plan_name: null,                     referral_code: 'KADIO-FAT3', no_show_count: 2, created: '2025-12-05T10:00:00Z' },
    { id: 'b44-c7',  first_name: 'Binta',     last_name: 'Camara',  phone: '438-555-0606', email: 'binta.camara@email.com',   subscription_active: false, plan_name: null,                     referral_code: 'KADIO-BIN1', no_show_count: 3, created: '2026-01-10T14:00:00Z' },
    { id: 'b44-c8',  first_name: 'Ndeye',     last_name: 'Ndiaye',  phone: '514-555-0707', email: 'ndeye.ndiaye@email.com',   subscription_active: true,  plan_name: 'Tresses Rapides',        referral_code: 'KADIO-NDE6', no_show_count: 0, created: '2026-01-25T09:30:00Z' },
    { id: 'b44-c9',  first_name: 'Ami',       last_name: 'Kouyaté', phone: '514-555-0808', email: 'ami.kouyate@email.com',    subscription_active: false, plan_name: null,                     referral_code: 'KADIO-AMI5', no_show_count: 0, created: '2026-02-08T11:00:00Z' },
    { id: 'b44-c10', first_name: 'Aissatou',  last_name: 'Barry',   phone: '450-555-0909', email: 'aissatou.barry@email.com', subscription_active: true,  plan_name: 'Locs Illimité',          referral_code: 'KADIO-AIS2', no_show_count: 0, created: '2026-02-20T15:00:00Z' },
  ]

  const mockCoiffeurs = [
    { id: 'b44-emp1', first_name: 'Kadio',  last_name: 'Kadio',  role: 'directeur_coiffeur', specialties: ['Tresses', 'Locs', 'Coupe'],   color: '#B8922A', pin: '1234', active: true },
    { id: 'b44-emp2', first_name: 'Sarah',  last_name: 'Osei',   role: 'coiffeure_tresses',  specialties: ['Tresses', 'Knotless', 'Locs'], color: '#60a5fa', pin: '5678', active: true },
    { id: 'b44-emp3', first_name: 'Marcus', last_name: 'Bell',   role: 'barbier_coiffeur',   specialties: ['Coupe', 'Barbe'],             color: '#34d399', pin: '9012', active: true },
  ]

  const mockServices = [
    { id: 'b44-s1', name: 'Locs Illimité',                category: 'locs',    price: 129.99, duration: 240, active: true, deposit: true  },
    { id: 'b44-s2', name: 'Microlocs / Sisterlocs',       category: 'locs',    price: 149.99, duration: 300, active: true, deposit: true  },
    { id: 'b44-s3', name: 'Knotless & Tresses Signature', category: 'tresses', price: 139.99, duration: 240, active: true, deposit: true  },
    { id: 'b44-s4', name: 'Tresses Rapides',              category: 'tresses', price: 79.99,  duration: 120, active: true, deposit: false },
    { id: 'b44-s5', name: 'Barbier Coupe & Barbe',        category: 'barbier', price: 64.99,  duration: 60,  active: true, deposit: false },
    { id: 'b44-s6', name: 'Barbier Coupe Simple',         category: 'barbier', price: 59.99,  duration: 45,  active: true, deposit: false },
    { id: 'b44-s7', name: 'Barbe Illimitée',              category: 'barbier', price: 35.99,  duration: 30,  active: true, deposit: false },
    { id: 'b44-s8', name: 'Tresses Rapides Enfant',       category: 'enfant',  price: 59.99,  duration: 90,  active: true, deposit: false },
    { id: 'b44-s9', name: 'Knotless Enfant',              category: 'enfant',  price: 79.99,  duration: 150, active: true, deposit: true  },
  ]

  const mockRdvs = [
    { id: 'b44-r1',  client_id: 'b44-c1',  employee_id: 'b44-emp1', service: 'Tresses cornrows',      date: '2026-03-26', start_time: '09:00', end_time: '12:00', duration: 180, price: 120, status: 'confirmed', created_at: '2026-03-24T10:00:00Z' },
    { id: 'b44-r2',  client_id: 'b44-c2',  employee_id: 'b44-emp1', service: 'Knotless braids',        date: '2026-03-26', start_time: '13:00', end_time: '17:00', duration: 240, price: 160, status: 'confirmed', created_at: '2026-03-24T11:00:00Z' },
    { id: 'b44-r3',  client_id: 'b44-c4',  employee_id: 'b44-emp2', service: 'Locs retouche',          date: '2026-03-25', start_time: '10:00', end_time: '12:00', duration: 120, price: 90,  status: 'completed', created_at: '2026-03-23T09:00:00Z' },
    { id: 'b44-r4',  client_id: 'b44-c5',  employee_id: 'b44-emp3', service: 'Coupe + Soin',           date: '2026-03-25', start_time: '14:00', end_time: '15:30', duration: 90,  price: 85,  status: 'completed', created_at: '2026-03-23T10:00:00Z' },
    { id: 'b44-r5',  client_id: 'b44-c6',  employee_id: 'b44-emp2', service: 'Tresses rapides',        date: '2026-03-24', start_time: '11:00', end_time: '13:00', duration: 120, price: 70,  status: 'cancelled', created_at: '2026-03-22T14:00:00Z' },
    { id: 'b44-r6',  client_id: 'b44-c7',  employee_id: 'b44-emp1', service: 'Tresses cornrows',       date: '2026-03-22', start_time: '09:00', end_time: '12:00', duration: 180, price: 110, status: 'no_show',   created_at: '2026-03-20T10:00:00Z' },
    { id: 'b44-r7',  client_id: 'b44-c3',  employee_id: 'b44-emp3', service: 'Barbier Coupe & Barbe',  date: '2026-03-20', start_time: '10:00', end_time: '11:00', duration: 60,  price: 65,  status: 'completed', created_at: '2026-03-18T09:00:00Z' },
    { id: 'b44-r8',  client_id: 'b44-c10', employee_id: 'b44-emp1', service: 'Locs installation',      date: '2026-03-18', start_time: '09:00', end_time: '14:00', duration: 300, price: 200, status: 'completed', created_at: '2026-03-16T11:00:00Z' },
  ]

  const mockAbonnements = [
    { id: 'b44-a1', client_id: 'b44-c1',  plan: 'Tresses & Locs Premium', price: 139.99, status: 'active',  payment: 'card',    start_date: '2026-02-20', renewal_date: '2026-04-20', visits_used: 3, visits_total: 4  },
    { id: 'b44-a2', client_id: 'b44-c2',  plan: 'Locs Illimité',          price: 129.99, status: 'active',  payment: 'interac', start_date: '2026-03-01', renewal_date: '2026-04-01', visits_used: 2, visits_total: -1 },
    { id: 'b44-a3', client_id: 'b44-c3',  plan: 'Barbe Illimitée',        price: 35.99,  status: 'active',  payment: 'cash',    start_date: '2026-03-15', renewal_date: '2026-04-15', visits_used: 4, visits_total: -1 },
    { id: 'b44-a4', client_id: 'b44-c4',  plan: 'Knotless Signature',     price: 139.99, status: 'active',  payment: 'card',    start_date: '2026-02-18', renewal_date: '2026-04-18', visits_used: 1, visits_total: 4  },
    { id: 'b44-a5', client_id: 'b44-c8',  plan: 'Tresses Rapides',        price: 79.99,  status: 'pending', payment: 'interac', start_date: '2026-03-25', renewal_date: '2026-04-25', visits_used: 0, visits_total: 4  },
    { id: 'b44-a6', client_id: 'b44-c10', plan: 'Locs Illimité',          price: 129.99, status: 'active',  payment: 'card',    start_date: '2026-02-20', renewal_date: '2026-04-20', visits_used: 5, visits_total: -1 },
  ]

  const mockGiftCards = [
    { id: 'b44-g1', code: 'KADIO-GIFT-A2B3', value: 50,  balance: 50,  buyer: 'Jean Dupont',  buyer_email: 'jean@exemple.com', recipient: 'Marie Tremblay', status: 'active', expires: '2027-03-20' },
    { id: 'b44-g2', code: 'KADIO-GIFT-C4D5', value: 100, balance: 75,  buyer: 'Sophie Gagné', buyer_email: 'sophie@email.ca',  recipient: 'Paul Bouchard',  status: 'active', expires: '2027-02-15' },
    { id: 'b44-g3', code: 'KADIO-GIFT-E6F7', value: 25,  balance: 0,   buyer: 'Alex Martin',  buyer_email: 'alex@email.com',   recipient: 'Lucie Roy',      status: 'used',   expires: '2026-12-01' },
  ]

  const mockPromos = [
    { id: 'b44-p1', code: 'KADIO10',    type: 'percentage', value: 10, max_uses: 100, used: 23, active: true, expires: null          },
    { id: 'b44-p2', code: 'NEWCLIENT',  type: 'percentage', value: 15, max_uses: 200, used: 67, active: true, expires: '2026-06-30'  },
    { id: 'b44-p3', code: 'PRINTEMPS25',type: 'fixed',      value: 25, max_uses: 50,  used: 12, active: true, expires: '2026-05-31'  },
  ]

  const mockSmsLogs = [
    { id: 'b44-sms1', to: '514-919-5970', message: 'Rappel RDV demain à 09:00',      type: 'reminder_24h',   status: 'delivered', rdv_id: 'b44-r1', created: '2026-03-25T09:00:00Z' },
    { id: 'b44-sms2', to: '514-555-0101', message: 'Votre RDV a été confirmé',        type: 'confirmation',   status: 'delivered', rdv_id: 'b44-r2', created: '2026-03-24T11:05:00Z' },
    { id: 'b44-sms3', to: '438-555-0606', message: `Vous étiez absent à votre RDV`,   type: 'no_show',        status: 'delivered', rdv_id: 'b44-r6', created: '2026-03-22T10:30:00Z' },
    { id: 'b44-sms4', to: '514-555-0404', message: 'Partagez votre expérience Kadio', type: 'review_request', status: 'delivered', rdv_id: 'b44-r4', created: '2026-03-25T16:00:00Z' },
  ]

  const mockWaitlist = [
    { id: 'b44-w1', client_name: 'Hawa Balde',    phone: '514-777-0001', service: 'Knotless braids',   desired_date: '2026-04-05', status: 'waiting', created: '2026-03-20T10:00:00Z' },
    { id: 'b44-w2', client_name: 'Seynabou Diop', phone: '438-777-0002', service: 'Locs installation', desired_date: '2026-04-10', status: 'waiting', created: '2026-03-22T14:00:00Z' },
  ]

  return {
    clients:     mockClients,
    coiffeurs:   mockCoiffeurs,
    services:    mockServices,
    rdvs:        mockRdvs,
    abonnements: mockAbonnements,
    gift_cards:  mockGiftCards,
    promos:      mockPromos,
    sms_logs:    mockSmsLogs,
    waitlist:    mockWaitlist,
  }
}

// ═══════════════════════════════════════════════════════════════
// 2. TRANSFORMATION Base44 → Format Supabase
// ═══════════════════════════════════════════════════════════════

function toDate(val) {
  if (!val) return null
  try { return new Date(val).toISOString().split('T')[0] } catch { return null }
}

function toTimestamp(val) {
  if (!val) return null
  try { return new Date(val).toISOString() } catch { return null }
}

function cleanPhone(val) {
  if (!val) return null
  return val.replace(/[^0-9\-+() ]/g, '').trim() || null
}

const STATUS_MAP_RDV = {
  confirmed: 'confirme',
  completed: 'termine',
  cancelled: 'annule',
  no_show:   'no_show',
  pending:   'confirme',
}

const STATUS_MAP_ABO = {
  active:    'actif',
  pending:   'en_attente_virement',
  suspended: 'suspendu',
  cancelled: 'annule',
  expired:   'expire',
}

const PAYMENT_MAP = {
  card:     'carte',
  interac:  'interac',
  cash:     'cash',
  terminal: 'terminal',
}

export function transformData(entity, records) {
  if (!Array.isArray(records)) return []

  switch (entity) {

    case 'clients':
      return records.map(r => ({
        nom:                r.last_name?.trim() || '',
        prenom:             r.first_name?.trim() || '',
        telephone:          cleanPhone(r.phone),
        email:              r.email?.toLowerCase().trim() || null,
        forfait_statut:     r.plan_name || null,
        is_subscribed:      Boolean(r.subscription_active),
        no_show_count:      Number(r.no_show_count) || 0,
        referral_code:      r.referral_code || null,
        referral_credits:   Number(r.referral_credits) || 0,
        created_at:         toTimestamp(r.created) || toTimestamp(new Date()),
        notes:              `[base44_id:${r.id}]`,
      }))

    case 'coiffeurs':
      return records.map(r => ({
        nom:        r.last_name?.trim() || '',
        prenom:     r.first_name?.trim() || '',
        role:       r.role || 'coiffeur',
        specialites: Array.isArray(r.specialties) ? r.specialties : [],
        couleur:    r.color || '#B8922A',
        actif:      Boolean(r.active !== false),
        login_code: r.pin || null,
      }))

    case 'services':
      return records.map(r => ({
        nom:                r.name?.trim() || '',
        categorie:          r.category || null,
        description:        r.description || null,
        prix:               Number(r.price) || 0,
        duree:              Number(r.duration) || 60,
        actif:              Boolean(r.active !== false),
        require_deposit:    Boolean(r.deposit),
        deposit_percentage: 20,
      }))

    case 'rdvs':
      return records.map(r => ({
        client_nom:       `${r.client_first_name || ''} ${r.client_last_name || ''}`.trim() || 'Client inconnu',
        client_telephone: cleanPhone(r.client_phone) || null,
        service:          r.service || '',
        date:             toDate(r.date),
        heure_debut:      r.start_time || '09:00',
        heure_fin:        r.end_time || null,
        duree:            Number(r.duration) || null,
        prix:             Number(r.price) || 0,
        statut:           STATUS_MAP_RDV[r.status] || 'confirme',
        booking_source:   r.source || 'admin',
        notes:            `[base44_rdv_id:${r.id}]`,
        created_at:       toTimestamp(r.created_at),
      }))

    case 'abonnements':
      return records.map(r => ({
        client_nom:                r.client_name || 'Client inconnu',
        client_telephone:          cleanPhone(r.client_phone) || null,
        plan_nom:                  r.plan || '',
        prix_mensuel:              Number(r.price) || 0,
        statut:                    STATUS_MAP_ABO[r.status] || 'actif',
        payment_method:            PAYMENT_MAP[r.payment] || 'carte',
        payment_confirmed:         r.status === 'active',
        auto_renewal:              Boolean(r.auto_renewal !== false),
        date_debut:                toDate(r.start_date),
        date_renouvellement:       toDate(r.renewal_date),
        visits_used_this_month:    Number(r.visits_used) || 0,
        visits_included_per_month: Number(r.visits_total) === 0 ? -1 : Number(r.visits_total) || -1,
      }))

    case 'gift_cards':
      return records.map(r => ({
        code:             r.code || `KADIO-GIFT-${Math.random().toString(36).slice(2,6).toUpperCase()}`,
        valeur_initiale:  Number(r.value) || 0,
        solde:            Number(r.balance) ?? Number(r.value) ?? 0,
        acheteur_nom:     r.buyer || null,
        acheteur_email:   r.buyer_email || null,
        beneficiaire_nom: r.recipient || null,
        statut:           r.status === 'used' ? 'utilise' : r.status === 'expired' ? 'expire' : 'actif',
        date_expiration:  toDate(r.expires),
      }))

    case 'promos':
      return records.map(r => ({
        code:            r.code?.toUpperCase() || '',
        type:            r.type === 'percentage' ? 'pourcentage' : 'montant_fixe',
        valeur:          Number(r.value) || 0,
        usage_max:       Number(r.max_uses) || null,
        usage_count:     Number(r.used) || 0,
        actif:           Boolean(r.active !== false),
        date_expiration: toDate(r.expires),
      }))

    case 'sms_logs':
      return records.map(r => ({
        destinataire: cleanPhone(r.to) || r.to || '',
        message:      r.message || '',
        type:         r.type || 'autre',
        statut:       r.status === 'delivered' ? 'livre' : r.status === 'failed' ? 'echec' : 'envoye',
        twilio_sid:   r.twilio_sid || null,
        created_at:   toTimestamp(r.created),
      }))

    case 'waitlist':
      return records.map(r => ({
        client_nom:       r.client_name?.trim() || '',
        client_telephone: cleanPhone(r.phone) || null,
        client_email:     r.email || null,
        service:          r.service || null,
        date_souhaitee:   toDate(r.desired_date),
        statut:           'en_attente',
        created_at:       toTimestamp(r.created),
      }))

    default:
      return records
  }
}

// ═══════════════════════════════════════════════════════════════
// 3. IMPORT VERS SUPABASE — batch de 50, vérif doublons
// ═══════════════════════════════════════════════════════════════

async function fetchExistingPhones(sb) {
  const { data, error } = await sb.from('clients').select('telephone')
  if (error || !data) return new Set()
  return new Set(data.map(r => r.telephone).filter(Boolean))
}

function chunk(arr, size) {
  const chunks = []
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size))
  return chunks
}

export async function importToSupabase(sb, entity, records, onBatch) {
  const entityDef = ENTITIES.find(e => e.key === entity)
  if (!entityDef) return { inserted: 0, skipped: 0, errors: [`Entité inconnue: ${entity}`] }

  const table = entityDef.table
  let inserted = 0, skipped = 0
  const errors = []

  let existingPhones = new Set()
  if (entity === 'clients') {
    try { existingPhones = await fetchExistingPhones(sb) } catch { /* ignore */ }
  }

  let toInsert = records
  if (entity === 'clients') {
    toInsert = records.filter(r => {
      if (r.telephone && existingPhones.has(r.telephone)) {
        skipped++
        return false
      }
      return true
    })
  }

  const batches = chunk(toInsert, BATCH_SIZE)
  for (let i = 0; i < batches.length; i++) {
    try {
      const { error } = await sb.from(table).insert(batches[i])
      if (error) {
        errors.push(`Batch ${i + 1}/${batches.length}: ${error.message}`)
      } else {
        inserted += batches[i].length
      }
    } catch (err) {
      errors.push(`Batch ${i + 1}: ${err.message || 'Erreur inconnue'}`)
    }
    if (onBatch) onBatch(i + 1, batches.length)
    await new Promise(r => setTimeout(r, 50))
  }

  return { inserted, skipped, errors }
}

// ═══════════════════════════════════════════════════════════════
// 4. ORCHESTRATEUR PRINCIPAL
// ═══════════════════════════════════════════════════════════════

export async function runMigration(sb = supabaseClient, onProgress = () => {}) {
  const rapport = {
    success: true,
    startTime: new Date().toISOString(),
    endTime: null,
    entities: [],
    totalInserted: 0,
    totalSkipped: 0,
    totalErrors: 0,
  }

  const progress = Object.fromEntries(
    ENTITIES.map(e => [e.key, { status: 'pending', pct: 0, inserted: 0, skipped: 0, errors: [] }])
  )

  function emit(entityKey) {
    const ent = ENTITIES.find(e => e.key === entityKey)
    onProgress({ entity: entityKey, label: ent?.label, ...progress[entityKey], allProgress: { ...progress } })
  }

  try {
    onProgress({ phase: 'export', message: `Lecture des données Base44...` })
    const base44Data = await exportFromBase44()
    onProgress({ phase: 'export', message: `${Object.values(base44Data).reduce((s, arr) => s + arr.length, 0)} enregistrements lus` })

    for (const entityDef of ENTITIES) {
      const { key, label } = entityDef
      const rawRecords = base44Data[key] || []

      progress[key] = { status: 'running', pct: 0, inserted: 0, skipped: 0, errors: [], count: rawRecords.length }
      emit(key)

      if (rawRecords.length === 0) {
        progress[key] = { status: 'done', pct: 100, inserted: 0, skipped: 0, errors: [], count: 0, message: 'Aucune donnée' }
        emit(key)
        rapport.entities.push({ entity: key, label, ...progress[key] })
        continue
      }

      let transformed
      try {
        transformed = transformData(key, rawRecords)
        progress[key].pct = 30
        emit(key)
      } catch (err) {
        progress[key] = { status: 'error', pct: 0, inserted: 0, skipped: 0, errors: [`Erreur transformation: ${err.message}`], count: rawRecords.length }
        emit(key)
        rapport.entities.push({ entity: key, label, ...progress[key] })
        rapport.success = false
        continue
      }

      const result = await importToSupabase(sb, key, transformed, (batchIdx, totalBatches) => {
        progress[key].pct = 30 + Math.round((batchIdx / totalBatches) * 70)
        emit(key)
      })

      progress[key] = {
        status: result.errors.length > 0 && result.inserted === 0 ? 'error' : 'done',
        pct: 100,
        inserted: result.inserted,
        skipped: result.skipped,
        errors: result.errors,
        count: rawRecords.length,
      }
      emit(key)
      rapport.entities.push({ entity: key, label, ...progress[key] })
      rapport.totalInserted += result.inserted
      rapport.totalSkipped  += result.skipped
      rapport.totalErrors   += result.errors.length
      if (result.errors.length > 0) rapport.success = false
    }

  } catch (err) {
    rapport.success = false
    rapport.fatalError = err.message
    onProgress({ phase: 'fatal', message: err.message })
  }

  rapport.endTime = new Date().toISOString()
  onProgress({ phase: 'complete', rapport })
  return rapport
}

// ═══════════════════════════════════════════════════════════════
// 5. VÉRIFICATION PRÉ-MIGRATION
// ═══════════════════════════════════════════════════════════════

export async function checkPrerequisites(sb) {
  const checks = []

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
  const supabaseOk  = supabaseUrl.includes('supabase.co')
  checks.push({
    label: `Supabase URL configurée`,
    ok: supabaseOk,
    detail: supabaseOk ? supabaseUrl.split('//')[1]?.split('.')[0] : `Non configuré (VITE_SUPABASE_URL manquant)`,
  })

  let tablesOk = false
  try {
    const { error } = await sb.from('clients').select('id').limit(1)
    tablesOk = !error
    checks.push({ label: `Table clients accessible`, ok: tablesOk, detail: error ? error.message : `OK` })
  } catch (err) {
    checks.push({ label: `Table clients accessible`, ok: false, detail: err.message })
  }

  try {
    const { error } = await sb.from('rendez_vous').select('id').limit(1)
    checks.push({ label: `Table rendez_vous accessible`, ok: !error, detail: error ? error.message : `OK` })
  } catch (err) {
    checks.push({ label: `Table rendez_vous accessible`, ok: false, detail: err.message })
  }

  try {
    const { error } = await sb.from('abonnements').select('id').limit(1)
    checks.push({ label: `Table abonnements accessible`, ok: !error, detail: error ? error.message : `OK` })
  } catch (err) {
    checks.push({ label: `Table abonnements accessible`, ok: false, detail: err.message })
  }

  let base44Ok = false
  try {
    const data = await exportFromBase44()
    const total = Object.values(data).reduce((s, arr) => s + arr.length, 0)
    base44Ok = total > 0
    checks.push({ label: `Données Base44 lisibles`, ok: base44Ok, detail: `${total} enregistrements prêts` })
  } catch (err) {
    checks.push({ label: `Données Base44 lisibles`, ok: false, detail: err.message })
  }

  return {
    ok: checks.every(c => c.ok),
    checks,
    supabase_ok: supabaseOk,
    tables_ok:   tablesOk,
    base44_ok:   base44Ok,
  }
}
