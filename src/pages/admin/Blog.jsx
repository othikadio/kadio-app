import { useState, useMemo } from 'react'
import { OR, CREME, NOIR, CARD, MUTED, BORDER_OR, formatDate } from '@/lib/utils'
import { useArticles } from '@/hooks'

const CATEGORIES = ['Tutoriels', 'Partenaires', 'Conseils', 'Événements', 'Communauté']

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function tempsLecture(contenu) {
  if (!contenu) return 0
  return Math.max(1, Math.ceil(contenu.trim().split(/\s+/).length / 200))
}

const catColor = (cat) => ({
  Tutoriels: '#7c3aed',
  Partenaires: '#059669',
  Conseils: '#0284c7',
  Communauté: '#d97706',
  Événements: '#db2777',
}[cat] || OR)

const EMPTY_FORM = {
  titre: '', categorie: 'Tutoriels', extrait: '', contenu: '',
  auteur: 'Équipe Kadio', tags: '', slug: '',
}

export default function AdminBlog() {
  const { data: articlesData = [], loading } = useArticles()
  const [articles, setArticles] = useState(articlesData)
  const [selectedSlug, setSelectedSlug] = useState(null)
  const [showForm, setShowForm]         = useState(false)
  const [form, setForm]                 = useState(EMPTY_FORM)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [toast, setToast]               = useState('')
  const [preview, setPreview]           = useState(false)

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const art = selectedSlug ? articles.find(a => a.slug === selectedSlug) : null

  function updateArt(changes) {
    setArticles(prev => prev.map(a => a.slug === selectedSlug ? { ...a, ...changes } : a))
  }

  function toggleStatut() {
    if (!art) return
    const next = art.statut === 'publie' ? 'brouillon' : 'publie'
    updateArt({ statut: next })
    showToast(next === 'publie' ? 'Article publié !' : 'Article dépublié')
  }

  function deleteArticle(slug) {
    setArticles(prev => prev.filter(a => a.slug !== slug))
    setSelectedSlug(null)
    setConfirmDelete(null)
    showToast('Article supprimé')
  }

  function handleTitreChange(val) {
    updateArt({ titre: val, slug: slugify(val) })
  }

  function handleTagsChange(val) {
    const tags = val.split(',').map(t => t.trim()).filter(Boolean)
    updateArt({ tags, tagsRaw: val })
  }

  function createArticle() {
    if (!form.titre.trim()) return
    const slug = form.slug || slugify(form.titre)
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean)
    const newArt = {
      slug,
      titre: form.titre,
      categorie: form.categorie,
      extrait: form.extrait,
      contenu: form.contenu,
      auteur: form.auteur,
      tags,
      date: new Date().toISOString().slice(0, 10),
      image: null,
      statut: 'brouillon',
      vues: 0,
      partages: 0,
    }
    setArticles(prev => [newArt, ...prev])
    setForm(EMPTY_FORM)
    setShowForm(false)
    showToast('Article créé en brouillon !')
  }

  const publies   = articles.filter(a => a.statut === 'publie').length
  const brouillons = articles.filter(a => a.statut === 'brouillon').length

  // ── Vue éditeur ────────────────────────────────────────────────
  if (art) {
    const paragraphes = art.contenu ? art.contenu.split('\n').filter(Boolean) : []

    return (
      <div style={{ padding: '24px', paddingBottom: '100px', color: NOIR, background: CREME, minHeight: '100vh' }}>
        {toast && (
          <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#14532d', border: '1px solid #22c55e', color: '#86efac', padding: '10px 18px', borderRadius: '8px', zIndex: 999, fontSize: '14px' }}>
            {toast}
          </div>
        )}

        {/* Confirm delete modal */}
        {confirmDelete && (
          <div style={{ position: 'fixed', inset: 0, background: '#000000cc', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div style={{ background: CARD, border: `1px solid rgba(239,68,68,0.4)`, borderRadius: '14px', padding: '24px', maxWidth: '360px', width: '100%' }}>
              <h3 style={{ color: '#f87171', margin: '0 0 12px', fontSize: '18px' }}>Supprimer l'article ?</h3>
              <p style={{ color: MUTED, fontSize: '13px', margin: '0 0 20px', lineHeight: 1.5 }}>
                Cette action est irréversible. L'article sera définitivement supprimé.
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setConfirmDelete(null)}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `1px solid ${BORDER_OR}`, background: 'none', color: MUTED, cursor: 'pointer', fontSize: '13px' }}>
                  Annuler
                </button>
                <button onClick={() => deleteArticle(art.slug)}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#ef4444', color: '#fff', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header éditeur */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: 8 }}>
          <button onClick={() => setSelectedSlug(null)}
            style={{ background: 'none', border: `1px solid ${BORDER_OR}`, color: MUTED, cursor: 'pointer', padding: '8px 14px', borderRadius: '8px', fontSize: '13px' }}>
            {`← Retour`}
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setPreview(p => !p)}
              style={{ padding: '8px 14px', borderRadius: '8px', border: `1px solid ${BORDER_OR}`, background: preview ? 'rgba(14,12,9,0.08)' : 'none', color: preview ? OR : MUTED, fontSize: '13px', cursor: 'pointer' }}>
              {preview ? '✏️ Éditer' : '👁 Aperçu'}
            </button>
            <button onClick={() => setConfirmDelete(art.slug)}
              style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)', background: 'none', color: '#f87171', fontSize: '13px', cursor: 'pointer' }}>
              Supprimer
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {[
            { label: 'Vues', val: art.vues ?? 0, color: '#60a5fa' },
            { label: 'Partages', val: art.partages ?? 0, color: '#34d399' },
            { label: 'Lecture', val: `${tempsLecture(art.contenu)} min`, color: OR },
            { label: 'Statut', val: art.statut === 'publie' ? 'Publié' : 'Brouillon', color: art.statut === 'publie' ? '#22c55e' : '#f59e0b' },
          ].map(s => (
            <div key={s.label} style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '10px', padding: '10px 16px', minWidth: 90 }}>
              <div style={{ color: s.color, fontWeight: 700, fontSize: '18px' }}>{s.val}</div>
              <div style={{ color: MUTED, fontSize: '11px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: preview ? '1fr 1fr' : '1fr', gap: '16px' }}>
          {/* Formulaire */}
          <div style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2 style={{ color: OR, fontSize: '16px', fontWeight: '700', margin: '0 0 4px' }}>Éditer l'article</h2>

            {[
              { label: 'Titre', field: 'titre', type: 'input', onChange: (v) => handleTitreChange(v) },
            ].map(({ label, field, onChange }) => (
              <div key={field}>
                <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 4px', textTransform: 'uppercase', fontWeight: 600 }}>{label}</p>
                <input
                  value={art[field]}
                  onChange={e => onChange ? onChange(e.target.value) : updateArt({ [field]: e.target.value })}
                  style={{ width: '100%', background: CREME, border: `1px solid ${BORDER_OR}`, borderRadius: '8px', color: NOIR, padding: '10px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
            ))}

            {/* Slug */}
            <div>
              <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 4px', textTransform: 'uppercase', fontWeight: 600 }}>Slug (URL)</p>
              <input
                value={art.slug}
                onChange={e => updateArt({ slug: e.target.value })}
                style={{ width: '100%', background: CREME, border: `1px solid ${BORDER_OR}`, borderRadius: '8px', color: 'rgba(184,146,42,0.7)', padding: '10px', fontSize: '12px', boxSizing: 'border-box', fontFamily: 'monospace' }}
              />
            </div>

            {/* Catégorie */}
            <div>
              <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 4px', textTransform: 'uppercase', fontWeight: 600 }}>Catégorie</p>
              <select
                value={art.categorie}
                onChange={e => updateArt({ categorie: e.target.value })}
                style={{ width: '100%', background: CREME, border: `1px solid ${BORDER_OR}`, borderRadius: '8px', color: NOIR, padding: '10px', fontSize: '13px', cursor: 'pointer' }}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Auteur */}
            <div>
              <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 4px', textTransform: 'uppercase', fontWeight: 600 }}>Auteur</p>
              <input
                value={art.auteur}
                onChange={e => updateArt({ auteur: e.target.value })}
                style={{ width: '100%', background: CREME, border: `1px solid ${BORDER_OR}`, borderRadius: '8px', color: NOIR, padding: '10px', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            {/* Tags */}
            <div>
              <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 4px', textTransform: 'uppercase', fontWeight: 600 }}>Tags (séparés par virgule)</p>
              <input
                value={art.tagsRaw ?? (art.tags || []).join(', ')}
                onChange={e => handleTagsChange(e.target.value)}
                placeholder="tresses, knotless, tendances"
                style={{ width: '100%', background: CREME, border: `1px solid ${BORDER_OR}`, borderRadius: '8px', color: NOIR, padding: '10px', fontSize: '13px', boxSizing: 'border-box' }}
              />
              {(art.tags || []).length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                  {art.tags.map(t => (
                    <span key={t} style={{ background: 'rgba(14,12,9,0.08)', border: `1px solid rgba(14,12,9,0.08)`, color: OR, borderRadius: 10, padding: '2px 8px', fontSize: 11 }}>#{t}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Extrait */}
            <div>
              <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 4px', textTransform: 'uppercase', fontWeight: 600 }}>Extrait</p>
              <textarea
                value={art.extrait}
                onChange={e => updateArt({ extrait: e.target.value })}
                style={{ width: '100%', minHeight: '70px', background: CREME, border: `1px solid ${BORDER_OR}`, borderRadius: '8px', color: NOIR, padding: '10px', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.6 }}
              />
            </div>

            {/* Contenu */}
            <div>
              <p style={{ color: MUTED, fontSize: '11px', margin: '0 0 4px', textTransform: 'uppercase', fontWeight: 600 }}>
                Contenu <span style={{ opacity: 0.5, textTransform: 'none', fontWeight: 400 }}>(paragraphes séparés par ligne vide)</span>
              </p>
              <textarea
                value={art.contenu}
                onChange={e => updateArt({ contenu: e.target.value })}
                style={{ width: '100%', minHeight: '200px', background: CREME, border: `1px solid ${BORDER_OR}`, borderRadius: '8px', color: NOIR, padding: '10px', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.7 }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: 4 }}>
              <button onClick={toggleStatut}
                style={{ flex: 1, padding: '11px', borderRadius: '8px', border: 'none', background: art.statut === 'publie' ? '#f59e0b' : '#22c55e', color: '#fff', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>
                {art.statut === 'publie' ? 'Dépublier' : '🚀 Publier'}
              </button>
              <button onClick={() => showToast('Sauvegardé !')}
                style={{ flex: 1, padding: '11px', borderRadius: '8px', border: 'none', background: OR, color: NOIR, fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>
                Sauvegarder
              </button>
            </div>
          </div>

          {/* Aperçu temps réel */}
          {preview && (
            <div style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '14px', padding: '20px', overflowY: 'auto', maxHeight: '80vh' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ background: `${catColor(art.categorie)}22`, color: catColor(art.categorie), borderRadius: 8, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>
                  {art.categorie.toUpperCase()}
                </span>
                <span style={{ color: MUTED, fontSize: 11 }}>{tempsLecture(art.contenu)} min de lecture</span>
              </div>
              <h2 style={{ fontFamily: `'Bebas Neue', sans-serif`, fontSize: '28px', color: NOIR, margin: '0 0 12px', lineHeight: 1.1 }}>
                {art.titre || `Titre de l'article`}
              </h2>
              <p style={{ color: 'rgba(14,12,9,0.5)', fontSize: '13px', margin: '0 0 18px', fontStyle: 'italic' }}>
                {art.extrait || `Extrait de l'article…`}
              </p>
              <div style={{ borderTop: `1px solid rgba(14,12,9,0.08)`, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {paragraphes.length > 0
                  ? paragraphes.map((p, i) => (
                    <p key={i} style={{ color: 'rgba(14,12,9,0.78)', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>{p}</p>
                  ))
                  : <p style={{ color: MUTED, fontSize: '13px' }}>Le contenu s'affichera ici…</p>
                }
              </div>
              {(art.tags || []).length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 20 }}>
                  {art.tags.map(t => (
                    <span key={t} style={{ background: 'rgba(14,12,9,0.08)', border: `1px solid rgba(14,12,9,0.08)`, color: OR, borderRadius: 12, padding: '3px 10px', fontSize: 11 }}>#{t}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Vue liste ──────────────────────────────────────────────────
  return (
    <div style={{ padding: '24px', paddingBottom: '100px', color: NOIR, background: CREME, minHeight: '100vh' }}>
      {loading && <div className="p-8 text-center text-zinc-400">Chargement...</div>}
      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#14532d', border: '1px solid #22c55e', color: '#86efac', padding: '10px 18px', borderRadius: '8px', zIndex: 999, fontSize: '14px' }}>
          {toast}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h1 style={{ color: OR, fontSize: '22px', fontWeight: '700', margin: '0 0 4px' }}>Blog</h1>
          <p style={{ color: MUTED, margin: 0, fontSize: '13px' }}>
            {articles.length} articles · <span style={{ color: '#22c55e' }}>{publies} publiés</span> · <span style={{ color: '#f59e0b' }}>{brouillons} brouillons</span>
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: OR, color: NOIR, fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>
          {`+ Nouvel article`}
        </button>
      </div>

      {/* Formulaire nouvel article */}
      {showForm && (
        <div style={{ background: CARD, border: `1px solid rgba(14,12,9,0.08)`, borderRadius: '12px', padding: '18px', marginBottom: '20px' }}>
          <h3 style={{ color: OR, fontSize: '14px', fontWeight: 700, margin: '0 0 14px' }}>Nouvel article</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
            <input
              placeholder="Titre *"
              value={form.titre}
              onChange={e => {
                const t = e.target.value
                setForm(p => ({ ...p, titre: t, slug: slugify(t) }))
              }}
              style={{ background: CREME, border: `1px solid ${BORDER_OR}`, borderRadius: '8px', color: NOIR, padding: '10px', fontSize: '13px' }}
            />
            {form.titre && (
              <div style={{ fontSize: '11px', color: MUTED, fontFamily: 'monospace' }}>
                /blog/<span style={{ color: OR }}>{form.slug}</span>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <select value={form.categorie} onChange={e => setForm(p => ({ ...p, categorie: e.target.value }))}
                style={{ background: CREME, border: `1px solid ${BORDER_OR}`, borderRadius: '8px', color: NOIR, padding: '10px', fontSize: '13px', cursor: 'pointer' }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input placeholder="Auteur" value={form.auteur} onChange={e => setForm(p => ({ ...p, auteur: e.target.value }))}
                style={{ background: CREME, border: `1px solid ${BORDER_OR}`, borderRadius: '8px', color: NOIR, padding: '10px', fontSize: '13px' }} />
            </div>
            <input placeholder="Tags (séparés par virgule)" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))}
              style={{ background: CREME, border: `1px solid ${BORDER_OR}`, borderRadius: '8px', color: NOIR, padding: '10px', fontSize: '13px' }} />
            <textarea placeholder="Extrait" value={form.extrait} onChange={e => setForm(p => ({ ...p, extrait: e.target.value }))} rows={2}
              style={{ background: CREME, border: `1px solid ${BORDER_OR}`, borderRadius: '8px', color: NOIR, padding: '10px', fontSize: '13px', resize: 'vertical' }} />
            <textarea placeholder="Contenu (paragraphes séparés par ligne vide)" value={form.contenu} onChange={e => setForm(p => ({ ...p, contenu: e.target.value }))} rows={5}
              style={{ background: CREME, border: `1px solid ${BORDER_OR}`, borderRadius: '8px', color: NOIR, padding: '10px', fontSize: '13px', resize: 'vertical', lineHeight: 1.6 }} />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => { setShowForm(false); setForm(EMPTY_FORM) }}
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `1px solid ${BORDER_OR}`, background: 'none', color: MUTED, cursor: 'pointer', fontSize: '13px' }}>
              Annuler
            </button>
            <button onClick={createArticle} disabled={!form.titre.trim()}
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: form.titre.trim() ? OR : 'rgba(14,12,9,0.08)', color: form.titre.trim() ? NOIR : MUTED, fontWeight: '700', cursor: form.titre.trim() ? 'pointer' : 'not-allowed', fontSize: '13px' }}>
              Créer en brouillon
            </button>
          </div>
        </div>
      )}

      {/* Liste articles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {articles.map(a => (
          <div key={a.slug}
            onClick={() => setSelectedSlug(a.slug)}
            style={{ background: CARD, border: `1px solid ${BORDER_OR}`, borderRadius: '12px', padding: '14px 16px', cursor: 'pointer', transition: 'border-color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(184,146,42,0.4)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(14,12,9,0.08)'}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px', gap: 10 }}>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: NOIR, flex: 1, lineHeight: 1.4 }}>{a.titre}</h3>
              <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: a.statut === 'publie' ? '#22c55e22' : '#f59e0b22', color: a.statut === 'publie' ? '#22c55e' : '#f59e0b', fontWeight: '600', flexShrink: 0, whiteSpace: 'nowrap' }}>
                {a.statut === 'publie' ? 'Publié' : 'Brouillon'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ background: `${catColor(a.categorie)}22`, color: catColor(a.categorie), fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>{a.categorie}</span>
              <span style={{ color: MUTED, fontSize: '11px' }}>{formatDate(a.date)}</span>
              <span style={{ color: MUTED, fontSize: '11px' }}>· {a.auteur}</span>
              <span style={{ color: MUTED, fontSize: '11px' }}>· {tempsLecture(a.contenu)} min</span>
              {a.statut === 'publie' && (
                <>
                  <span style={{ color: '#60a5fa', fontSize: '11px' }}>· 👁 {a.vues ?? 0}</span>
                  <span style={{ color: '#34d399', fontSize: '11px' }}>· ↗ {a.partages ?? 0}</span>
                </>
              )}
            </div>
            {(a.tags || []).length > 0 && (
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 8 }}>
                {a.tags.map(t => (
                  <span key={t} style={{ background: 'rgba(184,146,42,0.07)', border: `1px solid rgba(14,12,9,0.08)`, color: 'rgba(184,146,42,0.6)', borderRadius: 8, padding: '1px 7px', fontSize: 10 }}>#{t}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
