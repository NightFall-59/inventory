import { Typography } from 'antd'
import type { Product } from '../types'
import { peso } from '../utils'
import StockTag from './StockTag'

interface Props {
  product: Product
  onClick: (id: number) => void
}

export default function ProductRow({ product, onClick }: Props) {
  return (
    <div className="item" onClick={() => onClick(product.id)}>
      <div className="ico">{product.icon}</div>
      <div className="grow">
        <Typography.Text strong>{product.name}</Typography.Text>
        <br />
        <StockTag product={product} />
      </div>
      <div style={{ textAlign: 'right' }}>
        <Typography.Text strong>{peso(product.price)}</Typography.Text>
        <div style={{ fontSize: 12, color: '#7b8497' }}>{product.qty} units</div>
      </div>
    </div>
  )
}
