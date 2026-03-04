import { ReactNode } from 'react'

interface AppLayoutProps {
  children: ReactNode
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">hood</h1>
          <span className="text-xs text-muted-foreground font-mono">v0.1.0 — infrastructure</span>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border px-6 py-3">
        <p className="text-xs text-muted-foreground text-center">Phase 0 — Infrastructure Only</p>
      </footer>
    </div>
  )
}

export default AppLayout
