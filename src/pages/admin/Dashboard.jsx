import { useState, useMemo } from 'react'
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
  const rdvToday = allRdv.filter(r => r.date === TODAY)
  const rdvConfirmes = rdvToday.filter(r => r.statut === 'confirme' || r.statut === 'en_cours')
  const revenusToday = rdvToday.reduce((s, r) => s + (r.montant || 0), 0)

  const stats = MOCK_STATS_ADMIN
  const croissance = stats.revenus_mois_prev > 0 ? Math.round(((stats.revenus_mois - stats.revenus_mois_prev) / stats.revenus_mois_prev) * 100) : 0

  const dateLabel = new Date().toLocaleDateString('fr-CA', { weekday: 'long', day: 'numeric', month: 'long' })

  const dismissAlerte = (id) => setAlertes(prev => prev.filter(a => a.id !== id))

  const TABS = [
    { id: 'apercu', label: 'AperÃ§u', icon: 'ð' },
    { id: 'rdv', label: 'RDV', icon: 'ð' },
    { id: 'equipe', label: 'Ãquipe', icon: 'ð¥' },
    { id: 'finance', label: 'Finance', icon: 'ð°' },
  ]

  const ACTIONS_RAPIDES = [
    { label: 'Assistant IA', icon: 'ðï¸', path: '/admin/assistant', color: '#8B5CF6' },
    { label: 'Calendrier', icon: 'ð', path: '/admin/calendrier', color: '#3B82F6' },
    { label: 'Clients', icon: 'ð¥', path: '/admin/clients', color: '#22c55e' },
    { label: 'Services', icon: '"ï¸', path: '/admin/services', color: OR },
    { label: 'Candidats', icon: 'ð', path: '/admin/candidats', color: '#f59e0b' },
    { label: 'SMS', icon: 'ð¬', path: '/admin/sms', color: '#ec4899' },
  ]

  // Mini bar chart
  const maxRevMois = Math.max(...stats.revenus_par_mois.map(r => r.montant))

  return (
    <div style={{ padding: '20px', paddingBottom: '100px', color: NOIR, background: CREME, minHeight: '100vh', maxWidth: '900px', margin: '0 auto' }}>

      {/* ââ Header ââ */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ color: OR, fontSize: '22px', fontWeight: '700', margin: '0 0 2px' }}>
            Salut Othi
          </h1>
          <p style={{ color: MUTED, margin: 0, fontSize: '13px', textTransform: 'capitalize' }}>{dateLabel}</p>
        </div>
        <button
          onClick={() => navigate('/admin/assistant')}
          style={{
            background: `linear-gradient(135deg, ${OR}, #d4a84b)`, border: 'none', borderRadius: '50%',
            width: '46px', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: '22px', boxShadow: `0 4px 15px ${OR}40`,
          }}
        >ðï¸</button>
      </div>

      {/* ââ KPI Strip ââ */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', overflowX: 'auto', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', paddingBottom: '4px' }}>
        {[
          { label: 'RDV aujourd\'hui', value: rdvConfirmes.length, sub: `${rdvToday.length} total`, color: OR },
          { label: 'Revenus jour', value: formatMontant(revenusToday), sub: '', color: '#22c55e' },
          { label: 'Revenus mois', value: formatMontant(stats.revenus_mois), sub: `+${croissance}%`, color: '#3B82F6' },
          { label: 'AbonnÃ©s', value: stats.abonnes_actifs, sub: `${stats.partenaires_actifs} partenaires`, color: '#8B5CF6' },
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

      {/* ââ Alertes ââ */}
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
              <span style={{ fontSize: '16px' }}>{a.type === 'no_show' ? 'ð«' : a.type === 'paiement' ? 'ð³' : a.type === 'virement' ? 'ð¸' : 'ð'}</span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '12px', color: NOIR, lineHeight: 1.4 }}>{a.message}</p>
              </div>
              <button onClick={() => dismissAlerte(a.id)} style={{ background: 'none', border: 'none', color: MUTED, cursor: 'pointer', fontSize: '14px', padding: '4px' }}>â</button>
            </div>
          ))}
        </div>
      )}

      {/* ââ Actions rapides ââ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '24px' }}>
        {ACTIONS_RAPIDES.map((a, i) => (
          <button
            key={i}
            onClick={() => navigate(a.path)}
            style={{
              background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '12px',
              padding: '14px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
              cursor: 'pointer', color: NOIR, fontSize: '11px', fontWeight: '600', transition: 'all 0.2s',
            }}
          >
            <div style={{
              width: '38px', height: '38px', borderRadius: '10px',
              background: `${a.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
            }}>{a.icon}</div>
            {a.label}
          </button>
        ))}
      </div>

      {/* ââ Tab Bar ââ */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: CARD2, borderRadius: '12px', padding: '4px' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            flex: 1, padding: '10px 6px', borderRadius: '10px', border: 'none', cursor: 'pointer',
            background: activeTab === t.id ? '#fff' : 'transparent',
            color: activeTab === t.id ? OR : MUTED,
            fontWeight: activeTab === t.id ? '700' : '500',
            fontSize: '12px', transition: 'all 0.2s',
            boxShadow: activeTab === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
          }}>
            <span style={{ fontSize: '16px', display: 'block', marginBottom: '2px' }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* ââ Tab Content ââ */}
      {activeTab === 'apercu' && <TabApercu stats={stats} maxRevMois={maxRevMois} navigate={navigate} />}
      {activeTab === 'rdv' && <TabRDV rdv={allRdv} navigate={navigate} />}
      {activeTab === 'equipe' && <TabEquipe navigate={navigate} />}
      {activeTab === 'finance' && <TabFinance stats={stats} navigate={navigate} />}
    </div>
  )
}

