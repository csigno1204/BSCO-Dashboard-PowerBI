import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import AppProvider from '@/components/AppProvider'

export const metadata: Metadata = {
  title: 'Dashboard Bexio → Power BI',
  description: 'Synchronisez vos données Bexio vers Power BI en un clic',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <AppProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 bg-gray-50">
              {children}
            </main>
          </div>
        </AppProvider>
      </body>
    </html>
  )
}
