import { Button, Form, Input, Typography } from 'antd'
import type { Navigate } from '../types'

export default function ForgotPasswordScreen({ go }: { go: Navigate }) {
  return (
    <div className="screen">
      <div className="auth-card">
        <Typography.Title level={4} style={{ textAlign: 'center' }}>Forgot password</Typography.Title>
        <Form layout="vertical" onFinish={() => go('reset')}>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}>
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large">Send reset link</Button>
        </Form>
      </div>
    </div>
  )
}
