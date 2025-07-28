<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar -->
    <div
      class="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <span class="text-xl font-bold text-white">PC Optimizer</span>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-2">
          <router-link
            v-for="item in filteredNavigation"
            :key="item.name"
            :to="item.href"
            class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200"
            :class="
              $route.path === item.href
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
            "
          >
            <component :is="item.icon" class="mr-3 h-5 w-5" />
            {{ item.name }}
            <span v-if="item.badge" :class="item.badgeClass" class="ml-auto px-2 py-1 text-xs rounded-full">
              {{ item.badge }}
            </span>
          </router-link>
        </nav>

        <!-- User Info -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center mb-3">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              {{ user?.charAt(0).toUpperCase() }}
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ user }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">{{ role }} Access</p>
            </div>
          </div>
          
          <button
            @click="handleLogout"
            class="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-xl hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all duration-200"
          >
            <svg class="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="lg:pl-64">
      <!-- Top bar -->
      <div class="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between h-16 px-6">
          <button
            @click="sidebarOpen = !sidebarOpen"
            class="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div class="flex items-center space-x-4">
            <NotificationCenter />
            <!-- Role indicator -->
            <div :class="getRoleBadgeClass(role)" class="px-3 py-1 text-xs font-semibold rounded-full">
              {{ role?.toUpperCase() }}
            </div>
          </div>
        </div>
      </div>

      <!-- Page content -->
      <main class="p-6">
        <slot />
      </main>
    </div>

    <!-- Mobile sidebar overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
      @click="sidebarOpen = false"
    />
  </div>
</template>

<script>
import { ref, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import NotificationCenter from './NotificationCenter.vue'

export default {
  components: {
    NotificationCenter
  },
  setup() {
    const router = useRouter()
    const sidebarOpen = ref(false)
    const { user, role, logout, isAdmin, isOperator, isViewer, canManageUsers, canManageLicenses, canManageSettings } = useAuth()

    const allNavigation = [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: HomeIcon,
        requiredRole: 'viewer'
      },
      {
        name: 'Licenses',
        href: '/licenses',
        icon: KeyIcon,
        requiredRole: 'viewer'
      },
      {
        name: 'Bulk Generator',
        href: '/bulk-licenses',
        icon: DuplicateIcon,
        requiredRole: 'operator',
        badge: 'New',
        badgeClass: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      },
      {
        name: 'Activity',
        href: '/activity',
        icon: ClockIcon,
        requiredRole: 'viewer'
      },
      {
        name: 'Analytics',
        href: '/analytics',
        icon: ChartBarIcon,
        requiredRole: 'viewer'
      },
      {
        name: 'Audit Trail',
        href: '/audit',
        icon: DocumentTextIcon,
        requiredRole: 'admin'
      },
      {
        name: 'Users',
        href: '/users',
        icon: UsersIcon,
        requiredRole: 'admin',
        badge: 'Admin',
        badgeClass: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      },
      {
        name: 'Banlist',
        href: '/banlist',
        icon: ShieldExclamationIcon,
        requiredRole: 'operator'
      },
      {
        name: 'Settings',
        href: '/settings',
        icon: CogIcon,
        requiredRole: 'admin',
        badge: 'Admin',
        badgeClass: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      },
    ]

    const filteredNavigation = computed(() => {
      return allNavigation.filter(item => {
        switch (item.requiredRole) {
          case 'admin': return isAdmin.value
          case 'operator': return isOperator.value
          case 'viewer': return isViewer.value
          default: return false
        }
      })
    })

    const getRoleBadgeClass = (userRole) => {
      switch (userRole) {
        case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        case 'operator': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
        case 'viewer': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      }
    }

    const handleLogout = async () => {
      await logout()
      router.push('/login')
    }

    return {
      sidebarOpen,
      filteredNavigation,
      user,
      role,
      handleLogout,
      getRoleBadgeClass
    }
  },
}

// Icon components remain the same...
function HomeIcon() {
  return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    }),
  ])
}

function KeyIcon() {
  return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z',
    }),
  ])
}

function DuplicateIcon() {
  return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z',
    }),
  ])
}

function ClockIcon() {
  return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    }),
  ])
}

function ChartBarIcon() {
  return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    }),
  ])
}

function DocumentTextIcon() {
  return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    }),
  ])
}

function UsersIcon() {
  return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z',
    }),
  ])
}

function ShieldExclamationIcon() {
  return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01',
    }),
  ])
}

function CogIcon() {
  return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
    }),
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    }),
  ])
}
</script>
