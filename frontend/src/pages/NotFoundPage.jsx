import { ArrowLeft, AlertTriangle, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button.jsx'
import { Card } from '../components/ui/Card.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

export function NotFoundPage() {
  useDocumentTitle('Tidak ditemukan')

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-lg p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-700 dark:text-primary-300">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Tautan yang Anda buka tidak tersedia atau sudah dipindahkan.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button onClick={() => window.location.assign('/')}>
            <Home className="h-4 w-4" />
            Kembali ke beranda
          </Button>
          <Button variant="secondary" onClick={() => window.location.assign('/login')}>
            <ArrowLeft className="h-4 w-4" />
            Ke login
          </Button>
        </div>
      </Card>
    </div>
  )
}
