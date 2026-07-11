import './globals.css'

export const metadata = {
  title: 'GrowEasy - AI CSV Importer',
  description: 'Intelligently extract CRM lead information from any valid CSV format.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
