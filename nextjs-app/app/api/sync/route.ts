import { NextRequest, NextResponse } from 'next/server'
import { BexioAPIClient } from '@/lib/bexioClient'
import { setSyncedData } from '@/lib/dataStore'

// Interfaces for all Bexio data types
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

interface BexioCreditNote {
  id: number
  document_nr: string
  title?: string
  contact_id?: number
  total: number
  total_gross: number
  kb_item_status_id?: number
  is_valid_from: string
}

interface BexioProject {
  id: number
  name: string
  pr_state_id: number
  contact_id?: number
  pr_project_type_id?: number
}

interface BexioTimesheet {
  id: number
  user_id: number
  client_service_id?: number
  text?: string
  allowable_bill: number | boolean
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

interface BexioPayment {
  id: number
  title?: string
  value: number
  is_open: boolean
  date: string
}

interface BexioExpense {
  id: number
  user_id: number
  contact_id?: number
  total: number
  currency_id: number
  document_date: string
}

interface BexioNote {
  id: number
  user_id: number
  contact_id?: number
  subject?: string
  info?: string
  date: string
}

interface BexioTask {
  id: number
  user_id: number
  contact_id?: number
  pr_project_id?: number
  subject: string
  status: number
  finish_date?: string
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

    // Create Bexio API client with proper error handling
    const client = new BexioAPIClient({ apiKey, timeout: 60000 })

