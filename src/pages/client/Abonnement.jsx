import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OR, CREME, NOIR, CARD, formatDate } from '@/lib/utils'
import { useAbonnementClient, usePlans } from '@/hooks'
import { createSubscription } from '@/lib/stripe'

// ── Formatters carte ─────────────────────────────────────────────
function fmtCard(val)   { return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim() }
function fmtExpiry(val) { const d = val.replace(/\D/g, '').slice(0, 4); return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d }

function Spinner() {
  return (
    <span style={{ display: 'inline-block', width: 16, height: 16, border: `2px solid ${NOIR}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </span>
  )
}

function PlanCard({ forfait, isActive, onSelect }) {
  return (
    <div onClick={onSelect} style={{ background: CARD, border: `1.5px solid ${isActive ? OR : forfait.populaire ? 'rgba(184,146,42,0.35)' : 'rgba(184,146,42,0.12)'}`, borderRadius: 14, padding: '16px', cursor: 'pointer', position: 'relative', fontFamily: `'DM Sans', sans-serif` }}>
      {forfait.populaire && !isActive && (
        <div style={{ position: 'absolute', top: -10, left: 16, background: OR, color: NOIR, fontSize: 10, fontWeight: 700, padding: '2px 10px', borderRadius: 10 }}>Populaire</div>
      )}
      {isActive && (
        <div style={{ position: 'absolute', top: -10, left: 16, background: '#22c55e', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 10px', borderRadius: 10 }}>Plan actuel</div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div>
          <div style={{ color: NOIR, fontWeight: 700, fontSize: 14 }}>{forfait.nom}</div>
          <div style={{ color: 'rgba(14,12,9,0.45)', fontSize: 12, marginTop: 2 }}>{forfait.desc}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ color: OR, fontWeight: 800, fontSize: 18 }}>{forfait.prix} $</span>
          <div style={{ color: 'rgba(14,12,9,0.35)', fontSize: 11 }}>/mois</div>
        </div>
      </div>
      <div style={{ marginTop: 10 }}>
        {forfait.inclus.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{ color: '#22c55e', fontSize: 12 }}>✓</span>
            <span style={{ color: 'rgba(14,12,9,0.6)', fontSize: 12 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ClientAbonnement() {
  const navigate = useNavigate()
  const { data: abo, loading: loadingAbo } = useAbonnementClient('client-aminata')
  const { data: plans } = usePlans()

  const [showChangePlan, setShowChangePlan]   = useState(false)
  const [cancelConfirm, setCancelConfirm]     = useState(false)
  const [cancelled, setCancelled]             = useState(false)

  // Flux souscription
  const [selectedPlan, setSelectedPlan]       = useState(null)
  const [payStep, setPayStep]                 = useState(null)   // null | 'form' | 'processing' | 'success'
  const [cardNum, setCardNum]                 = useState('')
  const [expiry, setExpiry]                   = useState('')
  const [cvv, setCvv]                         = useState('')
  const [payError, setPayError]               = useState('')

  const hasAbo = abo && abo.statut === 'actif' && !cancelled

  const cardValid   = cardNum.replace(/\s/g, '').length === 16
  const expiryValid = /^\d{2}\/\d{2}$/.test(expiry)
  const cvvValid    = /^\d{3}$/.test(cvv)
  const formValid   = cardValid && expiryValid && cvvValid

  async function handleSouscrire() {
    if (!formValid || payStep === 'processing') return
    setPayStep('processing')
    setPayError('')
    try {
      const subscription = await createSubscription({
        planId: selectedPlan.id,
        stripePriceId: selectedPlan.stripePriceId || 'price_placeholder',
        clientEmail: 'client-aminata@kadio.app',
        clientId: 'client-aminata'
      })
      if (!subscription.ok) {
        setPayError(subscription.message || 'Souscription échouée.')
        setPayStep('form')
        return
      }
      setPayStep('success')
    } catch (err) {
      setPayError(err.message || 'Une erreur est survenue.')
      setPayStep('form')
    }
  }

  // ── Vue formulaire paiement ──────────────────────────────────────
  if (payStep === 'form' || payStep === 'processing') {
    return (
      <div style={{ fontFamily: `'DM Sans', sans-serif`, background: CREME, minHeight: '100vh', paddingBottom: 100 }}>
        <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button onClick={() => { setPayStep(null); setPayError('') }}
            style={{ background: 'none', border: 'none', color: OR, fontSize: 22, cursor: 'pointer', padding: 4 }}>←</button>
          <h1 style={{ color: NOIR, fontSize: 18, fontWeight: 700, margin: 0 }}>Paiement Stripe</h1>
        </div>
        <div style={{ padding: '0 20px' }}>
          {/* Récap plan */}
          <div style={{ background: CARD, border: `1.5px solid ${OR}`, borderRadius: 14, padding: '16px 18px', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: NOIR, fontWeight: 700, fontSize: 15 }}>{selectedPlan?.nom}</div>
                <div style={{ color: 'rgba(14,12,9,0.45)', fontSize: 12, marginTop: 2 }}>Renouvellement mensuel automatique</div>
              </div>
              <div style={{ color: OR, fontWeight: 800, fontSize: 22 }}>{selectedPlan?.prix} $<span style={{ color: 'rgba(14,12,9,0.35)', fontSize: 12, fontWeight: 400 }}>/mois</span></div>
            </div>
          </div>

          {/* Champs carte */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            <div>
              <p style={{ color: 'rgba(14,12,9,0.5)', fontSize: 11, margin: '0 0 6px', textTransform: 'uppercase', fontWeight: 700 }}>Numéro de carte</p>
              <input value={cardNum} onChange={e => setCardNum(fmtCard(e.target.value))} placeholder="1234 5678 9012 3456" maxLength={19} inputMode="numeric"
                style={{ width: '100%', background: CARD, border: `1.5px solid ${cardNum && !cardValid ? '#ef4444' : 'rgba(184,146,42,0.25)'}`, borderRadius: 10, padding: '14px 16px', color: NOIR, fontSize: 16, fontFamily: 'monospace', letterSpacing: '0.08em', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'rgba(14,12,9,0.5)', fontSize: 11, margin: '0 0 6px', textTransform: 'uppercase', fontWeight: 700 }}>Expiration</p>
                <input value={expiry} onChange={e => setExpiry(fmtExpiry(e.target.value))} placeholder="MM/AA" maxLength={5} inputMode="numeric"
                  style={{ width: '100%', background: CARD, border: `1.5px solid ${expiry && !expiryValid ? '#ef4444' : 'rgba(184,146,42,0.25)'}`, borderRadius: 10, padding: '14px 16px', color: NOIR, fontSize: 15, fontFamily: 'monospace', boxSizing: 'border-box' }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'rgba(14,12,9,0.5)', fontSize: 11, margin: '0 0 6px', textTransform: 'uppercase', fontWeight: 700 }}>CVV</p>
                <input value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))} placeholder="123" maxLength={3} inputMode="numeric" type="password"
                  style={{ width: '100%', background: CARD, border: `1.5px solid ${cvv && !cvvValid ? '#ef4444' : 'rgba(184,146,42,0.25)'}`, borderRadius: 10, padding: '14px 16px', color: NOIR, fontSize: 15, fontFamily: 'monospace', boxSizing: 'border-box' }} />
              </div>
            </div>
          </div>

          {payError && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
              <p style={{ color: '#f87171', fontSize: 13, margin: 0, fontWeight: 600 }}>{payError}</p>
            </div>
          )}

          {/* Cartes test */}
          <div style={{ background: CARD, borderRadius: 10, padding: '12px 14px', marginBottom: 20 }}>
            <p style={{ color: 'rgba(14,12,9,0.4)', fontSize: 11, margin: '0 0 8px', textTransform: 'uppercase', fontWeight: 700 }}>Cartes test</p>
            {[{ num: '4242 4242 4242 4242', label: 'Succès', ok: true }, { num: '4000 0000 0000 0002', label: 'Refusée', ok: false }].map(tc => (
              <div key={tc.num} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <button onClick={() => { setCardNum(tc.num); setExpiry('12/28'); setCvv('123'); setPayError('') }}
                  style={{ background: 'none', border: 'none', color: OR, fontFamily: 'monospace', fontSize: 13, cursor: 'pointer', padding: 0 }}>{tc.num}</button>
                <span style={{ fontSize: 11, color: tc.ok ? '#22c55e' : '#f87171', fontWeight: 600 }}>→ {tc.label}</span>
              </div>
            ))}
          </div>

          <button onClick={handleSouscrire} disabled={!formValid || payStep === 'processing'}
            style={{ width: '100%', padding: '15px 0', borderRadius: 12, border: 'none', background: formValid && payStep !== 'processing' ? OR : 'rgba(184,146,42,0.25)', color: formValid && payStep !== 'processing' ? NOIR : 'rgba(14,12,9,0.3)', fontWeight: 700, fontSize: 16, cursor: 'pointer', fontFamily: `'DM Sans', sans-serif`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            {payStep === 'processing' ? <><Spinner /> Traitement en cours…</> : `Oui, je veux économiser ${selectedPlan?.prix} $/mois →`}
          </button>
          <p style={{ color: 'rgba(14,12,9,0.4)', fontSize: 12, textAlign: 'center', marginTop: 10 }}>
            🔒 Résiliable à tout moment · Aucun engagement · Paiement sécurisé Stripe
          </p>
          <p style={{ color: '#22c55e', fontSize: 12, textAlign: 'center', marginTop: 4 }}>
            ✓ Activation immédiate après paiement
          </p>
        </div>
      </div>
    )
  }

  // ── Succès souscription ──────────────────────────────────────────
  if (payStep === 'success') {
    return (
      <div style={{ fontFamily: `'DM Sans', sans-serif`, background: CREME, minHeight: '100vh', paddingBottom: 100 }}>
        <div style={{ padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(34,197,94,0.12)', border: `3px solid #22c55e`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 36 }}>✓</div>
          <h2 style={{ color: NOIR, fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Abonnement activé !</h2>
          <p style={{ color: 'rgba(14,12,9,0.5)', fontSize: 14, marginBottom: 6 }}>
            Forfait <span style={{ color: OR, fontWeight: 700 }}>{selectedPlan?.nom}</span> actif.
          </p>
          <p style={{ color: 'rgba(14,12,9,0.4)', fontSize: 13, marginBottom: 32 }}>
            {selectedPlan?.prix} $/mois · Premier prélèvement immédiat
          </p>
          <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 12 }}>
            <p style={{ color: '#4ade80', fontSize: 13, margin: 0 }}>SMS de confirmation envoyé · Badge abonné actif</p>
          </div>
          <button onClick={() => navigate('/client/accueil')}
            style={{ width: '100%', marginTop: 20, padding: '14px 0', borderRadius: 12, border: 'none', background: OR, color: NOIR, fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: `'DM Sans', sans-serif` }}>
            Retour à l'accueil
          </button>
        </div>
      </div>
    )
  }

  // ── Vue sans abonnement ──────────────────────────────────────────
  if (!hasAbo) {
    return (
      <div style={{ fontFamily: `'DM Sans', sans-serif`, background: CREME, minHeight: '100vh', paddingBottom: 100 }}>
        <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid rgba(14,12,9,0.08)' }}>
          <h1 style={{ color: NOIR, fontSize: 22, fontWeight: 700, margin: 0 }}>Abonnements</h1>
        </div>
        {/* Bannière économies */}
        <div style={{ margin: '16px 16px 0', background: 'linear-gradient(135deg, rgba(184,146,42,0.18) 0%, rgba(184,146,42,0.06) 100%)', border: `1.5px solid ${OR}`, borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 26, flexShrink: 0 }}>💡</div>
          <div>
            <div style={{ color: OR, fontWeight: 700, fontSize: 13, marginBottom: 2 }}>Les membres économisent en moyenne 340$ par an.</div>
            <div style={{ color: 'rgba(14,12,9,0.6)', fontSize: 12 }}>Votre premier mois est le plus important.</div>
          </div>
        </div>
        <div style={{ margin: '16px 16px', background: 'linear-gradient(135deg, rgba(14,12,9,0.08) 0%, rgba(184,146,42,0.05) 100%)', border: `1.5px solid ${OR}`, borderRadius: 16, padding: '24px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>✂️</div>
          <h2 style={{ color: NOIR, fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Abonnez-vous et économisez</h2>
          <p style={{ color: 'rgba(14,12,9,0.55)', fontSize: 14, marginBottom: 4 }}>Jusqu'à 25% de réduction sur vos services</p>
          <p style={{ color: 'rgba(14,12,9,0.4)', fontSize: 13 }}>Votre créneau avant tout le monde · On vous rappelle 24h avant · Un coiffeur qui vous connaît</p>
        </div>
        <div style={{ padding: '0 16px' }}>
          <h3 style={{ color: 'rgba(14,12,9,0.6)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>Tous les forfaits</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {plans.map(f => (
              <PlanCard key={f.id} forfait={f} isActive={false}
                onSelect={() => { setSelectedPlan(f); setPayStep('form'); setCardNum(''); setExpiry(''); setCvv(''); setPayError('') }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Changer de plan ──────────────────────────────────────────────
  if (showChangePlan) {
    return (
      <div style={{ fontFamily: `'DM Sans', sans-serif`, background: CREME, minHeight: '100vh', paddingBottom: 100 }}>
        <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button onClick={() => setShowChangePlan(false)}
            style={{ background: 'none', border: 'none', color: OR, fontSize: 22, cursor: 'pointer', padding: 4 }}>←</button>
          <h1 style={{ color: NOIR, fontSize: 18, fontWeight: 700, margin: 0 }}>Changer de plan</h1>
        </div>
        <div style={{ padding: '0 16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {plans.map(f => (
              <PlanCard key={f.id} forfait={f} isActive={f.id === abo.plan.id}
                onSelect={() => {
                  if (f.id !== abo.plan.id) {
                    setSelectedPlan(f); setPayStep('form')
                    setCardNum(''); setExpiry(''); setCvv(''); setPayError('')
                  }
                }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Vue abonnement actif ─────────────────────────────────────────
  const progressPct = Math.min(100, (abo.visites_ce_mois / abo.visites_max) * 100)

  return (
    <div style={{ fontFamily: `'DM Sans', sans-serif`, background: CREME, minHeight: '100vh', paddingBottom: 100 }}>

      {cancelConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(14,12,9,0.85)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', fontFamily: `'DM Sans', sans-serif` }}>
          <div style={{ background: CARD, border: '1.5px solid rgba(14,12,9,0.08)', borderRadius: '20px 20px 0 0', padding: '28px 24px 36px', width: '100%', maxWidth: 480 }}>
            <h3 style={{ color: NOIR, fontSize: 17, fontWeight: 700, marginBottom: 8 }}>Annuler l'abonnement ?</h3>
            <p style={{ color: 'rgba(14,12,9,0.5)', fontSize: 13, marginBottom: 20 }}>
              Vous perdrez l'accès à votre forfait {abo.plan.nom} à la fin de la période actuelle.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setCancelConfirm(false)}
                style={{ flex: 1, padding: '12px 0', background: 'transparent', border: '1.5px solid rgba(14,12,9,0.08)', borderRadius: 12, color: NOIR, fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: `'DM Sans', sans-serif` }}>
                Garder
              </button>
              <button onClick={() => { setCancelled(true); setCancelConfirm(false) }}
                style={{ flex: 1, padding: '12px 0', background: '#ef4444', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: `'DM Sans', sans-serif` }}>
                Annuler l'abo
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid rgba(14,12,9,0.08)' }}>
        <h1 style={{ color: NOIR, fontSize: 22, fontWeight: 700, margin: 0 }}>Mon abonnement</h1>
      </div>

      <div style={{ padding: '20px 16px' }}>
        <div style={{ background: CARD, border: `2px solid ${OR}`, borderRadius: 16, padding: '20px 18px', marginBottom: 20, position: 'relative' }}>
          <div style={{ position: 'absolute', top: -11, left: 18, background: OR, color: NOIR, fontSize: 11, fontWeight: 700, padding: '2px 12px', borderRadius: 10 }}>Plan actif</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <div style={{ color: NOIR, fontWeight: 700, fontSize: 18 }}>{abo.plan.nom}</div>
              <div style={{ color: 'rgba(14,12,9,0.5)', fontSize: 13, marginTop: 2 }}>{abo.plan.desc}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: OR, fontWeight: 800, fontSize: 22 }}>{abo.plan.prix} $</div>
              <div style={{ color: 'rgba(14,12,9,0.35)', fontSize: 12 }}>/mois</div>
            </div>
          </div>
          <div style={{ color: 'rgba(14,12,9,0.45)', fontSize: 12, marginBottom: 14 }}>
            Prochain renouvellement : <span style={{ color: NOIR, fontWeight: 600 }}>{formatDate(abo.date_prochain_renouvellement)}</span>
          </div>
          <div style={{ marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'rgba(14,12,9,0.6)', fontSize: 12 }}>Utilisation ce mois</span>
            <span style={{ color: NOIR, fontSize: 13, fontWeight: 600 }}>{abo.visites_ce_mois} / {abo.visites_max} visite{abo.visites_max > 1 ? 's' : ''}</span>
          </div>
          <div style={{ background: 'rgba(184,146,42,0.12)', borderRadius: 6, height: 8, overflow: 'hidden' }}>
            <div style={{ width: `${progressPct}%`, height: '100%', background: progressPct >= 100 ? '#22c55e' : OR, borderRadius: 6 }} />
          </div>
          <div style={{ marginTop: 16, borderTop: '1px solid rgba(184,146,42,0.12)', paddingTop: 14 }}>
            <div style={{ color: 'rgba(14,12,9,0.5)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Inclus dans votre plan</div>
            {abo.plan.inclus.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ color: '#22c55e', fontSize: 13 }}>✓</span>
                <span style={{ color: 'rgba(14,12,9,0.7)', fontSize: 13 }}>{item}</span>
              </div>
            ))}
          </div>
          <div style={{ color: 'rgba(14,12,9,0.35)', fontSize: 11, marginTop: 10 }}>Mode de paiement : {abo.mode_paiement}</div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => setShowChangePlan(true)}
            style={{ flex: 1, padding: '13px 0', background: 'rgba(14,12,9,0.08)', border: `1.5px solid rgba(14,12,9,0.08)`, borderRadius: 12, color: OR, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: `'DM Sans', sans-serif` }}>
            Changer de plan
          </button>
          <button onClick={() => setCancelConfirm(true)}
            style={{ flex: 1, padding: '13px 0', background: 'transparent', border: `1.5px solid rgba(239,68,68,0.3)`, borderRadius: 12, color: '#ef4444', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: `'DM Sans', sans-serif` }}>
            Annuler l'abo
          </button>
        </div>
      </div>
    </div>
  )
}
