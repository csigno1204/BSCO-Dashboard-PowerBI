import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'
import archiver from 'archiver'
import { Readable, PassThrough } from 'stream'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'config'

    const publicDir = join(process.cwd(), 'public')

    if (type === 'powerquery' || type === 'pbit') {
      // Generate Power Query (.pq) file with M language scripts
      // This is a much simpler and more reliable approach than .pbit

      const powerQueryContent = `// ========================================
// BEXIO DASHBOARD - POWER QUERY TEMPLATE
// ========================================
//
// Instructions d'utilisation :
// 1. Synchronisez vos données Bexio et téléchargez le fichier Excel
// 2. Ouvrez Power BI Desktop
// 3. Cliquez sur "Obtenir les données" > "Requête vide"
// 4. Ouvrez l'Éditeur Avancé
// 5. Copiez-collez le contenu de ce fichier
// 6. Remplacez "CHEMIN_VERS_FICHIER" par le chemin de votre fichier Excel
//
// ========================================

// PARAMÈTRE : Chemin vers votre fichier Excel Bexio
let
    CheminFichier = "C:\\Users\\VotreNom\\Downloads\\bexio_complete_2025-01-01.xlsx",

    // Fonction pour charger une feuille Excel
    ChargerFeuille = (nomFeuille as text) as table =>
        let
            Source = Excel.Workbook(File.Contents(CheminFichier), null, true),
            Feuille = Source{[Item=nomFeuille,Kind="Sheet"]}[Data],
            EntêtesPromues = Table.PromoteHeaders(Feuille, [PromoteAllScalars=true])
        in
            EntêtesPromues,

    // Charger toutes les tables
    Contacts = ChargerFeuille("Contacts"),
    Factures = ChargerFeuille("Factures"),
    Offres = ChargerFeuille("Offres"),
    Commandes = ChargerFeuille("Commandes"),
    CreditNotes = ChargerFeuille("Notes de Crédit"),
    Projets = ChargerFeuille("Projets"),
    Temps = ChargerFeuille("Temps"),
    Articles = ChargerFeuille("Articles"),
    Paiements = ChargerFeuille("Paiements"),
    Dépenses = ChargerFeuille("Dépenses"),
    Notes = ChargerFeuille("Notes"),
    Tâches = ChargerFeuille("Tâches"),
    TopClients = ChargerFeuille("Top Clients"),
    Tendances = ChargerFeuille("Tendances"),
    AnalyseFactures = ChargerFeuille("Analyse Factures")
in
    Factures

// ========================================
// MESURES DAX À CRÉER MANUELLEMENT
// ========================================
//
// Une fois les tables importées, créez ces mesures dans Power BI :
//
// === MESURES FINANCIÈRES ===
//
// CA Total =
// SUM(Factures[Montant])
//
// CA Payé =
// CALCULATE(SUM(Factures[Montant]), Factures[Statut] = "Payée")
//
// CA En Attente =
// CALCULATE(SUM(Factures[Montant]), Factures[Statut] = "En attente")
//
// CA En Retard =
// CALCULATE(SUM(Factures[Montant]), Factures[Statut] = "En retard")
//
// Total Notes de Crédit =
// SUM('Notes de Crédit'[Montant])
//
// CA Net =
// [CA Total] - [Total Notes de Crédit]
//
// Total Paiements =
// SUM(Paiements[Montant])
//
// Total Dépenses =
// SUM(Dépenses[Montant])
//
// Marge Brute =
// [CA Net] - [Total Dépenses]
//
// % Marge =
// DIVIDE([Marge Brute], [CA Net], 0)
//
// === MESURES COMMERCIALES ===
//
// Valeur Offres =
// SUM(Offres[Montant])
//
// Taux Conversion =
// DIVIDE(
//     CALCULATE(COUNTROWS(Offres), Offres[Statut ID] = 8),
//     COUNTROWS(Offres),
//     0
// )
//
// Panier Moyen =
// DIVIDE([CA Total], DISTINCTCOUNT(Factures[contact_id]), 0)
//
// Nb Clients Actifs =
// DISTINCTCOUNT(Factures[contact_id])
//
// === MESURES OPÉRATIONNELLES ===
//
// Heures Totales =
// SUM(Temps[duration])
//
// Heures Facturables =
// CALCULATE(SUM(Temps[duration]), Temps[allowable_bill] = TRUE())
//
// Taux Facturation =
// DIVIDE([Heures Facturables], [Heures Totales], 0)
//
// Projets Actifs =
// CALCULATE(COUNTROWS(Projets), Projets[pr_state_id] IN {1, 2})
//
// Tâches Ouvertes =
// CALCULATE(COUNTROWS(Tâches), Tâches[Statut] IN {"Ouvert", "En cours"})
//
// ========================================
// RELATIONS À CRÉER
// ========================================
//
// Créez ces relations dans l'onglet "Modélisation" :
//
// 1. Factures[contact_id] → Contacts[id] (Many-to-One)
// 2. Offres[contact_id] → Contacts[id] (Many-to-One)
// 3. Commandes[contact_id] → Contacts[id] (Many-to-One)
// 4. Notes de Crédit[Client ID] → Contacts[id] (Many-to-One)
// 5. Projets[contact_id] → Contacts[id] (Many-to-One)
// 6. Paiements[Contact ID] → Contacts[id] (Many-to-One)
// 7. Dépenses[Fournisseur ID] → Contacts[id] (Many-to-One)
//
// ========================================
// FIN DU TEMPLATE
// ========================================
`

      return new NextResponse(powerQueryContent, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Disposition': 'attachment; filename="Bexio-PowerQuery-Template.pq"',
        },
      })
    }

    // Existing handlers for config, guide, both
    if (type === 'config') {
      const configPath = join(publicDir, 'powerbi-template-config.json')
      const configContent = readFileSync(configPath, 'utf-8')

      return new NextResponse(configContent, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': 'attachment; filename="bexio-powerbi-template-config.json"',
        },
      })
    } else if (type === 'guide') {
      const guidePath = join(publicDir, 'POWERBI_TEMPLATE_GUIDE.md')
      const guideContent = readFileSync(guidePath, 'utf-8')

      return new NextResponse(guideContent, {
        headers: {
          'Content-Type': 'text/markdown',
          'Content-Disposition': 'attachment; filename="POWERBI_TEMPLATE_GUIDE.md"',
        },
      })
    } else if (type === 'both') {
      const configPath = join(publicDir, 'powerbi-template-config.json')
      const guidePath = join(publicDir, 'POWERBI_TEMPLATE_GUIDE.md')

      const configContent = readFileSync(configPath, 'utf-8')
      const guideContent = readFileSync(guidePath, 'utf-8')

      const combinedContent = `# BEXIO POWER BI - PACK COMPLET

## 📋 GUIDE D'UTILISATION

${guideContent}

---

## 🔧 CONFIGURATION TECHNIQUE (JSON)

\`\`\`json
${configContent}
\`\`\`
`

      return new NextResponse(combinedContent, {
        headers: {
          'Content-Type': 'text/markdown',
          'Content-Disposition': 'attachment; filename="bexio-powerbi-complete-pack.md"',
        },
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid type parameter. Use: config, guide, both, or pbit' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('PowerBI Template API error:', error)
    return NextResponse.json(
      { success: false, error: 'Error downloading template: ' + error.message },
      { status: 500 }
    )
  }
}
