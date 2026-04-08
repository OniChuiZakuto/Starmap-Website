import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { equipmentLenders, regions } from '../data/mockData'

const EQUIPMENT_OPTIONS = ['Microscopes', 'Laptops', 'Chemistry Kits', 'Math Manipulatives', 'Science Books', 'Lab Equipment']

function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// rough center coords for each region (by region name)
const regionCenters = {
  'NCR': [14.62, 121.05],
  'CAR': [17.35, 121.17],
  'Region I - Ilocos': [17.6, 120.3],
  'Region II - Cagayan Valley': [17.2, 121.8],
  'Region III - Central Luzon': [15.2, 120.7],
  'Region IV-A - CALABARZON': [14.1, 121.5],
  'Region IV-B - MIMAROPA': [13.0, 120.8],
  'Region V - Bicol': [13.3, 123.5],
  'Region VI - Western Visayas': [10.9, 122.7],
  'Region VII - Central Visayas': [10.2, 123.9],
  'Region VIII - Eastern Visayas': [11.2, 124.8],
  'Region IX - Zamboanga Peninsula': [7.8, 122.5],
  'Region X - Northern Mindanao': [8.5, 124.4],
  'Region XI - Davao Region': [7.0, 126.1],
  'Region XII - SOCCSKSARGEN': [6.5, 124.6],
  'Region XIII - Caraga': [8.8, 125.9],
  'BARMM': [6.0, 121.0],
}

