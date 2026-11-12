import { useState } from 'react'
import { Button, Form, Input, InputNumber, Segmented, Select } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import ScreenHeader from '../components/ScreenHeader'
import type { Navigate, Product } from '../types'

interface Props {
  product: Product
  go: Navigate
  onConfirm: (id: number, delta: number) => Promise<boolean>
}

type Mode = 'Add stock' | 'Remove stock'

export default function StockAdjustmentScreen({ product, go, onConfirm }: Props) {
  const [mode, setMode] = useState<Mode>('Add stock')
  const [amount, setAmount] = useState(0)
  const delta = mode === 'Add stock' ? amount : -amount
  const after = Math.max(0, product.qty + delta)

  return (
    <div className="screen">
      <ScreenHeader title="Stock adjustment" onBack={() => go('details', product.id)} />
      <Segmented<Mode> block value={mode} onChange={setMode} options={['Add stock', 'Remove stock']} />
      <Form
        layout="vertical"
        className="form-fill"
        style={{ marginTop: 12 }}
        initialValues={{ reason: 'Restock' }}
        onFinish={async () => {
          if (await onConfirm(product.id, delta)) go('details', product.id)
        }}
      >
        <Form.Item label={`Quantity to ${mode === 'Add stock' ? 'add' : 'remove'}`}>
          <InputNumber min={0} value={amount} onChange={(v) => setAmount(v ?? 0)} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Reason" name="reason">
          <Select options={['Restock', 'Sold', 'Damaged', 'Correction'].map((value) => ({ value }))} />
        </Form.Item>
        <Form.Item label="Notes" name="notes">
          <Input.TextArea rows={2} />
        </Form.Item>
        <div className="preview">
          <span>{product.qty}</span>
          <span>→</span>
          <span>{after}</span>
        </div>
        <div className="pinned">
          <Button type="primary" htmlType="submit" block size="large" icon={<CheckOutlined />}>
            Confirm adjustment
          </Button>
        </div>
      </Form>
    </div>
  )
}
