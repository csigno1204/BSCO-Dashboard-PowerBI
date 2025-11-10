'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AppState {
  apiKey: string | null
  stats: {
    contacts: number
    invoices: number
    projects: number
    totalRevenue: number
  }
  lastSync: string | null
  isConfigured: boolean
  isSyncing: boolean
  syncProgress: number
  syncMessage: string
}

interface AppContextType extends AppState {
  setApiKey: (key: string) => void
  setStats: (stats: Partial<AppState['stats']>) => void
  startSync: () => void
  updateSyncProgress: (progress: number, message: string) => void
  finishSync: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

export default function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    apiKey: null,
    stats: {
      contacts: 0,
      invoices: 0,
      projects: 0,
      totalRevenue: 0,
    },
    lastSync: null,
    isConfigured: false,
    isSyncing: false,
    syncProgress: 0,
    syncMessage: '',
  })

  // Load API key from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedApiKey = localStorage.getItem('bexio_api_key')
      if (storedApiKey) {
        setState(prev => ({
          ...prev,
          apiKey: storedApiKey,
          isConfigured: true,
        }))
      }
    }
  }, [])

  const setApiKey = (key: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bexio_api_key', key)
    }
    setState(prev => ({
      ...prev,
      apiKey: key,
      isConfigured: true,
    }))
  }

  const setStats = (newStats: Partial<AppState['stats']>) => {
    setState(prev => ({
      ...prev,
      stats: { ...prev.stats, ...newStats },
    }))
  }

  const startSync = () => {
    setState(prev => ({
      ...prev,
      isSyncing: true,
      syncProgress: 0,
      syncMessage: 'Initialisation...',
    }))
  }

  const updateSyncProgress = (progress: number, message: string) => {
    setState(prev => ({
      ...prev,
      syncProgress: progress,
      syncMessage: message,
    }))
  }

  const finishSync = () => {
    setState(prev => ({
      ...prev,
      isSyncing: false,
      syncProgress: 100,
      lastSync: new Date().toISOString(),
    }))
  }

  const value: AppContextType = {
    ...state,
    setApiKey,
    setStats,
    startSync,
    updateSyncProgress,
    finishSync,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
