import { useEffect, useState } from 'react'
import api from '../api'
import { toast } from 'react-toastify'

export default function AlertsPanel({ location }) {
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    if (!location) return
    api.get('/api/alerts', { params: { locationId: location._id } }).then(r => setAlerts(r.data)).catch(() => toast.error('Failed to load alerts'))
  }, [location])

  if (!location) return null

  return (
    <div className="card">
      <h3>Recent Alerts</h3>
      <ul className="list">
        {alerts.map(a => (
          <li key={a._id}>
            <strong>{a.parameter.toUpperCase()}</strong>: {a.message}
          </li>
        ))}
      </ul>
    </div>
  )
}

