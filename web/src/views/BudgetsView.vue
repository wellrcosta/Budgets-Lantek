<template>
  <div class="budgets">
    <div class="header">
      <div>
        <p class="eyebrow">Budgets</p>
        <h1>Construa orcamentos completos</h1>
        <p class="subtitle">
          Combine itens catalogados, itens personalizados e taxas extras.
        </p>
      </div>
      <button class="ghost" @click="exportCsv" :disabled="budgetsStore.loading">
        Export CSV
      </button>
    </div>

    <div class="grid">
      <section class="panel">
        <div class="panel-header">
          <h2>Budgets list</h2>
          <span class="pill">{{ budgetsStore.budgets.length }} total</span>
        </div>
        <div v-if="budgetsStore.loading">Loading...</div>
        <div v-else-if="budgetsStore.error" class="error">
          {{ budgetsStore.error }}
        </div>
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
                <td>${{ budget.totalAmount?.toFixed(2) || "0.00" }}</td>
                <td>{{ new Date(budget.createdAt).toLocaleDateString() }}</td>
                <td class="actions">
                  <button
                    class="link"
                    @click="router.push(`/budgets/${budget.id}`)"
                  >
                    View
                  </button>
                  <button class="link danger" @click="deleteBudget(budget.id)">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2>Create new budget</h2>
          <span class="pill">Draft</span>
        </div>
        <form @submit.prevent="createBudget" class="form">
          <div class="field">
            <label>Name</label>
            <input
              v-model="newBudget.name"
              placeholder="Budget name"
              required
            />
          </div>
          <div class="field">
            <label>Description</label>
            <input
              v-model="newBudget.description"
              placeholder="Short description"
            />
          </div>

          <div class="section">
            <div class="section-header">
              <h3>Items catalog</h3>
              <div class="row">
                <select v-model.number="selectedItemId">
                  <option :value="0">Select item</option>
                  <option
                    v-for="item in itemsStore.items"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{ item.name }} - ${{ Number(item.unitPrice).toFixed(2) }}
                  </option>
                </select>
                <button type="button" class="ghost" @click="addCatalogItem">
                  Add item
                </button>
              </div>
            </div>

            <div class="list" v-if="lineItems.length">
              <div v-for="line in lineItems" :key="line.key" class="line-item">
                <div class="line-main">
                  <input
                    v-model="line.name"
                    :disabled="!line.isCustom"
                    placeholder="Item name"
                  />
                  <div class="inline">
                    <label>Qty</label>
                    <input
                      v-model.number="line.quantity"
                      type="number"
                      min="1"
                    />
                  </div>
                  <div class="inline">
                    <label>Unit</label>
                    <input
                      v-model.number="line.unitPrice"
                      type="number"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div class="inline">
                    <label>Discount %</label>
                    <input
                      v-model.number="line.discount"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                </div>
                <div class="line-side">
                  <span>${{ lineTotal(line).toFixed(2) }}</span>
                  <button
                    type="button"
                    class="link danger"
                    @click="removeLineItem(line.key)"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
            <p v-else class="muted">
              Add items from catalog or create custom items below.
            </p>

            <button type="button" class="ghost" @click="addCustomItem">
              Add custom item
            </button>
          </div>

          <div class="section">
            <div class="section-header">
              <h3>Extra fees</h3>
              <button type="button" class="ghost" @click="addExtraFee">
                Add fee
              </button>
            </div>
            <div v-if="extraFees.length" class="fees">
              <div v-for="fee in extraFees" :key="fee.key" class="fee-row">
                <input v-model="fee.label" placeholder="Fee label" />
                <input
                  v-model.number="fee.amount"
                  type="number"
                  step="0.01"
                  min="0"
                />
                <button
                  type="button"
                  class="link danger"
                  @click="removeExtraFee(fee.key)"
                >
                  Remove
                </button>
              </div>
            </div>
            <p v-else class="muted">No extra fees added.</p>
          </div>

          <div class="summary">
            <div>
              <p>Items total</p>
              <strong>${{ totalItems.toFixed(2) }}</strong>
            </div>
            <div>
              <p>Extra fees</p>
              <strong>${{ totalFees.toFixed(2) }}</strong>
            </div>
            <div class="highlight">
              <p>Total</p>
              <strong>${{ totalAmount.toFixed(2) }}</strong>
            </div>
          </div>

          <button type="submit" class="primary">Create budget</button>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useBudgetsStore } from "../store/budgets";
import { useItemsStore } from "../store/items";
import type { BudgetExtraFee, BudgetItemData } from "../types";

const router = useRouter();
const budgetsStore = useBudgetsStore();
const itemsStore = useItemsStore();

type LineItem = {
  key: string;
  itemId?: number;
  name: string;
  unitPrice: number;
  quantity: number;
  discount: number;
  isCustom: boolean;
};

type FeeItem = BudgetExtraFee & { key: string };

const newBudget = reactive({
  name: "",
  description: "",
});

const lineItems = ref<LineItem[]>([]);
const extraFees = ref<FeeItem[]>([]);
const selectedItemId = ref(0);

onMounted(() => {
  budgetsStore.fetchBudgets();
  itemsStore.fetchItems();
});