function makeIcon(color, label) {
  return L.divIcon({
    className: '',
    html: `<div style="background:${color};border:2px solid #fff;border-radius:50%;width:14px;height:14px;box-shadow:0 0 8px ${color};" title="${label}"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })
}

function FitBounds({ bounds }) {
  const map = useMap()
  if (bounds && bounds.length > 0) {
    try { map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 }) } catch {}
  }
  return null
}

export default function Borrow() {
  const [form, setForm] = useState({ school: '', region: '', equipment: '' })
  const [submitted, setSubmitted] = useState(false)
  const [lenders, setLenders] = useState([])
  const [userCoords, setUserCoords] = useState(null)
  const [mapBounds, setMapBounds] = useState(null)
  const [errors, setErrors] = useState({})

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.school.trim()) errs.school = 'Required'
    if (!form.region) errs.region = 'Required'
    if (!form.equipment) errs.equipment = 'Required'
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    const center = regionCenters[form.region] || [14.62, 121.05]
    const userLat = center[0] + (Math.random() - 0.5) * 0.5
    const userLng = center[1] + (Math.random() - 0.5) * 0.5
    setUserCoords([userLat, userLng])

    const withDist = equipmentLenders
      .map(l => ({ ...l, distance: Math.round(getDistanceKm(userLat, userLng, l.lat, l.lng)) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 8)

    setLenders(withDist)
    setSubmitted(true)

    const allPoints = [[userLat, userLng], ...withDist.map(l => [l.lat, l.lng])]
    setMapBounds(allPoints)
  }

  const nearest = lenders[0]

  const inputClass = (err) =>
    `w-full px-4 py-2.5 rounded-lg text-sm text-white outline-none transition-all focus:ring-2 ${err ? 'border border-red-500 focus:ring-red-500/30' : 'border border-blue-900/30 focus:ring-blue-500/30'}`
  const inputStyle = { background: '#162040' }

  return (
    <div className="p-6" style={{ minHeight: '100%', background: '#0a0e1a' }}>
      <h1 className="text-3xl font-black text-white mb-1">Borrow Equipment</h1>
      <p className="text-slate-500 text-sm mb-6">Find the nearest school or institution willing to lend STEM equipment</p>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="p-6 rounded-2xl space-y-5" style={{ background: '#0f1629', border: '1px solid rgba(0,56,168,0.2)' }}>
          <h2 className="text-lg font-black text-white">Your School's Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">School Name</label>
              <input
                type="text"
                value={form.school}
                onChange={e => set('school', e.target.value)}
                placeholder="e.g. San Jose National High School"
                className={inputClass(errors.school)}
                style={inputStyle}
              />
              {errors.school && <p className="text-xs text-red-400 mt-1">{errors.school}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">Region</label>
              <select
                value={form.region}
                onChange={e => set('region', e.target.value)}
                className={inputClass(errors.region)}
                style={inputStyle}
              >
                <option value="">Select your region...</option>
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              {errors.region && <p className="text-xs text-red-400 mt-1">{errors.region}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">Equipment Needed</label>
              <select
                value={form.equipment}
                onChange={e => set('equipment', e.target.value)}
                className={inputClass(errors.equipment)}
                style={inputStyle}
              >
                <option value="">Select equipment...</option>
                {EQUIPMENT_OPTIONS.map(eq => <option key={eq} value={eq}>{eq}</option>)}
              </select>
              {errors.equipment && <p className="text-xs text-red-400 mt-1">{errors.equipment}</p>}
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-bold text-white transition-all duration-200"
              style={{ background: 'linear-gradient(135deg, #0038A8, #1a4fc8)', boxShadow: '0 0 12px rgba(0,56,168,0.4)' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(0,56,168,0.7)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 12px rgba(0,56,168,0.4)'}
            >
              Find Nearest Lenders →
            </button>
          </form>
        </div>

        {/* Map */}
        <div className="rounded-2xl overflow-hidden" style={{ height: '400px', border: '1px solid rgba(0,56,168,0.2)' }}>
          <MapContainer
            center={[12.0, 122.0]}
            zoom={6}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; CARTO'
            />
            {submitted && mapBounds && <FitBounds bounds={mapBounds} />}
            {userCoords && (
              <Marker
                position={userCoords}
                icon={L.divIcon({
                  className: '',
                  html: `<div style="background:#0038A8;border:3px solid #fff;border-radius:50%;width:18px;height:18px;box-shadow:0 0 14px #4d9eff;"></div>`,
                  iconSize: [18, 18],
                  iconAnchor: [9, 9],
                })}
              >
                <Popup><strong style={{ color: '#e2e8f0' }}>{form.school}</strong><br /><span style={{ color: '#94a3b8', fontSize: 11 }}>Your Location</span></Popup>
              </Marker>
            )}
            {lenders.map((l, i) => (
              <Marker
                key={l.id}
                position={[l.lat, l.lng]}
                icon={makeIcon(i === 0 ? '#FCD116' : '#22c55e', l.name)}
              >
                <Popup>
                  <strong style={{ color: '#e2e8f0' }}>{l.name}</strong><br />
                  <span style={{ color: '#94a3b8', fontSize: 11 }}>{l.region} — {l.distance} km away</span><br />
                  <span style={{ color: '#4d9eff', fontSize: 11 }}>{l.equipment.join(', ')}</span>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Lender list */}
      {submitted && lenders.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-black text-white mb-4">
            Nearest Lenders for <span className="text-ph-yellow">{form.equipment}</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {lenders.map((l, i) => (
              <div
                key={l.id}
                className="p-4 rounded-xl transition-all duration-300"
                style={{
                  background: '#0f1629',
                  border: i === 0 ? '1px solid #FCD116' : '1px solid rgba(0,56,168,0.2)',
                  boxShadow: i === 0 ? '0 0 16px rgba(252,209,22,0.3)' : 'none',
                }}
              >
                {i === 0 && (
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-bold mb-2" style={{ background: 'rgba(252,209,22,0.15)', color: '#FCD116' }}>
                    ★ Nearest
                  </span>
                )}
                <h3 className="text-sm font-bold text-white leading-snug mb-1">{l.name}</h3>
                <p className="text-xs text-slate-500 mb-2">{l.region}</p>
                <p className="text-xs font-semibold" style={{ color: i === 0 ? '#FCD116' : '#22c55e' }}>
                  {l.distance} km away
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {l.equipment.map(eq => (
                    <span key={eq} className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,56,168,0.2)', color: '#4d9eff' }}>{eq}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
