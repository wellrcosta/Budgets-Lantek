import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'
import type { Item } from '../types'

export const useItemsStore = defineStore('items', () => {
  const items = ref<Item[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchItems = async (organizationId?: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/items', {
        params: organizationId ? { organizationId } : undefined,
      })
      items.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch items'
    } finally {
      loading.value = false
    }
  }

  const createItem = async (data: { name: string; description?: string; unitPrice: number; organizationId?: number }) => {
    error.value = null
    try {
      const response = await api.post('/items', data)
      items.value.push(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create item'
      throw err
    }
  }

  const updateItem = async (id: number, data: Partial<Item>) => {
    error.value = null
    try {
      const response = await api.patch(`/items/${id}`, data)
      const index = items.value.findIndex((item) => item.id === id)
      if (index !== -1) {
        items.value[index] = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update item'
      throw err
    }
  }

  const deleteItem = async (id: number) => {
    error.value = null
    try {
      await api.delete(`/items/${id}`)
      items.value = items.value.filter((item) => item.id !== id)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete item'
      throw err
    }
  }

  return {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  }
})
