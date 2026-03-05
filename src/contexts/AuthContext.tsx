import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/types'

type AppRole = Database['public']['Enums']['app_role']

interface AuthState {
  session: Session | null
  user: User | null
  role: AppRole | null
  loading: boolean
}

interface AuthContextValue extends AuthState {
  signUp: (email: string, password: string, role: 'tenant' | 'landlord') => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

async function fetchUserRole(userId: string): Promise<AppRole | null> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle()
  if (error || !data) return null
  return data.role
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    role: null,
    loading: true,
  })

  useEffect(() => {
    // Set up listener BEFORE getSession
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user ?? null
        let role: AppRole | null = null
        if (user) {
          // Use setTimeout to avoid Supabase deadlock
          setTimeout(async () => {
            role = await fetchUserRole(user.id)
            setState({ session, user, role, loading: false })
          }, 0)
          // Set immediately without role, then update
          setState(prev => ({ ...prev, session, user, loading: false }))
        } else {
          setState({ session: null, user: null, role: null, loading: false })
        }
      }
    )

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const user = session?.user ?? null
      let role: AppRole | null = null
      if (user) {
        role = await fetchUserRole(user.id)
      }
      setState({ session, user, role, loading: false })
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, role: 'tenant' | 'landlord') => {
    // Pass role in user metadata so the DB trigger picks it up
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role } },
    })
    if (error) throw error

    // Fallback: if trigger defaulted to tenant, immediately update own role.
    // RLS only allows tenant/landlord updates for the authenticated user.
    if (data.user && role === 'landlord') {
      const { error: roleError } = await supabase
        .from('user_roles')
        .update({ role: 'landlord' })
        .eq('user_id', data.user.id)
      if (roleError) throw roleError
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ ...state, signUp, signIn, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
