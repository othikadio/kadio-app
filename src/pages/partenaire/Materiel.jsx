import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { MOCK_MATERIEL } from '@/data/mockPartenaire'
import { usePartenaireProfil } from '@/hooks'
import { OR, CREME, NOIR, CARD, MUTED, BORDER_OR, formatMontant, formatDate, statutColor } from '@/lib/utils'
import { genNumeroCommande, simulerSMS, getStatutInfo, calculerTotal } from '@/utils/commandes'

const CAT_TABS = ['Tous', 'Mèches', 'Produits', 'Accessoires']

const HISTORIQUE_INIT = [
  {
    id: 'cmd-hist-1',
    numero: 'CMD-2026-031',
    date: '2026-03-15',
    articles: [{ nom: `Mèches knotless noires 26"`, qte: 3, prix: 18.99 }, { nom: 'Huile de coco Kadio 250ml', qte: 1, prix: 12.50 }],
    total: 69.47,
    statut: 'livree',
    numero_suivi: 'CPC-4398211-YUL',
  },
  {
    id: 'cmd-hist-2',
    numero: 'CMD-2026-018',
    date: '2026-02-28',
    articles: [{ nom: `Peigne à queue acier`, qte: 2, prix: 6.50 }, { nom: 'Élastiques invisibles x100', qte: 2, prix: 4.99 }],
    total: 22.98,
    statut: 'livree',
    numero_suivi: 'CPC-4388100-YUL',
  },
]

const CAT_ICON = { 'Mèches': '🪢', 'Produits': '🧴', 'Accessoires': '✂️' }

