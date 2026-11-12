import { INITIAL_PRODUCTS } from './products'
import type { Product } from '../types'
import { getSupabaseClient } from '../lib/supabase'

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

export async function loadAccountProducts(): Promise<Product[]> {
  const { data, error } = await getSupabaseClient().rpc('get_my_products')
  if (error) throw error

  if (!Array.isArray(data) || !data.every(isProduct)) {
    throw new Error('Saved inventory is invalid. Check the Supabase account_products schema.')
  }

  return data.length === 0 ? INITIAL_PRODUCTS.map((product) => ({ ...product })) : data
}

export async function saveAccountProducts(products: Product[]): Promise<void> {
  const { error } = await getSupabaseClient().rpc('save_my_products', { p_products: products })
  if (error) throw error
}
