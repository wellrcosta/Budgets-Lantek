<template>
  <div class="items">
    <div class="header">
      <div>
        <p class="eyebrow">Items</p>
        <h1>Catalogo de itens</h1>
        <p class="subtitle">
          Crie itens reutilizaveis para acelerar seus orcamentos.
        </p>
      </div>
      <button class="ghost" @click="refresh" :disabled="itemsStore.loading">
        Refresh
      </button>
    </div>

    <div class="grid">
      <section class="panel">
        <div class="panel-header">
          <h2>Items list</h2>
          <span class="pill">{{ itemsStore.items.length }} items</span>
        </div>
        <div v-if="itemsStore.loading">Loading...</div>
        <div v-if="itemsStore.error" class="error">{{ itemsStore.error }}</div>
        <div v-if="!itemsStore.loading">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Unit price</th>
                <th>Organization</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in itemsStore.items" :key="item.id">
                <td>{{ item.name }}</td>
                <td>${{ Number(item.unitPrice).toFixed(2) }}</td>
                <td>{{ item.organizationId }}</td>
                <td class="actions">
                  <button class="link danger" @click="deleteItem(item.id)">
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
          <h2>Create item</h2>
        </div>
        <div v-if="needsOrganization" class="warn">
          Your user has no organization. Ask an admin to assign one before
          creating items.
        </div>
        <form class="form" @submit.prevent="createItem">
          <div class="field">
            <label>Name</label>
            <input v-model="newItem.name" placeholder="Item name" required />
          </div>
          <div class="field">
            <label>Description</label>
            <input
              v-model="newItem.description"
              placeholder="Optional details"
            />
          </div>
          <div class="field">
            <label>Unit price</label>
            <input
              v-model.number="newItem.unitPrice"
              type="number"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div class="field" v-if="authStore.isAdmin">
            <label>Organization ID</label>
            <input
              v-model.number="newItem.organizationId"
              type="number"
              min="1"
            />
          </div>
          <button type="submit" class="primary" :disabled="!canCreateItem">
            Create item
          </button>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from "vue";
import { useItemsStore } from "../store/items";
import { useAuthStore } from "../store/auth";

const itemsStore = useItemsStore();
const authStore = useAuthStore();

const newItem = reactive({
  name: "",
  description: "",
  unitPrice: 0,
  organizationId: undefined as number | undefined,
});

const needsOrganization = computed(
  () => !authStore.isAdmin && !authStore.user?.organizationId,
);

const canCreateItem = computed(
  () => !itemsStore.loading && !needsOrganization.value,
);

onMounted(() => {
  itemsStore.fetchItems();
});

const refresh = () => {
  itemsStore.fetchItems();
};

const createItem = async () => {
  if (needsOrganization.value) {
    return;
  }
  await itemsStore.createItem({
    name: newItem.name,
    description: newItem.description || undefined,
    unitPrice: newItem.unitPrice,
    organizationId: authStore.isAdmin ? newItem.organizationId : undefined,
  });
  newItem.name = "";
  newItem.description = "";
  newItem.unitPrice = 0;
  newItem.organizationId = undefined;
};

const deleteItem = async (id: number) => {
  if (confirm("Are you sure?")) {
    await itemsStore.deleteItem(id);
  }
};
</script>

<style scoped>
.items {
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
  grid-template-columns: minmax(320px, 1.1fr) minmax(300px, 1fr);
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
  gap: 1rem;
}

.field {
  display: grid;
  gap: 0.5rem;
}

label {
  font-size: 0.85rem;
  color: var(--muted);
}

input {
  padding: 0.75rem 0.9rem;
  border-radius: 12px;
  border: 1px solid var(--border);
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

.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.error {
  color: #b42318;
}

.warn {
  background: #fff2e7;
  border: 1px solid #f1dcc5;
  color: #8a3a11;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
}

@media (max-width: 1000px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
