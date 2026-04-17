import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export default function ClientGuard({ children }) {
  const { isAuthenticated, isClient } = useAuthStore()
  if (!isAuthenticated()) return <Navigate to="/connexion" replace />
  if (!isClient())        return <Navigate to="/choix-role" replace />
  return children
}
