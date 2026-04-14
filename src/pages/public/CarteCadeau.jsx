import { useState } from 'react'
import { OR, CREME, NOIR, CARD } from '@/lib/utils'
import { createCheckoutSession } from '@/lib/stripe'

// ─── Génération de code KADIO-GIFT-XXXX ─────────────────────
function genCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let seg = ''
  for (let i = 0; i < 4; i++) seg += chars[Math.floor(Math.random() * chars.length)]
  return `KADIO-GIFT-${seg}`
}

// ─── Données statiques ───────────────────────────────────────
const MONTANTS = [25, 50, 100, 150]

const ETAPES = [
  {
    num: '01',
    titre: `Choisissez le montant`,
    desc: `Sélectionnez un montant prédéfini ou entrez un montant personnalisé entre 20$ et 500$.`,
  },
  {
    num: '02',
    titre: `Personnalisez la carte`,
    desc: `Ajoutez le nom du destinataire et un message personnel pour rendre la carte unique.`,
  },
  {
    num: '03',
    titre: `Choisissez la livraison`,
    desc: `Envoyez la carte par SMS, par courriel, ou récupérez-la imprimée directement au salon.`,
  },
  {
    num: '04',
    titre: `Profitez des services`,
    desc: `Le destinataire présente le code KADIO-GIFT au salon pour bénéficier de tous les services.`,
  },
]

const SERVICES_TAGS = [`Coiffure femme`, `Barbier`, `Tresses & Locs`, `Knotless braids`, `Esthétique`, `Soins capillaires`]

