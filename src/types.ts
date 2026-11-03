export interface Product {
  id: number
  name: string
  icon: string
  category: string
  sku: string
  packSize: string
  variant: string
  cost: number
  price: number
  qty: number
  reorderAt: number
  supplier: string
}

export type ProductFormValues = Partial<Omit<Product, 'id' | 'icon'>> & { name: string }

export interface Report {
  value: number
  units: number
}

export interface UserInfo {
  name: string
  store: string
  location: string
}

export type Screen =
  | 'splash' | 'login' | 'signup' | 'forgot' | 'reset'
  | 'dashboard' | 'inventory' | 'details' | 'adjust' | 'add' | 'edit'
  | 'reports' | 'editReport' | 'settings' | 'editInfo'

export type Navigate = (screen: Screen, productId?: number) => void
export type TabKey = 'dashboard' | 'inventory' | 'reports' | 'settings'
