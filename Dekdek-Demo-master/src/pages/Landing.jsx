import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer } from 'react-leaflet'
import ParticleBackground from '../components/ParticleBackground'
import '../data/mockData'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0e1a]">
      {/* Background Map */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={[12.0, 122.0]}
          zoom={6}
          zoomControl={false}
          dragging={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          touchZoom={false}
          keyboard={false}
          attributionControl={false}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution=""
          />
        </MapContainer>
      </div>

      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: 'linear-gradient(135deg, rgba(10,14,26,0.85) 0%, rgba(10,14,26,0.7) 50%, rgba(10,14,26,0.85) 100%)',
        }}
      />

      {/* Particles */}
      <ParticleBackground />

      {/* Center Content */}
      <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
        <div className="text-center max-w-2xl animate-fade-in">
          {/* Star icon */}
          <div className="flex justify-center mb-6">
            <span
              className="text-6xl"
              style={{
                filter: 'drop-shadow(0 0 20px #FCD116) drop-shadow(0 0 40px #FCD116)',
                animation: 'float 4s ease-in-out infinite',
              }}
            >
              ⭐
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-6xl lg:text-7xl font-black text-white tracking-tight mb-4"
            style={{
              textShadow: '0 0 30px rgba(0,56,168,0.9), 0 0 60px rgba(0,56,168,0.5), 0 2px 4px rgba(0,0,0,0.8)',
            }}
          >
            STAR<span className="text-ph-yellow" style={{ textShadow: '0 0 30px rgba(252,209,22,0.9)' }}>Map</span>{' '}
            <span className="text-ph-red" style={{ textShadow: '0 0 30px rgba(206,17,38,0.9)' }}>PH</span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-xl lg:text-2xl font-semibold text-slate-200 mb-3 tracking-wide"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
          >
            Map Your Path to STEM Excellence
          </p>

          {/* Description */}
          <p className="text-slate-400 text-base lg:text-lg mb-10 leading-relaxed max-w-lg mx-auto">
            Empowering Science &amp; Math education across{' '}
            <span className="text-ph-yellow font-semibold">17 regions</span> of the Philippines
          </p>

          {/* CTA Button */}
          <button
            onClick={() => navigate('/home')}
            className="group relative inline-flex items-center gap-3 px-10 py-4 text-lg font-bold text-white rounded-2xl transition-all duration-300 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #0038A8 0%, #1a4fc8 50%, #0038A8 100%)',
              boxShadow: '0 0 20px rgba(0,56,168,0.6), 0 0 40px rgba(0,56,168,0.3), 0 8px 32px rgba(0,0,0,0.5)',
              animation: 'glowPulse 2s ease-in-out infinite',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'
              e.currentTarget.style.boxShadow = '0 0 30px rgba(0,56,168,0.9), 0 0 60px rgba(0,56,168,0.5), 0 12px 40px rgba(0,0,0,0.6)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)'
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0,56,168,0.6), 0 0 40px rgba(0,56,168,0.3), 0 8px 32px rgba(0,0,0,0.5)'
            }}
          >
            <span>Enter Dashboard</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>

            {/* shimmer effect */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
              }}
            />
          </button>

          {/* Small badge */}
          <p className="mt-6 text-xs text-slate-600 font-medium tracking-widest uppercase">
            DepEd · STEM · Regional Analytics Platform
          </p>
        </div>
      </div>
    </div>
  )
}
