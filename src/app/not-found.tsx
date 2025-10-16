import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-4">
          Página não encontrada
        </h2>
        <p className="text-muted-foreground mb-8">
          A página que você está procurando não existe.
        </p>
        <Link 
          href="/dashboard"
          className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Voltar ao Dashboard
        </Link>
      </div>
    </div>
  )
}
