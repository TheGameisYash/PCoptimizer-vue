<template>
  <ModernLayout>
    <!-- Header with Manual Refresh -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Welcome back! Here's what's happening with your licenses.
        </p>
      </div>
      <button 
        @click="manualRefresh" 
        :disabled="loading"
        class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all duration-200"
      >
        <svg class="w-4 h-4 mr-2" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        {{ loading ? 'Refreshing...' : 'Refresh' }}
      </button>
    </div>

    <!-- Cache Status -->
    <div v-if="lastUpdated" class="mb-6 text-sm text-gray-500 dark:text-gray-400 text-center">
      Last updated: {{ formatDate(lastUpdated) }} | Next auto-refresh in {{ nextRefreshIn }}
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div
        v-for="stat in stats"
        :key="stat.name"
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
      >
        <div class="flex items-center">
          <div :class="stat.iconBg" class="w-12 h-12 rounded-xl flex items-center justify-center">
            <component :is="stat.icon" :class="stat.iconColor" class="w-6 h-6" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ stat.name }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
          </div>
        </div>
        <div class="mt-4 flex items-baseline">
          <p
            :class="stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'"
            class="text-sm font-medium"
          >
            {{ stat.change }}
          </p>
          <p class="ml-2 text-sm text-gray-500 dark:text-gray-400">from last month</p>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- License Activity Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">License Activity</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Daily license validations</p>
          </div>
          <div class="flex space-x-2">
            <button class="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-lg dark:bg-blue-900/20 dark:text-blue-400">
              7D
            </button>
            <button class="px-3 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:bg-gray-700">
              30D
            </button>
          </div>
        </div>
        <div class="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          <div class="text-center">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            <p>Chart will be displayed here</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions with Role-Based Access -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
        <div class="space-y-4">
          <!-- Create License - Operators and Admins only -->
          <button 
            v-if="canManageLicenses"
            @click="goToLicenses" 
            class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center"
          >
            <PlusCircleIcon class="mr-3 w-5 h-5" />
            Create New License
          </button>
          
          <!-- Bulk Generator - Operators and Admins only -->
          <button 
            v-if="canManageLicenses"
            @click="goToBulkLicenses"
            class="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center"
          >
            <DuplicateIcon class="mr-3 w-5 h-5" />
            Bulk Generator
          </button>
          
          <!-- View Analytics - All roles -->
          <button 
            @click="goToAnalytics"
            class="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center"
          >
            <ChartBarIcon class="mr-3 w-5 h-5" />
            View Analytics
          </button>
          
          <!-- User Management - Admins only -->
          <button 
            v-if="canManageUsers"
            @click="goToUsers"
            class="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center"
          >
            <UsersIcon class="mr-3 w-5 h-5" />
            Manage Users
          </button>
          
          <!-- System Settings - Admins only -->
          <button 
            v-if="canManageSettings"
            @click="goToSettings"
            class="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center"
          >
            <CogIcon class="mr-3 w-5 h-5" />
            System Settings
          </button>
          
          <!-- Viewer Message -->
          <div v-if="isViewer && !canManageLicenses" class="text-center py-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div class="flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p class="text-blue-800 dark:text-blue-200 text-sm font-medium">
                Viewer Access - Read-only permissions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Latest system events</p>
          </div>
          <router-link to="/activity" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View all
          </router-link>
        </div>
      </div>
      <div class="p-6">
        <div class="flow-root">
          <ul class="-mb-8">
            <li v-for="(activity, idx) in recentActivity" :key="activity.date" class="relative pb-8">
              <div v-if="idx !== recentActivity.length - 1" class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"/>
              <div class="relative flex space-x-3">
                <div :class="getActivityIconBg(activity.action)" class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                  <component :is="getActivityIcon(activity.action)" class="h-4 w-4 text-white" />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ activity.action }}</p>
                    <time class="text-sm text-gray-500 dark:text-gray-400">
                      {{ formatDate(activity.date) }}
                    </time>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ activity.details }}</p>
                </div>
              </div>
            </li>
            <li v-if="recentActivity.length === 0" class="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
              No recent activity
            </li>
          </ul>
        </div>
      </div>
    </div>
  </ModernLayout>
</template>

<script>
import { ref, onMounted, onUnmounted, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useSmartAPI } from '../composables/useSmartAPI'
import ModernLayout from '../components/ModernLayout.vue'

