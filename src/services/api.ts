import { supabase } from '@/integrations/supabase/client'

/**
 * Core API service layer for Hood.
 * All backend calls go through here for consistency and error handling.
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function invokeFunction<T = unknown>(
  functionName: string,
  options?: {
    method?: string
    body?: Record<string, unknown>
  },
): Promise<T> {
  const { data, error } = await supabase.functions.invoke(functionName, {
    method: (options?.method ?? 'POST') as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    body: options?.body,
  })

  if (error) {
    throw new ApiError(error.message, undefined, error)
  }

  return data as T
}

export async function healthCheck() {
  return invokeFunction<{
    status: string
    timestamp: string
    service: string
    version: string
  }>('health', { method: 'GET' })
}
