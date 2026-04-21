// ── useData — Couche de données intelligente ────────────────────────
// Utilise Supabase quand configuré, fallback sur les mocks sinon.
// Chaque hook retourne { data, loading, error, refetch }
import { useState, useEffect, useCallback } from 'react'
import { isSupabaseConfigured } from '@/lib/supabase'

/**
 * Hook générique : appelle un service Supabase, fallback sur mock si échec ou vide.
 * @param {Function} serviceFn   — Fonction async du service Supabase
 * @param {any}      mockData    — Données mock de fallback
 * @param {Array}    deps        — Dépendances pour refetch (comme useEffect)
 * @param {boolean}  skip        — Ne pas fetch si true
 */
export function useSupabaseData(serviceFn, mockData = null, deps = [], skip = false) {
  const [data, setData]       = useState(mockData)
  const [loading, setLoading] = useState(!skip)
  const [error, setError]     = useState(null)
  const [source, setSource]   = useState('mock') // 'supabase' | 'mock'

  const fetch = useCallback(async () => {
    if (skip) return
    if (!isSupabaseConfigured || !serviceFn) {
      setData(mockData)
      setSource('mock')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const result = await serviceFn()
      // Si Supabase retourne des données non-vides, les utiliser
      if (result && (Array.isArray(result) ? result.length > 0 : true)) {
        setData(result)
        setSource('supabase')
      } else {
        // Supabase retourne vide → utiliser mocks
        setData(mockData)
        setSource('mock')
      }
    } catch (err) {
      console.warn('[useData] Supabase error, using mock:', err.message)
      setError(err)
      setData(mockData)
      setSource('mock')
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, ...deps])

  useEffect(() => { fetch() }, [fetch])

  return { data, loading, error, source, refetch: fetch }
}

/**
 * Hook mutation : exécute une action Supabase avec gestion d'état.
 * Retourne { mutate, loading, error, data }
 */
export function useSupabaseMutation(serviceFn) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [data, setData]       = useState(null)

  const mutate = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      if (!isSupabaseConfigured) {
        // En mode mock, simuler un succès après un petit délai
        await new Promise(r => setTimeout(r, 500))
        const mockResult = { id: 'mock_' + Date.now(), ...args[0] }
        setData(mockResult)
        return mockResult
      }
      const result = await serviceFn(...args)
      setData(result)
      return result
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [serviceFn])

  return { mutate, loading, error, data }
}
