import { useEffect, useRef } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

// Écoute une table Supabase en temps réel
// usage: useRealtime('rendez_vous', { filter: 'partenaire_id=eq.xxx' }, onChangeCallback)
export function useRealtime(table, options = {}, onChange) {
  const channelRef = useRef(null)

  useEffect(() => {
    if (!isSupabaseConfigured || !onChange) return

    const channelName = `${table}-${Date.now()}`
    const config = { event: '*', schema: 'public', table }
    if (options.filter) config.filter = options.filter

    channelRef.current = supabase
      .channel(channelName)
      .on('postgres_changes', config, (payload) => {
        onChange(payload)
      })
      .subscribe()

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [table, options.filter])
}

// Écoute plusieurs tables
export function useRealtimeMulti(subscriptions) {
  useEffect(() => {
    if (!isSupabaseConfigured) return
    const channels = subscriptions.map(({ table, filter, onChange }) => {
      const config = { event: '*', schema: 'public', table }
      if (filter) config.filter = filter
      return supabase
        .channel(`${table}-${Math.random()}`)
        .on('postgres_changes', config, onChange)
        .subscribe()
    })
    return () => channels.forEach(c => supabase.removeChannel(c))
  }, [])
}
