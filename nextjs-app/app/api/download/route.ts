import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

// Get synced data from sync route
// In production, this would come from a database or Redis
let syncedData: any = null

export async function GET(request: NextRequest) {
  try {
    // In a real app, you'd fetch this from a database
    // For now, we'll need to pass it via request or use a shared store

    // Mock data if no sync has been done
    if (!syncedData || !syncedData.contacts) {
      // Return an error or empty file
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

// Helper to set synced data (called from sync route)
export function setSyncedData(data: any) {
  syncedData = data
}
