// src/components/Chatbot.jsx
import React, { useState, useEffect, useRef } from 'react'
import { StarIcon, XMarkIcon } from '@heroicons/react/24/solid'

const CHATBOT_WIDTH = 320
const CHATBOT_HEIGHT = 400
const DRAGGABLE_MARGIN = 20
const DRAG_LERP = 0.2 // softness factor: 0.1 = very soft, 1 = instant

const hardcodedResponses = [
  { keywords: ['register', 'registration'], answer: 'You can register on the Register page accessible from the top menu.' },
  { keywords: ['home'], answer: 'This is the Home page of STARMap PH. Explore data and insights here!' },
  { keywords: ['starmap'], answer: 'STARMap PH is an analytics platform showing teacher distribution and gaps in STEM education.' },
  { keywords: ['educators'], answer: 'Educators can view their profiles and teaching assignments here.' },
  { keywords: ['borrow'], answer: 'Schools can borrow STEM equipment from nearby institutions using the Borrow page.' },
  { keywords: ['sponsor'], answer: 'Sponsors can contribute resources or fund specific regions to address teacher shortages.' },
  { keywords: ['about'], answer: 'STARMap PH is a tool to visualize teacher gaps, connect schools and sponsors, and support policy decisions.' },
  { keywords: ['contact', 'email', 'phone'], answer: 'You can reach us at info@starmap.ph or +63 917 123 4567.' },
  { keywords: ['vacancies', 'gap', 'shortage'], answer: 'We track unfilled science and math teacher positions across all regions.' },
  { keywords: ['regions'], answer: 'STARMap PH covers all 17 Philippine regions, highlighting critical gaps.' },
  { keywords: ['science', 'math', 'stem'], answer: 'Science and Math teacher gaps are our primary focus for improving education outcomes.' },
  { keywords: ['policy'], answer: 'Policy makers can use STARMap data to make evidence-based decisions.' },
  { keywords: ['dashboard', 'insights'], answer: 'The dashboard provides real-time insights on teacher distribution and regional gaps.' },
  { keywords: ['login', 'sign in'], answer: 'You can log in from the Register page if you already have an account.' },
  { keywords: ['school'], answer: 'You can view specific schools and their STEM needs here.' },
  { keywords: ['students'], answer: 'Students benefit indirectly through improved teacher allocation and resources.' },
  { keywords: ['reports', 'analytics'], answer: 'Reports and analytics summarize teacher shortages and regional education gaps.' },
  { keywords: ['help', 'support'], answer: 'I’m here to help! Ask me about pages, registration, or teacher info.' },
  { keywords: ['feedback'], answer: 'You can submit feedback using the Feedback section at the bottom of the page.' },
  { keywords: ['dashboard'], answer: 'Use the dashboard to track teacher gaps and regional data.' },
  { keywords: ['data'], answer: 'STARMap PH provides real-time data on teacher distribution and gaps.' },
  { keywords: ['updates', 'news'], answer: 'Check the Latest News section for updates on teacher shortages and policies.' },
  { keywords: ['system'], answer: 'STARMap PH is an integrated data system for tracking teacher profiles and gaps.' },
]

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! I’m STARRY, your STARMap assistant. Ask me anything.' }
  ])
  const [input, setInput] = useState('')
  const [pos, setPos] = useState({ x: window.innerWidth - DRAGGABLE_MARGIN - 50, y: 100 })
  const [dragging, setDragging] = useState(false)
  const [targetPos, setTargetPos] = useState(pos) // target for smooth movement
  const dragRef = useRef(null)
  const offsetRef = useRef({ x: 0, y: 0 })

  const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

  function onDragStart(e) {
    e.preventDefault()
    setDragging(true)
    const rect = dragRef.current.getBoundingClientRect()
    offsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  function onDrag(e) {
    if (!dragging) return
    e.preventDefault()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    let newY = e.clientY - offsetRef.current.y
    newY = clamp(newY, DRAGGABLE_MARGIN, viewportHeight - DRAGGABLE_MARGIN - 50)
    const sideX = e.clientX < viewportWidth / 2 ? DRAGGABLE_MARGIN : viewportWidth - DRAGGABLE_MARGIN - 50
    setTargetPos({ x: sideX, y: newY }) // update target position
  }

  function onDragEnd() {
    setDragging(false)
  }

  // Smoothly interpolate position
  useEffect(() => {
    let anim
    function animate() {
      setPos(prev => ({
        x: prev.x + (targetPos.x - prev.x) * DRAG_LERP,
        y: prev.y + (targetPos.y - prev.y) * DRAG_LERP,
      }))
      anim = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(anim)
  }, [targetPos])

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', onDrag)
      window.addEventListener('mouseup', onDragEnd)
    } else {
      window.removeEventListener('mousemove', onDrag)
      window.removeEventListener('mouseup', onDragEnd)
    }
    return () => {
      window.removeEventListener('mousemove', onDrag)
      window.removeEventListener('mouseup', onDragEnd)
    }
  }, [dragging])

  function sendMessage() {
    if (!input.trim()) return
    const userMsg = input.trim()
    setMessages(msgs => [...msgs, { from: 'user', text: userMsg }])
    setInput('')
    const lower = userMsg.toLowerCase()
    const response = hardcodedResponses.find(({ keywords }) =>
      keywords.some(kw => lower.includes(kw))
    )
    setTimeout(() => {
      setMessages(msgs => [
        ...msgs,
        {
          from: 'bot',
          text: response ? response.answer : "Sorry, I don't understand. Try asking about registration, pages, or help.",
        }
      ])
    }, 600)
  }

  function onKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Floating draggable star button */}
      <button
        ref={dragRef}
        onMouseDown={onDragStart}
        onClick={() => setOpen(o => !o)}
        title="Open Chat"
        style={{
          position: 'fixed',
          left: pos.x,
          top: pos.y,
          width: 50,
          height: 50,
          backgroundColor: '#FCD116',
          borderRadius: '50%',
          boxShadow: '0 0 8px #FCD116',
          zIndex: 9999,
          border: 'none',
          cursor: dragging ? 'grabbing' : 'grab',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
        }}
        aria-label="Chatbot Toggle"
      >
        <StarIcon style={{ width: 28, height: 28, color: '#0c1460' }} />
      </button>

      {/* Chatbox */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            width: CHATBOT_WIDTH,
            height: CHATBOT_HEIGHT,
            backgroundColor: '#0f1629',
            border: '1px solid rgba(252,209,22,0.4)',
            borderRadius: 12,
            boxShadow: '0 0 24px rgba(252,209,22,0.3)',
            zIndex: 9998,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: '#1a1200',
              padding: '10px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(252,209,22,0.3)',
              color: '#FCD116',
              fontWeight: '900',
              fontSize: 18,
            }}
          >
            <span>STARRY</span>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#FCD116',
                padding: 0,
                margin: 0,
              }}
              aria-label="Close Chat"
            >
              <XMarkIcon style={{ width: 22, height: 22 }} />
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: 12,
              overflowY: 'auto',
              color: '#e2e8f0',
              fontSize: 14,
              backgroundColor: '#162040',
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 10,
                  textAlign: msg.from === 'bot' ? 'left' : 'right',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    padding: '6px 10px',
                    borderRadius: 16,
                    backgroundColor: msg.from === 'bot' ? '#FCD116' : '#0038A8',
                    color: msg.from === 'bot' ? '#162040' : '#fff',
                    maxWidth: '80%',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          {/* Input */}
          <div
            style={{
              borderTop: '1px solid rgba(252,209,22,0.3)',
              padding: 10,
              backgroundColor: '#1a1200',
              display: 'flex',
              gap: 8,
            }}
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type your message..."
              style={{
                flex: 1,
                borderRadius: 12,
                border: 'none',
                padding: '8px 12px',
                fontSize: 14,
                outline: 'none',
                backgroundColor: '#1a1f3d',
                color: '#e2e8f0',
              }}
              autoComplete="off"
            />
            <button
              onClick={sendMessage}
              style={{
                backgroundColor: '#FCD116',
                border: 'none',
                borderRadius: 12,
                padding: '8px 14px',
                cursor: 'pointer',
                fontWeight: 'bold',
                color: '#162040',
              }}
              aria-label="Send Message"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  )
}