// âââââââââââââââââââââââââââââââââââââââââââââââââââââ
// TAB: AperÃ§u
// âââââââââââââââââââââââââââââââââââââââââââââââââââââ
function TabApercu({ stats, maxRevMois, navigate }) {
  return (
    <>
      {/* Revenus par mois - Mini bar chart */}
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

      {/* Top services */}
      <Section title="Top services">
        {stats.top_services.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '8px', background: `${OR}15`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: OR,
            }}>{i + 1}</div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: '600' }}>{s.service}</p>
            </div>
            <div style={{
              background: `${OR}15`, padding: '4px 10px', borderRadius: '20px',
              fontSize: '12px', fontWeight: '700', color: OR,
            }}>{s.count}</div>
          </div>
        ))}
      </Section>

      {/* No-show taux */}
      <Section title="Performance">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <MiniStat label="No-shows ce mois" value={stats.no_shows_mois} color="#ef4444" />
          <MiniStat label="Taux no-show" value={`${stats.taux_no_show}%`} color={stats.taux_no_show < 5 ? '#22c55e' : '#f59e0b'} />
          <MiniStat label="RDV/semaine" value={stats.rdv_semaine} color="#3B82F6" />
          <MiniStat label="vs sem. derniÃ¨re" value={`+${stats.rdv_semaine - stats.rdv_semaine_prev}`} color="#22c55e" />
        </div>
      </Section>
    </>
  )
}

