import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { getUserByPhone, getUserRoles, createUser } from '../services/users'
import { getClientByUserId } from '../services/clients'
import { getPartenaireByUserId } from '../services/partenaires'
import { getEmployeByUserId } from '../services/employes'
import { getFournisseurByUserId } from '../services/fournisseurs'

// ─── Personas DEV (fallback quand Supabase n'est pas configuré) ──
const DEV_PERSONAS = {
  '5149195970': {
    user:       { id: 'usr-othi', telephone: '514-919-5970', prenom: 'Othi',    nom: 'Kadio',    email: 'othi@kadio.ca',    langue: 'fr' },
    roles:      [{ role: 'admin', statut: 'actif' }, { role: 'client', statut: 'actif' }, { role: 'employe', statut: 'actif' }],
    activeRole: 'admin',
    client:     { id: 'cli-othi',  user_id: 'usr-othi',  is_abonne: true,  no_show_count: 0, is_bloque: false, credits_parrainage: 5,  code_parrainage: 'OTHI-4291', portal_pin: '1234' },
    employe:    { id: 'emp-othi',  user_id: 'usr-othi',  role_salon: 'directeur', specialites: ['tresses'], couleur_agenda: '#B8922A', pin_acces: '1234', actif: true },
    partenaire: null,
    fournisseur: null,
  },
  '5140000001': {
    user:       { id: 'usr-aminata', telephone: '514-000-0001', prenom: 'Aminata', nom: 'Diallo',   email: 'aminata@gmail.com', langue: 'fr' },
    roles:      [{ role: 'client', statut: 'actif' }],
    activeRole: 'client',
    client:     { id: 'cli-aminata', user_id: 'usr-aminata', is_abonne: true, no_show_count: 0, is_bloque: false, credits_parrainage: 2, code_parrainage: 'AMINATA-7731', portal_pin: '4567' },
    partenaire: null, employe: null, fournisseur: null,
  },
  '5140000002': {
    user:       { id: 'usr-diane', telephone: '514-000-0002', prenom: 'Diane',   nom: 'Mbaye',    email: 'diane@coiffure.ca', langue: 'fr' },
    roles:      [{ role: 'partenaire', statut: 'actif' }, { role: 'client', statut: 'actif' }],
    activeRole: 'partenaire',
    client:     { id: 'cli-diane', user_id: 'usr-diane', is_abonne: false, no_show_count: 0, is_bloque: false, credits_parrainage: 0, code_parrainage: 'DIANE-2210', portal_pin: '2222' },
    partenaire: { id: 'part-diane', user_id: 'usr-diane', code_partenaire: 'KADIO-DIANE-001', prenom: 'Diane', nom: 'Mbaye', statut: 'actif', niveau: 'certifie', certificat_actif: true, note_moyenne: 4.8, total_services: 87, portefeuille_solde: 312.50, portefeuille_total_gagne: 4280.00, is_disponible: true, mode_vacances: false, ville: 'Longueuil', couleur_agenda: '#8B5CF6', portal_pin: '2222' },
    employe: null, fournisseur: null,
  },
  '5140000003': {
    user:       { id: 'usr-marcus', telephone: '514-000-0003', prenom: 'Marcus',  nom: 'Pierre',   email: 'marcus@kadio.ca',  langue: 'fr' },
    roles:      [{ role: 'employe', statut: 'actif' }, { role: 'client', statut: 'actif' }],
    activeRole: 'employe',
    client:     { id: 'cli-marcus', user_id: 'usr-marcus', is_abonne: false, no_show_count: 0, is_bloque: false, credits_parrainage: 1, code_parrainage: 'MARCUS-5501', portal_pin: '3333' },
    employe:    { id: 'emp-marcus', user_id: 'usr-marcus', role_salon: 'coiffeur', specialites: ['tresses', 'locs', 'coupes'], couleur_agenda: '#10B981', pin_acces: '3333', actif: true },
    partenaire: null, fournisseur: null,
  },
  '5140000004': {
    user:       { id: 'usr-four', telephone: '514-000-0004', prenom: 'Jean',     nom: 'Fournisseur', email: 'four@supply.ca', langue: 'fr' },
    roles:      [{ role: 'fournisseur', statut: 'actif' }],
    activeRole: 'fournisseur',
    client: null, partenaire: null, employe: null,
    fournisseur: { id: 'four-jean', user_id: 'usr-four', nom_entreprise: `Beauté Afro Supply`, actif: true },
  },
  '5147770001': {
    user:       { id: 'usr-mariam', telephone: '514-777-0001', prenom: 'Mariam',  nom: 'Touré',    email: 'mariam@gmail.com', langue: 'fr' },
    roles:      [{ role: 'candidat', statut: 'actif' }],
    activeRole: 'candidat',
    client: null, partenaire: null, employe: null, fournisseur: null,
  },
}

