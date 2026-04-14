import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { usePartenaireProfil } from '@/hooks'
import { OR, CREME, NOIR, CARD, initiales } from '@/lib/utils'

const SPECIALITES_OPTIONS = [
  'Tresses classiques', 'Knotless braids', 'Locs installation', 'Locs entretien',
  'Barbier', 'Coupes enfants', 'Tissage', 'Crochet braids', 'Soins',
]

const LANGUES_OPTIONS = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'ht', label: 'Kreyòl' },
  { code: 'wo', label: 'Wolof' },
  { code: 'ln', label: 'Lingala' },
  { code: 'bm', label: 'Bambara' },
]

const MODES_OPTIONS = [
  { code: 'au_salon',              label: '🏠 Salon Kadio',           desc: '50% · chaise incluse' },
  { code: 'chez_coiffeur',         label: '✂️ À domicile chez toi',   desc: '75% · le plus demandé' },
  { code: 'deplacement_voiture',   label: '🚗 Déplacement voiture',   desc: '75% · km remboursés' },
  { code: 'deplacement_transport', label: '🚌 Transport en commun',   desc: '75% · transport inclus' },
  { code: 'mode_mixte',            label: '🔄 Mode mixte',            desc: '75% · flexible' },
]

const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

const DEFAULT_HORAIRES = {
  0: { actif: true, debut: '09:00', fin: '18:00' },
  1: { actif: false, debut: '09:00', fin: '18:00' },
  2: { actif: true, debut: '09:00', fin: '18:00' },
  3: { actif: true, debut: '09:00', fin: '18:00' },
  4: { actif: true, debut: '09:00', fin: '18:00' },
  5: { actif: true, debut: '09:00', fin: '18:00' },
  6: { actif: false, debut: '09:00', fin: '18:00' },
}

