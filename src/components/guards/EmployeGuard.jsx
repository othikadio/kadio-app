import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export default function EmployeGuard({ children }) {
  const { isAuthenticated, isEmploye } = useAuthStore()
  if (!isAuthenticated()) return <Navigate to="/connexion" replace />
  if (!isEmploye())       return <Navigate to="/choix-role" replace />
  return children
}
