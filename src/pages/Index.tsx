import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AppLayout from '@/components/layout/AppLayout'
import { healthCheck } from '@/services/api'
import { handleError } from '@/middleware/error-handler'

const Index = () => {
  const [healthStatus, setHealthStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const checkHealth = async () => {
    setLoading(true)
    setHealthStatus(null)
    try {
      const result = await healthCheck()
      setHealthStatus(JSON.stringify(result, null, 2))
    } catch (err) {
      setHealthStatus(`Error: ${handleError(err)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center flex-1 p-8 gap-8 min-h-[80vh]">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Phase 0 — Infrastructure</h2>
          <p className="text-muted-foreground">Database connected · Auth enabled · Edge functions ready</p>
        </div>

        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-sm font-mono">Health Check</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={checkHealth} disabled={loading} className="w-full">
              {loading ? 'Checking…' : 'Ping /health'}
            </Button>
            {healthStatus && (
              <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-48 font-mono">
                {healthStatus}
              </pre>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
          {['profiles', 'user_roles', 'listings', 'applications', 'messages'].map((table) => (
            <div key={table} className="px-4 py-2 rounded-md bg-muted text-muted-foreground font-mono">
              {table} ✓
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}

export default Index
