import { useCallback, useEffect, useState } from 'react'
import { message } from 'antd'
import {
  getCurrentUser,
  resendSignUpCode,
  sendPasswordReset,
  signIn as authenticate,
  signOut as endSession,
  signUp as register,
  subscribeToAuthChanges,
  updatePassword,
  verifySignUpCode,
} from './auth'
import PhoneFrame from './components/PhoneFrame'
import { INITIAL_PRODUCTS, INITIAL_REPORT, INITIAL_USER } from './data/products'
import { loadAccountProducts, saveAccountProducts } from './data/accountProducts'
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

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash')
  const [signedInEmail, setSignedInEmail] = useState<string | null>(null)
  const [pendingSignUpEmail, setPendingSignUpEmail] = useState<string | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)
  const [report, setReport] = useState<Report>(INITIAL_REPORT)
  const [user, setUser] = useState<UserInfo>(INITIAL_USER)
  const [notifications, setNotifications] = useState(true)
  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    let active = true
    let unsubscribe = () => {}

    try {
      unsubscribe = subscribeToAuthChanges((authUser, event) => {
        setSignedInEmail(authUser?.email ?? null)
        if (event === 'PASSWORD_RECOVERY') setScreen('reset')
      })
    } catch (error) {
      messageApi.error(error instanceof Error ? error.message : 'Could not connect to Supabase.')
    }

    getCurrentUser()
      .then((authUser) => {
        if (!active) return
        setSignedInEmail(authUser?.email ?? null)
        setAuthReady(true)
      })
      .catch((error: unknown) => {
        if (!active) return
        messageApi.error(error instanceof Error ? error.message : 'Could not load your Supabase session.')
        setAuthReady(true)
        setScreen('login')
      })

    return () => {
      active = false
      unsubscribe()
    }
  }, [messageApi])

  useEffect(() => {
    if (!authReady) return
    if (!signedInEmail) {
      setProducts(INITIAL_PRODUCTS)
      setScreen((current) => current === 'splash' ? 'login' : current)
      return
    }

    let active = true
    loadAccountProducts()
      .then((accountProducts) => {
        if (!active) return
        setProducts(accountProducts)
        setUser((currentUser) => ({ ...currentUser, name: signedInEmail.split('@')[0] }))
        setScreen((current) => current === 'splash' || current === 'login' ? 'dashboard' : current)
      })
      .catch((error: unknown) => {
        if (!active) return
        messageApi.error(error instanceof Error ? error.message : 'Could not load this account’s inventory.')
        endSession().catch((signOutError: unknown) => {
          messageApi.error(signOutError instanceof Error ? signOutError.message : 'Could not sign out.')
        })
        setSignedInEmail(null)
        setScreen('login')
      })

    return () => {
      active = false
    }
  }, [authReady, signedInEmail, messageApi])

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
      const authUser = await authenticate(email, password)
      if (!authUser) return 'invalid' as const

      const accountProducts = await loadAccountProducts()
      const accountEmail = authUser.email ?? email.trim().toLowerCase()
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
      const result = await register(email, password)
      if (result.hasSession) {
        const accountProducts = await loadAccountProducts()
        const accountEmail = result.user.email ?? email.trim().toLowerCase()
        setSignedInEmail(accountEmail)
        setProducts(accountProducts)
        setUser((currentUser) => ({ ...currentUser, name: accountEmail.split('@')[0] }))
        setScreen('dashboard')
        messageApi.success('Account created')
      } else {
        const accountEmail = result.user.email ?? email.trim().toLowerCase()
        setPendingSignUpEmail(accountEmail)
        setScreen('verify')
        messageApi.success('We sent a verification code to your email.')
      }
    } catch (error) {
      messageApi.error(error instanceof Error ? error.message : 'Could not create the account. Please try again.')
    }
  }

  const verifySignUp = async (token: string) => {
    if (!pendingSignUpEmail) {
      messageApi.error('Start sign-up again to request a verification code.')
      setScreen('signup')
      return
    }

    try {
      const authUser = await verifySignUpCode(pendingSignUpEmail, token)
      const accountProducts = await loadAccountProducts()
      const accountEmail = authUser.email ?? pendingSignUpEmail
      setPendingSignUpEmail(null)
      setSignedInEmail(accountEmail)
      setProducts(accountProducts)
      setUser((currentUser) => ({ ...currentUser, name: accountEmail.split('@')[0] }))
      setScreen('dashboard')
      messageApi.success('Email verified. You are signed in.')
    } catch (error) {
      messageApi.error(error instanceof Error ? error.message : 'Could not verify the email code.')
    }
  }

  const resendSignUp = async () => {
    if (!pendingSignUpEmail) {
      messageApi.error('Start sign-up again to request a verification code.')
      setScreen('signup')
      return
    }

    try {
      await resendSignUpCode(pendingSignUpEmail)
      messageApi.success('A new verification code was sent.')
    } catch (error) {
      messageApi.error(error instanceof Error ? error.message : 'Could not resend the verification code.')
    }
  }

  const signOut = async () => {
    try {
      await endSession()
      setSignedInEmail(null)
      setScreen('login')
    } catch (error) {
      messageApi.error(error instanceof Error ? error.message : 'Could not sign out. Please try again.')
    }
  }

  const selected = products.find((p) => p.id === selectedId)

  const updateProducts = async (update: (current: Product[]) => Product[]): Promise<boolean> => {
    if (!signedInEmail) {
      messageApi.error('Sign in before changing inventory.')
      return false
    }

    try {
      const nextProducts = update(products)
      await saveAccountProducts(nextProducts)
      setProducts(nextProducts)
      return true
    } catch (error) {
      messageApi.error(error instanceof Error ? error.message : 'Could not save this inventory change.')
      return false
    }
  }

  const adjustStock = async (id: number, delta: number) => {
    if (await updateProducts((ps) => ps.map((p) => (p.id === id ? { ...p, qty: Math.max(0, p.qty + delta) } : p)))) {
      messageApi.success('Stock updated')
      return true
    }
    return false
  }

  const addProduct = async (v: ProductFormValues) => {
    const product: Product = {
      id: Date.now(), icon: '📦', name: v.name, category: v.category ?? '', sku: v.sku ?? '',
      packSize: v.packSize ?? '', variant: v.variant ?? '', cost: v.cost ?? 0, price: v.price ?? 0,
      qty: v.qty ?? 0, reorderAt: v.reorderAt ?? 0, supplier: v.supplier ?? '',
    }
    if (await updateProducts((ps) => [...ps, product])) {
      messageApi.success('Product added')
      return true
    }
    return false
  }

  const saveProduct = async (v: ProductFormValues) => {
    if (await updateProducts((ps) => ps.map((p) => (p.id === selectedId ? { ...p, ...v } : p)))) {
      messageApi.success('Changes saved')
      return true
    }
    return false
  }

  const deleteProduct = async (id: number) => {
    if (!await updateProducts((ps) => ps.filter((p) => p.id !== id))) return false

    setSelectedId(null)
    messageApi.success('Product deleted')
    return true
  }

  const renderScreen = () => {
    switch (screen) {
      case 'splash': return <SplashScreen />
      case 'login': return <LoginScreen go={go} onSignIn={signIn} />
      case 'signup': return <SignUpScreen go={go} onDone={signUp} />
      case 'verify':
        return pendingSignUpEmail
          ? <VerifyEmailScreen email={pendingSignUpEmail} go={go} onVerify={verifySignUp} onResend={resendSignUp} />
          : <SignUpScreen go={go} onDone={signUp} />
      case 'forgot':
        return <ForgotPasswordScreen go={go} onSubmit={async (email) => {
          try {
            await sendPasswordReset(email)
            messageApi.success('Password reset link sent. Check your email.')
            setScreen('login')
          } catch (error) {
            messageApi.error(error instanceof Error ? error.message : 'Could not send the password reset link.')
          }
        }} />
      case 'reset':
        return <ResetPasswordScreen go={go} onDone={async (password) => {
          try {
            await updatePassword(password)
            await endSession()
            setSignedInEmail(null)
            messageApi.success('Password updated. Sign in with your new password.')
            return true
          } catch (error) {
            messageApi.error(error instanceof Error ? error.message : 'Could not update your password.')
            return false
          }
        }} />
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