const lineTotal = (line: LineItem) => {
  const subtotal = line.unitPrice * line.quantity;
  return subtotal * (1 - line.discount / 100);
};

const totalItems = computed(() =>
  lineItems.value.reduce((sum, line) => sum + lineTotal(line), 0),
);

const totalFees = computed(() =>
  extraFees.value.reduce((sum, fee) => sum + fee.amount, 0),
);

const totalAmount = computed(() =>
  Number((totalItems.value + totalFees.value).toFixed(2)),
);

const addCatalogItem = () => {
  const item = itemsStore.items.find(
    (data) => data.id === selectedItemId.value,
  );
  if (!item) {
    return;
  }
  lineItems.value.push({
    key: `catalog-${item.id}-${Date.now()}`,
    itemId: item.id,
    name: item.name,
    unitPrice: Number(item.unitPrice),
    quantity: 1,
    discount: 0,
    isCustom: false,
  });
  selectedItemId.value = 0;
};

const addCustomItem = () => {
  lineItems.value.push({
    key: `custom-${Date.now()}`,
    name: "",
    unitPrice: 0,
    quantity: 1,
    discount: 0,
    isCustom: true,
  });
};

const removeLineItem = (key: string) => {
  lineItems.value = lineItems.value.filter((line) => line.key !== key);
};

const addExtraFee = () => {
  extraFees.value.push({
    key: `fee-${Date.now()}`,
    label: "",
    amount: 0,
  });
};

const removeExtraFee = (key: string) => {
  extraFees.value = extraFees.value.filter((fee) => fee.key !== key);
};

const createBudget = async () => {
  if (!lineItems.value.length) {
    alert("Add at least one item before creating the budget.");
    return;
  }

  const hasInvalidCustom = lineItems.value.some(
    (line) => line.isCustom && (!line.name.trim() || line.unitPrice <= 0),
  );
  if (hasInvalidCustom) {
    alert("Custom items need a name and unit price.");
    return;
  }

  const itemsData: BudgetItemData[] = lineItems.value.map((line) => ({
    itemId: line.itemId,
    name: line.name,
    unitPrice: line.unitPrice,
    quantity: line.quantity,
    discount: line.discount,
    isCustom: line.isCustom,
  }));

  const fees: BudgetExtraFee[] = extraFees.value.map((fee) => ({
    label: fee.label,
    amount: fee.amount,
  }));

  await budgetsStore.createBudget({
    name: newBudget.name,
    description: newBudget.description,
    totalAmount: totalAmount.value,
    itemsData,
    extraFees: fees,
  });

  newBudget.name = "";
  newBudget.description = "";
  lineItems.value = [];
  extraFees.value = [];
};

const deleteBudget = async (id: number) => {
  if (confirm("Are you sure?")) {
    await budgetsStore.deleteBudget(id);
  }
};

const exportCsv = () => {
  budgetsStore.exportCsv();
};
</script>

<style scoped>
.budgets {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
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
  grid-template-columns: minmax(300px, 1.1fr) minmax(320px, 1fr);
  gap: 2rem;
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

.pill {
  font-size: 0.75rem;
  color: var(--muted);
  border: 1px solid var(--border);
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  text-align: left;
  padding: 0.8rem 0.5rem;
  border-bottom: 1px solid var(--border);
  font-size: 0.95rem;
}

th {
  color: var(--muted);
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 0.75rem;
}

.form {
  display: grid;
  gap: 1.25rem;
}

.field {
  display: grid;
  gap: 0.5rem;
}

label {
  font-size: 0.85rem;
  color: var(--muted);
}

input,
select {
  padding: 0.75rem 0.9rem;
  border-radius: 12px;
  border: 1px solid var(--border);
}

.section {
  border-top: 1px solid var(--border);
  padding-top: 1.25rem;
  display: grid;
  gap: 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.row {
  display: flex;
  gap: 0.75rem;
  align-items: center;
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

.line-main {
  display: grid;
  gap: 0.75rem;
  flex: 1;
}

.inline {
  display: grid;
  gap: 0.25rem;
}

.line-side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.fees {
  display: grid;
  gap: 0.75rem;
}

.fee-row {
  display: grid;
  grid-template-columns: 1fr 150px auto;
  gap: 0.75rem;
  align-items: center;
}

.summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  background: #fef5e8;
  padding: 1rem;
  border-radius: 16px;
  border: 1px solid #f1dcc5;
}

.summary p {
  margin: 0;
  color: var(--muted);
  font-size: 0.85rem;
}

.summary strong {
  font-size: 1.1rem;
}

.highlight strong {
  color: var(--primary);
}

.primary {
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
}

.ghost {
  background: transparent;
  border: 1px solid var(--border);
  padding: 0.65rem 0.9rem;
  border-radius: 12px;
  cursor: pointer;
}

.link {
  background: none;
  border: none;
  color: var(--primary);
  cursor: pointer;
  padding: 0;
}

.link.danger {
  color: #b42318;
}

.muted {
  color: var(--muted);
  margin: 0;
}

.error {
  color: #b42318;
}

@media (max-width: 1100px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .summary {
    grid-template-columns: 1fr;
  }
}
</style>
