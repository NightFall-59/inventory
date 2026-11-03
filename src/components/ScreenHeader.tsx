import type { ReactNode } from 'react'
import { Button, Typography } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

interface Props {
  title: string
  onBack: () => void
  extra?: ReactNode
}

export default function ScreenHeader({ title, onBack, extra }: Props) {
  return (
    <div className="row" style={{ marginBottom: 12 }}>
      <Button type="text" aria-label="Back" icon={<ArrowLeftOutlined />} onClick={onBack} />
      <Typography.Title level={5} style={{ margin: 0, flex: 1 }}>{title}</Typography.Title>
      {extra}
    </div>
  )
}
