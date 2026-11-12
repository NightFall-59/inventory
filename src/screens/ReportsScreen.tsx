import { Typography } from 'antd'
import BottomNav from '../components/BottomNav'
import StatCard from '../components/StatCard'
import type { Navigate, Product } from '../types'
import { peso } from '../utils'

interface Props {
  products: Product[]
  go: Navigate
}

export default function ReportsScreen({ products, go }: Props) {
  const units = products.reduce((sum, p) => sum + p.qty, 0)
  const costValue = products.reduce((sum, p) => sum + p.cost * p.qty, 0)
  const retailValue = products.reduce((sum, p) => sum + p.price * p.qty, 0)

  return (
    <>
      <div className="screen">
        <div className="row report-heading">
          <Typography.Title level={4} style={{ margin: 0 }}>Inventory value</Typography.Title>
          <span className="live-badge"><span />Live</span>
        </div>
        <Typography.Text type="secondary" className="report-description">
          Calculated from current stock and unit prices. Updates automatically when inventory changes.
        </Typography.Text>
        <div className="grid2">
          <StatCard outlined label="Inventory at cost" value={peso(costValue)} note={`${products.length} products · ${units.toLocaleString()} units`} />
          <StatCard outlined label="Potential retail value" value={peso(retailValue)} note="If all current stock is sold" />
        </div>
        <section className="report-feed">
          <Typography.Title level={5} style={{ margin: 0 }}>Value by product</Typography.Title>
          {products.length ? products.map((product) => (
            <div className="report-product" key={product.id}>
              <div className="ico">{product.icon}</div>
              <div className="grow">
                <Typography.Text strong>{product.name}</Typography.Text>
                <div className="report-product-detail">
                  {product.qty.toLocaleString()} units × {peso(product.cost)} cost
                </div>
              </div>
              <Typography.Text strong>{peso(product.cost * product.qty)}</Typography.Text>
            </div>
          )) : (
            <Typography.Text type="secondary">Add products to see your inventory value.</Typography.Text>
          )}
        </section>
      </div>
      <BottomNav active="reports" go={go} />
    </>
  )
}
