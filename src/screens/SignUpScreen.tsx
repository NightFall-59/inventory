import { Button, Form, Input, Typography } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import type { Navigate } from '../types'

interface Props {
  go: Navigate
  onDone: (email: string, password: string) => Promise<string | null>
}

interface SignUpValues {
  email: string
  password: string
}

export default function SignUpScreen({ go, onDone }: Props) {
  const [form] = Form.useForm<SignUpValues>()

  return (
    <div className="screen" style={{ position: 'relative' }}>
      <Button
        type="text"
        aria-label="Back"
        icon={<ArrowLeftOutlined style={{ fontSize: 20, color: '#111827' }} />}
        onClick={() => go('login')}
        style={{
          position: 'absolute',
          top: 8,
          left: 8,
          minWidth: 0,
          padding: 0,
          height: 24,
          width: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 999,
          color: '#111827'
        }}
      />
      <div className="auth-card">
        <Typography.Title level={4} style={{ textAlign: 'center' }}>Sign up</Typography.Title>
        <Form<SignUpValues>
          form={form}
          layout="vertical"
          onValuesChange={(changedValues) => {
            if ('password' in changedValues) form.setFields([{ name: 'password', errors: [] }])
          }}
          onFinish={async ({ email, password }) => {
            const error = await onDone(email, password)
            if (error) form.setFields([{ name: 'password', errors: [error] }])
          }}
        >
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, min: 8, message: 'Use at least 8 characters' }]}>
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large">Sign up</Button>
        </Form>
      </div>
    </div>
  )
}
