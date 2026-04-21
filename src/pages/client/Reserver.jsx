import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { OR, CREME, NOIR, CARD, formatDate, genQRCode, initiales } from '@/lib/utils'
import { usePartenairesPublic } from '@/hooks/usePartenaires'
import { useServicesPublic } from '@/hooks/useServices'
import { useCreateRdv } from '@/hooks/useRendezvous'
import { MOCK_CRENEAUX } from '@/data/mockClient'
import { createCheckoutSession } from '@/lib/stripe'

const LIEUX = [
  { id: 'au_salon',              label: 'Au salon Kadio',          icon: '🏠', note: 'Tu te rends au salon — prix salon appliqués',             prix_key: 'salon'    },
  { id: 'chez_coiffeur',         label: 'Chez le coiffeur',        icon: '✂️', note: 'Tu te déplaces chez le coiffeur — mode le plus demandé',  prix_key: 'salon'    },
  { id: 'deplacement_voiture',   label: 'Le coiffeur vient (🚗)',  icon: '🚗', note: 'Le coiffeur se déplace chez toi en voiture + frais km',   prix_key: 'domicile' },
  { id: 'deplacement_transport', label: 'Le coiffeur vient (🚌)',  icon: '🚌', note: 'Le coiffeur se déplace en transport en commun + frais',   prix_key: 'domicile' },
  { id: 'mode_mixte',            label: 'Flexible — au choix',     icon: '🔄', note: 'Le coiffeur choisit son mode selon ses disponibilités',   prix_key: 'salon'    },
]

const TEST_CARDS = [
  { num: '4242 4242 4242 4242', label: 'Succès' },
  { num: '4000 0000 0000 0002', label: 'Refusée' },
]

// Format numéro carte: 4242424242424242 → 4242 4242 4242 4242
function fmtCard(val) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}
// Format expiration: 1234 → 12/34
function fmtExpiry(val) {
  const d = val.replace(/\D/g, '').slice(0, 4)
  return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d
}

function ProgressDots({ step, total }) {
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: i === step ? 24 : 8, height: 8, borderRadius: 4,
          background: i === step ? OR : i < step ? 'rgba(184,146,42,0.4)' : 'rgba(14,12,9,0.15)',
          transition: 'all 0.2s',
        }} />
      ))}
    </div>
  )
}