export default {
  components: { ModernLayout },
  setup() {
    const router = useRouter()
    const { smartFetch, loading, error, invalidateCache } = useSmartAPI()
    const { 
      user, role, isAdmin, isOperator, isViewer, 
      canManageLicenses, canManageUsers, canManageSettings 
    } = useAuth()
    
    const stats = ref([
      {
        name: 'Total Licenses',
        value: '0',
        change: '+12%',
        changeType: 'increase',
        icon: KeyIcon,
        iconBg: 'bg-blue-100 dark:bg-blue-900/20',
        iconColor: 'text-blue-600 dark:text-blue-400',
      },
      {
        name: 'Active Licenses',
        value: '0',
        change: '+8%',
        changeType: 'increase',
        icon: CheckCircleIcon,
        iconBg: 'bg-green-100 dark:bg-green-900/20',
        iconColor: 'text-green-600 dark:text-green-400',
      },
      {
        name: 'Banned HWIDs',
        value: '0',
        change: '+2%',
        changeType: 'increase',
        icon: ShieldExclamationIcon,
        iconBg: 'bg-red-100 dark:bg-red-900/20',
        iconColor: 'text-red-600 dark:text-red-400',
      },
      {
        name: 'Validations Today',
        value: '0',
        change: '+24%',
        changeType: 'increase',
        icon: ChartBarIcon,
        iconBg: 'bg-purple-100 dark:bg-purple-900/20',
        iconColor: 'text-purple-600 dark:text-purple-400',
      },
    ])

    const recentActivity = ref([])
    const lastUpdated = ref(null)
    const nextRefreshIn = ref('')
    let refreshInterval = null
    let refreshCountdown = null

    const loadDashboardData = async (forceRefresh = false) => {
      try {
        console.log(forceRefresh ? '🌐 API calls: Forced refresh' : '📋 Checking cache first...')

        // Use smart fetch with caching
        const [licenses, banlist, activities] = await Promise.all([
          smartFetch('/api/licenses', {}, 'dashboard-licenses', forceRefresh)
            .catch(() => ({})), // Fallback to empty object
          smartFetch('/api/banlist', {}, 'dashboard-banlist', forceRefresh)
            .catch(() => []), // Fallback to empty array
          smartFetch('/api/activity?limit=5', {}, 'dashboard-activity', forceRefresh)
            .catch(() => []) // Fallback to empty array
        ])

        // Update stats
        const total = Object.keys(licenses).length
        const active = Object.values(licenses).filter(l => l.hwid).length
        stats.value[0].value = total.toString()
        stats.value[1].value = active.toString()
        stats.value[2].value = banlist.length.toString()

        recentActivity.value = activities.slice(0, 5)
        lastUpdated.value = new Date()
        
        console.log('📊 Dashboard updated:', { total, active, banned: banlist.length, fromCache: !forceRefresh })
      } catch (err) {
        console.error('Dashboard load error:', err)
      }
    }

    // Auto-refresh only every 5 minutes
    const startAutoRefresh = () => {
      let timeLeft = 5 * 60 // 5 minutes in seconds
      
      refreshCountdown = setInterval(() => {
        timeLeft--
        const minutes = Math.floor(timeLeft / 60)
        const seconds = timeLeft % 60
        nextRefreshIn.value = `${minutes}:${seconds.toString().padStart(2, '0')}`
        
        if (timeLeft <= 0) {
          timeLeft = 5 * 60 // Reset
        }
      }, 1000)

      refreshInterval = setInterval(() => {
        console.log('🔄 Auto-refreshing dashboard (5min interval)')
        loadDashboardData(true) // Force refresh every 5 minutes
        timeLeft = 5 * 60 // Reset countdown
      }, 5 * 60 * 1000) // 5 minutes
    }

    // Manual refresh function
    const manualRefresh = () => {
      console.log('👆 Manual refresh triggered')
      loadDashboardData(true)
    }

    const formatDate = (dateInput) => {
      const date = dateInput instanceof Date ? dateInput : new Date(dateInput)
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
    }

    const getActivityIconBg = (action) => {
      if (action.includes('LOGIN')) return 'bg-green-500'
      if (action.includes('FAILED')) return 'bg-red-500'
      if (action.includes('CREATED')) return 'bg-blue-500'
      if (action.includes('DELETED')) return 'bg-red-500'
      if (action.includes('UPDATED')) return 'bg-yellow-500'
      return 'bg-gray-500'
    }

    const getActivityIcon = (action) => {
      if (action.includes('LOGIN')) return CheckCircleIcon
      if (action.includes('FAILED')) return XCircleIcon
      if (action.includes('CREATED')) return PlusCircleIcon
      if (action.includes('DELETED')) return TrashIcon
      if (action.includes('UPDATED')) return PencilIcon
      return InformationCircleIcon
    }

    // Navigation functions
    const goToLicenses = () => router.push('/licenses')
    const goToBulkLicenses = () => canManageLicenses.value && router.push('/bulk-licenses')
    const goToAnalytics = () => router.push('/analytics')
    const goToUsers = () => canManageUsers.value && router.push('/users')
    const goToSettings = () => canManageSettings.value && router.push('/settings')

    onMounted(() => {
      loadDashboardData() // Initial load (uses cache if available)
      startAutoRefresh()
    })

    onUnmounted(() => {
      if (refreshInterval) clearInterval(refreshInterval)
      if (refreshCountdown) clearInterval(refreshCountdown)
    })

    return {
      stats,
      recentActivity,
      loading,
      error,
      lastUpdated,
      nextRefreshIn,
      user, role, isAdmin, isOperator, isViewer,
      canManageLicenses, canManageUsers, canManageSettings,
      manualRefresh,
      formatDate,
      getActivityIconBg,
      getActivityIcon,
      goToLicenses,
      goToBulkLicenses,
      goToAnalytics,
      goToUsers,
      goToSettings
    }
  },
}

// Icon components using h()
function KeyIcon() {
  return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z' })
  ])
}

function CheckCircleIcon() {
  return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' })
  ])
}

function ShieldExclamationIcon() {
  return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01' })
  ])
}

function ChartBarIcon() {
  return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' })
  ])
}

function XCircleIcon() {
  return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' })
  ])
}

function PlusCircleIcon() {
  return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z' })
  ])
}

function TrashIcon() {
  return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' })
  ])
}

function InformationCircleIcon() {
  return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
  ])
}

function CogIcon() {
  return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }),
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' })
  ])
}

function DuplicateIcon() {
  return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z' })
  ])
}

function UsersIcon() {
  return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z' })
  ])
}

function PencilIcon() {
  return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' })
  ])
}
</script>
