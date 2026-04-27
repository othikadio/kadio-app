import React, { useState, useEffect, useRef, useCallback } from 'react';
import { OR, CREME, NOIR, IVOIRE, SABLE, MUTED } from '@/lib/utils';

// ═══════════════════════════════════════════════════════════════════
// KADIO GESTION — Plateforme d'Autonomie Entrepreneuriale par IA
// "Quiet Luxury SaaS" — Élégant, Fonctionnel, Voice-First
// ═══════════════════════════════════════════════════════════════════

const AVATARS = [
  { id: 'homme', emoji: '👨🏾‍💼', label: 'Stratège', desc: 'Professionnel calme' },
  { id: 'femme', emoji: '👩🏾‍💼', label: 'Directrice', desc: 'Leadership naturel' },
  { id: 'robot', emoji: '🤖', label: 'Nexus', desc: 'IA futuriste' },
  { id: 'sage', emoji: '🧘🏾', label: 'Sage', desc: 'Philosophe zen' },
  { id: 'coach', emoji: '🦁', label: 'Coach', desc: 'Énergie & vision' },
  { id: 'zen', emoji: '🌊', label: 'Flow', desc: 'Sois comme l\'eau' },
];

const VOICES = [
  { id: 'onyx', label: 'Onyx', desc: 'Grave, professionnel', icon: '🎵' },
  { id: 'nova', label: 'Nova', desc: 'Doux, chaleureux', icon: '✨' },
  { id: 'echo', label: 'Echo', desc: 'Profond, posé', icon: '🌙' },
  { id: 'shimmer', label: 'Shimmer', desc: 'Clair, énergique', icon: '💫' },
];

const AGENTS = [
  { id: 'finance', icon: '💰', label: 'Finance', color: '#22c55e', desc: 'Revenus, dépenses, prévisions, gestion des fonds' },
  { id: 'marketing', icon: '📣', label: 'Marketing', color: '#3b82f6', desc: 'Réseaux sociaux, campagnes, publicité, contenu' },
  { id: 'communication', icon: '💬', label: 'Communication', color: '#a855f7', desc: 'Messages clients, emails, appels, rappels' },
  { id: 'serenite', icon: '🧘', label: 'Sérénité', color: '#f59e0b', desc: 'Bien-être, stress, coaching mental, équilibre' },
];

const CHANNELS = [
  { id: 'messenger', icon: '💬', label: 'Messenger', color: '#0084FF', connected: false },
  { id: 'instagram', icon: '📸', label: 'Instagram', color: '#E1306C', connected: false },
  { id: 'whatsapp', icon: '📱', label: 'WhatsApp', color: '#25D366', connected: false },
  { id: 'tiktok', icon: '🎵', label: 'TikTok', color: '#000000', connected: false },
  { id: 'google', icon: '🔍', label: 'Google', color: '#4285F4', connected: false },
  { id: 'pinterest', icon: '📌', label: 'Pinterest', color: '#E60023', connected: false },
  { id: 'email', icon: '📧', label: 'Email', color: '#6366f1', connected: false },
];

const ONBOARDING_STEPS = [
  { title: 'Bienvenue', desc: 'Je suis KADIO, ton partenaire stratège. Je suis là pour gérer ton entreprise pendant que tu vis ta vie.' },
  { title: 'Ton avatar', desc: 'Choisis l\'apparence et la voix de ton assistant. C\'est lui qui va te représenter auprès de tes clients.' },
  { title: 'Tes canaux', desc: 'Connecte tes réseaux sociaux et je m\'occupe de tout — messages, publications, réponses clients.' },
  { title: 'Ton mode', desc: 'Supervisé = je te demande avant d\'agir. Autonome = je gère avec un budget plafonné. Tu choisis.' },
];

