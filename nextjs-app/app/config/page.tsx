'use client'

import { useState } from 'react'
import { useApp } from '@/components/AppProvider'
import axios from 'axios'

export default function ConfigPage() {
  const { setApiKey, isConfigured } = useApp()
  const [apiKeyInput, setApiKeyInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

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

  return (
    <div className="p-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Configuration</h1>
        <p className="text-lg text-gray-600">Paramètres de l'application</p>
      </div>

      <div className="max-w-2xl">
        {/* API Config Card */}
        <div className="bg-white rounded-xl p-8 shadow-md mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Connexion à l'API Bexio</h2>
          <p className="text-gray-600 mb-6">
            Entrez votre clé API Bexio pour permettre l'extraction des données.
          </p>

          <div className="mb-6">
            <label htmlFor="apiKey" className="block text-sm font-semibold text-gray-700 mb-2">
              Clé API Bexio
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Entrez votre clé API..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
            />
            <small className="block mt-2 text-gray-500">
              Obtenez votre clé API sur{' '}
              <a
                href="https://office.bexio.com/index.php/settings/api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Bexio → Paramètres → API
              </a>
            </small>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full px-6 py-3 gradient-primary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span>💾</span>
            <span>{loading ? 'Vérification...' : 'Enregistrer la configuration'}</span>
          </button>

          {/* Success Message */}
          {success && (
            <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <strong className="text-green-800">Configuration enregistrée</strong>
                <p className="text-green-700 text-sm">Votre clé API est valide et fonctionnelle.</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-lg">
              <strong className="text-red-800">❌ Erreur</strong>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* About Card */}
        <div className="bg-white rounded-xl p-8 shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">À propos</h2>
          <div className="space-y-3 text-gray-600">
            <p><strong>Application :</strong> Dashboard Bexio → Power BI</p>
            <p><strong>Version :</strong> 1.0.0</p>
            <p><strong>Développé par :</strong> BSCO Solutions</p>
            <p><strong>License :</strong> MIT (Open-Source)</p>
            <p>
              <a
                href="https://github.com/csigno1204/BSCO-Dashboard-PowerBI"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-2"
              >
                <span>📦</span>
                <span>Code source sur GitHub</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
