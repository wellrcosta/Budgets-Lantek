<template>
  <div id="app" :class="{ 'auth-layout': !authStore.isAuthenticated }">
    <aside v-if="authStore.isAuthenticated" class="sidebar">
      <div class="brand">
        <div class="brand-mark">BL</div>
        <div>
          <p class="brand-title">Budgets Lantek</p>
          <p class="brand-subtitle">Orcamentos inteligentes</p>
        </div>
      </div>
      <nav class="nav">
        <router-link to="/dashboard">Dashboard</router-link>
        <router-link
          v-if="authStore.isAdmin || authStore.isManager"
          to="/organizations"
          >Organizations</router-link
        >
        <router-link to="/budgets">Budgets</router-link>
        <router-link to="/items">Items</router-link>
      </nav>
      <button class="logout" @click="logout">Logout</button>
    </aside>
    <main class="main">
      <header v-if="authStore.isAuthenticated" class="topbar">
        <div class="topbar-title">Orcamentos</div>
        <div class="topbar-user" v-if="authStore.user">
          <span class="user-name">{{ authStore.user.name }}</span>
          <span class="user-role">{{ authStore.user.role }}</span>
        </div>
      </header>
      <section class="page">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "./store/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push("/login");
};
</script>

<style>
:root {
  --bg: #f7f4f0;
  --bg-accent: #efe7dc;
  --panel: #ffffff;
  --text: #1e1c19;
  --muted: #6b6258;
  --primary: #d7682f;
  --primary-dark: #b5511c;
  --border: #eadfd3;
  --shadow: 0 18px 35px rgba(21, 17, 13, 0.12);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: radial-gradient(
    circle at top left,
    #fff1df 0%,
    #f6efe7 40%,
    var(--bg) 100%
  );
  color: var(--text);
  font-family: "Manrope", sans-serif;
  min-height: 100vh;
}

#app {
  min-height: 100vh;
  width: 100%;
  min-width: 100vw;
  display: grid;
  grid-template-columns: 260px 1fr;
}

.auth-layout {
  grid-template-columns: 1fr;
}

.auth-layout .page {
  padding: 0;
}

.sidebar {
  padding: 2rem 1.5rem;
  background: linear-gradient(160deg, #f5e6d5 0%, #f2dbc7 50%, #efcfb5 100%);
  border-right: 1px solid #ead2be;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.brand {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.brand-mark {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: var(--primary);
  color: white;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-family: "Space Grotesk", sans-serif;
}

.brand-title {
  margin: 0;
  font-weight: 700;
  font-family: "Space Grotesk", sans-serif;
}

.brand-subtitle {
  margin: 0.25rem 0 0;
  color: var(--muted);
  font-size: 0.85rem;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.nav a {
  text-decoration: none;
  color: var(--text);
  padding: 0.75rem 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.nav a.router-link-active {
  background: white;
  box-shadow: var(--shadow);
  transform: translateY(-1px);
}

.logout {
  margin-top: auto;
  border: none;
  background: var(--primary);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
}

.logout:hover {
  background: var(--primary-dark);
}

.main {
  display: flex;
  flex-direction: column;
  min-width: 0;
  width: 100%;
}

.topbar {
  padding: 1.5rem 2.5rem 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.topbar-title {
  font-size: 1.35rem;
  font-weight: 700;
  font-family: "Space Grotesk", sans-serif;
}

.topbar-user {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  background: white;
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  border: 1px solid var(--border);
}

.user-name {
  font-weight: 600;
}

.user-role {
  font-size: 0.8rem;
  color: var(--muted);
}

.page {
  padding: 1.5rem 2.5rem 3rem;
  width: 100%;
  min-width: 0;
}

@media (max-width: 960px) {
  #app {
    grid-template-columns: 1fr;
  }

  .sidebar {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .nav {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .logout {
    margin-top: 0;
  }

  .page {
    padding: 1.5rem;
  }

  .auth-layout .page {
    padding: 0;
  }
}
</style>