export default function Assistant() {
  // ── State ──
  const [view, setView] = useState('main'); // main | chat | serenite | settings | onboarding
  const [activeAgent, setActiveAgent] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState('sage');
  const [selectedVoice, setSelectedVoice] = useState('onyx');
  const [autonomyMode, setAutonomyMode] = useState('supervise'); // supervise | autonome
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState('idle');
  const [isListening, setIsListening] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [channels, setChannels] = useState(CHANNELS);
  const [hoveredAgent, setHoveredAgent] = useState(null);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  // ── Scroll to bottom ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Speech Recognition ──
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = 'fr-CA';
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      if (text) sendMessage(text);
    };
    rec.onend = () => setIsListening(false);
    rec.onerror = () => setIsListening(false);
    recognitionRef.current = rec;
  }, []);

  const toggleVoice = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  // ── Send message ──
  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', content: text };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInputText('');
    setStatus('thinking');

    try {
      const agentContext = activeAgent
        ? `[Agent ${activeAgent.toUpperCase()}] `
        : '';
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: agentContext + text }],
          channel: 'kadio-gestion',
        }),
      });
      const data = await res.json();
      const reply = data.reply || 'Je n\'ai pas pu traiter ta demande.';
      setMessages([...newMsgs, { role: 'assistant', content: reply, agent: activeAgent }]);

      // // TTS via OpenAI (base64 decode)
      if (selectedVoice) {
        try {
          const audioRes = await fetch('/api/ai-voice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: reply, voice: selectedVoice }),
          });
          if (audioRes.ok) {
            const data = await audioRes.json();
            if (data.audio) {
              const binaryStr = atob(data.audio);
              const bytes = new Uint8Array(binaryStr.length);
              for (let i = 0; i < binaryStr.length; i++) {
                bytes[i] = binaryStr.charCodeAt(i);
              }
              const blob = new Blob([bytes], { type: 'audio/mpeg' });
              const audio = new Audio(URL.createObjectURL(blob));
              setStatus('speaking');
              audio.onended = () => setStatus('idle');
              audio.play();
              return;
            }
          }
        } catch (e) { /* fallback to idle */ }
      }
    } catch (e) {
      setMessages([...newMsgs, { role: 'assistant', content: 'Erreur de connexion. Réessaie.' }]);
    }
    setStatus('idle');
  }, [messages, activeAgent, selectedVoice]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  const avatar = AVATARS.find(a => a.id === selectedAvatar) || AVATARS[0];

  // ═══════════════════════════════════════
  // RENDER — ONBOARDING
  // ═══════════════════════════════════════
  if (showOnboarding) {
    const step = ONBOARDING_STEPS[onboardingStep];
    return (
      <div style={styles.container}>
        <style>{cssAnimations}</style>
        <div style={styles.onboardingOverlay}>
          <div style={styles.onboardingCard}>
            {/* Progress */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 32 }}>
              {ONBOARDING_STEPS.map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: 3, borderRadius: 2,
                  background: i <= onboardingStep ? OR : '#e5e7eb',
                  transition: 'background 0.3s',
                }} />
              ))}
            </div>

            <div style={{ fontSize: 42, marginBottom: 16, textAlign: 'center' }}>
              {onboardingStep === 0 && avatar.emoji}
              {onboardingStep === 1 && '🎭'}
              {onboardingStep === 2 && '🔗'}
              {onboardingStep === 3 && '⚡'}
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: NOIR, marginBottom: 8, textAlign: 'center' }}>
              {step.title}
            </h2>
            <p style={{ fontSize: 15, color: MUTED, textAlign: 'center', lineHeight: 1.6, marginBottom: 28 }}>
              {step.desc}
            </p>

            {/* Step 1: Avatar selection */}
            {onboardingStep === 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
                {AVATARS.map(a => (
                  <div key={a.id} onClick={() => setSelectedAvatar(a.id)} style={{
                    padding: '14px 8px', borderRadius: 12, textAlign: 'center', cursor: 'pointer',
                    border: selectedAvatar === a.id ? `2px solid ${OR}` : '2px solid #f3f4f6',
                    background: selectedAvatar === a.id ? 'rgba(184,146,42,0.06)' : '#fff',
                    transition: 'all 0.2s',
                  }}>
                    <div style={{ fontSize: 28 }}>{a.emoji}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: NOIR, marginTop: 4 }}>{a.label}</div>
                    <div style={{ fontSize: 10, color: MUTED }}>{a.desc}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 1: Voice selection */}
            {onboardingStep === 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 20 }}>
                {VOICES.map(v => (
                  <div key={v.id} onClick={() => setSelectedVoice(v.id)} style={{
                    padding: '10px 12px', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                    border: selectedVoice === v.id ? `2px solid ${OR}` : '2px solid #f3f4f6',
                    background: selectedVoice === v.id ? 'rgba(184,146,42,0.06)' : '#fff',
                    transition: 'all 0.2s',
                  }}>
                    <span style={{ fontSize: 18 }}>{v.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: NOIR }}>{v.label}</div>
                      <div style={{ fontSize: 10, color: MUTED }}>{v.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 2: Channels */}
            {onboardingStep === 2 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 20 }}>
                {channels.map(ch => (
                  <div key={ch.id} onClick={() => {
                    setChannels(prev => prev.map(c => c.id === ch.id ? { ...c, connected: !c.connected } : c));
                  }} style={{
                    padding: '12px', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                    border: ch.connected ? `2px solid ${ch.color}` : '2px solid #f3f4f6',
                    background: ch.connected ? `${ch.color}08` : '#fff',
                    transition: 'all 0.2s',
                  }}>
                    <span style={{ fontSize: 20 }}>{ch.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: NOIR }}>{ch.label}</div>
                    </div>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%',
                      background: ch.connected ? ch.color : '#e5e7eb',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, color: '#fff',
                    }}>
                      {ch.connected ? '✓' : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 3: Autonomy mode */}
            {onboardingStep === 3 && (
              <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                {[
                  { id: 'supervise', icon: '👁️', label: 'Supervisé', desc: 'Je te demande avant chaque action importante' },
                  { id: 'autonome', icon: '🚀', label: 'Autonome', desc: 'Je gère seul avec un budget plafonné' },
                ].map(m => (
                  <div key={m.id} onClick={() => setAutonomyMode(m.id)} style={{
                    flex: 1, padding: 16, borderRadius: 12, cursor: 'pointer', textAlign: 'center',
                    border: autonomyMode === m.id ? `2px solid ${OR}` : '2px solid #f3f4f6',
                    background: autonomyMode === m.id ? 'rgba(184,146,42,0.06)' : '#fff',
                    transition: 'all 0.2s',
                  }}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>{m.icon}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: NOIR }}>{m.label}</div>
                    <div style={{ fontSize: 11, color: MUTED, marginTop: 4, lineHeight: 1.4 }}>{m.desc}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Navigation */}
            <div style={{ display: 'flex', gap: 10 }}>
              {onboardingStep > 0 && (
                <button onClick={() => setOnboardingStep(s => s - 1)} style={styles.btnSecondary}>
                  Retour
                </button>
              )}
              <button onClick={() => {
                if (onboardingStep < ONBOARDING_STEPS.length - 1) {
                  setOnboardingStep(s => s + 1);
                } else {
                  setShowOnboarding(false);
                  setView('main');
                }
              }} style={styles.btnPrimary}>
                {onboardingStep === ONBOARDING_STEPS.length - 1 ? 'Commencer' : 'Suivant'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════
  // RENDER — CHAT VIEW
  // ═══════════════════════════════════════
  if (view === 'chat' || view === 'serenite') {
    const isSerenite = view === 'serenite';
    const agentInfo = isSerenite
      ? { icon: '🧘', label: 'Espace Sérénité', color: '#f59e0b' }
      : AGENTS.find(a => a.id === activeAgent) || { icon: '🤖', label: 'KADIO', color: OR };

    return (
      <div style={styles.container}>
        <style>{cssAnimations}</style>

        {/* Header */}
        <div style={styles.chatHeader}>
          <button onClick={() => { setView('main'); setActiveAgent(null); setMessages([]); }} style={styles.backBtn}>
            ←
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>{isSerenite ? '🧘' : agentInfo.icon}</span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: NOIR }}>
                {isSerenite ? 'Espace Sérénité' : `Agent ${agentInfo.label}`}
              </div>
              <div style={{ fontSize: 11, color: MUTED }}>
                {status === 'thinking' ? 'Réfléchit...' : status === 'speaking' ? 'Parle...' : 'En ligne'}
              </div>
            </div>
          </div>
          <button onClick={toggleVoice} style={{
            ...styles.voiceBtn,
            background: isListening ? '#fee2e2' : '#f3f4f6',
            color: isListening ? '#ef4444' : NOIR,
          }}>
            {isListening ? '⏹' : '🎤'}
          </button>
        </div>

        {/* Messages */}
        <div style={styles.chatMessages}>
          {messages.length === 0 && (
            <div style={styles.emptyChat}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>{isSerenite ? '🌊' : agentInfo.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 500, color: NOIR, marginBottom: 6 }}>
                {isSerenite ? 'Comment tu te sens aujourd\'hui ?' : `Agent ${agentInfo.label} prêt`}
              </div>
              <div style={{ fontSize: 13, color: MUTED, maxWidth: 300, lineHeight: 1.5 }}>
                {isSerenite
                  ? 'Cet espace est pour toi. Parle-moi de ce qui te préoccupe, ou simplement respire.'
                  : 'Pose-moi une question ou donne-moi une directive. Je m\'en occupe.'}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 10, animation: 'fadeUp 0.3s ease',
            }}>
              <div style={{
                maxWidth: '80%', padding: '12px 16px', borderRadius: 16,
                background: msg.role === 'user' ? NOIR : '#f8f9fa',
                color: msg.role === 'user' ? '#fff' : NOIR,
                fontSize: 14, lineHeight: 1.6,
                borderBottomRightRadius: msg.role === 'user' ? 4 : 16,
                borderBottomLeftRadius: msg.role === 'user' ? 16 : 4,
              }}>
                {msg.content}
              </div>
            </div>
          ))}

          {status === 'thinking' && (
            <div style={{ display: 'flex', gap: 6, padding: '12px 16px' }}>
              <div style={styles.typingDot} /><div style={{ ...styles.typingDot, animationDelay: '0.15s' }} /><div style={{ ...styles.typingDot, animationDelay: '0.3s' }} />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} style={styles.chatInput}>
          <input
            ref={inputRef}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder={isSerenite ? 'Dis-moi ce qui te préoccupe...' : 'Écris ta directive...'}
            style={styles.input}
          />
          <button type="submit" disabled={!inputText.trim()} style={{
            ...styles.sendBtn, opacity: inputText.trim() ? 1 : 0.4,
          }}>
            ↑
          </button>
        </form>
      </div>
    );
  }

  // ═══════════════════════════════════════
  // RENDER — SETTINGS
  // ═══════════════════════════════════════
  if (view === 'settings') {
    return (
      <div style={styles.container}>
        <style>{cssAnimations}</style>
        <div style={styles.settingsHeader}>
          <button onClick={() => setView('main')} style={styles.backBtn}>←</button>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: NOIR }}>Paramètres</h2>
          <div style={{ width: 36 }} />
        </div>

        <div style={styles.settingsBody}>
          {/* Avatar */}
          <div style={styles.settingsSection}>
            <h3 style={styles.sectionTitle}>Ton avatar</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {AVATARS.map(a => (
                <div key={a.id} onClick={() => setSelectedAvatar(a.id)} style={{
                  padding: '14px 8px', borderRadius: 12, textAlign: 'center', cursor: 'pointer',
                  border: selectedAvatar === a.id ? `2px solid ${OR}` : '2px solid #f3f4f6',
                  background: selectedAvatar === a.id ? 'rgba(184,146,42,0.05)' : '#fff',
                }}>
                  <div style={{ fontSize: 28 }}>{a.emoji}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: NOIR, marginTop: 4 }}>{a.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Voice */}
          <div style={styles.settingsSection}>
            <h3 style={styles.sectionTitle}>Voix de l'IA</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {VOICES.map(v => (
                <div key={v.id} onClick={() => setSelectedVoice(v.id)} style={{
                  padding: '12px', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                  border: selectedVoice === v.id ? `2px solid ${OR}` : '2px solid #f3f4f6',
                  background: selectedVoice === v.id ? 'rgba(184,146,42,0.05)' : '#fff',
                }}>
                  <span style={{ fontSize: 18 }}>{v.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: NOIR }}>{v.label}</div>
                    <div style={{ fontSize: 10, color: MUTED }}>{v.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Autonomy */}
          <div style={styles.settingsSection}>
            <h3 style={styles.sectionTitle}>Mode de gestion</h3>
            <div style={{ display: 'flex', gap: 10 }}>
              {['supervise', 'autonome'].map(m => (
                <div key={m} onClick={() => setAutonomyMode(m)} style={{
                  flex: 1, padding: 14, borderRadius: 12, cursor: 'pointer', textAlign: 'center',
                  border: autonomyMode === m ? `2px solid ${OR}` : '2px solid #f3f4f6',
                  background: autonomyMode === m ? 'rgba(184,146,42,0.05)' : '#fff',
                }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{m === 'supervise' ? '👁️' : '🚀'}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: NOIR }}>
                    {m === 'supervise' ? 'Supervisé' : 'Autonome'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Channels */}
          <div style={styles.settingsSection}>
            <h3 style={styles.sectionTitle}>Canaux connectés</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {channels.map(ch => (
                <div key={ch.id} onClick={() => {
                  setChannels(prev => prev.map(c => c.id === ch.id ? { ...c, connected: !c.connected } : c));
                }} style={{
                  padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 12,
                  border: ch.connected ? `1px solid ${ch.color}40` : '1px solid #f3f4f6',
                  background: ch.connected ? `${ch.color}08` : '#fff',
                }}>
                  <span style={{ fontSize: 20 }}>{ch.icon}</span>
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: NOIR }}>{ch.label}</span>
                  <div style={{
                    padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                    background: ch.connected ? `${ch.color}15` : '#f3f4f6',
                    color: ch.connected ? ch.color : MUTED,
                  }}>
                    {ch.connected ? 'Connecté' : 'Connecter'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Onboarding replay */}
          <button onClick={() => { setShowOnboarding(true); setOnboardingStep(0); }} style={{
            ...styles.btnSecondary, width: '100%', marginTop: 10,
          }}>
            🔄 Revoir le tutoriel d'introduction
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════
  // RENDER — MAIN VIEW (Quiet Luxury)
  // ═══════════════════════════════════════
  return (
    <div style={styles.container}>
      <style>{cssAnimations}</style>

      {/* Top bar */}
      <div style={styles.topBar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 28 }}>{avatar.emoji}</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: NOIR, letterSpacing: 0.5 }}>
              KADIO <span style={{ color: OR }}>Gestion</span>
            </div>
            <div style={{ fontSize: 11, color: MUTED }}>
              Mode {autonomyMode === 'supervise' ? 'supervisé' : 'autonome'} · Voix {selectedVoice}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => { setShowOnboarding(true); setOnboardingStep(0); }} style={styles.iconBtn} title="Guide">
            ❓
          </button>
          <button onClick={() => setView('settings')} style={styles.iconBtn} title="Paramètres">
            ⚙️
          </button>
        </div>
      </div>

      {/* Welcome message */}
      <div style={styles.welcomeSection}>
        <h1 style={{ fontSize: 22, fontWeight: 300, color: NOIR, marginBottom: 4 }}>
          Bonjour <span style={{ fontWeight: 600 }}>Othi</span>
        </h1>
        <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.5 }}>
          Sois comme l'eau — elle s'adapte à tout. Ton business aussi.
        </p>
      </div>

      {/* Quick voice action */}
      <div onClick={() => { setActiveAgent(null); setView('chat'); }} style={styles.voiceCard}>
        <div style={styles.voiceCardInner}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>{avatar.emoji}</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: NOIR }}>Parle-moi</div>
          <div style={{ fontSize: 12, color: MUTED }}>Dis-moi ce que tu veux, je m'en occupe</div>
        </div>
        <div style={styles.voicePulse} />
      </div>

      {/* Agents grid */}
      <div style={styles.sectionHeader}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: NOIR, letterSpacing: 0.5 }}>MES AGENTS</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 20 }}>
        {AGENTS.map(agent => (
          <div
            key={agent.id}
            onClick={() => {
              if (agent.id === 'serenite') {
                setActiveAgent('serenite');
                setView('serenite');
              } else {
                setActiveAgent(agent.id);
                setView('chat');
              }
              setMessages([]);
            }}
            onMouseEnter={() => setHoveredAgent(agent.id)}
            onMouseLeave={() => setHoveredAgent(null)}
            style={{
              padding: 16, borderRadius: 14, cursor: 'pointer',
              background: hoveredAgent === agent.id ? `${agent.color}08` : '#fff',
              border: `1px solid ${hoveredAgent === agent.id ? `${agent.color}30` : '#f3f4f6'}`,
              transition: 'all 0.25s ease',
            }}
          >
            <div style={{
              width: 38, height: 38, borderRadius: 10, display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 20,
              background: `${agent.color}12`, marginBottom: 10,
            }}>
              {agent.icon}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: NOIR }}>{agent.label}</div>
            <div style={{ fontSize: 11, color: MUTED, marginTop: 3, lineHeight: 1.4 }}>{agent.desc}</div>
          </div>
        ))}
      </div>

      {/* Connected channels */}
      <div style={styles.sectionHeader}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: NOIR, letterSpacing: 0.5 }}>CANAUX</h2>
        <button onClick={() => setView('settings')} style={{ fontSize: 12, color: OR, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
          Gérer →
        </button>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {channels.map(ch => (
          <div key={ch.id} style={{
            padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: 6,
            background: ch.connected ? `${ch.color}10` : '#f9fafb',
            color: ch.connected ? ch.color : '#d1d5db',
            border: `1px solid ${ch.connected ? `${ch.color}25` : '#f3f4f6'}`,
          }}>
            <span style={{ fontSize: 14 }}>{ch.icon}</span>
            {ch.label}
            {ch.connected && <span style={{ fontSize: 8 }}>●</span>}
          </div>
        ))}
      </div>

      {/* Sérénité quick access */}
      <div onClick={() => { setActiveAgent('serenite'); setView('serenite'); setMessages([]); }} style={styles.sereniteCard}>
        <span style={{ fontSize: 24 }}>🌊</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: NOIR }}>Espace Sérénité</div>
          <div style={{ fontSize: 11, color: MUTED }}>Respire. Ton business va bien.</div>
        </div>
        <span style={{ fontSize: 18, color: '#d1d5db' }}>→</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// STYLES
