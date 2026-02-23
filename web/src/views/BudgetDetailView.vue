<template>
  <div class="budget-detail">
    <div class="header">
      <button class="ghost" @click="router.push('/budgets')">Back</button>
      <div>
        <p class="eyebrow">Budget</p>
        <h1>{{ budget?.name || "Budget details" }}</h1>
        <p class="subtitle">Review items, fees, and totals.</p>
      </div>
      <span class="pill" v-if="budget">{{ budget.status }}</span>
    </div>

    <div v-if="budgetsStore.loading">Loading...</div>
    <div v-else-if="budgetsStore.error" class="error">
      {{ budgetsStore.error }}
    </div>
    <div v-else-if="!budget" class="empty">No budget found.</div>
    <div v-else class="grid">
      <section class="panel">
        <div class="panel-header">
          <h2>Summary</h2>
        </div>
        <div class="summary">
          <div>
            <p>Total</p>
            <strong>${{ Number(budget.totalAmount || 0).toFixed(2) }}</strong>
          </div>
          <div>
            <p>Created</p>
            <strong>{{
              new Date(budget.createdAt).toLocaleDateString()
            }}</strong>
          </div>
          <div>
            <p>User ID</p>
            <strong>{{ budget.userId }}</strong>
          </div>
          <div>
            <p>Organization</p>
            <strong>{{ budget.organizationId || "-" }}</strong>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2>Items</h2>
        </div>
        <div v-if="!itemsData.length" class="empty">No items.</div>
        <div v-else class="list">
          <div v-for="item in itemsData" :key="item.key" class="line-item">
            <div>
              <p class="item-name">{{ item.name }}</p>
              <p class="muted">
                Qty {{ item.quantity }} x ${{
                  Number(item.unitPrice).toFixed(2)
                }}
              </p>
            </div>
            <div class="item-total">${{ item.total.toFixed(2) }}</div>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2>Extra fees</h2>
        </div>
        <div v-if="!extraFees.length" class="empty">No extra fees.</div>
        <div v-else class="list">
          <div v-for="fee in extraFees" :key="fee.key" class="line-item">
            <div>
              <p class="item-name">{{ fee.label }}</p>
              <p class="muted">Fee</p>
            </div>
            <div class="item-total">${{ Number(fee.amount).toFixed(2) }}</div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBudgetsStore } from "../store/budgets";

const route = useRoute();
const router = useRouter();
const budgetsStore = useBudgetsStore();

const budgetId = Number(route.params.id);

onMounted(() => {
  if (!Number.isNaN(budgetId)) {
    budgetsStore.getBudget(budgetId);
  }
});

const budget = computed(() => budgetsStore.currentBudget);

const itemsData = computed(() =>
  (budget.value?.itemsData || []).map((item, index) => {
    const quantity = Number(item.quantity || 0);
    const unitPrice = Number(item.unitPrice || 0);
    const discount = Number(item.discount || 0);
    const total = quantity * unitPrice * (1 - discount / 100);
    return {
      key: `item-${index}`,
      name: item.name || `Item ${item.itemId || ""}`,
      quantity,
      unitPrice,
      total: Number(total.toFixed(2)),
    };
  }),
);

const extraFees = computed(() =>
  (budget.value?.extraFees || []).map((fee, index) => ({
    key: `fee-${index}`,
    label: fee.label,
    amount: fee.amount,
  })),
);
</script>

<style scoped>
.budget-detail {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1.5rem;
  align-items: center;
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
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.panel {
  background: var(--panel);
  border-radius: 20px;
  padding: 1.75rem;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.summary {
  display: grid;
  gap: 1rem;
}

.summary p {
  margin: 0;
  color: var(--muted);
  font-size: 0.85rem;
}

.summary strong {
  font-size: 1.1rem;
}

.list {
  display: grid;
  gap: 1rem;
}

.line-item {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  background: #fdf9f4;
  border: 1px solid var(--border);
  padding: 1rem;
  border-radius: 16px;
}

.item-name {
  margin: 0 0 0.35rem;
  font-weight: 600;
}

.item-total {
  font-weight: 600;
  color: var(--primary);
}

.muted {
  color: var(--muted);
  margin: 0;
}

.empty {
  color: var(--muted);
}

.error {
  color: #b42318;
}

.ghost {
  background: transparent;
  border: 1px solid var(--border);
  padding: 0.65rem 0.9rem;
  border-radius: 12px;
  cursor: pointer;
}

.pill {
  font-size: 0.75rem;
  color: var(--muted);
  border: 1px solid var(--border);
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
}

@media (max-width: 900px) {
  .header {
    grid-template-columns: 1fr;
  }
}
</style>
