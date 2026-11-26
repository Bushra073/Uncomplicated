
import { Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import ProcedureExplorer from './components/ProcedureExplorer/ProcedureExplorer'
import ProcedureDetail from './components/ProcedureDetail/ProcedureDetail'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import ProcedureTracker from './pages/ProcedureTracker'
import { useAuth } from './context/AuthContext'
import FloatingDashboard from './components/FloatingDashboard'
import DocumentHub from './pages/DocumentHub'

function ProtectedRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  const { token } = useAuth()

return (
  <>
    <FloatingDashboard />

    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/procedures" element={<ProcedureExplorer />} />
      <Route path="/procedures/:id" element={<ProcedureDetail />} />

      <Route
        path="/login"
        element={token ? <Navigate to="/dashboard" replace /> : <AuthPage />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-procedures/:id"
        element={
          <ProtectedRoute>
            <ProcedureTracker />
          </ProtectedRoute>
        }
      />
      <Route
  path="/documents"
  element={
    <ProtectedRoute>
      <DocumentHub />
    </ProtectedRoute>
  }
/>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </>
)
}

export default AppRoutes
