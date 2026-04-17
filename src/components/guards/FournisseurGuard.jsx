import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export default function FournisseurGuard({ children }) {
  const { isAuthenticated, isFournisseur } = useAuthStore()
  if (!isAuthenticated()) return <Navigate to="/connexion" replace />
  if (!isFournisseur())   return <Navigate to="/choix-role" replace />
  return children
}
