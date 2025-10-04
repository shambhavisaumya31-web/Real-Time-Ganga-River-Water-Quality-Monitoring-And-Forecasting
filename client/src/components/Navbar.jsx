import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PushToggle from './PushToggle'

export default function Navbar() {
  const { user, logout } = useAuth()
  return (
    <nav className="navbar-modern">
      <div className="navbar-logo">
        <Link to="/" className="navbar-title">🌊 Ganga Dashboard</Link>
      </div>
      <div className="navbar-links">
        <Link to="/biodiversity">Biodiversity</Link>
        <Link to="/report">Report</Link>
        {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
      </div>
      <div className="spacer" />
      <PushToggle />
      <div className="navbar-auth">
        {user ? (
          <>
            <span className="navbar-user">Hi, {user.name}</span>
            <button className="btn modern" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

