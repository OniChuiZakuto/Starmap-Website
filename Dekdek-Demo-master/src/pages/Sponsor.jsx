import React, { useState } from 'react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

const BENEFITS = [
  'Logo displayed on the interactive map',
  'Priority access to shortage insights',
  'Recognition in DepEd reports',
  'Tax deduction eligibility',
  'Quarterly impact reports',
]

function Toast({ show }) {
  if (!show) return null
  return (
    <div
      className="fixed bottom-6 right-6 z-50 px-6 py-4 rounded-xl text-white font-semibold"
      style={{
        background: 'linear-gradient(135deg, #0038A8, #1a4fc8)',
        boxShadow: '0 0 30px rgba(0,56,168,0.5), 0 4px 24px rgba(0,0,0,0.4)',
        animation: 'slideInRight 0.3s ease-out',
      }}
    >
      🎉 Thank you for your support!
    </div>
  )
}

export default function Sponsor() {
  const [form, setForm] = useState({
    org: '', contact: '', email: '', phone: '',
    type: '', amount: '', message: '',
  })
  const [errors, setErrors] = useState({})
  const [showToast, setShowToast] = useState(false)

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: undefined }))
  }

  const validate = () => {
    const e = {}
    if (!form.org.trim()) e.org = 'Required'
    if (!form.contact.trim()) e.contact = 'Required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required'
    if (!form.type) e.type = 'Required'
    return e
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
    setForm({ org: '', contact: '', email: '', phone: '', type: '', amount: '', message: '' })
  }

  const inputClass = (err) =>
    `w-full px-4 py-2.5 rounded-lg text-sm text-white outline-none transition-all focus:ring-2 ${err ? 'border border-red-500 focus:ring-red-500/30' : 'border border-blue-900/30 focus:ring-blue-500/30'}`
  const inputStyle = { background: '#162040' }
  const fieldLabel = 'block text-sm font-semibold text-slate-300 mb-1.5'

  return (
    <div className="p-6" style={{ minHeight: '100%', background: '#0a0e1a' }}>
      <h1 className="text-3xl font-black text-white mb-1">Become a Sponsor</h1>
      <p className="text-slate-500 text-sm mb-8">Partner with STARMap PH to bridge the STEM education gap</p>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Form */}
        <div className="p-6 rounded-2xl" style={{ background: '#0f1629', border: '1px solid rgba(0,56,168,0.2)' }}>
          <h2 className="text-lg font-black text-white mb-6">Sponsor Application</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={fieldLabel}>Organization Name</label>
              <input type="text" value={form.org} onChange={e => set('org', e.target.value)}
                placeholder="Acme Corp" className={inputClass(errors.org)} style={inputStyle} />
              {errors.org && <p className="text-xs text-red-400 mt-1">{errors.org}</p>}
            </div>
            <div>
              <label className={fieldLabel}>Contact Person</label>
              <input type="text" value={form.contact} onChange={e => set('contact', e.target.value)}
                placeholder="Maria Santos" className={inputClass(errors.contact)} style={inputStyle} />
              {errors.contact && <p className="text-xs text-red-400 mt-1">{errors.contact}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={fieldLabel}>Email</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                  placeholder="maria@corp.com" className={inputClass(errors.email)} style={inputStyle} />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className={fieldLabel}>Phone</label>
                <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                  placeholder="+63 917 123 4567" className={inputClass(false)} style={inputStyle} />
              </div>
            </div>
            <div>
              <label className={fieldLabel}>Sponsorship Type</label>
              <select value={form.type} onChange={e => set('type', e.target.value)}
                className={inputClass(errors.type)} style={inputStyle}>
                <option value="">Select type...</option>
                <option value="Funds">Funds</option>
                <option value="Equipment">Equipment</option>
                <option value="Both">Both (Funds + Equipment)</option>
              </select>
              {errors.type && <p className="text-xs text-red-400 mt-1">{errors.type}</p>}
            </div>
            <div>
              <label className={fieldLabel}>Amount / Value (PHP)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">₱</span>
                <input type="number" value={form.amount} onChange={e => set('amount', e.target.value)}
                  placeholder="500,000" min="0"
                  className={`${inputClass(false)} pl-8`}
                  style={inputStyle} />
              </div>
            </div>
            <div>
              <label className={fieldLabel}>Message (Optional)</label>
              <textarea
                value={form.message}
                onChange={e => set('message', e.target.value)}
                rows={3}
                placeholder="Tell us about your organization's mission and how you'd like to contribute..."
                className={`${inputClass(false)} resize-none`}
                style={inputStyle}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-bold text-white transition-all duration-200 mt-2"
              style={{ background: 'linear-gradient(135deg, #FCD116, #f59e0b)', color: '#0a0e1a', boxShadow: '0 0 16px rgba(252,209,22,0.4)' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 28px rgba(252,209,22,0.7)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 16px rgba(252,209,22,0.4)'}
            >
              ★ Submit Sponsorship
            </button>
          </form>
        </div>

        {/* Benefits panel */}
        <div className="space-y-5">
          <div
            className="p-6 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, #1a1200 0%, #2a1f00 50%, #0f1629 100%)',
              border: '1px solid rgba(252,209,22,0.3)',
              boxShadow: '0 0 24px rgba(252,209,22,0.1)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl" style={{ filter: 'drop-shadow(0 0 8px #FCD116)' }}>★</span>
              <h2 className="text-xl font-black text-white">Why Sponsor STARMap PH?</h2>
            </div>

            <div className="space-y-3 mb-6">
              {BENEFITS.map((b, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircleIcon className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#FCD116' }} />
                  <p className="text-sm text-slate-300">{b}</p>
                </div>
              ))}
            </div>

            <div
              className="p-4 rounded-xl mt-4"
              style={{ background: 'rgba(252,209,22,0.08)', border: '1px solid rgba(252,209,22,0.2)' }}
            >
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">Impact Numbers</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-black" style={{ color: '#FCD116', textShadow: '0 0 12px rgba(252,209,22,0.6)' }}>₱2.3B</p>
                  <p className="text-xs text-slate-400 mt-0.5">Funding gap to close</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-white" style={{ textShadow: '0 0 12px rgba(255,255,255,0.2)' }}>850k</p>
                  <p className="text-xs text-slate-400 mt-0.5">Teachers impacted</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sponsor tiers */}
          <div className="p-6 rounded-2xl" style={{ background: '#0f1629', border: '1px solid rgba(0,56,168,0.2)' }}>
            <h3 className="text-sm font-black text-slate-300 uppercase tracking-wider mb-4">Sponsorship Tiers</h3>
            <div className="space-y-3">
              {[
                { tier: 'Gold', amount: '₱1M+', color: '#FCD116', perks: 'Full map branding, DepEd recognition, quarterly reports' },
                { tier: 'Silver', amount: '₱500k+', color: '#94a3b8', perks: 'Map logo, bi-annual reports, priority insights' },
                { tier: 'Bronze', amount: '₱100k+', color: '#b45309', perks: 'Mention in reports, basic impact data' },
              ].map(t => (
                <div
                  key={t.tier}
                  className="flex items-center gap-4 p-3 rounded-lg"
                  style={{ background: '#162040', border: `1px solid ${t.color}33` }}
                >
                  <div className="w-12 text-center">
                    <span className="text-sm font-black" style={{ color: t.color }}>{t.tier}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold" style={{ color: t.color }}>{t.amount}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{t.perks}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Toast show={showToast} />
    </div>
  )
}
