import { useEffect, useState } from 'react'
import api from '../api'
import { toast } from 'react-toastify'

export default function Admin() {
  const [reports, setReports] = useState([])
  const [filter, setFilter] = useState('open')

  const load = () => api.get('/api/reports', { params: { status: filter } }).then(r => setReports(r.data)).catch(() => toast.error('Failed to load reports'))

  useEffect(() => { load() }, [filter])

  const update = async (id, status) => {
    await api.patch(`/api/reports/${id}`, { status })
    toast.success('Updated')
    load()
  }

  return (
    <div className="container">
      <div className="card">
        <h3>Admin Dashboard</h3>
        <div style={{ marginBottom: 12 }}>
          <label>Filter status</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="open">Open</option>
            <option value="in_review">In Review</option>
            <option value="resolved">Resolved</option>
            <option value="">All</option>
          </select>
        </div>
        <ul className="list">
          {reports.map(r => (
            <li key={r._id}>
              <div><strong>{r.severity.toUpperCase()}</strong> {r.location ? `${r.location.city} - ${r.location.name}` : ''}</div>
              <div>{r.description}</div>
              {r.photoUrl && <div><img src={`${import.meta.env.VITE_API_BASE_URL}${r.photoUrl}`} alt="photo" style={{ maxWidth: 200 }} /></div>}
              <div style={{ marginTop: 6 }}>
                <button className="btn secondary" onClick={() => update(r._id, 'in_review')}>Mark In Review</button>
                <button className="btn" style={{ marginLeft: 6 }} onClick={() => update(r._id, 'resolved')}>Resolve</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

