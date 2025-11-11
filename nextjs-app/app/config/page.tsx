'use client'

import { useState, useEffect } from 'react'
import { useApp } from '@/components/AppProvider'
import axios from 'axios'
import Link from 'next/link'

export default function ConfigPage() {
  const { setApiKey, isConfigured } = useApp()
  const [apiKeyInput, setApiKeyInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [showKey, setShowKey] = useState(false)

  useEffect(() => {
    // Load existing API key if configured (for display only)
    const existingKey = localStorage.getItem('bexio_api_key')
    if (existingKey) {
      setApiKeyInput(existingKey)
    }
  }, [])

  const handleSave = async () => {
    if (!apiKeyInput.trim()) {
      setError('Veuillez entrer une clé API')
      return
    }

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      // Test the API key
      const response = await axios.post('/api/config', {
        apiKey: apiKeyInput.trim()
      })

      if (response.data.success) {
        // Save to context and localStorage
        setApiKey(apiKeyInput.trim())
        setSuccess(true)
        setError('')
      } else {
        throw new Error(response.data.error || 'Clé API invalide')
      }
    } catch (err: any) {
      console.error('Config error:', err)
      setError(err.message || 'Erreur lors de la validation de la clé API')
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  const handleTestConnection = async () => {
    if (!apiKeyInput.trim()) {
      setError('Veuillez entrer une clé API pour tester')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await axios.post('/api/config', {
        apiKey: apiKeyInput.trim()
      })

      if (response.data.success) {
        setSuccess(true)
        setError('')
        alert('✅ Connexion réussie! Votre clé API est valide.')
      } else {
        throw new Error(response.data.error || 'Clé API invalide')
      }
    } catch (err: any) {
      console.error('Test connection error:', err)
      setError(err.message || 'Erreur lors du test de connexion')
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6 md:p-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-3">
          Configuration
        </h1>
        <p className="text-xl text-gray-600">Connectez votre compte Bexio</p>
      </div>

      <div className="max-w-4xl">
        {/* Status Banner */}
        {isConfigured && (
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6 mb-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-5xl">✅</span>
                <div>
                  <h3 className="text-2xl font-bold mb-1">API Configurée et Active</h3>
                  <p className="opacity-90">Votre connexion à Bexio est opérationnelle</p>
                </div>
              </div>
              <Link
                href="/sync"
                className="bg-white text-green-600 hover:bg-gray-100 px-6 py-3 rounded-xl font-bold transition-all"
              >
                Synchroniser →
              </Link>
            </div>
          </div>
        )}

        {/* Main Config Card */}
        <div className="bg-white rounded-2xl p-8 shadow-xl mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Clé API Bexio</h2>
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="text-primary hover:text-primary-dark font-semibold flex items-center gap-2"
            >
              <span>{showGuide ? '📕' : '📘'}</span>
              {showGuide ? 'Masquer le guide' : 'Comment obtenir ma clé API ?'}
            </button>
          </div>

          {/* Guide Section */}
          {showGuide && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>📖</span>
                Guide : Obtenir votre clé API Bexio
              </h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <p>Connectez-vous à votre compte Bexio</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <p>Allez dans <strong>Paramètres</strong> → <strong>Gestion de compte</strong> → <strong>API</strong></p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <p>Cliquez sur <strong>"Générer une nouvelle clé API"</strong></p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <p>Copiez la clé générée et collez-la ci-dessous</p>
                </div>
              </div>
              <a
                href="https://office.bexio.com/index.php/settings/api"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                <span>🔗</span>
                Ouvrir les paramètres Bexio
              </a>
            </div>
          )}

          {/* API Key Input */}
          <div className="mb-6">
            <label htmlFor="apiKey" className="block text-sm font-semibold text-gray-700 mb-2">
              Clé API *
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                id="apiKey"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="Entrez votre clé API Bexio..."
                className="w-full px-4 py-4 pr-12 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-all text-lg"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showKey ? '🙈' : '👁️'}
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500 flex items-center gap-2">
              <span>🔒</span>
              La clé est stockée localement dans votre navigateur uniquement
            </p>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={handleTestConnection}
              disabled={loading}
              className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border-2 border-gray-300"
            >
              <span>🔍</span>
              <span>Tester la connexion</span>
            </button>

            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              <span>💾</span>
              <span>{loading ? 'Vérification...' : 'Enregistrer'}</span>
            </button>
          </div>

          {/* Success Message */}
          {success && (
            <div className="p-5 bg-gradient-to-r from-green-100 to-green-50 border-2 border-green-300 rounded-xl flex items-start gap-4 shadow-md">
              <span className="text-3xl">✅</span>
              <div>
                <strong className="text-green-800 text-lg">Configuration enregistrée avec succès!</strong>
                <p className="text-green-700 mt-1">Votre clé API est valide. Vous pouvez maintenant synchroniser vos données.</p>
                <Link
                  href="/sync"
                  className="inline-flex items-center gap-2 mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                >
                  <span>🔄</span>
                  Aller à la synchronisation
                </Link>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-5 bg-gradient-to-r from-red-100 to-red-50 border-2 border-red-300 rounded-xl flex items-start gap-4 shadow-md">
              <span className="text-3xl">❌</span>
              <div>
                <strong className="text-red-800 text-lg">Erreur de configuration</strong>
                <p className="text-red-700 mt-1">{error}</p>
                <p className="text-sm text-red-600 mt-2">
                  Vérifiez que votre clé API est correcte et que vous avez les permissions nécessaires dans Bexio.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Permissions Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🔐</span>
              Permissions requises
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Lecture des contacts
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Lecture des factures & offres
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Lecture des projets & temps
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Lecture des paiements & dépenses
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>📊</span>
              Données synchronisées
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-blue-500">•</span>
                12 endpoints Bexio
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-500">•</span>
                16 feuilles Excel générées
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-500">•</span>
                Analyses & tendances
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-500">•</span>
                Compatible Power BI
              </li>
            </ul>
          </div>
        </div>

        {/* About Card */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span>ℹ️</span>
            À propos de l'application
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p><strong className="text-gray-300">Application :</strong> Dashboard Bexio → Power BI</p>
              <p><strong className="text-gray-300">Version :</strong> 2.0.0</p>
              <p><strong className="text-gray-300">Développé par :</strong> BSCO Solutions</p>
              <p><strong className="text-gray-300">License :</strong> MIT (Open-Source)</p>
            </div>
            <div className="flex flex-col gap-3">
              <a
                href="https://github.com/csigno1204/BSCO-Dashboard-PowerBI"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-3 rounded-lg transition-all"
              >
                <span>📦</span>
                <span>Code source sur GitHub</span>
              </a>
              <a
                href="https://docs.bexio.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-3 rounded-lg transition-all"
              >
                <span>📖</span>
                <span>Documentation Bexio API</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
