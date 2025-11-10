'use client'

import Link from 'next/link'
import { useApp } from '@/components/AppProvider'

export default function Dashboard() {
  const { stats, isConfigured } = useApp()

  const infoCards = [
    {
      icon: '🎯',
      title: "Qu'est-ce que c'est ?",
      description: "Une application qui synchronise automatiquement vos données Bexio (contacts, factures, projets) vers des fichiers Excel compatibles Power BI."
    },
    {
      icon: '⚡',
      title: 'Rapide et Simple',
      description: "En un clic, extrayez toutes vos données Bexio et téléchargez-les au format Excel prêt pour Power BI Desktop."
    },
    {
      icon: '🔒',
      title: '100% Sécurisé',
      description: "Vos données restent privées. La clé API est stockée localement uniquement. Aucune donnée n'est envoyée ailleurs."
    }
  ]

  const formatNumber = (num: number) => {
    return num.toLocaleString('fr-CH')
  }

  const formatCurrency = (num: number) => {
    return `CHF ${num.toLocaleString('fr-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <div className="p-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-lg text-gray-600">Bienvenue dans votre tableau de bord Bexio → Power BI</p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {infoCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-5xl mb-4">{card.icon}</div>
            <h3 className="text-xl font-bold text-primary mb-3">{card.title}</h3>
            <p className="text-gray-600 leading-relaxed">{card.description}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-8 shadow-md mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Actions Rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/config"
            className="flex items-center gap-4 p-6 gradient-primary text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <span className="text-3xl">⚙️</span>
            <span className="font-semibold">Configurer l'API Bexio</span>
          </Link>

          <Link
            href="/sync"
            className={`flex items-center gap-4 p-6 gradient-primary text-white rounded-lg transition-opacity ${
              !isConfigured ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
            }`}
          >
            <span className="text-3xl">🔄</span>
            <span className="font-semibold">Synchroniser maintenant</span>
          </Link>

          <Link
            href="/history"
            className="flex items-center gap-4 p-6 gradient-primary text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <span className="text-3xl">📁</span>
            <span className="font-semibold">Voir l'historique</span>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="bg-white rounded-xl p-8 shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Aperçu Rapide</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
            <div className="text-4xl font-bold text-primary mb-2">
              {stats.contacts > 0 ? formatNumber(stats.contacts) : '-'}
            </div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">Contacts</div>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
            <div className="text-4xl font-bold text-primary mb-2">
              {stats.invoices > 0 ? formatNumber(stats.invoices) : '-'}
            </div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">Factures</div>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
            <div className="text-4xl font-bold text-primary mb-2">
              {stats.projects > 0 ? formatNumber(stats.projects) : '-'}
            </div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">Projets</div>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
            <div className="text-4xl font-bold text-primary mb-2">
              {stats.totalRevenue > 0 ? formatCurrency(stats.totalRevenue) : '-'}
            </div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">Chiffre d'affaires</div>
          </div>
        </div>
      </div>
    </div>
  )
}
