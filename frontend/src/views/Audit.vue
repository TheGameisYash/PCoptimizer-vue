<template>
  <ModernLayout>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Audit Trail</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">
        Complete audit trail for compliance and security monitoring
      </p>
    </div>

    <!-- Filters -->
    <div class="card p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <select
          v-model="filters.category"
          class="rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          <option value="AUTHENTICATION">Authentication</option>
          <option value="LICENSE_MANAGEMENT">License Management</option>
          <option value="SECURITY">Security</option>
          <option value="API_USAGE">API Usage</option>
          <option value="SYSTEM">System</option>
        </select>

        <select
          v-model="filters.severity"
          class="rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Severities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>

        <input
          v-model="filters.dateFrom"
          type="date"
          class="rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button @click="applyFilters" class="btn-primary">
          Apply Filters
        </button>
      </div>
    </div>

    <!-- Audit Table -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Timestamp
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Action
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                User
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Severity
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                IP Address
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="audit in auditLogs" :key="audit.auditId" class="hover:bg-gray-50 dark:hover:bg-gray-800/40">
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                {{ formatDate(audit.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getActionBadgeClass(audit.action)" class="px-2 py-1 text-xs font-semibold rounded-full">
                  {{ audit.action }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {{ audit.userId }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                {{ audit.category }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getSeverityBadgeClass(audit.severity)" class="px-2 py-1 text-xs font-semibold rounded-full">
                  {{ audit.severity }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono">
                {{ audit.ip }}
              </td>
              <td class="px-6 py-4 text-sm max-w-xs truncate">
                {{ audit.details }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-gray-50 dark:bg-gray-800 px-6 py-3 flex items-center justify-between">
        <div class="text-sm text-gray-700 dark:text-gray-300">
          Showing {{ auditLogs.length }} entries
        </div>
        <div class="flex space-x-2">
          <button @click="loadMore" :disabled="loading" class="btn-secondary text-sm">
            {{ loading ? 'Loading...' : 'Load More' }}
          </button>
          <button @click="exportAudit" class="btn-secondary text-sm">
            Export CSV
          </button>
        </div>
      </div>
    </div>
  </ModernLayout>
</template>

<script>
import { ref, onMounted } from 'vue'
import ModernLayout from '../components/ModernLayout.vue'

export default {
  components: { ModernLayout },
  setup() {
    const auditLogs = ref([])
    const loading = ref(false)
    const filters = ref({
      category: '',
      severity: '',
      dateFrom: ''
    })

    const loadAuditLogs = async () => {
      loading.value = true
      try {
        const params = new URLSearchParams()
        if (filters.value.category) params.set('category', filters.value.category)
        if (filters.value.severity) params.set('severity', filters.value.severity)
        
        const response = await fetch(`/api/audit?${params.toString()}`, { 
          credentials: 'include' 
        })
        auditLogs.value = await response.json()
      } catch (error) {
        console.error('Failed to load audit logs:', error)
      } finally {
        loading.value = false
      }
    }

    const applyFilters = () => {
      loadAuditLogs()
    }

    const loadMore = () => {
      // Implement pagination
      loadAuditLogs()
    }

    const exportAudit = () => {
      // Convert audit logs to CSV and trigger download
      const csvContent = convertToCSV(auditLogs.value)
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `audit-trail-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }

    const convertToCSV = (data) => {
      const headers = ['Timestamp', 'Action', 'User', 'Category', 'Severity', 'IP', 'Details']
      const rows = data.map(item => [
        item.date,
        item.action,
        item.userId,
        item.category,
        item.severity,
        item.ip,
        item.details
      ])
      
      return [headers, ...rows].map(row => 
        row.map(field => `"${field}"`).join(',')
      ).join('\n')
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString() + ' ' + 
             new Date(dateString).toLocaleTimeString()
    }

    const getActionBadgeClass = (action) => {
      if (action.includes('LOGIN')) return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      if (action.includes('FAILED')) return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      if (action.includes('CREATED')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      if (action.includes('DELETED')) return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }

    const getSeverityBadgeClass = (severity) => {
      if (severity === 'HIGH') return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      if (severity === 'MEDIUM') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    }

    onMounted(loadAuditLogs)

    return {
      auditLogs,
      loading,
      filters,
      applyFilters,
      loadMore,
      exportAudit,
      formatDate,
      getActionBadgeClass,
      getSeverityBadgeClass
    }
  }
}
</script>
