import { useState } from 'react'
import { OR, CREME, NOIR, CARD, MUTED, BORDER_OR, formatMontant, formatDate } from '@/lib/utils'
import { STATUTS_COMMANDE } from '@/data/mockFournisseur'
import { useCommandesFournisseur } from '@/hooks'
import { simulerSMS } from '@/utils/commandes'

// Commandes historiques additionnelles
const COMMANDES_HISTORIQUES = [
  // Commandes historiques Diane (livrées)
  {
    id: 'cmd-d1', numero: 'CMD-2026-031', date: '2026-03-15',
    partenaire: { prenom: 'Diane', nom: 'Mbaye', code: 'KADIO-DIANE-001' },
    fournisseur: 'BeautyPro Supply Canada',
    articles: [{ nom: `Mèches knotless noires 26"`, qte: 3, prix_unit: 18.99 }, { nom: 'Huile de coco Kadio 250ml', qte: 1, prix_unit: 12.50 }],
    total: 69.47, statut: 'livree', nouvelle: false, numero_suivi: 'CPC-4391020-YUL',
  },
  {
    id: 'cmd-r1', numero: 'CMD-2026-038', date: '2026-03-22',
    partenaire: { prenom: 'Rachel', nom: 'Ndoye', code: 'KADIO-RACHEL-005' },
    fournisseur: 'BeautyPro Supply Canada',
    articles: [{ nom: `Mèches knotless noires 26"`, qte: 5, prix_unit: 18.99 }, { nom: 'Gel fixant sans résidu', qte: 3, prix_unit: 9.99 }],
    total: 124.92, statut: 'expediee', nouvelle: false, numero_suivi: 'CPC-4415200-YUL',
  },
  {
    id: 'cmd-f1', numero: 'CMD-2026-041', date: '2026-03-25',
    partenaire: { prenom: 'Fatou', nom: 'Konaté', code: 'KADIO-FATOU-002' },
    fournisseur: 'BeautyPro Supply Canada',
    articles: [{ nom: 'Huile de coco Kadio 250ml', qte: 4, prix_unit: 12.50 }, { nom: `Peigne à queue acier`, qte: 6, prix_unit: 6.50 }],
    total: 89.00, statut: 'confirmee', nouvelle: false, numero_suivi: null,
  },
]

const FILTRES_STATUT = ['Tous', 'en_attente', 'confirmee', 'preparee', 'expediee', 'livree']
const STATUT_LABELS  = { en_attente: 'En attente', confirmee: 'Confirmée', preparee: 'Préparée', expediee: 'Expédiée', livree: 'Livrée' }

