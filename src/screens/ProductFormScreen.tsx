import { Button, Form, Input, InputNumber, Select } from 'antd'
import { CheckOutlined, PlusOutlined } from '@ant-design/icons'
import ScreenHeader from '../components/ScreenHeader'
import { CATEGORIES, SUPPLIERS } from '../data/products'
import type { Navigate, Product, ProductFormValues } from '../types'

interface Props {
  mode: 'add' | 'edit'
  product?: Product
  go: Navigate
  onSubmit: (values: ProductFormValues) => void
}

const categoryOptions = CATEGORIES.map((value) => ({ value }))
const supplierOptions = SUPPLIERS.map((value) => ({ value }))
const full = { width: '100%' }

export default function ProductFormScreen({ mode, product, go, onSubmit }: Props) {
  const editing = mode === 'edit' ? product : undefined
  const back = () => (editing ? go('details', editing.id) : go('inventory'))

  return (
    <div className="screen">
      <ScreenHeader title={editing ? 'Edit product' : 'Add product'} onBack={back} />
      {editing && (
        <div className="stat row" style={{ marginBottom: 12 }}>
          <span style={{ fontSize: 12 }}>{editing.qty} units on hand</span>
          <Button type="link" size="small" onClick={() => go('adjust', editing.id)}>Adjust stock</Button>
        </div>
      )}
      <Form<ProductFormValues>
        layout="vertical"
        className="form-fill"
        initialValues={editing ?? { category: CATEGORIES[0], supplier: SUPPLIERS[0] }}
        onFinish={(values) => { onSubmit(values); back() }}
      >
        <Form.Item label="Product name" name="name" rules={[{ required: true, message: 'Enter a product name' }]}>
          <Input />
        </Form.Item>
        <div className="grid2">
          <Form.Item label="SKU" name="sku"><Input /></Form.Item>
          <Form.Item label="Pack size" name="packSize"><Input /></Form.Item>
        </div>
        {editing ? (
          <div className="grid2">
            <Form.Item label="Variant" name="variant"><Input /></Form.Item>
            <Form.Item label="Category" name="category"><Select options={categoryOptions} /></Form.Item>
          </div>
        ) : (
          <Form.Item label="Category" name="category"><Select options={categoryOptions} /></Form.Item>
        )}
        <div className="grid2">
          <Form.Item label="Cost price (₱)" name="cost"><InputNumber min={0} style={full} /></Form.Item>
          <Form.Item label="Selling price (₱)" name="price"><InputNumber min={0} style={full} /></Form.Item>
        </div>
        {editing ? (
          <Form.Item label="Reorder threshold" name="reorderAt"><InputNumber min={0} style={full} /></Form.Item>
        ) : (
          <div className="grid2">
            <Form.Item label="Initial quantity" name="qty"><InputNumber min={0} style={full} /></Form.Item>
            <Form.Item label="Reorder threshold" name="reorderAt"><InputNumber min={0} style={full} /></Form.Item>
          </div>
        )}
        <Form.Item label="Supplier" name="supplier"><Select options={supplierOptions} /></Form.Item>
        <div className="pinned">
          <Button type="primary" htmlType="submit" block size="large" icon={editing ? <CheckOutlined /> : <PlusOutlined />}>
            {editing ? 'Save changes' : 'Add product'}
          </Button>
        </div>
      </Form>
    </div>
  )
}
