import React from 'react'
import { useTheme } from '../App'
import TopNav from './TopNav'
import Sidebar from './Sidebar'
import Chatbot from './Chatbot'

export default function Layout({ children }) {
  const { dark } = useTheme()

  return (
    <div
      className={`${dark ? 'dark' : ''} min-h-screen`}
      style={{ background: '#0a0e1a' }}
    >
      <TopNav />
      <div className="flex pt-16 min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto min-w-0">
          {children}
        </main>
      </div>
      <Chatbot />
    </div>
  )
}
