import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { OR, CREME, NOIR, CARD, CARD2, MUTED, BORDER_OR, formatMontant, statutColor, initiales } from '@/lib/utils'
import { MOCK_ALERTES, MOCK_STATS_ADMIN, MOCK_RDV_RESEAU, MOCK_EMPLOYES_ADMIN, MOCK_PARTENAIRES_ADMIN, MOCK_CLIENTS_ADMIN, MOCK_ABONNEMENTS_ADMIN, MOCK_TRANSACTIONS_ADMIN, MOCK_VIREMENTS_ADMIN } from '@/data/mockAdmin'
import { useAllRdv } from '@/hooks'

const TODAY = new Date().toISOString().split('T')[0]
const NOW_H = new Date().getHours()

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [alertes, setAlertes] = useState(MOCK_ALERTES)
  const [activeTab, setActiveTab] = useState('apercu')
  const { data: rdvReseau, loading: loadingRdv } = useAllRdv()
  const allRdv = rdvReseau?.length ? rdvReseau : MOCK_RDV_RESEAU

  // --- Assistant IA State ---
  const [showAssistant, setShowAssistant] = useState(false)
  const [aiStatus, setAiStatus] = useState('idle')
  const [aiMessages, setAiMessages] = useState([])
  const [aiTranscript, setAiTranscript] = useState('')
  const [aiInterim, setAiInterim] = useState('')
  const [aiActive, setAiActive] = useState(false)
  const [aiError, setAiError] = useState('')
  const recognitionRef = useRef(null)
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null)
  const recognitionActiveRef = useRef(false)
  const chatEndRef = useRef(null)

  // --- Dashboard computed ---
  const rdvToday = allRdv.filter(r => r.date === TODAY)
  const rdvConfirmes = rdvToday.filter(r => r.statut === 'confirme' || r.statut === 'en_cours')
  const revenusToday = rdvToday.reduce((s, r) => s + (r.montant || 0), 0)
  const stats = MOCK_STATS_ADMIN
  const croissance = stats.revenus_mois_prev > 0
    ? Math.round(((stats.revenus_mois - stats.revenus_mois_prev) / stats.revenus_mois_prev) * 100)
    : 0
  const dateLabel = new Date().toLocaleDateString('fr-CA', { weekday: 'long', day: 'numeric', month: 'long' })

  const dismissAlerte = (id) => setAlertes(prev => prev.filter(a => a.id !== id))

  const TABS = [
    { id: 'apercu', label: 'Apercu', icon: '\u{1F4CA}' },
    { id: 'rdv', label: 'RDV', icon: '\u{1F4C5}' },
    { id: 'equipe', label: 'Equipe', icon: '\u{1F465}' },
    { id: 'finance', label: 'Finance', icon: '\u{1F4B0}' },
  ]

  const ACTIONS_RAPIDES = [
    { label: 'Calendrier', icon: '\u{1F4C5}', path: '/admin/calendrier', color: '#3B82F6' },
    { label: 'Clients', icon: '\u{1F465}', path: '/admin/clients', color: '#22c55e' },
    { label: 'Services', icon: '✂️', path: '/admin/services', color: OR },
    { label: 'Candidats', icon: '\u{1F4CB}', path: '/admin/candidats', color: '#f59e0b' },
    { label: 'SMS', icon: '\u{1F4AC}', path: '/admin/sms', color: '#ec4899' },
    { label: 'Stats', icon: '\u{1F4C8}', path: '/admin/stats', color: '#8B5CF6' },
  ]

  const maxRevMois = Math.max(...stats.revenus_par_mois.map(r => r.montant))

  // --- Speech Recognition Setup ---
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.lang = 'fr-CA'
    recognition.continuous = false
    recognition.interimResults = true

    recognition.onstart = () => {
      setAiStatus('listening')
      setAiInterim('')
      setAiError('')
    }

    recognition.onresult = (event) => {
      let interim = ''
      let finalT = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript
        if (event.results[i].isFinal) finalT += t
        else interim += t
      }
      setAiInterim(interim)
      if (finalT) handleUserMessage(finalT)
    }

    recognition.onerror = (event) => {
      setAiError(`Erreur: ${event.error}`)
      setAiStatus('idle')
      recognitionActiveRef.current = false
    }

    recognition.onend = () => {
      if (recognitionActiveRef.current && aiStatus !== 'thinking' && aiStatus !== 'speaking') {
        setTimeout(() => { try { recognition.start() } catch(e) {} }, 100)
      } else {
        setAiStatus('idle')
      }
    }

    recognitionRef.current = recognition
    return () => { try { recognition.abort() } catch(e) {} }
  }, [])

  // Auto-scroll chat
  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [aiMessages, aiInterim])

  // Handle user message
  const handleUserMessage = useCallback(async (userText) => {
    if (!userText.trim()) return
    try { recognitionRef.current?.stop() } catch(e) {}
    setAiTranscript(userText)
    setAiInterim('')
    setAiStatus('thinking')

    const newMsgs = [...aiMessages, { role: 'user', content: userText }]
    setAiMessages(newMsgs)

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMsgs }),
      })
      if (!res.ok) throw new Error('Erreur API')
      const data = await res.json()
      const reply = data.reply || "Je n'ai pas pu traiter la demande."
      setAiMessages([...newMsgs, { role: 'assistant', content: reply }])
      speakResponse(reply)
    } catch (err) {
      setAiError(`Erreur: ${err.message}`)
      setAiStatus('idle')
      recognitionActiveRef.current = false
    }
  }, [aiMessages])

  // Text-to-speech
  const speakResponse = useCallback((text) => {
    const synth = synthRef.current
    if (!synth) return
    synth.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.lang = 'fr-CA'
    utt.rate = 1.0
    const voices = synth.getVoices()
    const frVoice = voices.find(v => v.lang.startsWith('fr-CA') || v.lang.startsWith('fr-FR'))
    if (frVoice) utt.voice = frVoice
    utt.onstart = () => setAiStatus('speaking')
    utt.onend = () => {
      if (recognitionActiveRef.current && recognitionRef.current) {
        setAiStatus('idle')
        setTimeout(() => { try { recognitionRef.current.start() } catch(e) {} }, 500)
      } else setAiStatus('idle')
    }
    utt.onerror = () => { setAiStatus('idle'); recognitionActiveRef.current = false }
    synth.speak(utt)
  }, [])

  // Toggle mic
  const toggleMic = useCallback(() => {
    if (!recognitionRef.current) { setAiError('Reconnaissance vocale non disponible'); return }
    if (aiActive) {
      recognitionActiveRef.current = false
      try { recognitionRef.current.stop() } catch(e) {}
      setAiActive(false); setAiStatus('idle')
    } else {
      recognitionActiveRef.current = true
      setAiActive(true)
      try { recognitionRef.current.start() } catch(e) {}
    }
  }, [aiActive])

  // Text submit
  const handleTextSubmit = useCallback((e) => {
    e.preventDefault()
    const input = e.target.elements.aiInput
    const text = input.value.trim()
    if (text) { handleUserMessage(text); input.value = '' }
  }, [handleUserMessage])

  const aiStatusText = aiStatus === 'listening' ? "Je t'écoute..." : aiStatus === 'thinking' ? 'Je réfléchis...' : aiStatus === 'speaking' ? 'Kadio parle...' : 'Toucher pour parler'

  return (
    <div style={{ padding: '20px', paddingBottom: showAssistant ? '420px' : '100px', color: NOIR, background: CREME, minHeight: '100vh', maxWidth: '900px', margin: '0 auto', transition: 'padding-bottom 0.3s' }}>

      <style>{`
        @keyframes pulse-ai { 0%,100% { box-shadow: 0 0 0 0 rgba(184,146,42,0.4); } 50% { box-shadow: 0 0 0 12px rgba(184,146,42,0); } }
        @keyframes pulse-listen { 0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); } 50% { box-shadow: 0 0 0 15px rgba(34,197,94,0); } }
        @keyframes float-btn { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        .ai-panel { scrollbar-width: thin; scrollbar-color: ${OR} transparent; }
        .ai-panel::-webkit-scrollbar { width: 4px; }
        .ai-panel::-webkit-scrollbar-thumb { background: ${OR}; border-radius: 4px; }
      `}</style>

      {/* --- Header --- */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ color: OR, fontSize: '22px', fontWeight: '700', margin: '0 0 2px' }}>Salut Othi</h1>
          <p style={{ color: MUTED, margin: 0, fontSize: '13px', textTransform: 'capitalize' }}>{dateLabel}</p>
        </div>
        <button onClick={() => navigate('/admin/ia')} style={{
          background: `linear-gradient(135deg, ${OR}, #d4a84b)`, border: 'none', borderRadius: '50%',
          width: '46px', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: '20px', boxShadow: `0 4px 15px ${OR}40`, color: '#fff', fontWeight: '700'
        }}>IA</button>
      </div>

      {/* --- KPI Strip --- */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', overflowX: 'auto', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', paddingBottom: '4px' }}>
        {[
          { label: "RDV AUJOURD'HUI", value: rdvConfirmes.length, sub: `${rdvToday.length} total`, color: OR },
          { label: 'REVENUS JOUR', value: formatMontant(revenusToday), sub: '', color: '#22c55e' },
          { label: 'REVENUS MOIS', value: formatMontant(stats.revenus_mois), sub: `+${croissance}%`, color: '#3B82F6' },
          { label: 'ABONNES', value: stats.abonnes_actifs, sub: `${stats.partenaires_actifs} partenaires`, color: '#8B5CF6' },
        ].map((k, i) => (
          <div key={i} style={{
            minWidth: '140px', flex: '0 0 auto', scrollSnapAlign: 'start',
            background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '14px', padding: '14px 16px',
          }}>
            <p style={{ color: MUTED, fontSize: '10px', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{k.label}</p>
            <p style={{ color: k.color, fontSize: '22px', fontWeight: '700', margin: '0 0 2px', lineHeight: 1 }}>{k.value}</p>
            {k.sub && <p style={{ color: k.color, fontSize: '11px', margin: 0, opacity: 0.7 }}>{k.sub}</p>}
          </div>
        ))}
      </div>

      {/* --- Alertes --- */}
      {alertes.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          {alertes.map(a => (
            <div key={a.id} style={{
              background: a.severity === 'high' ? '#fef2f233' : CARD,
              border: `1px solid ${a.severity === 'high' ? '#ef444440' : BORDER_OR}`,
              borderLeft: `3px solid ${a.severity === 'high' ? '#ef4444' : a.severity === 'medium' ? '#f59e0b' : '#60a5fa'}`,
              borderRadius: '10px', padding: '12px 14px', marginBottom: '8px',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <span style={{ fontSize: '16px' }}>{a.type === 'no_show' ? '\u{1F6AB}' : a.type === 'paiement' ? '\u{1F4B3}' : a.type === 'virement' ? '\u{1F4B8}' : '\u{1F4CB}'}</span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '12px', color: NOIR, lineHeight: 1.4 }}>{a.message}</p>
              </div>
              <button onClick={() => dismissAlerte(a.id)} style={{ background: 'none', border: 'none', color: MUTED, cursor: 'pointer', fontSize: '14px', padding: '4px' }}>{'✕'}</button>
            </div>
          ))}
        </div>
      )}

      {/* --- Actions rapides --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '24px' }}>
        {ACTIONS_RAPIDES.map((a, i) => (
          <button key={i} onClick={() => navigate(a.path)} style={{
            background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '12px',
            padding: '14px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: '6px', cursor: 'pointer', color: NOIR, fontSize: '11px', fontWeight: '600',
          }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '10px', background: `${a.color}15`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
            }}>{a.icon}</div>
            {a.label}
          </button>
        ))}
      </div>

      {/* --- Tab Bar --- */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: CARD2, borderRadius: '12px', padding: '4px' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            flex: 1, padding: '10px 6px', borderRadius: '10px', border: 'none', cursor: 'pointer',
            background: activeTab === t.id ? '#fff' : 'transparent',
            color: activeTab === t.id ? OR : MUTED,
            fontWeight: activeTab === t.id ? '700' : '500', fontSize: '12px',
            transition: 'all 0.2s',
            boxShadow: activeTab === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
          }}>
            <span style={{ fontSize: '16px', display: 'block', marginBottom: '2px' }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* --- Tab Content --- */}
      {activeTab === 'apercu' && <TabApercu stats={stats} maxRevMois={maxRevMois} navigate={navigate} />}
      {activeTab === 'rdv' && <TabRDV rdv={allRdv} navigate={navigate} />}
      {activeTab === 'equipe' && <TabEquipe navigate={navigate} />}
      {activeTab === 'finance' && <TabFinance stats={stats} navigate={navigate} />}

      {/* ============================================= */}
      {/* FLOATING ASSISTANT IA BUTTON */}
      {/* ============================================= */}
      {!showAssistant && (
        <button onClick={() => setShowAssistant(true)} style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 999,
          width: '60px', height: '60px', borderRadius: '50%',
          background: `linear-gradient(135deg, ${NOIR}, #1a1a2e)`,
          border: `2px solid ${OR}`, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '26px', boxShadow: `0 4px 20px rgba(0,0,0,0.3), 0 0 15px ${OR}30`,
          animation: 'float-btn 3s ease-in-out infinite',
        }}>
          {'\u{1F3A4}'}
        </button>
      )}

      {/* ============================================= */}
      {/* ASSISTANT IA PANEL */}
      {/* ============================================= */}
      {showAssistant && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000,
          height: '400px', background: `linear-gradient(135deg, ${NOIR}, #1a1a2e)`,
          borderRadius: '20px 20px 0 0',
          boxShadow: '0 -4px 30px rgba(0,0,0,0.4)',
          display: 'flex', flexDirection: 'column',
          color: CREME, overflow: 'hidden',
        }}>
          {/* Panel Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 20px', borderBottom: `1px solid ${OR}30`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: OR, fontWeight: '700', fontSize: '16px' }}>KADIO</span>
              <span style={{ fontWeight: '700', fontSize: '16px' }}>IA</span>
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: aiActive ? '#22c55e' : OR,
                boxShadow: `0 0 8px ${aiActive ? '#22c55e' : OR}`,
              }}/>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: MUTED }}>{aiStatusText}</span>
              <button onClick={() => { setShowAssistant(false); setAiActive(false); recognitionActiveRef.current = false; try { recognitionRef.current?.stop() } catch(e) {} }} style={{
                background: 'none', border: `1px solid ${MUTED}40`, borderRadius: '50%',
                width: '30px', height: '30px', cursor: 'pointer', color: MUTED,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
              }}>{'✕'}</button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="ai-panel" style={{
            flex: 1, overflowY: 'auto', padding: '12px 16px',
            display: 'flex', flexDirection: 'column', gap: '10px',
          }}>
            {aiMessages.map((msg, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%', padding: '10px 14px', borderRadius: '12px',
                  background: msg.role === 'user' ? `${OR}20` : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${msg.role === 'user' ? OR + '40' : 'rgba(255,255,255,0.1)'}`,
                  color: msg.role === 'user' ? OR : CREME,
                  fontSize: '13px', lineHeight: 1.5, wordBreak: 'break-word',
                }}>{msg.content}</div>
              </div>
            ))}
            {aiInterim && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{
                  maxWidth: '80%', padding: '10px 14px', borderRadius: '12px',
                  background: `${OR}10`, border: `1px dashed ${OR}`,
                  color: OR, fontSize: '13px', fontStyle: 'italic', opacity: 0.8,
                }}>{aiInterim}</div>
              </div>
            )}
            {aiMessages.length === 0 && !aiInterim && (
              <div style={{ textAlign: 'center', color: MUTED, fontSize: '13px', padding: '30px 10px' }}>
                {'\u{1F3A4}'} Appuyez sur le micro ou tapez votre question
              </div>
            )}
            {aiError && (
              <div style={{
                padding: '10px 14px', borderRadius: '10px',
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                color: '#fca5a5', fontSize: '12px',
              }}>{aiError}</div>
            )}
            <div ref={chatEndRef}/>
          </div>

          {/* Bottom Controls */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '12px 16px', borderTop: `1px solid ${OR}20`,
          }}>
            <button onClick={toggleMic} style={{
              width: '46px', height: '46px', borderRadius: '50%', flexShrink: 0,
              background: aiActive ? 'rgba(34,197,94,0.15)' : `${OR}20`,
              border: `2px solid ${aiActive ? '#22c55e' : OR}`,
              cursor: 'pointer', fontSize: '20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: aiStatus === 'listening' ? 'pulse-listen 1.5s infinite' : aiStatus === 'idle' && !aiActive ? 'pulse-ai 2s infinite' : 'none',
            }}>{'\u{1F3A4}'}</button>

            <form onSubmit={handleTextSubmit} style={{ display: 'flex', gap: '8px', flex: 1 }}>
              <input name="aiInput" type="text" placeholder="Tapez votre question..." style={{
                flex: 1, padding: '12px 14px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.05)', border: `1px solid ${OR}30`,
                color: CREME, fontSize: '13px', outline: 'none',
              }} onFocus={(e) => { e.target.style.borderColor = OR }}
                 onBlur={(e) => { e.target.style.borderColor = `${OR}30` }} />
              <button type="submit" style={{
                padding: '12px 18px', borderRadius: '10px',
                background: OR, border: 'none', color: NOIR,
                fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              }}>Envoyer</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// =============================================
