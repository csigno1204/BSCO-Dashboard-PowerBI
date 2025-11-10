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

    // === SHEET 1: DASHBOARD (KPIs Summary) ===
    const dashboardData = [
      { 'Métrique': 'Date de synchronisation', 'Valeur': syncedData.timestamp },
      { 'Métrique': '', 'Valeur': '' },
      { 'Métrique': '=== DONNÉES EXTRAITES ===', 'Valeur': '' },
      { 'Métrique': 'Contacts', 'Valeur': syncedData.contacts?.length || 0 },
      { 'Métrique': 'Factures', 'Valeur': syncedData.invoices?.length || 0 },
      { 'Métrique': 'Offres', 'Valeur': syncedData.offers?.length || 0 },
      { 'Métrique': 'Commandes', 'Valeur': syncedData.orders?.length || 0 },
      { 'Métrique': 'Projets', 'Valeur': syncedData.projects?.length || 0 },
      { 'Métrique': 'Temps trackés', 'Valeur': syncedData.timesheets?.length || 0 },
      { 'Métrique': 'Articles', 'Valeur': syncedData.articles?.length || 0 },
      { 'Métrique': '', 'Valeur': '' },
      { 'Métrique': '=== ANALYSE FACTURES ===', 'Valeur': '' },
      { 'Métrique': 'Chiffre d\'affaires total', 'Valeur': syncedData.analytics?.invoiceAnalysis?.totalRevenue?.toFixed(2) || 0 },
      { 'Métrique': 'CA payé', 'Valeur': syncedData.analytics?.invoiceAnalysis?.revenuePaid?.toFixed(2) || 0 },
      { 'Métrique': 'CA en attente', 'Valeur': syncedData.analytics?.invoiceAnalysis?.revenuePending?.toFixed(2) || 0 },
      { 'Métrique': 'CA en retard', 'Valeur': syncedData.analytics?.invoiceAnalysis?.revenueOverdue?.toFixed(2) || 0 },
      { 'Métrique': 'Montant moyen facture', 'Valeur': syncedData.analytics?.invoiceAnalysis?.averageInvoice?.toFixed(2) || 0 },
      { 'Métrique': 'Factures payées', 'Valeur': syncedData.analytics?.invoiceAnalysis?.paid || 0 },
      { 'Métrique': 'Factures en attente', 'Valeur': syncedData.analytics?.invoiceAnalysis?.pending || 0 },
      { 'Métrique': 'Factures en retard', 'Valeur': syncedData.analytics?.invoiceAnalysis?.overdue || 0 },
      { 'Métrique': '', 'Valeur': '' },
      { 'Métrique': '=== ANALYSE OFFRES ===', 'Valeur': '' },
      { 'Métrique': 'Valeur totale offres', 'Valeur': syncedData.analytics?.offerAnalysis?.totalValue?.toFixed(2) || 0 },
      { 'Métrique': 'Offres acceptées', 'Valeur': syncedData.analytics?.offerAnalysis?.accepted || 0 },
      { 'Métrique': 'Offres en attente', 'Valeur': syncedData.analytics?.offerAnalysis?.pending || 0 },
      { 'Métrique': 'Taux de conversion (%)', 'Valeur': syncedData.analytics?.offerAnalysis?.conversionRate?.toFixed(2) || 0 },
      { 'Métrique': '', 'Valeur': '' },
      { 'Métrique': '=== ANALYSE TEMPS ===', 'Valeur': '' },
      { 'Métrique': 'Heures totales', 'Valeur': syncedData.analytics?.timeAnalysis?.totalHours?.toFixed(2) || 0 },
      { 'Métrique': 'Heures facturables', 'Valeur': syncedData.analytics?.timeAnalysis?.billableHours || 0 },
      { 'Métrique': 'Taux de facturation (%)', 'Valeur': syncedData.analytics?.timeAnalysis?.billabilityRate?.toFixed(2) || 0 },
      { 'Métrique': '', 'Valeur': '' },
      { 'Métrique': '=== ANALYSE PROJETS ===', 'Valeur': '' },
      { 'Métrique': 'Projets actifs', 'Valeur': syncedData.analytics?.projectAnalysis?.active || 0 },
      { 'Métrique': 'Projets terminés', 'Valeur': syncedData.analytics?.projectAnalysis?.completed || 0 },
    ]
    const dashboardSheet = XLSX.utils.json_to_sheet(dashboardData)
    XLSX.utils.book_append_sheet(workbook, dashboardSheet, 'Dashboard')

    // === SHEET 2: CONTACTS ===
    if (syncedData.contacts && syncedData.contacts.length > 0) {
      const contactsSheet = XLSX.utils.json_to_sheet(syncedData.contacts)
      XLSX.utils.book_append_sheet(workbook, contactsSheet, 'Contacts')
    }

    // === SHEET 3: FACTURES ===
    if (syncedData.invoices && syncedData.invoices.length > 0) {
      const invoicesSheet = XLSX.utils.json_to_sheet(syncedData.invoices)
      XLSX.utils.book_append_sheet(workbook, invoicesSheet, 'Factures')
    }

    // === SHEET 4: OFFRES ===
    if (syncedData.offers && syncedData.offers.length > 0) {
      const offersSheet = XLSX.utils.json_to_sheet(syncedData.offers)
      XLSX.utils.book_append_sheet(workbook, offersSheet, 'Offres')
    }

    // === SHEET 5: COMMANDES ===
    if (syncedData.orders && syncedData.orders.length > 0) {
      const ordersSheet = XLSX.utils.json_to_sheet(syncedData.orders)
      XLSX.utils.book_append_sheet(workbook, ordersSheet, 'Commandes')
    }

    // === SHEET 6: PROJETS ===
    if (syncedData.projects && syncedData.projects.length > 0) {
      const projectsSheet = XLSX.utils.json_to_sheet(syncedData.projects)
      XLSX.utils.book_append_sheet(workbook, projectsSheet, 'Projets')
    }

    // === SHEET 7: TEMPS TRACKÉS ===
    if (syncedData.timesheets && syncedData.timesheets.length > 0) {
      const timesheetsSheet = XLSX.utils.json_to_sheet(syncedData.timesheets)
      XLSX.utils.book_append_sheet(workbook, timesheetsSheet, 'Temps')
    }

    // === SHEET 8: ARTICLES ===
    if (syncedData.articles && syncedData.articles.length > 0) {
      const articlesSheet = XLSX.utils.json_to_sheet(syncedData.articles)
      XLSX.utils.book_append_sheet(workbook, articlesSheet, 'Articles')
    }

    // === SHEET 9: TOP CLIENTS ===
    if (syncedData.analytics?.topClients && syncedData.analytics.topClients.length > 0) {
      const topClientsData = syncedData.analytics.topClients.map((tc: any) => ({
        'ID Client': tc.contactId,
        'Nom': tc.contact?.name_1 || 'Inconnu',
        'Chiffre d\'affaires': tc.revenue?.toFixed(2) || 0,
        'Email': tc.contact?.mail || '',
        'Ville': tc.contact?.city || ''
      }))
      const topClientsSheet = XLSX.utils.json_to_sheet(topClientsData)
      XLSX.utils.book_append_sheet(workbook, topClientsSheet, 'Top Clients')
    }

    // === SHEET 10: TENDANCES MENSUELLES ===
    if (syncedData.analytics?.trends && syncedData.analytics.trends.length > 0) {
      const trendsData = syncedData.analytics.trends.map((t: any) => ({
        'Mois': t.month,
        'Chiffre d\'affaires': t.revenue?.toFixed(2) || 0
      }))
      const trendsSheet = XLSX.utils.json_to_sheet(trendsData)
      XLSX.utils.book_append_sheet(workbook, trendsSheet, 'Tendances')
    }

    // === SHEET 11: ANALYSE DÉTAILLÉE FACTURES ===
    if (syncedData.invoices && syncedData.invoices.length > 0) {
      const invoiceAnalysisData = syncedData.invoices.map((inv: any) => {
        const contact = syncedData.contacts?.find((c: any) => c.id === inv.contact_id)
        const isOverdue = inv.is_valid_until && new Date(inv.is_valid_until) < new Date() &&
                          (inv.kb_item_status_id !== 7 && inv.kb_item_status_id !== 9)
        const status = inv.kb_item_status_id === 7 ? 'Payée' :
                      inv.kb_item_status_id === 9 ? 'Part. payée' :
                      inv.kb_item_status_id === 5 || inv.kb_item_status_id === 6 ? 'En attente' :
                      isOverdue ? 'En retard' : 'Autre'

        return {
          'N° Facture': inv.document_nr,
          'Date': inv.is_valid_from,
          'Date échéance': inv.is_valid_until || '',
          'Client': contact?.name_1 || 'Inconnu',
          'Montant': inv.total || inv.total_gross || 0,
          'Statut': status,
          'ID Statut': inv.kb_item_status_id
        }
      })
      const invoiceAnalysisSheet = XLSX.utils.json_to_sheet(invoiceAnalysisData)
      XLSX.utils.book_append_sheet(workbook, invoiceAnalysisSheet, 'Analyse Factures')
    }

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    // Return as downloadable file
    const filename = `bexio_complete_${new Date().toISOString().split('T')[0]}.xlsx`

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
