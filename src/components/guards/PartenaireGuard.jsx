import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export default function PartenaireGuard({ children }) {
  const { isAuthenticated, isPartenaire } = useAuthStore()
  if (!isAuthenticated()) return <Navigate to="/connexion" replace />
  if (!isPartenaire())    return <Navigate to="/choix-role" replace />
  return children
}
