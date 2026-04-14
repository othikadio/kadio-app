import { useState } from 'react'
import { OR, CREME, CARD, formatMontant } from '@/lib/utils'
import QRScanner from '@/components/ui/QRScanner'
import { verifyQRCode, DEMO_CODES } from '@/utils/qr'

export default function EmployeScanner() {
  const [activeTab, setActiveTab]         = useState('scanner')
  const [code, setCode]                   = useState('')
  const [result, setResult]               = useState(null)
  const [statut, setStatut]               = useState(null)
  const [notFound, setNotFound]           = useState(false)
  const [commissionShown, setCommissionShown] = useState(false)
  const [scanKey, setScanKey]             = useState(0)
  const [smsLog, setSmsLog]               = useState('')

  function verifier(inputCode) {
    const res = verifyQRCode(inputCode)
    if (res.valide) {
      setResult(res)
      setStatut(res.statut)
      setNotFound(false)
      setCommissionShown(false)
    } else {
      setResult(null)
      setStatut(null)
      setNotFound(true)
    }
  }

  function resetResult() {
    setResult(null)
    setStatut(null)
    setNotFound(false)
    setCode('')
    setCommissionShown(false)
    setScanKey(k => k + 1)
    setActiveTab('scanner')
  }

  const statutColor = (s) => {
    if (s === 'termine')  return '#22c55e'
    if (s === 'en_cours') return '#f59e0b'
    return '#22c55e'
  }

  const statutLabel = (s) => {
    if (s === 'termine')  return `Terminé`
    if (s === 'en_cours') return `En cours`
    if (s === 'confirme') return 'Confirmé'
    return s
  }

  return (
    <div style={{ fontFamily: `'DM Sans', sans-serif`, color: NOIR, padding: '16px', paddingBottom: '100px' }}>
      <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>Scanner</div>

      {/* Tabs */}
      {!result && (
        <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
          {['scanner', 'manuel'].map(t => (
            <button key={t} onClick={() => { setActiveTab(t); setNotFound(false) }}
              style={{
                flex: 1, background: activeTab === t ? OR : `rgba(14,12,9,0.08)`,
                color: activeTab === t ? '#0E0C09' : `rgba(250,248,248,0.7)`,
                border: 'none', borderRadius: '999px', padding: '9px',
                fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                fontFamily: `'DM Sans', sans-serif`,
              }}>
              {t === 'scanner' ? 'Scanner' : 'Saisie manuelle'}
            </button>
          ))}
        </div>
      )}

      {/* ── Scanner tab ── */}
      {activeTab === 'scanner' && !result && (
        <div>
          <QRScanner
            key={scanKey}
            onScan={verifier}
            onFallback={() => setActiveTab('manuel')}
          />
          <div style={{ textAlign: 'center', marginTop: '16px', color: `rgba(14,12,9,0.5)`, fontSize: '13px' }}>
            Pointez la caméra vers le code QR du client
          </div>
        </div>
      )}

      {/* ── Saisie manuelle ── */}
      {activeTab === 'manuel' && !result && (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', color: `rgba(14,12,9,0.5)`, display: 'block', marginBottom: '6px' }}>
              Code QR client
            </label>
            <input
              value={code}
              onChange={e => { setCode(e.target.value); setNotFound(false) }}
              onKeyDown={e => e.key === 'Enter' && verifier(code)}
              placeholder="KADIO-XXXXXXXX"
              autoFocus
              style={{
                width: '100%', background: CARD, border: `1px solid rgba(184,146,42,0.25)`,
                borderRadius: '10px', padding: '12px 14px', color: NOIR,
                fontFamily: 'monospace', fontSize: '14px', boxSizing: 'border-box', outline: 'none',
              }}
            />
          </div>
          <button
            onClick={() => verifier(code)}
            disabled={!code.trim()}
            style={{
              width: '100%', background: code.trim() ? OR : 'rgba(14,12,9,0.08)',
              color: code.trim() ? '#0E0C09' : `rgba(250,248,248,0.3)`,
              border: 'none', borderRadius: '10px', padding: '13px',
              fontSize: '15px', fontWeight: 700, cursor: code.trim() ? 'pointer' : 'default',
              fontFamily: `'DM Sans', sans-serif`, marginBottom: '16px',
            }}>
            Vérifier
          </button>

          {/* Codes de test */}
          <div style={{ background: `rgba(184,146,42,0.06)`, borderRadius: '10px', padding: '12px', marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', color: `rgba(14,12,9,0.4)`, marginBottom: '8px', fontWeight: 600 }}>CODES DE TEST</div>
            {DEMO_CODES.slice(0, 6).map(c => (
              <button key={c} onClick={() => { setCode(c); verifier(c) }}
                style={{ display: 'block', background: 'none', border: 'none', cursor: 'pointer', color: OR, fontFamily: 'monospace', fontSize: '12px', padding: '3px 0', textAlign: 'left' }}>
                {c}
              </button>
            ))}
          </div>

          {notFound && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: `1px solid rgba(239,68,68,0.3)`, borderRadius: '10px', padding: '14px', textAlign: 'center', color: '#ef4444', fontWeight: 600 }}>
              Code non reconnu — Vérifiez le code et réessayez.
            </div>
          )}
        </div>
      )}

      {/* ── Résultat ── */}
      {result && statut && (
        <div style={{ background: CARD, borderRadius: '14px', padding: '16px', border: `1px solid rgba(184,146,42,0.25)` }}>
          {/* Feedback vert immédiat */}
          <div style={{
            background: 'rgba(34,197,94,0.12)', border: `1px solid rgba(34,197,94,0.4)`,
            borderRadius: '10px', padding: '12px', marginBottom: '16px', textAlign: 'center',
          }}>
            <span style={{ fontSize: '24px' }}>✅</span>
            <div style={{ color: '#22c55e', fontWeight: 700, fontSize: '15px', marginTop: '4px' }}>Code valide</div>
          </div>

          {/* Client */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: `rgba(14,12,9,0.08)`, border: `2px solid ${OR}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', fontWeight: 700, color: OR,
            }}>
              {result.client[0]}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '16px' }}>{result.client}</div>
              <div style={{ fontSize: '13px', color: `rgba(14,12,9,0.5)` }}>
                {result.service} · {result.heure}
              </div>
            </div>
          </div>

          {/* Statut */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', color: `rgba(14,12,9,0.45)`, marginBottom: '8px' }}>Statut</div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: `${statutColor(statut)}20`, color: statutColor(statut),
              padding: '5px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 700,
            }}>
              {statut === 'termine' ? '✅' : '●'} {statutLabel(statut)}
            </div>
          </div>

          {/* Commission */}
          {commissionShown && result.commission > 0 && (
            <div style={{ background: 'rgba(34,197,94,0.1)', border: `1px solid rgba(34,197,94,0.3)`, borderRadius: '10px', padding: '12px', marginBottom: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: `rgba(14,12,9,0.5)`, marginBottom: '4px' }}>
                Commission gagnée · {result.lieu === 'au_salon' ? 'Salon (50%)' : '75%'}
              </div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#22c55e' }}>{formatMontant(result.commission)}</div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {statut === 'confirme' && (
              <button onClick={() => setStatut('en_cours')}
                style={{ background: OR, color: '#0E0C09', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: `'DM Sans', sans-serif` }}>
                Client arrivé ✓
              </button>
            )}
            {statut === 'en_cours' && (
              <button onClick={() => {
                setStatut('termine')
                setCommissionShown(true)
                setSmsLog(`3 SMS post-RDV programmés pour ${result.client.split(' ')[0]} ✓ · +${result.prix_total ?? 0} pts fidélité`)
              }}
                style={{ background: '#22c55e', color: '#0E0C09', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: `'DM Sans', sans-serif` }}>
                Marquer terminé ✓
              </button>
            )}
            {statut === 'termine' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ textAlign: 'center', color: '#22c55e', fontWeight: 700, padding: '8px' }}>
                  ✅ Service terminé avec succès
                </div>
                {smsLog && (
                  <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', color: '#22c55e' }}>
                    📱 {smsLog}
                  </div>
                )}
              </div>
            )}
            <button onClick={resetResult}
              style={{ background: 'transparent', color: `rgba(14,12,9,0.5)`, border: `1px solid rgba(14,12,9,0.15)`, borderRadius: '10px', padding: '10px', fontSize: '13px', cursor: 'pointer', fontFamily: `'DM Sans', sans-serif` }}>
              Nouveau scan
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
