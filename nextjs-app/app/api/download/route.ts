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
      { 'Métrique': 'Notes de crédit', 'Valeur': syncedData.creditNotes?.length || 0 },
      { 'Métrique': 'Projets', 'Valeur': syncedData.projects?.length || 0 },
      { 'Métrique': 'Temps trackés', 'Valeur': syncedData.timesheets?.length || 0 },
      { 'Métrique': 'Articles', 'Valeur': syncedData.articles?.length || 0 },
      { 'Métrique': 'Paiements', 'Valeur': syncedData.payments?.length || 0 },
      { 'Métrique': 'Dépenses', 'Valeur': syncedData.expenses?.length || 0 },
      { 'Métrique': 'Notes', 'Valeur': syncedData.notes?.length || 0 },
      { 'Métrique': 'Tâches', 'Valeur': syncedData.tasks?.length || 0 },
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
      { 'Métrique': '=== ANALYSE NOTES DE CRÉDIT ===', 'Valeur': '' },
      { 'Métrique': 'Total notes de crédit', 'Valeur': syncedData.analytics?.creditNoteAnalysis?.totalCreditNotes?.toFixed(2) || 0 },
      { 'Métrique': 'CA net (après NC)', 'Valeur': syncedData.analytics?.creditNoteAnalysis?.netRevenue?.toFixed(2) || 0 },
      { 'Métrique': '', 'Valeur': '' },
      { 'Métrique': '=== ANALYSE PAIEMENTS ===', 'Valeur': '' },
      { 'Métrique': 'Total paiements reçus', 'Valeur': syncedData.analytics?.paymentAnalysis?.totalPayments?.toFixed(2) || 0 },
      { 'Métrique': 'Paiements en attente', 'Valeur': syncedData.analytics?.paymentAnalysis?.openPayments?.toFixed(2) || 0 },
      { 'Métrique': '', 'Valeur': '' },
      { 'Métrique': '=== ANALYSE DÉPENSES ===', 'Valeur': '' },
      { 'Métrique': 'Total dépenses', 'Valeur': syncedData.analytics?.expenseAnalysis?.totalExpenses?.toFixed(2) || 0 },
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
      { 'Métrique': '', 'Valeur': '' },
      { 'Métrique': '=== ANALYSE TÂCHES ===', 'Valeur': '' },
      { 'Métrique': 'Tâches ouvertes', 'Valeur': syncedData.analytics?.taskAnalysis?.openTasks || 0 },
      { 'Métrique': 'Tâches terminées', 'Valeur': syncedData.analytics?.taskAnalysis?.completedTasks || 0 },
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

    // === SHEET 12: NOTES DE CRÉDIT ===
    if (syncedData.creditNotes && syncedData.creditNotes.length > 0) {
      const creditNotesData = syncedData.creditNotes.map((cn: any) => {
        const contact = syncedData.contacts?.find((c: any) => c.id === cn.contact_id)
        return {
          'N° Document': cn.document_nr || cn.id,
          'Date': cn.is_valid_from || cn.created_at,
          'Client ID': cn.contact_id,
          'Client': contact?.name_1 || 'Inconnu',
          'Montant': cn.total || cn.total_gross || 0,
          'Devise': cn.currency_code || 'CHF',
          'Statut ID': cn.kb_item_status_id,
          'Titre': cn.title || ''
        }
      })
      const creditNotesSheet = XLSX.utils.json_to_sheet(creditNotesData)
      XLSX.utils.book_append_sheet(workbook, creditNotesSheet, 'Notes de Crédit')
    }

    // === SHEET 13: PAIEMENTS ===
    if (syncedData.payments && syncedData.payments.length > 0) {
      const paymentsData = syncedData.payments.map((p: any) => ({
        'ID': p.id,
        'Date': p.date || p.created_at,
        'Montant': p.value || p.amount || 0,
        'Devise': p.currency_code || 'CHF',
        'En attente': p.is_open ? 'Oui' : 'Non',
        'Titre': p.title || '',
        'Type': p.kb_item_type || 'Autre',
        'Contact ID': p.contact_id || ''
      }))
      const paymentsSheet = XLSX.utils.json_to_sheet(paymentsData)
      XLSX.utils.book_append_sheet(workbook, paymentsSheet, 'Paiements')
    }

    // === SHEET 14: DÉPENSES ===
    if (syncedData.expenses && syncedData.expenses.length > 0) {
      const expensesData = syncedData.expenses.map((e: any) => ({
        'ID': e.id,
        'Date': e.date || e.created_at,
        'Montant': e.total || e.total_gross || 0,
        'Devise': e.currency_code || 'CHF',
        'Fournisseur ID': e.contact_id || '',
        'Description': e.title || e.text || '',
        'Catégorie': e.category || '',
        'Statut ID': e.kb_item_status_id
      }))
      const expensesSheet = XLSX.utils.json_to_sheet(expensesData)
      XLSX.utils.book_append_sheet(workbook, expensesSheet, 'Dépenses')
    }

    // === SHEET 15: NOTES / COMMUNICATIONS ===
    if (syncedData.notes && syncedData.notes.length > 0) {
      const notesData = syncedData.notes.map((n: any) => ({
        'ID': n.id,
        'Date': n.date || n.created_at,
        'Contact ID': n.contact_id || n.subject_id,
        'Sujet': n.subject || n.title || '',
        'Contenu': n.info || n.text || '',
        'Utilisateur ID': n.user_id || '',
        'Type': n.note_type || n.type || 'Note'
      }))
      const notesSheet = XLSX.utils.json_to_sheet(notesData)
      XLSX.utils.book_append_sheet(workbook, notesSheet, 'Notes')
    }

    // === SHEET 16: TÂCHES ===
    if (syncedData.tasks && syncedData.tasks.length > 0) {
      const tasksData = syncedData.tasks.map((t: any) => {
        const statusLabel = t.status === 1 ? 'Ouvert' :
                           t.status === 2 ? 'En cours' :
                           t.status === 3 ? 'Terminé' : 'Autre'
        return {
          'ID': t.id,
          'Date création': t.created_at,
          'Date échéance': t.finish_date || t.due_date || '',
          'Titre': t.subject || t.title || '',
          'Description': t.info || t.text || '',
          'Statut': statusLabel,
          'Statut ID': t.status,
          'Utilisateur ID': t.user_id || '',
          'Contact ID': t.contact_id || t.subject_id || ''
        }
      })
      const tasksSheet = XLSX.utils.json_to_sheet(tasksData)
      XLSX.utils.book_append_sheet(workbook, tasksSheet, 'Tâches')
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
