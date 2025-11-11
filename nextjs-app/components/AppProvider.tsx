'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AppState {
  apiKey: string | null
  stats: {
    // 12 Endpoints counts
    contacts: number
    invoices: number
    offers: number
    orders: number
    creditNotes: number
    projects: number
    timesheets: number
    articles: number
    payments: number
    expenses: number
    notes: number
    tasks: number

    // Financial KPIs
    totalRevenue: number
    netRevenue?: number
    revenuePaid?: number
    revenuePending?: number
    revenueOverdue?: number
    totalCreditNotes?: number
    totalPayments?: number
    totalExpenses?: number

    // Operational KPIs
    invoicesPaid?: number
    invoicesPending?: number
    invoicesOverdue?: number
    totalHours?: number
    billableHours?: number
    conversionRate?: string
    openTasks?: number
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
      // 12 Endpoints
      contacts: 0,
      invoices: 0,
      offers: 0,
      orders: 0,
      creditNotes: 0,
      projects: 0,
      timesheets: 0,
      articles: 0,
      payments: 0,
      expenses: 0,
      notes: 0,
      tasks: 0,

      // Financial KPIs
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
