import { Avatar, Button, Switch, Typography } from 'antd'
import { EditOutlined, LogoutOutlined } from '@ant-design/icons'
import BottomNav from '../components/BottomNav'
import KeyValueRow from '../components/KeyValueRow'
import type { Navigate, UserInfo } from '../types'

interface Props {
  email: string
  user: UserInfo
  notifications: boolean
  onToggleNotifications: (on: boolean) => void
  onSignOut: () => void
  go: Navigate
}

function getEmailInitials(email: string): string {
  const username = email.split('@')[0] ?? ''
  const parts = username.split(/[._-]+/).filter(Boolean)
  return parts.length > 1
    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    : username.slice(0, 2).toUpperCase()
}

export default function SettingsScreen({ email, user, notifications, onToggleNotifications, onSignOut, go }: Props) {
  return (
    <>
      <div className="screen">
        <Typography.Title level={4} style={{ textAlign: 'center' }}>Settings</Typography.Title>
        <div className="row">
          <div className="row">
            <Avatar style={{ background: '#eaf0ff', color: '#2f6bff', fontSize: 12 }}>{getEmailInitials(email)}</Avatar>
            <Typography.Text strong ellipsis style={{ maxWidth: 240 }}>{email}</Typography.Text>
          </div>
          <Button type="text" aria-label="Edit information" icon={<EditOutlined />} onClick={() => go('editInfo')} />
        </div>
        <Typography.Title level={5} style={{ marginTop: 20 }}>Store details</Typography.Title>
        <KeyValueRow label="Store name" value={user.store} />
        <KeyValueRow label="Location" value={user.location} />
        <Typography.Title level={5} style={{ marginTop: 20 }}>Inventory preferences</Typography.Title>
        <div className="row" style={{ padding: '10px 0' }}>
          <Typography.Text type="secondary">Low-stock notifications</Typography.Text>
          <Switch checked={notifications} onChange={onToggleNotifications} />
        </div>
        <div className="pinned">
          <Button block size="large" icon={<LogoutOutlined />} onClick={onSignOut}>Sign out</Button>
        </div>
      </div>
      <BottomNav active="settings" go={go} />
    </>
  )
}