// TAB: Apercu
// =============================================
function TabApercu({ stats, maxRevMois, navigate }) {
  return (
    <>
      <Section title="Tendance revenus">
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '100px', padding: '10px 0' }}>
          {stats.revenus_par_mois.map((r, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '10px', color: MUTED, fontWeight: 600 }}>{formatMontant(r.montant).replace(',00', '')}</span>
              <div style={{
                width: '100%', maxWidth: '40px',
                height: `${Math.max((r.montant / maxRevMois) * 70, 8)}px`,
                background: i === stats.revenus_par_mois.length - 1 ? `linear-gradient(180deg, ${OR}, ${OR}80)` : `${OR}30`,
                borderRadius: '6px 6px 2px 2px', transition: 'height 0.5s ease',
              }} />
              <span style={{ fontSize: '10px', color: MUTED }}>{r.mois}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Top services">
        {stats.top_services.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '8px', background: `${OR}15`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: '700', color: OR,
            }}>{i + 1}</div>
            <div style={{ flex: 1 }}><p style={{ margin: 0, fontSize: '13px', fontWeight: '600' }}>{s.service}</p></div>
            <div style={{ background: `${OR}15`, padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', color: OR }}>{s.count}</div>
          </div>
        ))}
      </Section>

      <Section title="Performance">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <MiniStat label="No-shows ce mois" value={stats.no_shows_mois} color="#ef4444" />
          <MiniStat label="Taux no-show" value={`${stats.taux_no_show}%`} color={stats.taux_no_show < 5 ? '#22c55e' : '#f59e0b'} />
          <MiniStat label="RDV/semaine" value={stats.rdv_semaine} color="#3B82F6" />
          <MiniStat label="vs sem. derniere" value={`+${stats.rdv_semaine - stats.rdv_semaine_prev}`} color="#22c55e" />
        </div>
      </Section>
    </>
  )
}

