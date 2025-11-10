import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { getSyncedData } from '@/lib/dataStore'

export async function GET(request: NextRequest) {
  try {
    // Get data from shared dataStore
    const syncedData = getSyncedData()

    // Check if data exists
    if (!syncedData || !syncedData.contacts) {
      return NextResponse.json(
        { success: false, error: 'Aucune donnée à exporter. Veuillez d\'abord synchroniser.' },
        { status: 404 }
      )
    }

    // Create workbook
    const workbook = XLSX.utils.book_new()

    // Add Contacts sheet
    if (syncedData.contacts && syncedData.contacts.length > 0) {
      const contactsSheet = XLSX.utils.json_to_sheet(syncedData.contacts)
      XLSX.utils.book_append_sheet(workbook, contactsSheet, 'Contacts')
    }

    // Add Invoices sheet
    if (syncedData.invoices && syncedData.invoices.length > 0) {
      const invoicesSheet = XLSX.utils.json_to_sheet(syncedData.invoices)
      XLSX.utils.book_append_sheet(workbook, invoicesSheet, 'Factures')
    }

    // Add Projects sheet
    if (syncedData.projects && syncedData.projects.length > 0) {
      const projectsSheet = XLSX.utils.json_to_sheet(syncedData.projects)
      XLSX.utils.book_append_sheet(workbook, projectsSheet, 'Projets')
    }

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    // Return as downloadable file
    const filename = `bexio_data_${new Date().toISOString().split('T')[0]}.xlsx`

    return new NextResponse(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error: any) {
    console.error('Download API error:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la génération du fichier Excel' },
      { status: 500 }
    )
  }
}
