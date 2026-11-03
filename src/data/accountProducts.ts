import { INITIAL_PRODUCTS } from './products'
import type { Product } from '../types'

const PRODUCT_STORAGE_PREFIX = 'inventory-manager-products:'

function storageKey(email: string): string {
  return `${PRODUCT_STORAGE_PREFIX}${encodeURIComponent(email.trim().toLowerCase())}`
}

function isProduct(value: unknown): value is Product {
  if (typeof value !== 'object' || value === null) return false

  const product = value as Record<string, unknown>
  return typeof product.id === 'number' &&
    typeof product.name === 'string' &&
    typeof product.icon === 'string' &&
    typeof product.category === 'string' &&
    typeof product.sku === 'string' &&
    typeof product.packSize === 'string' &&
    typeof product.variant === 'string' &&
    typeof product.cost === 'number' &&
    typeof product.price === 'number' &&
    typeof product.qty === 'number' &&
    typeof product.reorderAt === 'number' &&
    typeof product.supplier === 'string'
}

export function loadAccountProducts(email: string): Product[] {
  const stored = localStorage.getItem(storageKey(email))
  if (stored === null) return INITIAL_PRODUCTS.map((product) => ({ ...product }))

  let products: unknown
  try {
    products = JSON.parse(stored)
  } catch {
    throw new Error('Saved inventory could not be read. Clear this account’s saved inventory and try again.')
  }

  if (!Array.isArray(products) || !products.every(isProduct)) {
    throw new Error('Saved inventory is invalid. Clear this account’s saved inventory and try again.')
  }

  return products
}

export function saveAccountProducts(email: string, products: Product[]): void {
  localStorage.setItem(storageKey(email), JSON.stringify(products))
}
