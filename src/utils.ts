import type { Product } from './types'

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
