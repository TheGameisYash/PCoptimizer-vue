import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from './composables/useAuth'
import App from './App.vue'
import './style.css'

// Import views
import Landing from './views/Landing.vue'  // ← Add Landing page import
import Login from './views/Login.vue'
import Dashboard from './views/Dashboard.vue'
import Licenses from './views/Licenses.vue'
import BulkLicenses from './views/BulkLicenses.vue'
import Activity from './views/Activity.vue'
import Analytics from './views/Analytics.vue'
import Audit from './views/Audit.vue'
import Banlist from './views/Banlist.vue'
import Users from './views/Users.vue'
import Settings from './views/Settings.vue'

const routes = [
  { path: '/', component: Landing },  // ← Change this line to show Landing page as homepage
  { path: '/login', component: Login },
  { 
    path: '/dashboard', 
    component: Dashboard, 
    meta: { requiresAuth: true, role: 'viewer' } 
  },
  { 
    path: '/licenses', 
    component: Licenses, 
    meta: { requiresAuth: true, role: 'viewer' } 
  },
  { 
    path: '/bulk-licenses', 
    component: BulkLicenses, 
    meta: { requiresAuth: true, role: 'operator' } 
  },
  { 
    path: '/activity', 
    component: Activity, 
    meta: { requiresAuth: true, role: 'viewer' } 
  },
  { 
    path: '/analytics', 
    component: Analytics, 
    meta: { requiresAuth: true, role: 'viewer' } 
  },
  { 
    path: '/audit', 
    component: Audit, 
    meta: { requiresAuth: true, role: 'admin' } 
  },
  { 
    path: '/banlist', 
    component: Banlist, 
    meta: { requiresAuth: true, role: 'operator' } 
  },
  { 
    path: '/users', 
    component: Users, 
    meta: { requiresAuth: true, role: 'admin' } 
  },
  { 
    path: '/settings', 
    component: Settings, 
    meta: { requiresAuth: true, role: 'admin' } 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Enhanced auth guard with role checking
router.beforeEach(async (to, from, next) => {
  const { checkAuth, hasPermission } = useAuth()

  if (to.meta.requiresAuth) {
    const isAuthenticated = await checkAuth()
    
    if (!isAuthenticated) {
      next('/login')
      return
    }

    // Check role permissions
    if (to.meta.role && !hasPermission(to.meta.role)) {
      // Redirect to dashboard if user doesn't have required role
      next('/dashboard')
      return
    }
  }

  next()
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
