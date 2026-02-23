<template>
  <div class="dashboard">
    <div class="hero">
      <div>
        <p class="eyebrow">Overview</p>
        <h1>Bem-vindo, {{ authStore.user?.name }}</h1>
        <p class="subtitle">
          Crie orcamentos completos com itens, taxas e valores detalhados.
        </p>
      </div>
      <div class="hero-card">
        <p class="hero-label">Role</p>
        <p class="hero-value">{{ authStore.user?.role }}</p>
        <p v-if="authStore.user?.organizationId" class="hero-meta">
          Organization ID: {{ authStore.user.organizationId }}
        </p>
      </div>
    </div>

    <div class="stats">
      <div class="stat-card">
        <h3>My Budgets</h3>
        <p class="number">{{ budgetsStore.budgets.length }}</p>
      </div>
      <div class="stat-card">
        <h3>Items</h3>
        <p class="number">Cadastre itens reutilizaveis</p>
      </div>
    </div>

    <div v-if="authStore.isAdmin || authStore.isManager" class="quick-actions">
      <h2>Quick Actions</h2>
      <router-link to="/organizations" v-if="authStore.isAdmin"
        >Manage Organizations</router-link
      >
      <router-link to="/budgets">Create Budget</router-link>
      <router-link to="/items">Manage Items</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "../store/auth";
import { useBudgetsStore } from "../store/budgets";

const authStore = useAuthStore();
const budgetsStore = useBudgetsStore();

onMounted(() => {
  budgetsStore.fetchBudgets();
});
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.hero {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  justify-content: space-between;
  background: var(--panel);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: var(--shadow);
}

.eyebrow {
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: var(--muted);
  margin: 0 0 0.5rem;
}

.subtitle {
  margin: 0.5rem 0 0;
  color: var(--muted);
  max-width: 420px;
}

.hero-card {
  min-width: 200px;
  background: linear-gradient(160deg, #fff 0%, #f7f0e8 100%);
  padding: 1.5rem;
  border-radius: 18px;
  border: 1px solid var(--border);
}

.hero-label {
  margin: 0;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--muted);
}

.hero-value {
  margin: 0.5rem 0 0;
  font-weight: 700;
  font-size: 1.2rem;
}

.hero-meta {
  margin: 0.5rem 0 0;
  color: var(--muted);
  font-size: 0.9rem;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: var(--panel);
  padding: 1.5rem;
  border-radius: 18px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
}

.number {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0.75rem 0 0;
  color: var(--primary);
}

.quick-actions {
  background: var(--panel);
  padding: 1.5rem;
  border-radius: 18px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.quick-actions a {
  display: inline-block;
  margin-right: 1rem;
  padding: 0.65rem 1.2rem;
  background: var(--primary);
  color: white;
  text-decoration: none;
  border-radius: 999px;
  width: fit-content;
}

@media (max-width: 900px) {
  .hero {
    flex-direction: column;
  }
}
</style>
