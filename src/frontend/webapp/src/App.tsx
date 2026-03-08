import { Routes, Route, Navigate } from 'react-router-dom'

// ✏️ Seiten und Auth-Store importieren
// import { useAuthStore }   from './stores/authStore'
// import { LoginPage }      from './pages/LoginPage'
// import { DashboardPage }  from './pages/DashboardPage'

// Auth Guard – schützt Routen vor nicht eingeloggten Usern
// function ProtectedRoute({ children }: { children: React.ReactNode }) {
//   const { user } = useAuthStore()
//   return user ? <>{children}</> : <Navigate to="/login" replace />
// }

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary mb-2">FlowTecsMedia</h1>
            <p className="text-gray-500">✏️ Login-Seite hier implementieren</p>
          </div>
        </div>
      } />
      <Route path="/dashboard" element={
        // <ProtectedRoute><DashboardPage /></ProtectedRoute>
        <div className="p-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500 mt-2">✏️ Dashboard hier aufbauen</p>
        </div>
      } />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
