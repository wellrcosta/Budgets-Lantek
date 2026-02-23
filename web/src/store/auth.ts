import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'
import type { User } from '../types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isManager = computed(() => user.value?.role === 'manager')
  const isPaidUser = computed(() => user.value?.role === 'paidUser')

  const register = async (
    email: string,
    password: string,
    name: string,
    organizationId?: number,
    organizationName?: string,
    organizationDescription?: string,
  ) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        name,
        organizationId,
        organizationName,
        organizationDescription,
      })
      token.value = response.data.token
      user.value = response.data.user
      localStorage.setItem('token', token.value || '')
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed'
      return false
    } finally {
      loading.value = false
    }
  }

  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('/auth/login', { email, password })
      token.value = response.data.token
      user.value = response.data.user
      localStorage.setItem('token', token.value || '')
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed'
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isManager,
    isPaidUser,
    register,
    login,
    logout,
  }
})
