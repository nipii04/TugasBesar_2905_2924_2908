import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OceanLink Logistics',
  description: 'Global Maritime Solutions',
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
