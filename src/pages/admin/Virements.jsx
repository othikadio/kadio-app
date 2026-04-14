import { useState } from 'react'
import { OR, CREME, NOIR, CARD, MUTED, BORDER_OR, formatMontant, formatDate } from '@/lib/utils'
import { MOCK_VIREMENTS_ADMIN } from '@/data/mockAdmin'
import { transferToPartner } from '@/lib/stripe'

const METHODES = ['Stripe Connect', 'Virement Interac', 'Chèque', 'Virement bancaire']

function Spinner() {
  return (
    <span style={{ display: 'inline-block', width: 14, height: 14, border: `2px solid ${NOIR}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </span>
  )
}

export default function AdminVirements() {
  const [virements, setVirements] = useState(MOCK_VIREMENTS_ADMIN)
  const [confirm, setConfirm]     = useState(null)  // { partenaire, montant, ids }
  const [methode, setMethode]     = useState('Stripe Connect')
  const [stripeAccount, setStripeAccount] = useState('')
  const [processing, setProcessing] = useState(false)
  const [toast, setToast]         = useState('')
  const [virLog, setVirLog]       = useState([])    // log avec timestamp

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const enAttente  = virements.filter(v => v.statut === 'en_attente')
  const historique = virements.filter(v => v.statut === 'effectue')
  const totalEnAttente = enAttente.reduce((s, v) => s + v.montant, 0)

  const needsAccount = methode === 'Stripe Connect'
  const canConfirm   = !processing && (!needsAccount || stripeAccount.trim().length >= 4)

  async function effectuerVirement(ids, methodeChoisie) {
    setProcessing(true)

    let transferOk = true
    if (methodeChoisie === 'Stripe Connect' && confirm) {
      const accountId = stripeAccount.trim() || `acct_${confirm.partenaire.replace(/\s/g, '_').toLowerCase()}`
      const res = await transferToPartner(confirm.montant, accountId)
      transferOk = res.ok
      if (!res.ok) {
        showToast(`Erreur Stripe : ${res.message}`)
        setProcessing(false)
        return
      }
    } else {
      await new Promise(r => setTimeout(r, 600))
    }

    const now = new Date().toLocaleString('fr-CA', { dateStyle: 'short', timeStyle: 'short' })

    setVirements(prev => prev.map(v =>
      ids.includes(v.id)
        ? { ...v, statut: 'effectue', methode: methodeChoisie, timestamp: now }
        : v
    ))

    // Entrée log
    const logEntry = {
      id:         `log-${Date.now()}`,
      partenaire: confirm?.partenaire || `${ids.length} partenaires`,
      montant:    confirm?.montant || 0,
      methode:    methodeChoisie,
      account:    needsAccount ? stripeAccount.trim() : null,
      timestamp:  now,
      ids,
    }
    setVirLog(l => [logEntry, ...l.slice(0, 19)])

    showToast(transferOk
      ? `Virement${ids.length > 1 ? 's' : ''} effectué${ids.length > 1 ? 's' : ''} via ${methodeChoisie} ✓`
      : 'Virement enregistré.')

    setConfirm(null)
    setStripeAccount('')
    setProcessing(false)
  }

  return (
    <div style={{ padding: '24px', paddingBottom: '100px', color: NOIR, background: CREME, minHeight: '100vh' }}>

      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#14532d', border: '1px solid #22c55e', color: '#86efac', padding: '10px 18px', borderRadius: '8px', zIndex: 999, fontSize: '14px' }}>
          {toast}
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ color: OR, fontSize: '22px', fontWeight: 700, margin: '0 0 4px' }}>Virements</h1>
        <p style={{ color: MUTED, margin: 0, fontSize: '13px' }}>Gestion des paiements partenaires · Stripe Connect</p>
      </div>

      {/* Confirm modal */}
      {confirm && (
        <div style={{ position: 'fixed', inset: 0, background: '#000000cc', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '400px' }}>
            <h3 style={{ color: OR, margin: '0 0 16px', fontSize: '18px' }}>Confirmer le virement</h3>
            <p style={{ color: NOIR, fontSize: '14px', margin: '0 0 4px' }}><strong>{confirm.partenaire}</strong></p>
            <p style={{ color: '#22c55e', fontSize: '24px', fontWeight: 700, margin: '0 0 18px' }}>{formatMontant(confirm.montant)}</p>

            {/* Méthode */}
            <div style={{ marginBottom: '14px' }}>
              <p style={{ color: MUTED, fontSize: '12px', margin: '0 0 6px', textTransform: 'uppercase', fontWeight: 700 }}>Méthode</p>
              <select value={methode} onChange={e => { setMethode(e.target.value); setStripeAccount('') }}
                style={{ width: '100%', background: CREME, border: `1px solid ${BORDER_OR}`, borderRadius: '8px', color: NOIR, padding: '10px', fontSize: '13px', cursor: 'pointer' }}>
                {METHODES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {/* Compte Stripe */}
            {needsAccount && (
              <div style={{ marginBottom: '16px' }}>
                <p style={{ color: MUTED, fontSize: '12px', margin: '0 0 6px', textTransform: 'uppercase', fontWeight: 700 }}>ID Stripe Connect du partenaire</p>
                <input
                  value={stripeAccount}
                  onChange={e => setStripeAccount(e.target.value)}
                  placeholder="acct_1Nxxxxxxxxxxxxxxxx"
                  style={{ width: '100%', background: CREME, border: `1px solid ${BORDER_OR}`, borderRadius: '8px', color: NOIR, padding: '10px 12px', fontSize: '13px', fontFamily: 'monospace', boxSizing: 'border-box' }}
                />
                <p style={{ color: MUTED, fontSize: '11px', margin: '4px 0 0' }}>3-5 jours ouvrables · Frais Stripe: 0.25% + 0.25$</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => { setConfirm(null); setStripeAccount('') }} disabled={processing}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `1px solid ${BORDER_OR}`, background: 'none', color: MUTED, cursor: 'pointer', fontSize: '13px' }}>
                Annuler
              </button>
              <button onClick={() => effectuerVirement(confirm.ids, methode)} disabled={!canConfirm}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: canConfirm ? OR : 'rgba(14,12,9,0.08)', color: canConfirm ? NOIR : MUTED, fontWeight: 700, cursor: canConfirm ? 'pointer' : 'not-allowed', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {processing ? <><Spinner /> En cours…</> : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* En attente */}
      <div style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '14px', padding: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <h2 style={{ color: OR, fontSize: '16px', fontWeight: 600, margin: '0 0 2px' }}>En attente</h2>
            <p style={{ color: MUTED, fontSize: '12px', margin: 0 }}>
              {enAttente.length} virement{enAttente.length > 1 ? 's' : ''} · Total : <span style={{ color: '#f59e0b', fontWeight: 600 }}>{formatMontant(totalEnAttente)}</span>
            </p>
          </div>
          {enAttente.length > 0 && (
            <button
              onClick={() => setConfirm({ partenaire: `Tous (${enAttente.length})`, montant: totalEnAttente, ids: enAttente.map(v => v.id) })}
              style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', background: OR, color: NOIR, fontWeight: 700, cursor: 'pointer', fontSize: '12px' }}>
              Tout virer
            </button>
          )}
        </div>

        {enAttente.length === 0 ? (
          <p style={{ color: MUTED, fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>Aucun virement en attente</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {enAttente.map(v => (
              <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', background: CREME, borderRadius: '8px' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 2px', fontWeight: 600, color: NOIR, fontSize: '13px' }}>{v.partenaire}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: MUTED }}>{formatDate(v.date)}</p>
                </div>
                <p style={{ color: OR, fontWeight: 700, fontSize: '15px', margin: 0 }}>{formatMontant(v.montant)}</p>
                <button
                  onClick={() => setConfirm({ partenaire: v.partenaire, montant: v.montant, ids: [v.id] })}
                  style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: '#22c55e', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '12px' }}>
                  Virer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log temps réel */}
      {virLog.length > 0 && (
        <div style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '12px', padding: '14px', marginBottom: '20px' }}>
          <h2 style={{ color: OR, fontSize: '15px', fontWeight: 600, margin: '0 0 12px' }}>Log virements — session</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {virLog.map(l => (
              <div key={l.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '8px 10px', background: CREME, borderRadius: '8px' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 2px', fontSize: '12px', color: NOIR, fontWeight: 600 }}>{l.partenaire} · {formatMontant(l.montant)}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: MUTED }}>{l.methode}{l.account ? ` · ${l.account}` : ''}</p>
                </div>
                <span style={{ fontSize: '10px', color: MUTED, flexShrink: 0 }}>{l.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historique */}
      <div>
        <h2 style={{ color: OR, fontSize: '16px', fontWeight: 600, margin: '0 0 12px' }}>Historique des virements</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {historique.map(v => (
            <div key={v.id} style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '10px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 2px', fontWeight: 600, color: NOIR, fontSize: '13px' }}>{v.partenaire}</p>
                <p style={{ margin: 0, fontSize: '11px', color: MUTED }}>
                  {formatDate(v.date)} · {v.methode || 'Virement Interac'}
                  {v.timestamp && <span style={{ marginLeft: 6, opacity: 0.6 }}>· {v.timestamp}</span>}
                </p>
              </div>
              <p style={{ color: '#22c55e', fontWeight: 700, fontSize: '14px', margin: '0 8px 0 0' }}>{formatMontant(v.montant)}</p>
              <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: '#22c55e22', color: '#22c55e', fontWeight: 600 }}>Effectué</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
