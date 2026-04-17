// ── dispoStore — Synchronisation temps réel des disponibilités ──
// Supabase Realtime quand configuré, EventEmitter local sinon (mode démo)
import { create } from 'zustand'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { MOCK_PARTENAIRES } from '@/data/mockPublic'

// ── Mapping auth persona → mock partenaire (mode démo) ──
const AUTH_TO_MOCK = { 'part-diane': 'p1' }
const MOCK_TO_AUTH = { 'p1': 'part-diane' }
function getAllIds(id) {
  // Retourne l'id + son alias si mapping existe
  const ids = [id]
  if (AUTH_TO_MOCK[id]) ids.push(AUTH_TO_MOCK[id])
  if (MOCK_TO_AUTH[id]) ids.push(MOCK_TO_AUTH[id])
  return ids
}

// ── EventEmitter local pour mode démo ──
const listeners = new Set()
function emit(partenaireId, disponible) {
  listeners.forEach(fn => fn(partenaireId, disponible))
}

export const useDispoStore = create((set, get) => ({
  // État des disponibilités { [partenaireId]: boolean }
  dispos: {
    ...Object.fromEntries(MOCK_PARTENAIRES.map(p => [p.id, p.disponible])),
    // Ajouter aussi les IDs auth personas
    'part-diane': true,
  },
  subscribed: false,

  // Obtenir la dispo d'un partenaire
  getDispo: (id) => get().dispos[id] ?? false,

  // ── Toggle dispo (côté partenaire) ──
  toggleDispo: async (partenaireId) => {
    const current = get().dispos[partenaireId] ?? false
    const newVal = !current

    // Mise à jour optimiste locale — mettre à jour tous les IDs liés
    const ids = getAllIds(partenaireId)
    set(s => {
      const updated = { ...s.dispos }
      ids.forEach(id => { updated[id] = newVal })
      return { dispos: updated }
    })

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('partenaires')
          .update({ is_disponible: newVal })
          .eq('id', partenaireId)
      } catch (err) {
        console.warn('[dispoStore] Supabase update failed, keeping local:', err.message)
      }
    }

    // Mode démo — émettre pour tous les IDs liés
    ids.forEach(id => emit(id, newVal))
    return newVal
  },

  // ── Set dispo directement ──
  setDispo: (partenaireId, disponible) => {
    set(s => ({ dispos: { ...s.dispos, [partenaireId]: disponible } }))
  },

  // ── Subscribe aux changements (côté client) ──
  subscribe: () => {
    if (get().subscribed) return

    if (isSupabaseConfigured) {
      // Supabase Realtime
      const channel = supabase
        .channel('partenaires-dispo')
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'partenaires',
          filter: 'is_disponible=in.(true,false)',
        }, (payload) => {
          const { id, is_disponible } = payload.new
          set(s => ({ dispos: { ...s.dispos, [id]: is_disponible } }))
        })
        .subscribe()

      set({ subscribed: true, _channel: channel })
    } else {
      // Mode démo — écouter les événements locaux
      const handler = (partenaireId, disponible) => {
        set(s => ({ dispos: { ...s.dispos, [partenaireId]: disponible } }))
      }
      listeners.add(handler)
      set({ subscribed: true, _handler: handler })
    }
  },

  // ── Unsubscribe ──
  unsubscribe: () => {
    const state = get()
    if (state._channel) {
      supabase.removeChannel(state._channel)
    }
    if (state._handler) {
      listeners.delete(state._handler)
    }
    set({ subscribed: false, _channel: null, _handler: null })
  },
}))
