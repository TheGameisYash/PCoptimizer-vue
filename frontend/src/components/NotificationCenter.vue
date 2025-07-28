<template>
  <div class="relative">
    <!-- Notification Bell -->
    <button
      @click="toggleNotifications"
      class="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5c-3 3-7-1-4-4l4 4zM9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <!-- Slide-in Notification Panel -->
    <Teleport to="body">
      <!-- Background Overlay -->
      <div
        v-if="showNotifications"
        class="fixed inset-0 z-[9999] bg-black bg-opacity-30 transition-opacity duration-300"
        @click="showNotifications = false"
      ></div>

      <!-- Notification Panel -->
      <div
        v-if="showNotifications"
        class="fixed top-0 right-0 h-full w-96 bg-white dark:bg-gray-800 shadow-2xl z-[10000] transform transition-transform duration-300 ease-in-out"
        :class="showNotifications ? 'translate-x-0' : 'translate-x-full'"
        @click.stop
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5c-3 3-7-1-4-4l4 4zM9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white">Notifications</h3>
          </div>
          <button @click="showNotifications = false" class="text-white hover:text-gray-200 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Cache Status -->
        <div v-if="lastUpdated" class="px-6 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
            Cached: {{ formatDate(lastUpdated) }} | Next check: {{ nextCheckIn }}
          </p>
        </div>

        <!-- Action Bar -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ unreadCount }} unread notifications
            </span>
            <div class="flex space-x-3">
              <button 
                @click="markAllAsRead" 
                :disabled="loading"
                class="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors disabled:opacity-50"
              >
                Mark all read
              </button>
              <button 
                @click="clearAllNotifications" 
                :disabled="loading"
                class="text-red-600 hover:text-red-700 text-sm font-medium transition-colors disabled:opacity-50"
              >
                Clear all
              </button>
            </div>
          </div>
        </div>
        
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>

        <!-- Notifications List -->
        <div v-else class="flex-1 overflow-y-auto h-full pb-20">
          <div
            v-for="notification in notifications"
            :key="notification.id"
            :class="notification.read ? 'bg-white dark:bg-gray-800' : 'bg-blue-50 dark:bg-blue-900/20'"
            class="p-6 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200"
            @click="markAsRead(notification.id)"
          >
            <div class="flex items-start space-x-4">
              <div :class="getNotificationIcon(notification.type)" class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
                <component :is="getIconComponent(notification.type)" class="w-5 h-5 text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ notification.title }}</p>
                  <div v-if="!notification.read" class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">{{ notification.message }}</p>
                <div class="flex items-center justify-between">
                  <p class="text-xs text-gray-500 dark:text-gray-500">{{ formatDate(notification.timestamp) }}</p>
                  <span v-if="notification.category" :class="getCategoryBadge(notification.category)" class="px-2 py-1 text-xs rounded-full">
                    {{ notification.category }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div v-if="notifications.length === 0" class="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5c-3 3-7-1-4-4l4 4zM9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No notifications yet</h4>
            <p class="text-sm text-gray-500 dark:text-gray-400">When you get notifications, they'll show up here</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="absolute bottom-0 left-0 right-0 p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <button 
            @click="viewAllNotifications"
            class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
          >
            View All Notifications
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { useSmartAPI } from '../composables/useSmartAPI'

export default {
  setup() {
    const router = useRouter()
    const { smartFetch, loading, invalidateCache } = useSmartAPI()
    const showNotifications = ref(false)
    const notifications = ref([])
    const lastUpdated = ref(null)
    const nextCheckIn = ref('')
    let pollInterval = null
    let countdownInterval = null
    
    const unreadCount = computed(() => 
      notifications.value.filter(n => !n.read).length
    )

    const toggleNotifications = async () => {
      showNotifications.value = !showNotifications.value
      
      if (showNotifications.value) {
        console.log('🔔 Opening notifications panel')
        await loadNotifications() // Uses cache if available
      }
    }

    const loadNotifications = async (forceRefresh = false) => {
      try {
        console.log(forceRefresh ? '🌐 API call: Loading notifications' : '📋 Checking notification cache...')
        const data = await smartFetch('/api/notifications', {}, 'notifications-list', forceRefresh)
        notifications.value = data.notifications || []
        lastUpdated.value = new Date()
        console.log('🔔 Notifications loaded:', notifications.value.length, 'total,', unreadCount.value, 'unread')
      } catch (error) {
        console.error('Failed to load notifications:', error)
        // Fallback to localStorage
        const stored = localStorage.getItem('pc-optimizer-notifications')
        if (stored) {
          notifications.value = JSON.parse(stored)
          console.log('📋 Using localStorage fallback')
        }
      }
    }

    // Light polling - only check unread count, not full notifications
    const startLightPolling = () => {
      let timeLeft = 2 * 60 // 2 minutes in seconds
      
      countdownInterval = setInterval(() => {
        timeLeft--
        const minutes = Math.floor(timeLeft / 60)
        const seconds = timeLeft % 60
        nextCheckIn.value = `${minutes}:${seconds.toString().padStart(2, '0')}`
        
        if (timeLeft <= 0) {
          timeLeft = 2 * 60 // Reset
        }
      }, 1000)

      pollInterval = setInterval(async () => {
        if (!showNotifications.value) {
          try {
            console.log('🔍 Light polling: Checking notification count')
            const data = await smartFetch('/api/notifications/count', {}, 'notification-count', true)
            if (data.unread > unreadCount.value) {
              console.log('🆕 New notifications detected, loading full list')
              await loadNotifications(true)
            }
            timeLeft = 2 * 60 // Reset countdown
          } catch (error) {
            // Silently handle polling errors
            console.log('❌ Polling error (ignored):', error.message)
          }
        }
      }, 2 * 60 * 1000) // Check every 2 minutes
    }

    const markAsRead = async (id) => {
      const notification = notifications.value.find(n => n.id === id)
      if (!notification || notification.read) return

      try {
        const response = await fetch(`/api/notifications/${id}/read`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        })

        if (response.ok) {
          notification.read = true
          console.log('✅ Notification marked as read')
        } else {
          // Fallback to localStorage
          notification.read = true
          localStorage.setItem('pc-optimizer-notifications', JSON.stringify(notifications.value))
        }
      } catch (error) {
        console.error('Failed to mark notification as read:', error)
        // Fallback to localStorage
        notification.read = true
        localStorage.setItem('pc-optimizer-notifications', JSON.stringify(notifications.value))
      }
    }

    const markAllAsRead = async () => {
      if (loading.value) return
      
      try {
        console.log('🌐 API call: Mark all notifications as read')
        const response = await fetch('/api/notifications/mark-all-read', {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        })

        if (response.ok) {
          notifications.value.forEach(n => n.read = true)
          console.log('✅ All notifications marked as read')
        } else {
          // Fallback to localStorage
          notifications.value.forEach(n => n.read = true)
          localStorage.setItem('pc-optimizer-notifications', JSON.stringify(notifications.value))
        }
      } catch (error) {
        console.error('Failed to mark all notifications as read:', error)
        // Fallback to localStorage
        notifications.value.forEach(n => n.read = true)
        localStorage.setItem('pc-optimizer-notifications', JSON.stringify(notifications.value))
      }
    }

    const clearAllNotifications = async () => {
      if (loading.value || !confirm('Are you sure you want to clear all notifications?')) return

      try {
        console.log('🌐 API call: Clear all notifications')
        const response = await fetch('/api/notifications', {
          method: 'DELETE',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        })

        if (response.ok) {
          notifications.value = []
          invalidateCache('notifications-list')
          invalidateCache('notification-count')
          console.log('🗑️ All notifications cleared')
        } else {
          // Fallback to localStorage
          notifications.value = []
          localStorage.removeItem('pc-optimizer-notifications')
        }
      } catch (error) {
        console.error('Failed to clear notifications:', error)
        // Fallback to localStorage
        notifications.value = []
        localStorage.removeItem('pc-optimizer-notifications')
      }
    }

    const viewAllNotifications = () => {
      showNotifications.value = false
      router.push('/activity')
    }

    // Get notification icon background
    const getNotificationIcon = (type) => {
      switch (type) {
        case 'security': return 'bg-red-500'
        case 'license': return 'bg-blue-500'
        case 'system': return 'bg-green-500'
        case 'warning': return 'bg-yellow-500'
        case 'success': return 'bg-emerald-500'
        case 'info': return 'bg-cyan-500'
        default: return 'bg-gray-500'
      }
    }

    // Get notification icon component
    const getIconComponent = (type) => {
      switch (type) {
        case 'security': return ShieldIcon
        case 'license': return KeyIcon
        case 'system': return CogIcon
        case 'warning': return ExclamationIcon
        case 'success': return CheckIcon
        case 'info': return InfoIcon
        default: return InfoIcon
      }
    }

    // Get category badge styling
    const getCategoryBadge = (category) => {
      switch (category) {
        case 'SECURITY': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        case 'LICENSE': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
        case 'SYSTEM': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
        case 'WARNING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      }
    }

    // Format notification date
    const formatDate = (timestamp) => {
      const now = new Date()
      const date = new Date(timestamp)
      const diff = now - date
      
      if (diff < 60000) return 'Just now'
      if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
      if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`
      return date.toLocaleDateString()
    }

    // Handle keyboard shortcuts
    const handleKeydown = (event) => {
      if (event.key === 'Escape' && showNotifications.value) {
        showNotifications.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('keydown', handleKeydown)
      loadNotifications() // Initial load (uses cache if available)
      startLightPolling()
    })

    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeydown)
      if (pollInterval) clearInterval(pollInterval)
      if (countdownInterval) clearInterval(countdownInterval)
    })

    return {
      showNotifications,
      notifications,
      loading,
      unreadCount,
      lastUpdated,
      nextCheckIn,
      toggleNotifications,
      markAsRead,
      markAllAsRead,
      clearAllNotifications,
      viewAllNotifications,
      getNotificationIcon,
      getIconComponent,
      getCategoryBadge,
      formatDate
    }
  }
}

// Icon components using h() function
function ShieldIcon() {
  return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z' })
  ])
}

function KeyIcon() {
  return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z' })
  ])
}

function CogIcon() {
  return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' })
  ])
}

function ExclamationIcon() {
  return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' })
  ])
}

function CheckIcon() {
  return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M5 13l4 4L19 7' })
  ])
}

function InfoIcon() {
  return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
  ])
}
</script>
