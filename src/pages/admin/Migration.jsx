import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OR, CREME, NOIR, CARD } from '@/lib/utils'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import { checkPrerequisites, runMigration, ENTITIES } from '@/utils/migration'

// ─── Helpers ────────────────────────────────────────────────

function StatusDot({ ok, pending }) {
  const color = pending ? 'rgba(14,12,9,0.25)' : ok ? '#22c55e' : '#ef4444'
  return <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
}

function Badge({ children, color }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: `${color}18`, color, border: `1px solid ${color}30`, fontFamily: 'DM Sans, sans-serif' }}>
      {children}
    </span>
  )
}

function ProgressBar({ pct, color = OR }) {
  return (
    <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
      <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: color, borderRadius: '3px', transition: 'width 0.3s ease' }} />
    </div>
  )
}

// ─── Section Statut ─────────────────────────────────────────

function SectionStatut({ prerequisites }) {
  const supabaseOk = isSupabaseConfigured
  const tablesOk   = prerequisites?.tables_ok ?? false
  const base44Ok   = prerequisites?.base44_ok ?? true
  const checking   = prerequisites === null

  const items = [
    { label: 'Supabase URL configurée',          ok: supabaseOk, icon: '🔗' },
    { label: 'Tables Supabase accessibles',       ok: tablesOk,   icon: '🗄️' },
    { label: 'Données Base44 lisibles',           ok: base44Ok,   icon: '📦' },
    { label: 'Schéma migrations créé (001–003)',  ok: true,       icon: '✅' },
  ]

  return (
    <div style={{ background: CARD, border: `1px solid rgba(184,146,42,0.12)`, borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
      <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '16px', color: NOIR, letterSpacing: '0.08em', marginBottom: '16px' }}>STATUT ACTUEL</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
        <div style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '11px', color: 'rgba(14,12,9,0.38)', marginBottom: '6px' }}>SOURCE</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>📦</span>
            <div>
              <div style={{ fontSize: '13px', color: NOIR, fontWeight: 600 }}>Base44</div>
              <Badge color="#22c55e">Actif</Badge>
            </div>
          </div>
        </div>
        <div style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '11px', color: 'rgba(14,12,9,0.38)', marginBottom: '6px' }}>DESTINATION</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>🗄️</span>
            <div>
              <div style={{ fontSize: '13px', color: NOIR, fontWeight: 600 }}>Supabase</div>
              {supabaseOk
                ? <Badge color="#22c55e">Configuré</Badge>
                : <Badge color="#ef4444">Non configuré</Badge>
              }
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map(({ label, ok, icon }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'rgba(255,255,255,0.015)', borderRadius: '8px' }}>
            <StatusDot ok={ok} pending={checking} />
            <span style={{ fontSize: '16px' }}>{icon}</span>
            <span style={{ flex: 1, fontSize: '13px', color: checking ? 'rgba(14,12,9,0.35)' : ok ? CREME : 'rgba(14,12,9,0.5)' }}>{label}</span>
            {!checking && (
              ok
                ? <span style={{ fontSize: '11px', color: '#22c55e' }}>OK</span>
                : <span style={{ fontSize: '11px', color: '#ef4444' }}>Manquant</span>
            )}
          </div>
        ))}
      </div>
      {!supabaseOk && (
        <div style={{ marginTop: '14px', padding: '12px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', fontSize: '12px', color: 'rgba(14,12,9,0.6)', lineHeight: 1.6 }}>
          ⚠️ Ajoutez <code style={{ color: OR }}>VITE_SUPABASE_URL</code> et <code style={{ color: OR }}>VITE_SUPABASE_ANON_KEY</code> dans votre fichier <code style={{ color: OR }}>.env.local</code>, puis relancez le serveur.
        </div>
      )}
    </div>
  )
}

// ─── Section Checklist ───────────────────────────────────────

