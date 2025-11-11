'use client'

import Link from 'next/link'
import { useApp } from '@/components/AppProvider'
import { useState, useEffect } from 'react'

export default function Dashboard() {
  const { stats, isConfigured } = useApp()
  const [lastSync, setLastSync] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Check for last sync time from localStorage
    const syncTime = localStorage.getItem('last_sync_time')
    if (syncTime) {
      const date = new Date(syncTime)
      setLastSync(date.toLocaleString('fr-CH'))
    }
  }, [stats])

  useEffect(() => {
    // Trigger animation on mount
    setIsAnimating(true)
  }, [])

  const formatNumber = (num: number) => {
    return num.toLocaleString('fr-CH')
  }

  const formatCurrency = (num: number) => {
    return `CHF ${num.toLocaleString('fr-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const hasData = stats.contacts > 0 || stats.invoices > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6 md:p-10">
      {/* Hero Section */}
      <div className={`mb-10 transition-all duration-1000 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-3">
              Bexio Dashboard
            </h1>
            <p className="text-xl text-gray-600">Transformez vos données Bexio en insights Power BI</p>
          </div>
          <div className="flex items-center gap-3">
            {isConfigured ? (
              <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="font-semibold">API Connectée</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                <span className="font-semibold">Configuration requise</span>
              </div>
            )}
          </div>
        </div>

        {/* Last Sync Info */}
        {lastSync && (
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
            <span className="text-sm">🕒 Dernière synchronisation : <strong>{lastSync}</strong></span>
          </div>
        )}
      </div>

      {/* Quick Start Guide or Actions */}
      {!isConfigured ? (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-8 mb-10">
          <div className="flex items-start gap-6">
            <span className="text-6xl">🚀</span>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Commencez en 3 étapes simples</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">Configurez votre clé API Bexio</h3>
                    <p className="text-gray-600">Obtenez votre clé API depuis votre compte Bexio et configurez-la ici</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">Synchronisez vos données</h3>
                    <p className="text-gray-600">Un clic pour extraire toutes vos données (contacts, factures, projets...)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">Importez dans Power BI</h3>
                    <p className="text-gray-600">Téléchargez l'Excel et utilisez notre template Power Query pour visualiser vos données</p>
                  </div>
                </div>
              </div>
              <Link
                href="/config"
                className="inline-flex items-center gap-3 mt-6 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                <span className="text-2xl">⚙️</span>
                Configurer maintenant
                <span className="text-xl">→</span>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 mb-10 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-3">Prêt à synchroniser ?</h2>
              <p className="text-lg opacity-90">Extrayez vos dernières données Bexio et créez votre dashboard Power BI</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/sync"
                className="flex items-center gap-3 bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                <span className="text-2xl">🔄</span>
                Synchroniser
              </Link>
              <Link
                href="/powerbi"
                className="flex items-center gap-3 bg-white/20 hover:bg-white/30 px-8 py-4 rounded-xl font-bold text-lg transition-all"
              >
                <span className="text-2xl">📊</span>
                Templates Power BI
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Stats Dashboard */}
      {hasData && (
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span>📊</span>
            Vue d'ensemble de vos données
          </h2>

          {/* Primary KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">👥</span>
                <span className="text-xs opacity-75 uppercase tracking-wide">Total</span>
              </div>
              <div className="text-4xl font-bold mb-1">
                {formatNumber(stats.contacts)}
              </div>
              <div className="text-sm opacity-90">Contacts</div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">📄</span>
                <span className="text-xs opacity-75 uppercase tracking-wide">Total</span>
              </div>
              <div className="text-4xl font-bold mb-1">
                {formatNumber(stats.invoices)}
              </div>
              <div className="text-sm opacity-90">Factures</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">📋</span>
                <span className="text-xs opacity-75 uppercase tracking-wide">Total</span>
              </div>
              <div className="text-4xl font-bold mb-1">
                {formatNumber(stats.projects || 0)}
              </div>
              <div className="text-sm opacity-90">Projets</div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">💰</span>
                <span className="text-xs opacity-75 uppercase tracking-wide">CA Total</span>
              </div>
              <div className="text-3xl font-bold mb-1">
                {formatCurrency(stats.totalRevenue)}
              </div>
              <div className="text-sm opacity-90">Chiffre d'affaires</div>
            </div>
          </div>

          {/* Secondary KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-md text-center hover:shadow-lg transition-all">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-2xl font-bold text-gray-800">{formatNumber(stats.offers || 0)}</div>
              <div className="text-xs text-gray-600">Offres</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md text-center hover:shadow-lg transition-all">
              <div className="text-2xl mb-2">📦</div>
              <div className="text-2xl font-bold text-gray-800">{formatNumber(stats.orders || 0)}</div>
              <div className="text-xs text-gray-600">Commandes</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md text-center hover:shadow-lg transition-all">
              <div className="text-2xl mb-2">🏷️</div>
              <div className="text-2xl font-bold text-gray-800">{formatNumber(stats.articles || 0)}</div>
              <div className="text-xs text-gray-600">Articles</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md text-center hover:shadow-lg transition-all">
              <div className="text-2xl mb-2">⏱️</div>
              <div className="text-2xl font-bold text-gray-800">{formatNumber(stats.timesheets || 0)}</div>
              <div className="text-xs text-gray-600">Temps</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md text-center hover:shadow-lg transition-all">
              <div className="text-2xl mb-2">💳</div>
              <div className="text-2xl font-bold text-gray-800">{formatNumber(stats.payments || 0)}</div>
              <div className="text-xs text-gray-600">Paiements</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md text-center hover:shadow-lg transition-all">
              <div className="text-2xl mb-2">✅</div>
              <div className="text-2xl font-bold text-gray-800">{formatNumber(stats.tasks || 0)}</div>
              <div className="text-xs text-gray-600">Tâches</div>
            </div>
          </div>
        </div>
      )}

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Synchronisation Complète</h3>
          <p className="text-gray-600 leading-relaxed">12 endpoints Bexio synchronisés : contacts, factures, offres, projets, temps, paiements, et plus encore.</p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-green-500">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Export Excel Optimisé</h3>
          <p className="text-gray-600 leading-relaxed">16 feuilles Excel avec analyses avancées, tendances mensuelles et top clients prêts pour Power BI.</p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-purple-500">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Templates Power BI</h3>
          <p className="text-gray-600 leading-relaxed">Scripts Power Query prêts à l'emploi avec 20+ mesures DAX pour des dashboards professionnels.</p>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-2xl p-8">
        <div className="flex items-center gap-6">
          <span className="text-6xl">🔒</span>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">100% Sécurisé et Privé</h3>
            <p className="text-gray-300 leading-relaxed">
              Vos données restent privées. La clé API est stockée localement dans votre navigateur uniquement.
              Aucune donnée n'est envoyée vers des serveurs externes. L'application fonctionne directement avec l'API Bexio.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
