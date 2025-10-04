import { useState } from 'react'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function Register() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    try {
      const r = await api.post('/api/auth/register', { name, email, password })
      login(r.data.token, r.data.user)
      toast.success('Account created!')
      nav('/')
    } catch {
      toast.error('Failed to register')
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h3>Register</h3>
        <form onSubmit={submit}>
          <label>Name</label>
          <input value={name} onChange={e => setName(e.target.value)} required />
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <div style={{ marginTop: 12 }}>
            <button className="btn" type="submit">Register</button>
            <span style={{ marginLeft: 8 }}><Link to="/login">Login</Link></span>
          </div>
        </form>
      </div>
    </div>
  )
}