export default function PartenaireMateriel() {
  const { partenaire } = useAuthStore()
  const userId = partenaire?.user_id || 'usr-diane'

  const { data: profil, loading } = usePartenaireProfil(userId)

  if (loading) {
    return <div style={{ fontFamily: `'DM Sans', sans-serif`, color: NOIR, padding: '16px', textAlign: 'center' }}>Chargement...</div>
  }

  const SOLDE_INIT = profil?.portefeuille_solde || 245.50

  const [activeTab, setActiveTab]   = useState('catalogue')
  const [catFilter, setCatFilter]   = useState('Tous')
  const [panier, setPanier]         = useState({}) // { id: qty }
  const [modePaiement, setModePaiement] = useState('portefeuille')
  const [solde, setSolde]           = useState(SOLDE_INIT)
  const [commandes, setCommandes]   = useState(HISTORIQUE_INIT)
  const [confirmation, setConfirmation] = useState(null) // commande confirmée
  const [expanded, setExpanded]     = useState(null)

  const filtered = MOCK_MATERIEL.filter(m => catFilter === 'Tous' || m.cat === catFilter)
  const panierItems = MOCK_MATERIEL.filter(m => (panier[m.id] || 0) > 0)
  const panierCount = Object.values(panier).reduce((a, b) => a + b, 0)
  const panierTotal = calculerTotal(
    panierItems.map(m => ({ prix: m.prix, qte: panier[m.id] }))
  )
  const soldeSuffisant = solde >= panierTotal

  function addToCart(id) {
    setPanier(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
  }

  function changeQty(id, delta) {
    setPanier(prev => {
      const nv = (prev[id] || 0) + delta
      if (nv <= 0) { const { [id]: _, ...rest } = prev; return rest }
      return { ...prev, [id]: nv }
    })
  }

  function passerCommande() {
    const numero = genNumeroCommande()
    const today = new Date().toISOString().slice(0, 10)
    const articles = panierItems.map(m => ({ nom: m.nom, qte: panier[m.id], prix: m.prix }))
    const nouvelleCmd = {
      id: `cmd-${Date.now()}`,
      numero,
      date: today,
      articles,
      total: panierTotal,
      statut: 'en_attente',
      numero_suivi: null,
      nouvelle: true,
    }

    if (modePaiement === 'portefeuille') {
      setSolde(s => +(s - panierTotal).toFixed(2))
    }

    setCommandes(prev => [nouvelleCmd, ...prev])
    setPanier({})
    setConfirmation(nouvelleCmd)

    // SMS simulé au fournisseur
    simulerSMS('jean@beautypro.ca', `Nouvelle commande ${numero} reçue de Diane Mbaye — Total : ${formatMontant(panierTotal)}. Connectez-vous à votre espace fournisseur Kadio.`)
  }

  const TABS = [
    { key: 'catalogue', label: 'Catalogue' },
    { key: 'panier',    label: `Panier${panierCount > 0 ? ` (${panierCount})` : ''}` },
    { key: 'commandes', label: 'Commandes' },
  ]

  return (
    <div style={{ fontFamily: `'DM Sans', sans-serif`, color: NOIR, padding: '16px', paddingBottom: '100px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ fontSize: '20px', fontWeight: 700 }}>Matériel</div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: '11px', color: MUTED }}>Portefeuille</p>
          <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: OR }}>{formatMontant(solde)}</p>
        </div>
      </div>

      {/* Confirmation succès */}
      {confirmation && (
        <div style={{ background: '#0d2818', border: '1px solid #22c55e', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '24px' }}>✅</span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 4px', color: '#86efac', fontWeight: 700, fontSize: '14px' }}>Commande passée avec succès !</p>
              <p style={{ margin: '0 0 2px', color: NOIR, fontFamily: 'monospace', fontSize: '15px', fontWeight: 700 }}>{confirmation.numero}</p>
              <p style={{ margin: '0 0 8px', color: MUTED, fontSize: '12px' }}>Total : {formatMontant(confirmation.total)} · {modePaiement === 'portefeuille' ? 'Portefeuille Kadio' : 'Carte'}</p>
              <p style={{ margin: 0, color: '#86efac', fontSize: '12px' }}>SMS de confirmation envoyé au fournisseur ✓</p>
            </div>
          </div>
          <button onClick={() => setConfirmation(null)}
            style={{ marginTop: '12px', width: '100%', background: 'transparent', border: '1px solid #22c55e', borderRadius: '8px', padding: '8px', color: '#86efac', cursor: 'pointer', fontSize: '13px' }}>
            Voir mes commandes
          </button>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            style={{
              flex: 1, background: activeTab === t.key ? OR : `rgba(14,12,9,0.08)`,
              color: activeTab === t.key ? '#0E0C09' : `rgba(250,248,248,0.7)`,
              border: 'none', borderRadius: '999px', padding: '9px 6px',
              fontSize: '12px', fontWeight: 700, cursor: 'pointer',
              fontFamily: `'DM Sans', sans-serif`,
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Catalogue ── */}
      {activeTab === 'catalogue' && (
        <>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', overflowX: 'auto', paddingBottom: '4px' }}>
            {CAT_TABS.map(cat => (
              <button key={cat} onClick={() => setCatFilter(cat)}
                style={{
                  background: catFilter === cat ? OR : `rgba(14,12,9,0.08)`,
                  color: catFilter === cat ? '#0E0C09' : `rgba(250,248,248,0.7)`,
                  border: 'none', borderRadius: '999px', padding: '6px 14px',
                  fontSize: '12px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                  fontFamily: `'DM Sans', sans-serif`,
                }}>
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {filtered.map(m => {
              const qte = panier[m.id] || 0
              return (
                <div key={m.id} style={{
                  background: CARD, borderRadius: '12px', padding: '12px',
                  border: `1px solid ${qte > 0 ? OR : BORDER_OR}`,
                  display: 'flex', flexDirection: 'column', gap: '8px',
                  opacity: m.stock ? 1 : 0.55,
                }}>
                  <div style={{
                    width: '100%', aspectRatio: '1', background: `rgba(184,146,42,0.08)`,
                    borderRadius: '8px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '28px', position: 'relative',
                  }}>
                    {CAT_ICON[m.cat] || '📦'}
                    {qte > 0 && (
                      <span style={{
                        position: 'absolute', top: '4px', right: '4px',
                        background: OR, color: NOIR, borderRadius: '50%',
                        width: '20px', height: '20px', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', fontWeight: 700,
                      }}>{qte}</span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 600, lineHeight: 1.3 }}>{m.nom}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: OR }}>{formatMontant(m.prix)}</span>
                    <span style={{
                      fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '999px',
                      background: m.stock ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                      color: m.stock ? '#22c55e' : '#ef4444',
                    }}>
                      {m.stock ? 'En stock' : 'Rupture'}
                    </span>
                  </div>
                  {qte === 0 ? (
                    <button disabled={!m.stock} onClick={() => addToCart(m.id)}
                      style={{
                        background: m.stock ? OR : `rgba(14,12,9,0.08)`,
                        color: m.stock ? '#0E0C09' : `rgba(250,248,248,0.3)`,
                        border: 'none', borderRadius: '8px', padding: '8px',
                        fontSize: '12px', fontWeight: 700, cursor: m.stock ? 'pointer' : 'default',
                        fontFamily: `'DM Sans', sans-serif`,
                      }}>
                      + Ajouter
                    </button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <button onClick={() => changeQty(m.id, -1)}
                        style={{ background: `rgba(14,12,9,0.08)`, border: 'none', borderRadius: '6px', width: '28px', height: '28px', color: NOIR, fontSize: '16px', cursor: 'pointer' }}>−</button>
                      <span style={{ fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>{qte}</span>
                      <button onClick={() => changeQty(m.id, 1)}
                        style={{ background: `rgba(14,12,9,0.08)`, border: 'none', borderRadius: '6px', width: '28px', height: '28px', color: NOIR, fontSize: '16px', cursor: 'pointer' }}>+</button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {panierCount > 0 && (
            <button onClick={() => setActiveTab('panier')}
              style={{
                position: 'fixed', bottom: '90px', left: '50%', transform: 'translateX(-50%)',
                background: OR, color: NOIR, border: 'none', borderRadius: '999px',
                padding: '12px 28px', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                boxShadow: `0 4px 20px rgba(184,146,42,0.4)`, fontFamily: `'DM Sans', sans-serif`,
                whiteSpace: 'nowrap',
              }}>
              🛒 Voir panier ({panierCount}) — {formatMontant(panierTotal)}
            </button>
          )}
        </>
      )}

      {/* ── Panier ── */}
      {activeTab === 'panier' && (
        <>
          {panierItems.length === 0 ? (
            <div style={{ textAlign: 'center', color: MUTED, padding: '40px 20px', fontSize: '14px' }}>
              <p style={{ fontSize: '32px', margin: '0 0 12px' }}>🛒</p>
              Votre panier est vide
              <br />
              <button onClick={() => setActiveTab('catalogue')}
                style={{ marginTop: '16px', background: OR, color: NOIR, border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>
                Voir le catalogue
              </button>
            </div>
          ) : (
            <>
              {/* Items */}
              {panierItems.map(m => (
                <div key={m.id} style={{
                  background: CARD, borderRadius: '12px', padding: '12px 14px', marginBottom: '8px',
                  border: `1px solid ${BORDER_OR}`,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{m.nom}</div>
                    <div style={{ fontSize: '12px', color: MUTED, marginTop: '2px' }}>
                      {formatMontant(m.prix)} × {panier[m.id]} = {formatMontant(m.prix * panier[m.id])}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <button onClick={() => changeQty(m.id, -1)}
                      style={{ background: `rgba(14,12,9,0.08)`, border: 'none', borderRadius: '6px', width: '28px', height: '28px', color: NOIR, fontSize: '16px', cursor: 'pointer' }}>−</button>
                    <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 700 }}>{panier[m.id]}</span>
                    <button onClick={() => changeQty(m.id, 1)}
                      style={{ background: `rgba(14,12,9,0.08)`, border: 'none', borderRadius: '6px', width: '28px', height: '28px', color: NOIR, fontSize: '16px', cursor: 'pointer' }}>+</button>
                  </div>
                </div>
              ))}

              {/* Récapitulatif */}
              <div style={{ background: CARD, borderRadius: '12px', padding: '14px', marginTop: '8px', border: `1px solid ${BORDER_OR}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', color: MUTED }}>Sous-total</span>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{formatMontant(panierTotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', color: MUTED }}>Livraison</span>
                  <span style={{ fontSize: '13px', color: '#22c55e', fontWeight: 600 }}>Gratuite</span>
                </div>
                <div style={{ borderTop: `1px solid ${BORDER_OR}`, paddingTop: '8px', marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: NOIR }}>Total</span>
                  <span style={{ fontSize: '18px', fontWeight: 700, color: OR }}>{formatMontant(panierTotal)}</span>
                </div>
              </div>

              {/* Mode paiement */}
              <div style={{ marginTop: '16px', marginBottom: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px' }}>Mode de paiement</div>
                {['portefeuille', 'carte'].map(mode => (
                  <label key={mode} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer',
                    padding: '12px', borderRadius: '10px', marginBottom: '8px',
                    background: modePaiement === mode ? `rgba(184,146,42,0.08)` : 'transparent',
                    border: `1px solid ${modePaiement === mode ? OR : BORDER_OR}`,
                  }}>
                    <input type="radio" name="paiement" value={mode} checked={modePaiement === mode}
                      onChange={() => setModePaiement(mode)} style={{ accentColor: OR, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>
                        {mode === 'portefeuille' ? 'Portefeuille Kadio' : 'Carte de crédit'}
                      </div>
                      {mode === 'portefeuille' && (
                        <div style={{ fontSize: '12px', marginTop: '2px', color: soldeSuffisant ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
                          Solde disponible : {formatMontant(solde)}
                          {!soldeSuffisant && ` — insuffisant (manque ${formatMontant(panierTotal - solde)})`}
                        </div>
                      )}
                      {mode === 'carte' && (
                        <div style={{ fontSize: '12px', color: MUTED, marginTop: '2px' }}>Visa / Mastercard via Square</div>
                      )}
                    </div>
                  </label>
                ))}
              </div>

              {/* Avertissement solde insuffisant */}
              {modePaiement === 'portefeuille' && !soldeSuffisant && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px', marginBottom: '12px' }}>
                  <p style={{ margin: 0, color: '#ef4444', fontSize: '13px', fontWeight: 600 }}>
                    Solde insuffisant — choisissez la carte ou réduisez votre panier.
                  </p>
                  <p style={{ margin: '4px 0 0', color: MUTED, fontSize: '12px' }}>
                    Solde : {formatMontant(solde)} · Commande : {formatMontant(panierTotal)}
                  </p>
                </div>
              )}

              <button
                onClick={passerCommande}
                disabled={modePaiement === 'portefeuille' && !soldeSuffisant}
                style={{
                  width: '100%', background: (modePaiement === 'portefeuille' && !soldeSuffisant) ? 'rgba(14,12,9,0.08)' : OR,
                  color: (modePaiement === 'portefeuille' && !soldeSuffisant) ? MUTED : NOIR,
                  border: 'none', borderRadius: '12px', padding: '14px',
                  fontSize: '15px', fontWeight: 700, cursor: 'pointer',
                  fontFamily: `'DM Sans', sans-serif`, marginTop: '8px',
                }}>
                Confirmer la commande — {formatMontant(panierTotal)}
              </button>
            </>
          )}
        </>
      )}

      {/* ── Commandes ── */}
      {activeTab === 'commandes' && (
        <>
          {commandes.length === 0 && (
            <p style={{ color: MUTED, textAlign: 'center', padding: '40px 0', fontSize: '14px' }}>Aucune commande.</p>
          )}
          {commandes.map(cmd => {
            const s = getStatutInfo(cmd.statut)
            const isExpanded = expanded === cmd.id
            return (
              <div key={cmd.id} style={{ background: CARD, borderRadius: '12px', padding: '14px', marginBottom: '10px', border: `1px solid ${cmd.nouvelle ? OR : BORDER_OR}` }}>
                <div onClick={() => setExpanded(isExpanded ? null : cmd.id)} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px', fontFamily: 'monospace' }}>{cmd.numero}</div>
                      <div style={{ fontSize: '12px', color: MUTED, marginTop: '2px' }}>{formatDate(cmd.date)}</div>
                    </div>
                    <span style={{
                      fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '999px',
                      background: `${s?.color}22`, color: s?.color, border: `1px solid ${s?.color}55`,
                    }}>
                      {s?.label || cmd.statut}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: OR }}>{formatMontant(cmd.total)}</div>
                </div>

                {isExpanded && (
                  <div style={{ marginTop: '12px', borderTop: `1px solid ${BORDER_OR}`, paddingTop: '12px' }}>
                    {cmd.articles.map((art, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '3px 0', color: MUTED }}>
                        <span>{art.nom} ×{art.qte}</span>
                        <span>{formatMontant(art.prix * art.qte)}</span>
                      </div>
                    ))}
                    {cmd.numero_suivi && (
                      <p style={{ margin: '8px 0 0', color: '#60a5fa', fontSize: '13px' }}>Suivi : <span style={{ fontWeight: 600 }}>{cmd.numero_suivi}</span></p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}
