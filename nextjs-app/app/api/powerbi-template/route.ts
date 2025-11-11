import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'config'

    const publicDir = join(process.cwd(), 'public')

    if (type === 'config') {
      // Download the JSON configuration file
      const configPath = join(publicDir, 'powerbi-template-config.json')
      const configContent = readFileSync(configPath, 'utf-8')

      return new NextResponse(configContent, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': 'attachment; filename="bexio-powerbi-template-config.json"',
        },
      })
    } else if (type === 'guide') {
      // Download the markdown guide
      const guidePath = join(publicDir, 'POWERBI_TEMPLATE_GUIDE.md')
      const guideContent = readFileSync(guidePath, 'utf-8')

      return new NextResponse(guideContent, {
        headers: {
          'Content-Type': 'text/markdown',
          'Content-Disposition': 'attachment; filename="POWERBI_TEMPLATE_GUIDE.md"',
        },
      })
    } else if (type === 'both') {
      // Create a combined text file with both
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
      { success: false, error: 'Invalid type parameter. Use: config, guide, or both' },
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
