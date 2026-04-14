import { useState, useEffect } from 'react'
import { haversineKm } from '@/lib/utils'

export function useGeo() {
  const [position, setPosition] = useState(null)
  const [error,    setError]    = useState(null)
  const [loading,  setLoading]  = useState(false)

  const getPosition = () => {
    if (!navigator.geolocation) {
      setError(`La géolocalisation n'est pas supportée`)
      return
    }
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
      { timeout: 10000, maximumAge: 60000 }
    )
  }

  const distanceTo = (lat2, lng2) => {
    if (!position) return null
    return haversineKm(position.lat, position.lng, lat2, lng2)
  }

  return { position, error, loading, getPosition, distanceTo }
}
