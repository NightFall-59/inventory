import { useState } from 'react'
import { Alert, Button, Form, Input } from 'antd'
import Brand from '../components/Brand'
import type { Navigate } from '../types'

interface Props {
  go: Navigate
  onSignIn: (email: string, password: string) => Promise<'signedIn' | 'invalid' | 'error'>
}

interface LoginValues {
  email: string
  password: string
}

export default function LoginScreen({ go, onSignIn }: Props) {
  const [signInFailed, setSignInFailed] = useState(false)

  return (
    <div className="screen">
      <div className="auth-card">
        {signInFailed && (
          <Alert
            message="Account not signed in"
            description="Email or password is incorrect."
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        <Brand />
        <Form<LoginValues>
          layout="vertical"
          style={{ marginTop: 16 }}
          onValuesChange={() => setSignInFailed(false)}
          onFinish={async ({ email, password }) => setSignInFailed(await onSignIn(email, password) === 'invalid')}
        >
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
