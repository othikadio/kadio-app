import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export default function CandidatGuard({ children }) {
  const { isAuthenticated, isCandidat } = useAuthStore()
  if (!isAuthenticated()) return <Navigate to="/connexion" replace />
  if (!isCandidat())      return <Navigate to="/choix-role" replace />
  return children
}
