<template>
  <ModernLayout>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">System Settings</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">
        Configure system behavior and security settings
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- General Settings -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">General Settings</h3>
        
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-gray-900 dark:text-white">Maintenance Mode</label>
              <p class="text-sm text-gray-500 dark:text-gray-400">Disable all API endpoints</p>
            </div>
            <button
              @click="toggleSetting('maintenanceMode')"
              :class="settings.maintenanceMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
            >
              <span
                :class="settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'"
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              />
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-gray-900 dark:text-white">Registration Enabled</label>
              <p class="text-sm text-gray-500 dark:text-gray-400">Allow new license registrations</p>
            </div>
            <button
              @click="toggleSetting('registrationEnabled')"
              :class="settings.registrationEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
            >
              <span
                :class="settings.registrationEnabled ? 'translate-x-6' : 'translate-x-1'"
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              />
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-gray-900 dark:text-white">Auto Cleanup Expired</label>
              <p class="text-sm text-gray-500 dark:text-gray-400">Automatically remove expired licenses</p>
            </div>
            <button
              @click="toggleSetting('autoCleanupExpired')"
              :class="settings.autoCleanupExpired ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
            >
              <span
                :class="settings.autoCleanupExpired ? 'translate-x-6' : 'translate-x-1'"
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              />
            </button>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Validation Timeout (seconds)
            </label>
            <input
              v-model.number="settings.validationTimeout"
              type="number"
              min="5"
              max="300"
              class="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Max Licenses per HWID
            </label>
            <input
              v-model.number="settings.maxLicensesPerHwid"
              type="number"
              min="1"
              max="10"
              class="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <!-- Security Settings -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Security & Monitoring</h3>
        
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</label>
              <p class="text-sm text-gray-500 dark:text-gray-400">Send alerts for security events</p>
            </div>
            <button
              @click="toggleSetting('emailNotifications')"
              :class="settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
            >
              <span
                :class="settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'"
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              />
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-gray-900 dark:text-white">Backup Enabled</label>
              <p class="text-sm text-gray-500 dark:text-gray-400">Automatic system backups</p>
            </div>
            <button
              @click="toggleSetting('backupEnabled')"
              :class="settings.backupEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
            >
              <span
                :class="settings.backupEnabled ? 'translate-x-6' : 'translate-x-1'"
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              />
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-gray-900 dark:text-white">Debug Mode</label>
              <p class="text-sm text-gray-500 dark:text-gray-400">Enable detailed logging</p>
            </div>
            <button
              @click="toggleSetting('debugMode')"
              :class="settings.debugMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
            >
              <span
                :class="settings.debugMode ? 'translate-x-6' : 'translate-x-1'"
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              />
            </button>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div class="flex space-x-4">
            <button @click="saveSettings" :disabled="saving" class="btn-primary">
              {{ saving ? 'Saving...' : 'Save Settings' }}
            </button>
            <button @click="createBackup" :disabled="creatingBackup" class="btn-secondary">
              {{ creatingBackup ? 'Creating...' : 'Create Backup' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Backups -->
    <div class="mt-8 card p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Backups</h3>
        <button @click="loadBackups" class="text-blue-600 hover:text-blue-700 text-sm">
          Refresh
        </button>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Backup ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Created
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Size
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="backup in backups" :key="backup.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/40">
              <td class="px-6 py-4 whitespace-nowrap font-mono text-sm">{{ backup.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">{{ formatDate(backup.timestamp) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">{{ calculateBackupSize(backup) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button class="text-blue-600 hover:text-blue-900">Download</button>
              </td>
            </tr>
          </tbody>
        </table>
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
    const settings = ref({
      maintenanceMode: false,
      registrationEnabled: true,
      validationTimeout: 30,
      maxLicensesPerHwid: 1,
      autoCleanupExpired: false,
      emailNotifications: false,
      backupEnabled: true,
      debugMode: false
    })
    
    const backups = ref([])
    const saving = ref(false)
    const creatingBackup = ref(false)

    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings', { credentials: 'include' })
        const data = await response.json()
        settings.value = { ...settings.value, ...data }
      } catch (error) {
        console.error('Failed to load settings:', error)
      }
    }

    const loadBackups = async () => {
      try {
        const response = await fetch('/api/backups', { credentials: 'include' })
        backups.value = await response.json()
      } catch (error) {
        console.error('Failed to load backups:', error)
      }
    }

    const toggleSetting = (key) => {
      settings.value[key] = !settings.value[key]
    }

    const saveSettings = async () => {
      saving.value = true
      try {
        const response = await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(settings.value)
        })
        
        if (response.ok) {
          // Show success message
          console.log('Settings saved successfully')
        }
      } catch (error) {
        console.error('Failed to save settings:', error)
      } finally {
        saving.value = false
      }
    }

    const createBackup = async () => {
      creatingBackup.value = true
      try {
        const response = await fetch('/api/backup', {
          method: 'POST',
          credentials: 'include'
        })
        
        const result = await response.json()
        if (result.success) {
          await loadBackups()
          console.log('Backup created successfully')
        }
      } catch (error) {
        console.error('Failed to create backup:', error)
      } finally {
        creatingBackup.value = false
      }
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString() + ' ' + 
             new Date(dateString).toLocaleTimeString()
    }

    const calculateBackupSize = (backup) => {
      // Estimate backup size based on content
      const licensesCount = Object.keys(backup.licenses || {}).length
      const banlistCount = (backup.banlist || []).length
      const estimatedSize = (licensesCount * 0.5) + (banlistCount * 0.1) + 1 // KB
      return `${estimatedSize.toFixed(1)} KB`
    }

    onMounted(() => {
      loadSettings()
      loadBackups()
    })

    return {
      settings,
      backups,
      saving,
      creatingBackup,
      toggleSetting,
      saveSettings,
      createBackup,
      loadBackups,
      formatDate,
      calculateBackupSize
    }
  }
}
</script>
