import React from 'react'
import { AcademicCapIcon, ExclamationTriangleIcon, BeakerIcon } from '@heroicons/react/24/outline'

const stats = [
  {
    icon: AcademicCapIcon,
    value: '850k',
    label: 'Registered Teachers',
    color: '#4d9eff',
    glow: 'rgba(77,158,255,0.4)',
    border: 'rgba(77,158,255,0.3)',
    bg: 'rgba(0,56,168,0.15)',
  },
  {
    icon: ExclamationTriangleIcon,
    value: '5',
    label: 'Critical Regions',
    color: '#ff4d6d',
    glow: 'rgba(206,17,38,0.4)',
    border: 'rgba(206,17,38,0.3)',
    bg: 'rgba(206,17,38,0.1)',
  },
  {
    icon: BeakerIcon,
    value: 'Physics',
    label: 'Top Needed Subject',
    color: '#FCD116',
    glow: 'rgba(252,209,22,0.4)',
    border: 'rgba(252,209,22,0.3)',
    bg: 'rgba(252,209,22,0.08)',
  },
]

export default function Sidebar() {
  return (
    <aside
      className="hidden lg:flex flex-col w-56 shrink-0 pt-4 pb-6 gap-4"
      style={{
        background: 'linear-gradient(180deg, #0f1629 0%, #0a0e1a 100%)',
        borderRight: '1px solid rgba(0,56,168,0.2)',
        minHeight: '100%',
      }}
    >
      <div className="px-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 px-1">Overview</p>
        <div className="flex flex-col gap-3">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="p-3 rounded-xl transition-all duration-300 cursor-default"
              style={{
                background: stat.bg,
                border: `1px solid ${stat.border}`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = `0 0 16px ${stat.glow}`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className="w-4 h-4 shrink-0" style={{ color: stat.color }} />
                <span
                  className="text-xl font-black"
                  style={{ color: stat.color, textShadow: `0 0 10px ${stat.glow}` }}
                >
                  {stat.value}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium leading-tight">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-3 mt-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 px-1">Quick Info</p>
        <div
          className="p-3 rounded-xl text-xs text-slate-400 leading-relaxed"
          style={{ background: 'rgba(15,22,41,0.8)', border: '1px solid rgba(0,56,168,0.15)' }}
        >
          <p className="text-slate-300 font-semibold mb-1">Data as of</p>
          <p>April 2026</p>
          <p className="mt-2 text-slate-300 font-semibold">Source</p>
          <p>DepEd EBEIS</p>
        </div>
      </div>

      <div className="px-3 mt-auto">
        <div
          className="p-3 rounded-xl text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(0,56,168,0.3), rgba(206,17,38,0.2))',
            border: '1px solid rgba(0,56,168,0.3)',
          }}
        >
          <p className="text-xs text-slate-400 mb-1">Shortage Gap</p>
          <p className="text-lg font-black text-ph-yellow" style={{ textShadow: '0 0 10px rgba(252,209,22,0.5)' }}>
            ₱2.3B
          </p>
          <p className="text-xs text-slate-500">Est. funding needed</p>
        </div>
      </div>
    </aside>
  )
}
