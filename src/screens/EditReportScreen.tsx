import { Button, Form, InputNumber } from 'antd'
import ScreenHeader from '../components/ScreenHeader'
import type { Navigate, Report } from '../types'

interface Props {
  report: Report
  go: Navigate
  onSave: (report: Report) => void
}

export default function EditReportScreen({ report, go, onSave }: Props) {
  return (
    <div className="screen">
      <ScreenHeader title="Edit report" onBack={() => go('reports')} />
      <Form<Report> layout="vertical" className="form-fill" initialValues={report} onFinish={(v) => { onSave(v); go('reports') }}>
        <Form.Item label="Inventory value" name="value" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Units sold" name="units" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <div className="pinned">
          <Button type="primary" htmlType="submit" block size="large">Save</Button>
        </div>
      </Form>
    </div>
  )
}
