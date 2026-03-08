import { useMemo, useEffect, Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import { useDashboardConfig } from './hooks/useApi'
import { getModules, getModuleRoutes, getModuleNavItems } from './modules/_registry'
import { AppShell, ProtectedRoute } from './components/layout'

const LoginPage = lazy(() => import('./pages/LoginPage'))

export default function App() {
  const { initialize, isInitialized, user, permissions } = useAuthStore()
  const { data: config } = useDashboardConfig()

  useEffect(() => {
    initialize()
  }, [initialize])

  // Module basierend auf Config + User-Permissions laden
  const { routes, navItems } = useMemo(() => {
    const enabledModules = [...(config?.enabledModules ?? []), ...(config?.addons ?? [])]
    const modules = getModules(enabledModules, permissions)
    return {
      routes: getModuleRoutes(modules),
      navItems: getModuleNavItems(modules),
    }
  }, [config, permissions])

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          isInitialized && user
            ? <Navigate to="/dashboard" replace />
            : <LoginPage />
        } />

        {/* Protected Routes mit App Shell */}
        <Route element={
          <ProtectedRoute>
            <AppShell navItems={navItems} />
          </ProtectedRoute>
        }>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.element />}
            />
          ))}
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  )
}
