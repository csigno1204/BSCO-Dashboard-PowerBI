'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Analytics {
  invoiceAnalysis?: {
    total: number
    paid: number
    pending: number
    overdue: number
    totalRevenue: number
    revenuePaid: number
    revenuePending: number
    revenueOverdue: number
  }
  offerAnalysis?: {
    total: number
    accepted: number
    pending: number
    conversionRate: number
  }
  timeAnalysis?: {
    totalHours: number
    billableHours: number
    billabilityRate: number
  }
  projectAnalysis?: {
    total: number
    active: number
    completed: number
  }
  topClients?: Array<{
    contactId: number
    contact?: { name_1: string }
    revenue: number
  }>
  trends?: Array<{
    month: string
    revenue: number
  }>
}

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b']

export default function Analytics() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load analytics from last sync
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      // In a real app, we'd fetch from an API endpoint that returns analytics
      // For now, we'll simulate with a small delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // Check if we have synced data in localStorage (simplified)
      // In production, this would come from the dataStore via an API call
      setLoading(false)
    } catch (error) {
      console.error('Error loading analytics:', error)
      setLoading(false)
    }
  }

  // Prepare data for invoice status pie chart
  const invoiceStatusData = analytics?.invoiceAnalysis ? [
    { name: 'Payées', value: analytics.invoiceAnalysis.paid },
    { name: 'En attente', value: analytics.invoiceAnalysis.pending },
    { name: 'En retard', value: analytics.invoiceAnalysis.overdue }
  ].filter(d => d.value > 0) : []

  // Prepare data for revenue pie chart
  const revenueStatusData = analytics?.invoiceAnalysis ? [
    { name: 'CA Payé', value: analytics.invoiceAnalysis.revenuePaid },
    { name: 'CA En attente', value: analytics.invoiceAnalysis.revenuePending },
    { name: 'CA En retard', value: analytics.invoiceAnalysis.revenueOverdue }
  ].filter(d => d.value > 0) : []

  // Prepare data for project status pie chart
  const projectStatusData = analytics?.projectAnalysis ? [
    { name: 'Actifs', value: analytics.projectAnalysis.active },
    { name: 'Terminés', value: analytics.projectAnalysis.completed }
  ].filter(d => d.value > 0) : []

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">📈 Analytics</h1>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
          <div className="flex items-start">
            <span className="text-3xl mr-4">⚠️</span>
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Aucune donnée disponible</h3>
              <p className="text-yellow-700 mb-4">
                Veuillez d'abord synchroniser vos données Bexio pour voir les analytics.
              </p>
              <a
                href="/sync"
                className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Aller à la synchronisation →
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">📈 Analytics Avancées</h1>

      {/* KPIs Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <h3 className="text-sm font-semibold opacity-90 mb-2">Chiffre d'Affaires</h3>
          <p className="text-3xl font-bold">{analytics.invoiceAnalysis?.totalRevenue.toFixed(0) || 0} CHF</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <h3 className="text-sm font-semibold opacity-90 mb-2">Taux de Conversion</h3>
          <p className="text-3xl font-bold">{analytics.offerAnalysis?.conversionRate.toFixed(1) || 0}%</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <h3 className="text-sm font-semibold opacity-90 mb-2">Heures Totales</h3>
          <p className="text-3xl font-bold">{analytics.timeAnalysis?.totalHours.toFixed(0) || 0}h</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
          <h3 className="text-sm font-semibold opacity-90 mb-2">Projets Actifs</h3>
          <p className="text-3xl font-bold">{analytics.projectAnalysis?.active || 0}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Tendances Mensuelles */}
        {analytics.trends && analytics.trends.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">📊 Tendances Mensuelles (CA)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => `${value.toFixed(0)} CHF`} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#667eea" strokeWidth={3} name="Chiffre d'affaires" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Top Clients */}
        {analytics.topClients && analytics.topClients.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">🏆 Top 10 Clients</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.topClients.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="contact.name_1" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip formatter={(value: number) => `${value.toFixed(0)} CHF`} />
                <Legend />
                <Bar dataKey="revenue" fill="#764ba2" name="CA" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Statut Factures */}
        {invoiceStatusData.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">📄 Statut des Factures</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={invoiceStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {invoiceStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Répartition CA */}
        {revenueStatusData.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">💰 Répartition du CA</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {revenueStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toFixed(0)} CHF`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold mb-4">📋 Factures</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total:</span>
              <span className="font-bold">{analytics.invoiceAnalysis?.total || 0}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Payées:</span>
              <span className="font-bold">{analytics.invoiceAnalysis?.paid || 0}</span>
            </div>
            <div className="flex justify-between text-yellow-600">
              <span>En attente:</span>
              <span className="font-bold">{analytics.invoiceAnalysis?.pending || 0}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>En retard:</span>
              <span className="font-bold">{analytics.invoiceAnalysis?.overdue || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold mb-4">📝 Offres</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total:</span>
              <span className="font-bold">{analytics.offerAnalysis?.total || 0}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Acceptées:</span>
              <span className="font-bold">{analytics.offerAnalysis?.accepted || 0}</span>
            </div>
            <div className="flex justify-between text-yellow-600">
              <span>En attente:</span>
              <span className="font-bold">{analytics.offerAnalysis?.pending || 0}</span>
            </div>
            <div className="flex justify-between text-blue-600">
              <span>Taux conversion:</span>
              <span className="font-bold">{analytics.offerAnalysis?.conversionRate.toFixed(1) || 0}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold mb-4">⏱️ Temps</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Heures totales:</span>
              <span className="font-bold">{analytics.timeAnalysis?.totalHours.toFixed(1) || 0}h</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Heures facturables:</span>
              <span className="font-bold">{analytics.timeAnalysis?.billableHours || 0}h</span>
            </div>
            <div className="flex justify-between text-blue-600">
              <span>Taux facturation:</span>
              <span className="font-bold">{analytics.timeAnalysis?.billabilityRate.toFixed(1) || 0}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