// ═══════════════════════════════════════
const styles = {
  container: {
    width: '100%', minHeight: '100vh', background: '#fafbfc',
    fontFamily: '"Inter", "DM Sans", -apple-system, sans-serif',
    display: 'flex', flexDirection: 'column', maxWidth: 480,
    margin: '0 auto', position: 'relative',
  },
  topBar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 20px', borderBottom: '1px solid #f3f4f6',
    background: '#fff', position: 'sticky', top: 0, zIndex: 10,
  },
  welcomeSection: {
    padding: '24px 20px 12px',
  },
  voiceCard: {
    margin: '0 20px 20px', padding: 24, borderRadius: 16,
    background: '#fff', border: '1px solid #f3f4f6', cursor: 'pointer',
    position: 'relative', overflow: 'hidden', textAlign: 'center',
    transition: 'all 0.3s ease',
  },
  voiceCardInner: { position: 'relative', zIndex: 1 },
  voicePulse: {
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    width: 120, height: 120, borderRadius: '50%', background: `${OR}08`,
    animation: 'breathe 4s ease-in-out infinite',
  },
  sectionHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0 20px', marginBottom: 10,
  },
  sereniteCard: {
    margin: '0 20px 20px', padding: '16px 18px', borderRadius: 14,
    background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
    border: '1px solid #fde68a40', display: 'flex', alignItems: 'center',
    gap: 14, cursor: 'pointer', transition: 'all 0.2s',
  },
  iconBtn: {
    width: 36, height: 36, borderRadius: 10, border: '1px solid #f3f4f6',
    background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', fontSize: 16, transition: 'all 0.2s',
  },
  // Chat
  chatHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 16px', background: '#fff', borderBottom: '1px solid #f3f4f6',
    position: 'sticky', top: 0, zIndex: 10,
  },
  chatMessages: {
    flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column',
  },
  chatInput: {
    display: 'flex', gap: 8, padding: '12px 16px',
    background: '#fff', borderTop: '1px solid #f3f4f6',
  },
  input: {
    flex: 1, padding: '12px 16px', borderRadius: 12, border: '1px solid #e5e7eb',
    fontSize: 14, outline: 'none', background: '#f9fafb', color: NOIR,
    fontFamily: 'inherit',
  },
  sendBtn: {
    width: 42, height: 42, borderRadius: 12, border: 'none',
    background: NOIR, color: '#fff', fontSize: 18, fontWeight: 700,
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'opacity 0.2s',
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 10, border: '1px solid #e5e7eb',
    background: '#fff', fontSize: 18, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: NOIR,
  },
  voiceBtn: {
    width: 36, height: 36, borderRadius: 10, border: 'none',
    fontSize: 16, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.2s',
  },
  emptyChat: {
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', textAlign: 'center', padding: 40,
  },
  typingDot: {
    width: 8, height: 8, borderRadius: '50%', background: '#d1d5db',
    animation: 'bounce 0.6s infinite alternate',
  },
  // Settings
  settingsHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 16px', background: '#fff', borderBottom: '1px solid #f3f4f6',
  },
  settingsBody: {
    flex: 1, padding: 16, overflowY: 'auto',
  },
  settingsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13, fontWeight: 600, color: MUTED, letterSpacing: 0.5,
    textTransform: 'uppercase', marginBottom: 10,
  },
  // Onboarding
  onboardingOverlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 100, padding: 20, backdropFilter: 'blur(8px)',
  },
  onboardingCard: {
    background: '#fff', borderRadius: 20, padding: '32px 24px',
    maxWidth: 400, width: '100%', animation: 'fadeUp 0.4s ease',
  },
  // Buttons
  btnPrimary: {
    flex: 1, padding: '14px 20px', borderRadius: 12, border: 'none',
    background: NOIR, color: '#fff', fontSize: 14, fontWeight: 600,
    cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center',
  },
  btnSecondary: {
    flex: 1, padding: '14px 20px', borderRadius: 12,
    border: '1px solid #e5e7eb', background: '#fff', color: NOIR,
    fontSize: 14, fontWeight: 500, cursor: 'pointer', textAlign: 'center',
  },
};

// ═══════════════════════════════════════
// CSS ANIMATIONS
// ═══════════════════════════════════════
const cssAnimations = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes breathe {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
    50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.1; }
  }
  @keyframes bounce {
    from { transform: translateY(0); }
    to { transform: translateY(-6px); }
  }
`;
