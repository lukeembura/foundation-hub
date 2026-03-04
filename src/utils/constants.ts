/**
 * App-wide constants for Hood.
 */

export const APP_NAME = 'hood'
export const APP_VERSION = '0.1.0'
export const ROLES = ['tenant', 'landlord', 'admin'] as const
export type AppRole = (typeof ROLES)[number]
