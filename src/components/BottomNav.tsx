import type { ReactNode } from 'react'
import { AppstoreOutlined, BarChartOutlined, HomeOutlined, SettingOutlined } from '@ant-design/icons'
import type { Navigate, TabKey } from '../types'

const TABS: { key: TabKey; label: string; icon: ReactNode }[] = [
  { key: 'dashboard', label: 'Home', icon: <HomeOutlined /> },
  { key: 'inventory', label: 'Inventory', icon: <AppstoreOutlined /> },
  { key: 'reports', label: 'Reports', icon: <BarChartOutlined /> },
  { key: 'settings', label: 'Settings', icon: <SettingOutlined /> },
]

interface Props {
  active: TabKey
  go: Navigate
}

export default function BottomNav({ active, go }: Props) {
  return (
    <nav className="nav">
      {TABS.map((t) => (
        <button key={t.key} className={active === t.key ? 'on' : ''} onClick={() => go(t.key)}>
          {t.icon}
          {t.label}
        </button>
      ))}
    </nav>
  )
}
