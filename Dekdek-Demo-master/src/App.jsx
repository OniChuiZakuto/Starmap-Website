import React, { createContext, useContext, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Home from './pages/Home'
import STARMap from './pages/STARMap'
import Educators from './pages/Educators'
import Register from './pages/Register'
import Borrow from './pages/Borrow'
import Sponsor from './pages/Sponsor'

// Theme Context
export const ThemeContext = createContext({
  dark: true,
  toggleTheme: () => {}
})

export function useTheme() {
  return useContext(ThemeContext)
}

function App() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('starmap-theme')
    if (saved) {
      setDark(saved === 'dark')
    }
  }, [])

  const toggleTheme = () => {
    setDark(prev => {
      const next = !prev
      localStorage.setItem('starmap-theme', next ? 'dark' : 'light')
      return next
    })
  }

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      <div className={dark ? 'dark' : ''}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Layout><Home /></Layout>} />
            <Route path="/starmap" element={<Layout><STARMap /></Layout>} />
            <Route path="/educators" element={<Layout><Educators /></Layout>} />
            <Route path="/register" element={<Layout><Register /></Layout>} />
            <Route path="/borrow" element={<Layout><Borrow /></Layout>} />
            <Route path="/sponsor" element={<Layout><Sponsor /></Layout>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeContext.Provider>
  )
}

export default App
