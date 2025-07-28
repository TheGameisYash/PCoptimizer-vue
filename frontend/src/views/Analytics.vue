<template>
  <ModernLayout>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">
        System performance and usage analytics
      </p>
    </div>

    <!-- Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div
        v-for="metric in overviewMetrics"
        :key="metric.name"
        class="card p-6 hover:shadow-lg transition-all duration-200"
      >
        <div class="flex items-center">
          <div :class="metric.iconBg" class="w-12 h-12 rounded-xl flex items-center justify-center">
            <component :is="metric.icon" :class="metric.iconColor" class="w-6 h-6" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ metric.name }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ metric.value }}</p>
          </div>
        </div>
        <div class="mt-4 flex items-baseline">
          <p :class="metric.trend > 0 ? 'text-green-600' : 'text-red-600'" class="text-sm font-medium">
            {{ metric.trend > 0 ? '+' : '' }}{{ metric.trend }}%
          </p>
          <p class="ml-2 text-sm text-gray-500 dark:text-gray-400">vs last month</p>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Daily Activity Chart -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daily Activity</h3>
        <div class="h-64">
          <canvas ref="activityChart"></canvas>
        </div>
      </div>

      <!-- License Status Distribution -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">License Distribution</h3>
        <div class="h-64">
          <canvas ref="distributionChart"></canvas>
        </div>
      </div>
    </div>

    <!-- System Performance -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">System Performance</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">Memory Usage</p>
          <div class="mt-2">
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                class="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
                :style="{ width: `${memoryUsagePercent}%` }"
              ></div>
            </div>
            <p class="mt-1 text-sm font-medium">{{ memoryUsagePercent }}%</p>
          </div>
        </div>
        
        <div class="text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">Uptime</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatUptime(performance.uptime) }}</p>
        </div>
        
        <div class="text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">CPU Cores</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ performance.systemInfo?.cpus || 0 }}</p>
        </div>
      </div>
    </div>
  </ModernLayout>
</template>

<script>
import { ref, onMounted, h } from 'vue'
import ModernLayout from '../components/ModernLayout.vue'

export default {
  components: { ModernLayout },
  setup() {
    const analytics = ref({})
    const overviewMetrics = ref([])
    const performance = ref({})
    const memoryUsagePercent = ref(0)
    const activityChart = ref(null)
    const distributionChart = ref(null)

    const loadAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics', { credentials: 'include' })
        analytics.value = await response.json()
        
        const overview = analytics.value.overview || {}
        performance.value = analytics.value.performance || {}
        
        overviewMetrics.value = [
          {
            name: 'Total API Calls',
            value: overview.apiCalls || 0,
            trend: 12,
            icon: ChartBarIcon,
            iconBg: 'bg-blue-100 dark:bg-blue-900/20',
            iconColor: 'text-blue-600 dark:text-blue-400'
          },
          {
            name: 'Validations',
            value: overview.validationCalls || 0,
            trend: 8,
            icon: CheckCircleIcon,
            iconBg: 'bg-green-100 dark:bg-green-900/20',
            iconColor: 'text-green-600 dark:text-green-400'
          },
          {
            name: 'Security Events',
            value: overview.securityEvents || 0,
            trend: -5,
            icon: ShieldExclamationIcon,
            iconBg: 'bg-red-100 dark:bg-red-900/20',
            iconColor: 'text-red-600 dark:text-red-400'
          },
          {
            name: 'Active Licenses',
            value: overview.activeLicenses || 0,
            trend: 15,
            icon: KeyIcon,
            iconBg: 'bg-purple-100 dark:bg-purple-900/20',
            iconColor: 'text-purple-600 dark:text-purple-400'
          }
        ]

        // Calculate memory usage percentage
        if (performance.value.memoryUsage) {
          const used = performance.value.memoryUsage.heapUsed
          const total = performance.value.memoryUsage.heapTotal
          memoryUsagePercent.value = Math.round((used / total) * 100)
        }

        // Initialize charts
        await initCharts()
      } catch (error) {
        console.error('Failed to load analytics:', error)
      }
    }

    const initCharts = async () => {
      // You can use Chart.js here for actual charts
      // For now, showing placeholder logic
      console.log('Charts would be initialized here with:', analytics.value.charts)
    }

    const formatUptime = (seconds) => {
      const days = Math.floor(seconds / (24 * 60 * 60))
      const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
      const minutes = Math.floor((seconds % (60 * 60)) / 60)
      
      if (days > 0) return `${days}d ${hours}h`
      if (hours > 0) return `${hours}h ${minutes}m`
      return `${minutes}m`
    }

    onMounted(loadAnalytics)

    return {
      overviewMetrics,
      performance,
      memoryUsagePercent,
      activityChart,
      distributionChart,
      formatUptime
    }
  }
}

// Icon components
function ChartBarIcon() {
  return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
    })
  ])
}

function CheckCircleIcon() {
  return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    })
  ])
}

function ShieldExclamationIcon() {
  return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01'
    })
  ])
}

function KeyIcon() {
  return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z'
    })
  ])
}
</script>