const DEV_OTP = '123456'
// Forcer mode demo — Twilio/SMS pas configuré (20003)
const USE_REAL_AUTH = false // IMPORTANT: ne pas changer

// ─── Helpers ──────────────────────────────────────────────────
function normalizePhone(raw) {
  return raw.replace(/\D/g, '')
}

function formatPhoneE164(raw) {
  const digits = normalizePhone(raw)
  if (digits.startsWith('1') && digits.length === 11) return `+${digits}`
  if (digits.length === 10) return `+1${digits}`
  return `+${digits}`
}

function getPersona(telephone) {
  return DEV_PERSONAS[normalizePhone(telephone)] || null
}

function roleHome(role) {
  const MAP = {
    admin:       '/admin/dashboard',
    client:      '/client/carte',
    partenaire:  '/partenaire/accueil',
    employe:     '/employe/accueil',
    candidat:    '/candidat/statut',
    fournisseur: '/fournisseur/catalogue',
  }
  return MAP[role] || '/'
}

/** Charge les profils liés aux rôles */
async function loadProfiles(userId, roles) {
  const profiles = { client: null, partenaire: null, employe: null, fournisseur: null }
  const fetchers = {
    client:      () => getClientByUserId(userId).catch(() => null),
    partenaire:  () => getPartenaireByUserId(userId).catch(() => null),
    employe:     () => getEmployeByUserId(userId).catch(() => null),
    fournisseur: () => getFournisseurByUserId(userId).catch(() => null),
  }

  await Promise.all(
    roles.map(async (role) => {
      if (fetchers[role]) profiles[role] = await fetchers[role]()
    })
  )
  return profiles
}

