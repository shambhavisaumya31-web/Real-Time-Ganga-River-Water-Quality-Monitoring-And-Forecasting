import { createContext, useContext, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setUser({ id: decoded.sub, name: decoded.name, email: decoded.email, role: decoded.role })
      } catch {}
    }
  }, [])

  const login = (token, user) => {
    localStorage.setItem('token', token)
    setUser(user)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthCtx.Provider value={{ user, login, logout }}>
      {children}
    </AuthCtx.Provider>
  )
}

export function useAuth() {
  return useContext(AuthCtx)
}

