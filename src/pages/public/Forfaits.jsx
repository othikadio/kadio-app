import { useState, useEffect } from 'react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { OR, CREME, NOIR, CARD, MUTED } from '@/lib/utils'
import { usePlans, useServicesPublic } from '@/hooks'

const FILTRE_TABS = ['Tous', 'Tresses', 'Locs', 'Barbier', 'Enfants']

const PASSES = [
  { nom: 'Duo', qty: 2, remise: 8, desc: '2 passes prépayées' },
  { nom: 'Trio', qty: 3, remise: 8, desc: '3 passes prépayées' },
  { nom: 'Quad', qty: 4, remise: 8, desc: '4 passes prépayées' },
  { nom: 'Prestige', qty: 5, remise: 12, desc: '5 passes ou plus' },
]

const PAIEMENTS = [
  { nom: 'Stripe', logo: '⚡', desc: 'Carte crédit/débit · En ligne et en personne' },
  { nom: 'Cash', logo: '$', desc: 'Argent comptant accepté' },
  { nom: 'Interac', logo: '⇄', desc: 'Virement Interac instantané' },
]

const FAQ_ITEMS = [
  {
    q: `Puis-je annuler mon abonnement ?`,
    r: `Oui, tu peux annuler ton abonnement à tout moment avant le prochain cycle de facturation. Aucuns frais d'annulation ne sont appliqués.`,
  },
  {
    q: `Que se passe-t-il si je rate mon rendez-vous ?`,
    r: `Des frais de 50% du prix du service sont retenus en cas de no-show ou d'annulation moins de 2h avant le rendez-vous. Cela protège le temps de nos partenaires.`,
  },
  {
    q: `Y a-t-il des frais d'inscription ?`,
    r: `Aucun frais d'inscription, ni pour les clients, ni pour les partenaires. La création de compte est entièrement gratuite.`,
  },
  {
    q: `Comment fonctionne le portefeuille Kadio ?`,
    r: `Tu accumules des crédits Kadio via le programme de parrainage. Ces crédits sont directement applicables sur ton prochain service ou abonnement.`,
  },
  {
    q: `Puis-je changer de coiffeuse ?`,
    r: `Oui, à chaque réservation tu es libre de choisir n'importe quel partenaire certifié disponible. Ton abonnement n'est pas lié à un partenaire spécifique.`,
  },
]

const catColor = (cat) => ({
  Tresses: '#7c3aed',
  Locs: '#059669',
  Barbier: '#0284c7',
  Enfants: '#d97706',
  Soins: '#db2777',
  Tissage: '#7c3aed',
  Tous: OR,
}[cat] || OR)

const groupBy = (arr, key) => arr.reduce((acc, item) => {
  const g = item[key]
  if (!acc[g]) acc[g] = []
  acc[g].push(item)
  return acc
}, {})

