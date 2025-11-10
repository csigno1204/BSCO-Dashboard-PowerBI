import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { setSyncedData } from '@/lib/dataStore'

interface BexioContact {
  id: number
  name_1: string
  name_2?: string
  mail?: string
  phone_fixed?: string
  phone_mobile?: string
  address?: string
  postcode?: string
  city?: string
  country_id?: number
}

interface BexioInvoice {
  id: number
  document_nr: string
  title?: string
  contact_id?: number
  total: number
  total_gross: number
  currency_id: number
  is_valid_from: string
  is_valid_until?: string
  kb_item_status_id?: number
  payment_type_id?: number
}

interface BexioProject {
  id: number
  name: string
  pr_state_id: number
  contact_id?: number
  pr_project_type_id?: number
}

interface BexioOffer {
  id: number
  document_nr: string
  title?: string
  contact_id?: number
  total: number
  total_gross: number
  kb_item_status_id?: number
  is_valid_from: string
}

interface BexioOrder {
  id: number
  document_nr: string
  title?: string
  contact_id?: number
  total: number
  total_gross: number
  kb_item_status_id?: number
  is_valid_from: string
}

interface BexioTimesheet {
  id: number
  user_id: number
  client_service_id?: number
  text?: string
  allowable_bill: number
  date: string
  duration: number
}

