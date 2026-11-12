import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import {
  getCurrentUser,
  resendSignUpCode,
  signIn as authenticate,
  signOut as endSession,
  signUp as register,
  subscribeToAuthChanges,
  verifySignUpCode,
} from '../auth'
import { INITIAL_PRODUCTS } from '../data/products'
import { loadAccountProducts } from '../data/accountProducts'
import type { Product, Screen, UserInfo } from '../types'
import { PASSWORD_POLICY_MESSAGE } from '../utils'

interface MessageApi {
  success(content: string): void
  error(content: string): void
}

interface Options {
  messageApi: MessageApi
  setScreen: Dispatch<SetStateAction<Screen>>
  setProducts: Dispatch<SetStateAction<Product[]>>
  setUser: Dispatch<SetStateAction<UserInfo>>
}

export default function useAuth({ messageApi, setScreen, setProducts, setUser }: Options) {
  const [signedInEmail, setSignedInEmail] = useState<string | null>(null)
  const [pendingSignUpEmail, setPendingSignUpEmail] = useState<string | null>(null)
  const [authReady, setAuthReady] = useState(false)

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
  }, [messageApi, setScreen])

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
  }, [authReady, messageApi, setProducts, setScreen, setUser, signedInEmail])

  const setAccount = (email: string, products: Product[]) => {
    setSignedInEmail(email)
    setProducts(products)
    setUser((currentUser) => ({ ...currentUser, name: email.split('@')[0] }))
  }

  const signIn = async (email: string, password: string) => {
    try {
      const authUser = await authenticate(email, password)
      if (!authUser) return 'invalid' as const

      const accountProducts = await loadAccountProducts()
      const accountEmail = authUser.email ?? email.trim().toLowerCase()
      setAccount(accountEmail, accountProducts)
      setScreen('dashboard')
      messageApi.success('Signed in')
      return 'signedIn' as const
    } catch (error) {
      messageApi.error(error instanceof Error ? error.message : 'Could not sign in. Please try again.')
      return 'error' as const
    }
  }

  const signUp = async (email: string, password: string): Promise<string | null> => {
    try {
      const result = await register(email, password)
      if (result.hasSession) {
        const accountProducts = await loadAccountProducts()
        const accountEmail = result.user.email ?? email.trim().toLowerCase()
        setAccount(accountEmail, accountProducts)
        setScreen('dashboard')
        messageApi.success('Account created')
        return null
      } else {
        const accountEmail = result.user.email ?? email.trim().toLowerCase()
        setPendingSignUpEmail(accountEmail)
        setScreen('verify')
        messageApi.success('We sent a verification code to your email.')
        return null
      }
    } catch (error) {
      if (error instanceof Error && /password/i.test(error.message)) return PASSWORD_POLICY_MESSAGE
      messageApi.error(error instanceof Error ? error.message : 'Could not create the account. Please try again.')
      return null
    }
  }

  const verifySignUp = async (token: string): Promise<string | null> => {
    if (!pendingSignUpEmail) {
      messageApi.error('Start sign-up again to request a verification code.')
      setScreen('signup')
      return null
    }

    try {
      const authUser = await verifySignUpCode(pendingSignUpEmail, token)
      const accountProducts = await loadAccountProducts()
      const accountEmail = authUser.email ?? pendingSignUpEmail
      setPendingSignUpEmail(null)
      setAccount(accountEmail, accountProducts)
      setScreen('dashboard')
      messageApi.success('Email verified. You are signed in.')
      return null
    } catch (error) {
      return error instanceof Error ? error.message : 'Could not verify the email code.'
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

  const signOut = async (): Promise<boolean> => {
    try {
      await endSession()
      setSignedInEmail(null)
      setScreen('login')
      return true
    } catch (error) {
      messageApi.error(error instanceof Error ? error.message : 'Could not sign out. Please try again.')
      return false
    }
  }

  return { signedInEmail, pendingSignUpEmail, signIn, signUp, verifySignUp, resendSignUp, signOut }
}