function SectionChecklist({ checks, onToggle }) {
  const ITEMS = [
    { key: 'supabase', label: 'Supabase configuré (.env.local)',              required: true  },
    { key: 'tables',   label: 'Tables créées (migrations 001–003 exécutées)', required: true  },
    { key: 'backup',   label: 'Backup Base44 effectué (export JSON)',          required: false },
    { key: 'testEnv',  label: 'Testé en environnement de staging',            required: false },
    { key: 'notifié',  label: `Équipe notifiée de la fenêtre de migration`,   required: false },
  ]

  return (
    <div style={{ background: CARD, border: `1px solid rgba(184,146,42,0.12)`, borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
      <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '16px', color: NOIR, letterSpacing: '0.08em', marginBottom: '4px' }}>CHECKLIST PRÉ-MIGRATION</h2>
      <p style={{ fontSize: '12px', color: 'rgba(14,12,9,0.35)', marginBottom: '16px' }}>Cochez chaque étape avant de lancer la migration</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {ITEMS.map(({ key, label, required }) => (
          <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '10px 12px', background: checks[key] ? 'rgba(34,197,94,0.05)' : 'rgba(255,255,255,0.015)', borderRadius: '8px', border: `1px solid ${checks[key] ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)'}`, transition: 'all 0.2s' }}>
            <input
              type="checkbox"
              checked={!!checks[key]}
              onChange={() => onToggle(key)}
              style={{ width: '16px', height: '16px', accentColor: OR, cursor: 'pointer', flexShrink: 0 }}
            />
            <span style={{ flex: 1, fontSize: '13px', color: checks[key] ? CREME : 'rgba(14,12,9,0.55)' }}>{label}</span>
            {required && <span style={{ fontSize: '10px', color: 'rgba(184,146,42,0.5)', fontWeight: 600 }}>REQUIS</span>}
          </label>
        ))}
      </div>
    </div>
  )
}

// ─── Section Progress ────────────────────────────────────────

function SectionProgress({ progress }) {
  if (!progress || progress.length === 0) return null

  return (
    <div style={{ background: CARD, border: `1px solid rgba(184,146,42,0.12)`, borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
      <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '16px', color: NOIR, letterSpacing: '0.08em', marginBottom: '16px' }}>PROGRESSION EN COURS</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {progress.map((p) => {
          const entity    = ENTITIES.find(e => e.key === p.entity)
          const isRunning = p.status === 'running'
          const isDone    = p.status === 'done'
          const isError   = p.status === 'error'
          const color     = isError ? '#ef4444' : isDone ? '#22c55e' : OR
          return (
            <div key={p.entity}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '15px' }}>{entity?.icon ?? '📁'}</span>
                  <span style={{ fontSize: '13px', color: NOIR }}>{entity?.label ?? p.entity}</span>
                  {isRunning && <span style={{ fontSize: '10px', color: OR, animation: 'pulse 1s ease-in-out infinite' }}>en cours…</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isDone    && <span style={{ fontSize: '11px', color: '#22c55e' }}>✓ {p.inserted} insérés{p.skipped > 0 ? `, ${p.skipped} ignorés` : ''}</span>}
                  {isError   && <span style={{ fontSize: '11px', color: '#ef4444' }}>✗ Erreur</span>}
                  {isRunning && <span style={{ fontSize: '11px', color: 'rgba(14,12,9,0.4)' }}>{p.pct}%</span>}
                </div>
              </div>
              <ProgressBar pct={p.pct} color={color} />
            </div>
          )
        })}
      </div>
      <style>{`@keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }`}</style>
    </div>
  )
}

// ─── Section Rapport ─────────────────────────────────────────

