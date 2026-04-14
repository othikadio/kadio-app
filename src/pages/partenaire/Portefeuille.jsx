import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useTransactionsPartenaire, usePartenaireProfil } from '@/hooks'
import { OR, CREME, NOIR, CARD, formatMontant, formatDate } from '@/lib/utils'
import { transferToPartner } from '@/lib/stripe'

const TYPE_TABS = [
  { key: 'tout',       label: 'Tout' },
  { key: 'commission', label: 'Commissions' },
  { key: 'bonus',      label: 'Bonus' },
  { key: 'retrait',    label: 'Retraits' },
]

function typeColor(type) {
  if (type === 'commission') return OR
  if (type === 'bonus')      return '#10B981'
  if (type === 'retrait')    return '#EF4444'
  return '#6b7280'
}

function typeLabel(type) {
  const MAP = { commission: 'Commission', bonus: 'Bonus', retrait: 'Retrait' }
  return MAP[type] || type
}

function Spinner() {
  return (
    <span style={{ display: 'inline-block', width: 16, height: 16, border: `2px solid ${NOIR}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </span>
  )
}

export default function PartenairePortefeuille() {
  const { partenaire } = useAuthStore()
  const partenaireId = partenaire?.id || 'part-diane'
  const userId = partenaire?.user_id || 'usr-diane'

  const { data: transactions, loading: loadingTx } = useTransactionsPartenaire(partenaireId)
  const { data: profil, loading: loadingProfil } = usePartenaireProfil(userId)

  if (loadingTx || loadingProfil) {
    return <div style={{ fontFamily: `'DM Sans', sans-serif`, color: NOIR, padding: '16px', textAlign: 'center' }}>Chargement...</div>
  }

  const p = profil || {}

  const [activeTab, setActiveTab] = useState('tout')
  const [showSheet, setShowSheet] = useState(false)
  const [montant, setMontant]     = useState('')
  const [methode, setMethode]     = useState('square')
  const [compte, setCompte]       = useState('')   // Square ID ou email Stripe
  const [processing, setProcessing] = useState(false)
  const [result, setResult]       = useState(null) // { ok, message, arrivalDate? }

  const filteredTransactions = (transactions || []).filter(t => activeTab === 'tout' || t.type === activeTab)

  const montantVal   = parseFloat(montant) || 0
  const montantValid = montantVal > 0 && montantVal <= p.portefeuille_solde
  const compteValid  = compte.trim().length >= 4
  const canSubmit    = montantValid && compteValid && !processing

  async function handleRetrait() {
    if (!canSubmit) return
    setProcessing(true)
    setResult(null)

    let res
    if (methode === 'stripe') {
      res = await transferToPartner(montantVal, `acct_diane_${compte.trim().replace(/\W/g, '')}`)
    } else {
      // Square simulé — délai 800ms
      await new Promise(r => setTimeout(r, 800))
      res = { ok: true, arrivalDate: addBusinessDays(3), method: 'Square' }
    }

    setProcessing(false)
    setResult(res)
  }

  function closeSheet() {
    setShowSheet(false)
    setResult(null)
    setMontant('')
    setCompte('')
    setProcessing(false)
  }

  return (
    <div style={{ fontFamily: `'DM Sans', sans-serif`, color: NOIR, padding: '16px', paddingBottom: '100px', background: CREME, minHeight: '100vh' }}>
      <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>Portefeuille</div>

      {/* Solde card */}
      <div style={{ background: CARD, borderRadius: '16px', padding: '24px 20px', border: `2px solid ${OR}`, marginBottom: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '11px', color: `rgba(14,12,9,0.5)`, letterSpacing: '0.12em', marginBottom: '8px', textTransform: 'uppercase' }}>
          Solde disponible
        </div>
        <div style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: '52px', color: OR, letterSpacing: '0.04em', lineHeight: 1 }}>
          {formatMontant(p.portefeuille_solde)}
        </div>
        <div style={{ fontSize: '13px', color: `rgba(14,12,9,0.5)`, marginTop: '10px' }}>
          Total gagné : {formatMontant(p.portefeuille_total_gagne)}
        </div>
        <button onClick={() => setShowSheet(true)}
          style={{ marginTop: '16px', background: OR, color: '#0E0C09', border: 'none', borderRadius: '10px', padding: '11px 24px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: `'DM Sans', sans-serif` }}>
          Demander un retrait
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', overflowX: 'auto', paddingBottom: '4px' }}>
        {TYPE_TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            style={{ background: activeTab === tab.key ? OR : `rgba(14,12,9,0.08)`, color: activeTab === tab.key ? '#0E0C09' : `rgba(250,248,248,0.7)`, border: 'none', borderRadius: '999px', padding: '7px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: `'DM Sans', sans-serif` }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Transactions */}
      <div>
        {filteredTransactions.map(t => (
          <div key={t.id} style={{ background: CARD, borderRadius: '12px', padding: '13px 14px', marginBottom: '8px', border: `1px solid rgba(14,12,9,0.08)`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>{t.description}</div>
              <div style={{ fontSize: '11px', color: `rgba(14,12,9,0.45)`, marginTop: '3px' }}>
                {formatDate(t.date)}
                <span style={{ marginLeft: '8px', fontSize: '10px', fontWeight: 700, color: typeColor(t.type), background: `${typeColor(t.type)}18`, padding: '2px 7px', borderRadius: '999px' }}>
                  {typeLabel(t.type)}
                </span>
              </div>
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: t.montant > 0 ? '#22c55e' : '#ef4444' }}>
              {t.montant > 0 ? '+' : ''}{formatMontant(t.montant)}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom sheet */}
      {showSheet && (
        <>
          <div onClick={closeSheet} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200 }} />
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 201, background: '#F5F0E8', borderRadius: '20px 20px 0 0', padding: '24px 20px 48px', border: `1px solid rgba(14,12,9,0.08)` }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '18px', fontWeight: 700 }}>Demande de retrait</div>
              <button onClick={closeSheet} style={{ background: 'none', border: 'none', color: `rgba(14,12,9,0.5)`, fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            {/* Résultat succès */}
            {result?.ok && (
              <div style={{ textAlign: 'center', padding: '12px 0 8px' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                <p style={{ color: '#22c55e', fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>Demande envoyée !</p>
                <p style={{ color: 'rgba(14,12,9,0.5)', fontSize: 13, margin: '0 0 4px' }}>
                  {formatMontant(montantVal)} via {methode === 'stripe' ? 'Stripe Connect' : 'Square'}
                </p>
                <p style={{ color: 'rgba(14,12,9,0.4)', fontSize: 12, margin: '0 0 20px' }}>
                  Virement en 3-5 jours ouvrables · Arrivée estimée : {result.arrivalDate}
                </p>
                <button onClick={closeSheet}
                  style={{ width: '100%', background: OR, color: NOIR, border: 'none', borderRadius: 10, padding: '13px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: `'DM Sans', sans-serif` }}>
                  Fermer
                </button>
              </div>
            )}

            {/* Résultat erreur */}
            {result && !result.ok && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
                <p style={{ color: '#f87171', fontSize: 13, margin: 0 }}>{result.message || 'Erreur lors du virement.'}</p>
              </div>
            )}

            {!result?.ok && (
              <>
                {/* Montant */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12px', color: `rgba(14,12,9,0.5)`, display: 'block', marginBottom: '6px' }}>
                    Montant (max {formatMontant(p.portefeuille_solde)})
                  </label>
                  <input type="number" value={montant} onChange={e => setMontant(e.target.value)} placeholder="0.00" max={p.portefeuille_solde}
                    style={{ width: '100%', background: '#FAFAF8', border: `1px solid rgba(184,146,42,0.25)`, borderRadius: '10px', padding: '12px 14px', color: NOIR, fontFamily: `'DM Sans', sans-serif`, fontSize: '16px', boxSizing: 'border-box' }} />
                </div>

                {/* Méthode */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12px', color: `rgba(14,12,9,0.5)`, display: 'block', marginBottom: '10px' }}>Méthode de paiement</label>
                  {['square', 'stripe'].map(m => (
                    <label key={m} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '10px', borderRadius: '10px', marginBottom: '8px', background: methode === m ? `rgba(14,12,9,0.08)` : 'transparent', border: `1px solid ${methode === m ? OR : 'rgba(14,12,9,0.08)'}` }}>
                      <input type="radio" name="methode" value={m} checked={methode === m} onChange={() => { setMethode(m); setCompte('') }} style={{ accentColor: OR }} />
                      <div>
                        <span style={{ fontWeight: 600, fontSize: '14px', color: NOIR }}>
                          {m === 'square' ? 'Square' : 'Stripe Connect'}
                        </span>
                        <span style={{ fontSize: '11px', color: 'rgba(14,12,9,0.4)', marginLeft: 8 }}>
                          {m === 'square' ? '3-5 jours ouvrables' : '2-3 jours ouvrables'}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Champ compte */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', color: `rgba(14,12,9,0.5)`, display: 'block', marginBottom: '6px' }}>
                    {methode === 'stripe' ? 'Email Stripe Connect' : 'Numéro de compte Square'}
                  </label>
                  <input
                    value={compte}
                    onChange={e => setCompte(e.target.value)}
                    placeholder={methode === 'stripe' ? 'diane@example.com' : 'sq0idp-XXXXXXXXXXXX'}
                    style={{ width: '100%', background: '#FAFAF8', border: `1px solid ${compte && !compteValid ? '#ef4444' : 'rgba(184,146,42,0.25)'}`, borderRadius: '10px', padding: '12px 14px', color: NOIR, fontFamily: `'DM Sans', sans-serif`, fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <button onClick={handleRetrait} disabled={!canSubmit}
                  style={{ width: '100%', background: canSubmit ? OR : 'rgba(14,12,9,0.08)', color: canSubmit ? '#0E0C09' : `rgba(250,248,248,0.3)`, border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: 700, cursor: canSubmit ? 'pointer' : 'not-allowed', fontFamily: `'DM Sans', sans-serif`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  {processing ? <><Spinner /> Traitement en cours…</> : 'Confirmer le retrait'}
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function addBusinessDays(days) {
  const d = new Date()
  let added = 0
  while (added < days) {
    d.setDate(d.getDate() + 1)
    if (d.getDay() !== 0 && d.getDay() !== 6) added++
  }
  return d.toISOString().slice(0, 10)
}
