<template>
  <div class="login-container">
    <div class="login-shell">
      <section class="hero">
        <div class="brand">
          <div class="brand-mark">BL</div>
          <div>
            <h1>Budgets Lantek</h1>
            <p>Plataforma moderna para criar orcamentos completos.</p>
          </div>
        </div>
        <div class="hero-details">
          <h2>Organize orcamentos completos</h2>
          <p>
            Itens catalogados, itens personalizados e taxas extras em um fluxo
            simples.
          </p>
          <div class="hero-cards">
            <div class="hero-card">
              <p>Catalogo</p>
              <strong>Itens reutilizaveis</strong>
            </div>
            <div class="hero-card">
              <p>Controle</p>
              <strong>Taxas e descontos</strong>
            </div>
          </div>
        </div>
      </section>

      <section class="login-card">
        <form @submit.prevent="handleSubmit">
          <div v-if="isRegister" class="field">
            <label>Name</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Your name"
              required
            />
          </div>
          <div v-if="isRegister" class="field">
            <label>Organization</label>
            <select
              v-model.number="form.organizationId"
              :disabled="form.useNewOrg"
            >
              <option :value="0">Select organization</option>
              <option
                v-for="org in organizations"
                :key="org.id"
                :value="org.id"
              >
                {{ org.name }}
              </option>
            </select>
          </div>
          <div v-if="isRegister" class="field checkbox">
            <input id="newOrg" type="checkbox" v-model="form.useNewOrg" />
            <label for="newOrg">Create new organization</label>
          </div>
          <div v-if="isRegister && form.useNewOrg" class="field">
            <label>New organization name</label>
            <input
              v-model="form.organizationName"
              placeholder="Organization name"
            />
          </div>
          <div v-if="isRegister && form.useNewOrg" class="field">
            <label>Organization description</label>
            <input
              v-model="form.organizationDescription"
              placeholder="Optional description"
            />
          </div>
          <div class="field">
            <label>Email</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="you@email.com"
              required
            />
          </div>
          <div class="field">
            <label>Password</label>
            <input
              v-model="form.password"
              type="password"
              placeholder="Your password"
              required
            />
          </div>
          <button type="submit" :disabled="authStore.loading">
            {{ isRegister ? "Create account" : "Login" }}
          </button>
          <p v-if="authStore.error" class="error">{{ authStore.error }}</p>
          <p class="toggle" @click="isRegister = !isRegister">
            {{
              isRegister
                ? "Already have an account? Login"
                : "Need an account? Register"
            }}
          </p>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/auth";
import api from "../services/api";
import type { Organization } from "../types";

const router = useRouter();
const authStore = useAuthStore();
const isRegister = ref(false);
const organizations = ref<Organization[]>([]);

const form = reactive({
  email: "",
  password: "",
  name: "",
  organizationId: 0,
  useNewOrg: false,
  organizationName: "",
  organizationDescription: "",
});

const loadOrganizations = async () => {
  try {
    const response = await api.get("/auth/organizations");
    organizations.value = response.data;
  } catch {
    organizations.value = [];
  }
};

onMounted(() => {
  loadOrganizations();
});

const handleSubmit = async () => {
  let success;
  if (isRegister.value) {
    if (!form.useNewOrg && !form.organizationId) {
      authStore.error = "Select an organization or create a new one.";
      return;
    }
    if (form.useNewOrg && !form.organizationName.trim()) {
      authStore.error = "Provide a name for the new organization.";
      return;
    }
    success = await authStore.register(
      form.email,
      form.password,
      form.name,
      form.useNewOrg ? undefined : form.organizationId || undefined,
      form.useNewOrg ? form.organizationName : undefined,
      form.useNewOrg ? form.organizationDescription : undefined,
    );
  } else {
    success = await authStore.login(form.email, form.password);
  }
  if (success) {
    router.push("/dashboard");
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  padding: 0;
}

.login-shell {
  width: 100vw;
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(320px, 1.4fr) minmax(320px, 1fr);
  gap: 0;
  align-items: stretch;
}

.hero {
  background: linear-gradient(140deg, #f7e9d8 0%, #f2d7bf 55%, #f6efe7 100%);
  border-radius: 0;
  padding: 3rem 3.5rem;
  border-right: 1px solid #f1dcc5;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
}

.hero-details h2 {
  margin: 0 0 0.75rem;
  font-family: "Space Grotesk", sans-serif;
}

.hero-details p {
  margin: 0 0 1.5rem;
  color: var(--muted);
}

.hero-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
}

.hero-card {
  background: white;
  border-radius: 16px;
  padding: 1rem;
  border: 1px solid var(--border);
}

.hero-card p {
  margin: 0 0 0.35rem;
  color: var(--muted);
  font-size: 0.85rem;
}

.login-card {
  width: 100%;
  background: var(--panel);
  padding: 3rem 3.5rem;
  border-radius: 0;
  box-shadow: none;
  border-left: 1px solid var(--border);
  display: flex;
  align-items: center;
}

.login-card form {
  width: min(520px, 100%);
  margin: 0 auto;
}

.brand {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
}

.brand h1 {
  margin: 0;
  font-family: "Space Grotesk", sans-serif;
}

.brand p {
  margin: 0.35rem 0 0;
  color: var(--muted);
}

.brand-mark {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  background: var(--primary);
  color: white;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-family: "Space Grotesk", sans-serif;
}

form {
  display: grid;
  gap: 1rem;
}

.field {
  display: grid;
  gap: 0.35rem;
}

label {
  font-size: 0.85rem;
  color: var(--muted);
}

input {
  width: 100%;
  padding: 0.85rem 0.9rem;
  border-radius: 12px;
  border: 1px solid var(--border);
  font-size: 1rem;
}

select {
  width: 100%;
  padding: 0.85rem 0.9rem;
  border-radius: 12px;
  border: 1px solid var(--border);
  font-size: 1rem;
  background: white;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox input {
  width: auto;
}

button {
  width: 100%;
  padding: 0.85rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
}

button:disabled {
  background: #d6b8a5;
}

.error {
  color: #b42318;
  margin-top: 0.5rem;
}

.toggle {
  margin-top: 0.5rem;
  color: var(--primary-dark);
  cursor: pointer;
  text-align: center;
}

@media (max-width: 900px) {
  .login-container {
    padding: 0;
  }

  .login-shell {
    grid-template-columns: 1fr;
  }

  .hero,
  .login-card {
    border-radius: 0;
    border: none;
    padding: 2rem;
  }
}
</style>
