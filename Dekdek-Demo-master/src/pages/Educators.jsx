import React, { useState, useEffect, useRef } from 'react'
import { Chart as ChartJS, registerables } from 'chart.js'
import { Doughnut, Bar, Line } from 'react-chartjs-2'
import { educatorStats, projectionData } from '../data/mockData'

ChartJS.register(...registerables)

const chartDefaults = {
  plugins: {
    legend: {
      labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 } }
    },
    tooltip: {
      backgroundColor: '#0f1629',
      borderColor: 'rgba(0,56,168,0.4)',
      borderWidth: 1,
      titleColor: '#e2e8f0',
      bodyColor: '#94a3b8',
    }
  }
}

export default function Educators() {
  const [toggle, setToggle] = useState('both')

  const getStats = () => {
    if (toggle === 'math') return educatorStats.math
    if (toggle === 'science') return educatorStats.science
    return {
      needed: educatorStats.math.needed + educatorStats.science.needed,
      available: educatorStats.math.available + educatorStats.science.available,
      specializations: [
        ...educatorStats.science.specializations,
        ...educatorStats.math.specializations,
      ]
    }
  }

  const stats = getStats()
  const availPct = Math.round((stats.available / stats.needed) * 100)

  // Donut chart
  const donutData = {
    labels: ['Available', 'Needed (Gap)'],
    datasets: [{
      data: [stats.available, stats.needed - stats.available],
      backgroundColor: ['rgba(0,56,168,0.8)', 'rgba(206,17,38,0.7)'],
      borderColor: ['#0038A8', '#CE1126'],
      borderWidth: 2,
      hoverOffset: 8,
    }]
  }

  const donutOptions = {
    ...chartDefaults,
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      ...chartDefaults.plugins,
      legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 }, padding: 16 } },
      tooltip: chartDefaults.plugins.tooltip,
    }
  }

  // Bar chart - specializations
  const specData = {
    labels: stats.specializations.map(s => s.name),
    datasets: [
      {
        label: 'Needed',
        data: stats.specializations.map(s => s.needed),
        backgroundColor: 'rgba(206,17,38,0.6)',
        borderColor: '#CE1126',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Available',
        data: stats.specializations.map(s => s.available),
        backgroundColor: 'rgba(0,56,168,0.6)',
        borderColor: '#0038A8',
        borderWidth: 1,
        borderRadius: 4,
      },
    ]
  }

  const barOptions = {
    ...chartDefaults,
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 800 },
    plugins: {
      ...chartDefaults.plugins,
      tooltip: {
        ...chartDefaults.plugins.tooltip,
        callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()}` }
      }
    },
    scales: {
      x: {
        ticks: { color: '#64748b', font: { family: 'Inter', size: 10 } },
        grid: { display: false },
      },
      y: {
        ticks: { color: '#64748b', font: { family: 'Inter', size: 10 } },
        grid: { color: 'rgba(255,255,255,0.05)' },
      }
    }
  }

  // Line chart - projections
  const lineData = {
    labels: projectionData.labels,
    datasets: [
      {
        label: 'Available Teachers',
        data: toggle === 'math'
          ? projectionData.math
          : toggle === 'science'
            ? projectionData.science
            : projectionData.math.map((v, i) => v + projectionData.science[i]),
        borderColor: '#0038A8',
        backgroundColor: 'rgba(0,56,168,0.15)',
        fill: false,
        tension: 0.4,
        pointBackgroundColor: '#0038A8',
        pointRadius: 5,
        borderWidth: 2,
      },
      {
        label: 'Teachers Needed',
        data: projectionData.needed,
        borderColor: '#CE1126',
        backgroundColor: 'rgba(206,17,38,0.1)',
        fill: '-1',
        tension: 0.4,
        pointBackgroundColor: '#CE1126',
        pointRadius: 5,
        borderWidth: 2,
      },
    ]
  }

  const lineOptions = {
    ...chartDefaults,
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1000 },
    plugins: {
      ...chartDefaults.plugins,
      tooltip: {
        ...chartDefaults.plugins.tooltip,
        callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()}` }
      }
    },
    scales: {
      x: {
        ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
      y: {
        ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } },
        grid: { color: 'rgba(255,255,255,0.05)' },
      }
    }
  }

  return (
    <div className="p-6 space-y-8" style={{ background: '#0a0e1a', minHeight: '100%' }}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white mb-1">Educator Analytics</h1>
        <p className="text-slate-500 text-sm">Teacher availability, gaps, and projections across the Philippines</p>
      </div>

      {/* Toggle */}
      <div className="flex gap-2">
        {['math', 'science', 'both'].map(m => (
          <button
            key={m}
            onClick={() => setToggle(m)}
            className="px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
            style={{
              background: toggle === m ? '#0038A8' : 'rgba(0,56,168,0.15)',
              color: toggle === m ? '#fff' : '#94a3b8',
              border: `1px solid ${toggle === m ? '#0038A8' : 'rgba(0,56,168,0.3)'}`,
              boxShadow: toggle === m ? '0 0 10px rgba(0,56,168,0.4)' : 'none',
            }}
          >
            {m === 'both' ? 'Math + Science' : m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Teachers Needed', value: stats.needed.toLocaleString(), color: '#CE1126', glow: 'rgba(206,17,38,0.4)' },
          { label: 'Teachers Available', value: stats.available.toLocaleString(), color: '#0038A8', glow: 'rgba(0,56,168,0.4)' },
          { label: 'Fill Rate', value: `${availPct}%`, color: '#FCD116', glow: 'rgba(252,209,22,0.4)' },
        ].map(c => (
          <div key={c.label} className="p-4 rounded-xl" style={{ background: '#0f1629', border: `1px solid ${c.glow}` }}>
            <p className="text-xs text-slate-500 mb-1">{c.label}</p>
            <p className="text-2xl font-black" style={{ color: c.color, textShadow: `0 0 10px ${c.glow}` }}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Donut */}
        <div className="p-5 rounded-xl" style={{ background: '#0f1629', border: '1px solid rgba(0,56,168,0.2)' }}>
          <h2 className="text-lg font-black text-white mb-1">Needed vs. Available</h2>
          <p className="text-xs text-slate-500 mb-4">{availPct}% fill rate — {(100 - availPct)}% gap</p>
          <div className="relative" style={{ height: '260px' }}>
            <Doughnut data={donutData} options={donutOptions} />
            {/* Center label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ paddingBottom: '32px' }}>
              <div className="text-center">
                <p className="text-2xl font-black text-white">{availPct}%</p>
                <p className="text-xs text-slate-400">Available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bar */}
        <div className="p-5 rounded-xl" style={{ background: '#0f1629', border: '1px solid rgba(0,56,168,0.2)' }}>
          <h2 className="text-lg font-black text-white mb-1">By Specialization</h2>
          <p className="text-xs text-slate-500 mb-4">Needed vs. available per subject</p>
          <div style={{ height: '260px' }}>
            <Bar key={toggle} data={specData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* Line chart */}
      <div className="p-5 rounded-xl" style={{ background: '#0f1629', border: '1px solid rgba(0,56,168,0.2)' }}>
        <h2 className="text-lg font-black text-white mb-1">Projected Teacher Shortage 2026–2030</h2>
        <p className="text-xs text-slate-500 mb-4">
          Shaded area = growing shortage gap. Available teachers declining as retirements outpace hiring.
        </p>
        <div style={{ height: '300px' }}>
          <Line key={`line-${toggle}`} data={lineData} options={lineOptions} />
        </div>
      </div>
    </div>
  )
}