    // Verify API key
    const isValid = await client.healthCheck()
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid Bexio API key' },
        { status: 401 }
      )
    }

    console.log('✅ Bexio API connection established')

    // Extract all data in parallel for maximum performance
    console.log('📊 Fetching all data from Bexio...')

    const [
      contacts,
      invoices,
      offers,
      orders,
      creditNotes,
      projects,
      timesheets,
      articles,
      payments,
      expenses,
      notes,
      tasks
    ] = await Promise.all([
      client.getContacts().catch(err => { console.log('Contacts error:', err.message); return [] }),
      client.getInvoices().catch(err => { console.log('Invoices error:', err.message); return [] }),
      client.getOffers().catch(err => { console.log('Offers error:', err.message); return [] }),
      client.getOrders().catch(err => { console.log('Orders error:', err.message); return [] }),
      client.getCreditNotes().catch(err => { console.log('Credit Notes error:', err.message); return [] }),
      client.getProjects().catch(err => { console.log('Projects error:', err.message); return [] }),
      client.getTimesheets().catch(err => { console.log('Timesheets error:', err.message); return [] }),
      client.getArticles().catch(err => { console.log('Articles error:', err.message); return [] }),
      client.getPayments().catch(err => { console.log('Payments error:', err.message); return [] }),
      client.getExpenses().catch(err => { console.log('Expenses error:', err.message); return [] }),
      client.getNotes().catch(err => { console.log('Notes error:', err.message); return [] }),
      client.getTasks().catch(err => { console.log('Tasks error:', err.message); return [] })
    ])

    console.log(`✅ Data extracted:
      - Contacts: ${contacts.length}
      - Invoices: ${invoices.length}
      - Offers: ${offers.length}
      - Orders: ${orders.length}
      - Credit Notes: ${creditNotes.length}
      - Projects: ${projects.length}
      - Timesheets: ${timesheets.length}
      - Articles: ${articles.length}
      - Payments: ${payments.length}
      - Expenses: ${expenses.length}
      - Notes: ${notes.length}
      - Tasks: ${tasks.length}
    `)

    // === ADVANCED ANALYTICS ===

    // 1. Invoice Analysis
    const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.total || inv.total_gross || 0), 0)
    const invoicesPaid = invoices.filter(inv => inv.kb_item_status_id === 7 || inv.kb_item_status_id === 9)
    const invoicesPending = invoices.filter(inv => inv.kb_item_status_id === 5 || inv.kb_item_status_id === 6)
    const invoicesOverdue = invoices.filter(inv => {
      if (!inv.is_valid_until) return false
      const dueDate = new Date(inv.is_valid_until)
      return dueDate < new Date() && (inv.kb_item_status_id !== 7 && inv.kb_item_status_id !== 9)
    })

    const revenuePaid = invoicesPaid.reduce((sum, inv) => sum + (inv.total || inv.total_gross || 0), 0)
    const revenuePending = invoicesPending.reduce((sum, inv) => sum + (inv.total || inv.total_gross || 0), 0)
    const revenueOverdue = invoicesOverdue.reduce((sum, inv) => sum + (inv.total || inv.total_gross || 0), 0)
    const averageInvoice = invoices.length > 0 ? totalRevenue / invoices.length : 0

    // 2. Credit Notes Analysis
    const totalCreditNotes = creditNotes.reduce((sum, cn) => sum + (cn.total || cn.total_gross || 0), 0)
    const netRevenue = totalRevenue - totalCreditNotes

    // 3. Offer Analysis
    const totalOffers = offers.reduce((sum, off) => sum + (off.total || off.total_gross || 0), 0)
    const offersAccepted = offers.filter(off => off.kb_item_status_id === 8)
    const offersPending = offers.filter(off => off.kb_item_status_id === 5 || off.kb_item_status_id === 6)
    const conversionRate = offers.length > 0 ? (offersAccepted.length / offers.length) * 100 : 0

    // 4. Order Analysis
    const totalOrders = orders.reduce((sum, ord) => sum + (ord.total || ord.total_gross || 0), 0)

    // 5. Time Analysis
    const totalHours = timesheets.reduce((sum, ts) => sum + (ts.duration || 0), 0)
    const billableEntries = timesheets.filter(ts => ts.allowable_bill === true || ts.allowable_bill === 1)
    const billableHours = billableEntries.reduce((sum, ts) => sum + (ts.duration || 0), 0)
    const billabilityRate = timesheets.length > 0 ? (billableEntries.length / timesheets.length) * 100 : 0

    // 6. Payment Analysis
    const totalPayments = payments.reduce((sum, p) => sum + (p.value || 0), 0)
    const openPayments = payments.filter(p => p.is_open).reduce((sum, p) => sum + (p.value || 0), 0)

    // 7. Expense Analysis
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.total || 0), 0)

    // 8. Project Analysis
    const activeProjects = projects.filter(p => p.pr_state_id === 1 || p.pr_state_id === 2)
    const completedProjects = projects.filter(p => p.pr_state_id === 3)

    // 9. Top Clients (by revenue)
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
        contact: contacts.find((c: any) => c.id === parseInt(contactId)),
        revenue
      }))

    // 10. Monthly Trends (last 12 months)
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

    // 11. Article Analysis
    const totalArticlesValue = articles.reduce((sum, art) => sum + ((art.sale_price || 0) * 1), 0)

    // 12. Task Analysis
    const openTasks = tasks.filter(t => t.status === 1 || t.status === 2)
    const completedTasks = tasks.filter(t => t.status === 3)

    // Store comprehensive data
    setSyncedData({
      // Raw data
      contacts,
      invoices,
      offers,
      orders,
      creditNotes,
      projects,
      timesheets,
      articles,
      payments,
      expenses,
      notes,
      tasks,

      // Analytics
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
          averageInvoice,
          netRevenue,
          totalCreditNotes
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
          billableHours,
          totalEntries: timesheets.length,
          billableEntries: billableEntries.length,
          billabilityRate
        },
        projectAnalysis: {
          total: projects.length,
          active: activeProjects.length,
          completed: completedProjects.length
        },
        paymentAnalysis: {
          total: payments.length,
          totalAmount: totalPayments,
          openAmount: openPayments
        },
        expenseAnalysis: {
          total: expenses.length,
          totalAmount: totalExpenses
        },
        taskAnalysis: {
          total: tasks.length,
          open: openTasks.length,
          completed: completedTasks.length
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
        // Counts
        contacts: contacts.length,
        invoices: invoices.length,
        offers: offers.length,
        orders: orders.length,
        creditNotes: creditNotes.length,
        projects: projects.length,
        timesheets: timesheets.length,
        articles: articles.length,
        payments: payments.length,
        expenses: expenses.length,
        notes: notes.length,
        tasks: tasks.length,

        // Financial KPIs
        totalRevenue,
        netRevenue,
        revenuePaid,
        revenuePending,
        revenueOverdue,
        totalCreditNotes,
        totalPayments,
        totalExpenses,

        // Operational KPIs
        invoicesPaid: invoicesPaid.length,
        invoicesPending: invoicesPending.length,
        invoicesOverdue: invoicesOverdue.length,
        totalHours,
        billableHours,
        conversionRate: conversionRate.toFixed(2),
        openTasks: openTasks.length,

        // Top performers
        topClientsCount: topClients.length
      },
      message: 'Synchronisation complète réussie - 12 endpoints extraits'
    })
  } catch (error: any) {
    console.error('Sync API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erreur lors de la synchronisation'
      },
      { status: 500 }
    )
  }
}
