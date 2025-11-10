'use client'

import { useApp } from '@/components/AppProvider'

export default function StatsPage() {
  const { stats } = useApp()

  const formatNumber = (num: number) => num.toLocaleString('fr-CH')
  const formatCurrency = (num: number) => `CHF ${num.toLocaleString('fr-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  return (
    <div className="p-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Statistiques</h1>
        <p className="text-lg text-gray-600">Analyses de vos données Bexio</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-8 shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-600 mb-3">Contacts</h3>
          <div className="text-5xl font-bold text-primary mb-2">{formatNumber(stats.contacts)}</div>
          <p className="text-sm text-gray-500">Total des contacts dans Bexio</p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-600 mb-3">Factures</h3>
          <div className="text-5xl font-bold text-primary mb-2">{formatNumber(stats.invoices)}</div>
          <p className="text-sm text-gray-500">Total des factures émises</p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-600 mb-3">Projets</h3>
          <div className="text-5xl font-bold text-primary mb-2">{formatNumber(stats.projects)}</div>
          <p className="text-sm text-gray-500">Projets actifs et terminés</p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-md text-center gradient-primary text-white">
          <h3 className="text-lg font-semibold mb-3">Chiffre d'affaires</h3>
          <div className="text-5xl font-bold mb-2">{formatCurrency(stats.totalRevenue)}</div>
          <p className="text-sm opacity-90">Montant total des factures</p>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border-l-4 border-primary p-6 rounded-lg">
        <p className="text-gray-700">
          <strong className="text-primary">💡 Note :</strong> Ces statistiques sont basées sur la dernière synchronisation.
          Lancez une nouvelle synchronisation pour obtenir les données à jour.
        </p>
      </div>
    </div>
  )
}
