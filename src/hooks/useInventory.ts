import { useState } from 'react'
import type { Product, ProductFormValues } from '../types'
import { saveAccountProducts } from '../data/accountProducts'
import { INITIAL_PRODUCTS } from '../data/products'

interface MessageApi {
  success(content: string): void
  error(content: string): void
}

export default function useInventory(messageApi: MessageApi) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const updateProducts = async (
    email: string | null,
    update: (current: Product[]) => Product[]
  ): Promise<boolean> => {
    if (!email) {
      messageApi.error('Sign in before changing inventory.')
      return false
    }

    try {
      const nextProducts = update(products)
      await saveAccountProducts(nextProducts)
      setProducts(nextProducts)
      return true
    } catch (error) {
      messageApi.error(error instanceof Error ? error.message : 'Could not save this inventory change.')
      return false
    }
  }

  const adjustStock = async (email: string | null, id: number, delta: number) => {
    if (await updateProducts(email, (current) =>
      current.map((product) => product.id === id
        ? { ...product, qty: Math.max(0, product.qty + delta) }
        : product)
    )) {
      messageApi.success('Stock updated')
      return true
    }
    return false
  }

  const addProduct = async (email: string | null, values: ProductFormValues) => {
    const product: Product = {
      id: Date.now(), icon: '📦', name: values.name, category: values.category ?? '', sku: values.sku ?? '',
      packSize: values.packSize ?? '', variant: values.variant ?? '', cost: values.cost ?? 0, price: values.price ?? 0,
      qty: values.qty ?? 0, reorderAt: values.reorderAt ?? 0, supplier: values.supplier ?? '',
    }
    if (await updateProducts(email, (current) => [...current, product])) {
      messageApi.success('Product added')
      return true
    }
    return false
  }

  const saveProduct = async (email: string | null, values: ProductFormValues) => {
    if (await updateProducts(email, (current) =>
      current.map((product) => product.id === selectedId ? { ...product, ...values } : product)
    )) {
      messageApi.success('Changes saved')
      return true
    }
    return false
  }

  const deleteProduct = async (email: string | null, id: number) => {
    if (!await updateProducts(email, (current) => current.filter((product) => product.id !== id))) return false

    setSelectedId(null)
    messageApi.success('Product deleted')
    return true
  }

  return { products, setProducts, selectedId, setSelectedId, adjustStock, addProduct, saveProduct, deleteProduct }
}
