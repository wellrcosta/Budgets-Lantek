<template>
  <div class="budgets">
    <h1>Budgets</h1>
    <button @click="exportCsv" :disabled="budgetsStore.loading">Export CSV</button>
    
    <div v-if="budgetsStore.loading">Loading...</div>
    <div v-else-if="budgetsStore.error" class="error">{{ budgetsStore.error }}</div>
    <div v-else>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Total</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="budget in budgetsStore.budgets" :key="budget.id">
            <td>{{ budget.name }}</td>
            <td>{{ budget.status }}</td>
            <td>${{ budget.totalAmount?.toFixed(2) || '0.00' }}</td>
            <td>{{ new Date(budget.createdAt).toLocaleDateString() }}</td>
            <td>
              <button @click="router.push(`/budgets/${budget.id}`)">View</button>
              <button @click="deleteBudget(budget.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <form @submit.prevent="createBudget">
        <h3>Create New Budget</h3>
        <input v-model="newBudget.name" placeholder="Name" required />
        <input v-model="newBudget.description" placeholder="Description" />
        <button type="submit">Create</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBudgetsStore } from '../store/budgets'

const router = useRouter()
const budgetsStore = useBudgetsStore()

const newBudget = reactive({
  name: '',
  description: '',
  totalAmount: 0,
  itemsData: [],
})

onMounted(() => {
  budgetsStore.fetchBudgets()
})

const createBudget = async () => {
  await budgetsStore.createBudget(newBudget)
  newBudget.name = ''
  newBudget.description = ''
}

const deleteBudget = async (id: number) => {
  if (confirm('Are you sure?')) {
    await budgetsStore.deleteBudget(id)
  }
}

const exportCsv = () => {
  budgetsStore.exportCsv()
}
</script>

<style scoped>
.budgets {
  padding: 2rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

th, td {
  border: 1px solid #ddd;
  padding: 0.75rem;
  text-align: left;
}

th {
  background: #f5f5f5;
}

form {
  margin-top: 2rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
}

input {
  margin-right: 0.5rem;
  padding: 0.5rem;
}

.error {
  color: red;
}
</style>
