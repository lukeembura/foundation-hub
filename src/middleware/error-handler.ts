import { ApiError } from '@/services/api'

/**
 * Global error handler utility.
 * Use in catch blocks and React error boundaries.
 */
export function handleError(error: unknown): string {
  if (error instanceof ApiError) {
    console.error(`[ApiError] ${error.message}`, error.details)
    return error.message
  }

  if (error instanceof Error) {
    console.error(`[Error] ${error.message}`)
    return error.message
  }

  console.error('[Unknown Error]', error)
  return 'An unexpected error occurred'
}
