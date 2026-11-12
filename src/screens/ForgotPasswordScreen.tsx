import { Button, Form, Input, Typography } from 'antd'
import type { Navigate } from '../types'

interface Props {
  go: Navigate
  onSubmit: (email: string) => Promise<void>
}

export default function ForgotPasswordScreen({ go, onSubmit }: Props) {
  return (
    <div className="screen">
      <div className="auth-card">
        <Typography.Title level={4} style={{ textAlign: 'center' }}>Forgot password</Typography.Title>
        <Form layout="vertical" onFinish={({ email }: { email: string }) => onSubmit(email)}>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}>
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large">Send reset link</Button>
        </Form>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <Button type="link" size="small" onClick={() => go('login')}>Back to sign in</Button>
        </div>
      </div>
    </div>
  )
}