// =============================================
// TAB: RDV
// =============================================
function TabRDV({ rdv, navigate }) {
  const [filtre, setFiltre] = useState('tous')
  const rdvFiltres = filtre === 'tous' ? rdv : rdv.filter(r => r.statut === filtre)

  return (
    <>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
        {['tous', 'confirme', 'en_cours', 'termine', 'no_show'].map(f => (
          <button key={f} onClick={() => setFiltre(f)} style={{
            padding: '6px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer',
            fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap',
            background: filtre === f ? OR : CARD, color: filtre === f ? '#fff' : MUTED,
          }}>{f === 'tous' ? 'Tous' : f.replace('_', ' ')}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {rdvFiltres.map(r => (
          <div key={r.id} style={{
            background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '12px',
            padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px',
          }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '12px', background: `${statutColor(r.statut)}15`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: statutColor(r.statut) }}>{r.heure?.slice(0, 5)}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '600', color: NOIR, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.client}</p>
              <p style={{ margin: 0, fontSize: '11px', color: MUTED, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.coiffeur} - {r.service}</p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <span style={{ display: 'inline-block', fontSize: '10px', padding: '2px 8px', borderRadius: '20px', background: statutColor(r.statut) + '18', color: statutColor(r.statut), fontWeight: '600' }}>{r.statut.replace('_', ' ')}</span>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: OR, fontWeight: '700' }}>{formatMontant(r.montant)}</p>
            </div>
          </div>
        ))}
        {rdvFiltres.length === 0 && <p style={{ textAlign: 'center', color: MUTED, fontSize: '13px', padding: '20px' }}>Aucun RDV</p>}
      </div>
      <button onClick={() => navigate('/admin/calendrier')} style={{
        width: '100%', marginTop: '16px', padding: '12px', borderRadius: '10px',
        background: CARD, border: `1px solid ${BORDER_OR}`, cursor: 'pointer',
        color: OR, fontSize: '13px', fontWeight: '600', textAlign: 'center',
      }}>Voir le calendrier complet &rarr;</button>
    </>
  )
}