interface BexioArticle {
  id: number
  article_type_id?: number
  contact_id?: number
  name: string
  sale_price?: number
  purchase_price?: number
  stock_nr?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const apiKey = request.headers.get('x-api-key') || body.apiKey

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API key is required' },
        { status: 400 }
      )
    }

    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }

    // Helper function to safely fetch data
    const safeFetch = async <T>(url: string, name: string): Promise<T[]> => {
      try {
        const response = await axios.get<T[]>(url, {
          headers,
          params: { limit: 2000 }
        })
        return response.data || []
      } catch (err: any) {
        console.log(`${name} endpoint not available or no data:`, err.message)
        return []
      }
    }

    // Extract all data in parallel for better performance
    const [
      contacts,
      invoices,
      projects,
      offers,
      orders,
      timesheets,
      articles
    ] = await Promise.all([
      safeFetch<BexioContact>('https://api.bexio.com/2.0/contact', 'Contacts'),
      safeFetch<BexioInvoice>('https://api.bexio.com/2.0/kb_invoice', 'Invoices'),
      safeFetch<BexioProject>('https://api.bexio.com/2.0/pr_project', 'Projects'),
      safeFetch<BexioOffer>('https://api.bexio.com/2.0/kb_offer', 'Offers'),
      safeFetch<BexioOrder>('https://api.bexio.com/2.0/kb_order', 'Orders'),
      safeFetch<BexioTimesheet>('https://api.bexio.com/2.0/timesheet', 'Timesheets'),
      safeFetch<BexioArticle>('https://api.bexio.com/2.0/article', 'Articles')
    ])

    // === ANALYSES AVANCÉES ===

    // 1. Analyse Factures
    const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.total || inv.total_gross || 0), 0)
    const invoicesPaid = invoices.filter(inv => inv.kb_item_status_id === 7 || inv.kb_item_status_id === 9) // Payé ou partiellement payé
    const invoicesPending = invoices.filter(inv => inv.kb_item_status_id === 5 || inv.kb_item_status_id === 6) // Envoyé ou vu
    const invoicesOverdue = invoices.filter(inv => {
      if (!inv.is_valid_until) return false
      const dueDate = new Date(inv.is_valid_until)
      return dueDate < new Date() && (inv.kb_item_status_id !== 7 && inv.kb_item_status_id !== 9)
    })

    const revenuePaid = invoicesPaid.reduce((sum, inv) => sum + (inv.total || inv.total_gross || 0), 0)
    const revenuePending = invoicesPending.reduce((sum, inv) => sum + (inv.total || inv.total_gross || 0), 0)
    const revenueOverdue = invoicesOverdue.reduce((sum, inv) => sum + (inv.total || inv.total_gross || 0), 0)
    const averageInvoice = invoices.length > 0 ? totalRevenue / invoices.length : 0

    // 2. Analyse Offres
    const totalOffers = offers.reduce((sum, off) => sum + (off.total || off.total_gross || 0), 0)
    const offersAccepted = offers.filter(off => off.kb_item_status_id === 8) // Accepté
    const offersPending = offers.filter(off => off.kb_item_status_id === 5 || off.kb_item_status_id === 6)
    const conversionRate = offers.length > 0 ? (offersAccepted.length / offers.length) * 100 : 0

    // 3. Analyse Commandes
    const totalOrders = orders.reduce((sum, ord) => sum + (ord.total || ord.total_gross || 0), 0)

    // 4. Analyse Temps
    const totalHours = timesheets.reduce((sum, ts) => sum + (ts.duration || 0), 0)
    const billableHours = timesheets.filter(ts => ts.allowable_bill).length
    const billabilityRate = timesheets.length > 0 ? (billableHours / timesheets.length) * 100 : 0

    // 5. Top Clients (par CA)
    const clientRevenue: Record<number, number> = {}
    invoices.forEach(inv => {
      if (inv.contact_id) {
        clientRevenue[inv.contact_id] = (clientRevenue[inv.contact_id] || 0) + (inv.total || inv.total_gross || 0)
      }
    })
    const topClients = Object.entries(clientRevenue)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([contactId, revenue]) => ({
        contactId: parseInt(contactId),
        contact: contacts.find(c => c.id === parseInt(contactId)),
        revenue
      }))

    // 6. Tendances mensuelles (12 derniers mois)
    const monthlyRevenue: Record<string, number> = {}
    invoices.forEach(inv => {
      const date = new Date(inv.is_valid_from)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + (inv.total || inv.total_gross || 0)
    })
    const trends = Object.entries(monthlyRevenue)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([month, revenue]) => ({ month, revenue }))

    // 7. Analyse Articles
    const totalArticlesValue = articles.reduce((sum, art) => sum + ((art.sale_price || 0) * 1), 0)

    // 8. Projets actifs
    const activeProjects = projects.filter(p => p.pr_state_id === 1 || p.pr_state_id === 2) // Actif ou en cours
    const completedProjects = projects.filter(p => p.pr_state_id === 3) // Terminé

    // Store data using shared dataStore
    setSyncedData({
      // Raw data
      contacts,
      invoices,
      projects,
      offers,
      orders,
      timesheets,
      articles,

      // Analyses
      analytics: {
        invoiceAnalysis: {
          total: invoices.length,
          paid: invoicesPaid.length,
          pending: invoicesPending.length,
          overdue: invoicesOverdue.length,
          totalRevenue,
          revenuePaid,
          revenuePending,
          revenueOverdue,
          averageInvoice
        },
        offerAnalysis: {
          total: offers.length,
          accepted: offersAccepted.length,
          pending: offersPending.length,
          totalValue: totalOffers,
          conversionRate
        },
        orderAnalysis: {
          total: orders.length,
          totalValue: totalOrders
        },
        timeAnalysis: {
          totalHours,
          totalEntries: timesheets.length,
          billableHours,
          billabilityRate
        },
        projectAnalysis: {
          total: projects.length,
          active: activeProjects.length,
          completed: completedProjects.length
        },
        topClients,
        trends,
        articlesValue: totalArticlesValue
      },

      timestamp: new Date().toISOString()
    })

    // Return comprehensive stats
    return NextResponse.json({
      success: true,
      stats: {
        contacts: contacts.length,
        invoices: invoices.length,
        projects: projects.length,
        offers: offers.length,
        orders: orders.length,
        timesheets: timesheets.length,
        articles: articles.length,
        totalRevenue,
        revenuePaid,
        revenuePending,
        revenueOverdue,
        invoicesPaid: invoicesPaid.length,
        invoicesPending: invoicesPending.length,
        invoicesOverdue: invoicesOverdue.length,
        totalHours,
        conversionRate,
        topClientsCount: topClients.length
      },
      message: 'Synchronisation complète terminée avec succès'
    })
  } catch (error: any) {
    console.error('Sync API error:', error.response?.data || error.message)
    return NextResponse.json(
      {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la synchronisation'
      },
      { status: 500 }
    )
  }
}
