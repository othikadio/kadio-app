import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { OR, CREME, NOIR, CARD } from '@/lib/utils'
import { useArticles } from '@/hooks/useArticles'

const CATEGORIES = ['Tous', 'Communauté', 'Conseils', 'Partenaires', 'Événements', 'Tutoriels']
const PER_PAGE = 3

const catColor = (cat) => ({
  Tutoriels: '#7c3aed',
  Partenaires: '#059669',
  Conseils: '#0284c7',
  Communauté: '#d97706',
  Événements: '#db2777',
}[cat] || OR)

const formatDateFR = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' })
}

function tempsLecture(contenu) {
  return Math.max(1, Math.ceil(contenu.trim().split(/\s+/).length / 200))
}


export default function Blog() {
  const { data: articles, loading } = useArticles()
  const [catFiltre, setCatFiltre] = useState('Tous')
  const [search, setSearch]       = useState('')
  const [tagFiltre, setTagFiltre] = useState('')
  const [page, setPage]           = useState(1)
  const [email, setEmail]         = useState('')
  const [subDone, setSubDone]     = useState(false)

  const ARTICLES_PUBLIES = articles?.filter(a => a.statut === 'publie') || []

  const filtered = useMemo(() => {
    let res = ARTICLES_PUBLIES
    if (catFiltre !== 'Tous') res = res.filter(a => a.categorie === catFiltre)
    if (tagFiltre) res = res.filter(a => a.tags && a.tags.includes(tagFiltre))
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      res = res.filter(a =>
        a.titre.toLowerCase().includes(q) ||
        a.extrait.toLowerCase().includes(q) ||
        (a.tags || []).some(t => t.toLowerCase().includes(q))
      )
    }
    return res
  }, [catFiltre, tagFiltre, search])

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const paginated   = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  function setFilter(setter, val) {
    setter(val)
    setPage(1)
  }

  function handleSubscribe(e) {
    e.preventDefault()
    if (!email.includes('@')) return
    setSubDone(true)
  }

  return (
    <div style={{ background: CREME, color: NOIR, minHeight: '100vh', fontFamily: `'Inter', sans-serif` }}>

      {/* ── HEADER ─── */}
      <section style={{
        padding: '100px 24px 64px', textAlign: 'center',
        background: `radial-gradient(ellipse at 50% 0%, rgba(184,146,42,0.09) 0%, transparent 60%)`,
        borderBottom: `1px solid rgba(184,146,42,0.12)`,
      }}>
        <div style={{
          display: 'inline-block', background: 'rgba(14,12,9,0.08)', color: OR,
          borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 600,
          letterSpacing: 2, marginBottom: 16,
        }}>
          ACTUALITÉS
        </div>
        <h1 style={{
          fontFamily: `'Bebas Neue', sans-serif`,
          fontSize: 'clamp(48px, 9vw, 96px)',
          color: NOIR, margin: '0 0 14px', lineHeight: 0.95,
        }}>
          Blog Kadio
        </h1>
        <p style={{ color: 'rgba(14,12,9,0.6)', fontSize: 15, maxWidth: 480, margin: '0 auto 28px' }}>
          {`Conseils, actualités, tutoriels et témoignages de la communauté Kadio`}
        </p>

        {/* Recherche */}
        <div style={{ maxWidth: 420, margin: '0 auto 24px', position: 'relative' }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, opacity: 0.4 }}>🔍</span>
          <input
            value={search}
            onChange={e => setFilter(setSearch, e.target.value)}
            placeholder="Rechercher un article, un tag…"
            style={{
              width: '100%', background: 'rgba(184,146,42,0.06)', border: `1px solid rgba(184,146,42,0.25)`,
              borderRadius: 12, color: NOIR, padding: '12px 16px 12px 42px',
              fontSize: 14, boxSizing: 'border-box', fontFamily: `'Inter', sans-serif`,
              outline: 'none',
            }}
          />
          {search && (
            <button onClick={() => setFilter(setSearch, '')}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(14,12,9,0.4)', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>
              ✕
            </button>
          )}
        </div>

        {/* Filtres catégorie */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: tagFiltre ? 12 : 0 }}>
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setFilter(setCatFiltre, c)}
              style={{
                padding: '8px 18px', borderRadius: 20,
                border: `1.5px solid ${catFiltre === c ? OR : 'rgba(184,146,42,0.25)'}`,
                background: catFiltre === c ? OR : 'transparent',
                color: catFiltre === c ? NOIR : CREME,
                fontWeight: 600, fontSize: 13, cursor: 'pointer',
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Tag actif */}
        {tagFiltre && (
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, color: 'rgba(14,12,9,0.5)' }}>Tag :</span>
            <span style={{ background: 'rgba(14,12,9,0.08)', border: `1px solid rgba(184,146,42,0.35)`, color: OR, borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>
              #{tagFiltre}
            </span>
            <button onClick={() => setFilter(setTagFiltre, '')}
              style={{ background: 'none', border: 'none', color: 'rgba(14,12,9,0.4)', cursor: 'pointer', fontSize: 14 }}>✕</button>
          </div>
        )}
      </section>

      {/* ── GRID ARTICLES ─── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 32px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'rgba(14,12,9,0.4)', padding: '60px 0' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>Chargement...</div>
            <p>{`Récupération des articles en cours`}</p>
          </div>
        ) : paginated.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'rgba(14,12,9,0.4)', padding: '60px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <p>{`Aucun article ne correspond à votre recherche.`}</p>
            <button onClick={() => { setSearch(''); setCatFiltre('Tous'); setTagFiltre(''); setPage(1) }}
              style={{ marginTop: 12, background: 'none', border: `1px solid rgba(14,12,9,0.08)`, color: OR, borderRadius: 8, padding: '8px 18px', fontSize: 13, cursor: 'pointer' }}>
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
            {paginated.map(article => (
              <Link
                key={article.slug}
                to={`/blog/${article.slug}`}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <div style={{
                  background: CARD, borderRadius: 16, overflow: 'hidden',
                  border: `1px solid rgba(184,146,42,0.12)`,
                  height: '100%', display: 'flex', flexDirection: 'column',
                  transition: 'border-color 0.2s', cursor: 'pointer',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(184,146,42,0.4)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(184,146,42,0.12)'}
                >
                  {/* Image area */}
                  <div style={{
                    height: 160, background: `linear-gradient(135deg, ${catColor(article.categorie)}22, ${NOIR})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderBottom: `1px solid rgba(184,146,42,0.08)`,
                  }}>
                    <div style={{
                      fontFamily: `'Bebas Neue', sans-serif`,
                      fontSize: 64, color: `${catColor(article.categorie)}33`, letterSpacing: 2,
                    }}>
                      KADIO
                    </div>
                  </div>

                  <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{
                        background: `${catColor(article.categorie)}22`, color: catColor(article.categorie),
                        borderRadius: 8, padding: '2px 10px', fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
                      }}>
                        {article.categorie.toUpperCase()}
                      </span>
                      <span style={{ color: 'rgba(14,12,9,0.4)', fontSize: 11 }}>
                        {tempsLecture(article.contenu)} min · {formatDateFR(article.date)}
                      </span>
                    </div>

                    <h2 style={{
                      color: NOIR, fontWeight: 700, fontSize: 16, margin: 0, lineHeight: 1.4,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      {article.titre}
                    </h2>

                    <p style={{
                      color: 'rgba(14,12,9,0.6)', fontSize: 13, lineHeight: 1.6, margin: 0, flex: 1,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      {article.extrait}
                    </p>

                    {/* Tags cliquables */}
                    {article.tags && article.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }} onClick={e => e.preventDefault()}>
                        {article.tags.map(tag => (
                          <button
                            key={tag}
                            onClick={e => { e.preventDefault(); e.stopPropagation(); setFilter(setTagFiltre, tag) }}
                            style={{
                              background: tagFiltre === tag ? 'rgba(14,12,9,0.08)' : 'rgba(184,146,42,0.08)',
                              border: `1px solid ${tagFiltre === tag ? OR : 'rgba(184,146,42,0.18)'}`,
                              color: tagFiltre === tag ? OR : 'rgba(14,12,9,0.5)',
                              borderRadius: 12, padding: '2px 10px', fontSize: 11, fontWeight: 500,
                              cursor: 'pointer',
                            }}
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                      <span style={{ color: 'rgba(14,12,9,0.45)', fontSize: 12 }}>
                        Par {article.auteur}
                      </span>
                      <span style={{ color: OR, fontSize: 13, fontWeight: 600 }}>Lire →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 40 }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '9px 20px', borderRadius: 8, border: `1px solid rgba(14,12,9,0.08)`,
                background: 'none', color: currentPage === 1 ? 'rgba(14,12,9,0.2)' : CREME,
                fontSize: 13, fontWeight: 600, cursor: currentPage === 1 ? 'default' : 'pointer',
              }}
            >
              ← Précédent
            </button>
            <span style={{ color: 'rgba(14,12,9,0.45)', fontSize: 13 }}>
              Page {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: '9px 20px', borderRadius: 8, border: `1px solid rgba(14,12,9,0.08)`,
                background: 'none', color: currentPage === totalPages ? 'rgba(14,12,9,0.2)' : CREME,
                fontSize: 13, fontWeight: 600, cursor: currentPage === totalPages ? 'default' : 'pointer',
              }}
            >
              Suivant →
            </button>
          </div>
        )}
      </section>

      {/* ── NEWSLETTER ─── */}
      <section style={{
        background: `linear-gradient(135deg, rgba(184,146,42,0.07), rgba(14,12,9,0))`,
        border: `1px solid rgba(14,12,9,0.08)`, borderRadius: 20,
        maxWidth: 600, margin: '0 auto 80px', padding: '40px 32px', textAlign: 'center',
        marginLeft: 'auto', marginRight: 'auto',
      }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>✉️</div>
        <h2 style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 32, color: OR, margin: '0 0 8px' }}>
          Restez dans la boucle
        </h2>
        <p style={{ color: 'rgba(14,12,9,0.55)', fontSize: 14, margin: '0 0 24px', lineHeight: 1.6 }}>
          {`Recevez les nouveaux articles Kadio directement dans votre boîte mail. Pas de spam, jamais.`}
        </p>
        {subDone ? (
          <div style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12, padding: '14px 20px', color: '#86efac', fontSize: 14, fontWeight: 600 }}>
            ✅ Abonnement confirmé ! À très bientôt.
          </div>
        ) : (
          <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 10, maxWidth: 400, margin: '0 auto', flexWrap: 'wrap' }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              style={{
                flex: 1, minWidth: 200, background: 'rgba(184,146,42,0.06)', border: `1px solid rgba(184,146,42,0.25)`,
                borderRadius: 10, color: NOIR, padding: '12px 16px', fontSize: 14, fontFamily: `'Inter', sans-serif`,
              }}
            />
            <button type="submit"
              style={{
                background: OR, color: NOIR, border: 'none', borderRadius: 10,
                padding: '12px 22px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                fontFamily: `'Inter', sans-serif`,
              }}
            >
              {`M'abonner`}
            </button>
          </form>
        )}
      </section>
    </div>
  )
}
