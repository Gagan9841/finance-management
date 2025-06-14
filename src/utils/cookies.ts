import type { CookieOptions } from '@/types/cookiesType'
import encryption from './encryption'

class Cookies {
  private readonly defaultOptions: CookieOptions = {
    path: '/',
    secure: true,
    sameSite: 'Strict',
  }

  /**
   * Set a cookie
   * @param name - Cookie name
   * @param value - Cookie value
   * @param options - Cookie options
   */
  set<T>(name: string, value: T, options: CookieOptions = {}): void {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value)
    const expires = options.expires ? `; expires=${new Date(options.expires).toUTCString()}` : ''
    const path = `; path=${options.path ?? this.defaultOptions.path}`
    const domain = options.domain ? `; domain=${options.domain}` : ''
    const secure = (options.secure ?? this.defaultOptions.secure) ? '; secure' : ''
    const sameSite = options.sameSite ?? this.defaultOptions.sameSite
    const sameSiteStr = sameSite ? `; samesite=${sameSite}` : ''
    const httpOnly = options.httpOnly ? '; httponly' : ''

    document.cookie = `${name}=${encodeURIComponent(stringValue)}${expires}${path}${domain}${secure}${sameSiteStr}${httpOnly}`
  }

  /**
   * Set an encrypted cookie
   * @param name - Cookie name
   * @param value - Cookie value
   * @param options - Cookie options
   */
  setEncrypted<T>(name: string, value: T, options: CookieOptions = {}): void {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value)
      const encryptedValue = encryption.encrypt(stringValue)
      this.set(name, encryptedValue, options)
    } catch (error) {
      console.error('Failed to encrypt and set cookie:', error)
      throw new Error('Failed to set encrypted cookie')
    }
  }

  /**
   * Get a cookie value
   * @param name - Cookie name
   * @returns Cookie value or null if not found
   */
  get<T>(name: string): T | null {
    const cookies = document.cookie.split(';')
    const cookie = cookies.find((c) => c.trim().startsWith(`${name}=`))

    if (!cookie) {
      return null
    }

    // Handle cookie values that might contain '=' characters
    const cookieParts = cookie.trim().split('=')
    const value = decodeURIComponent(cookieParts.slice(1).join('='))

    // Return empty string if value is empty
    if (value === '') {
      return '' as T
    }

    try {
      return JSON.parse(value) as T
    } catch {
      return value as T
    }
  }

  /**
   * Get and decrypt a cookie value
   * @param name - Cookie name
   * @returns Decrypted cookie value or null if not found
   */
  getEncrypted<T>(name: string): T | null {
    const encryptedValue = this.get<string>(name)
    if (!encryptedValue) {
      return null
    }

    try {
      const decryptedValue = encryption.decrypt(encryptedValue)

      // Return empty string if decrypted value is empty
      if (decryptedValue === '') {
        return '' as T
      }

      try {
        return JSON.parse(decryptedValue) as T
      } catch {
        return decryptedValue as T
      }
    } catch (error) {
      console.error('Failed to decrypt cookie:', error)
      // Optionally remove the corrupted cookie
      this.remove(name)
      return null
    }
  }

  /**
   * Remove a cookie
   * @param name - Cookie name
   * @param options - Cookie options (path and domain should match the original cookie)
   */
  remove(name: string, options: CookieOptions = {}): void {
    this.set(name, '', {
      ...options,
      expires: new Date(0),
    })
  }

  /**
   * Check if a cookie exists
   * @param name - Cookie name
   * @returns True if cookie exists
   */
  has(name: string): boolean {
    return this.get(name) !== null
  }

  /**
   * Get all cookies
   * @returns Object containing all cookies
   */
  getAll(): Record<string, string> {
    const cookies: Record<string, string> = {}

    if (!document.cookie) {
      return cookies
    }

    document.cookie.split(';').forEach((cookie) => {
      const trimmedCookie = cookie.trim()
      if (!trimmedCookie) return

      const equalIndex = trimmedCookie.indexOf('=')
      if (equalIndex === -1) return

      const name = trimmedCookie.substring(0, equalIndex)
      const value = trimmedCookie.substring(equalIndex + 1)

      if (name) {
        cookies[name] = decodeURIComponent(value)
      }
    })

    return cookies
  }

  /**
   * Clear all cookies (best effort - can only clear cookies with default path)
   * @param options - Options to apply when clearing (mainly for path/domain)
   */
  clearAll(options: CookieOptions = {}): void {
    const allCookies = this.getAll()
    Object.keys(allCookies).forEach((name) => {
      this.remove(name, options)
    })
  }
}

const cookies = new Cookies()

export default cookies
