import React, { useState } from 'react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { specializations, regions } from '../data/mockData'

const STEPS = ['Personal Info', 'Professional Info', 'Career Info']

function Confetti() {
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    color: ['#FCD116', '#0038A8', '#CE1126', '#4d9eff', '#10b981'][i % 5],
    delay: Math.random() * 1.5,
    size: Math.random() * 8 + 6,
    duration: 2.5 + Math.random() * 1.5,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            top: '-20px',
            background: p.color,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

function StepIndicator({ current }) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((label, i) => (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
              style={
                i < current
                  ? { background: '#10b981', border: '2px solid #10b981', color: '#fff', boxShadow: '0 0 10px rgba(16,185,129,0.5)' }
                  : i === current
                    ? { background: '#0038A8', border: '2px solid #0038A8', color: '#fff', boxShadow: '0 0 12px rgba(0,56,168,0.7)' }
                    : { background: '#162040', border: '2px solid rgba(0,56,168,0.3)', color: '#64748b' }
              }
            >
              {i < current ? <CheckCircleIcon className="w-5 h-5" /> : i + 1}
            </div>
            <span className="text-xs mt-1.5 font-medium" style={{ color: i === current ? '#e2e8f0' : '#64748b' }}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className="flex-1 h-0.5 mx-2 mb-5 transition-all duration-500"
              style={{ background: i < current ? '#10b981' : 'rgba(0,56,168,0.2)' }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

function FieldWrapper({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-300 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
}

const inputClass = (hasError) =>
  `w-full px-4 py-2.5 rounded-lg text-sm text-white transition-all duration-200 outline-none focus:ring-2 ${
    hasError
      ? 'border border-red-500 focus:ring-red-500/30'
      : 'border border-blue-900/30 focus:ring-blue-500/30 focus:border-blue-500/60'
  }`

const inputStyle = { background: '#162040' }

export default function Register() {
  const [step, setStep] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    name: '', email: '', age: '',
    depedId: '', field: 'Science', specialization: '',
    retirementYear: 2030, experience: '', region: '',
  })

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    setErrors(e => ({ ...e, [key]: undefined }))
  }

const handleCSVUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.name.endsWith('.csv')) {
    alert('Please upload a CSV file only.');
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    const csvData = event.target.result
      .trim()
      .split('\n')
      .map(row => row.split(',').map(cell => cell.trim()));

    if (!csvData.length) return;

    // Take first row to auto-fill form
    const [
      name, email, age, depedId, field, specialization, retirementYear, experience, region
    ] = csvData[0];

    setForm({
      name: name || '',
      email: email || '',
      age: age || '',
      depedId: depedId || '',
      field: field || 'Science',
      specialization: specialization || '',
      retirementYear: retirementYear ? Number(retirementYear) : 2030,
      experience: experience || '',
      region: region || '',
    });

    setErrors({});
  };
  reader.readAsText(file);
};

  const validateStep0 = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required'
    const age = Number(form.age)
    if (!form.age || age < 18 || age > 70) e.age = 'Age must be between 18 and 70'
    return e
  }

  const validateStep1 = () => {
    const e = {}
    if (!/^\d{3}-\d{2}-\d{4}$/.test(form.depedId)) e.depedId = 'Format: ###-##-####'
    if (!form.specialization) e.specialization = 'Select a specialization'
    return e
  }

  const validateStep2 = () => {
    const e = {}
    if (!form.experience || Number(form.experience) < 0) e.experience = 'Enter years of experience'
    if (!form.region) e.region = 'Select a region'
    return e
  }

  const next = () => {
    let e = {}
    if (step === 0) e = validateStep0()
    else if (step === 1) e = validateStep1()
    else if (step === 2) e = validateStep2()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    if (step < 2) setStep(s => s + 1)
    else setShowSuccess(true)
  }

  const isValid = (key) => form[key] && !errors[key]

  const FieldOk = ({ k }) => isValid(k) ? <CheckCircleIcon className="w-4 h-4 text-green-400 inline ml-2" /> : null

  return (
    <div className="p-6 max-w-xl mx-auto" style={{ minHeight: '100%' }}>
      <h1 className="text-3xl font-black text-white mb-1">Teacher Registration</h1>
      <p className="text-slate-500 text-sm mb-8">Join the STARMap PH database to help close the STEM gap</p>

      <StepIndicator current={step} />

      {/* Incentives Section */}
<div
  className="mb-8 p-6 rounded-2xl"
  style={{
    background: 'linear-gradient(135deg, #1a1200 0%, #2a1f00 50%, #0f1629 100%)',
    border: '1px solid rgba(252,209,22,0.3)',
    boxShadow: '0 0 24px rgba(252,209,22,0.1)',
  }}
>
  <div className="flex items-center gap-3 mb-4">
    <span className="text-2xl" style={{ filter: 'drop-shadow(0 0 8px #FCD116)' }}>⭐</span>
    <h2 className="text-xl font-black text-white">Why Register as a STAR Teacher?</h2>
  </div>

  <div className="space-y-3 mb-4">
    {[
      'Earn a verified ⭐ STAR Teacher badge on your profile',
      'Get featured in national education insights & dashboards',
      'Exclusive access to premium teaching tools & resources',
      'Automatic raffle entries for grants, devices & training programs',
      'Priority eligibility for sponsorships and funding opportunities',
    ].map((b, i) => (
      <div key={i} className="flex items-start gap-3">
        <CheckCircleIcon className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#FCD116' }} />
        <p className="text-sm text-slate-300">{b}</p>
      </div>
    ))}
  </div>

  <div
    className="p-4 rounded-xl mt-2"
    style={{
      background: 'rgba(252,209,22,0.08)',
      border: '1px solid rgba(252,209,22,0.2)',
    }}
  >
    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
      STAR Teacher Perks
    </p>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-2xl font-black" style={{ color: '#FCD116', textShadow: '0 0 12px rgba(252,209,22,0.6)' }}>
          ⭐ Verified
        </p>
        <p className="text-xs text-slate-400 mt-0.5">Recognition badge</p>
      </div>
      <div>
        <p className="text-2xl font-black text-white" style={{ textShadow: '0 0 12px rgba(255,255,255,0.2)' }}>
          🎁 Rewards
        </p>
        <p className="text-xs text-slate-400 mt-0.5">Raffles & incentives</p>
      </div>
    </div>
  </div>
</div>

      <div
        className="p-6 rounded-2xl space-y-5"
        style={{ background: '#0f1629', border: '1px solid rgba(0,56,168,0.2)' }}
      >
          {/* CSV Upload */}
<FieldWrapper label="Upload CSV to auto-fill form">
  <div className="relative">
  <input
    type="file"
    accept=".csv"
    onChange={handleCSVUpload}
    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
  />
  <button
    type="button"
    className="w-full py-2.5 rounded-lg font-semibold text-white text-sm bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-700 hover:to-blue-500 transition-all shadow-md"
  >
    Choose CSV File
  </button>
</div>
<p className="text-xs text-slate-500 mt-1">
  CSV format (one row per teacher): Name,Email,Age,DepEdID,Field,Specialization,RetirementYear,Experience,Region
</p>
</FieldWrapper>
        {step === 0 && (
          <>
            <h2 className="text-lg font-black text-white mb-4">Personal Information</h2>
            <FieldWrapper label={<>Full Name <FieldOk k="name" /></>} error={errors.name}>
              <input
                type="text"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="Juan dela Cruz"
                className={inputClass(!!errors.name)}
                style={inputStyle}
              />
            </FieldWrapper>
            <FieldWrapper label={<>Email Address <FieldOk k="email" /></>} error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="juan@deped.gov.ph"
                className={inputClass(!!errors.email)}
                style={inputStyle}
              />
            </FieldWrapper>
            <FieldWrapper label={<>Age <FieldOk k="age" /></>} error={errors.age}>
              <input
                type="number"
                value={form.age}
                onChange={e => set('age', e.target.value)}
                placeholder="28"
                min="18"
                max="70"
                className={inputClass(!!errors.age)}
                style={inputStyle}
              />
            </FieldWrapper>
          </>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <>
            <h2 className="text-lg font-black text-white mb-4">Professional Information</h2>
            <FieldWrapper label={<>DepEd Employee ID <FieldOk k="depedId" /></>} error={errors.depedId}>
              <input
                type="text"
                value={form.depedId}
                onChange={e => set('depedId', e.target.value)}
                placeholder="123-45-6789"
                className={inputClass(!!errors.depedId)}
                style={inputStyle}
              />
              <p className="text-xs text-slate-600 mt-1">Format: ###-##-####</p>
            </FieldWrapper>
            <FieldWrapper label="Teaching Field">
              <div className="flex gap-4 mt-1">
                {['Science', 'Math'].map(f => (
                  <label key={f} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="field"
                      value={f}
                      checked={form.field === f}
                      onChange={() => set('field', f)}
                      className="accent-blue-600"
                    />
                    <span className="text-sm text-slate-300">{f}</span>
                  </label>
                ))}
              </div>
            </FieldWrapper>
            <FieldWrapper label={<>Specialization <FieldOk k="specialization" /></>} error={errors.specialization}>
              <select
                value={form.specialization}
                onChange={e => set('specialization', e.target.value)}
                className={inputClass(!!errors.specialization)}
                style={inputStyle}
              >
                <option value="">Select specialization...</option>
                {specializations.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </FieldWrapper>
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <h2 className="text-lg font-black text-white mb-4">Career Information</h2>
            <FieldWrapper label={`Planned Retirement Year: ${form.retirementYear}`}>
              <input
                type="range"
                min="2027"
                max="2040"
                value={form.retirementYear}
                onChange={e => set('retirementYear', Number(e.target.value))}
                className="w-full mt-2 accent-blue-600"
              />
              <div className="flex justify-between text-xs text-slate-600 mt-1">
                <span>2027</span><span>2033</span><span>2040</span>
              </div>
            </FieldWrapper>
            <FieldWrapper label={<>Years of Teaching Experience <FieldOk k="experience" /></>} error={errors.experience}>
              <input
                type="number"
                value={form.experience}
                onChange={e => set('experience', e.target.value)}
                placeholder="5"
                min="0"
                max="50"
                className={inputClass(!!errors.experience)}
                style={inputStyle}
              />
            </FieldWrapper>
            <FieldWrapper label={<>Region <FieldOk k="region" /></>} error={errors.region}>
              <select
                value={form.region}
                onChange={e => set('region', e.target.value)}
                className={inputClass(!!errors.region)}
                style={inputStyle}
              >
                <option value="">Select region...</option>
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </FieldWrapper>
          </>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: step === 0 ? 'rgba(0,56,168,0.05)' : 'rgba(0,56,168,0.15)',
              color: step === 0 ? '#475569' : '#94a3b8',
              border: '1px solid rgba(0,56,168,0.2)',
              cursor: step === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            ← Back
          </button>
          <button
            onClick={next}
            className="px-6 py-2 rounded-lg text-sm font-bold text-white transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #0038A8, #1a4fc8)',
              boxShadow: '0 0 12px rgba(0,56,168,0.4)',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(0,56,168,0.7)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 12px rgba(0,56,168,0.4)'}
          >
            {step < 2 ? 'Next →' : 'Submit Registration'}
          </button>
        </div>
      </div>

      {/* Success modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
          <div
            className="relative max-w-sm w-full p-8 rounded-2xl text-center overflow-hidden"
            style={{ background: '#0f1629', border: '1px solid rgba(0,56,168,0.4)', boxShadow: '0 0 40px rgba(0,56,168,0.3)' }}
          >
            <Confetti />
            <div className="relative z-20">
              <div className="flex justify-center mb-4">
                <span className="text-5xl" style={{ filter: 'drop-shadow(0 0 12px #FCD116)' }}>🎉</span>
              </div>
              <h2 className="text-2xl font-black text-white mb-2">Registered!</h2>
              <p className="text-slate-400 text-sm mb-6">
                Your data has been added to the STARMap PH database. Thank you for joining the mission to close the STEM education gap!
              </p>
              <div className="p-3 rounded-lg mb-6" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
                <p className="text-xs text-green-400 font-semibold">Registration ID: {Date.now().toString(36).toUpperCase()}</p>
              </div>
              <button
                onClick={() => { setShowSuccess(false); setStep(0); setForm({ name:'',email:'',age:'',depedId:'',field:'Science',specialization:'',retirementYear:2030,experience:'',region:'' }) }}
                className="w-full py-3 rounded-lg font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #0038A8, #1a4fc8)', boxShadow: '0 0 16px rgba(0,56,168,0.5)' }}
              >
                Register Another
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
