import React, { useState } from 'react'
import { Chart as ChartJS, registerables } from 'chart.js'
import { Doughnut, Bar, Line } from 'react-chartjs-2'
import { educatorStats, projectionData, regions, regionalShortages } from '../data/mockData'
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet'

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
  const [deployCount, setDeployCount] = useState('')
  const [fromRegion, setFromRegion] = useState('')
  const [toRegion, setToRegion] = useState('')
  const [simulation, setSimulation] = useState(null)

const regionCoords = {
  'NCR': [14.6, 121.0],
  'CAR': [17.3, 121.2],
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

const simulateDeployment = () => {
  const count = Number(deployCount)

  if (!count || !fromRegion || !toRegion) return
  if (!regionCoords[fromRegion] || !regionCoords[toRegion]) return

  const fromData = regionalShortages.find(r => r.name === fromRegion) || {}
  const toData = regionalShortages.find(r => r.name === toRegion) || {}

  const fromCoord = regionCoords[fromRegion]
  const toCoord = regionCoords[toRegion]

  const distance = Math.sqrt(
    Math.pow(fromCoord[0] - toCoord[0], 2) +
    Math.pow(fromCoord[1] - toCoord[1], 2)
  ) * 111

  const travelTime = distance / 60
  const baseExpense = count * 5000

  const levelMultiplier = {
    low: 1,
    medium: 1.5,
    high: 2,
    critical: 3
  }

  const toMultiplier = levelMultiplier[toData?.level || 'medium']

  const travelExpenses = distance * 50 * count
  const relocation = baseExpense * toMultiplier
  const accommodation = baseExpense * 0.8 * toMultiplier
  const facilities = baseExpense * 1.2 * toMultiplier

  const total = travelExpenses + relocation + accommodation + facilities

  let effectFrom = 'none'
  let effectTo = 'none'

  if (toMultiplier >= 2 && count > 100) effectTo = 'good'
  else if (count < 50) effectTo = 'none'
  else effectTo = 'bad'

  if (count > 300) effectFrom = 'bad'
  else if (count > 100) effectFrom = 'none'
  else effectFrom = 'good'

  // Define baseline factors for from/to regions
  const baseFrom = {
    retentionRate: fromData.retentionRate ?? 65,
    scholasticImprovement: fromData.scholasticImprovement ?? 60,
    graduatesIncrease: fromData.graduatesIncrease ?? 70,
    employedSuccess: fromData.employedSuccess ?? 75
  }

  const baseTo = {
    retentionRate: toData.retentionRate ?? 55,
    scholasticImprovement: toData.scholasticImprovement ?? 50,
    graduatesIncrease: toData.graduatesIncrease ?? 60,
    employedSuccess: toData.employedSuccess ?? 65
  }

  const factors = [
    {
      key: 'retentionRate',
      name: 'Retention Rate',
      fromOriginal: baseFrom.retentionRate,
      fromAfter: Math.max(0, baseFrom.retentionRate - 5),
      toOriginal: baseTo.retentionRate,
      toAfter: Math.min(100, baseTo.retentionRate + 5),
    },
    {
      key: 'scholasticImprovement',
      name: 'Scholastic Improvement',
      fromOriginal: baseFrom.scholasticImprovement,
      fromAfter: Math.max(0, baseFrom.scholasticImprovement - 5),
      toOriginal: baseTo.scholasticImprovement,
      toAfter: Math.min(100, baseTo.scholasticImprovement + 5),
    },
    {
      key: 'graduatesIncrease',
      name: 'Graduates Increase',
      fromOriginal: baseFrom.graduatesIncrease,
      fromAfter: Math.max(0, baseFrom.graduatesIncrease - 5),
      toOriginal: baseTo.graduatesIncrease,
      toAfter: Math.min(100, baseTo.graduatesIncrease + 5),
    },
    {
      key: 'employedSuccess',
      name: 'Successfully Employed',
      fromOriginal: baseFrom.employedSuccess,
      fromAfter: Math.max(0, baseFrom.employedSuccess - 5),
      toOriginal: baseTo.employedSuccess,
      toAfter: Math.min(100, baseTo.employedSuccess + 5),
    }
  ];

  setSimulation({
    distance,
    travelTime,
    travelExpenses,
    relocation,
    accommodation,
    facilities,
    total,
    effectFrom,
    effectTo,
    fromCoord,
    toCoord,
    fromRegion,
    toRegion,
    factors
  })
}

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
  const availPct = stats.needed
  ? Math.round((stats.available / stats.needed) * 100)
  : 0

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

let aiProjection = null

if (simulation) {
  let summary = ''
  const from = simulation.effectFrom
  const to = simulation.effectTo

  if (from === 'good' && to === 'good')
    summary = 'This deployment benefits both regions, improving balance and outcomes.'
  else if (from === 'good' && to === 'none')
    summary = 'The source region benefits, but the destination sees minimal improvement.'
  else if (from === 'good' && to === 'bad')
    summary = 'The source region improves, but the destination may suffer inefficiencies.'
  else if (from === 'none' && to === 'good')
    summary = 'The deployment significantly helps the destination region with minimal impact on the source.'
  else if (from === 'none' && to === 'none')
    summary = 'This deployment has minimal overall impact on both regions.'
  else if (from === 'none' && to === 'bad')
    summary = 'The deployment introduces inefficiencies in the destination region without helping the source.'
  else if (from === 'bad' && to === 'good')
    summary = 'The destination benefits, but the source region may experience shortages.'
  else if (from === 'bad' && to === 'none')
    summary = 'The source region is negatively affected while the destination gains little.'
  else if (from === 'bad' && to === 'bad')
    summary = 'Both regions are negatively affected — this deployment is not recommended.'
  else summary = 'No significant effect detected.'

  aiProjection = (
    <div className="mt-4 space-y-3">
      <div className="p-4 rounded bg-[#0a0e1a] text-slate-300">
        <p className="text-xs text-blue-400 font-bold">AI PROJECTION</p>

        <p>
          With a budget of <span className="text-white font-bold">₱{simulation.total.toLocaleString()}</span>,<br />
          The <span className="text-white">{fromRegion}</span> region will deploy <span className="text-white">{deployCount}</span> teachers to <span className="text-white">{toRegion}</span>.
        </p>

        <p className="text-slate-400">{summary}</p>
      </div>

      <div style={{ height: '250px' }}>
        <Line
          data={{
            labels: ['Grades', 'Retention', 'Graduation', 'Career'],
            datasets: [
              {
                label: `${toRegion} Impact`,
                data: [
                  to === 'good' ? 80 : to === 'bad' ? 40 : 60,
                  to === 'good' ? 75 : to === 'bad' ? 45 : 60,
                  to === 'good' ? 78 : to === 'bad' ? 42 : 60,
                  to === 'good' ? 82 : to === 'bad' ? 38 : 60
                ],
                borderColor: '#00d4aa',
                tension: 0.4
              }
            ]
          }}
          options={lineOptions}
        />
      </div>
    </div>
  )
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
{/* ================= SIMULATION SECTION ================= */}
<div className="p-5 rounded-xl space-y-4"
  style={{ background: '#0f1629', border: '1px solid rgba(0,56,168,0.2)' }}>

  <h2 className="text-lg font-black text-white">Simulation</h2>

  {/* INPUTS */}
  <div className="grid md:grid-cols-4 gap-3">
    <input
      type="number"
      placeholder="Deploy teachers"
      value={deployCount}
      onChange={e => setDeployCount(e.target.value)}
      className="p-2 rounded bg-[#0a0e1a] text-white"
    />

    <select onChange={e => setFromRegion(e.target.value)} className="p-2 rounded bg-[#0a0e1a] text-white">
      <option value="">From</option>
      {regions.map(r => (
        <option key={r} value={r}>{r}</option>
      ))}
    </select>

    <select onChange={e => setToRegion(e.target.value)} className="p-2 rounded bg-[#0a0e1a] text-white">
      <option value="">To</option>
      {regions.map(r => (
        <option key={r} value={r}>{r}</option>
      ))}
    </select>

    <button
      onClick={simulateDeployment}
      className="bg-blue-700 text-white rounded font-bold"
    >
      Simulate
    </button>
  </div>

  {/* RESULTS INFO */}
  {simulation && (
    <div className="grid md:grid-cols-2 gap-4 mt-4">
      <div className="space-y-2 text-sm text-slate-300">
        <p>Teachers Deployed: {deployCount}</p>
        <p>Distance: {simulation.distance.toFixed(2)} km</p>
        <p>Travel Time: {simulation.travelTime.toFixed(2)} hrs</p>
        <p>Travel Expenses: ₱{simulation.travelExpenses.toLocaleString()}</p>
        <p>Relocation: ₱{simulation.relocation.toLocaleString()}</p>
        <p>Accommodation: ₱{simulation.accommodation.toLocaleString()}</p>
        <p>Facilities: ₱{simulation.facilities.toLocaleString()}</p>
        <p className="text-white font-bold">Total: ₱{simulation.total.toLocaleString()}</p>
      </div>

      {/* MINI MAP */}
      <div style={{ height: '250px' }}>
        <MapContainer center={[12, 122]} zoom={5} style={{ height: '100%' }}>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          <Marker position={simulation.fromCoord} />
          <Marker position={simulation.toCoord} />
          <Polyline positions={[simulation.fromCoord, simulation.toCoord]} color="blue" />
        </MapContainer>
      </div>
    </div>
  )}

  {/* FACTORS AND GRAPHS */}
  {simulation && simulation.factors && (
    <div className="grid md:grid-cols-2 gap-6 mt-6">
      {simulation.factors.map(factor => (
        <div key={factor.key} className="mb-6">
          <p className="text-white font-bold mb-2">{factor.name}</p>
          <div className="grid md:grid-cols-2 gap-4">

            {/* FROM REGION */}
            <div className="p-4 rounded-xl" style={{ background: '#0f1629', border: '1px solid rgba(0,56,168,0.2)' }}>
              <p className="text-white font-semibold mb-2">{simulation.fromRegion} Success Percentage</p>
              <div style={{ width: '100%', height: '200px' }}>
                <Bar
                  data={{
                    labels: ['Original', 'After Deployment'],
                    datasets: [{
                      label: factor.name,
                      data: [factor.fromOriginal, factor.fromAfter],
                      backgroundColor: ['#0038A8', '#0056d4']
                    }]
                  }}
                  options={{
                    responsive: true,
                    scales: { y: { beginAtZero: true, min: 0, max: 100 } },
                    plugins: { legend: { display: false } }
                  }}
                />
              </div>
              <p className="text-slate-300 mt-2">
                In {simulation.fromRegion}, {factor.name} decreased from {factor.fromOriginal}% to {factor.fromAfter}%. 
                The deployment of teachers reduced local capacity. 
                Students may experience slightly lower outcomes. 
                The effect is modest but visible. 
                Support measures may mitigate losses. 
                Overall, {simulation.fromRegion} shows a slight decline in {factor.name}.
              </p>
            </div>

            {/* TO REGION */}
            <div className="p-4 rounded-xl" style={{ background: '#0f1629', border: '1px solid rgba(0,56,168,0.2)' }}>
              <p className="text-white font-semibold mb-2">{simulation.toRegion} Success Percentage</p>
              <div style={{ width: '100%', height: '200px' }}>
                <Bar
                  data={{
                    labels: ['Original', 'After Deployment'],
                    datasets: [{
                      label: factor.name,
                      data: [factor.toOriginal, factor.toAfter],
                      backgroundColor: ['#CE1126', '#FFBA08']
                    }]
                  }}
                  options={{
                    responsive: true,
                    scales: { y: { beginAtZero: true, min: 0, max: 100 } },
                    plugins: { legend: { display: false } }
                  }}
                />
              </div>
              <p className="text-slate-300 mt-2">
                In {simulation.toRegion}, {factor.name} increased from {factor.toOriginal}% to {factor.toAfter}%. 
                Receiving teachers boosted local capacity. 
                Students demonstrate higher outcomes. 
                Positive trends are visible across metrics. 
                Integration was effective. 
                Overall, {simulation.toRegion} shows improvement in {factor.name}.
              </p>
            </div>

          </div>
        </div>
      ))}
    </div>
  )}

  {/* FINAL CONCLUSION */}
  {simulation && simulation.factors && (
    <div className="mt-4 p-4 rounded bg-[#0a0e1a] text-slate-300">
      <p className="text-white font-bold">Deployment Verdict:</p>
      {(() => {
        const totalFromLoss = simulation.factors.reduce((sum, f) => sum + (f.fromOriginal - f.fromAfter), 0)
        const totalToGain = simulation.factors.reduce((sum, f) => sum + (f.toAfter - f.toOriginal), 0)
        const score = totalToGain - totalFromLoss
        if(score < 15) return <p>Not Worth It — deployment negatively impacts one or both regions significantly.</p>;
        else if(score < 35) return <p>Moderately Effective — deployment has mixed effects across regions.</p>;
        else return <p>Worth It — deployment improves outcomes in both regions significantly.</p>;
      })()}
    </div>
  )}
</div>


    </div>
  )
}