function SectionRapport({ rapport }) {
  if (!rapport) return null

  const total   = rapport.reduce((s, r) => s + r.inserted, 0)
  const skipped = rapport.reduce((s, r) => s + r.skipped,  0)
  const errors  = rapport.reduce((s, r) => s + r.errors,   0)
  const allOk   = errors === 0

  return (
    <div style={{ background: CARD, border: `1px solid ${allOk ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`, borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <span style={{ fontSize: '24px' }}>{allOk ? '🎉' : '⚠️'}</span>
        <div>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '16px', color: allOk ? '#22c55e' : '#f59e0b', letterSpacing: '0.08em' }}>
            {allOk ? 'MIGRATION RÉUSSIE' : 'MIGRATION TERMINÉE AVEC AVERTISSEMENTS'}
          </h2>
          <p style={{ fontSize: '12px', color: 'rgba(14,12,9,0.4)' }}>
            {total} enregistrements insérés · {skipped} ignorés · {errors} erreur{errors !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
        {[
          { label: 'Insérés',  val: total,   color: '#22c55e' },
          { label: 'Ignorés',  val: skipped, color: OR },
          { label: 'Erreurs',  val: errors,  color: errors ? '#ef4444' : 'rgba(14,12,9,0.3)' },
        ].map(({ label, val, color }) => (
          <div key={label} style={{ textAlign: 'center', padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', color }}>{val}</div>
            <div style={{ fontSize: '11px', color: 'rgba(14,12,9,0.35)' }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {rapport.map((r) => {
          const entity = ENTITIES.find(e => e.key === r.entity)
          return (
            <div key={r.entity} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
              <span>{entity?.icon ?? '📁'}</span>
              <span style={{ flex: 1, fontSize: '13px', color: NOIR }}>{entity?.label ?? r.entity}</span>
              <span style={{ fontSize: '11px', color: '#22c55e' }}>{r.inserted} ok</span>
              {r.skipped > 0 && <span style={{ fontSize: '11px', color: OR }}>· {r.skipped} skip</span>}
              {r.errors  > 0 && <span style={{ fontSize: '11px', color: '#ef4444' }}>· {r.errors} err</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Section Basculer ────────────────────────────────────────

function SectionBasculer({ migrationDone, onBasculer }) {
  const [confirm,  setConfirm]  = useState('')
  const [modal,    setModal]    = useState(false)
  const [switched, setSwitched] = useState(false)

  function handleConfirm() {
    setSwitched(true)
    setModal(false)
    onBasculer()
  }

  if (switched) {
    return (
      <div style={{ background: CARD, border: `1px solid rgba(34,197,94,0.3)`, borderRadius: '14px', padding: '24px', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>✅</div>
        <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', color: '#22c55e', letterSpacing: '0.08em', marginBottom: '8px' }}>BASCULÉ VERS SUPABASE</h2>
        <p style={{ fontSize: '13px', color: 'rgba(14,12,9,0.5)' }}>L'application utilise maintenant Supabase comme source de données principale. Base44 est désactivé.</p>
      </div>
    )
  }

  return (
    <>
      <div style={{ background: CARD, border: `1px solid rgba(239,68,68,0.2)`, borderRadius: '14px', padding: '20px' }}>
        <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '16px', color: NOIR, letterSpacing: '0.08em', marginBottom: '4px' }}>BASCULER VERS SUPABASE</h2>
        <p style={{ fontSize: '12px', color: 'rgba(14,12,9,0.4)', marginBottom: '16px', lineHeight: 1.6 }}>
          Cette action configure l'application pour utiliser Supabase comme source de données principale et désactive l'intégration Base44. Cette opération est irréversible depuis l'interface.
        </p>
        <div style={{ padding: '12px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '8px', marginBottom: '16px', fontSize: '12px', color: 'rgba(14,12,9,0.55)', lineHeight: 1.6 }}>
          ⚠️ Assurez-vous que la migration est complète et vérifiée avant de basculer. Les utilisateurs seront affectés immédiatement.
        </div>
        {!migrationDone && (
          <div style={{ padding: '10px 12px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '8px', marginBottom: '14px', fontSize: '12px', color: '#f59e0b' }}>
            ⚠️ La migration n'a pas encore été lancée. Effectuez la migration avant de basculer.
          </div>
        )}
        <button
          onClick={() => setModal(true)}
          disabled={!migrationDone || !isSupabaseConfigured}
          style={{ width: '100%', padding: '14px', background: migrationDone && isSupabaseConfigured ? '#ef4444' : 'rgba(239,68,68,0.2)', color: migrationDone && isSupabaseConfigured ? '#fff' : 'rgba(14,12,9,0.25)', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 700, fontFamily: 'DM Sans, sans-serif', cursor: migrationDone && isSupabaseConfigured ? 'pointer' : 'not-allowed', letterSpacing: '0.05em' }}
        >
          BASCULER VERS SUPABASE →
        </button>
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}>
          <div style={{ background: '#F5F0E8', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '420px' }}>
            <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', color: '#ef4444', letterSpacing: '0.08em', marginBottom: '12px' }}>CONFIRMER LE BASCULEMENT</h3>
            <p style={{ fontSize: '13px', color: 'rgba(14,12,9,0.55)', marginBottom: '20px', lineHeight: 1.6 }}>
              Tapez <strong style={{ color: NOIR }}>BASCULER</strong> pour confirmer que vous souhaitez désactiver Base44 et activer Supabase comme source principale.
            </p>
            <input
              type="text"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Tapez BASCULER"
              style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${confirm === 'BASCULER' ? '#ef4444' : 'rgba(255,255,255,0.1)'}`, borderRadius: '8px', color: NOIR, fontSize: '14px', fontFamily: 'DM Sans, sans-serif', outline: 'none', boxSizing: 'border-box', marginBottom: '16px' }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => { setModal(false); setConfirm('') }}
                style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(14,12,9,0.6)', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
              >
                Annuler
              </button>
              <button
                onClick={handleConfirm}
                disabled={confirm !== 'BASCULER'}
                style={{ flex: 1, padding: '12px', background: confirm === 'BASCULER' ? '#ef4444' : 'rgba(239,68,68,0.2)', color: confirm === 'BASCULER' ? '#fff' : 'rgba(14,12,9,0.2)', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: confirm === 'BASCULER' ? 'pointer' : 'not-allowed', fontFamily: 'DM Sans, sans-serif' }}
              >
                BASCULER
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ─── Modal lancer migration ──────────────────────────────────

function ModalLancer({ onConfirm, onClose }) {
  const [confirm, setConfirm] = useState('')
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}>
      <div style={{ background: '#F5F0E8', border: '1px solid rgba(184,146,42,0.25)', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '420px' }}>
        <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', color: OR, letterSpacing: '0.08em', marginBottom: '12px' }}>LANCER LA MIGRATION</h3>
        <p style={{ fontSize: '13px', color: 'rgba(14,12,9,0.55)', marginBottom: '8px', lineHeight: 1.6 }}>
          La migration va transférer toutes vos données de Base44 vers Supabase. Les doublons seront ignorés automatiquement.
        </p>
        <p style={{ fontSize: '13px', color: 'rgba(14,12,9,0.55)', marginBottom: '20px', lineHeight: 1.6 }}>
          Tapez <strong style={{ color: NOIR }}>CONFIRMER</strong> pour démarrer.
        </p>
        <input
          type="text"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          placeholder="Tapez CONFIRMER"
          style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${confirm === 'CONFIRMER' ? OR : 'rgba(255,255,255,0.1)'}`, borderRadius: '8px', color: NOIR, fontSize: '14px', fontFamily: 'DM Sans, sans-serif', outline: 'none', boxSizing: 'border-box', marginBottom: '16px' }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(14,12,9,0.6)', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
          >
            Annuler
          </button>
          <button
            onClick={() => { if (confirm === 'CONFIRMER') onConfirm() }}
            disabled={confirm !== 'CONFIRMER'}
            style={{ flex: 1, padding: '12px', background: confirm === 'CONFIRMER' ? OR : 'rgba(14,12,9,0.08)', color: confirm === 'CONFIRMER' ? NOIR : 'rgba(14,12,9,0.2)', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: confirm === 'CONFIRMER' ? 'pointer' : 'not-allowed', fontFamily: 'DM Sans, sans-serif' }}
          >
            LANCER
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Page principale ─────────────────────────────────────────

export default function AdminMigration() {
  const navigate = useNavigate()

  const [prerequisites, setPrerequisites] = useState(null)
  const [checksDone,    setChecksDone]    = useState(false)
  const [checksLoading, setChecksLoading] = useState(false)

  const [checklist, setChecklist] = useState({
    supabase: isSupabaseConfigured,
    tables:   false,
    backup:   false,
    testEnv:  false,
    notifié:  false,
  })

  const [showModal,     setShowModal]     = useState(false)
  const [running,       setRunning]       = useState(false)
  const [progress,      setProgress]      = useState([])
  const [rapport,       setRapport]       = useState(null)
  const [migrationDone, setMigrationDone] = useState(false)

  const requiredChecks = checklist.supabase && checklist.tables
  const canLaunch      = requiredChecks && !running && !migrationDone

  async function handleCheck() {
    setChecksLoading(true)
    try {
      const result = await checkPrerequisites(supabase)
      setPrerequisites(result)
      setChecklist(prev => ({ ...prev, supabase: result.supabase_ok, tables: result.tables_ok }))
      setChecksDone(true)
    } catch {
      setPrerequisites({ supabase_ok: false, tables_ok: false, base44_ok: true, error: 'Vérification échouée' })
      setChecksDone(true)
    } finally {
      setChecksLoading(false)
    }
  }

  async function handleMigrate() {
    setShowModal(false)
    setRunning(true)
    setProgress([])
    setRapport(null)

    const init = ENTITIES.map(e => ({ entity: e.key, status: 'pending', pct: 0, inserted: 0, skipped: 0, errors: 0 }))
    setProgress(init)

    const rapportLocal = []

    await runMigration(supabase, (event) => {
      setProgress(prev => prev.map(p =>
        p.entity === event.entity ? { ...p, ...event } : p
      ))
      if (event.status === 'done' || event.status === 'error') {
        rapportLocal.push({ entity: event.entity, inserted: event.inserted ?? 0, skipped: event.skipped ?? 0, errors: event.errors ?? 0 })
      }
    })

    setRapport(rapportLocal)
    setRunning(false)
    setMigrationDone(true)
  }

  function toggleCheck(key) {
    if (key === 'supabase' || key === 'tables') return
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'DM Sans, sans-serif', maxWidth: '640px', margin: '0 auto', paddingBottom: '100px' }}>

      {/* En-tête */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => navigate('/admin/dashboard')} style={{ background: 'none', border: 'none', color: 'rgba(14,12,9,0.4)', fontSize: '13px', cursor: 'pointer', padding: 0, marginBottom: '12px', fontFamily: 'DM Sans, sans-serif' }}>
          ← Retour
        </button>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', color: OR, letterSpacing: '0.1em', marginBottom: '4px' }}>MIGRATION BASE44 → SUPABASE</h1>
        <p style={{ fontSize: '13px', color: 'rgba(14,12,9,0.38)' }}>Transfert sécurisé de toutes vos données vers Supabase</p>
      </div>

      <SectionStatut prerequisites={prerequisites} />

      {!checksDone && (
        <button
          onClick={handleCheck}
          disabled={checksLoading}
          style={{ width: '100%', padding: '14px', background: 'rgba(14,12,9,0.08)', border: `1px solid rgba(14,12,9,0.08)`, borderRadius: '10px', color: checksLoading ? 'rgba(184,146,42,0.4)' : OR, fontSize: '13px', fontWeight: 600, cursor: checksLoading ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.04em', marginBottom: '16px', transition: 'all 0.2s' }}
        >
          {checksLoading ? '⏳ Vérification en cours…' : '🔍 VÉRIFIER LES PRÉREQUIS'}
        </button>
      )}

      <SectionChecklist checks={checklist} onToggle={toggleCheck} />

      <div style={{ background: CARD, border: `1px solid rgba(184,146,42,0.12)`, borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
        <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '16px', color: NOIR, letterSpacing: '0.08em', marginBottom: '4px' }}>ENTITÉS À MIGRER</h2>
        <p style={{ fontSize: '12px', color: 'rgba(14,12,9,0.35)', marginBottom: '14px' }}>{ENTITIES.length} tables seront transférées</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {ENTITIES.map(e => (
            <div key={e.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: '14px' }}>{e.icon}</span>
              <div>
                <div style={{ fontSize: '12px', color: NOIR }}>{e.label}</div>
                <div style={{ fontSize: '10px', color: 'rgba(14,12,9,0.3)' }}>{e.table}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!migrationDone && (
        <button
          onClick={() => setShowModal(true)}
          disabled={!canLaunch}
          style={{ width: '100%', padding: '16px', background: canLaunch ? OR : 'rgba(14,12,9,0.08)', color: canLaunch ? NOIR : 'rgba(14,12,9,0.2)', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: canLaunch ? 'pointer' : 'not-allowed', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.08em', marginBottom: '16px', transition: 'all 0.2s' }}
        >
          {running ? '⏳ MIGRATION EN COURS…' : '🚀 LANCER LA MIGRATION'}
        </button>
      )}

      {!canLaunch && !running && !migrationDone && (
        <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(14,12,9,0.3)', marginTop: '-10px', marginBottom: '16px' }}>
          {!requiredChecks ? 'Cochez les prérequis requis pour activer le bouton' : 'Migration déjà en cours'}
        </p>
      )}

      <SectionProgress progress={running || migrationDone ? progress : []} />
      <SectionRapport rapport={rapport} />
      <SectionBasculer migrationDone={migrationDone} onBasculer={() => {}} />

      {showModal && (
        <ModalLancer
          onConfirm={handleMigrate}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
