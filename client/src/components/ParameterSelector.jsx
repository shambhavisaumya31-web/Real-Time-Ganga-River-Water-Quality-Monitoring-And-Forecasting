export default function ParameterSelector({ parameter, setParameter, location, setLocation, locations }) {
  return (
    <div className="grid grid-3">
      <div>
        <label>Parameter</label>
        <select value={parameter} onChange={(e) => setParameter(e.target.value)}>
          <option value="do">DO</option>
          <option value="bod">BOD</option>
          <option value="nitrate">Nitrate</option>
          <option value="fecal_coliform">Fecal Coliform</option>
        </select>
      </div>
      <div>
        <label>Location</label>
        <select value={location?._id || ''} onChange={(e) => setLocation(locations.find(l => l._id === e.target.value))}>
          <option value="">Select...</option>
          {locations.map(l => <option key={l._id} value={l._id}>{l.city} - {l.name}</option>)}
        </select>
      </div>
    </div>
  )
}
