import type { Navigate, Product, ProductFormValues, Report, Screen, UserInfo } from './types'
import SplashScreen from './screens/SplashScreen'
import LoginScreen from './screens/LoginScreen'
import SignUpScreen from './screens/SignUpScreen'
import VerifyEmailScreen from './screens/VerifyEmailScreen'
import ForgotPasswordScreen from './screens/ForgotPasswordScreen'
import ResetPasswordScreen from './screens/ResetPasswordScreen'
import DashboardScreen from './screens/DashboardScreen'
import InventoryScreen from './screens/InventoryScreen'
import ProductDetailsScreen from './screens/ProductDetailsScreen'
import StockAdjustmentScreen from './screens/StockAdjustmentScreen'
import ProductFormScreen from './screens/ProductFormScreen'
import ReportsScreen from './screens/ReportsScreen'
import EditReportScreen from './screens/EditReportScreen'
import SettingsScreen from './screens/SettingsScreen'
import EditInformationScreen from './screens/EditInformationScreen'

interface Props {
  screen: Screen
  go: Navigate
  signedInEmail: string | null
  pendingSignUpEmail: string | null
  products: Product[]
  selectedProduct?: Product
  report: Report
  user: UserInfo
  notifications: boolean
  onSignIn: (email: string, password: string) => Promise<'signedIn' | 'invalid' | 'error'>
  onSignUp: (email: string, password: string) => Promise<void>
  onVerify: (token: string) => Promise<string | null>
  onResendCode: () => Promise<void>
  onRequestPasswordReset: (email: string) => Promise<void>
  onResetPassword: (password: string) => Promise<boolean>
  onSignOut: () => void
  onToggleNotifications: (enabled: boolean) => void
  onAdjustStock: (id: number, delta: number) => Promise<boolean>
  onAddProduct: (values: ProductFormValues) => Promise<boolean>
  onSaveProduct: (values: ProductFormValues) => Promise<boolean>
  onDeleteProduct: (id: number) => Promise<boolean>
  onSaveReport: (report: Report) => void
  onSaveUser: (user: UserInfo) => void
}

export default function AppRoutes(props: Props) {
  const {
    screen, go, signedInEmail, pendingSignUpEmail, products, selectedProduct, report, user, notifications,
    onSignIn, onSignUp, onVerify, onResendCode, onRequestPasswordReset, onResetPassword, onSignOut,
    onToggleNotifications, onAdjustStock, onAddProduct, onSaveProduct, onDeleteProduct, onSaveReport, onSaveUser,
  } = props

  switch (screen) {
    case 'splash': return <SplashScreen />
    case 'login': return <LoginScreen go={go} onSignIn={onSignIn} />
    case 'signup': return <SignUpScreen go={go} onDone={onSignUp} />
    case 'verify':
      return pendingSignUpEmail
        ? <VerifyEmailScreen email={pendingSignUpEmail} go={go} onVerify={onVerify} onResend={onResendCode} />
        : <SignUpScreen go={go} onDone={onSignUp} />
    case 'forgot': return <ForgotPasswordScreen go={go} onSubmit={onRequestPasswordReset} />
    case 'reset': return <ResetPasswordScreen go={go} onDone={onResetPassword} />
    case 'dashboard': return <DashboardScreen products={products} go={go} />
    case 'inventory': return <InventoryScreen products={products} go={go} />
    case 'add': return <ProductFormScreen mode="add" go={go} onSubmit={onAddProduct} />
    case 'reports': return <ReportsScreen report={report} products={products} go={go} />
    case 'editReport': return <EditReportScreen report={report} go={go} onSave={onSaveReport} />
    case 'settings':
      return (
        <SettingsScreen
          email={signedInEmail ?? ''}
          user={user}
          notifications={notifications}
          onToggleNotifications={onToggleNotifications}
          onSignOut={onSignOut}
          go={go}
        />
      )
    case 'editInfo': return <EditInformationScreen user={user} go={go} onSave={onSaveUser} />
    case 'details':
    case 'adjust':
    case 'edit':
      if (!selectedProduct) return <InventoryScreen products={products} go={go} />
      if (screen === 'details') {
        return <ProductDetailsScreen product={selectedProduct} go={go} onDelete={onDeleteProduct} />
      }
      if (screen === 'adjust') {
        return <StockAdjustmentScreen product={selectedProduct} go={go} onConfirm={onAdjustStock} />
      }
      return <ProductFormScreen mode="edit" product={selectedProduct} go={go} onSubmit={onSaveProduct} />
  }
}
