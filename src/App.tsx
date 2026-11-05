import { useCallback, useEffect, useState } from 'react'
import { message } from 'antd'
import { checkCredentials, clearSignedInEmail, createAccount, getSignedInEmail, saveSignedInEmail } from './auth'
import PhoneFrame from './components/PhoneFrame'
import { INITIAL_PRODUCTS, INITIAL_REPORT, INITIAL_USER } from './data/products'
import { loadAccountProducts, saveAccountProducts } from './data/accountProducts'
import type { Navigate, Product, ProductFormValues, Report, Screen, UserInfo } from './types'
import SplashScreen from './screens/SplashScreen'
import LoginScreen from './screens/LoginScreen'
import SignUpScreen from './screens/SignUpScreen'
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

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash')
  const [signedInEmail, setSignedInEmail] = useState<string | null>(() => getSignedInEmail())
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)
  const [report, setReport] = useState<Report>(INITIAL_REPORT)
  const [user, setUser] = useState<UserInfo>(INITIAL_USER)
  const [notifications, setNotifications] = useState(true)
  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    if (signedInEmail) {
      try {
        setProducts(loadAccountProducts(signedInEmail))
      } catch (error) {
        messageApi.error(error instanceof Error ? error.message : 'Could not load this account’s inventory.')
        clearSignedInEmail()
        setSignedInEmail(null)
        setScreen('login')
        return
      }
    }

    const timer = setTimeout(() => setScreen(signedInEmail ? 'dashboard' : 'login'), 1200)
    return () => clearTimeout(timer)
  }, [signedInEmail])

  const go: Navigate = useCallback((next, productId) => {
    const protectedScreens: Screen[] = [
      'dashboard', 'inventory', 'details', 'adjust', 'add', 'edit',
      'reports', 'editReport', 'settings', 'editInfo',
    ]
    if (!signedInEmail && protectedScreens.includes(next)) {
      setScreen('login')
      return
    }
    if (productId !== undefined) setSelectedId(productId)
    setScreen(next)
  }, [signedInEmail])

  const signIn = async (email: string, password: string) => {
    try {
      const accountEmail = await checkCredentials(email, password)
      if (!accountEmail) {
        return 'invalid' as const
      }

      const accountProducts = loadAccountProducts(accountEmail)
      saveSignedInEmail(accountEmail)
      setSignedInEmail(accountEmail)
      setProducts(accountProducts)
      setUser((currentUser) => ({ ...currentUser, name: accountEmail.split('@')[0] }))
      setScreen('dashboard')
      messageApi.success('Signed in')
      return 'signedIn' as const
    } catch (error) {
      messageApi.error(error instanceof Error ? error.message : 'Could not sign in. Please try again.')
      return 'error' as const
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      await createAccount(email, password)
      messageApi.success('Account created. Sign in to continue.')
      setScreen('login')
    } catch (error) {
      messageApi.error(error instanceof Error ? error.message : 'Could not create the account. Please try again.')
    }
  }

  const signOut = () => {
    try {
      clearSignedInEmail()
      setSignedInEmail(null)
      setScreen('login')
    } catch (error) {
      messageApi.error(error instanceof Error ? error.message : 'Could not sign out. Please try again.')
    }
  }

  const selected = products.find((p) => p.id === selectedId)

  const updateProducts = (update: (current: Product[]) => Product[]) => {
    if (!signedInEmail) {
      messageApi.error('Sign in before changing inventory.')
      return false
    }

    try {
      const nextProducts = update(products)
      saveAccountProducts(signedInEmail, nextProducts)
      setProducts(nextProducts)
      return true
    } catch (error) {
      messageApi.error(error instanceof Error ? error.message : 'Could not save this inventory change.')
      return false
    }
  }

  const adjustStock = (id: number, delta: number) => {
    if (updateProducts((ps) => ps.map((p) => (p.id === id ? { ...p, qty: Math.max(0, p.qty + delta) } : p)))) {
      messageApi.success('Stock updated')
    }
  }

  const addProduct = (v: ProductFormValues) => {
    const product: Product = {
      id: Date.now(), icon: '📦', name: v.name, category: v.category ?? '', sku: v.sku ?? '',
      packSize: v.packSize ?? '', variant: v.variant ?? '', cost: v.cost ?? 0, price: v.price ?? 0,
      qty: v.qty ?? 0, reorderAt: v.reorderAt ?? 0, supplier: v.supplier ?? '',
    }
    if (updateProducts((ps) => [...ps, product])) messageApi.success('Product added')
  }

  const saveProduct = (v: ProductFormValues) => {
    if (updateProducts((ps) => ps.map((p) => (p.id === selectedId ? { ...p, ...v } : p)))) {
      messageApi.success('Changes saved')
    }
  }

  const deleteProduct = (id: number) => {
    if (!updateProducts((ps) => ps.filter((p) => p.id !== id))) return false

    setSelectedId(null)
    messageApi.success('Product deleted')
    return true
  }

  const renderScreen = () => {
    switch (screen) {
      case 'splash': return <SplashScreen />
      case 'login': return <LoginScreen go={go} onSignIn={signIn} />
      case 'signup': return <SignUpScreen go={go} onDone={signUp} />
      case 'forgot': return <ForgotPasswordScreen go={go} />
      case 'reset': return <ResetPasswordScreen go={go} onDone={() => messageApi.success('Password updated')} />
      case 'dashboard': return <DashboardScreen products={products} go={go} />
      case 'inventory': return <InventoryScreen products={products} go={go} />
      case 'add': return <ProductFormScreen mode="add" go={go} onSubmit={addProduct} />
      case 'reports': return <ReportsScreen report={report} products={products} go={go} />
      case 'editReport':
        return <EditReportScreen report={report} go={go} onSave={(r) => { setReport(r); messageApi.success('Report saved') }} />
      case 'settings':
        return <SettingsScreen email={signedInEmail ?? ''} user={user} notifications={notifications} onToggleNotifications={setNotifications} onSignOut={signOut} go={go} />
      case 'editInfo':
        return <EditInformationScreen user={user} go={go} onSave={(u) => { setUser(u); messageApi.success('Information saved') }} />
      case 'details':
      case 'adjust':
      case 'edit':
        if (!selected) return <InventoryScreen products={products} go={go} />
        if (screen === 'details') return <ProductDetailsScreen product={selected} go={go} onDelete={deleteProduct} />
        if (screen === 'adjust') return <StockAdjustmentScreen product={selected} go={go} onConfirm={adjustStock} />
        return <ProductFormScreen mode="edit" product={selected} go={go} onSubmit={saveProduct} />
    }
  }

  return (
    <PhoneFrame>
      {contextHolder}
      {renderScreen()}
    </PhoneFrame>
  )
}
