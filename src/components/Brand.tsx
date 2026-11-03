import { Typography } from 'antd'
import { BoxPlotOutlined } from '@ant-design/icons'

export default function Brand() {
  return (
    <div className="center">
      <div className="logo"><BoxPlotOutlined /></div>
      <Typography.Title level={4} style={{ margin: 0 }}>Inventory Manager</Typography.Title>
    </div>
  )
}
