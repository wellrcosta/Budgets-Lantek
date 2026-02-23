import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
    },
    {
      path: '/budgets',
      name: 'budgets',
      component: () => import('../views/BudgetsView.vue'),
    },
    {
      path: '/organizations',
      name: 'organizations',
      component: () => import('../views/DashboardView.vue'), // TODO
    },
    {
      path: '/items',
      name: 'items',
      component: () => import('../views/DashboardView.vue'), // TODO
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  if (to.meta.public) {
    next()
  } else if (!authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
