import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import encryption from '@/utils/encryption'
import cookies from '@/utils/cookies'
import type { User } from '@/types/user'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<User | null>(null)
    const token = ref<string | null>(null)
    const permissions = ref<string[]>([])

    const isAuthenticated = computed(() => !!token.value)

    const hasPermission = computed(
      () => (permission: string) => permissions.value.includes(permission),
    )
    const userFullName = computed(() => (user.value ? `${user.value.name}` : ''))

    const getUserInfo = async () => {
      return { user: user.value, permissions: permissions.value, token: token.value }
    }

    const setUser = (userData: User | null) => {
      user.value = userData
      if (userData) {
        cookies.setEncrypted('user', userData)
      } else {
        cookies.remove('user')
      }
    }

    const setToken = (newToken: string | null) => {
      token.value = newToken
      if (newToken) {
        cookies.setEncrypted('auth_token', newToken)
      } else {
        cookies.remove('auth_token')
      }
    }

    const setPermissions = (newPermissions: string[]) => {
      permissions.value = newPermissions
    }

    const logout = () => {
      setUser(null)
      setToken(null)
      setPermissions([])
      cookies.remove('auth_token')
    }

    const checkAuth = async () => {
      const storedToken = cookies.getEncrypted<string>('auth_token')
      if (!storedToken) {
        return false
      }

      try {
        const response = await fetch('/api/me', {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        })

        if (!response.ok) {
          throw new Error('Auth check failed')
        }

        const data = await response.json()
        setUser(data.user)
        setToken(storedToken)
        setPermissions(data.permissions)

        return true
      } catch (error) {
        console.error('Auth check error:', error)
        logout()
        return false
      }
    }

    return {
      user,
      token,
      permissions,

      isAuthenticated,
      hasPermission,
      userFullName,

      setUser,
      getUserInfo,
      setToken,
      setPermissions,
      logout,
      checkAuth,
    }
  },
  {
    persist: {
      storage: sessionStorage,
      serializer: {
        deserialize: (encryptedState: string) => JSON.parse(encryption.decrypt(encryptedState)),
        serialize: (state: unknown) => encryption.encrypt(JSON.stringify(state)),
      },
      key: 'auth',
      pick: ['user', 'permissions', 'token'],
    },
  },
)
