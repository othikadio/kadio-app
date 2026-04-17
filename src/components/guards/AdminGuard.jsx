import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export default function AdminGuard({ children }) {
  const { isAuthenticated, isAdmin } = useAuthStore()
  if (!isAuthenticated()) return <Navigate to="/connexion" replace />
  if (!isAdmin())         return <Navigate to="/choix-role" replace />
  return children
}
