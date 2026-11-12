import type { Product } from './types'

export const PASSWORD_POLICY_MESSAGE =
  'Password should contain at least one character of each: a-z, A-Z, numbers, symbols.'

export const peso = (n: number): string =>
  '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export type StockLevel = { label: string; color: 'success' | 'warning' | 'error' }

export const isLow = (p: Product): boolean => p.qty <= p.reorderAt

export const stockLevel = (p: Product): StockLevel =>
  p.qty <= 0
    ? { label: 'Out of stock', color: 'error' }
    : isLow(p)
      ? { label: 'Low stock', color: 'warning' }
      : { label: 'In stock', color: 'success' }
