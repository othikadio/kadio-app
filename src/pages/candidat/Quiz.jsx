import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MOCK_QUIZ } from '@/data/mockCandidat'
import { useFormationModules } from '@/hooks'
import { OR, CREME, NOIR, CARD } from '@/lib/utils'

export default function CandidatQuiz() {
  const { moduleId } = useParams()
  const navigate = useNavigate()
  const { data: modules = [] } = useFormationModules()
  const modId = parseInt(moduleId, 10)
  const module = modules.find(m => m.id === modId)
  const questions = MOCK_QUIZ[modId] || []

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(null)

  // Guard: module locked
  if (module && module.statut === 'verrouille') {
    navigate('/candidat/formation')
    return null
  }

  // Guard: not found
  if (!module || questions.length === 0) {
    return (
      <div style={{
        fontFamily: `'DM Sans', sans-serif`,
        background: CREME, minHeight: '100vh',
        color: NOIR, padding: '40px 20px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
        <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>{`Module introuvable`}</div>
        <div style={{ fontSize: '14px', color: 'rgba(14,12,9,0.5)', marginBottom: '24px' }}>
          {`Ce module n'existe pas.`}
        </div>
        <button
          onClick={() => navigate('/candidat/formation')}
          style={{
            background: OR, color: NOIR, border: 'none', borderRadius: '10px',
            padding: '12px 24px', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
            fontFamily: `'DM Sans', sans-serif`,
          }}
        >
          {`Retour à la formation`}
        </button>
      </div>
    )
  }

  const progressPct = ((currentQuestion + 1) / questions.length) * 100
  const q = questions[currentQuestion]
  const selectedAnswer = answers[currentQuestion]
  const hasAnswer = selectedAnswer !== undefined

  function handleNext() {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      // Calculate score
      let correct = 0
      questions.forEach((q, idx) => {
        if (answers[idx] === q.correcte) correct++
      })
      const finalScore = Math.round((correct / questions.length) * 100)
      setScore(finalScore)
      setSubmitted(true)
    }
  }

  function handleSelectAnswer(idx) {
    setAnswers(prev => ({ ...prev, [currentQuestion]: idx }))
  }

  const passed = score !== null && score >= 80

  // ── Results view ──
  if (submitted && score !== null) {
    return (
      <div style={{
        fontFamily: `'DM Sans', sans-serif`,
        background: CREME, minHeight: '100vh',
        color: NOIR, paddingBottom: '100px',
      }}>
        {/* Header */}
        <div style={{ padding: '24px 20px 0' }}>
          <div style={{ fontSize: '13px', color: 'rgba(14,12,9,0.45)', marginBottom: '4px' }}>
            {`Module ${modId} — ${module.titre}`}
          </div>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: NOIR }}>
            {`Résultats du quiz`}
          </h1>
        </div>

        <div style={{ padding: '20px', maxWidth: '520px', margin: '0 auto' }}>

          {/* Score card */}
          <div style={{
            background: passed ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            border: passed ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)',
            borderRadius: '16px', padding: '28px 24px', marginBottom: '24px', textAlign: 'center',
          }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: passed ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
              border: passed ? '2px solid #10B981' : '2px solid #EF4444',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', margin: '0 auto 16px',
            }}>
              {passed ? '✅' : '❌'}
            </div>

            {passed ? (
              <>
                <div style={{ fontSize: '22px', fontWeight: '800', color: '#10B981', marginBottom: '6px' }}>
                  {`Félicitations ! Score : ${score}%`}
                </div>
                <div style={{ fontSize: '15px', color: 'rgba(14,12,9,0.75)', marginBottom: '20px' }}>
                  {`Module ${module.titre} validé ✓`}
                </div>
                <button
                  onClick={() => navigate('/candidat/formation')}
                  style={{
                    background: OR, color: NOIR, border: 'none', borderRadius: '10px',
                    padding: '13px 24px', width: '100%',
                    fontSize: '15px', fontWeight: '700', cursor: 'pointer',
                    fontFamily: `'DM Sans', sans-serif`,
                  }}
                >
                  {`Continuer la formation →`}
                </button>
              </>
            ) : (
              <>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#EF4444', marginBottom: '6px' }}>
                  {`Score : ${score}% — Minimum requis : 80%`}
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(14,12,9,0.7)', marginBottom: '8px' }}>
                  {`Ne vous découragez pas ! Relisez le module et réessayez.`}
                </div>
                <div style={{
                  fontSize: '13px', color: 'rgba(14,12,9,0.45)',
                  background: 'rgba(239,68,68,0.08)', borderRadius: '8px',
                  padding: '8px 12px', marginBottom: '20px',
                }}>
                  {`Prochain essai disponible dans 7 jours`}
                </div>
                <button
                  onClick={() => navigate('/candidat/formation')}
                  style={{
                    background: 'transparent', border: '1px solid rgba(14,12,9,0.25)',
                    color: NOIR, borderRadius: '10px', padding: '13px 24px', width: '100%',
                    fontSize: '15px', fontWeight: '600', cursor: 'pointer',
                    fontFamily: `'DM Sans', sans-serif`,
                  }}
                >
                  {`Retour à la formation`}
                </button>
              </>
            )}
          </div>

          {/* Answers review */}
          <div style={{ fontSize: '13px', fontWeight: '600', color: OR, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {`Révision des réponses`}
          </div>

          {questions.map((question, qIdx) => {
            const userAnswer = answers[qIdx]
            const isCorrect = userAnswer === question.correcte
            return (
              <div key={question.id} style={{
                background: CARD, borderRadius: '12px', padding: '16px', marginBottom: '12px',
                border: isCorrect ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)',
              }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <span style={{
                    fontSize: '14px', fontWeight: '700',
                    color: isCorrect ? '#10B981' : '#EF4444',
                  }}>
                    {isCorrect ? '✓' : '✗'}
                  </span>
                  <div style={{ fontSize: '14px', color: NOIR, lineHeight: '1.4', fontWeight: '500' }}>
                    {question.question}
                  </div>
                </div>
                {question.reponses.map((rep, rIdx) => {
                  const isUserChoice = userAnswer === rIdx
                  const isCorrectAnswer = question.correcte === rIdx
                  let bg = 'transparent'
                  let color = 'rgba(14,12,9,0.5)'
                  let border = 'transparent'
                  if (isUserChoice && isCorrect) { bg = 'rgba(16,185,129,0.15)'; color = '#10B981'; border = 'rgba(16,185,129,0.4)' }
                  else if (isUserChoice && !isCorrect) { bg = 'rgba(239,68,68,0.12)'; color = '#EF4444'; border = 'rgba(239,68,68,0.4)' }
                  else if (!isUserChoice && isCorrectAnswer && !isCorrect) { bg = 'rgba(16,185,129,0.08)'; color = '#10B981'; border = 'rgba(16,185,129,0.3)' }
                  return (
                    <div key={rIdx} style={{
                      background: bg, border: `1px solid ${border}`,
                      borderRadius: '8px', padding: '7px 12px', marginBottom: '4px',
                      fontSize: '13px', color: color,
                      display: 'flex', alignItems: 'center', gap: '8px',
                    }}>
                      {isUserChoice && (isCorrect ? '✓ ' : '✗ ')}
                      {!isUserChoice && isCorrectAnswer && !isCorrect && '✓ '}
                      {rep}
                    </div>
                  )
                })}
              </div>
            )
          })}

        </div>
      </div>
    )
  }

  // ── Quiz view ──
  return (
    <div style={{
      fontFamily: `'DM Sans', sans-serif`,
      background: CREME, minHeight: '100vh',
      color: NOIR, paddingBottom: '100px',
    }}>
      {/* Header */}
      <div style={{ padding: '24px 20px 16px' }}>
        <div style={{ fontSize: '13px', color: 'rgba(14,12,9,0.45)', marginBottom: '4px' }}>
          {`Module ${modId} — ${module.titre}`}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: NOIR }}>
            {`Question ${currentQuestion + 1} sur ${questions.length}`}
          </h1>
          <div style={{ fontSize: '13px', color: OR, fontWeight: '600' }}>
            {`${currentQuestion + 1}/${questions.length}`}
          </div>
        </div>
        {/* Progress bar */}
        <div style={{
          background: 'rgba(255,255,255,0.08)', borderRadius: '99px',
          height: '6px', overflow: 'hidden', marginTop: '10px',
        }}>
          <div style={{
            height: '100%', borderRadius: '99px',
            background: OR, width: `${progressPct}%`,
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      <div style={{ padding: '0 20px', maxWidth: '520px', margin: '0 auto' }}>

        {/* Question card */}
        <div style={{
          background: CARD, borderRadius: '14px', padding: '24px', marginBottom: '16px',
        }}>
          <div style={{ fontSize: '18px', fontWeight: '600', color: NOIR, lineHeight: '1.5', marginBottom: '24px' }}>
            {q.question}
          </div>

          {q.reponses.map((rep, idx) => {
            const isSelected = selectedAnswer === idx
            return (
              <button
                key={idx}
                onClick={() => handleSelectAnswer(idx)}
                style={{
                  width: '100%', textAlign: 'left',
                  background: isSelected ? 'rgba(184,146,42,0.12)' : 'rgba(255,255,255,0.04)',
                  border: isSelected ? `1px solid ${OR}` : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px', padding: '13px 16px',
                  fontSize: '14px', color: isSelected ? OR : 'rgba(14,12,9,0.8)',
                  fontWeight: isSelected ? '600' : '400',
                  cursor: 'pointer', marginBottom: '10px',
                  fontFamily: `'DM Sans', sans-serif`,
                  transition: 'all 0.15s ease',
                }}
              >
                {rep}
              </button>
            )
          })}
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          disabled={!hasAnswer}
          style={{
            background: hasAnswer ? OR : 'rgba(184,146,42,0.25)',
            color: hasAnswer ? NOIR : 'rgba(184,146,42,0.4)',
            border: 'none', borderRadius: '10px',
            padding: '14px 24px', width: '100%',
            fontSize: '15px', fontWeight: '700',
            cursor: hasAnswer ? 'pointer' : 'not-allowed',
            fontFamily: `'DM Sans', sans-serif`,
            transition: 'all 0.2s ease',
          }}
        >
          {currentQuestion < questions.length - 1
            ? `Question suivante →`
            : `Terminer le quiz`}
        </button>

      </div>
    </div>
  )
}
