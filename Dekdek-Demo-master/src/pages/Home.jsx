import React, { useState, useEffect } from 'react'
import { Chart as ChartJS, registerables } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { newsItems, regionalShortages } from '../data/mockData'

ChartJS.register(...registerables)

function NewsCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % newsItems.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const visible = newsItems.slice(current, current + 3).concat(
    current + 3 > newsItems.length ? newsItems.slice(0, (current + 3) % newsItems.length) : []
  ).slice(0, 3)

  const categoryColors = {
    'Teacher Shortage': '#CE1126',
    'Policy Update': '#0038A8',
    'Innovation': '#10b981',
    'Research': '#8b5cf6',
    'Regional News': '#f59e0b',
  }

  return (
    <section className="px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-white">Latest News</h2>
        <div className="flex gap-2">
          {newsItems.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                background: i === current ? '#0038A8' : 'rgba(0,56,168,0.3)',
                boxShadow: i === current ? '0 0 8px rgba(0,56,168,0.8)' : 'none',
                transform: i === current ? 'scale(1.3)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {visible.map((item, idx) => (
          <article
            key={item.id}
            className="p-4 rounded-xl transition-all duration-300 cursor-pointer"
            style={{
              background: '#0f1629',
              border: '1px solid rgba(0,56,168,0.2)',
              opacity: idx === 0 ? 1 : idx === 1 ? 0.9 : 0.75,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0,56,168,0.3)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <span
              className="inline-block px-2 py-0.5 rounded text-xs font-bold mb-2"
              style={{
                background: `${categoryColors[item.category] || '#0038A8'}22`,
                color: categoryColors[item.category] || '#4d9eff',
                border: `1px solid ${categoryColors[item.category] || '#0038A8'}44`,
              }}
            >
              {item.category}
            </span>
            <h3 className="text-sm font-bold text-white mb-2 leading-snug line-clamp-2">{item.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-3">{item.excerpt}</p>
            <p className="text-xs text-slate-600">{item.date}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function ShortagesChart() {
  const levelColors = {
    low: 'rgba(34,197,94,0.7)',
    medium: 'rgba(245,158,11,0.7)',
    high: 'rgba(249,115,22,0.7)',
    critical: 'rgba(239,68,68,0.8)',
  }

  const data = {
    labels: regionalShortages.map(r => r.name),
    datasets: [
      {
        label: 'Science Gap',
        data: regionalShortages.map(r => r.scienceGap),
        backgroundColor: regionalShortages.map(r => levelColors[r.level]),
        borderColor: regionalShortages.map(r => levelColors[r.level].replace('0.7', '1').replace('0.8', '1')),
        borderWidth: 1,
        borderRadius: 3,
      },
      {
        label: 'Math Gap',
        data: regionalShortages.map(r => r.mathGap),
        backgroundColor: regionalShortages.map(r => levelColors[r.level].replace('0.7', '0.45').replace('0.8', '0.5')),
        borderColor: regionalShortages.map(r => levelColors[r.level].replace('0.7', '0.7').replace('0.8', '0.8')),
        borderWidth: 1,
        borderRadius: 3,
      },
    ],
  }

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1200, easing: 'easeInOutQuart' },
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
        callbacks: {
          label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.x.toLocaleString()} vacancies`
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#64748b', font: { family: 'Inter', size: 10 } },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
      y: {
        ticks: { color: '#94a3b8', font: { family: 'Inter', size: 10 } },
        grid: { display: false },
      }
    }
  }

  return (
    <section className="px-6 py-8">
      <h2 className="text-2xl font-black text-white mb-2">National Shortages by Region</h2>
      <p className="text-sm text-slate-500 mb-6">Teacher vacancy counts — Science & Math</p>
      <div
        className="p-4 rounded-xl"
        style={{ background: '#0f1629', border: '1px solid rgba(0,56,168,0.2)', height: '480px' }}
      >
        <Bar data={data} options={options} />
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4">
        {[
          { label: 'Low', color: 'rgba(34,197,94,0.7)' },
          { label: 'Medium', color: 'rgba(245,158,11,0.7)' },
          { label: 'High', color: 'rgba(249,115,22,0.7)' },
          { label: 'Critical', color: 'rgba(239,68,68,0.8)' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ background: l.color }} />
            <span className="text-xs text-slate-400">{l.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: '#0a0e1a' }}>
      {/* Hero */}
      <section
        className="relative px-6 py-16 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0038A8 0%, #0a0e1a 60%, #0f1629 100%)',
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, #0038A8 0%, transparent 50%), radial-gradient(circle at 80% 50%, #CE1126 0%, transparent 50%)',
          }}
        />
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 text-xs font-bold rounded-full" style={{ background: 'rgba(252,209,22,0.15)', color: '#FCD116', border: '1px solid rgba(252,209,22,0.3)' }}>
              🇵🇭 DOST Analytics
            </span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-black text-white leading-tight mb-4" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
            Integrated Data System for Regional<br />
            <span className="text-ph-yellow" style={{ textShadow: '0 0 20px rgba(252,209,22,0.5)' }}>Teacher Profiles, Gaps &amp; Insights</span>
          </h1>
          <p className="text-slate-300 text-lg mb-8 max-w-xl leading-relaxed">
            STARMap PH gives policymakers, educators, and sponsors a real-time view of science and math teacher distribution across all 17 Philippine regions.
          </p>
          <div className="flex gap-8">
            <div>
              <p className="text-3xl font-black text-white" style={{ textShadow: '0 0 20px rgba(77,158,255,0.6)' }}>850k+</p>
              <p className="text-sm text-slate-400">Registered Teachers</p>
            </div>
            <div className="w-px bg-blue-900/40" />
            <div>
              <p className="text-3xl font-black text-white" style={{ textShadow: '0 0 20px rgba(77,158,255,0.6)' }}>17</p>
              <p className="text-sm text-slate-400">Regions Covered</p>
            </div>
            <div className="w-px bg-blue-900/40" />
            <div>
              <p className="text-3xl font-black text-ph-red" style={{ textShadow: '0 0 20px rgba(206,17,38,0.6)' }}>42k</p>
              <p className="text-sm text-slate-400">Unfilled Vacancies</p>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="px-6 py-12">
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
          <div className="p-6 rounded-xl" style={{ background: '#0f1629', border: '1px solid rgba(206,17,38,0.2)' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-6 rounded" style={{ background: '#CE1126' }} />
              <h2 className="text-lg font-black text-white">The Challenge</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              The Philippines faces a critical shortage of qualified science and mathematics teachers, particularly in remote and underserved regions. With over 42,000 unfilled STEM teaching positions, students in areas like BARMM, Caraga, and Zamboanga Peninsula are being taught by generalist educators lacking subject specialization. This results in below-average NAT scores and widens the education inequality gap. Without data-driven solutions, the shortage will grow to an estimated 97,000 vacancies by 2030.
            </p>
          </div>
          <div className="p-6 rounded-xl" style={{ background: '#0f1629', border: '1px solid rgba(0,56,168,0.2)' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-6 rounded" style={{ background: '#0038A8' }} />
              <h2 className="text-lg font-black text-white">The Solution</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              STARMap PH (Science &amp; Technology Analytics and Resource Map Philippines) is an integrated data platform that visualizes teacher shortages, maps school needs, and connects stakeholders in real time. It enables DepEd administrators to identify critical regions, sponsors to direct funding efficiently, and schools to borrow equipment from nearby institutions. By bringing transparency to teacher distribution data, STARMap PH empowers evidence-based policy decisions that can close the STEM education gap across all 17 regions.
            </p>
          </div>
        </div>
      </section>

      <NewsCarousel />
      <ShortagesChart />

      {/* Footer */}
      <footer
        className="mt-8 px-6 py-10"
        style={{ background: '#070b16', borderTop: '1px solid rgba(0,56,168,0.2)' }}
      >
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">⭐</span>
              <span className="text-lg font-black text-white">STARMap <span className="text-ph-yellow">PH</span></span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              An integrated analytics platform for Philippine STEM education. Supporting DepEd's mission to deliver quality education to all Filipinos.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-300 mb-3">Quick Links</h3>
            <ul className="space-y-1 text-xs text-slate-500">
              {['Home', 'STARMap', 'Educators', 'Register', 'Borrow Equipment', 'Sponsor'].map(l => (
                <li key={l}><a href="#" className="hover:text-slate-300 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-300 mb-3">Contact</h3>
            <ul className="space-y-1 text-xs text-slate-500">
              <li>📧 info@starmap.ph</li>
              <li>📞 +63 2 8123 4567</li>
              <li>📱 +63 917 123 4567</li>
              <li className="pt-2 text-slate-600">DepEd Central Office</li>
              <li className="text-slate-600">Meralco Ave, Pasig City</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 text-center text-xs text-slate-700" style={{ borderTop: '1px solid rgba(0,56,168,0.1)' }}>
          © 2026 STARMap PH. Republic of the Philippines. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
