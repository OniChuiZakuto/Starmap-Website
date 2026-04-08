import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { useTheme } from '../App'

const navLinks = [
  { to: '/home', label: 'Home' },
  { to: '/starmap', label: 'Starmap' },
  { to: '/educators', label: 'Educators' },
  { to: '/register', label: 'Register' },
  { to: '/borrow', label: 'Borrow' },
  { to: '/sponsor', label: 'Sponsor' },
]

export default function TopNav() {
  const { dark, toggleTheme } = useTheme()
  const navigate = useNavigate()

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-16"
      style={{
        background: 'rgba(10, 14, 26, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0, 56, 168, 0.3)',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
      }}
    >
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 group"
        >
          <span className="text-2xl" style={{ filter: 'drop-shadow(0 0 8px #FCD116)' }}>⭐</span>
          <span
            className="text-xl font-black tracking-tight text-white"
            style={{ textShadow: '0 0 20px rgba(0,56,168,0.8), 0 0 40px rgba(0,56,168,0.4)' }}
          >
            STARMap <span className="text-ph-yellow">PH</span>
          </span>
        </button>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-ph-yellow bg-blue-900/60'
                    : 'text-slate-300 hover:text-white hover:bg-blue-900/40'
                }`
              }
              style={({ isActive }) => isActive ? { textShadow: '0 0 10px rgba(252,209,22,0.5)' } : {}}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-blue-900/40 transition-all duration-200"
          title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {dark
            ? <SunIcon className="w-5 h-5 text-ph-yellow" />
            : <MoonIcon className="w-5 h-5 text-ph-blue" />
          }
        </button>
      </div>
    </header>
  )
}
