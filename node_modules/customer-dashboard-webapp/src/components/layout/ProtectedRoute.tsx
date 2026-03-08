import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

interface IProtectedRouteProps {
  children: React.ReactNode
  permission?: string
}

export function ProtectedRoute({ children, permission }: IProtectedRouteProps) {
  const { user, isLoading, isInitialized, hasPermission } = useAuthStore()
  const location = useLocation()

  // Noch nicht initialisiert → Loading anzeigen
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  // Nicht eingeloggt → Login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Permission-Check
  if (permission && !hasPermission(permission)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Zugriff verweigert</h1>
          <p className="text-gray-500">Sie haben keine Berechtigung für diese Seite.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
