'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const menuItems = [
  { icon: '🏠', label: 'Dashboard', href: '/' },
  { icon: '🔄', label: 'Synchronisation', href: '/sync' },
  { icon: '💼', label: 'Power BI', href: '/powerbi' },
  { icon: '⚙️', label: 'Configuration', href: '/config' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    // Check if API key is configured
    const apiKey = localStorage.getItem('bexio_api_key')
    setIsConfigured(!!apiKey)
  }, [])

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 gradient-vertical text-white flex flex-col shadow-xl z-50">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <h2 className="text-2xl font-bold mb-1">📊 Bexio Dashboard</h2>
        <p className="text-sm opacity-70">v1.0</p>
      </div>

      {/* Menu Items */}
      <ul className="flex-1 py-6">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`
                  flex items-center px-6 py-4 transition-all duration-200
                  border-l-4 hover:bg-white/10
                  ${isActive ? 'bg-white/20 border-white' : 'border-transparent'}
                `}
              >
                <span className="text-2xl mr-4">{item.icon}</span>
                <span className="text-base font-medium">{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>

      {/* Footer - Status */}
      <div className="p-6 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3 bg-black/20 rounded-lg">
          <span className={`w-3 h-3 rounded-full ${isConfigured ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></span>
          <span className="text-sm font-medium">
            {isConfigured ? 'Configuré' : 'Non configuré'}
          </span>
        </div>
      </div>
    </nav>
  )
}
