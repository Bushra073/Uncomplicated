
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './FloatingDashboard.css'

function FloatingDashboard() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const isHome = location.pathname === '/'
  const isDashboard = location.pathname === '/dashboard'

  return (
    <div className="floating-navigation">
      {!isHome && (
        <button
          className="floating-home"
          type="button"
          onClick={() => navigate('/')}
        >
          <span>⌂</span>
          <span>Home</span>
        </button>
      )}

      {!isDashboard && (
        <button
          className="floating-dashboard"
          type="button"
          onClick={() => navigate(token ? '/dashboard' : '/login')}
        >
          <span className="floating-dashboard-icon">▤</span>
          <span>{token ? 'My Dashboard' : 'My Space'}</span>
          <span className="floating-dashboard-arrow">↗</span>
        </button>
      )}
    </div>
  )
}

export default FloatingDashboard
