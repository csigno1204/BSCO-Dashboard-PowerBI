'use client'

import { useState } from 'react'
import { useApp } from '@/components/AppProvider'

export default function PowerBI() {
  const { isConfigured } = useApp()
  const [activeTab, setActiveTab] = useState<'guide' | 'template' | 'tips'>('guide')

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">💼 Power BI Integration</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab('guide')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'guide'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-600 hover:text-primary'
          }`}
        >
          📖 Guide d'Import
        </button>
        <button
          onClick={() => setActiveTab('template')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'template'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-600 hover:text-primary'
          }`}
        >
          📊 Templates .pbit
        </button>
        <button
          onClick={() => setActiveTab('tips')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'tips'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-600 hover:text-primary'
          }`}
        >
          💡 Trucs & Astuces
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'guide' && (
        <div className="space-y-6">
          {/* Quick Start */}
          <div className="bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">🚀 Démarrage Rapide</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 p-4 rounded-lg">
                <span className="text-3xl mb-2 block">1️⃣</span>
                <h3 className="font-bold mb-2">Synchroniser</h3>
                <p className="text-sm opacity-90">Extrayez vos données Bexio</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <span className="text-3xl mb-2 block">2️⃣</span>
                <h3 className="font-bold mb-2">Télécharger Excel</h3>
                <p className="text-sm opacity-90">Export avec 11 feuilles d'analyses</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <span className="text-3xl mb-2 block">3️⃣</span>
                <h3 className="font-bold mb-2">Importer dans Power BI</h3>
                <p className="text-sm opacity-90">Créez vos rapports visuels</p>
              </div>
            </div>
          </div>

          {/* Detailed Guide */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6">📋 Guide Détaillé d'Import</h2>

            {/* Step 1 */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <h3 className="text-xl font-bold">Exporter les Données</h3>
              </div>
              <div className="ml-13 space-y-4">
                <p className="text-gray-700">
                  Allez dans <strong>Synchronisation</strong> et cliquez sur <strong>"Synchroniser maintenant"</strong>.
                  Une fois terminé, cliquez sur <strong>"Télécharger Excel"</strong>.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-sm text-blue-900">
                    💡 <strong>Le fichier Excel contient 11 feuilles :</strong>
                  </p>
                  <ul className="text-sm text-blue-800 mt-2 ml-6 list-disc space-y-1">
                    <li>Dashboard (KPIs résumés)</li>
                    <li>Contacts</li>
                    <li>Factures</li>
                    <li>Offres</li>
                    <li>Commandes</li>
                    <li>Projets</li>
                    <li>Temps trackés</li>
                    <li>Articles</li>
                    <li>Top Clients (top 10)</li>
                    <li>Tendances mensuelles (12 mois)</li>
                    <li>Analyse Factures (avec statuts)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <h3 className="text-xl font-bold">Ouvrir Power BI Desktop</h3>
              </div>
              <div className="ml-13 space-y-4">
                <p className="text-gray-700">
                  Téléchargez gratuitement <strong>Power BI Desktop</strong> depuis le Microsoft Store ou le site officiel.
                </p>
                <a
                  href="https://powerbi.microsoft.com/fr-fr/desktop/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Télécharger Power BI Desktop →
                </a>
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                  <p className="text-sm text-yellow-900">
                    ⚠️ <strong>Prérequis :</strong> Windows 10/11 - Power BI Desktop n'est pas disponible sur Mac (utilisez la version web).
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <h3 className="text-xl font-bold">Importer le Fichier Excel</h3>
              </div>
              <div className="ml-13 space-y-4">
                <ol className="list-decimal list-inside space-y-3 text-gray-700">
                  <li>Ouvrez Power BI Desktop</li>
                  <li>Cliquez sur <strong>"Obtenir les données"</strong> ou <strong>"Get Data"</strong></li>
                  <li>Sélectionnez <strong>"Excel"</strong></li>
                  <li>Naviguez vers le fichier <code className="bg-gray-100 px-2 py-1 rounded">bexio_complete_YYYY-MM-DD.xlsx</code></li>
                  <li>Sélectionnez les feuilles que vous souhaitez importer (recommandé : toutes)</li>
                  <li>Cliquez sur <strong>"Charger"</strong> ou <strong>"Transformer les données"</strong> pour éditer</li>
                </ol>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <p className="text-sm text-green-900">
                    ✅ <strong>Conseil :</strong> Utilisez <strong>"Transformer les données"</strong> pour nettoyer/filtrer avant import.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                  4
                </div>
                <h3 className="text-xl font-bold">Créer des Relations entre Tables</h3>
              </div>
              <div className="ml-13 space-y-4">
                <p className="text-gray-700">
                  Power BI peut automatiquement détecter les relations. Sinon, créez-les manuellement :
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Factures.contact_id</strong> → <strong>Contacts.id</strong></li>
                  <li><strong>Offres.contact_id</strong> → <strong>Contacts.id</strong></li>
                  <li><strong>Projets.contact_id</strong> → <strong>Contacts.id</strong></li>
                  <li><strong>Top Clients.ID Client</strong> → <strong>Contacts.id</strong></li>
                </ul>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-sm text-blue-900">
                    💡 Allez dans <strong>Modèle</strong> (icône de relation) → Glissez-déposez les champs pour créer des relations.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                  5
                </div>
                <h3 className="text-xl font-bold">Créer vos Visualisations</h3>
              </div>
              <div className="ml-13 space-y-4">
                <p className="text-gray-700 mb-4">
                  Utilisez les visuels Power BI pour créer votre dashboard :
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                    <h4 className="font-bold mb-2">📈 Graphique en Courbes</h4>
                    <p className="text-sm text-gray-700">
                      <strong>Tendances</strong> : Utilisez <code>Mois</code> en axe X et <code>Chiffre d'affaires</code> en valeurs
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                    <h4 className="font-bold mb-2">📊 Graphique en Barres</h4>
                    <p className="text-sm text-gray-700">
                      <strong>Top Clients</strong> : Utilisez <code>Nom</code> et <code>Chiffre d'affaires</code>
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                    <h4 className="font-bold mb-2">🥧 Graphique Camembert</h4>
                    <p className="text-sm text-gray-700">
                      <strong>Analyse Factures</strong> : Répartition par <code>Statut</code>
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                    <h4 className="font-bold mb-2">🔢 Cartes KPI</h4>
                    <p className="text-sm text-gray-700">
                      <strong>Dashboard</strong> : Affichez CA total, Nombre factures, etc.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 6 */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                  6
                </div>
                <h3 className="text-xl font-bold">Publier et Partager</h3>
              </div>
              <div className="ml-13 space-y-4">
                <p className="text-gray-700">
                  Une fois votre rapport créé :
                </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Cliquez sur <strong>"Publier"</strong> dans le ruban</li>
                  <li>Connectez-vous à votre compte Power BI (gratuit ou Pro)</li>
                  <li>Sélectionnez un espace de travail</li>
                  <li>Partagez le lien avec votre équipe</li>
                </ol>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <p className="text-sm text-green-900">
                    ✅ <strong>Astuce :</strong> Configurez l'actualisation automatique pour mettre à jour les données régulièrement.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isConfigured ? (
            <div className="flex gap-4">
              <a
                href="/sync"
                className="flex-1 bg-primary hover:bg-primary-dark text-white px-6 py-4 rounded-lg transition-colors text-center font-semibold"
              >
                🔄 Synchroniser les données
              </a>
              <button
                onClick={() => window.open('/api/download', '_blank')}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg transition-colors font-semibold"
              >
                📥 Télécharger Excel
              </button>
            </div>
          ) : (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
              <p className="text-yellow-800 mb-4">
                ⚠️ Vous devez d'abord configurer votre clé API Bexio.
              </p>
              <a
                href="/config"
                className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Configurer maintenant →
              </a>
            </div>
          )}
        </div>
      )}

      {activeTab === 'template' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">📊 Templates Power BI Professionnels</h2>
            <p className="text-gray-700 mb-6">
              Téléchargez nos templates et configurations pré-configurés pour démarrer rapidement avec vos données Bexio.
            </p>

            {/* Template .pbit - NOUVEAU */}
            <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 text-white p-8 rounded-xl mb-6 shadow-2xl">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-5xl">📊</span>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold">Template Power BI (.pbit)</h3>
                    <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">NOUVEAU</span>
                  </div>
                  <p className="text-lg opacity-95 mb-4">
                    Fichier template Power BI prêt à l'emploi - Ouvrez directement dans Power BI Desktop !
                  </p>
                </div>
              </div>
              <ul className="space-y-2 mb-6 ml-16">
                <li className="flex items-center gap-2">
                  <span className="text-green-300 font-bold">✓</span>
                  <span>Modèle de données pré-configuré (4 tables + relations)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-300 font-bold">✓</span>
                  <span>8 mesures DAX essentielles incluses</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-300 font-bold">✓</span>
                  <span>Structure de rapport prête pour vos visualisations</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-300 font-bold">✓</span>
                  <span>Connexion Excel automatique (il suffit de pointer vers votre fichier)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-300 font-bold">✓</span>
                  <span>Compatible avec toutes les données Bexio synchronisées</span>
                </li>
              </ul>
              <button
                onClick={() => window.open('/api/powerbi-template?type=pbit', '_blank')}
                className="w-full bg-white text-purple-600 hover:bg-gray-50 px-8 py-5 rounded-xl transition-all transform hover:scale-105 font-bold text-xl flex items-center justify-center gap-3 shadow-xl"
              >
                <span className="text-3xl">⬇️</span>
                Télécharger le Template .pbit
                <span className="text-sm font-normal opacity-75">(Ouvrir dans Power BI Desktop)</span>
              </button>
              <p className="text-center text-sm opacity-80 mt-3">
                📌 Après téléchargement : Double-cliquez sur le fichier .pbit et pointez vers votre Excel synchronisé
              </p>
            </div>

            {/* Pack Complet */}
            <div className="bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-lg mb-6">
              <h3 className="text-xl font-bold mb-4">🎁 Pack Complet - RECOMMANDÉ</h3>
              <ul className="space-y-2 mb-4">
                <li>✅ Configuration complète JSON avec 35+ mesures DAX</li>
                <li>✅ Guide technique détaillé (4000+ mots)</li>
                <li>✅ 4 pages de rapports prêtes à l'emploi</li>
                <li>✅ Toutes les relations de données configurées</li>
                <li>✅ Thème de couleurs professionnel</li>
                <li>✅ Instructions pas-à-pas</li>
              </ul>
              <button
                onClick={() => window.open('/api/powerbi-template?type=both', '_blank')}
                className="w-full bg-white text-primary hover:bg-gray-100 px-6 py-4 rounded-lg transition-colors font-semibold text-lg flex items-center justify-center gap-2"
              >
                <span className="text-2xl">📥</span>
                Télécharger le Pack Complet
              </button>
            </div>

            {/* Options individuelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Config JSON */}
              <div className="bg-blue-50 border-2 border-blue-200 p-5 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">⚙️</span>
                  <h3 className="text-lg font-bold text-blue-900">Configuration JSON</h3>
                </div>
                <p className="text-sm text-blue-800 mb-4">
                  Fichier JSON avec toutes les mesures DAX, relations, et layouts de visualisations
                </p>
                <button
                  onClick={() => window.open('/api/powerbi-template?type=config', '_blank')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors font-semibold"
                >
                  📥 Télécharger Config JSON
                </button>
              </div>

              {/* Guide Markdown */}
              <div className="bg-green-50 border-2 border-green-200 p-5 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">📖</span>
                  <h3 className="text-lg font-bold text-green-900">Guide Technique</h3>
                </div>
                <p className="text-sm text-green-800 mb-4">
                  Documentation complète avec explications détaillées et code DAX prêt à copier
                </p>
                <button
                  onClick={() => window.open('/api/powerbi-template?type=guide', '_blank')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors font-semibold"
                >
                  📥 Télécharger Guide MD
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded mb-6">
              <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                <span className="text-xl">🚀</span>
                Démarrage Rapide
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-purple-800">
                <li>Téléchargez le <strong>Pack Complet</strong> ci-dessus</li>
                <li>Synchronisez vos données et téléchargez le <strong>fichier Excel</strong></li>
                <li>Ouvrez <strong>Power BI Desktop</strong></li>
                <li>Importez le fichier Excel (Obtenir des données → Excel)</li>
                <li>Créez les <strong>relations</strong> listées dans le fichier JSON</li>
                <li>Copiez les <strong>mesures DAX</strong> depuis le guide</li>
                <li>Créez vos <strong>visuels</strong> en suivant les layouts recommandés</li>
                <li>Appliquez le <strong>thème de couleurs</strong></li>
                <li><strong>Publiez</strong> sur Power BI Service</li>
              </ol>
            </div>

            {/* Contenu du Template */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border-2 border-gray-200 p-4 rounded-lg">
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <span>📊</span> Mesures DAX Incluses (35+)
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• CA Total, CA Payé, CA En Attente</li>
                  <li>• CA Net (après notes de crédit)</li>
                  <li>• Marge Brute & % Marge</li>
                  <li>• DSO (Days Sales Outstanding)</li>
                  <li>• Taux de Conversion des Offres</li>
                  <li>• Taux de Facturation des Heures</li>
                  <li>• Panier Moyen par Client</li>
                  <li>• Nb Clients Actifs</li>
                  <li>• + 27 autres mesures...</li>
                </ul>
              </div>

              <div className="bg-white border-2 border-gray-200 p-4 rounded-lg">
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <span>📄</span> 4 Pages de Rapports
                </h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="font-bold">1.</span>
                    <div>
                      <strong>Dashboard Principal</strong>
                      <p className="text-gray-600">KPIs, évolution CA, top clients</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">2.</span>
                    <div>
                      <strong>Analyse Financière</strong>
                      <p className="text-gray-600">Trésorerie, waterfall, paiements</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">3.</span>
                    <div>
                      <strong>Analyse Clients</strong>
                      <p className="text-gray-600">Segmentation, géo, comportement</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">4.</span>
                    <div>
                      <strong>Projets & Opérations</strong>
                      <p className="text-gray-600">Temps, tâches, rentabilité</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Note version */}
            <p className="text-sm text-gray-600 mt-6 text-center">
              Version 2.1 - Compatible Power BI Desktop (Dernière version)
              <br />
              12 endpoints Bexio • 16 feuilles Excel • 55+ KPIs
            </p>
          </div>
        </div>
      )}

      {activeTab === 'tips' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6">💡 Trucs & Astuces Power BI</h2>

            <div className="space-y-6">
              {/* Tip 1 */}
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-bold mb-2">🎨 Personnaliser les Couleurs</h3>
                <p className="text-gray-700 mb-2">
                  Utilisez les couleurs de votre marque dans vos rapports :
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Allez dans <strong>Affichage</strong> → <strong>Thèmes</strong></li>
                  <li>Importez un fichier JSON de thème personnalisé</li>
                  <li>Ou modifiez les couleurs manuellement dans chaque visuel</li>
                </ul>
              </div>

              {/* Tip 2 */}
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-bold mb-2">📊 Créer des Mesures DAX</h3>
                <p className="text-gray-700 mb-2">
                  Ajoutez des calculs personnalisés avec DAX :
                </p>
                <div className="bg-gray-100 p-3 rounded font-mono text-sm mb-2">
                  CA Total = SUM(Factures[Montant])<br/>
                  Taux Conversion = DIVIDE(Offres[Acceptées], Offres[Total])
                </div>
                <p className="text-sm text-gray-600">
                  Allez dans l'onglet <strong>Modélisation</strong> → <strong>Nouvelle mesure</strong>
                </p>
              </div>

              {/* Tip 3 */}
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="text-lg font-bold mb-2">🔄 Actualisation Automatique</h3>
                <p className="text-gray-700 mb-2">
                  Configurez l'actualisation planifiée dans Power BI Service :
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Publiez votre rapport sur Power BI Service</li>
                  <li>Allez dans les paramètres du dataset</li>
                  <li>Configurez <strong>"Actualisation planifiée"</strong></li>
                  <li>Choisissez la fréquence (quotidienne recommandée)</li>
                </ul>
              </div>

              {/* Tip 4 */}
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="text-lg font-bold mb-2">🎯 Segments et Filtres</h3>
                <p className="text-gray-700 mb-2">
                  Ajoutez des filtres interactifs pour explorer vos données :
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Insérez un <strong>Segment</strong> pour filtrer par période, client, etc.</li>
                  <li>Utilisez <strong>Filtres au niveau du rapport</strong> pour filtrer toutes les pages</li>
                  <li>Créez des <strong>info-bulles</strong> personnalisées pour plus de détails</li>
                </ul>
              </div>

              {/* Tip 5 */}
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="text-lg font-bold mb-2">🚀 Performance</h3>
                <p className="text-gray-700 mb-2">
                  Optimisez les performances de vos rapports :
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Supprimez les colonnes inutiles lors de l'import</li>
                  <li>Utilisez des mesures au lieu de colonnes calculées</li>
                  <li>Limitez le nombre de visuels par page (max 10-15)</li>
                  <li>Utilisez l'analyseur de performances (Performance Analyzer)</li>
                </ul>
              </div>

              {/* Tip 6 */}
              <div className="border-l-4 border-pink-500 pl-4">
                <h3 className="text-lg font-bold mb-2">📱 Optimiser pour Mobile</h3>
                <p className="text-gray-700 mb-2">
                  Créez une vue mobile de vos rapports :
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Allez dans <strong>Affichage</strong> → <strong>Disposition pour mobile</strong></li>
                  <li>Réorganisez les visuels pour un affichage vertical</li>
                  <li>Testez dans l'application mobile Power BI</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div className="bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">📚 Ressources Utiles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="https://learn.microsoft.com/fr-fr/power-bi/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-4 rounded-lg transition-colors"
              >
                <h3 className="font-bold mb-2">📖 Documentation Microsoft</h3>
                <p className="text-sm opacity-90">Guide complet Power BI</p>
              </a>
              <a
                href="https://community.powerbi.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-4 rounded-lg transition-colors"
              >
                <h3 className="font-bold mb-2">👥 Communauté Power BI</h3>
                <p className="text-sm opacity-90">Forum d'entraide</p>
              </a>
              <a
                href="https://www.youtube.com/results?search_query=power+bi+tutorial"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-4 rounded-lg transition-colors"
              >
                <h3 className="font-bold mb-2">🎥 Tutoriels Vidéo</h3>
                <p className="text-sm opacity-90">YouTube Power BI</p>
              </a>
              <a
                href="https://dax.guide/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-4 rounded-lg transition-colors"
              >
                <h3 className="font-bold mb-2">📐 DAX Guide</h3>
                <p className="text-sm opacity-90">Référence DAX complète</p>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
