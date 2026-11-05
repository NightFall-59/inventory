import { useState } from 'react'
import { Button, Input, Typography } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import BottomNav from '../components/BottomNav'
import ProductRow from '../components/ProductRow'
import type { Navigate, Product } from '../types'

interface Props {
  products: Product[]
  go: Navigate
}

export default function InventoryScreen({ products, go }: Props) {
  const [query, setQuery] = useState('')
  const list = products.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <>
      <div className="screen">
        <div className="row">
          <Typography.Title level={4} style={{ margin: 0 }}>Inventory</Typography.Title>
          <Button type="text" aria-label="Add product" icon={<PlusOutlined />} onClick={() => go('add')} />
        </div>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search products"
          allowClear
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ margin: '12px 0' }}
        />
        <Typography.Text type="secondary">All products</Typography.Text>
        {list.length
          ? <div className="inventory-list">{list.map((p) => <ProductRow key={p.id} product={p} onClick={(id) => go('details', id)} />)}</div>
          : <Typography.Text type="secondary" style={{ padding: 12 }}>No products match your search.</Typography.Text>}
      </div>
      <BottomNav active="inventory" go={go} />
    </>
  )
}
