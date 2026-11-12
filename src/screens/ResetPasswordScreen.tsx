import { Button, Form, Input, Typography } from 'antd'
import type { Navigate } from '../types'

interface Props {
  go: Navigate
  onDone: (password: string) => Promise<string | null>
}

interface Values { password: string; confirm: string }

export default function ResetPasswordScreen({ go, onDone }: Props) {
  const [form] = Form.useForm<Values>()

  return (
    <div className="screen">
      <div className="auth-card">
        <Typography.Title level={4} style={{ textAlign: 'center' }}>Reset password</Typography.Title>
        <Form<Values>
          form={form}
          layout="vertical"
          onValuesChange={(changedValues) => {
            if ('password' in changedValues) form.setFields([{ name: 'password', errors: [] }])
          }}
          onFinish={async ({ password }) => {
            const error = await onDone(password)
            if (error) {
              form.setFields([{ name: 'password', errors: [error] }])
            } else {
              go('login')
            }
          }}
        >
          <Form.Item label="Password" name="password" rules={[{ required: true, min: 8, message: 'Use at least 8 characters' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirm password"
            name="confirm"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Confirm your password' },
              ({ getFieldValue }) => ({
                validator: (_, v: string) =>
                  !v || getFieldValue('password') === v ? Promise.resolve() : Promise.reject(new Error('Passwords do not match')),
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large">Reset password</Button>
        </Form>
      </div>
    </div>
  )
}
