
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)
const API = 'http://localhost:5000/api'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user') || 'null')
  )

  async function authenticate(endpoint, details) {
    const response = await fetch(`${API}/auth/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Authentication failed.')
    }

    localStorage.setItem('token', result.token)
    localStorage.setItem('user', JSON.stringify(result.user))
    setToken(result.token)
    setUser(result.user)
  }

  function login(email, password) {
    return authenticate('login', { email, password })
  }

  function signup(full_name, email, password) {
    return authenticate('signup', { full_name, email, password })
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export const API_URL = API
