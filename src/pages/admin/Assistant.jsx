import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { OR, CREME, NOIR, CARD, MUTED } from '@/lib/utils';

export default function Assistant() {
  const navigate = useNavigate();

  // State management
  const [status, setStatus] = useState('idle'); // idle | listening | thinking | speaking
  const [messages, setMessages] = useState([]);
  const [transcript, setTranscript] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');

  // Refs for Web APIs
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const recognitionActiveRef = useRef(false);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('API de reconnaissance vocale non supportée par votre navigateur');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-CA';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setStatus('listening');
      setInterimTranscript('');
      setError('');
    };

    recognition.onresult = (event) => {
      let interim = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interim += transcript;
        }
      }

      setInterimTranscript(interim);

      // When we get a final result, process it
      if (finalTranscript) {
        handleUserMessage(finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      setError(`Erreur: ${event.error}`);
      setStatus('idle');
      recognitionActiveRef.current = false;
    };

    recognition.onend = () => {
      // Auto-restart if still in active conversation mode
      if (recognitionActiveRef.current && status !== 'thinking' && status !== 'speaking') {
        setTimeout(() => {
          try {
            recognition.start();
          } catch (e) {
            // Recognition already started
          }
        }, 100);
      } else {
        setStatus('idle');
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // Already stopped
        }
      }
    };
  }, []);

  // Handle user message submission
  const handleUserMessage = useCallback(
    async (userText) => {
      if (!userText.trim()) return;

      // Stop recognition and update UI
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Already stopped
        }
      }

      setTranscript(userText);
      setInterimTranscript('');
      setStatus('thinking');

      // Add user message to history
      const newMessages = [...messages, { role: 'user', content: userText }];
      setMessages(newMessages);

      try {
        // Call AI endpoint
        const response = await fetch('/api/ai-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: newMessages }),
        });

        if (!response.ok) throw new Error('Erreur API');

        const data = await response.json();
        const aiResponse = data.reply || "Désolé, je n'ai pas pu traiter votre demande.";

        // Add AI response to history
        const updatedMessages = [...newMessages, { role: 'assistant', content: aiResponse }];
        setMessages(updatedMessages);

        // Speak the response
        speakResponse(aiResponse);
      } catch (err) {
        setError(`Erreur: ${err.message}`);
        setStatus('idle');
        recognitionActiveRef.current = false;
      }
    },
    [messages]
  );

  // Text-to-speech function
  const speakResponse = useCallback((text) => {
    const synth = synthRef.current;

    // Cancel any ongoing speech
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-CA';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Try to use a French voice
    const voices = synth.getVoices();
    const frenchVoice = voices.find(
      (v) => v.lang.startsWith('fr-CA') || v.lang.startsWith('fr-FR')
    );
    if (frenchVoice) {
      utterance.voice = frenchVoice;
    }

    utterance.onstart = () => {
      setStatus('speaking');
    };

    utterance.onend = () => {
      // Auto-restart listening if still active
      if (recognitionActiveRef.current && recognitionRef.current) {
        setStatus('idle');
        setTimeout(() => {
          try {
            recognitionRef.current.start();
          } catch (e) {
            // Already started or not ready
          }
        }, 500);
      } else {
        setStatus('idle');
      }
    };

    utterance.onerror = (event) => {
      setError(`Erreur vocale: ${event.error}`);
      setStatus('idle');
      recognitionActiveRef.current = false;
    };

    synth.speak(utterance);
  }, []);

  // Toggle microphone on/off
  const toggleMicrophone = useCallback(() => {
    if (!recognitionRef.current) {
      setError('Reconnaissance vocale non disponible');
      return;
    }

    if (isActive) {
      // Stop
      recognitionActiveRef.current = false;
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Already stopped
      }
      setIsActive(false);
      setStatus('idle');
      setTranscript('');
    } else {
      // Start
      recognitionActiveRef.current = true;
      setIsActive(true);
      try {
        recognitionRef.current.start();
      } catch (e) {
        // Already running
        setIsActive(true);
      }
    }
  }, [isActive]);

  // Handle manual text input (fallback for noisy environments)
  const handleTextSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const input = e.target.elements.fallbackInput;
      const text = input.value.trim();
      if (text) {
        handleUserMessage(text);
        input.value = '';
      }
    },
    [handleUserMessage]
  );

  // Get animation class based on status
  const getCircleAnimation = () => {
    switch (status) {
      case 'listening':
        return 'pulse-listen';
      case 'thinking':
        return 'rotate-think';
      case 'speaking':
        return 'wave-speak';
      default:
        return 'pulse-idle';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'listening':
        return "Je t'écoute...";
      case 'thinking':
        return 'Je réfléchis...';
      case 'speaking':
        return 'Kadio parle...';
      default:
        return 'Toucher pour parler';
    }
  };

  const statusDotColor = isActive ? '#22c55e' : OR;

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: `linear-gradient(135deg, ${NOIR} 0%, #1a1a2e 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        color: CREME,
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes pulse-idle {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(184, 146, 42, 0.3);
          }
          50% {
            box-shadow: 0 0 0 15px rgba(184, 146, 42, 0);
          }
        }

        @keyframes pulse-listen {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.5);
          }
          50% {
            box-shadow: 0 0 0 20px rgba(34, 197, 94, 0);
          }
        }

        @keyframes rotate-think {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes wave-speak {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4), 0 0 0 10px rgba(184, 146, 42, 0.2);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0), 0 0 0 25px rgba(184, 146, 42, 0);
          }
        }

        .pulse-idle {
          animation: pulse-idle 2s infinite;
        }

        .pulse-listen {
          animation: pulse-listen 1.5s infinite;
        }

        .rotate-think {
          animation: rotate-think 2s linear infinite;
        }

        .wave-speak {
          animation: wave-speak 1.8s infinite;
        }

        .transcript-scroll {
          scrollbar-width: thin;
          scrollbar-color: ${OR} rgba(184, 146, 42, 0.2);
        }

        .transcript-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .transcript-scroll::-webkit-scrollbar-track {
          background: rgba(184, 146, 42, 0.1);
          border-radius: 10px;
        }

        .transcript-scroll::-webkit-scrollbar-thumb {
          background: ${OR};
          border-radius: 10px;
        }
      `}</style>

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '18px',
          fontWeight: 'bold',
          letterSpacing: '1px',
        }}
      >
        <span style={{ color: OR }}>KADIO</span>
        <span style={{ color: CREME }}>IA</span>
        <div
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: statusDotColor,
            boxShadow: `0 0 10px ${statusDotColor}`,
          }}
        />
      </div>

      {/* Main conversation area */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          gap: '20px',
          width: '100%',
          maxWidth: '600px',
        }}
      >
        {/* Large animated circle */}
        <div
          className={getCircleAnimation()}
          onClick={toggleMicrophone}
          style={{
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(184, 146, 42, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%)`,
            border: `3px solid ${OR}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            userSelect: 'none',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '50px',
                marginBottom: '8px',
              }}
            >
              🎤
            </div>
            <div
              style={{
                fontSize: '12px',
                color: OR,
                fontWeight: '500',
                lineHeight: '1.3',
              }}
            >
              {getStatusText()}
            </div>
          </div>
        </div>

        {/* Live transcript */}
        <div
          className="transcript-scroll"
          style={{
            width: '100%',
            maxHeight: '40vh',
            overflowY: 'auto',
            padding: '15px',
            background: `rgba(0, 0, 0, 0.3)`,
            borderRadius: '12px',
            border: `1px solid rgba(184, 146, 42, 0.2)`,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {/* Message history */}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  maxWidth: '85%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: msg.role === 'user' ? `rgba(184, 146, 42, 0.15)` : `rgba(250, 250, 248, 0.05)`,
                  border: `1px solid ${msg.role === 'user' ? OR : 'rgba(250, 250, 248, 0.1)'}`,
                  color: msg.role === 'user' ? OR : CREME,
                  fontSize: '14px',
                  lineHeight: '1.5',
                  wordBreak: 'break-word',
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Interim transcript (while listening) */}
          {interimTranscript && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <div
                style={{
                  maxWidth: '85%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: `rgba(184, 146, 42, 0.1)`,
                  border: `1px dashed ${OR}`,
                  color: OR,
                  fontSize: '14px',
                  lineHeight: '1.5',
                  fontStyle: 'italic',
                  opacity: 0.8,
                }}
              >
                {interimTranscript}
              </div>
            </div>
          )}

          {/* Current user transcript (after listening ends) */}
          {transcript && !interimTranscript && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <div
                style={{
                  maxWidth: '85%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: `rgba(184, 146, 42, 0.15)`,
                  border: `1px solid ${OR}`,
                  color: OR,
                  fontSize: '14px',
                  lineHeight: '1.5',
                }}
              >
                {transcript}
              </div>
            </div>
          )}

          {/* Empty state */}
          {messages.length === 0 && !interimTranscript && !transcript && (
            <div
              style={{
                textAlign: 'center',
                color: MUTED,
                fontSize: '14px',
                padding: '20px',
              }}
            >
              Appuyez sur le micro pour démarrer...
            </div>
          )}

          {/* Error message */}
          {error && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                fontSize: '12px',
              }}
            >
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Bottom controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          width: '100%',
          maxWidth: '600px',
          justifyContent: 'center',
          paddingTop: '20px',
          borderTop: `1px solid rgba(184, 146, 42, 0.2)`,
        }}
      >
        {/* Mic toggle button */}
        <button
          onClick={toggleMicrophone}
          style={{
            padding: '14px 28px',
            borderRadius: '50px',
            background: isActive ? `rgba(34, 197, 94, 0.2)` : `rgba(184, 146, 42, 0.2)`,
            border: `2px solid ${isActive ? '#22c55e' : OR}`,
            color: isActive ? '#22c55e' : OR,
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            letterSpacing: '0.5px',
          }}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = `0 0 15px ${isActive ? 'rgba(34, 197, 94, 0.5)' : 'rgba(184, 146, 42, 0.5)'}`;
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = 'none';
          }}
        >
          {isActive ? '⏹ Arrêter' : '🎤 Écouter'}
        </button>

        {/* Fallback text input */}
        <form onSubmit={handleTextSubmit} style={{ display: 'flex', gap: '8px', flex: 1 }}>
          <input
            name="fallbackInput"
            type="text"
            placeholder="Ou tapez ici..."
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '8px',
              background: `rgba(250, 250, 248, 0.05)`,
              border: `1px solid rgba(184, 146, 42, 0.2)`,
              color: CREME,
              fontSize: '14px',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = OR;
              e.target.style.boxShadow = `0 0 10px rgba(184, 146, 42, 0.3)`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(184, 146, 42, 0.2)';
              e.target.style.boxShadow = 'none';
            }}
          />
          <button
            type="submit"
            style={{
              padding: '12px 20px',
              borderRadius: '8px',
              background: OR,
              border: 'none',
              color: NOIR,
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = '1';
            }}
          >
            Envoyer
          </button>
        </form>

        {/* Back button */}
        <button
          onClick={() => navigate('/admin')}
          style={{
            padding: '12px 20px',
            borderRadius: '8px',
            background: 'transparent',
            border: `1px solid ${MUTED}`,
            color: MUTED,
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = CREME;
            e.target.style.color = CREME;
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = MUTED;
            e.target.style.color = MUTED;
          }}
        >
          ← Retour
        </button>
      </div>
    </div>
  );
          }
