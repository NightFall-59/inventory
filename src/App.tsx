import { useCallback, useState } from 'react'
import { message } from 'antd'
import { sendPasswordReset, updatePassword } from './auth'
import AppRoutes from './AppRoutes'
import PhoneFrame from './components/PhoneFrame'
import useAuth from './hooks/useAuth'
import useInventory from './hooks/useInventory'
import { INITIAL_USER } from './data/products'
import type { Navigate, Screen, UserInfo } from './types'
import { PASSWORD_POLICY_MESSAGE } from './utils'

const protectedScreens: Screen[] = [
  'dashboard', 'inventory', 'details', 'adjust', 'add', 'edit',
  'reports', 'settings', 'editInfo',
]

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash')
  const [user, setUser] = useState<UserInfo>(INITIAL_USER)
  const [notifications, setNotifications] = useState(true)
  const [messageApi, contextHolder] = message.useMessage()
  const inventory = useInventory(messageApi)
  const auth = useAuth({
    messageApi,
    setScreen,
    setProducts: inventory.setProducts,
    setUser,
  })

  const go: Navigate = useCallback((next, productId) => {
    if (!auth.signedInEmail && protectedScreens.includes(next)) {
      setScreen('login')
      return
    }
    if (productId !== undefined) inventory.setSelectedId(productId)
    setScreen(next)
  }, [auth.signedInEmail, inventory.setSelectedId])

  const requestPasswordReset = async (email: string) => {
    try {
      await sendPasswordReset(email)
      messageApi.success('Password reset link sent. Check your email.')
      setScreen('login')
    } catch (error) {
      messageApi.error(error instanceof Error ? error.message : 'Could not send the password reset link.')
    }
  }

  const resetPassword = async (password: string): Promise<string | null> => {
    try {
      await updatePassword(password)
      if (!await auth.signOut()) return 'Password updated, but sign-out failed. Please sign out and sign in again.'
      messageApi.success('Password updated. Sign in with your new password.')
      return null
    } catch (error) {
      if (error instanceof Error && /password/i.test(error.message)) return PASSWORD_POLICY_MESSAGE
      return error instanceof Error ? error.message : 'Could not update your password.'
    }
  }

  return (
    <PhoneFrame>
      {contextHolder}
      <AppRoutes
        screen={screen}
        go={go}
        signedInEmail={auth.signedInEmail}
        pendingSignUpEmail={auth.pendingSignUpEmail}
        products={inventory.products}
        selectedProduct={inventory.products.find((product) => product.id === inventory.selectedId)}
        user={user}
        notifications={notifications}
        onSignIn={auth.signIn}
        onSignUp={auth.signUp}
        onVerify={auth.verifySignUp}
        onResendCode={auth.resendSignUp}
        onRequestPasswordReset={requestPasswordReset}
        onResetPassword={resetPassword}
        onSignOut={auth.signOut}
        onToggleNotifications={setNotifications}
        onAdjustStock={(id, delta) => inventory.adjustStock(auth.signedInEmail, id, delta)}
        onAddProduct={(values) => inventory.addProduct(auth.signedInEmail, values)}
        onSaveProduct={(values) => inventory.saveProduct(auth.signedInEmail, values)}
        onDeleteProduct={(id) => inventory.deleteProduct(auth.signedInEmail, id)}
        onSaveUser={(nextUser) => {
          setUser(nextUser)
          messageApi.success('Information saved')
        }}
      />
    </PhoneFrame>
  )
}
