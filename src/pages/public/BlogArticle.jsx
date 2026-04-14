import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { OR, CREME, NOIR, CARD } from '@/lib/utils'
import { useArticle, useArticles } from '@/hooks/useArticles'
import { MOCK_COMMENTS } from '@/data/mockPublic'

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

export default function BlogArticle() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { data: article, loading } = useArticle(slug)
  const { data: allArticles } = useArticles()

  const [commentaires, setCommentaires] = useState(MOCK_COMMENTS[slug] || [])
  const [prenom, setPrenom]             = useState('')
  const [message, setMessage]           = useState('')
  const [copied, setCopied]             = useState(false)

  if (!article) {
    return (
      <div style={{
        background: CREME, minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '40px 24px',
        fontFamily: `'Inter', sans-serif`, textAlign: 'center', color: NOIR,
      }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>📄</div>
        <h1 style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 48, color: NOIR, margin: '0 0 12px' }}>
          Article introuvable
        </h1>
        <p style={{ color: 'rgba(14,12,9,0.55)', fontSize: 15, marginBottom: 28 }}>
          {`Cet article n'existe pas ou a été retiré.`}
        </p>
        <Link to="/blog"
          style={{ padding: '12px 28px', background: OR, color: NOIR, borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
          ← Retour au blog
        </Link>
      </div>
    )
  }

  const similaires  = (allArticles || []).filter(a => a.slug !== slug && a.statut === 'publie').slice(0, 2)
  const paragraphes = article.contenu.split('\n').filter(Boolean)
  const duree       = tempsLecture(article.contenu)

  const waText   = encodeURIComponent(`Découvre cet article de Kadio : ${article.titre} — ${window.location.href}`)
  const waUrl    = `https://wa.me/?text=${waText}`

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handleComment(e) {
    e.preventDefault()
    if (!prenom.trim() || !message.trim()) return
    const newComment = {
      id: `c-${Date.now()}`,
      prenom: prenom.trim(),
      date: new Date().toISOString().slice(0, 10),
      message: message.trim(),
    }
    setCommentaires(prev => [...prev, newComment])
    setPrenom('')
    setMessage('')
  }

  return (
    <div style={{ background: CREME, color: NOIR, minHeight: '100vh', fontFamily: `'Inter', sans-serif` }}>

      {/* ── BACK BUTTON ─── */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px 0' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'transparent', border: `1px solid rgba(184,146,42,0.25)`,
            color: 'rgba(14,12,9,0.6)', borderRadius: 8, padding: '8px 16px',
            fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          ← Retour
        </button>
      </div>

      {/* ── ARTICLE HEADER ─── */}
      <article style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px 0' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <span style={{
            background: `${catColor(article.categorie)}22`, color: catColor(article.categorie),
            borderRadius: 8, padding: '3px 12px', fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
          }}>
            {article.categorie.toUpperCase()}
          </span>
          <span style={{ color: 'rgba(14,12,9,0.45)', fontSize: 13 }}>{formatDateFR(article.date)}</span>
          <span style={{ color: OR, fontSize: 12, fontWeight: 600, background: 'rgba(14,12,9,0.08)', padding: '2px 10px', borderRadius: 10 }}>
            ⏱ {duree} min de lecture
          </span>
        </div>

        <h1 style={{
          fontFamily: `'Bebas Neue', sans-serif`,
          fontSize: 'clamp(32px, 6vw, 56px)',
          color: NOIR, margin: '0 0 20px', lineHeight: 1.05, letterSpacing: 0.5,
        }}>
          {article.titre}
        </h1>

        {/* Auteur + partage */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
          padding: '14px 0', borderTop: `1px solid rgba(14,12,9,0.08)`, borderBottom: `1px solid rgba(14,12,9,0.08)`,
          marginBottom: 36,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: `linear-gradient(135deg, ${OR}, #a88520)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 14, color: NOIR, flexShrink: 0,
            }}>
              {article.auteur[0]}
            </div>
            <div>
              <div style={{ color: NOIR, fontWeight: 600, fontSize: 14 }}>{article.auteur}</div>
              <div style={{ color: 'rgba(14,12,9,0.45)', fontSize: 12 }}>{formatDateFR(article.date)}</div>
            </div>
          </div>

          {/* Boutons partage */}
          <div style={{ display: 'flex', gap: 8 }}>
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: '#25D366', color: '#fff', border: 'none', borderRadius: 8,
                padding: '7px 14px', fontSize: 12, fontWeight: 600, textDecoration: 'none', cursor: 'pointer',
              }}>
              <svg viewBox="0 0 24 24" fill="white" width="14" height="14">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
            <button onClick={handleCopyLink}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(14,12,9,0.08)',
                border: `1px solid ${copied ? 'rgba(34,197,94,0.4)' : 'rgba(184,146,42,0.25)'}`,
                color: copied ? '#86efac' : CREME, borderRadius: 8, padding: '7px 14px',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}>
              {copied ? '✓ Copié !' : '🔗 Copier le lien'}
            </button>
          </div>
        </div>

        {/* ── CONTENU ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {paragraphes.map((para, idx) => (
            <p key={idx} style={{ color: 'rgba(14,12,9,0.82)', fontSize: 16, lineHeight: 1.8, margin: 0 }}>
              {para}
            </p>
          ))}
        </div>

        {/* ── TAGS ─── */}
        {article.tags && article.tags.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 40 }}>
            {article.tags.map(tag => (
              <Link key={tag} to={`/blog?tag=${tag}`}
                style={{
                  background: 'rgba(14,12,9,0.08)', border: `1px solid rgba(184,146,42,0.25)`,
                  color: OR, borderRadius: 16, padding: '4px 12px', fontSize: 12, fontWeight: 500,
                  textDecoration: 'none',
                }}>
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </article>

      {/* ── COMMENTAIRES ─── */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px 0' }}>
        <div style={{ borderTop: `1px solid rgba(184,146,42,0.12)`, paddingTop: 40 }}>
          <h2 style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 28, color: NOIR, margin: '0 0 24px' }}>
            {commentaires.length > 0 ? `${commentaires.length} commentaire${commentaires.length > 1 ? 's' : ''}` : 'Commentaires'}
          </h2>

          {commentaires.length === 0 && (
            <p style={{ color: 'rgba(14,12,9,0.4)', fontSize: 14, marginBottom: 24 }}>
              {`Soyez le premier à commenter cet article.`}
            </p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
            {commentaires.map(c => (
              <div key={c.id} style={{
                background: CARD, border: `1px solid rgba(14,12,9,0.08)`,
                borderRadius: 12, padding: '16px 18px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg, ${OR}, #a88520)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 13, color: NOIR, flexShrink: 0,
                  }}>
                    {c.prenom[0]}
                  </div>
                  <div>
                    <div style={{ color: NOIR, fontWeight: 600, fontSize: 14 }}>{c.prenom}</div>
                    <div style={{ color: 'rgba(14,12,9,0.35)', fontSize: 11 }}>{formatDateFR(c.date)}</div>
                  </div>
                </div>
                <p style={{ color: 'rgba(14,12,9,0.75)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{c.message}</p>
              </div>
            ))}
          </div>

          {/* Formulaire commentaire */}
          <div style={{ background: CARD, border: `1px solid rgba(14,12,9,0.08)`, borderRadius: 14, padding: '24px 20px' }}>
            <h3 style={{ color: OR, fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>Laisser un commentaire</h3>
            <form onSubmit={handleComment} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                value={prenom}
                onChange={e => setPrenom(e.target.value)}
                placeholder="Votre prénom *"
                required
                style={{
                  background: CREME, border: `1px solid rgba(14,12,9,0.08)`, borderRadius: 8,
                  color: NOIR, padding: '10px 14px', fontSize: 14, fontFamily: `'Inter', sans-serif`,
                }}
              />
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Votre commentaire *"
                required
                rows={4}
                style={{
                  background: CREME, border: `1px solid rgba(14,12,9,0.08)`, borderRadius: 8,
                  color: NOIR, padding: '10px 14px', fontSize: 14, resize: 'vertical',
                  fontFamily: `'Inter', sans-serif`, lineHeight: 1.6,
                }}
              />
              <button type="submit"
                style={{
                  background: OR, color: NOIR, border: 'none', borderRadius: 8,
                  padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  fontFamily: `'Inter', sans-serif`, alignSelf: 'flex-start', minWidth: 160,
                }}>
                Publier le commentaire
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── ARTICLES SIMILAIRES ─── */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ borderTop: `1px solid rgba(14,12,9,0.08)`, paddingTop: 40 }}>
          <h2 style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 28, color: NOIR, margin: '0 0 24px' }}>
            Articles similaires
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {similaires.map(sim => (
              <Link key={sim.slug} to={`/blog/${sim.slug}`} style={{ textDecoration: 'none' }}>
                <div
                  style={{ background: CARD, borderRadius: 14, overflow: 'hidden', border: `1px solid rgba(184,146,42,0.12)`, cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(184,146,42,0.35)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(184,146,42,0.12)'}
                >
                  <div style={{
                    height: 100, background: `linear-gradient(135deg, ${catColor(sim.categorie)}18, ${NOIR})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: 40, color: `${catColor(sim.categorie)}25` }}>KADIO</span>
                  </div>
                  <div style={{ padding: '16px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ background: `${catColor(sim.categorie)}20`, color: catColor(sim.categorie), borderRadius: 6, padding: '1px 8px', fontSize: 10, fontWeight: 700 }}>
                        {sim.categorie.toUpperCase()}
                      </span>
                      <span style={{ color: 'rgba(14,12,9,0.35)', fontSize: 11 }}>{formatDateFR(sim.date)}</span>
                    </div>
                    <h3 style={{
                      color: NOIR, fontWeight: 600, fontSize: 14, margin: '0 0 6px', lineHeight: 1.4,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      {sim.titre}
                    </h3>
                    <div style={{ color: OR, fontSize: 12, fontWeight: 600, marginTop: 8 }}>Lire →</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
