<template>
  <div class="login-container">
    <h1>Budgets Lantek</h1>
    <form @submit.prevent="handleSubmit">
      <div v-if="isRegister">
        <input v-model="form.name" type="text" placeholder="Name" required />
      </div>
      <input v-model="form.email" type="email" placeholder="Email" required />
      <input v-model="form.password" type="password" placeholder="Password" required />
      <button type="submit" :disabled="authStore.loading">
        {{ isRegister ? 'Register' : 'Login' }}
      </button>
      <p v-if="authStore.error" class="error">{{ authStore.error }}</p>
      <p class="toggle" @click="isRegister = !isRegister">
        {{ isRegister ? 'Already have an account? Login' : 'Need an account? Register' }}
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const router = useRouter()
const authStore = useAuthStore()
const isRegister = ref(false)

const form = reactive({
  email: '',
  password: '',
  name: '',
})

const handleSubmit = async () => {
  let success
  if (isRegister.value) {
    success = await authStore.register(form.email, form.password, form.name)
  } else {
    success = await authStore.login(form.email, form.password)
  }
  if (success) {
    router.push('/dashboard')
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
}

input {
  display: block;
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 0.75rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background: #ccc;
}

.error {
  color: red;
  margin-top: 1rem;
}

.toggle {
  margin-top: 1rem;
  color: #007bff;
  cursor: pointer;
}
</style>
