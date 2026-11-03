import { Button, Form, Input } from 'antd'
import ScreenHeader from '../components/ScreenHeader'
import type { Navigate, UserInfo } from '../types'

interface Props {
  user: UserInfo
  go: Navigate
  onSave: (user: UserInfo) => void
}

export default function EditInformationScreen({ user, go, onSave }: Props) {
  return (
    <div className="screen">
      <ScreenHeader title="Change information" onBack={() => go('settings')} />
      <Form<UserInfo> layout="vertical" className="form-fill" initialValues={user} onFinish={(v) => { onSave(v); go('settings') }}>
        <Form.Item label="Username" name="name" rules={[{ required: true, message: 'Enter a username' }]}><Input /></Form.Item>
        <Form.Item label="Store name" name="store"><Input /></Form.Item>
        <Form.Item label="Location" name="location"><Input /></Form.Item>
        <div className="pinned">
          <Button type="primary" htmlType="submit" block size="large">Save</Button>
        </div>
      </Form>
    </div>
  )
}
