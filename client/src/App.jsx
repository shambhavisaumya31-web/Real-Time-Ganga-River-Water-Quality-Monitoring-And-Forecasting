import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Biodiversity from './pages/Biodiversity'
import ReportIssue from './pages/ReportIssue'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Register from './pages/Register'
import { ToastContainer, toast } from 'react-toastify'
import { useAuth } from './context/AuthContext'

function ProtectedRoute({ children, role }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}

export default function App() {
  const { user } = useAuth()
  const [sse, setSse] = useState(null)

  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE_URL
    const es = new EventSource(`${base}/api/alerts/stream`)
    es.addEventListener('alert', (e) => {
      const data = JSON.parse(e.data)
      toast.warn(`Alert: ${data.message}`)
    })
    es.addEventListener('notification', (e) => {
      const data = JSON.parse(e.data)
      const level = data.severity === 'critical' ? toast.error : toast.info
      level(`${data.title}: ${data.message}`)
    })
    es.onerror = () => {}
    setSse(es)
    return () => es.close()
  }, [])

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/biodiversity" element={<Biodiversity />} />
        <Route path="/report" element={<ProtectedRoute><ReportIssue /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute role="admin"><Admin /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer position="top-right" />
    </div>
  )
}

