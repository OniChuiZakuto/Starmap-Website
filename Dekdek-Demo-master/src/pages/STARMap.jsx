import React, { useState, useRef, useCallback } from 'react'
import { MapContainer, TileLayer, GeoJSON, Marker, Tooltip, useMap } from 'react-leaflet'
import L from 'leaflet'
import { regionsGeoJSON, schoolsPerRegion } from '../data/mockData'
import { XMarkIcon } from '@heroicons/react/24/outline'

// Hex base colors — used in both polygon fills and the legend so they always match
const LEVEL_HEX = {
  low:      '#00d4aa',   // teal-green  — sufficient supply
  medium:   '#f0c820',   // golden-yellow — moderate gap
  high:     '#ff6b35',   // vivid orange  — high shortage
  critical: '#d90429',   // deep crimson  — crisis
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

const levelColors = Object.fromEntries(
  Object.entries(LEVEL_HEX).map(([k, hex]) => [
    k,
    { fill: hexToRgba(hex, 0.45), stroke: hexToRgba(hex, 0.95), hex }
  ])
)

const LEGEND_LEVELS = [
  { key: 'low',      label: 'Sufficient' },
  { key: 'medium',   label: 'Moderate'   },
  { key: 'high',     label: 'High Need'  },
  { key: 'critical', label: 'Critical'   },
]

function getLevel(feature, heatmap) {
  if (heatmap === 'science') {
    const g = feature.properties.scienceGap
    if (g < 2000) return 'low'
    if (g < 3500) return 'medium'
    if (g < 5000) return 'high'
    return 'critical'
  }
  if (heatmap === 'math') {
    const g = feature.properties.mathGap
    if (g < 1500) return 'low'
    if (g < 2800) return 'medium'
    if (g < 4000) return 'high'
    return 'critical'
  }
  // both: average
  const avg = (feature.properties.scienceGap + feature.properties.mathGap) / 2
  if (avg < 1500) return 'low'
  if (avg < 3000) return 'medium'
  if (avg < 4500) return 'high'
  return 'critical'
}

function FlyTo({ target }) {
  const map = useMap()
  if (target) {
    map.flyTo(target.center, target.zoom, { duration: 1.2 })
  }
  return null
}

function SchoolPins({ schools, onPinClick }) {
  if (!schools) return null
  return schools.map(school => {
    const emoji = school.type === 'mountain' ? '⛰️' : school.type === 'no_power' ? '⚡' : '📍'
    const icon = L.divIcon({
      className: '',
      html: `<div class="school-pin" style="font-size:22px;cursor:pointer;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.9))">${emoji}</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    })
    return (
      <Marker
        key={school.id}
        position={[school.lat, school.lng]}
        icon={icon}
        eventHandlers={{ click: () => onPinClick(school) }}
      >
        <Tooltip>{school.name}</Tooltip>
      </Marker>
    )
  })
}

export default function STARMap() {
  const [heatmap, setHeatmap] = useState('both')
  const [flyTarget, setFlyTarget] = useState(null)
  const [activeRegion, setActiveRegion] = useState(null)
  const [activeSchools, setActiveSchools] = useState(null)
  const [selectedSchool, setSelectedSchool] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const geoJsonRef = useRef()

  const getStyle = useCallback((feature) => {
    const level = getLevel(feature, heatmap)
    const colors = levelColors[level]
    return {
      fillColor: colors.fill,
      fillOpacity: 0.7,
      color: colors.stroke,
      weight: 1.5,
      opacity: 0.9,
    }
  }, [heatmap])

  const onEachFeature = useCallback((feature, layer) => {
    const props = feature.properties
    layer.on({
      mouseover: e => {
        const l = e.target
        const level = getLevel(feature, heatmap)
        const colors = levelColors[level]
        l.setStyle({
          fillOpacity: 0.75,
          weight: 2.5,
          fillColor: hexToRgba(colors.hex, 0.75),
        })
        l.bindTooltip(
          `<div style="font-family:Inter,sans-serif">
            <strong style="color:#e2e8f0">${props.name}</strong><br/>
            <span style="color:#94a3b8;font-size:11px">Science Gap: ${props.scienceGap.toLocaleString()}</span><br/>
            <span style="color:#94a3b8;font-size:11px">Math Gap: ${props.mathGap.toLocaleString()}</span>
          </div>`,
          { permanent: false, sticky: true }
        ).openTooltip()
      },
      mouseout: e => {
        if (geoJsonRef.current) {
          geoJsonRef.current.resetStyle(e.target)
        }
        e.target.closeTooltip()
      },
      click: e => {
        const bounds = e.target.getBounds()
        const center = bounds.getCenter()
        setFlyTarget({ center: [center.lat, center.lng], zoom: 9 })
        setActiveRegion(props)
        setActiveSchools(schoolsPerRegion[props.id] || [])
        setSidebarOpen(false)
        setSelectedSchool(null)
      }
    })
  }, [heatmap])

  const handlePinClick = (school) => {
    setSelectedSchool(school)
    setSidebarOpen(true)
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)', background: '#0a0e1a' }}>
      {/* Top controls */}
      <div
        className="flex items-center gap-4 px-4 py-3 shrink-0"
        style={{ background: '#0f1629', borderBottom: '1px solid rgba(0,56,168,0.2)' }}
      >
        <span className="text-sm font-semibold text-slate-300 mr-2">Heatmap:</span>
        {['science', 'math', 'both'].map(m => (
          <button
            key={m}
            onClick={() => setHeatmap(m)}
            className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200"
            style={{
              background: heatmap === m ? '#0038A8' : 'rgba(0,56,168,0.15)',
              color: heatmap === m ? '#fff' : '#94a3b8',
              border: `1px solid ${heatmap === m ? '#0038A8' : 'rgba(0,56,168,0.3)'}`,
              boxShadow: heatmap === m ? '0 0 10px rgba(0,56,168,0.5)' : 'none',
            }}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
        {activeRegion && (
          <span className="ml-4 text-xs text-slate-500">
            Viewing: <span className="text-slate-300 font-semibold">{activeRegion.name}</span>
            {' '}&mdash; click a school pin to see teachers
          </span>
        )}
      </div>

      {/* Map + Sidebar row */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Map */}
        <div className="flex-1">
          <MapContainer
            center={[12.0, 122.0]}
            zoom={6}
            style={{ width: '100%', height: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />
            <GeoJSON
              key={heatmap}
              ref={geoJsonRef}
              data={regionsGeoJSON}
              style={getStyle}
              onEachFeature={onEachFeature}
            />
            {activeSchools && (
              <SchoolPins schools={activeSchools} onPinClick={handlePinClick} />
            )}
            {flyTarget && <FlyTo target={flyTarget} />}
          </MapContainer>
        </div>

        {/* Right Sidebar */}
        {sidebarOpen && selectedSchool && (
          <div
            className="absolute right-0 top-0 h-full w-72 z-[1000] flex flex-col animate-slide-in-right overflow-hidden"
            style={{
              background: '#0f1629',
              borderLeft: '1px solid rgba(0,56,168,0.3)',
              boxShadow: '-4px 0 24px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header */}
            <div className="p-4 shrink-0" style={{ borderBottom: '1px solid rgba(0,56,168,0.2)' }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium">{activeRegion?.name}</p>
                  <h3 className="text-sm font-black text-white mt-0.5 leading-snug">{selectedSchool.name}</h3>
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded"
                    style={{
                      background: selectedSchool.type === 'mountain' ? 'rgba(245,158,11,0.2)' : selectedSchool.type === 'no_power' ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)',
                      color: selectedSchool.type === 'mountain' ? '#f59e0b' : selectedSchool.type === 'no_power' ? '#ef4444' : '#22c55e',
                    }}
                  >
                    {selectedSchool.type === 'mountain' ? '⛰️ Mountain School' : selectedSchool.type === 'no_power' ? '⚡ No Power' : '📍 Normal School'}
                  </span>
                </div>
                <button
                  onClick={() => { setSidebarOpen(false); setSelectedSchool(null) }}
                  className="p-1 rounded text-slate-500 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Teacher list */}
            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Teachers</p>
              <div className="space-y-2">
                {selectedSchool.teachers.map((t, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg"
                    style={{ background: '#162040', border: '1px solid rgba(0,56,168,0.15)' }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-white">{t.name}</span>
                      <span className="text-xs text-slate-500">{t.years} yrs</span>
                    </div>
                    <span className="text-xs text-ph-yellow">{t.subject}</span>
                    {t.specialization !== t.subject && (
                      <span className="text-xs text-slate-500 ml-2">· {t.specialization}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div
          className="absolute bottom-6 left-4 z-[999] p-3 rounded-xl"
          style={{ background: 'rgba(10,14,26,0.9)', border: '1px solid rgba(0,56,168,0.3)', backdropFilter: 'blur(8px)' }}
        >
          <p className="text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">Legend</p>
          <div className="space-y-1.5 mb-3">
            {LEGEND_LEVELS.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ background: LEVEL_HEX[key], boxShadow: `0 0 6px ${LEVEL_HEX[key]}88` }}
                />
                <span className="text-xs text-slate-300">{label}</span>
              </div>
            ))}
          </div>
          <div className="space-y-1 pt-2" style={{ borderTop: '1px solid rgba(0,56,168,0.2)' }}>
            <p className="text-xs font-bold text-slate-300 mb-1">School Types</p>
            {[['⛰️', 'Mountain'], ['⚡', 'No Power'], ['📍', 'Normal']].map(([e, l]) => (
              <div key={l} className="flex items-center gap-2">
                <span className="text-sm">{e}</span>
                <span className="text-xs text-slate-400">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
