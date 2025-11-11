'use client'

import { useState } from 'react'
import { useApp } from '@/components/AppProvider'
import axios from 'axios'

export default function SyncPage() {
  const { stats, isConfigured, isSyncing, syncProgress, syncMessage, startSync, updateSyncProgress, finishSync, setStats } = useApp()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSync = async () => {
    if (!isConfigured) {
      setError('Veuillez d\'abord configurer votre clé API Bexio')
      return
    }

    setError('')
    setSuccess('')
    startSync()

    try {
      // Get API key from localStorage
      const apiKey = typeof window !== 'undefined' ? localStorage.getItem('bexio_api_key') : null

      if (!apiKey) {
        throw new Error('API key not found. Please configure your Bexio API key.')
      }

      // Call the sync API with API key in body
      const response = await axios.post('/api/sync', { apiKey })

      if (response.data.success) {
        // Update stats
        setStats(response.data.stats)
        finishSync()
        setSuccess('Synchronisation terminée avec succès !')
      } else {
        throw new Error(response.data.error || 'Erreur lors de la synchronisation')
      }
    } catch (err: any) {
      console.error('Sync error:', err)
      setError(err.message || 'Erreur lors de la synchronisation')
      finishSync()
    }
  }

  const handleDownload = async () => {
    try {
      const response = await axios.get('/api/download', {
        responseType: 'blob'
      })

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `bexio_data_${new Date().toISOString().split('T')[0]}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()

      setSuccess('Fichier téléchargé avec succès !')
    } catch (err) {
      console.error('Download error:', err)
      setError('Erreur lors du téléchargement du fichier')
    }
  }

  const formatNumber = (num: number) => num.toLocaleString('fr-CH')
  const formatCurrency = (num: number) => `CHF ${num.toLocaleString('fr-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  return (
    <div className="p-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Synchronisation</h1>
        <p className="text-lg text-gray-600">Extraire les données de Bexio</p>
      </div>

      {/* Main Card */}
      <div className="max-w-4xl bg-white rounded-xl p-8 shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Synchroniser les données Bexio</h2>
        <p className="text-gray-600 mb-8">
          Cette opération va extraire toutes vos données Bexio (contacts, factures, projets) et les exporter vers un fichier Excel.
        </p>

        {/* Progress Bar */}
        {isSyncing && (
          <div className="mb-8">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
              <div
                className="h-full gradient-primary transition-all duration-300"
                style={{ width: `${syncProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-primary">{syncProgress}%</span>
              <span className="text-gray-600">{syncMessage}</span>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
            <span className="text-3xl mb-2">👥</span>
            <span className="text-2xl font-bold text-primary">{formatNumber(stats.contacts)}</span>
            <span className="text-sm text-gray-600">Contacts</span>
          </div>

          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
            <span className="text-3xl mb-2">📄</span>
            <span className="text-2xl font-bold text-primary">{formatNumber(stats.invoices)}</span>
            <span className="text-sm text-gray-600">Factures</span>
          </div>

          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
            <span className="text-3xl mb-2">📁</span>
            <span className="text-2xl font-bold text-primary">{formatNumber(stats.projects)}</span>
            <span className="text-sm text-gray-600">Projets</span>
          </div>

          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
            <span className="text-3xl mb-2">💰</span>
            <span className="text-2xl font-bold text-primary">{formatCurrency(stats.totalRevenue)}</span>
            <span className="text-sm text-gray-600">CA Total</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={handleSync}
            disabled={!isConfigured || isSyncing}
            className="flex-1 px-8 py-4 gradient-primary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span className="text-xl">🔄</span>
            <span>{isSyncing ? 'Synchronisation en cours...' : 'Lancer la synchronisation'}</span>
          </button>

          {stats.contacts > 0 && (
            <button
              onClick={handleDownload}
              className="px-8 py-4 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <span className="text-xl">📥</span>
              <span>Télécharger Excel</span>
            </button>
          )}
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg mb-4">
            <strong>❌ Erreur</strong>
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg">
            <strong>✅ Succès !</strong>
            <p>{success}</p>
          </div>
        )}
      </div>
    </div>
  )
}
