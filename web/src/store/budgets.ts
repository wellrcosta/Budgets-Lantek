import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'
import type { Budget, BudgetItemData } from '../types'

export const useBudgetsStore = defineStore('budgets', () => {
  const budgets = ref<Budget[]>([])
  const currentBudget = ref<Budget | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchBudgets = async () => {
    loading.value = true
    try {
      const response = await api.get('/budgets')
      budgets.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch budgets'
    } finally {
      loading.value = false
    }
  }

  const getBudget = async (id: number) => {
    loading.value = true
    try {
      const response = await api.get(`/budgets/${id}`)
      currentBudget.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch budget'
    } finally {
      loading.value = false
    }
  }

  const createBudget = async (data: { name: string; description?: string; totalAmount?: number; itemsData?: BudgetItemData[] }) => {
    try {
      const response = await api.post('/budgets', data)
      budgets.value.push(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create budget'
      throw err
    }
  }

  const updateBudget = async (id: number, data: Partial<Budget>) => {
    try {
      const response = await api.patch(`/budgets/${id}`, data)
      const index = budgets.value.findIndex(b => b.id === id)
      if (index !== -1) {
        budgets.value[index] = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update budget'
      throw err
    }
  }

  const deleteBudget = async (id: number) => {
    try {
      await api.delete(`/budgets/${id}`)
      budgets.value = budgets.value.filter(b => b.id !== id)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete budget'
      throw err
    }
  }

  const exportCsv = async () => {
    try {
      const response = await api.get('/budgets/export/csv', { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'budgets.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to export'
    }
  }

  return {
    budgets,
    currentBudget,
    loading,
    error,
    fetchBudgets,
    getBudget,
    createBudget,
    updateBudget,
    deleteBudget,
    exportCsv,
  }
})
