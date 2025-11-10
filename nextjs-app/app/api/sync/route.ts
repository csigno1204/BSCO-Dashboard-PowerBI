import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { setSyncedData } from '@/lib/dataStore'

interface BexioContact {
  id: number
  name_1: string
  name_2?: string
  mail?: string
  phone_fixed?: string
}

interface BexioInvoice {
  id: number
  document_nr: string
  total: number
  total_gross: number
  currency_id: number
  is_valid_from: string
}

interface BexioProject {
  id: number
  name: string
  pr_state_id: number
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

    // Extract contacts
    const contactsResponse = await axios.get<BexioContact[]>('https://api.bexio.com/2.0/contact', {
      headers,
      params: { limit: 1000 }
    })
    const contacts = contactsResponse.data || []

    // Extract invoices
    const invoicesResponse = await axios.get<BexioInvoice[]>('https://api.bexio.com/2.0/kb_invoice', {
      headers,
      params: { limit: 1000 }
    })
    const invoices = invoicesResponse.data || []

    // Extract projects
    let projects: BexioProject[] = []
    try {
      const projectsResponse = await axios.get<BexioProject[]>('https://api.bexio.com/2.0/pr_project', {
        headers,
        params: { limit: 1000 }
      })
      projects = projectsResponse.data || []
    } catch (err) {
      console.log('Projects endpoint not available or no projects')
    }

    // Calculate total revenue
    const totalRevenue = invoices.reduce((sum, inv) => {
      return sum + (inv.total || inv.total_gross || 0)
    }, 0)

    // Store data using shared dataStore
    setSyncedData({
      contacts,
      invoices,
      projects,
      timestamp: new Date().toISOString()
    })

    // Return stats
    return NextResponse.json({
      success: true,
      stats: {
        contacts: contacts.length,
        invoices: invoices.length,
        projects: projects.length,
        totalRevenue: totalRevenue
      },
      message: 'Synchronisation terminée avec succès'
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
