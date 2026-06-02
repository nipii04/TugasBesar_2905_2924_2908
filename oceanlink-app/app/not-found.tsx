import Link from 'next/link'
import { Waves, AlertTriangle } from 'lucide-react'

export const metadata = {
  title: "404 - Page Not Found | OceanLink",
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-red-500/10 rounded-full border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <AlertTriangle className="w-16 h-16 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold text-white tracking-wider font-mono">404</h1>
        <h2 className="text-2xl font-bold text-zinc-300">Halaman Tidak Ditemukan</h2>
        <p className="text-zinc-500 max-w-md mx-auto font-mono text-sm">
          Error: Page Not Found. Halaman yang Anda cari mungkin telah dipindahkan atau tidak pernah ada di server kami.
        </p>
        
        <div className="pt-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-8 py-3 bg-purple-500 hover:bg-purple-400 text-white font-bold text-sm rounded-lg transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)]"
          >
            <Waves className="w-4 h-4" />
            RETURN TO BASE
          </Link>
        </div>
      </div>
    </div>
  )
}
