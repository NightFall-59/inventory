import { Button, Select, Typography } from 'antd'
import BottomNav from '../components/BottomNav'
import StatCard from '../components/StatCard'
import type { Navigate, Product, Report } from '../types'
import { peso } from '../utils'

interface Props {
  report: Report
  products: Product[]
  go: Navigate
}

const RANGES = ['Sep 30 – Oct 6, 2026', 'Sep 23 – Sep 29, 2026', 'Sep 16 – Sep 22, 2026'].map((value) => ({ value }))

export default function ReportsScreen({ report, products, go }: Props) {
  const units = products.reduce((sum, p) => sum + p.qty, 0)

  return (
    <>
      <div className="screen">
        <Typography.Title level={4} style={{ textAlign: 'center' }}>Reports</Typography.Title>
        <Select defaultValue={RANGES[0].value} options={RANGES} style={{ width: '100%', marginBottom: 12 }} />
        <div className="grid2">
          <StatCard outlined label="Inventory value" value={peso(report.value)} note={`${products.length} stock · ${units.toLocaleString()} units`} />
          <StatCard outlined label="Units sold" value={report.units} note="↑ 12% vs. last week" />
        </div>
        <div className="pinned">
          <Button block size="large" onClick={() => go('editReport')}>Edit report</Button>
        </div>
      </div>
      <BottomNav active="reports" go={go} />
    </>
  )
}