// âââââââââââââââââââââââââââââââââââââââââââââââââââââ
// TAB: RDV
// âââââââââââââââââââââââââââââââââââââââââââââââââââââ
function TabRDV({ rdv, navigate }) {
  const [filtre, setFiltre] = useState('tous')
  const rdvFiltres = filtre === 'tous' ? rdv : rdv.filter(r => r.statut === filtre)

  return (
    <>
      {/* Filtres */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
        {['tous', 'confirme', 'en_cours', 'termine', 'no_show'].map(f => (
          <button key={f} onClick={() => setFiltre(f)} style={{
            padding: '6px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap',
            background: filtre === f ? OR : CARD, color: filtre === f ? '#fff' : MUTED,
          }}>{f === 'tous' ? 'Tous' : f.replace('_', ' ')}</button>
        ))}
      </div>

      {/* Liste RDV */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {rdvFiltres.map(r => (
          <div key={r.id} style={{
            background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '12px', padding: '12px 14px',
            display: 'flex', alignItems: 'center', gap: '12px',
          }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '12px',
              background: `${statutColor(r.statut)}15`, display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: statutColor(r.statut) }}>{r.heure?.slice(0, 5)}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '600', color: NOIR, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {r.client}
              </p>
              <p style={{ margin: 0, fontSize: '11px', color: MUTED, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {r.coiffeur} Â· {r.service}
              </p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <span style={{
                display: 'inline-block', fontSize: '10px', padding: '2px 8px',
                borderRadius: '20px', background: statutColor(r.statut) + '18',
                color: statutColor(r.statut), fontWeight: '600',
              }}>{r.statut.replace('_', ' ')}</span>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: OR, fontWeight: '700' }}>{formatMontant(r.montant)}</p>
            </div>
          </div>
        ))}
        {rdvFiltres.length === 0 && (
          <p style={{ textAlign: 'center', color: MUTED, fontSize: '13px', padding: '20px' }}>Aucun RDV trouvÃ©</p>
        )}
      </div>

      <button onClick={() => navigate('/admin/calendrier')} style={{
        width: '100%', marginTop: '16px', padding: '12px', borderRadius: '10px',
        background: CARD, border: `1px solid ${BORDER_OR}`, cursor: 'pointer',
        color: OR, fontSize: '13px', fontWeight: '600', textAlign: 'center',
      }}>Voir le calendrier complet â</button>
    </>
  )
}

// âââââââââââââââââââââââââââââââââââââââââââââââââââââ
// TAB: Ãquipe
// âââââââââââââââââââââââââââââââââââââââââââââââââââââ
function TabEquipe({ navigate }) {
  return (
    <>
      <Section title={`EmployÃ©s (${MOCK_EMPLOYES_ADMIN.length})`}>
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
              <p style={{ margin: 0, fontSize: '11px', color: MUTED }}>{e.poste} Â· {e.specialites.join(', ')}</p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <span style={{
                fontSize: '10px', padding: '2px 8px', borderRadius: '20px',
                background: e.statut === 'actif' ? '#22c55e18' : '#f59e0b18',
                color: e.statut === 'actif' ? '#22c55e' : '#f59e0b', fontWeight: 600,
              }}>{e.statut}</span>
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
              width: '40px', height: '40px', borderRadius: '50%',
              background: `${OR}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: '700', color: OR, flexShrink: 0,
            }}>{initiales(p.prenom, p.nom)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '600' }}>{p.prenom} {p.nom}</p>
              <p style={{ margin: 0, fontSize: '11px', color: MUTED }}>{p.ville} Â· â {p.note}</p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: '700', color: '#22c55e' }}>{formatMontant(p.revenus_mois)}</p>
              <p style={{ margin: '2px 0 0', fontSize: '10px', color: MUTED }}>{p.rdv_total} RDV total</p>
            </div>
          </div>
        ))}
        <button onClick={() => navigate('/admin/partenaires')} style={{
          width: '100%', padding: '10px', borderRadius: '8px',
          background: 'transparent', border: `1px solid ${BORDER_OR}`, cursor: 'pointer',
          color: OR, fontSize: '12px', fontWeight: '600',
        }}>Voir tous les partenaires â</button>
      </Section>
    </>
  )
}

// âââââââââââââââââââââââââââââââââââââââââââââââââââââ
// TAB: Finance
// âââââââââââââââââââââââââââââââââââââââââââââââââââââ
function TabFinance({ stats, navigate }) {
  const pendingVirements = MOCK_VIREMENTS_ADMIN.filter(v => v.statut === 'en_attente')
  const totalPending = pendingVirements.reduce((s, v) => s + v.montant, 0)

  return (
    <>
      {/* Revenue breakdown */}
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

      {/* Virements en attente */}
      {pendingVirements.length > 0 && (
        <Section title={`Virements en attente (${pendingVirements.length})`}>
          <div style={{
            background: '#f59e0b10', border: '1px solid #f59e0b30', borderRadius: '10px',
            padding: '12px', marginBottom: '12px', textAlign: 'center',
          }}>
            <p style={{ margin: '0 0 2px', fontSize: '20px', fontWeight: '700', color: '#f59e0b' }}>{formatMontant(totalPending)}</p>
            <p style={{ margin: 0, fontSize: '11px', color: MUTED }}>Ã  verser</p>
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
            background: OR, border: 'none', cursor: 'pointer',
            color: '#fff', fontSize: '13px', fontWeight: '600',
          }}>Effectuer les virements â</button>
        </Section>
      )}

      {/* DerniÃ¨res transactions */}
      <Section title="DerniÃ¨res transactions">
        {MOCK_TRANSACTIONS_ADMIN.slice(0, 5).map(t => (
          <div key={t.id} style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0',
            borderBottom: `1px solid ${BORDER_OR}`,
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: t.type.includes('abonnement') ? '#8B5CF615' : t.type.includes('domicile') ? '#22c55e15' : `${OR}15`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0,
            }}>
              {t.type.includes('abonnement') ? 'ð¦' : t.type.includes('materiel') ? 'ð§´' : 'âï¸'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: '0 0 2px', fontSize: '12px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.client || t.partenaire}</p>
              <p style={{ margin: 0, fontSize: '10px', color: MUTED }}>{t.date} Â· {t.type.replace('_', ' ')}</p>
            </div>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#22c55e', flexShrink: 0 }}>{formatMontant(t.montant)}</span>
          </div>
        ))}
        <button onClick={() => navigate('/admin/transactions')} style={{
          width: '100%', marginTop: '12px', padding: '10px', borderRadius: '8px',
          background: 'transparent', border: `1px solid ${BORDER_OR}`, cursor: 'pointer',
          color: OR, fontSize: '12px', fontWeight: '600',
        }}>Toutes les transactions â</button>
      </Section>
    </>
  )
}

// âââââââââââââââââââââââââââââââââââââââââââââââââââââ
// Shared Components
// âââââââââââââââââââââââââââââââââââââââââââââââââââââ
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
    <div style={{
      background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '10px', padding: '12px',
    }}>
      <p style={{ color: MUTED, fontSize: '10px', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{label}</p>
      <p style={{ color, fontSize: '20px', fontWeight: '700', margin: 0 }}>{value}</p>
    </div>
  )
}
