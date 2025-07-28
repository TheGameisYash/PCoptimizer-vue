<template>
  <ModernLayout>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Activity Log</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">Full timeline of system events.</p>
    </div>

    <div class="card p-6">
      <ul class="-mb-8">
        <li
          v-for="(act, idx) in activities"
          :key="act.date"
          class="relative pb-8"
        >
          <div
            v-if="idx !== activities.length - 1"
            class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
          />
          <div class="relative flex space-x-3">
            <!-- Dot -->
            <span :class="dotBg(act.action)" class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
              <svg v-if="act.action.includes('LOGIN')" class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" />
              </svg>
              <svg v-else-if="act.action.includes('FAILED')" class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <svg v-else-if="act.action.includes('CREATED')" class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v6m3-3H9" />
              </svg>
              <svg v-else-if="act.action.includes('DELETED')" class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142M5 7l.867 12.142M6 7h12M10 11v6m4-6v6M9 7h6m2-3H7" />
              </svg>
              <svg v-else class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01" />
              </svg>
            </span>

            <!-- Content -->
            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ act.action }}</p>
                <time class="text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(act.date) }}
                </time>
              </div>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {{ act.details }}  <span v-if="act.ip" class="ml-2 text-xs text-gray-400">({{ act.ip }})</span>
              </p>
            </div>
          </div>
        </li>

        <li v-if="activities.length === 0" class="py-12 text-center text-sm text-gray-500">
          No activity yet.
        </li>
      </ul>
    </div>
  </ModernLayout>
</template>

<script>
import { ref, onMounted } from 'vue'
import ModernLayout from '../components/ModernLayout.vue'

export default {
  components: { ModernLayout },
  setup() {
    const activities = ref([])

    const load = async () => {
      try {
        const res = await fetch('/api/activity', { credentials: 'include' })
        activities.value = await res.json()
      } catch (e) {
        console.error('Load activity error', e)
      }
    }

    const formatDate = d =>
      new Date(d).toLocaleDateString() + ' ' + new Date(d).toLocaleTimeString()

    const dotBg = a => {
      if (a.includes('LOGIN')) return 'bg-green-500'
      if (a.includes('FAILED')) return 'bg-red-500'
      if (a.includes('CREATED')) return 'bg-blue-500'
      if (a.includes('DELETED')) return 'bg-red-500'
      return 'bg-gray-500'
    }

    onMounted(load)
    return { activities, formatDate, dotBg }
  }
}
</script>
