import { useState } from 'react'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    try {
      const r = await api.post('/api/auth/login', { email, password })
      login(r.data.token, r.data.user)
      toast.success('Welcome!')
      nav('/')
    } catch {
      toast.error('Invalid credentials')
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h3>Login</h3>
        <form onSubmit={submit}>
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <div style={{ marginTop: 12 }}>
            <button className="btn" type="submit">Login</button>
            <span style={{ marginLeft: 8 }}><Link to="/register">Create account</Link></span>
          </div>
          <div style={{ marginTop: 8 }}>
            <small>Seeded users: admin@ganga.local / Admin@123, citizen@ganga.local / Citizen@123</small>
          </div>
        </form>
      </div>
    </div>
  )
}

