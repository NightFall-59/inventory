import { useState } from 'react'
import { Button, Input, Typography } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import BottomNav from '../components/BottomNav'
import ProductRow from '../components/ProductRow'
import StatCard from '../components/StatCard'
import type { Navigate, Product } from '../types'
import { isLow } from '../utils'

interface Props {
  products: Product[]
  go: Navigate
}

export default function DashboardScreen({ products, go }: Props) {
  const [query, setQuery] = useState('')
  const search = query.trim().toLowerCase()
  const matches = search ? products.filter((p) => p.name.toLowerCase().includes(search)) : []
  const low = products.filter(isLow)
  const recent = products.filter((p) => !isLow(p)).slice(0, 2)
  const total = products.reduce((sum, p) => sum + p.qty, 0)
  const open = (id: number) => go('details', id)

  return (
    <>
      <div className="screen">
        <div className="dashboard-header">
          <Typography.Title level={4} style={{ textAlign: 'center', margin: 0 }}>Inventory Manager</Typography.Title>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search products"
            allowClear
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {search ? (
          <div className="dashboard-search-results">
            <Typography.Text type="secondary" style={{ display: 'block', marginTop: 12 }}>Search results</Typography.Text>
            {matches.length
              ? matches.map((p) => <ProductRow key={p.id} product={p} onClick={open} />)
              : <Typography.Text type="secondary" style={{ display: 'block', padding: 12 }}>No products match your search.</Typography.Text>}
          </div>
        ) : (
          <>
            <div className="grid2 dashboard-stats">
              <StatCard label="Total stock" value={total.toLocaleString()} note={`${products.length} products`} />
              <StatCard label="Low stock" value={low.length} />
            </div>
            <div className="dashboard-panels">
              <section className="dashboard-panel">
                <div className="row">
                  <Typography.Title level={5} style={{ margin: 0 }}>Low stock alerts</Typography.Title>
                  <Button type="link" size="small" onClick={() => go('inventory')}>View all</Button>
                </div>
                {low.length
                  ? low.map((p) => <ProductRow key={p.id} product={p} onClick={open} />)
                  : <Typography.Text type="secondary">Nothing is running low.</Typography.Text>}
              </section>
              <section className="dashboard-panel">
                <Typography.Title level={5} style={{ margin: 0 }}>Recent inventory</Typography.Title>
                {recent.map((p) => <ProductRow key={p.id} product={p} onClick={open} />)}
              </section>
            </div>
          </>
        )}
      </div>
      <BottomNav active="dashboard" go={go} />
    </>
  )
}
