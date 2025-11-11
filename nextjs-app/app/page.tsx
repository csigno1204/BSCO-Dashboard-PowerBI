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
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
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

          {/* Financial Health Overview */}
          {(stats.grossProfit !== undefined || stats.netRevenue !== undefined) && (
            <>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 mt-8 flex items-center gap-2">
                <span>💼</span>
                Santé Financière
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {stats.netRevenue !== undefined && (
                  <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl p-5 shadow-lg">
                    <div className="text-xs opacity-75 uppercase tracking-wide mb-2">CA Net</div>
                    <div className="text-2xl font-bold">{formatCurrency(stats.netRevenue)}</div>
                    <div className="text-xs opacity-75 mt-1">Après notes de crédit</div>
                  </div>
                )}
                {stats.grossProfit !== undefined && (
                  <div className={`rounded-xl p-5 shadow-lg text-white ${(stats.grossProfit || 0) >= 0 ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' : 'bg-gradient-to-br from-red-500 to-red-600'}`}>
                    <div className="text-xs opacity-75 uppercase tracking-wide mb-2">Résultat Brut</div>
                    <div className="text-2xl font-bold">{formatCurrency(stats.grossProfit)}</div>
                    {stats.profitMargin !== undefined && (
                      <div className="text-xs opacity-75 mt-1">Marge: {stats.profitMargin.toFixed(1)}%</div>
                    )}
                  </div>
                )}
                {stats.cashFlow !== undefined && (
                  <div className={`rounded-xl p-5 shadow-lg text-white ${(stats.cashFlow || 0) >= 0 ? 'bg-gradient-to-br from-teal-500 to-teal-600' : 'bg-gradient-to-br from-orange-500 to-orange-600'}`}>
                    <div className="text-xs opacity-75 uppercase tracking-wide mb-2">Cash Flow</div>
                    <div className="text-2xl font-bold">{formatCurrency(stats.cashFlow)}</div>
                    <div className="text-xs opacity-75 mt-1">Paiements - Dépenses</div>
                  </div>
                )}
                {stats.totalExpenses !== undefined && (
                  <div className="bg-gradient-to-br from-gray-500 to-gray-600 text-white rounded-xl p-5 shadow-lg">
                    <div className="text-xs opacity-75 uppercase tracking-wide mb-2">Dépenses Totales</div>
                    <div className="text-2xl font-bold">{formatCurrency(stats.totalExpenses)}</div>
                    {stats.averageExpense !== undefined && (
                      <div className="text-xs opacity-75 mt-1">Moy: {formatCurrency(stats.averageExpense)}</div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Invoice Status Breakdown */}
          {stats.invoices > 0 && (stats.invoicesPaid !== undefined || stats.invoicesValid !== undefined) && (
            <>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 mt-8 flex items-center gap-2">
                <span>📄</span>
                État des Factures
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
                {stats.invoicesValid !== undefined && (
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-4 text-center shadow-md">
                    <div className="text-xs opacity-75 uppercase mb-1">Valides</div>
                    <div className="text-2xl font-bold">{formatNumber(stats.invoicesValid)}</div>
                  </div>
                )}
                {stats.invoicesPaid !== undefined && (
                  <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-4 text-center shadow-md">
                    <div className="text-xs opacity-75 uppercase mb-1">Payées</div>
                    <div className="text-2xl font-bold">{formatNumber(stats.invoicesPaid)}</div>
                  </div>
                )}
                {stats.invoicesPartiallyPaid !== undefined && (
                  <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-lg p-4 text-center shadow-md">
                    <div className="text-xs opacity-75 uppercase mb-1">Part. Payées</div>
                    <div className="text-2xl font-bold">{formatNumber(stats.invoicesPartiallyPaid)}</div>
                  </div>
                )}
                {stats.invoicesPending !== undefined && (
                  <div className="bg-gradient-to-br from-blue-400 to-blue-500 text-white rounded-lg p-4 text-center shadow-md">
                    <div className="text-xs opacity-75 uppercase mb-1">En Attente</div>
                    <div className="text-2xl font-bold">{formatNumber(stats.invoicesPending)}</div>
                  </div>
                )}
                {stats.invoicesOverdue !== undefined && (
                  <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg p-4 text-center shadow-md">
                    <div className="text-xs opacity-75 uppercase mb-1">En Retard</div>
                    <div className="text-2xl font-bold">{formatNumber(stats.invoicesOverdue)}</div>
                  </div>
                )}
                {stats.invoicesDraft !== undefined && (
                  <div className="bg-white border-2 border-gray-300 rounded-lg p-4 text-center shadow-md">
                    <div className="text-xs text-gray-500 uppercase mb-1">Brouillons</div>
                    <div className="text-2xl font-bold text-gray-700">{formatNumber(stats.invoicesDraft)}</div>
                  </div>
                )}
                {stats.invoicesCancelled !== undefined && (
                  <div className="bg-white border-2 border-red-300 rounded-lg p-4 text-center shadow-md">
                    <div className="text-xs text-gray-500 uppercase mb-1">Annulées</div>
                    <div className="text-2xl font-bold text-gray-700">{formatNumber(stats.invoicesCancelled)}</div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Revenue Breakdown */}
          {(stats.revenuePaid !== undefined || stats.revenuePartiallyPaid !== undefined) && (
            <>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 mt-8 flex items-center gap-2">
                <span>💵</span>
                Répartition du Chiffre d'Affaires
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {stats.revenuePaid !== undefined && (
                  <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-5 shadow-lg">
                    <div className="text-xs opacity-75 uppercase tracking-wide mb-2">CA Payé</div>
                    <div className="text-2xl font-bold">{formatCurrency(stats.revenuePaid)}</div>
                  </div>
                )}
                {stats.revenuePartiallyPaid !== undefined && (
                  <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl p-5 shadow-lg">
                    <div className="text-xs opacity-75 uppercase tracking-wide mb-2">CA Part. Payé</div>
                    <div className="text-2xl font-bold">{formatCurrency(stats.revenuePartiallyPaid)}</div>
                  </div>
                )}
                {stats.revenuePending !== undefined && (
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-5 shadow-lg">
                    <div className="text-xs opacity-75 uppercase tracking-wide mb-2">CA En Attente</div>
                    <div className="text-2xl font-bold">{formatCurrency(stats.revenuePending)}</div>
                  </div>
                )}
                {stats.revenueOverdue !== undefined && (
                  <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-5 shadow-lg">
                    <div className="text-xs opacity-75 uppercase tracking-wide mb-2">CA En Retard</div>
                    <div className="text-2xl font-bold">{formatCurrency(stats.revenueOverdue)}</div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mt-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Besoin de plus de détails ?</h3>
                <p className="text-gray-600">Consultez la page de synchronisation pour une analyse complète et détaillée</p>
              </div>
              <Link
                href="/sync"
                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md"
              >
                <span>📊</span>
                Voir l'analyse complète
              </Link>
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