export default function AdminProduits() {
  const { data: commandesData = [] } = useCommandesFournisseur()
  const [commandes, setCommandes] = useState([...(commandesData || []), ...COMMANDES_HISTORIQUES])
  const [filtreStatut, setFiltreStatut]     = useState('Tous')
  const [filtrePartenaire, setFiltrePartenaire] = useState('Tous')
  const [expanded, setExpanded]   = useState(null)
  const [toast, setToast]         = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const filtered = commandes.filter(c => {
    if (filtreStatut !== 'Tous' && c.statut !== filtreStatut) return false
    if (filtrePartenaire !== 'Tous') {
      const nom = `${c.partenaire.prenom} ${c.partenaire.nom}`
      if (nom !== filtrePartenaire) return false
    }
    return true
  })

  const totalMois     = commandes.reduce((s, c) => s + c.total, 0)
  const enAttente     = commandes.filter(c => c.statut === 'en_attente').length
  const enAttenteMontant = commandes.filter(c => c.statut === 'en_attente').reduce((s, c) => s + c.total, 0)

  const avancerStatut = (id) => {
    setCommandes(prev => prev.map(cmd => {
      if (cmd.id !== id) return cmd
      const s = STATUTS_COMMANDE.find(s => s.val === cmd.statut)
      if (!s?.next) return cmd
      const updated = { ...cmd, statut: s.next }
      // SMS simulé au partenaire
      simulerSMS(
        cmd.partenaire.code,
        `Votre commande ${cmd.numero} est maintenant "${STATUT_LABELS[s.next] || s.next}". Kadio.`
      )
      return updated
    }))
    showToast(`Statut mis à jour — SMS envoyé au partenaire`)
  }

  // Partenaires uniques pour le filtre
  const partenairesUniques = ['Tous', ...new Set(commandes.map(c => `${c.partenaire.prenom} ${c.partenaire.nom}`))]

  return (
    <div style={{ padding: '24px', paddingBottom: '100px', color: NOIR, background: CREME, minHeight: '100vh' }}>

      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#14532d', border: '1px solid #22c55e', color: '#86efac', padding: '10px 18px', borderRadius: '8px', zIndex: 999, fontSize: '14px' }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <h1 style={{ color: OR, fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>Commandes matériel réseau</h1>
      <p style={{ color: MUTED, margin: '0 0 20px', fontSize: '13px' }}>{commandes.length} commandes au total</p>

      {/* Stats strip */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
        <div style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '10px', padding: '12px' }}>
          <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 4px' }}>Total mars</p>
          <p style={{ color: OR, fontSize: '18px', fontWeight: 700, margin: 0 }}>{formatMontant(totalMois)}</p>
        </div>
        <div style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '10px', padding: '12px' }}>
          <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 4px' }}>En attente</p>
          <p style={{ color: '#f59e0b', fontSize: '18px', fontWeight: 700, margin: 0 }}>{enAttente}</p>
        </div>
        <div style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '10px', padding: '12px' }}>
          <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 4px' }}>Valeur attente</p>
          <p style={{ color: '#f59e0b', fontSize: '16px', fontWeight: 700, margin: 0 }}>{formatMontant(enAttenteMontant)}</p>
        </div>
      </div>

      {/* Filtre statut */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
        {FILTRES_STATUT.map(f => (
          <button key={f} onClick={() => setFiltreStatut(f)}
            style={{
              padding: '6px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer',
              fontSize: '12px', fontWeight: 600,
              background: filtreStatut === f ? OR : CARD,
              color: filtreStatut === f ? NOIR : MUTED,
            }}>
            {f === 'Tous' ? 'Toutes' : STATUT_LABELS[f]}
          </button>
        ))}
      </div>

      {/* Filtre partenaire */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {partenairesUniques.map(p => (
          <button key={p} onClick={() => setFiltrePartenaire(p)}
            style={{
              padding: '5px 10px', borderRadius: '20px', border: `1px solid ${BORDER_OR}`, cursor: 'pointer',
              fontSize: '11px', fontWeight: 500,
              background: filtrePartenaire === p ? `rgba(14,12,9,0.08)` : 'transparent',
              color: filtrePartenaire === p ? OR : MUTED,
            }}>
            {p}
          </button>
        ))}
      </div>

      {/* Liste */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.length === 0 && (
          <p style={{ color: MUTED, textAlign: 'center', padding: '40px 0' }}>Aucune commande pour ce filtre.</p>
        )}
        {filtered.map(cmd => {
          const s = STATUTS_COMMANDE.find(st => st.val === cmd.statut)
          const isOpen = expanded === cmd.id
          return (
            <div key={cmd.id} style={{ background: CARD, border: `1px solid ${cmd.nouvelle ? OR : BORDER_OR}`, borderRadius: '12px', padding: '14px' }}>
              <div onClick={() => setExpanded(isOpen ? null : cmd.id)} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    {cmd.nouvelle && <span style={{ background: OR, color: NOIR, fontSize: '10px', padding: '1px 6px', borderRadius: '6px', fontWeight: 700 }}>NOUVEAU</span>}
                    <p style={{ margin: 0, fontWeight: 600, color: NOIR, fontSize: '13px', fontFamily: 'monospace' }}>{cmd.numero}</p>
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: MUTED }}>{cmd.partenaire.prenom} {cmd.partenaire.nom} · {formatDate(cmd.date)}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '11px', color: MUTED }}>{cmd.fournisseur}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'block', fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: `${s?.color || '#6b7280'}22`, color: s?.color || '#6b7280', fontWeight: 600, marginBottom: '4px' }}>
                    {STATUT_LABELS[cmd.statut] || cmd.statut}
                  </span>
                  <p style={{ margin: 0, color: OR, fontWeight: 700, fontSize: '14px' }}>{formatMontant(cmd.total)}</p>
                </div>
              </div>

              {isOpen && (
                <div style={{ marginTop: '12px', borderTop: `1px solid ${BORDER_OR}`, paddingTop: '12px' }}>
                  {cmd.articles.map((a, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '3px 0' }}>
                      <span style={{ color: NOIR }}>{a.qte}× {a.nom}</span>
                      <span style={{ color: OR }}>{formatMontant(a.qte * a.prix_unit)}</span>
                    </div>
                  ))}
                  {cmd.numero_suivi && (
                    <p style={{ color: '#60a5fa', fontSize: '12px', margin: '8px 0 0' }}>Suivi : {cmd.numero_suivi}</p>
                  )}
                  {s?.next && (
                    <button onClick={() => avancerStatut(cmd.id)}
                      style={{ marginTop: '10px', width: '100%', padding: '9px', borderRadius: '8px', border: 'none', background: s.color, color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>
                      {s.nextLabel} + SMS partenaire
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
