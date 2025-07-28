<template>
  <ModernLayout>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Banlist</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">
        Manage hardware IDs blocked from activation.
      </p>
    </div>

    <!-- Add HWID -->
    <div class="card p-6 mb-8">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Ban a HWID
      </h3>
      <form @submit.prevent="ban" class="flex flex-col md:flex-row gap-4">
        <input
          v-model="newHwid"
          type="text"
          placeholder="Enter HWID"
          class="flex-1 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button :disabled="saving" class="btn-primary">
          {{ saving ? 'Banning…' : 'Ban HWID' }}
        </button>
      </form>
    </div>

    <!-- List -->
    <div class="card p-0 overflow-hidden">
      <div class="max-h-[70vh] overflow-y-auto">
        <ul class="divide-y divide-gray-200 dark:divide-gray-700">
          <li
            v-for="h in banlist"
            :key="h"
            class="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/40"
          >
            <span class="font-mono text-sm text-gray-800 dark:text-gray-200 break-all">{{ h }}</span>
            <button @click="unban(h)" class="text-red-600 hover:text-red-700 text-sm">
              Unban
            </button>
          </li>
          <li v-if="banlist.length === 0" class="px-6 py-12 text-center text-sm text-gray-500">
            No banned HWIDs
          </li>
        </ul>
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
    const banlist = ref([])
    const newHwid = ref('')
    const saving = ref(false)

    const load = async () => {
      try {
        const res = await fetch('/api/banlist', { credentials: 'include' })
        banlist.value = await res.json()
      } catch (e) {
        console.error('Load banlist error', e)
      }
    }

    const ban = async () => {
      if (!newHwid.value.trim()) return
      saving.value = true
      try {
        const res = await fetch('/api/banlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ hwid: newHwid.value.trim() })
        })
        if (res.ok) {
          banlist.value.push(newHwid.value.trim())
          newHwid.value = ''
        }
      } catch (e) {
        console.error('Ban error', e)
      } finally {
        saving.value = false
      }
    }

    const unban = async hwid => {
      if (!confirm('Unban this HWID?')) return
      try {
        const res = await fetch(`/api/banlist/${hwid}`, {
          method: 'DELETE',
          credentials: 'include'
        })
        if (res.ok) banlist.value = banlist.value.filter(h => h !== hwid)
      } catch (e) {
        console.error('Unban error', e)
      }
    }

    onMounted(load)
    return { banlist, newHwid, saving, ban, unban }
  }
}
</script>
