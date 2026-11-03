interface StoredAccount {
  email: string
  salt: string
  passwordHash: string
}

const ACCOUNTS_KEY = 'inventory-manager-accounts'
const SESSION_KEY = 'inventory-manager-session'
const PASSWORD_ITERATIONS = 120_000

function readAccounts(): StoredAccount[] {
  const stored = localStorage.getItem(ACCOUNTS_KEY)
  if (!stored) return []

  let accounts: unknown
  try {
    accounts = JSON.parse(stored)
  } catch {
    throw new Error('Saved accounts could not be read. Clear the browser account data and try again.')
  }

  if (
    !Array.isArray(accounts) ||
    !accounts.every((account): account is StoredAccount =>
      typeof account?.email === 'string' &&
      typeof account?.salt === 'string' &&
      typeof account?.passwordHash === 'string'
    )
  ) {
    throw new Error('Saved accounts are invalid. Clear the browser account data and try again.')
  }

  return accounts
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function fromHex(hex: string): Uint8Array {
  return Uint8Array.from(hex.match(/.{2}/g) ?? [], (byte) => Number.parseInt(byte, 16))
}

async function hashPassword(password: string, salt: Uint8Array): Promise<string> {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Secure sign-in is unavailable in this browser.')
  }

  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const saltBuffer = new ArrayBuffer(salt.byteLength)
  new Uint8Array(saltBuffer).set(salt)
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: saltBuffer, iterations: PASSWORD_ITERATIONS },
    key,
    256
  )

  return toHex(new Uint8Array(bits))
}

export async function createAccount(email: string, password: string): Promise<void> {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Secure sign-in is unavailable in this browser.')
  }

  const normalizedEmail = email.trim().toLowerCase()
  const accounts = readAccounts()
  if (accounts.some((account) => account.email === normalizedEmail)) {
    throw new Error('An account with this email already exists.')
  }

  const salt = crypto.getRandomValues(new Uint8Array(16))
  const account: StoredAccount = {
    email: normalizedEmail,
    salt: toHex(salt),
    passwordHash: await hashPassword(password, salt),
  }
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...accounts, account]))
}

export async function checkCredentials(email: string, password: string): Promise<string | null> {
  const normalizedEmail = email.trim().toLowerCase()
  const account = readAccounts().find((savedAccount) => savedAccount.email === normalizedEmail)
  if (!account) return null

  const passwordHash = await hashPassword(password, fromHex(account.salt))
  return passwordHash === account.passwordHash ? normalizedEmail : null
}

export function getSignedInEmail(): string | null {
  return localStorage.getItem(SESSION_KEY)
}

export function saveSignedInEmail(email: string): void {
  localStorage.setItem(SESSION_KEY, email)
}

export function clearSignedInEmail(): void {
  localStorage.removeItem(SESSION_KEY)
}
