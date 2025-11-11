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

    if (type === 'pbit') {
      // Generate a real Power BI Template file (.pbit)
      // .pbit is a ZIP archive containing JSON files with Power BI schema

      // Create the DataModelSchema - defines tables, relationships, measures
      const dataModelSchema = {
        name: "Bexio Dashboard",
        compatibilityLevel: 1567,
        model: {
          culture: "fr-FR",
          dataAccessOptions: {
            legacyRedirects: true,
            returnErrorValuesAsNull: true
          },
          tables: [
            {
              name: "Contacts",
              columns: [
                { name: "id", dataType: "int64", sourceColumn: "id" },
                { name: "name_1", dataType: "string", sourceColumn: "name_1" },
                { name: "name_2", dataType: "string", sourceColumn: "name_2" },
                { name: "mail", dataType: "string", sourceColumn: "mail" },
                { name: "city", dataType: "string", sourceColumn: "city" },
                { name: "postcode", dataType: "string", sourceColumn: "postcode" },
                { name: "country_id", dataType: "int64", sourceColumn: "country_id" }
              ],
              partitions: [
                {
                  name: "Contacts",
                  mode: "import",
                  source: {
                    type: "m",
                    expression: [
                      'let',
                      '    Source = Excel.Workbook(File.Contents("CHEMIN_VERS_FICHIER.xlsx"), null, true),',
                      '    Contacts_Sheet = Source{[Item="Contacts",Kind="Sheet"]}[Data],',
                      '    #"Promoted Headers" = Table.PromoteHeaders(Contacts_Sheet, [PromoteAllScalars=true])',
                      'in',
                      '    #"Promoted Headers"'
                    ].join("\n")
                  }
                }
              ]
            },
            {
              name: "Factures",
              columns: [
                { name: "id", dataType: "int64", sourceColumn: "id" },
                { name: "document_nr", dataType: "string", sourceColumn: "document_nr" },
                { name: "contact_id", dataType: "int64", sourceColumn: "contact_id" },
                { name: "total", dataType: "double", sourceColumn: "total", formatString: "#,##0.00 CHF" },
                { name: "is_valid_from", dataType: "dateTime", sourceColumn: "is_valid_from" },
                { name: "kb_item_status_id", dataType: "int64", sourceColumn: "kb_item_status_id" },
                { name: "Statut", dataType: "string", sourceColumn: "Statut" },
                { name: "Montant", dataType: "double", sourceColumn: "Montant", formatString: "#,##0.00 CHF" }
              ],
              partitions: [
                {
                  name: "Factures",
                  mode: "import",
                  source: {
                    type: "m",
                    expression: [
                      'let',
                      '    Source = Excel.Workbook(File.Contents("CHEMIN_VERS_FICHIER.xlsx"), null, true),',
                      '    Factures_Sheet = Source{[Item="Factures",Kind="Sheet"]}[Data],',
                      '    #"Promoted Headers" = Table.PromoteHeaders(Factures_Sheet, [PromoteAllScalars=true])',
                      'in',
                      '    #"Promoted Headers"'
                    ].join("\n")
                  }
                }
              ]
            },
            {
              name: "Offres",
              columns: [
                { name: "id", dataType: "int64", sourceColumn: "id" },
                { name: "document_nr", dataType: "string", sourceColumn: "document_nr" },
                { name: "contact_id", dataType: "int64", sourceColumn: "contact_id" },
                { name: "total", dataType: "double", sourceColumn: "total", formatString: "#,##0.00 CHF" },
                { name: "kb_item_status_id", dataType: "int64", sourceColumn: "kb_item_status_id" },
                { name: "Montant", dataType: "double", sourceColumn: "Montant", formatString: "#,##0.00 CHF" }
              ],
              partitions: [
                {
                  name: "Offres",
                  mode: "import",
                  source: {
                    type: "m",
                    expression: [
                      'let',
                      '    Source = Excel.Workbook(File.Contents("CHEMIN_VERS_FICHIER.xlsx"), null, true),',
                      '    Offres_Sheet = Source{[Item="Offres",Kind="Sheet"]}[Data],',
                      '    #"Promoted Headers" = Table.PromoteHeaders(Offres_Sheet, [PromoteAllScalars=true])',
                      'in',
                      '    #"Promoted Headers"'
                    ].join("\n")
                  }
                }
              ]
            },
            {
              name: "Projets",
              columns: [
                { name: "id", dataType: "int64", sourceColumn: "id" },
                { name: "name", dataType: "string", sourceColumn: "name" },
                { name: "contact_id", dataType: "int64", sourceColumn: "contact_id" },
                { name: "pr_state_id", dataType: "int64", sourceColumn: "pr_state_id" }
              ],
              partitions: [
                {
                  name: "Projets",
                  mode: "import",
                  source: {
                    type: "m",
                    expression: [
                      'let',
                      '    Source = Excel.Workbook(File.Contents("CHEMIN_VERS_FICHIER.xlsx"), null, true),',
                      '    Projets_Sheet = Source{[Item="Projets",Kind="Sheet"]}[Data],',
                      '    #"Promoted Headers" = Table.PromoteHeaders(Projets_Sheet, [PromoteAllScalars=true])',
                      'in',
                      '    #"Promoted Headers"'
                    ].join("\n")
                  }
                }
              ]
            },
            {
              name: "_Mesures",
              columns: [],
              measures: [
                {
                  name: "CA Total",
                  expression: "SUM(Factures[Montant])",
                  formatString: "#,##0.00 CHF"
                },
                {
                  name: "CA Payé",
                  expression: 'CALCULATE(SUM(Factures[Montant]), Factures[Statut] = "Payée")',
                  formatString: "#,##0.00 CHF"
                },
                {
                  name: "CA En Attente",
                  expression: 'CALCULATE(SUM(Factures[Montant]), Factures[Statut] = "En attente")',
                  formatString: "#,##0.00 CHF"
                },
                {
                  name: "CA En Retard",
                  expression: 'CALCULATE(SUM(Factures[Montant]), Factures[Statut] = "En retard")',
                  formatString: "#,##0.00 CHF"
                },
                {
                  name: "Nb Factures",
                  expression: "COUNTROWS(Factures)",
                  formatString: "#,##0"
                },
                {
                  name: "Valeur Offres",
                  expression: "SUM(Offres[Montant])",
                  formatString: "#,##0.00 CHF"
                },
                {
                  name: "Nb Clients Actifs",
                  expression: "DISTINCTCOUNT(Factures[contact_id])",
                  formatString: "#,##0"
                },
                {
                  name: "Panier Moyen",
                  expression: "DIVIDE([CA Total], [Nb Clients Actifs], 0)",
                  formatString: "#,##0.00 CHF"
                }
              ],
              partitions: [
                {
                  name: "_Mesures",
                  mode: "import",
                  source: {
                    type: "calculated",
                    expression: "ROW(\"Dummy\", BLANK())"
                  }
                }
              ]
            }
          ],
          relationships: [
            {
              name: "Factures_Contacts",
              fromTable: "Factures",
              fromColumn: "contact_id",
              toTable: "Contacts",
              toColumn: "id",
              crossFilteringBehavior: "bothDirections"
            },
            {
              name: "Offres_Contacts",
              fromTable: "Offres",
              fromColumn: "contact_id",
              toTable: "Contacts",
              toColumn: "id",
              crossFilteringBehavior: "bothDirections"
            },
            {
              name: "Projets_Contacts",
              fromTable: "Projets",
              fromColumn: "contact_id",
              toTable: "Contacts",
              toColumn: "id",
              crossFilteringBehavior: "bothDirections"
            }
          ]
        }
      }

      // Create DiagramState - visual layout of data model
      const diagramState = {
        version: "1.0.0",
        diagramViewState: {
          tables: [
            { name: "Contacts", x: 100, y: 100, width: 200, height: 150 },
            { name: "Factures", x: 400, y: 100, width: 200, height: 200 },
            { name: "Offres", x: 400, y: 350, width: 200, height: 150 },
            { name: "Projets", x: 400, y: 550, width: 200, height: 150 },
            { name: "_Mesures", x: 700, y: 250, width: 200, height: 150 }
          ]
        }
      }

      // Create [Content_Types].xml
      const contentTypes = `<?xml version="1.0" encoding="utf-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="json" ContentType="application/json" />
  <Default Extension="xml" ContentType="application/xml" />
</Types>`

      // Create Metadata.xml
      const metadata = `<?xml version="1.0" encoding="utf-8"?>
<BismNormalizer xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <SourceCompatibilityLevel>1567</SourceCompatibilityLevel>
  <TargetCompatibilityLevel>1567</TargetCompatibilityLevel>
</BismNormalizer>`

      // Create Version file
      const version = "1.0.0"

      // Create Report Layout with basic structure
      const reportLayout = {
        id: "1",
        name: "Bexio Dashboard",
        sections: [
          {
            name: "Dashboard Principal",
            displayName: "📊 Dashboard Principal",
            ordinal: 0,
            visualContainers: []
          }
        ],
        config: JSON.stringify({
          themeCollection: {
            baseTheme: {
              name: "Bexio Professional",
              colors: {
                primary: "#6366F1",
                secondary: "#EC4899",
                accent: "#10B981"
              }
            }
          }
        })
      }

      // Create the .pbit file as a ZIP archive
      const passThrough = new PassThrough()
      const archive = archiver('zip', {
        zlib: { level: 9 }
      })

      archive.on('error', (err) => {
        throw err
      })

      archive.pipe(passThrough)

      // Add all files to the ZIP archive
      archive.append(JSON.stringify(dataModelSchema, null, 2), { name: 'DataModelSchema' })
      archive.append(JSON.stringify(diagramState, null, 2), { name: 'DiagramState' })
      archive.append(contentTypes, { name: '[Content_Types].xml' })
      archive.append(metadata, { name: 'Metadata/metadata.xml' })
      archive.append(version, { name: 'Version' })
      archive.append(JSON.stringify(reportLayout, null, 2), { name: 'Report/Layout' })

      archive.finalize()

      // Convert stream to buffer
      const chunks: Uint8Array[] = []
      for await (const chunk of passThrough) {
        chunks.push(chunk)
      }
      const buffer = Buffer.concat(chunks)

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': 'attachment; filename="Bexio-Dashboard-Template.pbit"',
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
