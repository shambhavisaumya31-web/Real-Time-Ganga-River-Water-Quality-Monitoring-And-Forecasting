import { useEffect, useState } from 'react'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

export default function ReportIssue() {
  const { user } = useAuth()
  const [locations, setLocations] = useState([])
  const [form, setForm] = useState({ description: '', locationId: '', severity: 'low', lat: '', lng: '' })
  const [photo, setPhoto] = useState(null)

  useEffect(() => { api.get('/api/locations').then(r => setLocations(r.data)) }, [])

  const submit = async (e) => {
    e.preventDefault()
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k,v]) => v && fd.append(k, v))
      if (photo) fd.append('photo', photo)
      await api.post('/api/reports', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Report submitted')
      setForm({ description: '', locationId: '', severity: 'low', lat: '', lng: '' })
      setPhoto(null)
    } catch {
      toast.error('Failed to submit report')
    }
  }

  const geolocate = () => {
    if (!navigator.geolocation) return toast.error('Geolocation not available')
    navigator.geolocation.getCurrentPosition((pos) => {
      setForm(f => ({ ...f, lat: pos.coords.latitude, lng: pos.coords.longitude }))
    })
  }

  if (!user) return <div className="container"><div className="card">Login required.</div></div>

  return (
    <div className="container">
      <div className="card">
        <h3>Report an Issue</h3>
        <form onSubmit={submit}>
          <label>Description</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows="3" required />

          <div className="grid grid-3">
            <div>
              <label>Location</label>
              <select value={form.locationId} onChange={e => setForm({ ...form, locationId: e.target.value })}>
                <option value="">Select...</option>
                {locations.map(l => <option key={l._id} value={l._id}>{l.city} - {l.name}</option>)}
              </select>
            </div>
            <div>
              <label>Severity</label>
              <select value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label>Photo</label>
              <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files?.[0])} />
            </div>
          </div>

          <div className="grid grid-3">
            <div>
              <label>Latitude</label>
              <input value={form.lat} onChange={e => setForm({ ...form, lat: e.target.value })} placeholder="e.g. 25.28" />
            </div>
            <div>
              <label>Longitude</label>
              <input value={form.lng} onChange={e => setForm({ ...form, lng: e.target.value })} placeholder="e.g. 82.97" />
            </div>
            <div style={{ alignSelf: 'end' }}>
              <button type="button" className="btn secondary" onClick={geolocate}>Use my location</button>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <button className="btn" type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  )
}