// =============================================
// TAB: Equipe
// =============================================
function TabEquipe({ navigate }) {
  return (
    <>
      <Section title={`Employes (${MOCK_EMPLOYES_ADMIN.length})`}>
        {MOCK_EMPLOYES_ADMIN.map(e => (
          <div key={e.id} style={{
            display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px',
            padding: '10px 12px', background: CARD, borderRadius: '10px', border: `1px solid ${BORDER_OR}`,
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: e.couleur_agenda + '20', border: `2px solid ${e.couleur_agenda}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: '700', color: e.couleur_agenda, flexShrink: 0,
            }}>{initiales(e.prenom, e.nom)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '600' }}>{e.prenom} {e.nom}</p>
              <p style={{ margin: 0, fontSize: '11px', color: MUTED }}>{e.poste} - {e.specialites.join(', ')}</p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', background: e.statut === 'actif' ? '#22c55e18' : '#f59e0b18', color: e.statut === 'actif' ? '#22c55e' : '#f59e0b', fontWeight: 600 }}>{e.statut}</span>
              <p style={{ margin: '4px 0 0', fontSize: '11px', color: MUTED }}>{e.rdv_semaine} RDV/sem</p>
            </div>
          </div>
        ))}
      </Section>

      <Section title={`Partenaires (${MOCK_PARTENAIRES_ADMIN.filter(p => p.statut === 'actif').length} actifs)`}>
        {MOCK_PARTENAIRES_ADMIN.filter(p => p.statut === 'actif').slice(0, 4).map(p => (
          <div key={p.id} style={{
            display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px',
            padding: '10px 12px', background: CARD, borderRadius: '10px', border: `1px solid ${BORDER_OR}`,
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%', background: `${OR}15`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: '700', color: OR, flexShrink: 0,
            }}>{initiales(p.prenom, p.nom)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '600' }}>{p.prenom} {p.nom}</p>
              <p style={{ margin: 0, fontSize: '11px', color: MUTED }}>{p.ville} - {p.note}/5</p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: '700', color: '#22c55e' }}>{formatMontant(p.revenus_mois)}</p>
              <p style={{ margin: '2px 0 0', fontSize: '10px', color: MUTED }}>{p.rdv_total} RDV total</p>
            </div>
          </div>
        ))}
        <button onClick={() => navigate('/admin/partenaires')} style={{
          width: '100%', padding: '10px', borderRadius: '8px', background: 'transparent',
          border: `1px solid ${BORDER_OR}`, cursor: 'pointer', color: OR, fontSize: '12px', fontWeight: '600',
        }}>Voir tous les partenaires &rarr;</button>
      </Section>
    </>
  )
}

// =============================================
// TAB: Finance
// =============================================
function TabFinance({ stats, navigate }) {
  const pendingVirements = MOCK_VIREMENTS_ADMIN.filter(v => v.statut === 'en_attente')
  const totalPending = pendingVirements.reduce((s, v) => s + v.montant, 0)

  return (
    <>
      <Section title="Revenus par source">
        {stats.revenus_par_source.map((r, i) => {
          const pct = Math.round((r.montant / stats.revenus_mois) * 100)
          return (
            <div key={i} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600' }}>{r.source}</span>
                <span style={{ fontSize: '12px', color: OR, fontWeight: '700' }}>{formatMontant(r.montant)} ({pct}%)</span>
              </div>
              <div style={{ height: '6px', background: CARD2, borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: OR, borderRadius: '3px', transition: 'width 0.5s ease' }} />
              </div>
            </div>
          )
        })}
      </Section>

      {pendingVirements.length > 0 && (
        <Section title={`Virements en attente (${pendingVirements.length})`}>
          <div style={{
            background: '#f59e0b10', border: '1px solid #f59e0b30', borderRadius: '10px',
            padding: '12px', marginBottom: '12px', textAlign: 'center',
          }}>
            <p style={{ margin: '0 0 2px', fontSize: '20px', fontWeight: '700', color: '#f59e0b' }}>{formatMontant(totalPending)}</p>
            <p style={{ margin: 0, fontSize: '11px', color: MUTED }}>A verser</p>
          </div>
          {pendingVirements.map(v => (
            <div key={v.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 0', borderBottom: `1px solid ${BORDER_OR}`,
            }}>
              <span style={{ fontSize: '12px', fontWeight: '600' }}>{v.partenaire}</span>
              <span style={{ fontSize: '13px', fontWeight: '700', color: OR }}>{formatMontant(v.montant)}</span>
            </div>
          ))}
          <button onClick={() => navigate('/admin/virements')} style={{
            width: '100%', marginTop: '12px', padding: '10px', borderRadius: '8px',
            background: OR, border: 'none', cursor: 'pointer', color: '#fff', fontSize: '13px', fontWeight: '600',
          }}>Effectuer les virements &rarr;</button>
        </Section>
      )}

      <Section title="Dernieres transactions">
        {MOCK_TRANSACTIONS_ADMIN.slice(0, 5).map(t => (
          <div key={t.id} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '8px 0', borderBottom: `1px solid ${BORDER_OR}`,
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: t.type.includes('abonnement') ? '#8B5CF615' : t.type.includes('domicile') ? '#22c55e15' : `${OR}15`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0,
            }}>
              {t.type.includes('abonnement') ? '\u{1F4E6}' : t.type.includes('materiel') ? '\u{1F9F4}' : '✂️'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: '0 0 2px', fontSize: '12px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.client || t.partenaire}</p>
              <p style={{ margin: 0, fontSize: '10px', color: MUTED }}>{t.date} - {t.type.replace('_', ' ')}</p>
            </div>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#22c55e', flexShrink: 0 }}>{formatMontant(t.montant)}</span>
          </div>
        ))}
        <button onClick={() => navigate('/admin/transactions')} style={{
          width: '100%', marginTop: '12px', padding: '10px', borderRadius: '8px',
          background: 'transparent', border: `1px solid ${BORDER_OR}`, cursor: 'pointer',
          color: OR, fontSize: '12px', fontWeight: '600',
        }}>Toutes les transactions &rarr;</button>
      </Section>
    </>
  )
}

// =============================================
// Shared Components
// =============================================
function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h3 style={{ color: OR, fontSize: '14px', fontWeight: '700', margin: '0 0 12px', letterSpacing: '0.02em' }}>{title}</h3>
      {children}
    </div>
  )
}

function MiniStat({ label, value, color }) {
  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '10px', padding: '12px' }}>
      <p style={{ color: MUTED, fontSize: '10px', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{label}</p>
      <p style={{ color, fontSize: '20px', fontWeight: '700', margin: 0 }}>{value}</p>
    </div>
  )
}
