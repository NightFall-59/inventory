import { Spin } from 'antd'
import Brand from '../components/Brand'

export default function SplashScreen() {
  return (
    <div className="screen center">
      <Brand />
      <Spin style={{ marginTop: 16 }} />
    </div>
  )
}
