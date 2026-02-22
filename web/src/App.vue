<template>
  <div id="app">
    <nav v-if="authStore.isAuthenticated">
      <router-link to="/dashboard">Dashboard</router-link>
      <router-link v-if="authStore.isAdmin || authStore.isManager" to="/organizations">Organizations</router-link>
      <router-link to="/budgets">Budgets</router-link>
      <router-link to="/items">Items</router-link>
      <button @click="logout">Logout</button>
    </nav>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from './store/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style>
nav {
  padding: 1rem;
  background: #f5f5f5;
  display: flex;
  gap: 1rem;
  align-items: center;
}

nav a {
  text-decoration: none;
  color: #333;
}

nav a.router-link-active {
  font-weight: bold;
  color: #007bff;
}

button {
  margin-left: auto;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>
