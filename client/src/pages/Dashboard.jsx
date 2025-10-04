import { useEffect, useMemo, useState } from 'react'
import MapView from '../components/MapView'
import TimeSeriesChart from '../components/TimeSeriesChart'
import ParameterSelector from '../components/ParameterSelector'
import AlertsPanel from '../components/AlertsPanel'
import ChatbotWidget from '../components/ChatbotWidget'
import api from '../api'
import { toast } from 'react-toastify'

export default function Dashboard() {
  const [locations, setLocations] = useState([])
  const [location, setLocation] = useState(null)
  const [parameter, setParameter] = useState('do')
  const [series, setSeries] = useState({ last10Days: [], forecast3Days: [], latestAlert: null })

  useEffect(() => { api.get('/api/locations').then(r => setLocations(r.data)) }, [])

  useEffect(() => {
    if (!location) return
    api.get('/api/timeseries', { params: { locationId: location._id, parameter } })
      .then(r => {
        setSeries(r.data)
        if (r.data.latestAlert) toast.warn(`${location.city}: ${r.data.latestAlert.message}`)
      })
      .catch(() => toast.error('Failed to load time series'))
  }, [location, parameter])

  return (
    <div className="container">
      <div className="grid grid-2">
        <div className="card">
          <h3>Map</h3>
          <MapView selectedLocationId={location?._id} onSelectLocation={setLocation} />
        </div>
        <div className="card">
          <h3>Controls</h3>
          <ParameterSelector parameter={parameter} setParameter={setParameter} location={location} setLocation={setLocation} locations={locations} />
        </div>
      </div>
      <div className="grid grid-2" style={{ marginTop: 16 }}>
        <div className="card">
          <h3>Time Series</h3>
          {location ? (
            <TimeSeriesChart last10Days={series.last10Days} forecast3Days={series.forecast3Days} parameter={parameter} />
          ) : (
            <p>Select a location to see charts.</p>
          )}
        </div>
        <AlertsPanel location={location} />
      </div>
      <ChatbotWidget />
    </div>
  )
}

