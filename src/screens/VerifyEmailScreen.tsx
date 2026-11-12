import { Button, Form, Input, Typography } from 'antd'
import type { Navigate } from '../types'

interface Props {
  email: string
  go: Navigate
  onVerify: (token: string) => Promise<void>
  onResend: () => Promise<void>
}

interface VerificationValues {
  token: string
}

export default function VerifyEmailScreen({ email, go, onVerify, onResend }: Props) {
  return (
    <div className="screen">
      <div className="auth-card">
        <Typography.Title level={4} style={{ textAlign: 'center' }}>Check your email</Typography.Title>
        <Typography.Paragraph style={{ textAlign: 'center' }}>
          Enter the 6-digit code sent to <strong>{email}</strong>.
        </Typography.Paragraph>
        <Form<VerificationValues>
          layout="vertical"
          onFinish={({ token }) => onVerify(token)}
        >
          <Form.Item
            label="Email verification code"
            name="token"
            rules={[
              { required: true, message: 'Enter the code from your email' },
              { pattern: /^\d{6}$/, message: 'Enter the 6-digit code' },
            ]}
          >
            <Input autoComplete="one-time-code" inputMode="numeric" maxLength={6} />
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