// ─── Aperçu visuel de la carte ───────────────────────────────
function GiftCardPreview({ montant, nomDestinataire, message }) {
  const displayMontant = montant > 0 ? `${montant}$` : `??$`
  const displayNom = nomDestinataire || `Nom du destinataire`

  return (
    <div style={{
      width: '100%', maxWidth: '380px', height: '220px', margin: '0 auto',
      background: `linear-gradient(135deg, #1A1611 0%, #0d0a08 60%, #1f1710 100%)`,
      border: `1px solid ${OR}`, borderRadius: '16px', padding: '28px',
      position: 'relative', overflow: 'hidden',
      boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(184,146,42,0.08)`,
      fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box',
    }}>
      {/* Accent diagonal */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: `linear-gradient(225deg, rgba(184,146,42,0.14) 0%, transparent 60%)`, borderRadius: '0 16px 0 0' }} />
      <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '100px', height: '100px', border: `1px solid rgba(184,146,42,0.13)`, borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', width: '80px', height: '80px', border: `1px solid rgba(184,146,42,0.07)`, borderRadius: '50%' }} />

      {/* Top */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
        <div>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: OR, letterSpacing: '0.15em', lineHeight: 1 }}>KADIO</div>
          <div style={{ fontSize: '9px', color: `rgba(184,146,42,0.55)`, letterSpacing: '0.2em', marginTop: '2px' }}>COIFFURE & ESTHÉTIQUE</div>
        </div>
        <div style={{ background: `rgba(14,12,9,0.08)`, border: `1px solid rgba(184,146,42,0.28)`, borderRadius: '6px', padding: '4px 10px', fontSize: '9px', color: OR, letterSpacing: '0.12em', fontWeight: 600 }}>
          CARTE CADEAU
        </div>
      </div>

      {/* Montant */}
      <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '50px', color: OR, letterSpacing: '0.04em', lineHeight: 1, marginBottom: '14px' }}>
        {displayMontant}
      </div>

      {/* Bottom */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ flex: 1, minWidth: 0, marginRight: '12px' }}>
          <div style={{ fontSize: '9px', color: `rgba(14,12,9,0.38)`, letterSpacing: '0.1em', marginBottom: '3px' }}>POUR</div>
          <div style={{ fontSize: '14px', color: NOIR, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayNom}</div>
          {message && (
            <div style={{ fontSize: '11px', color: `rgba(14,12,9,0.48)`, marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontStyle: 'italic' }}>
              {`"${message}"`}
            </div>
          )}
        </div>
        <div style={{ fontSize: '9px', color: `rgba(14,12,9,0.25)`, letterSpacing: '0.06em', flexShrink: 0 }}>kadio.app</div>
      </div>
    </div>
  )
}

// ─── Page de confirmation ────────────────────────────────────
function ConfirmationPage({ code, form, montant, livraison, onNouvelle }) {
  const [copied, setCopied] = useState(false)

  function copier() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const livraisonLabel =
    livraison === 'courriel' ? `Confirmation envoyée à ${form.courrielAcheteur}`
    : livraison === 'sms'    ? `Carte envoyée par SMS au destinataire`
    :                          `Carte à récupérer imprimée au salon`
  const livraisonIcon = livraison === 'courriel' ? `📧` : livraison === 'sms' ? `📱` : `🖨️`

  return (
    <div style={{ background: CREME, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'DM Sans, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '560px', textAlign: 'center' }}>

        {/* Icône succès */}
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: `rgba(14,12,9,0.08)`, border: `2px solid rgba(184,146,42,0.35)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '36px' }}>
          🎁
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: `rgba(34,197,94,0.1)`, border: `1px solid rgba(34,197,94,0.3)`, borderRadius: '100px', padding: '6px 16px', marginBottom: '24px' }}>
          <span style={{ color: '#22c55e', fontSize: '12px', letterSpacing: '0.1em', fontWeight: 600 }}>✓ ACHAT CONFIRMÉ</span>
        </div>

        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '42px', color: NOIR, letterSpacing: '0.1em', marginBottom: '12px' }}>
          CARTE CADEAU <span style={{ color: OR }}>CRÉÉE</span>
        </h1>
        <p style={{ color: `rgba(14,12,9,0.58)`, marginBottom: '36px', fontSize: '15px', lineHeight: 1.65 }}>
          La carte cadeau de <strong style={{ color: NOIR }}>{montant}$</strong> pour <strong style={{ color: NOIR }}>{form.nomDestinataire}</strong> a été générée avec succès.
        </p>

        {/* Code */}
        <div style={{ background: `linear-gradient(135deg, #1A1611 0%, #0d0a08 100%)`, border: `2px solid ${OR}`, borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
          <p style={{ fontSize: '11px', color: `rgba(14,12,9,0.38)`, letterSpacing: '0.15em', marginBottom: '10px' }}>CODE DE LA CARTE CADEAU</p>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '34px', color: OR, letterSpacing: '0.18em', marginBottom: '16px' }}>{code}</div>
          <button onClick={copier} style={{ padding: '10px 24px', borderRadius: '8px', background: `rgba(14,12,9,0.08)`, border: `1px solid rgba(14,12,9,0.08)`, color: copied ? '#22c55e' : OR, fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s' }}>
            {copied ? `✓ Copié !` : `📋 Copier le code`}
          </button>
        </div>

        {/* Instructions */}
        <div style={{ background: CARD, border: `1px solid rgba(184,146,42,0.12)`, borderRadius: '12px', padding: '22px', marginBottom: '28px', textAlign: 'left' }}>
          <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '16px', color: NOIR, letterSpacing: '0.08em', marginBottom: '16px' }}>DÉTAILS & INSTRUCTIONS</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { icon: livraisonIcon, text: livraisonLabel },
              { icon: `🎁`, text: `${form.nomDestinataire} n'a qu'à présenter le code ${code} au salon` },
              { icon: `⏰`, text: `Valide 12 mois à partir de la date d'achat` },
              { icon: `✨`, text: `Utilisable pour tous les services — coiffure, barbier, esthétique` },
              { icon: `📞`, text: `Questions ? Appelez-nous au 514-919-5970` },
            ].map(({ icon, text }, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '16px', flexShrink: 0 }}>{icon}</span>
                <span style={{ fontSize: '13px', color: `rgba(14,12,9,0.62)`, lineHeight: 1.55 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/reserver" style={{ padding: '14px 28px', borderRadius: '10px', background: OR, color: NOIR, fontFamily: 'Bebas Neue, sans-serif', fontSize: '16px', letterSpacing: '0.08em', textDecoration: 'none', display: 'inline-block', fontWeight: 700 }}>
            Réserver un RDV
          </a>
          <button onClick={onNouvelle} style={{ padding: '14px 28px', borderRadius: '10px', background: 'transparent', border: `1px solid rgba(184,146,42,0.28)`, color: `rgba(14,12,9,0.65)`, fontFamily: 'Bebas Neue, sans-serif', fontSize: '16px', letterSpacing: '0.08em', cursor: 'pointer' }}>
            Acheter une autre carte
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Page principale ─────────────────────────────────────────
export default function CarteCadeau() {
  const [montant, setMontant]             = useState(50)
  const [montantCustom, setMontantCustom] = useState('')
  const [useCustom, setUseCustom]         = useState(false)
  const [form, setForm]                   = useState({ nomAcheteur: '', courrielAcheteur: '', nomDestinataire: '', message: '' })
  const [livraison, setLivraison]         = useState('courriel')
  const [paiement, setPaiement]           = useState('stripe')
  const [etape, setEtape]                 = useState('formulaire')
  const [codeGenere, setCodeGenere]       = useState('')
  const [loading, setLoading]             = useState(false)
  const [errors, setErrors]               = useState({})

  const montantEffectif = useCustom ? (parseFloat(montantCustom) || 0) : montant

  function setField(k, v) {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: null }))
  }

  function valider() {
    const errs = {}
    if (!form.nomAcheteur.trim()) errs.nomAcheteur = `Champ requis`
    if (!form.courrielAcheteur.trim() || !form.courrielAcheteur.includes('@')) errs.courrielAcheteur = `Courriel invalide`
    if (!form.nomDestinataire.trim()) errs.nomDestinataire = `Champ requis`
    if (useCustom && (montantEffectif < 20 || montantEffectif > 500)) errs.montant = `Montant entre 20$ et 500$`
    if (!useCustom && !montant) errs.montant = `Choisissez un montant`
    return errs
  }

  async function handleAcheter() {
    const errs = valider()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)

    // Si paiement au salon, générer le code directement
    if (paiement === 'salon') {
      setTimeout(() => {
        setCodeGenere(genCode())
        setEtape('confirmation')
        setLoading(false)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 1200)
      return
    }

    // Si paiement Stripe, créer une session de checkout
    try {
      const result = await createCheckoutSession({
        montant: montantEffectif * 100,
        description: `Carte cadeau Kadio ${montantEffectif}$ pour ${form.nomDestinataire}`,
        clientEmail: form.courrielAcheteur,
        successUrl: `${window.location.origin}/public/carte-cadeau?success=true&code=${encodeURIComponent(genCode())}`,
        cancelUrl: `${window.location.origin}/public/carte-cadeau`
      })

      if (result?.url) {
        // Rediriger vers Stripe Checkout
        window.location.href = result.url
      } else if (result?.ok) {
        // Mode dev: générer le code
        setCodeGenere(genCode())
        setEtape('confirmation')
        setLoading(false)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        setErrors({ general: result?.message || 'Erreur lors du paiement' })
        setLoading(false)
      }
    } catch (err) {
      setErrors({ general: err.message || 'Une erreur est survenue' })
      setLoading(false)
    }
  }

  function resetForm() {
    setEtape('formulaire')
    setForm({ nomAcheteur: '', courrielAcheteur: '', nomDestinataire: '', message: '' })
    setMontant(50)
    setUseCustom(false)
    setMontantCustom('')
    setErrors({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const input = (err) => ({
    width: '100%', boxSizing: 'border-box',
    background: '#0d0a08',
    border: `1px solid ${err ? '#ef4444' : 'rgba(14,12,9,0.08)'}`,
    borderRadius: '8px', padding: '12px 16px',
    color: NOIR, fontSize: '15px', fontFamily: 'DM Sans, sans-serif', outline: 'none',
  })

  const labelStyle = { display: 'block', fontSize: '12px', color: `rgba(14,12,9,0.45)`, letterSpacing: '0.08em', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }

  if (etape === 'confirmation') {
    return <ConfirmationPage code={codeGenere} form={form} montant={montantEffectif} livraison={livraison} onNouvelle={resetForm} />
  }

  return (
    <div style={{ background: CREME, minHeight: '100vh', fontFamily: 'DM Sans, sans-serif', paddingBottom: '100px' }}>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px 64px', textAlign: 'center', background: `linear-gradient(180deg, #1A1611 0%, ${NOIR} 100%)` }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: `rgba(14,12,9,0.08)`, border: `1px solid rgba(184,146,42,0.28)`, borderRadius: '100px', padding: '6px 18px', marginBottom: '28px' }}>
          <span style={{ fontSize: '16px' }}>🎁</span>
          <span style={{ fontSize: '11px', color: OR, letterSpacing: '0.14em', fontWeight: 600 }}>OFFREZ L'EXPÉRIENCE KADIO</span>
        </div>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(48px, 10vw, 88px)', color: NOIR, letterSpacing: '0.1em', lineHeight: 1, marginBottom: '20px' }}>
          CARTES <span style={{ color: OR }}>CADEAUX</span>
        </h1>
        <p style={{ fontSize: 'clamp(16px, 3vw, 20px)', color: `rgba(14,12,9,0.58)`, maxWidth: '520px', margin: '0 auto 10px', lineHeight: 1.65 }}>
          {`Offrez à vos proches l'expérience d'un salon premium à Longueuil.`}
        </p>
        <p style={{ fontSize: '14px', color: `rgba(14,12,9,0.38)`, maxWidth: '400px', margin: '0 auto' }}>
          {`Utilisable pour tous les services — coiffure, barbier & esthétique.`}
        </p>
      </section>

      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 16px 96px' }}>

        {/* ── GRILLE: FORMULAIRE + PREVIEW ───────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px', alignItems: 'start' }}>

          {/* ── COLONNE GAUCHE: Formulaire ── */}
          <div>

            {/* MONTANT */}
            <div style={{ background: CARD, border: `1px solid rgba(184,146,42,0.14)`, borderRadius: '16px', padding: '28px', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: NOIR, letterSpacing: '0.1em', marginBottom: '20px' }}>
                1. CHOISISSEZ LE MONTANT
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '14px' }}>
                {MONTANTS.map(m => {
                  const actif = !useCustom && montant === m
                  return (
                    <button key={m}
                      onClick={() => { setMontant(m); setUseCustom(false); setErrors(e => ({ ...e, montant: null })) }}
                      style={{
                        padding: '18px 8px', borderRadius: '10px',
                        border: `2px solid ${actif ? OR : 'rgba(184,146,42,0.18)'}`,
                        background: actif ? `rgba(184,146,42,0.11)` : `rgba(255,255,255,0.02)`,
                        color: actif ? OR : `rgba(14,12,9,0.65)`,
                        fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', letterSpacing: '0.04em',
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}>
                      {m}$
                    </button>
                  )
                })}
              </div>

              <button onClick={() => { setUseCustom(true); setErrors(e => ({ ...e, montant: null })) }}
                style={{
                  width: '100%', padding: '12px', borderRadius: '8px',
                  border: `1px dashed ${useCustom ? OR : 'rgba(184,146,42,0.22)'}`,
                  background: useCustom ? `rgba(184,146,42,0.07)` : 'transparent',
                  color: useCustom ? OR : `rgba(14,12,9,0.45)`,
                  fontFamily: 'DM Sans, sans-serif', fontSize: '14px', cursor: 'pointer',
                  marginBottom: useCustom ? '12px' : 0,
                }}>
                + Montant personnalisé (20$ – 500$)
              </button>

              {useCustom && (
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: OR, fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', pointerEvents: 'none' }}>$</span>
                  <input type="number" min={20} max={500} placeholder="Ex. 75"
                    value={montantCustom}
                    onChange={e => { setMontantCustom(e.target.value); setErrors(er => ({ ...er, montant: null })) }}
                    style={{ ...input(errors.montant), paddingLeft: '34px' }} />
                </div>
              )}
              {errors.montant && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px', fontFamily: 'DM Sans, sans-serif' }}>{errors.montant}</p>}
            </div>

            {/* FORMULAIRE ACHAT */}
            <div style={{ background: CARD, border: `1px solid rgba(184,146,42,0.14)`, borderRadius: '16px', padding: '28px', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: NOIR, letterSpacing: '0.1em', marginBottom: '20px' }}>
                2. VOS INFORMATIONS
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>VOTRE NOM *</label>
                  <input placeholder="Jean Dupont" value={form.nomAcheteur} onChange={e => setField('nomAcheteur', e.target.value)} style={input(errors.nomAcheteur)} />
                  {errors.nomAcheteur && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.nomAcheteur}</p>}
                </div>
                <div>
                  <label style={labelStyle}>VOTRE COURRIEL *</label>
                  <input type="email" placeholder="jean@exemple.com" value={form.courrielAcheteur} onChange={e => setField('courrielAcheteur', e.target.value)} style={input(errors.courrielAcheteur)} />
                  {errors.courrielAcheteur && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.courrielAcheteur}</p>}
                </div>
                <div>
                  <label style={labelStyle}>NOM DU DESTINATAIRE *</label>
                  <input placeholder="Marie Tremblay" value={form.nomDestinataire} onChange={e => setField('nomDestinataire', e.target.value)} style={input(errors.nomDestinataire)} />
                  {errors.nomDestinataire && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.nomDestinataire}</p>}
                </div>
                <div>
                  <label style={labelStyle}>
                    MESSAGE PERSONNEL <span style={{ color: `rgba(14,12,9,0.28)` }}>(optionnel)</span>
                  </label>
                  <textarea
                    placeholder={`Joyeux anniversaire ! Profite d'une belle journée chez Kadio Coiffure à Longueuil 💛`}
                    value={form.message}
                    onChange={e => setField('message', e.target.value)}
                    rows={3}
                    style={{ ...input(false), resize: 'vertical', minHeight: '80px' }}
                  />
                  <p style={{ textAlign: 'right', fontSize: '11px', color: `rgba(14,12,9,0.28)`, marginTop: '4px' }}>{form.message.length}/160</p>
                </div>
              </div>
            </div>

            {/* MODE DE LIVRAISON */}
            <div style={{ background: CARD, border: `1px solid rgba(184,146,42,0.14)`, borderRadius: '16px', padding: '28px', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: NOIR, letterSpacing: '0.1em', marginBottom: '20px' }}>
                3. MODE DE LIVRAISON
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { key: 'courriel', icon: '📧', titre: `Par courriel`, desc: `Envoyée à l'adresse courriel du destinataire — instantané` },
                  { key: 'sms', icon: '📱', titre: `Par SMS`, desc: `Envoyée directement sur le téléphone du destinataire` },
                  { key: 'salon', icon: '🖨️', titre: `Impression au salon`, desc: `Récupérez la carte imprimée lors de votre prochaine visite` },
                ].map(({ key, icon, titre, desc }) => {
                  const actif = livraison === key
                  return (
                    <button key={key} onClick={() => setLivraison(key)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '16px',
                        padding: '16px', borderRadius: '10px',
                        border: `2px solid ${actif ? OR : 'rgba(184,146,42,0.14)'}`,
                        background: actif ? `rgba(184,146,42,0.07)` : `rgba(255,255,255,0.02)`,
                        cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.15s',
                      }}>
                      <span style={{ fontSize: '24px', flexShrink: 0 }}>{icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, color: actif ? OR : CREME, fontFamily: 'DM Sans, sans-serif', fontSize: '15px' }}>{titre}</div>
                        <div style={{ fontSize: '12px', color: `rgba(14,12,9,0.45)`, fontFamily: 'DM Sans, sans-serif', marginTop: '2px' }}>{desc}</div>
                      </div>
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${actif ? OR : 'rgba(184,146,42,0.28)'}`, background: actif ? OR : 'transparent', flexShrink: 0 }} />
                    </button>
                  )
                })}
              </div>
            </div>

            {/* PAIEMENT */}
            <div style={{ background: CARD, border: `1px solid rgba(184,146,42,0.14)`, borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: NOIR, letterSpacing: '0.1em', marginBottom: '20px' }}>
                4. PAIEMENT
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                {[
                  { key: 'stripe', icon: '💳', titre: `En ligne`, desc: `Stripe — Visa, MC, Amex` },
                  { key: 'salon', icon: '🏪', titre: `Au salon`, desc: `Comptant, Interac, terminal` },
                ].map(({ key, icon, titre, desc }) => {
                  const actif = paiement === key
                  return (
                    <button key={key} onClick={() => setPaiement(key)}
                      style={{
                        padding: '18px 12px', borderRadius: '10px',
                        border: `2px solid ${actif ? OR : 'rgba(184,146,42,0.14)'}`,
                        background: actif ? `rgba(184,146,42,0.07)` : `rgba(255,255,255,0.02)`,
                        cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s',
                      }}>
                      <div style={{ fontSize: '26px', marginBottom: '8px' }}>{icon}</div>
                      <div style={{ fontWeight: 600, color: actif ? OR : CREME, fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }}>{titre}</div>
                      <div style={{ fontSize: '11px', color: `rgba(14,12,9,0.4)`, fontFamily: 'DM Sans, sans-serif', marginTop: '3px' }}>{desc}</div>
                    </button>
                  )
                })}
              </div>

              {paiement === 'stripe' ? (
                <div style={{ background: `rgba(184,146,42,0.06)`, border: `1px solid rgba(184,146,42,0.18)`, borderRadius: '8px', padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>🔒</span>
                  <div>
                    <div style={{ fontSize: '13px', color: NOIR, fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>Paiement sécurisé via Stripe</div>
                    <div style={{ fontSize: '11px', color: `rgba(14,12,9,0.45)`, fontFamily: 'DM Sans, sans-serif', marginTop: '3px', lineHeight: 1.5 }}>
                      {`Redirigé vers Stripe après confirmation — cryptage SSL 256 bits`}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ background: `rgba(184,146,42,0.06)`, border: `1px solid rgba(184,146,42,0.18)`, borderRadius: '8px', padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>📞</span>
                  <div>
                    <div style={{ fontSize: '13px', color: NOIR, fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>Payez à votre prochaine visite</div>
                    <div style={{ fontSize: '11px', color: `rgba(14,12,9,0.45)`, fontFamily: 'DM Sans, sans-serif', marginTop: '3px', lineHeight: 1.5 }}>
                      {`Votre demande sera réservée — confirmez par téléphone au 514-919-5970`}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* BOUTON ACHETER */}
            <button onClick={handleAcheter} disabled={loading}
              style={{
                width: '100%', padding: '20px', borderRadius: '12px',
                background: loading ? `rgba(184,146,42,0.4)` : OR,
                color: NOIR, fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px',
                letterSpacing: '0.1em', border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                transition: 'opacity 0.2s',
              }}>
              {loading
                ? `⏳ TRAITEMENT EN COURS...`
                : `🎁 ACHETER LA CARTE — ${montantEffectif > 0 ? montantEffectif + '$' : '??$'}`}
            </button>
          </div>

          {/* ── COLONNE DROITE: Aperçu sticky ── */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: NOIR, letterSpacing: '0.1em', marginBottom: '20px', textAlign: 'center' }}>
              APERÇU EN TEMPS RÉEL
            </h2>

            <GiftCardPreview
              montant={montantEffectif || null}
              nomDestinataire={form.nomDestinataire}
              message={form.message}
            />

            {/* Récapitulatif */}
            <div style={{ marginTop: '20px', background: CARD, border: `1px solid rgba(184,146,42,0.12)`, borderRadius: '14px', padding: '22px' }}>
              <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '16px', color: OR, letterSpacing: '0.1em', marginBottom: '16px' }}>RÉCAPITULATIF</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: `Montant`,       val: montantEffectif > 0 ? `${montantEffectif}$` : `—` },
                  { label: `Acheteur`,      val: form.nomAcheteur || `—` },
                  { label: `Destinataire`,  val: form.nomDestinataire || `—` },
                  { label: `Livraison`,     val: livraison === 'courriel' ? `Par courriel` : livraison === 'sms' ? `Par SMS` : `Impression salon` },
                  { label: `Paiement`,      val: paiement === 'stripe' ? `En ligne (Stripe)` : `Au salon` },
                ].map(({ label, val }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '12px', color: `rgba(14,12,9,0.38)`, fontFamily: 'DM Sans, sans-serif', flexShrink: 0 }}>{label}</span>
                    <span style={{ fontSize: '13px', color: val === `—` ? `rgba(14,12,9,0.28)` : CREME, fontFamily: 'DM Sans, sans-serif', fontWeight: 500, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>{val}</span>
                  </div>
                ))}
                <div style={{ borderTop: `1px solid rgba(14,12,9,0.08)`, paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: NOIR, fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>Total</span>
                  <span style={{ fontSize: '20px', color: OR, fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.05em' }}>
                    {montantEffectif > 0 ? `${montantEffectif}$` : `—`}
                  </span>
                </div>
              </div>
            </div>

            {/* Badge code */}
            <div style={{ marginTop: '16px', background: `rgba(184,146,42,0.06)`, border: `1px dashed rgba(184,146,42,0.22)`, borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: `rgba(14,12,9,0.35)`, letterSpacing: '0.12em', marginBottom: '6px' }}>CODE GÉNÉRÉ AUTOMATIQUEMENT</div>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', color: `rgba(184,146,42,0.5)`, letterSpacing: '0.15em' }}>KADIO-GIFT-XXXX</div>
            </div>
          </div>
        </div>

        {/* ── COMMENT ÇA MARCHE ──────────────────────────── */}
        <section style={{ marginTop: '96px' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(32px, 6vw, 56px)', color: NOIR, letterSpacing: '0.1em', marginBottom: '14px' }}>
              COMMENT ÇA <span style={{ color: OR }}>MARCHE</span>
            </h2>
            <p style={{ color: `rgba(14,12,9,0.45)`, fontSize: '16px', fontFamily: 'DM Sans, sans-serif' }}>Simple, rapide et élégant</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '20px' }}>
            {ETAPES.map((e, i) => (
              <div key={i} style={{ background: CARD, border: `1px solid rgba(184,146,42,0.11)`, borderRadius: '16px', padding: '28px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '68px', color: `rgba(184,146,42,0.06)`, position: 'absolute', top: '-12px', right: '14px', lineHeight: 1, userSelect: 'none' }}>{e.num}</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: `rgba(14,12,9,0.08)`, border: `1px solid rgba(184,146,42,0.28)`, marginBottom: '16px' }}>
                  <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '16px', color: OR }}>{parseInt(e.num)}</span>
                </div>
                <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', color: NOIR, letterSpacing: '0.06em', marginBottom: '10px', lineHeight: 1.2 }}>{e.titre}</h3>
                <p style={{ fontSize: '13px', color: `rgba(14,12,9,0.52)`, lineHeight: 1.65, fontFamily: 'DM Sans, sans-serif' }}>{e.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── RÉSEAU KADIO ───────────────────────────────── */}
        <section style={{ marginTop: '80px', background: `linear-gradient(135deg, #1A1611 0%, #0d0a08 100%)`, border: `1px solid rgba(184,146,42,0.18)`, borderRadius: '24px', padding: '52px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: '36px', marginBottom: '20px' }}>🌐</div>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(26px, 5vw, 46px)', color: NOIR, letterSpacing: '0.1em', marginBottom: '18px' }}>
            UTILISABLE DANS TOUT LE <span style={{ color: OR }}>RÉSEAU KADIO</span>
          </h2>
          <p style={{ fontSize: '16px', color: `rgba(14,12,9,0.55)`, maxWidth: '580px', margin: '0 auto 32px', lineHeight: 1.75, fontFamily: 'DM Sans, sans-serif' }}>
            {`Votre carte cadeau est valide pour tous les services offerts au salon Kadio Coiffure & Esthétique à Longueuil, Québec. Coiffure, barbier, tresses, locs, soins — sans restriction de service.`}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginBottom: '40px' }}>
            {SERVICES_TAGS.map(s => (
              <span key={s} style={{ background: `rgba(184,146,42,0.09)`, border: `1px solid rgba(184,146,42,0.22)`, borderRadius: '100px', padding: '8px 18px', fontSize: '13px', color: OR, fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
                {s}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '40px' }}>
            {[
              { icon: `📍`, val: `Longueuil, QC`,   label: `Adresse` },
              { icon: `⏰`, val: `Valide 1 an`,      label: `Durée de validité` },
              { icon: `🔄`, val: `Non remboursable`, label: `Politique` },
              { icon: `📞`, val: `514-919-5970`,     label: `Assistance` },
            ].map(({ icon, val, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '16px', color: OR, letterSpacing: '0.06em' }}>{val}</div>
                <div style={{ fontSize: '11px', color: `rgba(14,12,9,0.38)`, fontFamily: 'DM Sans, sans-serif', marginTop: '3px' }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
