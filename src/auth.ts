import { getSupabaseClient } from './lib/supabase'

export interface AuthUser {
  id: string
  email: string | null
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data, error } = await getSupabaseClient().auth.getSession()
  if (error) throw error
  const user = data.session?.user
  return user ? { id: user.id, email: user.email ?? null } : null
}

export function subscribeToAuthChanges(
  callback: (user: AuthUser | null, event: string) => void
): () => void {
  const { data } = getSupabaseClient().auth.onAuthStateChange((event, session) => {
    callback(
      session?.user ? { id: session.user.id, email: session.user.email ?? null } : null,
      event
    )
  })
  return () => data.subscription.unsubscribe()
}

export async function signIn(email: string, password: string): Promise<AuthUser | null> {
  const { data, error } = await getSupabaseClient().auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  })
  if (error) {
    if (error.code === 'invalid_credentials') return null
    throw error
  }
  return { id: data.user.id, email: data.user.email ?? null }
}

export async function signUp(email: string, password: string): Promise<{ user: AuthUser; hasSession: boolean }> {
  const { data, error } = await getSupabaseClient().auth.signUp({
    email: email.trim().toLowerCase(),
    password,
  })
  if (error) throw error
  if (!data.user) throw new Error('Supabase did not return a user after sign-up.')
  return {
    user: { id: data.user.id, email: data.user.email ?? null },
    hasSession: data.session !== null,
  }
}

export async function verifySignUpCode(email: string, token: string): Promise<AuthUser> {
  const { data, error } = await getSupabaseClient().auth.verifyOtp({
    email: email.trim().toLowerCase(),
    token: token.trim(),
    type: 'signup',
  })
  if (error) throw error
  if (!data.user) throw new Error('Supabase did not return a user after email verification.')
  return { id: data.user.id, email: data.user.email ?? null }
}

export async function resendSignUpCode(email: string): Promise<void> {
  const { error } = await getSupabaseClient().auth.resend({
    type: 'signup',
    email: email.trim().toLowerCase(),
  })
  if (error) throw error
}

export async function signOut(): Promise<void> {
  const { error } = await getSupabaseClient().auth.signOut()
  if (error) throw error
}

export async function sendPasswordReset(email: string): Promise<void> {
  const { error } = await getSupabaseClient().auth.resetPasswordForEmail(email.trim().toLowerCase(), {
    redirectTo: window.location.origin,
  })
  if (error) throw error
}

export async function updatePassword(password: string): Promise<void> {
  const { error } = await getSupabaseClient().auth.updateUser({ password })
  if (error) throw error
}
