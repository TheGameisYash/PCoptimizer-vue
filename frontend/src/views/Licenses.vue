<template>
  <ModernLayout>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">License Management</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Manage your software licenses and activations
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
      License data cached: {{ formatDate(lastUpdated) }} | Search is client-side (no API calls)
    </div>

    <!-- Create License Section (Only for operators and admins) -->
    <div v-if="canManageLicenses" class="card p-6 mb-8">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create New License</h3>
      
      <form @submit.prevent="createLicense" class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <input
          v-model="newLicense.prefix"
          type="text"
          placeholder="Prefix (e.g., PRO)"
          class="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          v-model="newLicense.expiry"
          type="date"
          class="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          v-model="newLicense.note"
          type="text"
          placeholder="Note (optional)"
          class="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          v-model.number="newLicense.maxActivations"
          type="number"
          min="1"
          placeholder="Max Activations"
          class="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button :disabled="creating" class="btn-primary">
          {{ creating ? 'Creating...' : 'Create License' }}
        </button>
      </form>

      <!-- Success Message -->
      <div v-if="createSuccess" class="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <p class="text-green-800 dark:text-green-200">{{ createSuccess }}</p>
        </div>
      </div>
    </div>

    <!-- Read-only message for viewers -->
    <div v-else class="card p-6 mb-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p class="text-blue-800 dark:text-blue-200">
          You have <strong>{{ role }}</strong> access. You can view licenses but cannot create or modify them.
        </p>
      </div>
    </div>

    <!-- Licenses Table -->
    <div class="card overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Licenses ({{ filteredLicenseCount }})
            </h3>
            
            <!-- Bulk Actions -->
            <div v-if="selectedLicenses.length > 0 && canDeleteLicenses" class="flex items-center space-x-2">
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ selectedLicenses.length }} selected
              </span>
              <button 
                @click="bulkDeleteLicenses"
                :disabled="bulkDeleting"
                class="flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50 transition-all duration-200"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                {{ bulkDeleting ? 'Deleting...' : 'Delete Selected' }}
              </button>
              <button 
                @click="clearSelection"
                class="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Clear Selection
              </button>
            </div>
          </div>
          
          <div class="flex space-x-2">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search licenses... (client-side)"
              class="rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select 
              v-model="statusFilter"
              class="rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div v-if="loading" class="flex items-center justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <!-- Bulk Select Header -->
              <th v-if="canDeleteLicenses" class="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  :indeterminate="isIndeterminate"
                  @change="toggleSelectAll"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">License Key</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">HWID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Expiry</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Note</th>
              <th v-if="canManageLicenses" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="(license, key) in filteredLicenses" :key="key" 
                :class="['hover:bg-gray-50 dark:hover:bg-gray-800/40', { 'bg-blue-50 dark:bg-blue-900/20': selectedLicenses.includes(key) }]">
              
              <!-- Bulk Select Checkbox -->
              <td v-if="canDeleteLicenses" class="px-6 py-4">
                <input
                  type="checkbox"
                  :value="key"
                  v-model="selectedLicenses"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </td>
              
              <td class="px-6 py-4 font-mono text-sm">{{ key }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center space-x-2">
                  <span :class="getLicenseStatusClass(license)" class="px-2 py-1 text-xs font-semibold rounded-full">
                    {{ getLicenseStatus(license) }}
                  </span>
                  <span v-if="getLicenseStatus(license) === 'Pending'" class="text-xs text-gray-500 dark:text-gray-400">
                    (Awaiting activation)
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 font-mono text-sm">{{ license.hwid || 'Not activated' }}</td>
              <td class="px-6 py-4 text-sm">{{ license.expiry ? formatDate(license.expiry) : 'Never' }}</td>
              <td class="px-6 py-4 text-sm">{{ formatDate(license.createdAt) }}</td>
              <td class="px-6 py-4 text-sm">{{ license.note || '-' }}</td>
              <td v-if="canManageLicenses" class="px-6 py-4 text-sm space-x-2">
                <button @click="editLicense(key, license)" class="text-blue-600 hover:text-blue-900">
                  Edit
                </button>
                <button v-if="canDeleteLicenses" @click="deleteLicense(key)" class="text-red-600 hover:text-red-900">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="Object.keys(filteredLicenses).length === 0" class="text-center py-12">
          <svg class="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z"/>
          </svg>
          <p class="text-gray-500 dark:text-gray-400">
            {{ searchQuery || statusFilter ? 'No licenses match your search criteria' : 'No licenses found' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Edit License Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Edit License: {{ editingLicense?.key }}
          </h3>
          
          <form @submit.prevent="updateLicense" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Note
              </label>
              <input
                v-model="editForm.note"
                type="text"
                class="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="License note"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Expiry Date
              </label>
              <input
                v-model="editForm.expiry"
                type="date"
                class="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Activations
              </label>
              <input
                v-model.number="editForm.maxActivations"
                type="number"
                min="1"
                class="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div class="flex items-center">
              <input
                v-model="editForm.isActive"
                type="checkbox"
                id="isActive"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label for="isActive" class="ml-2 text-sm text-gray-700 dark:text-gray-300">Active License</label>
            </div>

            <!-- HWID Reset Option -->
            <div v-if="editingLicense?.hwid" class="border-t pt-4">
              <div class="flex items-center">
                <input
                  v-model="editForm.resetHwid"
                  type="checkbox"
                  id="resetHwid"
                  class="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <label for="resetHwid" class="ml-2 text-sm text-red-700 dark:text-red-300">
                  Reset HWID (allow re-activation)
                </label>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Current HWID: {{ editingLicense.hwid }}
              </p>
            </div>

            <div v-if="updateError" class="text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              {{ updateError }}
            </div>
            
            <div class="flex space-x-4 pt-4">
              <button type="submit" :disabled="updating" class="btn-primary flex-1">
                {{ updating ? 'Updating...' : 'Update License' }}
              </button>
              <button type="button" @click="closeEditModal" class="btn-secondary flex-1">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Bulk Delete Confirmation Modal -->
    <div v-if="showBulkDeleteModal" class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <svg class="w-8 h-8 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Confirm Bulk Delete
            </h3>
          </div>
          
          <div class="mb-6">
            <p class="text-gray-700 dark:text-gray-300 mb-4">
              Are you sure you want to delete <strong>{{ selectedLicenses.length }}</strong> selected licenses?
            </p>
            
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 max-h-32 overflow-y-auto">
              <div class="text-sm font-mono text-gray-600 dark:text-gray-400 space-y-1">
                <div v-for="licenseKey in selectedLicenses.slice(0, 5)" :key="licenseKey">
                  {{ licenseKey }}
                </div>
                <div v-if="selectedLicenses.length > 5" class="text-gray-500">
                  ... and {{ selectedLicenses.length - 5 }} more
                </div>
              </div>
            </div>
            
            <p class="text-red-600 text-sm mt-4 font-medium">
              ⚠️ This action cannot be undone!
            </p>
          </div>
          
          <div class="flex space-x-4">
            <button 
              @click="confirmBulkDelete"
              :disabled="bulkDeleting"
              class="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-red-700 disabled:opacity-50 transition-all duration-200"
            >
              {{ bulkDeleting ? 'Deleting...' : `Delete ${selectedLicenses.length} Licenses` }}
            </button>
            <button 
              @click="cancelBulkDelete"
              class="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 py-3 px-4 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </ModernLayout>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useSmartAPI } from '../composables/useSmartAPI'
import ModernLayout from '../components/ModernLayout.vue'

export default {
  components: { ModernLayout },
  setup() {
    const { canManageLicenses, canDeleteLicenses, role } = useAuth()
    const { smartFetch, loading, invalidateCache } = useSmartAPI()
    
    const licenses = ref({})
    const searchQuery = ref('')
    const statusFilter = ref('')
    const creating = ref(false)
    const updating = ref(false)
    const bulkDeleting = ref(false)
    const lastUpdated = ref(null)
    const updateError = ref('')
    const createSuccess = ref('')
    
    // Bulk selection state
    const selectedLicenses = ref([])
    const showBulkDeleteModal = ref(false)
    
    // Edit modal state
    const showEditModal = ref(false)
    const editingLicense = ref(null)
    const editForm = ref({
      note: '',
      expiry: '',
      maxActivations: 1,
      isActive: true,
      resetHwid: false
    })

    const newLicense = ref({
      prefix: '',
      expiry: '',
      note: '',
      maxActivations: 1
    })

    // Client-side filtering (no API calls)
    const filteredLicenses = computed(() => {
      let filtered = { ...licenses.value }
      
      // Apply search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = Object.fromEntries(
          Object.entries(filtered).filter(([key, license]) =>
            key.toLowerCase().includes(query) ||
            license.note?.toLowerCase().includes(query) ||
            license.hwid?.toLowerCase().includes(query)
          )
        )
      }
      
      // Apply status filter
      if (statusFilter.value) {
        filtered = Object.fromEntries(
          Object.entries(filtered).filter(([, license]) =>
            getLicenseStatus(license).toLowerCase() === statusFilter.value
          )
        )
      }
      
      return filtered
    })

    const filteredLicenseCount = computed(() => Object.keys(filteredLicenses.value).length)

    // Bulk selection computed properties
    const filteredLicenseKeys = computed(() => Object.keys(filteredLicenses.value))
    
    const isAllSelected = computed(() => {
      return filteredLicenseKeys.value.length > 0 && 
             filteredLicenseKeys.value.every(key => selectedLicenses.value.includes(key))
    })
    
    const isIndeterminate = computed(() => {
      return selectedLicenses.value.length > 0 && !isAllSelected.value
    })

    // Load licenses with smart caching
    const loadLicenses = async (forceRefresh = false) => {
      try {
        console.log(forceRefresh ? '🌐 API call: Loading licenses' : '📋 Checking license cache...')
        const data = await smartFetch('/api/licenses', {}, 'licenses-list', forceRefresh)
        licenses.value = data
        lastUpdated.value = new Date()
        console.log('📄 Licenses loaded:', Object.keys(data).length, 'total')
      } catch (error) {
        console.error('Failed to load licenses:', error)
      }
    }

    // Manual refresh
    const manualRefresh = () => {
      console.log('👆 Manual license refresh')
      loadLicenses(true)
    }

    // Bulk selection functions
    const toggleSelectAll = () => {
      if (isAllSelected.value) {
        selectedLicenses.value = []
      } else {
        selectedLicenses.value = [...filteredLicenseKeys.value]
      }
    }

    const clearSelection = () => {
      selectedLicenses.value = []
    }

    const bulkDeleteLicenses = () => {
      if (selectedLicenses.value.length === 0) return
      showBulkDeleteModal.value = true
    }

    const confirmBulkDelete = async () => {
      if (!canDeleteLicenses.value || selectedLicenses.value.length === 0) return
      
      bulkDeleting.value = true
      
      try {
        console.log(`🌐 API calls: Bulk deleting ${selectedLicenses.value.length} licenses`)
        
        // Delete licenses in parallel (but with some delay to not overwhelm server)
        const deletePromises = selectedLicenses.value.map((licenseKey, index) => {
          return new Promise((resolve) => {
            setTimeout(async () => {
              try {
                const response = await fetch(`/api/licenses/${licenseKey}`, {
                  method: 'DELETE',
                  credentials: 'include'
                })
                resolve({ licenseKey, success: response.ok })
              } catch (error) {
                resolve({ licenseKey, success: false, error: error.message })
              }
            }, index * 100) // 100ms delay between each delete
          })
        })
        
        const results = await Promise.all(deletePromises)
        const successful = results.filter(r => r.success).length
        const failed = results.filter(r => !r.success).length
        
        if (successful > 0) {
          // Invalidate caches
          invalidateCache('licenses-list')
          invalidateCache('dashboard-licenses')
          
          // Reload data
          await loadLicenses(true)
          
          console.log(`✅ Bulk delete completed: ${successful} successful, ${failed} failed`)
        }
        
        // Clear selection and close modal
        selectedLicenses.value = []
        showBulkDeleteModal.value = false
        
        if (failed > 0) {
          alert(`${successful} licenses deleted successfully, ${failed} failed to delete.`)
        }
        
      } catch (error) {
        console.error('Bulk delete error:', error)
        alert('An error occurred during bulk delete. Some licenses may not have been deleted.')
      } finally {
        bulkDeleting.value = false
      }
    }

    const cancelBulkDelete = () => {
      showBulkDeleteModal.value = false
    }

    // Clear selection when filters change
    watch([searchQuery, statusFilter], () => {
      selectedLicenses.value = []
      console.log('🔍 Client-side filter applied:', { 
        search: searchQuery.value, 
        status: statusFilter.value,
        results: filteredLicenseCount.value 
      })
    })

    // ... (rest of the existing functions remain the same)
    const createLicense = async () => {
      if (!canManageLicenses.value) return
      
      creating.value = true
      createSuccess.value = ''
      
      try {
        console.log('🌐 API call: Creating license')
        const response = await fetch('/api/licenses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(newLicense.value)
        })
        
        if (response.ok) {
          const data = await response.json()
          
          invalidateCache('licenses-list')
          invalidateCache('dashboard-licenses')
          await loadLicenses(true)
          
          newLicense.value = { prefix: '', expiry: '', note: '', maxActivations: 1 }
          createSuccess.value = `License ${data.licenseKey} created successfully!`
          
          setTimeout(() => {
            createSuccess.value = ''
          }, 5000)
          
          console.log('✅ License created successfully:', data.licenseKey)
        } else {
          const errorData = await response.json()
          console.error('Failed to create license:', errorData.error)
        }
      } catch (error) {
        console.error('Failed to create license:', error)
      } finally {
        creating.value = false
      }
    }

    const editLicense = (licenseKey, license) => {
      editingLicense.value = { key: licenseKey, ...license }
      editForm.value = {
        note: license.note || '',
        expiry: license.expiry || '',
        maxActivations: license.maxActivations || 1,
        isActive: license.isActive !== false,
        resetHwid: false
      }
      updateError.value = ''
      showEditModal.value = true
      console.log('✏️ Editing license:', licenseKey)
    }

    const updateLicense = async () => {
      if (!canManageLicenses.value || !editingLicense.value) return
      
      updating.value = true
      updateError.value = ''
      
      try {
        console.log('🌐 API call: Updating license')
        
        const updateData = { ...editForm.value }
        
        if (updateData.resetHwid) {
          updateData.hwid = null
          updateData.activatedAt = null
          updateData.activationCount = 0
        }
        
        delete updateData.resetHwid
        
        const response = await fetch(`/api/licenses/${editingLicense.value.key}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(updateData)
        })
        
        if (response.ok) {
          invalidateCache('licenses-list')
          invalidateCache('dashboard-licenses')
          await loadLicenses(true)
          closeEditModal()
          console.log('✅ License updated successfully')
        } else {
          const data = await response.json()
          updateError.value = data.error || 'Failed to update license'
        }
      } catch (error) {
        console.error('Failed to update license:', error)
        updateError.value = 'Network error. Please try again.'
      } finally {
        updating.value = false
      }
    }

    const closeEditModal = () => {
      showEditModal.value = false
      editingLicense.value = null
      editForm.value = {
        note: '',
        expiry: '',
        maxActivations: 1,
        isActive: true,
        resetHwid: false
      }
      updateError.value = ''
    }

    const deleteLicense = async (licenseKey) => {
      if (!canDeleteLicenses.value || !confirm(`Delete license ${licenseKey}?\n\nThis action cannot be undone.`)) return
      
      try {
        console.log('🌐 API call: Deleting license')
        const response = await fetch(`/api/licenses/${licenseKey}`, {
          method: 'DELETE',
          credentials: 'include'
        })
        
        if (response.ok) {
          invalidateCache('licenses-list')
          invalidateCache('dashboard-licenses')
          await loadLicenses(true)
          console.log('🗑️ License deleted successfully')
        } else {
          const data = await response.json()
          console.error('Failed to delete license:', data.error)
        }
      } catch (error) {
        console.error('Failed to delete license:', error)
      }
    }

    const getLicenseStatus = (license) => {
      if (!license.isActive) return 'Inactive'
      if (license.expiry && new Date(license.expiry) < new Date()) return 'Expired'
      if (license.hwid) return 'Active'
      return 'Pending'
    }

    const getLicenseStatusClass = (license) => {
      const status = getLicenseStatus(license)
      switch (status) {
        case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
        case 'Expired': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        case 'Inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
        case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      }
    }

    const formatDate = (dateInput) => {
      const date = dateInput instanceof Date ? dateInput : new Date(dateInput)
      return date.toLocaleDateString()
    }

    onMounted(() => {
      loadLicenses()
    })

    return {
      licenses,
      filteredLicenses,
      filteredLicenseCount,
      searchQuery,
      statusFilter,
      loading,
      creating,
      updating,
      bulkDeleting,
      lastUpdated,
      newLicense,
      createSuccess,
      role,
      canManageLicenses,
      canDeleteLicenses,
      selectedLicenses,
      showBulkDeleteModal,
      isAllSelected,
      isIndeterminate,
      showEditModal,
      editingLicense,
      editForm,
      updateError,
      loadLicenses,
      manualRefresh,
      createLicense,
      editLicense,
      updateLicense,
      closeEditModal,
      deleteLicense,
      toggleSelectAll,
      clearSelection,
      bulkDeleteLicenses,
      confirmBulkDelete,
      cancelBulkDelete,
      getLicenseStatus,
      getLicenseStatusClass,
      formatDate
    }
  }
}
</script>