export default function ClientReserver() {
  const { partenaireId } = useParams()
  const navigate = useNavigate()

  const { data: partenaires } = usePartenairesPublic()
  const { data: services } = useServicesPublic()
  const { mutate: creerRdv } = useCreateRdv()

  const partenaire = partenaires?.find(p => p.id === partenaireId) || partenaires?.[0]

  const [step, setStep] = useState(0)
  const [selectedService, setSelectedService] = useState(null)
  const [selectedLieu, setSelectedLieu]       = useState(null)
  const [selectedDate, setSelectedDate]       = useState(null)
  const [selectedCreneau, setSelectedCreneau] = useState(null)
  const [confirmedCode] = useState(genQRCode())

  // Paiement Stripe
  const [cardNum, setCardNum]     = useState('')
  const [expiry, setExpiry]       = useState('')
  const [cvv, setCvv]             = useState('')
  const [paying, setPaying]       = useState(false)
  const [payError, setPayError]   = useState('')

  const filteredServices = services?.filter(s =>
    partenaire?.specialites.some(sp => sp.toLowerCase().includes(s.cat.toLowerCase()) || s.cat.toLowerCase().includes(sp.toLowerCase()))
  ) || []

  const creneauxParDate = (MOCK_CRENEAUX || []).reduce((acc, c) => {
    if (!acc[c.date]) acc[c.date] = []
    acc[c.date].push(c)
    return acc
  }, {})
  const dates = Object.keys(creneauxParDate).sort()

  const prixService = selectedService && selectedLieu
    ? selectedService[selectedLieu.prix_key]
    : selectedService ? selectedService.salon : 0
  const depot = Math.round(prixService * 0.2)

  const cardValid = cardNum.replace(/\s/g, '').length === 16
  const expiryValid = /^\d{2}\/\d{2}$/.test(expiry)
  const cvvValid = /^\d{3}$/.test(cvv)
  const formValid = cardValid && expiryValid && cvvValid

  function canNext() {
    if (step === 0) return !!selectedService
    if (step === 1) return !!selectedLieu
    if (step === 2) return !!selectedCreneau
    return true
  }

  async function handlePay() {
    if (!formValid || paying) return
    setPaying(true)
    setPayError('')
    const result = await createCheckoutSession({
      montant: depot * 100,
      description: selectedService?.nom,
      rdvId: confirmedCode
    })
    setPaying(false)
    if (result?.url) {
      window.location.href = result.url
    } else if (result?.ok) {
      setStep(5)
    } else {
      setPayError(result?.message || 'Paiement échoué. Réessayez.')
    }
  }

  return (
    <div style={{ fontFamily: `'DM Sans', sans-serif`, background: CREME, minHeight: '100vh', paddingBottom: 100 }}>

      {/* Header */}
      <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <button
          onClick={step > 0 && step < 5 ? () => { setStep(s => s - 1); setPayError('') } : () => navigate(-1)}
          style={{ background: 'none', border: 'none', color: OR, fontSize: 22, cursor: 'pointer', padding: 4 }}
        >
          ←
        </button>
        <div>
          <h1 style={{ color: NOIR, fontSize: 18, fontWeight: 700, margin: 0 }}>Réserver</h1>
          <p style={{ color: 'rgba(14,12,9,0.5)', fontSize: 12, margin: 0 }}>
            {partenaire.prenom} {partenaire.nom}
          </p>
        </div>
      </div>

      <div style={{ padding: '16px 20px' }}>
        <ProgressDots step={step} total={6} />

        {/* ── STEP 0: Service ── */}
        {step === 0 && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: CARD, borderRadius: 12, border: '1px solid rgba(14,12,9,0.08)' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(14,12,9,0.08)', border: `2px solid ${OR}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, color: OR, flexShrink: 0 }}>
                  {initiales(partenaire.prenom, partenaire.nom)}
                </div>
                <div>
                  <div style={{ color: NOIR, fontWeight: 600, fontSize: 15 }}>{partenaire.prenom} {partenaire.nom}</div>
                  <div style={{ color: 'rgba(14,12,9,0.5)', fontSize: 12 }}>{partenaire.specialites.join(' · ')}</div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <span style={{ color: OR, fontWeight: 700, fontSize: 14 }}>⭐ {partenaire.note}</span>
                  <span style={{ background: '#22c55e22', color: '#4ade80', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6 }}>Disponible aujourd'hui</span>
                </div>
              </div>
              <div style={{ marginTop: 6, fontSize: 12, color: 'rgba(14,12,9,0.4)', paddingLeft: 4 }}>
                87 services rendus · Répond en moins de 2h
              </div>
            </div>
            <h2 style={{ color: NOIR, fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Choisir un service</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filteredServices.map((s, idx) => {
                const isSelected = selectedService?.nom === s.nom
                const dureeH = Math.round(s.domicile / 40)
                const hints = [`⏱ Réservé 3 fois aujourd'hui`, '🔥 Très demandé cette semaine', `📅 Prochain dispo : aujourd'hui 15h30`, '⭐ Très bien noté par nos clients']
                const hint = hints[idx % hints.length]
                return (
                  <div key={s.nom} onClick={() => setSelectedService(s)} style={{ padding: '14px 16px', background: CARD, border: `1.5px solid ${isSelected ? OR : 'rgba(14,12,9,0.08)'}`, borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ color: NOIR, fontWeight: 600, fontSize: 14 }}>{s.nom}</div>
                      <div style={{ color: 'rgba(14,12,9,0.45)', fontSize: 12, marginTop: 2 }}>~{dureeH}h · {s.cat}</div>
                      <div style={{ color: OR, fontSize: 11, marginTop: 3, fontWeight: 500 }}>{hint}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: OR, fontWeight: 700, fontSize: 15 }}>{s.salon} $</div>
                      <div style={{ color: 'rgba(14,12,9,0.35)', fontSize: 11 }}>à partir de</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── STEP 1: Lieu ── */}
        {step === 1 && (
          <div>
            <h2 style={{ color: NOIR, fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Choisir le lieu</h2>
            {selectedService && <p style={{ color: 'rgba(14,12,9,0.5)', fontSize: 13, marginBottom: 18 }}>Service : {selectedService.nom}</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {LIEUX.map(l => {
                const isSelected = selectedLieu?.id === l.id
                const prix = selectedService ? selectedService[l.prix_key] : 0
                return (
                  <div key={l.id} onClick={() => setSelectedLieu(l)} style={{ padding: '16px 18px', background: CARD, border: `1.5px solid ${isSelected ? OR : 'rgba(14,12,9,0.08)'}`, borderRadius: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ fontSize: 26 }}>{l.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: NOIR, fontWeight: 600, fontSize: 15 }}>{l.label}</div>
                      <div style={{ color: 'rgba(14,12,9,0.45)', fontSize: 12, marginTop: 2 }}>{l.note}</div>
                    </div>
                    <div style={{ color: OR, fontWeight: 700, fontSize: 16 }}>{prix} $</div>
                  </div>
                )
              })}
            </div>
            {selectedLieu && selectedService && (
              <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(184,146,42,0.08)', border: `1px solid rgba(14,12,9,0.08)`, borderRadius: 10 }}>
                <span style={{ color: 'rgba(14,12,9,0.6)', fontSize: 13 }}>Prix total estimé : </span>
                <span style={{ color: OR, fontWeight: 700, fontSize: 16 }}>{selectedService[selectedLieu.prix_key]} $</span>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: Date & Heure ── */}
        {step === 2 && (
          <div>
            <h2 style={{ color: NOIR, fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Choisir une date</h2>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 20 }}>
              {dates.map(d => {
                const isSelected = selectedDate === d
                const dateObj = new Date(d + 'T00:00:00')
                const label = dateObj.toLocaleDateString('fr-CA', { weekday: 'short', month: 'short', day: 'numeric' })
                return (
                  <button key={d} onClick={() => { setSelectedDate(d); setSelectedCreneau(null) }}
                    style={{ padding: '8px 14px', borderRadius: 20, border: `1.5px solid ${isSelected ? OR : 'rgba(184,146,42,0.25)'}`, background: isSelected ? OR : 'transparent', color: isSelected ? NOIR : CREME, fontWeight: 600, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, fontFamily: `'DM Sans', sans-serif` }}>
                    {label}
                  </button>
                )
              })}
            </div>
            {selectedDate && (
              <div>
                <p style={{ color: 'rgba(14,12,9,0.5)', fontSize: 13, marginBottom: 12 }}>Créneaux disponibles</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {creneauxParDate[selectedDate]?.map((c, idx) => {
                    const isSelected = selectedCreneau?.id === c.id
                    const isLastSlot = c.dispo && idx === creneauxParDate[selectedDate].filter(x => x.dispo).length - 1
                    return (
                      <div key={c.id} style={{ position: 'relative' }}>
                        {isLastSlot && (
                          <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: '#ef4444', color: '#fff', fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 4, whiteSpace: 'nowrap' }}>
                            Dernière place
                          </div>
                        )}
                        <button onClick={() => c.dispo && setSelectedCreneau(c)}
                          style={{ padding: '10px 18px', borderRadius: 10, border: `1.5px solid ${isSelected ? OR : c.dispo ? (isLastSlot ? '#ef4444' : 'rgba(14,12,9,0.08)') : 'rgba(107,114,128,0.3)'}`, background: isSelected ? OR : c.dispo ? 'transparent' : 'rgba(107,114,128,0.1)', color: isSelected ? NOIR : c.dispo ? CREME : 'rgba(14,12,9,0.25)', fontWeight: 600, fontSize: 14, cursor: c.dispo ? 'pointer' : 'not-allowed', fontFamily: `'DM Sans', sans-serif` }}>
                          {c.heure}{!c.dispo && <span style={{ fontSize: 10, marginLeft: 4 }}>(complet)</span>}
                        </button>
                      </div>
                    )
                  })}
                </div>
                <p style={{ color: 'rgba(14,12,9,0.4)', fontSize: 12, marginTop: 14, fontStyle: 'italic' }}>
                  ⚡ Les créneaux se remplissent vite. Réservez maintenant pour garantir votre place.
                </p>
              </div>
            )}
            {!selectedDate && <p style={{ color: 'rgba(14,12,9,0.35)', fontSize: 13, textAlign: 'center', marginTop: 24 }}>Sélectionnez une date pour voir les créneaux</p>}
          </div>
        )}

        {/* ── STEP 3: Récapitulatif ── */}
        {step === 3 && (
          <div>
            <h2 style={{ color: NOIR, fontSize: 16, fontWeight: 700, marginBottom: 18 }}>Récapitulatif</h2>
            <div style={{ background: CARD, borderRadius: 14, border: '1px solid rgba(14,12,9,0.08)', padding: '18px', marginBottom: 16 }}>
              <Row label="Service"    value={selectedService?.nom} />
              <Row label="Partenaire" value={`${partenaire.prenom} ${partenaire.nom}`} />
              <Row label="Date"       value={selectedDate ? formatDate(selectedDate) : '—'} />
              <Row label="Heure"      value={selectedCreneau?.heure || '—'} />
              <Row label="Lieu"       value={selectedLieu?.label || '—'} />
              {selectedLieu?.id === 'domicile_client' && (
                <Row label="Adresse" value="145 rue Principale, Longueuil" />
              )}
            </div>
            <div style={{ background: CARD, borderRadius: 14, border: '1px solid rgba(14,12,9,0.08)', padding: '18px', marginBottom: 16 }}>
              <div style={{ color: 'rgba(14,12,9,0.5)', fontSize: 12, fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Détail du prix</div>
              <Row label="Prix service" value={`${prixService} $`} />
              <div style={{ borderTop: '1px solid rgba(14,12,9,0.08)', marginTop: 10, paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: NOIR, fontWeight: 700, fontSize: 15 }}>Total</span>
                <span style={{ color: OR, fontWeight: 700, fontSize: 18 }}>{prixService} $</span>
              </div>
            </div>
            <div style={{ background: 'rgba(184,146,42,0.08)', border: `1px solid ${OR}`, borderRadius: 12, padding: '14px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: NOIR, fontWeight: 700, fontSize: 14 }}>Sécurisez votre place avec seulement {depot} $</div>
                  <div style={{ color: 'rgba(14,12,9,0.5)', fontSize: 12 }}>Remboursable si annulation 24h avant · Via Stripe</div>
                </div>
                <div style={{ color: OR, fontWeight: 800, fontSize: 22 }}>{depot} $</div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: Paiement Stripe ── */}
        {step === 4 && (
          <div>
            <h2 style={{ color: NOIR, fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Paiement Stripe</h2>
            <p style={{ color: 'rgba(14,12,9,0.5)', fontSize: 13, marginBottom: 20 }}>
              Dépôt de <span style={{ color: OR, fontWeight: 700 }}>{depot} $</span> pour {selectedService?.nom}
            </p>

            {/* Champs carte */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>

              {/* Numéro */}
              <div>
                <p style={{ color: 'rgba(14,12,9,0.5)', fontSize: 11, margin: '0 0 6px', textTransform: 'uppercase', fontWeight: 700 }}>Numéro de carte</p>
                <input
                  value={cardNum}
                  onChange={e => setCardNum(fmtCard(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  inputMode="numeric"
                  style={{ width: '100%', background: CARD, border: `1.5px solid ${cardNum && !cardValid ? '#ef4444' : 'rgba(184,146,42,0.25)'}`, borderRadius: 10, padding: '14px 16px', color: NOIR, fontSize: 16, fontFamily: 'monospace', letterSpacing: '0.08em', boxSizing: 'border-box' }}
                />
              </div>

              {/* Expiry + CVV */}
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'rgba(14,12,9,0.5)', fontSize: 11, margin: '0 0 6px', textTransform: 'uppercase', fontWeight: 700 }}>Expiration</p>
                  <input
                    value={expiry}
                    onChange={e => setExpiry(fmtExpiry(e.target.value))}
                    placeholder="MM/AA"
                    maxLength={5}
                    inputMode="numeric"
                    style={{ width: '100%', background: CARD, border: `1.5px solid ${expiry && !expiryValid ? '#ef4444' : 'rgba(184,146,42,0.25)'}`, borderRadius: 10, padding: '14px 16px', color: NOIR, fontSize: 15, fontFamily: 'monospace', letterSpacing: '0.05em', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'rgba(14,12,9,0.5)', fontSize: 11, margin: '0 0 6px', textTransform: 'uppercase', fontWeight: 700 }}>CVV</p>
                  <input
                    value={cvv}
                    onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                    placeholder="123"
                    maxLength={3}
                    inputMode="numeric"
                    type="password"
                    style={{ width: '100%', background: CARD, border: `1.5px solid ${cvv && !cvvValid ? '#ef4444' : 'rgba(184,146,42,0.25)'}`, borderRadius: 10, padding: '14px 16px', color: NOIR, fontSize: 15, fontFamily: 'monospace', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>

            {/* Erreur paiement */}
            {payError && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
                <p style={{ color: '#f87171', fontSize: 13, margin: 0, fontWeight: 600 }}>{payError}</p>
              </div>
            )}

            {/* Cartes test */}
            <div style={{ background: CARD, borderRadius: 10, padding: '12px 14px', marginBottom: 20 }}>
              <p style={{ color: 'rgba(14,12,9,0.4)', fontSize: 11, margin: '0 0 8px', textTransform: 'uppercase', fontWeight: 700 }}>Cartes test</p>
              {TEST_CARDS.map(tc => (
                <div key={tc.num} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <button
                    onClick={() => { setCardNum(tc.num); setExpiry('12/28'); setCvv('123'); setPayError('') }}
                    style={{ background: 'none', border: 'none', color: OR, fontFamily: 'monospace', fontSize: 13, cursor: 'pointer', padding: 0, letterSpacing: '0.05em' }}>
                    {tc.num}
                  </button>
                  <span style={{ fontSize: 11, color: tc.label === 'Succès' ? '#22c55e' : '#f87171', fontWeight: 600 }}>→ {tc.label}</span>
                </div>
              ))}
            </div>

            {/* Bouton payer */}
            <button
              onClick={handlePay}
              disabled={!formValid || paying}
              style={{ width: '100%', padding: '15px 0', borderRadius: 12, border: 'none', background: formValid && !paying ? OR : 'rgba(184,146,42,0.25)', color: formValid && !paying ? NOIR : 'rgba(14,12,9,0.3)', fontWeight: 700, fontSize: 16, cursor: formValid && !paying ? 'pointer' : 'not-allowed', fontFamily: `'DM Sans', sans-serif`, transition: 'background 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              {paying
                ? <><Spinner /> Traitement en cours…</>
                : `Payer le dépôt — ${depot} $`}
            </button>

            <p style={{ color: 'rgba(14,12,9,0.3)', fontSize: 11, textAlign: 'center', marginTop: 10 }}>
              Paiement sécurisé · Stripe · SSL 256-bit
            </p>
          </div>
        )}

        {/* ── STEP 5: Confirmation ── */}
        {step === 5 && (
          <div style={{ textAlign: 'center', paddingTop: 16 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(34,197,94,0.12)', border: `3px solid #22c55e`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 36 }}>
              ✓
            </div>
            <h2 style={{ color: NOIR, fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Réservation confirmée !</h2>
            <p style={{ color: 'rgba(14,12,9,0.5)', fontSize: 14, marginBottom: 28 }}>
              Dépôt de <span style={{ color: OR, fontWeight: 700 }}>{depot} $</span> traité avec succès via Stripe.
            </p>

            <div style={{ background: CARD, border: `2px solid ${OR}`, borderRadius: 14, padding: '20px', marginBottom: 24, fontFamily: 'monospace' }}>
              <div style={{ color: 'rgba(14,12,9,0.5)', fontSize: 11, marginBottom: 10, letterSpacing: '0.05em' }}>CODE QR DE VOTRE RDV</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: OR, letterSpacing: '0.15em', padding: '12px 0', borderTop: '1px dashed rgba(14,12,9,0.08)', borderBottom: '1px dashed rgba(14,12,9,0.08)' }}>
                {confirmedCode}
              </div>
              <div style={{ color: 'rgba(14,12,9,0.4)', fontSize: 11, marginTop: 10 }}>Montrez ce code à votre coiffeur à l'arrivée</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
              <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, padding: '10px 14px', color: '#4ade80', fontSize: 13, fontWeight: 500 }}>
                SMS de confirmation envoyé au 514-000-0001
              </div>
              <div style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: 10, padding: '10px 14px', color: '#93c5fd', fontSize: 13, fontWeight: 500 }}>
                Rappel automatique 24h avant
              </div>
            </div>

            {/* Upsell forfaits */}
            <div style={{ background: 'rgba(184,146,42,0.07)', border: `1px solid rgba(184,146,42,0.25)`, borderRadius: 12, padding: '16px 18px', marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: OR, fontWeight: 700, marginBottom: 4 }}>💡 Envie de payer moins cher ?</div>
              <div style={{ fontSize: 13, color: 'rgba(14,12,9,0.7)', lineHeight: 1.5, marginBottom: 10 }}>
                Les membres économisent <strong style={{ color: OR }}>{Math.round(prixService * 0.15)} $ sur ce service</strong>. Sur 12 mois, c'est 340 $ dans votre poche.
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => navigate('/client/abonnement')}
                  style={{ flex: 1, padding: '10px 0', background: OR, color: NOIR, border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: `'DM Sans', sans-serif` }}>
                  Voir les forfaits →
                </button>
                <button onClick={() => {}}
                  style={{ padding: '10px 14px', background: 'transparent', color: 'rgba(14,12,9,0.4)', border: '1px solid rgba(14,12,9,0.15)', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: `'DM Sans', sans-serif`, whiteSpace: 'nowrap' }}>
                  Pas maintenant
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => navigate('/client/rdv')}
                style={{ flex: 1, padding: '13px 0', background: 'transparent', color: NOIR, border: `1.5px solid rgba(14,12,9,0.08)`, borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: `'DM Sans', sans-serif` }}>
                Voir mes RDV
              </button>
              <button onClick={() => navigate('/client/carte')}
                style={{ flex: 1, padding: '13px 0', background: 'transparent', color: NOIR, border: `1.5px solid rgba(14,12,9,0.08)`, borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: `'DM Sans', sans-serif` }}>
                Retour à la carte
              </button>
            </div>
          </div>
        )}

        {/* Nav buttons (steps 0-3 only) */}
        {step < 4 && (
          <div style={{ marginTop: 28, display: 'flex', gap: 12 }}>
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)}
                style={{ flex: 1, padding: '13px 0', background: 'transparent', color: NOIR, border: `1.5px solid rgba(14,12,9,0.08)`, borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: `'DM Sans', sans-serif` }}>
                Retour
              </button>
            )}
            <button
              onClick={() => canNext() && setStep(s => s + 1)}
              disabled={!canNext()}
              style={{ flex: 2, padding: '13px 0', background: canNext() ? OR : 'rgba(184,146,42,0.25)', color: canNext() ? NOIR : 'rgba(14,12,9,0.3)', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: canNext() ? 'pointer' : 'not-allowed', fontFamily: `'DM Sans', sans-serif`, transition: 'background 0.15s' }}>
              {step === 3 ? `Vers le paiement →` : 'Continuer'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
      <span style={{ color: 'rgba(14,12,9,0.5)', fontSize: 13 }}>{label}</span>
      <span style={{ color: NOIR, fontWeight: 600, fontSize: 13 }}>{value || '—'}</span>
    </div>
  )
}

function Spinner() {
  return (
    <span style={{ display: 'inline-block', width: 16, height: 16, border: `2px solid ${NOIR}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </span>
  )
}
