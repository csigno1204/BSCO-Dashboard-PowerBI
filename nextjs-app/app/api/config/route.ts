import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { apiKey } = body

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API key is required' },
        { status: 400 }
      )
    }

    // Test the API key by making a simple request to Bexio
    try {
      const response = await axios.get('https://api.bexio.com/2.0/contact', {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        params: {
          limit: 1 // Just test with 1 contact
        }
      })

      if (response.status === 200) {
        return NextResponse.json({
          success: true,
          message: 'API key is valid'
        })
      } else {
        throw new Error('Invalid API key')
      }
    } catch (error: any) {
      console.error('Bexio API error:', error.response?.data || error.message)
      return NextResponse.json(
        {
          success: false,
          error: 'Clé API invalide ou erreur de connexion à Bexio'
        },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Config API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