export default function Forfaits() {
  const navigate = useNavigate()
  const { data: plans, loading: loadingPlans } = usePlans()
  const { data: services, loading: loadingServices } = useServicesPublic()
  const [forfaits, setForfaits] = useState(plans || [])
  const [servicesList, setServicesList] = useState(services || [])
  const [filtre, setFiltre] = useState('Tous')
  const [faqOpen, setFaqOpen] = useState(null)
  const [selectedService, setSelectedService] = useState((services || [])[0]?.nom || '')
  const [selectedPasse, setSelectedPasse] = useState(0)

  // Sync fetched data
  React.useEffect(() => {
    if (plans) setForfaits(plans)
  }, [plans])

  React.useEffect(() => {
    if (services) {
      setServicesList(services)
      if (selectedService === '') setSelectedService(services[0]?.nom || '')
    }
  }, [services])

  if (loadingPlans || loadingServices) return <div style={{ padding: '24px', paddingBottom: '100px', color: NOIR, background: CREME, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ textAlign: 'center', color: MUTED }}>Chargement...</div>
  </div>

  const forfaitsFiltres = filtre === 'Tous'
    ? forfaits
    : forfaits.filter(f => f.cat === filtre)

  const serviceObj = servicesList.find(s => s.nom === selectedService)
  const passe = PASSES[selectedPasse]
  const prixBase = serviceObj?.salon || 0
  const prixRemise = passe ? Math.round(prixBase * (1 - passe.remise / 100)) : prixBase
  const total = passe ? prixRemise * passe.qty : prixBase

  const servicesByGroup = groupBy(servicesList, 'cat')

  return (
    <div style={{ background: CREME, color: NOIR, minHeight: '100vh', fontFamily: `'Inter', sans-serif` }}>

      {/* ── HERO ─── */}
      <section style={{
        padding: '100px 24px 72px', textAlign: 'center',
        background: `radial-gradient(ellipse at 50% 0%, rgba(184,146,42,0.09) 0%, transparent 60%)`,
        borderBottom: `1px solid rgba(184,146,42,0.12)`,
      }}>
        <div style={{
          display: 'inline-block', background: 'rgba(14,12,9,0.08)', color: OR,
          borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 600,
          letterSpacing: 2, marginBottom: 20,
        }}>
          TARIFICATION
        </div>
        <h1 style={{
          fontFamily: `'Bebas Neue', sans-serif`,
          fontSize: 'clamp(40px, 8vw, 80px)',
          color: NOIR, margin: '0 0 16px', lineHeight: 0.95, letterSpacing: 1,
        }}>
          Arrêtez de payer plein prix à chaque visite.
        </h1>
        <p style={{ color: 'rgba(14,12,9,0.65)', fontSize: 16, maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
          Nos membres économisent en moyenne <strong style={{ color: OR }}>340 $ par an</strong>. Prix fixes, zéro mauvaise surprise.
        </p>
      </section>

      {/* ── FORFAITS ─── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 'clamp(28px,5vw,44px)', color: NOIR, margin: '0 0 24px' }}>
            Abonnements mensuels
          </h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {FILTRE_TABS.map(f => (
              <button
                key={f}
                onClick={() => setFiltre(f)}
                style={{
                  padding: '8px 20px', borderRadius: 20,
                  border: `1.5px solid ${filtre === f ? OR : 'rgba(14,12,9,0.08)'}`,
                  background: filtre === f ? OR : 'transparent',
                  color: filtre === f ? NOIR : CREME,
                  fontWeight: 600, fontSize: 13, cursor: 'pointer',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {forfaitsFiltres.map(f => (
            <div key={f.id} style={{
              background: CARD, borderRadius: 16, padding: '28px 24px',
              border: f.populaire ? `2px solid ${OR}` : `1px solid rgba(14,12,9,0.08)`,
              position: 'relative', display: 'flex', flexDirection: 'column', gap: 16,
            }}>
              {f.populaire && (
                <div style={{ position: 'absolute', top: -12, right: 20, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                  <div style={{ background: '#ef4444', color: '#fff', borderRadius: 10, padding: '3px 10px', fontSize: 11, fontWeight: 700, letterSpacing: 1, whiteSpace: 'nowrap' }}>
                    MEILLEUR CHOIX
                  </div>
                </div>
              )}
              {/* Abonnés ce mois */}
              <div style={{ fontSize: 11, color: OR, fontWeight: 600, marginBottom: 4 }}>
                ⚡ {f.populaire ? 23 : f.cat === 'Barbier' ? 8 : 14} personnes abonnées ce mois
              </div>
              <div>
                <div style={{
                  display: 'inline-block', background: `${catColor(f.cat)}22`,
                  color: catColor(f.cat), borderRadius: 8, padding: '2px 10px',
                  fontSize: 11, fontWeight: 600, marginBottom: 10,
                }}>
                  {f.cat}
                </div>
                <h3 style={{ color: NOIR, fontWeight: 700, fontSize: 18, margin: '0 0 4px' }}>{f.nom}</h3>
                <p style={{ color: 'rgba(14,12,9,0.55)', fontSize: 13, margin: 0 }}>{f.desc}</p>
                {f.populaire && (
                  <p style={{ color: MUTED, fontSize: 12, margin: '6px 0 0', fontStyle: 'italic' }}>
                    80% de nos membres choisissent ce forfait
                  </p>
                )}
              </div>
              <div>
                <div style={{ color: MUTED, fontSize: 13, textDecoration: 'line-through', marginBottom: 4 }}>
                  {Math.round(f.prix * 1.35)}$ sans abonnement
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 52, color: OR, lineHeight: 1 }}>
                    {f.prix}$
                  </span>
                  <span style={{ color: 'rgba(14,12,9,0.5)', fontSize: 14 }}>/mois</span>
                </div>
                <div style={{ color: '#22c55e', fontSize: 12, fontWeight: 600, marginTop: 4 }}>
                  Soit {Math.round(f.prix / (f.cat === 'Barbier' ? 4 : 2))}$ par visite seulement
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                {f.inclus.map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{ color: OR, fontSize: 14, flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span style={{ color: 'rgba(14,12,9,0.75)', fontSize: 13 }}>{item}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('/connexion')}
                style={{
                  width: '100%', padding: '11px 0',
                  background: f.populaire ? OR : 'transparent',
                  color: f.populaire ? NOIR : OR,
                  border: `1.5px solid ${OR}`, borderRadius: 8,
                  fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 'auto',
                }}
              >
                Commencer à économiser →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── CALCULATEUR PASSES ─── */}
      <section style={{ background: CARD, padding: '72px 24px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ color: OR, fontSize: 12, fontWeight: 600, letterSpacing: 2, marginBottom: 12 }}>ÉCONOMIES</div>
            <h2 style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 'clamp(28px,5vw,40px)', color: NOIR, margin: 0 }}>
              Passes prépayées
            </h2>
            <p style={{ color: 'rgba(14,12,9,0.6)', marginTop: 10, fontSize: 14 }}>
              {`Achète plusieurs passes à l'avance et économise jusqu'à 12%`}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
            {PASSES.map((p, idx) => (
              <button
                key={p.nom}
                onClick={() => setSelectedPasse(idx)}
                style={{
                  padding: '14px 8px', borderRadius: 12, textAlign: 'center',
                  border: `1.5px solid ${selectedPasse === idx ? OR : 'rgba(184,146,42,0.25)'}`,
                  background: selectedPasse === idx ? 'rgba(14,12,9,0.08)' : 'transparent',
                  cursor: 'pointer',
                }}
              >
                <div style={{ color: OR, fontFamily: `'Bebas Neue', sans-serif`, fontSize: 22 }}>{p.nom}</div>
                <div style={{ color: NOIR, fontSize: 12, marginTop: 2 }}>{p.desc}</div>
                <div style={{
                  background: OR, color: NOIR, borderRadius: 8, padding: '2px 6px',
                  fontSize: 11, fontWeight: 700, marginTop: 6, display: 'inline-block',
                }}>
                  -{p.remise}%
                </div>
              </button>
            ))}
          </div>

          <div style={{ background: CREME, borderRadius: 14, padding: '28px 24px', border: `1px solid rgba(14,12,9,0.08)` }}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: 'rgba(14,12,9,0.7)', fontSize: 13, display: 'block', marginBottom: 8 }}>
                Choisir un service
              </label>
              <select
                value={selectedService}
                onChange={e => setSelectedService(e.target.value)}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 8,
                  background: CARD, border: `1px solid rgba(14,12,9,0.08)`,
                  color: NOIR, fontSize: 14, outline: 'none',
                }}
              >
                {(servicesList || []).map(s => (
                  <option key={s.nom} value={s.nom}>{s.nom} — {s.salon}$ (salon)</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, textAlign: 'center' }}>
              <div>
                <div style={{ color: 'rgba(14,12,9,0.55)', fontSize: 12, marginBottom: 4 }}>Prix de base</div>
                <div style={{ color: NOIR, fontSize: 22, fontWeight: 700 }}>{prixBase}$</div>
              </div>
              <div>
                <div style={{ color: 'rgba(14,12,9,0.55)', fontSize: 12, marginBottom: 4 }}>Prix par passe</div>
                <div style={{ color: OR, fontSize: 22, fontWeight: 700 }}>{prixRemise}$</div>
                <div style={{ color: '#22c55e', fontSize: 11 }}>-{passe?.remise}%</div>
              </div>
              <div>
                <div style={{ color: 'rgba(14,12,9,0.55)', fontSize: 12, marginBottom: 4 }}>Total ({passe?.qty} passes)</div>
                <div style={{ color: OR, fontSize: 28, fontWeight: 700, fontFamily: `'Bebas Neue', sans-serif` }}>{total}$</div>
                <div style={{ color: '#22c55e', fontSize: 11 }}>Économie : {(prixBase * passe?.qty) - total}$</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TABLEAU TARIFS À LA CARTE ─── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ color: OR, fontSize: 12, fontWeight: 600, letterSpacing: 2, marginBottom: 12 }}>TRANSPARENCE</div>
          <h2 style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 'clamp(28px,5vw,40px)', color: NOIR, margin: 0 }}>
            Tarifs à la carte
          </h2>
          <p style={{ color: 'rgba(14,12,9,0.6)', marginTop: 10, fontSize: 14 }}>
            Tous les prix affichés incluent les taxes
          </p>
        </div>
        <div style={{ overflowX: 'auto', borderRadius: 12, border: `1px solid rgba(14,12,9,0.08)` }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 580 }}>
            <thead>
              <tr style={{ background: CARD }}>
                <th style={{ padding: '14px 20px', textAlign: 'left', color: OR, fontSize: 13, fontWeight: 600, borderBottom: `1px solid rgba(14,12,9,0.08)` }}>Service</th>
                <th style={{ padding: '14px 16px', textAlign: 'center', color: OR, fontSize: 13, fontWeight: 600, borderBottom: `1px solid rgba(14,12,9,0.08)` }}>Salon</th>
                <th style={{ padding: '14px 16px', textAlign: 'center', color: OR, fontSize: 13, fontWeight: 600, borderBottom: `1px solid rgba(14,12,9,0.08)` }}>Domicile</th>
                <th style={{ padding: '14px 16px', textAlign: 'center', color: OR, fontSize: 13, fontWeight: 600, borderBottom: `1px solid rgba(14,12,9,0.08)` }}>Déplacement</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(servicesByGroup).map(([cat, services]) => (
                <>
                  <tr key={`cat-${cat}`}>
                    <td colSpan={4} style={{
                      padding: '10px 20px', background: 'rgba(184,146,42,0.07)',
                      color: catColor(cat), fontWeight: 700, fontSize: 12,
                      letterSpacing: 1.5, position: 'sticky', left: 0,
                    }}>
                      {cat.toUpperCase()}
                    </td>
                  </tr>
                  {services.map((s, i) => (
                    <tr key={s.nom} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                      <td style={{ padding: '12px 20px', color: NOIR, fontSize: 14, borderBottom: `1px solid rgba(184,146,42,0.07)` }}>
                        {s.nom}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', color: NOIR, fontSize: 14, fontWeight: 500, borderBottom: `1px solid rgba(184,146,42,0.07)` }}>
                        {s.salon}$
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', color: NOIR, fontSize: 14, fontWeight: 500, borderBottom: `1px solid rgba(184,146,42,0.07)` }}>
                        {s.domicile}$
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', color: NOIR, fontSize: 14, fontWeight: 500, borderBottom: `1px solid rgba(184,146,42,0.07)` }}>
                        {s.deplacement}$
                      </td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── MODES DE PAIEMENT ─── */}
      <section style={{ background: CARD, padding: '64px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 'clamp(26px,4vw,38px)', color: NOIR, margin: '0 0 36px' }}>
            Modes de paiement acceptés
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            {PAIEMENTS.map(p => (
              <div key={p.nom} style={{
                background: CREME, borderRadius: 12, padding: '20px',
                border: `1px solid rgba(184,146,42,0.12)`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'rgba(14,12,9,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, color: OR,
                }}>
                  {p.logo}
                </div>
                <div style={{ color: NOIR, fontWeight: 700, fontSize: 15 }}>{p.nom}</div>
                <div style={{ color: 'rgba(14,12,9,0.55)', fontSize: 12, textAlign: 'center' }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOMO ─── */}
      <section style={{ background: 'rgba(239,68,68,0.06)', borderTop: '1px solid rgba(239,68,68,0.15)', borderBottom: '1px solid rgba(239,68,68,0.15)', padding: '56px 24px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>💸</div>
          <h2 style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 'clamp(28px,5vw,44px)', color: NOIR, margin: '0 0 16px' }}>
            Sans abonnement, vous perdez de l'argent chaque mois.
          </h2>
          <p style={{ color: 'rgba(14,12,9,0.65)', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
            Sans abonnement, vous payez jusqu'à <strong style={{ color: '#f87171' }}>35% de plus</strong> par visite.<br />
            En 12 mois, c'est <strong style={{ color: OR }}>340$ que vous auriez pu garder dans votre poche.</strong>
          </p>
          <button
            onClick={() => {}}
            style={{ padding: '14px 40px', background: OR, color: NOIR, border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
          >
            Commencer à économiser →
          </button>
          <p style={{ color: MUTED, fontSize: 12, marginTop: 12 }}>🔒 Résiliable à tout moment · Aucun engagement</p>
        </div>
      </section>

      {/* ── FAQ ─── */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '72px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ color: OR, fontSize: 12, fontWeight: 600, letterSpacing: 2, marginBottom: 12 }}>FAQ</div>
          <h2 style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 'clamp(28px,5vw,40px)', color: NOIR, margin: 0 }}>
            Questions fréquentes
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {FAQ_ITEMS.map((item, idx) => (
            <div key={idx} style={{
              background: CARD, borderRadius: 12, overflow: 'hidden',
              border: `1px solid ${faqOpen === idx ? OR : 'rgba(14,12,9,0.08)'}`,
            }}>
              <button
                onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                style={{
                  width: '100%', padding: '18px 20px', background: 'none', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  cursor: 'pointer', textAlign: 'left',
                }}
              >
                <span style={{ color: NOIR, fontWeight: 600, fontSize: 15 }}>{item.q}</span>
                <span style={{ color: OR, fontSize: 18, flexShrink: 0, marginLeft: 12 }}>
                  {faqOpen === idx ? '−' : '+'}
                </span>
              </button>
              {faqOpen === idx && (
                <div style={{ padding: '0 20px 18px', color: 'rgba(14,12,9,0.7)', fontSize: 14, lineHeight: 1.7 }}>
                  {item.r}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