// ─── Store ────────────────────────────────────────────────────
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // ── State ──
      user:            null,
      roles:           [],
      activeRole:      null,
      client:          null,
      partenaire:      null,
      employe:         null,
      fournisseur:     null,
      isLoading:       false,
      session:         null,
      _pendingPhone:   null,
      _pendingIsNew:   false,

      // ── Getters ──
      isAuthenticated: () => !!get().user,
      hasRole:      (r) => get().roles.some(x => x.role === r && x.statut === 'actif'),
      isAdmin:       () => get().roles.some(x => x.role === 'admin'       && x.statut === 'actif'),
      isClient:      () => get().roles.some(x => x.role === 'client'      && x.statut === 'actif'),
      isPartenaire:  () => get().roles.some(x => x.role === 'partenaire'  && x.statut === 'actif'),
      isEmploye:     () => get().roles.some(x => x.role === 'employe'     && x.statut === 'actif'),
      isFournisseur: () => get().roles.some(x => x.role === 'fournisseur' && x.statut === 'actif'),
      isCandidat:    () => get().roles.some(x => x.role === 'candidat'    && x.statut === 'actif'),

      activeRoles: () => get().roles.filter(x => x.statut === 'actif'),

      // ══════════════════════════════════════════════════════════
      //  AUTH FLOW — Supabase OTP ou DEV mock
      // ══════════════════════════════════════════════════════════

      /** Étape 1 : envoyer OTP par SMS */
      requestOTP: async (telephone) => {
        const phone = formatPhoneE164(telephone)

        if (!USE_REAL_AUTH) {
          // ── DEV fallback ──
          const persona = getPersona(telephone)
          set({ _pendingPhone: telephone, _pendingIsNew: !persona })
          return { isNew: !persona, simCode: DEV_OTP }
        }

        // ── Supabase Auth ──
        set({ isLoading: true })
        try {
          const { error } = await supabase.auth.signInWithOtp({ phone })
          if (error) throw error

          // Vérifier si l'utilisateur existe dans notre table users
          let isNew = false
          try {
            await getUserByPhone(normalizePhone(telephone))
          } catch {
            isNew = true
          }

          set({ _pendingPhone: telephone, _pendingIsNew: isNew })
          return { isNew }
        } finally {
          set({ isLoading: false })
        }
      },

      /** Étape 2 : vérifier le code OTP */
      verifyOTP: async (code) => {
        if (!USE_REAL_AUTH) {
          // ── DEV fallback ──
          if (code !== DEV_OTP) return { ok: false, error: 'Code incorrect' }

          const telephone = get()._pendingPhone
          const isNew = get()._pendingIsNew
          if (isNew) return { ok: true, redirectTo: '/inscription' }

          const persona = getPersona(telephone)
          set({
            user: persona.user, roles: persona.roles, activeRole: persona.activeRole,
            client: persona.client, partenaire: persona.partenaire,
            employe: persona.employe, fournisseur: persona.fournisseur,
            _pendingPhone: null, _pendingIsNew: false,
          })

          const activeRoles = persona.roles.filter(r => r.statut === 'actif')
          if (activeRoles.length > 1) return { ok: true, redirectTo: '/choix-role' }
          return { ok: true, redirectTo: roleHome(persona.activeRole) }
        }

        // ── Supabase Auth ──
        const telephone = get()._pendingPhone
        const phone = formatPhoneE164(telephone)
        set({ isLoading: true })

        try {
          const { data, error } = await supabase.auth.verifyOtp({
            phone,
            token: code,
            type: 'sms',
          })
          if (error) return { ok: false, error: error.message }

          set({ session: data.session })

          // Nouvel utilisateur → inscription
          if (get()._pendingIsNew) {
            return { ok: true, redirectTo: '/inscription' }
          }

          // Utilisateur existant → charger le profil complet
          const user = await getUserByPhone(normalizePhone(telephone))
          const roles = await getUserRoles(user.id)
          const roleObjects = roles.map(r => ({ role: r, statut: 'actif' }))
          const profiles = await loadProfiles(user.id, roles)

          const defaultRole = roles.includes('admin') ? 'admin' : roles[0]

          set({
            user, roles: roleObjects, activeRole: defaultRole,
            ...profiles,
            _pendingPhone: null, _pendingIsNew: false,
          })

          if (roles.length > 1) return { ok: true, redirectTo: '/choix-role' }
          return { ok: true, redirectTo: roleHome(defaultRole) }
        } finally {
          set({ isLoading: false })
        }
      },

      /** Étape 3 : inscription nouveau compte */
      register: async (data) => {
        const telephone = get()._pendingPhone

        if (!USE_REAL_AUTH) {
          // ── DEV fallback ──
          const newUser = {
            id: `usr-${Date.now()}`, telephone, prenom: data.prenom,
            nom: data.nom, email: data.email || null, langue: data.langue || 'fr',
          }
          if (data.role === 'client') {
            const newClient = {
              id: `cli-${Date.now()}`, user_id: newUser.id, is_abonne: false,
              no_show_count: 0, is_bloque: false, credits_parrainage: 0,
              code_parrainage: `${data.prenom.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
            }
            set({
              user: newUser, roles: [{ role: 'client', statut: 'actif' }],
              activeRole: 'client', client: newClient,
              _pendingPhone: null, _pendingIsNew: false,
            })
            return { redirectTo: '/client/carte' }
          }
          set({
            user: newUser, roles: [{ role: 'candidat', statut: 'actif' }],
            activeRole: 'candidat', _pendingPhone: null, _pendingIsNew: false,
          })
          return { redirectTo: '/candidat/statut' }
        }

        // ── Supabase ──
        set({ isLoading: true })
        try {
          const role = data.role || 'client'
          const newUser = await createUser(
            {
              telephone: normalizePhone(telephone),
              prenom: data.prenom,
              nom: data.nom,
              email: data.email || null,
              langue: data.langue || 'fr',
            },
            role === 'partenaire' ? 'candidat' : role
          )

          // Créer le profil lié
          if (role === 'client') {
            const { createClient } = await import('../services/clients')
            const client = await createClient({
              user_id: newUser.id,
              is_abonne: false,
              code_parrainage: `${data.prenom.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
            })
            set({
              user: newUser, roles: [{ role: 'client', statut: 'actif' }],
              activeRole: 'client', client,
              _pendingPhone: null, _pendingIsNew: false,
            })
            return { redirectTo: '/client/carte' }
          }

          // Candidat partenaire
          const { submitCandidature } = await import('../services/candidatures')
          await submitCandidature({
            telephone: normalizePhone(telephone),
            prenom: data.prenom,
            nom: data.nom,
            email: data.email || null,
            specialites: data.specialites || [],
            experience: data.experience || '',
          })

          set({
            user: newUser, roles: [{ role: 'candidat', statut: 'actif' }],
            activeRole: 'candidat', _pendingPhone: null, _pendingIsNew: false,
          })
          return { redirectTo: '/candidat/statut' }
        } finally {
          set({ isLoading: false })
        }
      },

      /** Sélection de rôle actif */
      setActiveRole: (role) => {
        set({ activeRole: role })
        return roleHome(role)
      },

      /** Initialiser la session au chargement de l'app */
      initSession: async () => {
        if (!USE_REAL_AUTH) return

        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return

        set({ session })

        // Écouter les changements d'auth
        supabase.auth.onAuthStateChange((_event, session) => {
          set({ session })
          if (!session) {
            get().logout()
          }
        })
      },

      // ── Legacy mock helpers ──
      loginMock: () => {
        const p = DEV_PERSONAS['5149195970']
        set({ user: p.user, roles: p.roles, activeRole: p.activeRole, client: p.client, employe: p.employe, partenaire: p.partenaire })
      },
      loginMockAs: (role) => {
        const phoneMap = { admin: '5149195970', client: '5140000001', partenaire: '5140000002', employe: '5140000003', fournisseur: '5140000004' }
        const p = DEV_PERSONAS[phoneMap[role]] || DEV_PERSONAS['5149195970']
        set({ user: p.user, roles: p.roles, activeRole: role, client: p.client, partenaire: p.partenaire, employe: p.employe, fournisseur: p.fournisseur })
      },

      setUser: (user, roles, profiles) => set({ user, roles: roles || [], activeRole: roles?.[0]?.role || null, ...profiles }),
      setSession: (session) => set({ session }),
      setLoading:  (v) => set({ isLoading: v }),

      logout: async () => {
        if (USE_REAL_AUTH) {
          await supabase.auth.signOut().catch(() => {})
        }
        set({
          user: null, roles: [], activeRole: null,
          client: null, partenaire: null, employe: null, fournisseur: null,
          session: null, _pendingPhone: null, _pendingIsNew: false,
        })
      },

      updatePartenaire: (data) => set(s => ({ partenaire: { ...s.partenaire, ...data } })),
      updateClient:     (data) => set(s => ({ client:     { ...s.client,     ...data } })),
    }),
    {
      name: 'kadio-auth',
      partialize: (s) => ({
        user: s.user, roles: s.roles, activeRole: s.activeRole,
        client: s.client, partenaire: s.partenaire, employe: s.employe, fournisseur: s.fournisseur,
      }),
    }
  )
)

export { roleHome }
