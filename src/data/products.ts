import type { Product, UserInfo } from '../types'

const supplier = 'Santos Wholesale Trading'

export const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: 'Argentina Corned Beef', icon: '🥫', category: 'Canned goods', sku: 'ACB-01', packSize: '150g', variant: 'Original', cost: 36, price: 42, qty: 6, reorderAt: 10, supplier },
  { id: 2, name: 'Bear Brand', icon: '🥛', category: 'Drinks', sku: 'BB-02', packSize: '33g', variant: 'Adult Plus', cost: 11, price: 14, qty: 4, reorderAt: 12, supplier },
  { id: 3, name: 'Coke', icon: '🥤', category: 'Drinks', sku: 'CK-03', packSize: '1L', variant: 'Regular', cost: 17, price: 20, qty: 58, reorderAt: 15, supplier },
  { id: 4, name: 'Datu Puti Soy Sauce', icon: '🍶', category: 'Condiments', sku: 'SS-04', packSize: '385ml', variant: 'Regular', cost: 15, price: 18, qty: 16, reorderAt: 10, supplier },
  { id: 5, name: 'Pancit Canton', icon: '🍜', category: 'Noodles', sku: 'PC-05', packSize: '60g', variant: 'Original', cost: 12, price: 15, qty: 8, reorderAt: 12, supplier },
]

export const CATEGORIES = ['Canned goods', 'Drinks', 'Noodles', 'Condiments', 'Snacks']
export const SUPPLIERS = [supplier]

export const INITIAL_USER: UserInfo = { name: 'R&K', store: 'Sunrise Marketing', location: 'Kidapawan City' }
