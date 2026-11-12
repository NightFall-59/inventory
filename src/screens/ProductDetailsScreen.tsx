import { Button, Popconfirm, Typography } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined, SlidersOutlined } from '@ant-design/icons'
import KeyValueRow from '../components/KeyValueRow'
import ScreenHeader from '../components/ScreenHeader'
import StockTag from '../components/StockTag'
import type { Navigate, Product } from '../types'
import { peso } from '../utils'

interface Props {
  product: Product
  go: Navigate
  onDelete: (productId: number) => Promise<boolean>
}

export default function ProductDetailsScreen({ product: p, go, onDelete }: Props) {
  return (
    <div className="screen">
      <ScreenHeader
        title="Product details"
        onBack={() => go('inventory')}
        extra={
          <>
            <Button type="text" aria-label="Edit product" icon={<EditOutlined />} onClick={() => go('edit', p.id)} />
            <Button type="text" aria-label="Add product" icon={<PlusOutlined />} onClick={() => go('add')} />
            <Popconfirm
              title="Delete this product?"
              description={`"${p.name}" will be removed from this account's inventory.`}
              okText="Delete"
              okButtonProps={{ danger: true }}
              cancelText="Cancel"
              onConfirm={async () => {
                if (await onDelete(p.id)) go('inventory')
              }}
            >
              <Button type="text" danger aria-label="Delete product" icon={<DeleteOutlined />} />
            </Popconfirm>
          </>
        }
      />
      <div className="center" style={{ margin: '14px 0' }}>
        <div className="logo">{p.icon}</div>
        <Typography.Title level={5} style={{ margin: 0 }}>{p.name}</Typography.Title>
        <StockTag product={p} />
      </div>
      <KeyValueRow label="Category" value={p.category} />
      <KeyValueRow label="Selling price" value={peso(p.price)} />
      <KeyValueRow label="Cost price" value={peso(p.cost)} />
      <KeyValueRow label="Profit per unit" value={peso(p.price - p.cost)} />
      <div className="pinned">
        <Button type="primary" block size="large" icon={<SlidersOutlined />} onClick={() => go('adjust', p.id)}>
          Adjust stock
        </Button>
      </div>
    </div>
  )
}
