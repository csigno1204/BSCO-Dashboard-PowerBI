'use client'

import Link from 'next/link'

export default function HistoryPage() {
  return (
    <div className="p-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Historique</h1>
        <p className="text-lg text-gray-600">Fichiers exportés précédemment</p>
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-xl p-16 shadow-md text-center">
        <div className="text-8xl mb-6 opacity-50">📂</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">Aucun fichier exporté</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Lancez une synchronisation pour voir l'historique de vos exports.
        </p>
        <Link
          href="/sync"
          className="inline-block px-8 py-4 gradient-primary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          Synchroniser maintenant
        </Link>
      </div>
    </div>
  )
}
