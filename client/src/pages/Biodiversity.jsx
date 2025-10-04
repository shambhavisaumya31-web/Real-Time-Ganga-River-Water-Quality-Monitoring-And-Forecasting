import { useEffect, useState } from 'react'
import api from '../api'

export default function Biodiversity() {
  const [rows, setRows] = useState([])

  useEffect(() => { api.get('/api/biodiversity').then(r => setRows(r.data)) }, [])

  return (
    <div className="container">
      <div className="card">
        <h3>Biodiversity by Location</h3>
        {rows.map(row => (
          <div key={row._id} style={{ marginBottom: 12 }}>
            <h4>{row.location?.city} - {row.location?.name}</h4>
            <ul className="list">
              {row.species.map((s, i) => (
                <li key={i}>{s.commonName} (<i>{s.scientificName}</i>) — {s.category}, {s.status}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

