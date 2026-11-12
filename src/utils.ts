import type { Product } from './types'

const passwordSymbols = "!@#$%^&*()_+-=[]{};':\"\\|<>?,./~"

export const peso = (n: number): string =>
  '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export function passwordPolicyError(password: string): string | null {
  if (password.length < 8) return 'Use at least 8 characters'
  if (!/[a-z]/.test(password)) return 'Include at least one lowercase letter (a-z)'
  if (!/[A-Z]/.test(password)) return 'Include at least one uppercase letter (A-Z)'
  if (![...password].some((character) => passwordSymbols.includes(character))) return 'Include at least one symbol'
  return null
}

export type StockLevel = { label: string; color: 'success' | 'warning' | 'error' }

export const isLow = (p: Product): boolean => p.qty <= p.reorderAt

export const stockLevel = (p: Product): StockLevel =>
  p.qty <= 0
    ? { label: 'Out of stock', color: 'error' }
    : isLow(p)
      ? { label: 'Low stock', color: 'warning' }
      : { label: 'In stock', color: 'success' }