export default function PartenaireProfil() {
  const { partenaire } = useAuthStore()
  const userId = partenaire?.user_id || 'usr-diane'

  const { data: profil, loading } = usePartenaireProfil(userId)

  if (loading) {
    return <div style={{ fontFamily: `'DM Sans', sans-serif`, color: NOIR, padding: '16px', textAlign: 'center' }}>Chargement...</div>
  }

  const p = profil || {}

  const [prenom, setPrenom] = useState(p.prenom || 'Diane')
  const [nom, setNom] = useState(p.nom || 'Mbaye')
  const [bio, setBio] = useState(p.bio || `Coiffeuse spécialisée en tresses knotless depuis 6 ans.`)
  const [ville, setVille] = useState(p.ville || 'Longueuil')
  const [specialites, setSpecialites] = useState(new Set(['Tresses classiques', 'Knotless braids', 'Locs installation']))
  const [langues, setLangues] = useState(new Set(['fr', 'wo', 'en']))
  const [modes, setModes] = useState(new Set(['chez_coiffeur', 'deplacement_voiture', 'mode_mixte']))
  const [horaires, setHoraires] = useState(DEFAULT_HORAIRES)
  const [instagram, setInstagram] = useState(p.instagram || '@diane.coiffure')
  const [tiktok, setTiktok] = useState(p.tiktok || '@diane_tresses')
  const [saved, setSaved] = useState(false)

  function toggle(set, setFn, val) {
    setFn(prev => {
      const nv = new Set(prev)
      if (nv.has(val)) nv.delete(val)
      else nv.add(val)
      return nv
    })
  }

  function toggleHoraire(i, field, value) {
    setHoraires(prev => ({
      ...prev,
      [i]: { ...prev[i], [field]: value },
    }))
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const inputStyle = {
    width: '100%', background: '#FAFAF8', border: `1px solid rgba(184,146,42,0.25)`,
    borderRadius: '10px', padding: '10px 12px', color: NOIR,
    fontFamily: `'DM Sans', sans-serif`, fontSize: '14px', boxSizing: 'border-box',
  }

  const labelStyle = {
    fontSize: '12px', color: `rgba(14,12,9,0.5)`, display: 'block', marginBottom: '6px',
  }

  const sectionStyle = {
    background: CARD, borderRadius: '14px', padding: '16px', marginBottom: '14px',
    border: `1px solid rgba(14,12,9,0.08)`,
  }

  const sectionTitleStyle = {
    fontSize: '14px', fontWeight: 700, marginBottom: '14px', color: OR,
  }

  const checkboxStyle = (active) => ({
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    padding: '6px 12px', borderRadius: '999px', margin: '0 6px 6px 0',
    background: active ? `rgba(14,12,9,0.08)` : `rgba(184,146,42,0.05)`,
    border: `1px solid ${active ? OR : 'rgba(14,12,9,0.08)'}`,
    color: active ? OR : `rgba(14,12,9,0.55)`,
    cursor: 'pointer', fontSize: '12px', fontWeight: 600,
    fontFamily: `'DM Sans', sans-serif`,
  })

  return (
    <div style={{ fontFamily: `'DM Sans', sans-serif`, color: NOIR, padding: '16px', paddingBottom: '100px' }}>
      <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>Mon profil</div>

      {/* 1. Photo */}
      <div style={{ ...sectionStyle, display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: `rgba(14,12,9,0.08)`, border: `2px solid ${OR}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '22px', fontWeight: 700, color: OR, flexShrink: 0,
        }}>
          {initiales(prenom, nom)}
        </div>
        <div>
          <div style={{ fontWeight: 700, marginBottom: '6px' }}>{prenom} {nom}</div>
          <button
            onClick={() => alert(`Fonctionnalité disponible en prod`)}
            style={{
              background: 'transparent', border: `1px solid rgba(14,12,9,0.08)`,
              borderRadius: '8px', padding: '6px 12px', color: OR,
              fontSize: '12px', cursor: 'pointer', fontFamily: `'DM Sans', sans-serif`,
            }}>
            Modifier la photo
          </button>
        </div>
      </div>

      {/* 2. Informations personnelles */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Informations personnelles</div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Prénom</label>
            <input value={prenom} onChange={e => setPrenom(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Nom</label>
            <input value={nom} onChange={e => setNom(e.target.value)} style={inputStyle} />
          </div>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>Bio ({bio.length}/200 caractères)</label>
          <textarea
            value={bio} onChange={e => e.target.value.length <= 200 && setBio(e.target.value)}
            rows={3}
            style={{ ...inputStyle, resize: 'none' }}
          />
        </div>
        <div>
          <label style={labelStyle}>Ville</label>
          <input value={ville} onChange={e => setVille(e.target.value)} style={inputStyle} />
        </div>
      </div>

      {/* 3. Spécialités */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Spécialités</div>
        <div style={{ flexWrap: 'wrap', display: 'flex' }}>
          {SPECIALITES_OPTIONS.map(s => (
            <button key={s} onClick={() => toggle(specialites, setSpecialites, s)}
              style={checkboxStyle(specialites.has(s))}>
              {specialites.has(s) ? '✓ ' : ''}{s}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Langues */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Langues parlées</div>
        <div style={{ flexWrap: 'wrap', display: 'flex' }}>
          {LANGUES_OPTIONS.map(l => (
            <button key={l.code} onClick={() => toggle(langues, setLangues, l.code)}
              style={checkboxStyle(langues.has(l.code))}>
              {langues.has(l.code) ? '✓ ' : ''}{l.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Modes de travail */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Modes de travail</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {MODES_OPTIONS.map(m => (
            <button key={m.code} onClick={() => toggle(modes, setModes, m.code)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', borderRadius: '10px', textAlign: 'left',
                background: modes.has(m.code) ? `rgba(184,146,42,0.12)` : `rgba(184,146,42,0.04)`,
                border: `1px solid ${modes.has(m.code) ? OR : 'rgba(14,12,9,0.08)'}`,
                cursor: 'pointer', fontFamily: `'DM Sans', sans-serif`,
              }}>
              <div>
                <div style={{ color: modes.has(m.code) ? OR : CREME, fontWeight: 600, fontSize: '13px' }}>
                  {modes.has(m.code) ? '✓ ' : ''}{m.label}
                </div>
                <div style={{ color: 'rgba(14,12,9,0.45)', fontSize: '11px', marginTop: '2px' }}>{m.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 6. Horaires habituels */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Horaires habituels</div>
        {JOURS.map((jour, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <button
              onClick={() => toggleHoraire(i, 'actif', !horaires[i].actif)}
              style={{
                width: '42px', padding: '5px 0', borderRadius: '6px',
                background: horaires[i].actif ? OR : `rgba(14,12,9,0.08)`,
                color: horaires[i].actif ? '#0E0C09' : `rgba(250,248,248,0.4)`,
                border: 'none', fontWeight: 700, fontSize: '11px', cursor: 'pointer',
                fontFamily: `'DM Sans', sans-serif`,
              }}>
              {jour}
            </button>
            {horaires[i].actif && (
              <>
                <input type="time" value={horaires[i].debut}
                  onChange={e => toggleHoraire(i, 'debut', e.target.value)}
                  style={{ ...inputStyle, width: 'auto', flex: 1, padding: '6px 8px' }}
                />
                <span style={{ color: `rgba(14,12,9,0.4)`, fontSize: '12px' }}>—</span>
                <input type="time" value={horaires[i].fin}
                  onChange={e => toggleHoraire(i, 'fin', e.target.value)}
                  style={{ ...inputStyle, width: 'auto', flex: 1, padding: '6px 8px' }}
                />
              </>
            )}
            {!horaires[i].actif && (
              <span style={{ fontSize: '12px', color: `rgba(14,12,9,0.3)` }}>Indisponible</span>
            )}
          </div>
        ))}
      </div>

      {/* 7. Réseaux sociaux */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Réseaux sociaux</div>
        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>Instagram</label>
          <input value={instagram} onChange={e => setInstagram(e.target.value)} style={inputStyle} placeholder="@votre.profil" />
        </div>
        <div>
          <label style={labelStyle}>TikTok</label>
          <input value={tiktok} onChange={e => setTiktok(e.target.value)} style={inputStyle} placeholder="@votre.profil" />
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        style={{
          width: '100%', background: OR, color: '#0E0C09', border: 'none',
          borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: 700,
          cursor: 'pointer', fontFamily: `'DM Sans', sans-serif`, marginBottom: '12px',
        }}>
        Enregistrer
      </button>
      {saved && (
        <div style={{ textAlign: 'center', color: '#22c55e', fontWeight: 700, fontSize: '14px', marginBottom: '12px' }}>
          ✓ Profil mis à jour
        </div>
      )}

      {/* Danger zone */}
      <div style={{ textAlign: 'center', paddingTop: '8px', borderTop: `1px solid rgba(14,12,9,0.08)`, marginTop: '8px' }}>
        <button
          onClick={() => alert(`Contactez le support pour désactiver votre compte.`)}
          style={{
            background: 'none', border: 'none', color: 'rgba(239,68,68,0.6)',
            fontSize: '13px', cursor: 'pointer', fontFamily: `'DM Sans', sans-serif`,
            textDecoration: 'underline',
          }}>
          Désactiver mon compte
        </button>
      </div>
    </div>
  )
}
