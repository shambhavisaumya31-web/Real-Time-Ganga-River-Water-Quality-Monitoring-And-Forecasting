import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { useEffect, useState } from 'react'
import api from '../api'

// Fix Leaflet marker icons in Vite
import 'leaflet/dist/leaflet.css'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({ iconUrl, shadowUrl: iconShadow })
L.Marker.prototype.options.icon = DefaultIcon

export default function MapView({ selectedLocationId, onSelectLocation }) {
  const [locations, setLocations] = useState([])

  useEffect(() => { api.get('/api/locations').then(r => setLocations(r.data)) }, [])

  const center = [25.2820, 82.9739] // Varanasi default

  return (
    <MapContainer center={center} zoom={6} style={{ height: 400, width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {locations.map(loc => (
        <Marker key={loc._id} position={[loc.coordinates.coordinates[1], loc.coordinates.coordinates[0]]} eventHandlers={{ click: () => onSelectLocation(loc) }}>
          <Popup>
            <div>
              <strong>{loc.name}</strong><br/>
              <small>{loc.city}</small>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

