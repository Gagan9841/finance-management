import { useAuthStore } from '@/stores/authStore'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'default',
      component: () => import('../components/layouts/DefaultLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../views/HomeView.vue'),
        },
        {
          path: 'settings/profile',
          name: 'profile',
          component: () => import('../views/User/ProfileView.vue'),
        },
        // {
        //   path: 'dashboard',
        //   name: 'dashboard',
        //   component: () => import('../views/DashboardView.vue'),
        // },
        // {
        //   path: 'transactions',
        //   name: 'transactions',
        //   component: () => import('../views/TransactionsView.vue'),
        // },
        // {
        //   path: 'invoices',
        //   name: 'invoices',
        //   component: () => import('../views/InvoicesView.vue'),
        // },
        // {
        //   path: 'wallets',
        //   name: 'wallets',
        //   component: () => import('../views/WalletsView.vue'),
        // },
        // {
        //   path: 'settings',
        //   name: 'settings',
        //   component: () => import('../views/SettingsView.vue'),
        // },
      ],
    },
    {
      path: '/auth',
      component: () => import('../components/layouts/AuthLayout.vue'),
      meta: { requiresAuth: false },
      children: [
        {
          path: 'login',
          name: 'auth.login',
          component: () => import('../views/LoginView.vue'),
        },
        {
          path: 'register',
          name: 'auth.register',
          component: () => import('../views/RegisterView.vue'),
        },
      ],
    },
  ],
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const isAuthRoute = to.matched.some((record) => record.path.startsWith('/auth'))

  // If trying to access a protected route and not authenticated, redirect to login
  if (requiresAuth && !isAuthenticated) {
    next({ name: 'auth.login', query: { redirect: to.fullPath } })
  }
  // If authenticated and trying to access login/register, redirect to home/dashboard
  else if (isAuthenticated && isAuthRoute) {
    next({ name: 'home' }) // or your dashboard route
  } else {
    next()
  }
})

export default router
