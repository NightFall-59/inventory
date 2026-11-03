import { Tag } from 'antd'
import type { Product } from '../types'
import { stockLevel } from '../utils'

export default function StockTag({ product }: { product: Product }) {
  const { label, color } = stockLevel(product)
  return <Tag color={color} style={{ marginTop: 4 }}>{label}</Tag>
}
