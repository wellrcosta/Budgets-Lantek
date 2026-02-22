<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <div v-if="authStore.user">
      <p>Welcome, {{ authStore.user.name }}!</p>
      <p>Role: {{ authStore.user.role }}</p>
      <p v-if="authStore.user.organizationId">Organization ID: {{ authStore.user.organizationId }}</p>
    </div>

    <div class="stats">
      <div class="stat-card">
        <h3>My Budgets</h3>
        <p class="number">{{ budgetsStore.budgets.length }}</p>
      </div>
    </div>

    <div v-if="authStore.isAdmin || authStore.isManager" class="quick-actions">
      <h2>Quick Actions</h2>
      <router-link to="/organizations" v-if="authStore.isAdmin">Manage Organizations</router-link>
      <router-link to="/budgets">View All Budgets</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '../store/auth'
import { useBudgetsStore } from '../store/budgets'

const authStore = useAuthStore()
const budgetsStore = useBudgetsStore()

onMounted(() => {
  budgetsStore.fetchBudgets()
})
</script>

<style scoped>
.dashboard {
  padding: 2rem;
}

.stats {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.stat-card {
  background: #f5f5f5;
  padding: 1.5rem;
  border-radius: 8px;
  min-width: 150px;
  text-align: center;
}

.number {
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
}

.quick-actions {
  margin-top: 2rem;
}

.quick-actions a {
  display: inline-block;
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  background: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}
</style>
