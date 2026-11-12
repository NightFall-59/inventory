import { Button, Form, Input, Typography } from 'antd'
import type { Navigate } from '../types'

interface Props {
  email: string
  go: Navigate
  onVerify: (token: string) => Promise<string | null>
  onResend: () => Promise<void>
}

interface VerificationValues {
  token: string
}

export default function VerifyEmailScreen({ email, go, onVerify, onResend }: Props) {
  const [form] = Form.useForm<VerificationValues>()

  return (
    <div className="screen">
      <div className="auth-card">
        <Typography.Title level={4} style={{ textAlign: 'center' }}>Check your email</Typography.Title>
        <Typography.Paragraph style={{ textAlign: 'center' }}>
          Enter the verification code sent to <strong>{email}</strong>.
        </Typography.Paragraph>
        <Form<VerificationValues>
          form={form}
          layout="vertical"
          onValuesChange={(changedValues) => {
            if ('token' in changedValues) form.setFields([{ name: 'token', errors: [] }])
          }}
          onFinish={async ({ token }) => {
            const error = await onVerify(token)
            if (error) form.setFields([{ name: 'token', errors: [error] }])
          }}
        >
          <Form.Item
            label="Email verification code"
            name="token"
            rules={[
              { required: true, message: 'Enter the code from your email' },
              { pattern: /^(?:\d{6}|\d{8})$/, message: 'Enter the 6- or 8-digit code' },
            ]}
          >
            <Input autoComplete="one-time-code" inputMode="numeric" maxLength={8} />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large">Verify email</Button>
        </Form>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <Button type="link" size="small" onClick={onResend}>Resend code</Button>
          <Button type="link" size="small" onClick={() => go('signup')}>Use another email</Button>
        </div>
      </div>
    </div>
  )
}
