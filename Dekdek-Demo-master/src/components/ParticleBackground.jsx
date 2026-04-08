import React, { useMemo } from 'react'

const COLORS = ['#0038A8', '#CE1126', '#FCD116', '#4d9eff', '#ff4d6d', '#ffe066']

function Particle({ style, color, size }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        opacity: 0.6,
        boxShadow: `0 0 ${size * 2}px ${color}`,
        animation: `float ${style.duration}s ease-in-out infinite`,
        animationDelay: `${style.delay}s`,
        left: `${style.left}%`,
        top: `${style.top}%`,
      }}
    />
  )
}

export default function ParticleBackground() {
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      color: COLORS[i % COLORS.length],
      size: Math.random() * 6 + 3,
      style: {
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 4 + Math.random() * 6,
        delay: Math.random() * 4,
      }
    }))
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map(p => (
        <Particle key={p.id} color={p.color} size={p.size} style={p.style} />
      ))}
    </div>
  )
}
