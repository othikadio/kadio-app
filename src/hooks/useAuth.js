import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

// Hook utilitaire — accès rapide à l'état auth
export function useAuth() {
  const store = useAuthStore()
  return {
    user:         store.user,
    roles:        store.roles,
    activeRole:   store.activeRole,
    client:       store.client,
    partenaire:   store.partenaire,
    employe:      store.employe,
    isLoading:    store.isLoading,
    isAuthenticated: !!store.user,
    hasRole:      store.hasRole,
    isAdmin:      store.isAdmin(),
    isClient:     store.isClient(),
    isPartenaire: store.isPartenaire(),
    isEmploye:    store.isEmploye(),
    isFournisseur:store.isFournisseur(),
    isCandidat:   store.isCandidat(),
    login:        store.loginMock,
    loginAs:      store.loginMockAs,
    logout:       store.logout,
    setActiveRole:store.setActiveRole,
  }
}

// Hook — redirige si non authentifié ou mauvais rôle
export function useRequireAuth(role, redirectTo = '/connexion') {
  const { user, hasRole } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    // TODO prod : activer la vérification réelle
    // if (!user) { navigate(redirectTo); return }
    // if (role && !hasRole(role)) { navigate('/connexion'); return }
  }, [user, role])

  return { user, hasRole }
}
