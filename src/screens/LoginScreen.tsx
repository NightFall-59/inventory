import { Alert, Button, Form, Input } from 'antd'
import Brand from '../components/Brand'
import type { Navigate } from '../types'

interface Props {
  go: Navigate
  onSignIn: (email: string, password: string) => Promise<void>
}

interface LoginValues {
  email: string
  password: string
}

export default function LoginScreen({ go, onSignIn }: Props) {
  return (
    <div className="screen">
      <div className="auth-card">
        <Alert
          message="Account not signed in"
          description="Sign in to access your inventory."
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Brand />
        <Form<LoginValues> layout="vertical" style={{ marginTop: 16 }} onFinish={({ email, password }) => onSignIn(email, password)}>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Enter your password' }]}>
            <Input.Password />
          </Form.Item>
          <div style={{ textAlign: 'right', marginBottom: 8 }}>
            <Button type="link" size="small" onClick={() => go('forgot')}>Forgot password?</Button>
          </div>
          <Button type="primary" htmlType="submit" block size="large">Sign in</Button>
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <Button type="link" size="small" onClick={() => go('signup')}>Sign up</Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
