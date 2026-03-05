import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AppLayout from '@/components/layout/AppLayout'

function TenantDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tenant Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Your rental hub — listings, applications, and messages coming soon.</p>
      </CardContent>
    </Card>
  )
}

function LandlordDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Landlord Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Manage your properties — listings, applications, and analytics coming soon.</p>
      </CardContent>
    </Card>
  )
}

function AdminDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Platform management — user oversight, moderation, and reports coming soon.</p>
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const { user, role, signOut, loading } = useAuth()

  if (loading || !role) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-muted-foreground animate-pulse">Loading dashboard…</p>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <span className="inline-block mt-1 rounded-full bg-secondary px-3 py-0.5 text-xs font-medium capitalize text-secondary-foreground">
              {role}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={signOut}>
            Sign out
          </Button>
        </div>

        {role === 'tenant' && <TenantDashboard />}
        {role === 'landlord' && <LandlordDashboard />}
        {role === 'admin' && <AdminDashboard />}
      </div>
    </AppLayout>
  )
}
