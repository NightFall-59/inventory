import type { ReactNode } from 'react'
import { Typography } from 'antd'

interface Props {
  label: string
  value: ReactNode
  note?: string
  outlined?: boolean
}

export default function StatCard({ label, value, note, outlined }: Props) {
  return (
    <div className={outlined ? 'stat-card' : 'stat'}>
      <Typography.Text type="secondary">{label}</Typography.Text>
      <Typography.Title level={3} style={{ margin: 0 }}>{value}</Typography.Title>
      {note && <Typography.Text type="secondary" style={{ fontSize: 11 }}>{note}</Typography.Text>}
    </div>
  )
}
