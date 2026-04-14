import { useState } from 'react'
import { OR, CREME, NOIR, CARD, MUTED, BORDER_OR } from '@/lib/utils'
import { SMS_TEMPLATES, CATEGORIES_SMS, extractVariableNames, renderTemplate } from '@/utils/sms-templates'
import { simulerSMS } from '@/utils/commandes'

const SEGMENTS = [
  { id: 'abo-actifs',      label: 'Abonnés actifs',        count: 18 },
  { id: 'abo-expirants',   label: 'Abonnés expirants',     count: 4  },
  { id: 'abo-inactifs',    label: 'Clients inactifs 30j',  count: 11 },
  { id: 'part-actifs',     label: 'Partenaires actifs',    count: 6  },
  { id: 'candidats-ok',    label: 'Candidats acceptés',    count: 3  },
  { id: 'tous',            label: 'Tous les contacts',     count: 42 },
]

const CAT_COLORS = {
  Client:       '#60a5fa',
  Partenaire:   OR,
  Fournisseur:  '#a78bfa',
  Othi:         '#f87171',
}

export default function AdminSMS() {
  const [catActive, setCatActive]           = useState('Client')
  const [expanded, setExpanded]             = useState(null)
  const [testPanel, setTestPanel]           = useState(null)   // templateId ouvert pour test
  const [testPhone, setTestPhone]           = useState('514-919-5970')
  const [testVars, setTestVars]             = useState({})
  const [segment, setSegment]               = useState(SEGMENTS[0].id)
  const [templateCampagne, setTemplateCampagne] = useState(SMS_TEMPLATES[0].id)
  const [toast, setToast]                   = useState('')
  const [history, setHistory]               = useState([
    { id: 'h1', time: '2026-03-27 09:02', template: 'Rappel 24h avant RDV',    dest: 'Réseau (12)',          msg: `Rappel Kadio : votre RDV demain...` },
    { id: 'h2', time: '2026-03-25 14:38', template: 'Bienvenue nouvel abonné', dest: 'Aminata Diallo',       msg: `Bienvenue dans la famille Kadio...` },
    { id: 'h3', time: '2026-03-22 11:15', template: 'Virement reçu',           dest: 'Jean Kouassi',         msg: `Virement Kadio reçu ! 45.00 $...`  },
  ])

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const templates = SMS_TEMPLATES.filter(t => t.cat === catActive)

  // ── Test SMS ────────────────────────────────────────────────────
  const openTest = (tplId) => {
    const tpl = SMS_TEMPLATES.find(t => t.id === tplId)
    const vars = {}
    extractVariableNames(tpl.message).forEach(v => { vars[v] = '' })
    setTestVars(vars)
    setTestPanel(tplId)
    setExpanded(tplId)
  }

  const sendTest = (tplId) => {
    const tpl = SMS_TEMPLATES.find(t => t.id === tplId)
    const rendered = renderTemplate(tplId, testVars)
    const dest = testPhone.trim() || '514-919-5970'
    simulerSMS(dest, rendered)
    const entry = {
      id:       `h${Date.now()}`,
      time:     new Date().toLocaleString('fr-CA', { dateStyle: 'short', timeStyle: 'short' }),
      template: tpl.nom,
      dest,
      msg:      rendered.length > 80 ? rendered.slice(0, 80) + '...' : rendered,
    }
    setHistory(h => [entry, ...h.slice(0, 19)])
    showToast(`SMS test envoyé à ${dest} ✓`)
    setTestPanel(null)
  }

  // ── Campagne ────────────────────────────────────────────────────
  const sendCampagne = () => {
    const seg   = SEGMENTS.find(s => s.id === segment)
    const tpl   = SMS_TEMPLATES.find(t => t.id === templateCampagne)
    const entry = {
      id:       `h${Date.now()}`,
      time:     new Date().toLocaleString('fr-CA', { dateStyle: 'short', timeStyle: 'short' }),
      template: tpl.nom,
      dest:     `${seg.label} (${seg.count})`,
      msg:      tpl.message.length > 80 ? tpl.message.slice(0, 80) + '...' : tpl.message,
    }
    simulerSMS(`[${seg.label}]`, `[Campagne] ${tpl.message}`)
    setHistory(h => [entry, ...h.slice(0, 19)])
    showToast(`Campagne envoyée → ${seg.label} (${seg.count} destinataires) ✓`)
  }

  const catColor = CAT_COLORS[catActive] || OR

  return (
    <div style={{ padding: '24px', paddingBottom: '100px', color: NOIR, background: CREME, minHeight: '100vh' }}>

      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#14532d', border: '1px solid #22c55e', color: '#86efac', padding: '10px 18px', borderRadius: '8px', zIndex: 999, fontSize: '14px' }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <h1 style={{ color: OR, fontSize: '22px', fontWeight: 700, margin: '0 0 4px' }}>Gestion SMS</h1>
      <p style={{ color: MUTED, margin: '0 0 20px', fontSize: '13px' }}>
        {SMS_TEMPLATES.length} templates · 4 catégories · Twilio (simulé)
      </p>

      {/* Stats strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '20px' }}>
        {CATEGORIES_SMS.map(cat => (
          <div key={cat}
            onClick={() => { setCatActive(cat); setExpanded(null); setTestPanel(null) }}
            style={{ background: CARD, border: `1px solid ${catActive === cat ? CAT_COLORS[cat] : BORDER_OR}`, borderRadius: '10px', padding: '10px', cursor: 'pointer', textAlign: 'center' }}>
            <p style={{ margin: '0 0 2px', fontSize: '18px', fontWeight: 700, color: CAT_COLORS[cat] }}>
              {SMS_TEMPLATES.filter(t => t.cat === cat).length}
            </p>
            <p style={{ margin: 0, fontSize: '10px', color: MUTED }}>{cat}</p>
          </div>
        ))}
      </div>

      {/* Onglets catégories */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {CATEGORIES_SMS.map(cat => (
          <button key={cat}
            onClick={() => { setCatActive(cat); setExpanded(null); setTestPanel(null) }}
            style={{
              padding: '7px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: 600,
              background: catActive === cat ? CAT_COLORS[cat] : CARD,
              color:      catActive === cat ? NOIR : MUTED,
            }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Templates */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
        {templates.map(t => {
          const varNames = extractVariableNames(t.message)
          const isOpen   = expanded === t.id
          const isTest   = testPanel === t.id

          return (
            <div key={t.id} style={{ background: CARD, border: `1px solid ${isOpen ? catColor + '60' : BORDER_OR}`, borderRadius: '10px', overflow: 'hidden' }}>

              {/* En-tête */}
              <div onClick={() => { setExpanded(isOpen ? null : t.id); if (isOpen) setTestPanel(null) }}
                style={{ padding: '12px 14px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 3px', fontWeight: 700, color: NOIR, fontSize: '13px' }}>{t.nom}</p>
                    <p style={{ margin: '0 0 6px', color: MUTED, fontSize: '11px' }}>{t.trigger}</p>
                    <p style={{ margin: 0, color: MUTED, fontSize: '12px', lineHeight: '1.5' }}>
                      {t.message.length > 90 ? t.message.slice(0, 90) + '…' : t.message}
                    </p>
                  </div>
                  <span style={{ color: catColor, fontSize: '14px', flexShrink: 0, marginTop: '2px' }}>{isOpen ? '▲' : '▼'}</span>
                </div>

                {varNames.length > 0 && (
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {varNames.map(v => (
                      <span key={v} style={{ background: catColor + '22', color: catColor, fontSize: '10px', padding: '1px 7px', borderRadius: '6px', fontFamily: 'monospace' }}>
                        {`{{${v}}}`}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Panneau déplié */}
              {isOpen && (
                <div style={{ borderTop: `1px solid ${BORDER_OR}`, padding: '12px 14px' }}>

                  {/* Message complet */}
                  <div style={{ background: CREME, borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
                    <p style={{ color: MUTED, fontSize: '10px', margin: '0 0 6px', textTransform: 'uppercase', fontWeight: 700 }}>
                      Message · {t.message.length} caractères
                    </p>
                    <p style={{ margin: 0, color: NOIR, fontSize: '12px', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{t.message}</p>
                  </div>

                  {/* Boutons */}
                  {!isTest && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => { navigator.clipboard?.writeText(t.message); showToast('Message copié !') }}
                        style={{ flex: 1, padding: '9px', borderRadius: '7px', border: `1px solid ${BORDER_OR}`, background: 'none', color: MUTED, cursor: 'pointer', fontSize: '12px' }}>
                        Copier
                      </button>
                      <button
                        onClick={() => openTest(t.id)}
                        style={{ flex: 2, padding: '9px', borderRadius: '7px', border: 'none', background: catColor, color: NOIR, fontWeight: 700, cursor: 'pointer', fontSize: '12px' }}>
                        Envoyer test SMS
                      </button>
                    </div>
                  )}

                  {/* Panneau test */}
                  {isTest && (
                    <div style={{ background: CREME, borderRadius: '10px', padding: '14px' }}>
                      <p style={{ color: catColor, fontWeight: 700, fontSize: '13px', margin: '0 0 12px' }}>
                        Test SMS — {t.nom}
                      </p>

                      {/* Numéro */}
                      <div style={{ marginBottom: '10px' }}>
                        <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 4px', textTransform: 'uppercase' }}>Numéro destinataire</p>
                        <input
                          value={testPhone}
                          onChange={e => setTestPhone(e.target.value)}
                          placeholder="514-919-5970"
                          style={{ width: '100%', background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '7px', padding: '9px 12px', color: NOIR, fontSize: '13px', boxSizing: 'border-box' }}
                        />
                      </div>

                      {/* Variables */}
                      {varNames.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                          <p style={{ color: MUTED, fontSize: '11px', margin: 0, textTransform: 'uppercase' }}>Variables</p>
                          {varNames.map(v => (
                            <div key={v} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ color: catColor, fontSize: '11px', fontFamily: 'monospace', minWidth: '120px', flexShrink: 0 }}>{`{{${v}}}`}</span>
                              <input
                                value={testVars[v] || ''}
                                onChange={e => setTestVars(prev => ({ ...prev, [v]: e.target.value }))}
                                placeholder={v}
                                style={{ flex: 1, background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '6px', padding: '7px 10px', color: NOIR, fontSize: '12px' }}
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Aperçu rendu */}
                      {Object.values(testVars).some(v => v) && (
                        <div style={{ background: '#0d2010', border: '1px solid #22c55e33', borderRadius: '8px', padding: '10px', marginBottom: '12px' }}>
                          <p style={{ color: MUTED, fontSize: '10px', margin: '0 0 4px', textTransform: 'uppercase' }}>Aperçu rendu</p>
                          <p style={{ margin: 0, color: '#86efac', fontSize: '12px', lineHeight: '1.6' }}>{renderTemplate(t.id, testVars)}</p>
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => setTestPanel(null)}
                          style={{ flex: 1, padding: '9px', borderRadius: '7px', border: `1px solid ${BORDER_OR}`, background: 'none', color: MUTED, cursor: 'pointer', fontSize: '12px' }}>
                          Annuler
                        </button>
                        <button
                          onClick={() => sendTest(t.id)}
                          style={{ flex: 2, padding: '9px', borderRadius: '7px', border: 'none', background: catColor, color: NOIR, fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>
                          Envoyer à {testPhone || '514-919-5970'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Campagne SMS */}
      <div style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '12px', padding: '16px', marginBottom: '28px' }}>
        <h2 style={{ color: OR, fontSize: '17px', fontWeight: 700, margin: '0 0 4px' }}>Campagne SMS</h2>
        <p style={{ color: MUTED, fontSize: '12px', margin: '0 0 16px' }}>Envoyer un template à tout un segment</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '14px' }}>

          {/* Segment */}
          <div>
            <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 6px', textTransform: 'uppercase', fontWeight: 700 }}>Segment</p>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {SEGMENTS.map(s => (
                <button key={s.id} onClick={() => setSegment(s.id)}
                  style={{
                    padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px',
                    border: `1px solid ${segment === s.id ? OR : BORDER_OR}`,
                    background: segment === s.id ? OR + '22' : 'transparent',
                    color: segment === s.id ? OR : MUTED,
                    fontWeight: segment === s.id ? 700 : 400,
                  }}>
                  {s.label} <span style={{ opacity: 0.7 }}>({s.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Template */}
          <div>
            <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 6px', textTransform: 'uppercase', fontWeight: 700 }}>Template</p>
            <select value={templateCampagne} onChange={e => setTemplateCampagne(e.target.value)}
              style={{ width: '100%', background: CREME, border: `1px solid ${BORDER_OR}`, borderRadius: '8px', color: NOIR, padding: '10px', fontSize: '13px', cursor: 'pointer' }}>
              {CATEGORIES_SMS.map(cat => (
                <optgroup key={cat} label={cat}>
                  {SMS_TEMPLATES.filter(t => t.cat === cat).map(t => (
                    <option key={t.id} value={t.id}>{t.nom}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Aperçu template sélectionné */}
          <div style={{ background: CREME, borderRadius: '8px', padding: '10px 12px' }}>
            <p style={{ margin: 0, color: MUTED, fontSize: '12px', fontStyle: 'italic' }}>
              {SMS_TEMPLATES.find(t => t.id === templateCampagne)?.message}
            </p>
          </div>
        </div>

        <button onClick={sendCampagne}
          style={{ width: '100%', padding: '13px', borderRadius: '8px', border: 'none', background: OR, color: NOIR, fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>
          Envoyer à {SEGMENTS.find(s => s.id === segment)?.label} ({SEGMENTS.find(s => s.id === segment)?.count})
        </button>
      </div>

      {/* Historique */}
      <div>
        <h2 style={{ color: OR, fontSize: '17px', fontWeight: 700, margin: '0 0 12px' }}>
          Historique SMS <span style={{ color: MUTED, fontSize: '13px', fontWeight: 400 }}>({history.length})</span>
        </h2>
        {history.length === 0 && (
          <p style={{ color: MUTED, textAlign: 'center', padding: '24px 0', fontSize: '13px' }}>Aucun SMS envoyé encore.</p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {history.map(h => (
            <div key={h.id} style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '10px', padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <p style={{ margin: 0, fontSize: '13px', color: NOIR, fontWeight: 600 }}>{h.template}</p>
                <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: '#22c55e22', color: '#22c55e', fontWeight: 600, flexShrink: 0 }}>Envoyé</span>
              </div>
              <p style={{ margin: '0 0 4px', fontSize: '12px', color: MUTED }}>{h.dest} · {h.time}</p>
              <p style={{ margin: 0, fontSize: '11px', color: MUTED, fontStyle: 'italic' }}>{h.msg}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
