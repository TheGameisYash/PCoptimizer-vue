<template>
  <ModernLayout>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Bulk License Generator</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">
        Generate multiple licenses with advanced configuration options
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Bulk Generator -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Bulk License Generator</h3>
        
        <form @submit.prevent="generateBulkLicenses" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Number of Licenses
            </label>
            <input
              v-model.number="bulkConfig.count"
              type="number"
              min="1"
              max="1000"
              class="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              License Prefix
            </label>
            <input
              v-model="bulkConfig.prefix"
              type="text"
              class="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., PRO, TRIAL, PREMIUM"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              License Duration
            </label>
            <select
              v-model="bulkConfig.duration"
              class="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No Expiry</option>
              <option value="7">7 Days</option>
              <option value="30">30 Days</option>
              <option value="90">90 Days</option>
              <option value="365">1 Year</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div v-if="bulkConfig.duration === 'custom'">
            <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Custom Expiry Date
            </label>
            <input
              v-model="bulkConfig.customExpiry"
              type="date"
              class="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Max Activations per License
            </label>
            <input
              v-model.number="bulkConfig.maxActivations"
              type="number"
              min="1"
              max="10"
              class="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Notes/Description
            </label>
            <textarea
              v-model="bulkConfig.note"
              rows="3"
              class="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Batch description..."
            ></textarea>
          </div>

          <button :disabled="generating" class="btn-primary w-full">
            {{ generating ? `Generating... ${progress}%` : 'Generate Licenses' }}
          </button>
        </form>
      </div>

      <!-- Export Options -->
      <div class="space-y-6">
        <!-- Generated Licenses Preview -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Generated Licenses</h3>
          
          <div v-if="generatedLicenses.length > 0" class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ generatedLicenses.length }} licenses generated
              </span>
              <div class="space-x-2">
                <button @click="exportToCSV" class="btn-secondary text-sm">Export CSV</button>
                <button @click="exportToJSON" class="btn-secondary text-sm">Export JSON</button>
                <button @click="copyToClipboard" class="btn-secondary text-sm">Copy All</button>
              </div>
            </div>
            
            <div class="max-h-64 overflow-y-auto bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div v-for="license in generatedLicenses.slice(0, 10)" :key="license" class="font-mono text-sm py-1">
                {{ license }}
              </div>
              <div v-if="generatedLicenses.length > 10" class="text-sm text-gray-500 mt-2">
                ... and {{ generatedLicenses.length - 10 }} more
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
            No licenses generated yet
          </div>
        </div>

        <!-- License Templates -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Templates</h3>
          
          <div class="space-y-3">
            <button @click="applyTemplate('trial')" class="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <div class="font-medium">7-Day Trial</div>
              <div class="text-sm text-gray-500">TRIAL prefix, 7 days, 1 activation</div>
            </button>
            
            <button @click="applyTemplate('premium')" class="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <div class="font-medium">Premium Annual</div>
              <div class="text-sm text-gray-500">PRO prefix, 1 year, 3 activations</div>
            </button>
            
            <button @click="applyTemplate('lifetime')" class="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <div class="font-medium">Lifetime License</div>
              <div class="text-sm text-gray-500">LIFE prefix, no expiry, 5 activations</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </ModernLayout>
</template>

<script>
import { ref } from 'vue'
import ModernLayout from '../components/ModernLayout.vue'

export default {
  components: { ModernLayout },
  setup() {
    const bulkConfig = ref({
      count: 10,
      prefix: 'LIC',
      duration: '30',
      customExpiry: '',
      maxActivations: 1,
      note: ''
    })
    
    const generatedLicenses = ref([])
    const generating = ref(false)
    const progress = ref(0)

    const generateBulkLicenses = async () => {
      generating.value = true
      progress.value = 0
      generatedLicenses.value = []

      try {
        for (let i = 0; i < bulkConfig.value.count; i++) {
          const response = await fetch('/api/licenses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              prefix: bulkConfig.value.prefix,
              expiry: calculateExpiry(),
              note: `${bulkConfig.value.note} (Batch ${Date.now()})`,
              maxActivations: bulkConfig.value.maxActivations
            })
          })
          
          const result = await response.json()
          if (result.success) {
            generatedLicenses.value.push(result.licenseKey)
          }
          
          progress.value = Math.round(((i + 1) / bulkConfig.value.count) * 100)
          
          // Small delay to prevent overwhelming the server
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      } catch (error) {
        console.error('Bulk generation error:', error)
      } finally {
        generating.value = false
        progress.value = 0
      }
    }

    const calculateExpiry = () => {
      if (!bulkConfig.value.duration) return null
      if (bulkConfig.value.duration === 'custom') return bulkConfig.value.customExpiry
      
      const days = parseInt(bulkConfig.value.duration)
      const expiry = new Date()
      expiry.setDate(expiry.getDate() + days)
      return expiry.toISOString().split('T')[0]
    }

    const applyTemplate = (template) => {
      switch (template) {
        case 'trial':
          bulkConfig.value = { ...bulkConfig.value, prefix: 'TRIAL', duration: '7', maxActivations: 1 }
          break
        case 'premium':
          bulkConfig.value = { ...bulkConfig.value, prefix: 'PRO', duration: '365', maxActivations: 3 }
          break
        case 'lifetime':
          bulkConfig.value = { ...bulkConfig.value, prefix: 'LIFE', duration: '', maxActivations: 5 }
          break
      }
    }

    const exportToCSV = () => {
      const csv = 'License Key\n' + generatedLicenses.value.join('\n')
      downloadFile(csv, 'licenses.csv', 'text/csv')
    }

    const exportToJSON = () => {
      const json = JSON.stringify(generatedLicenses.value, null, 2)
      downloadFile(json, 'licenses.json', 'application/json')
    }

    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(generatedLicenses.value.join('\n'))
        alert('Licenses copied to clipboard!')
      } catch (error) {
        console.error('Copy failed:', error)
      }
    }

    const downloadFile = (content, filename, mimeType) => {
      const blob = new Blob([content], { type: mimeType })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }

    return {
      bulkConfig,
      generatedLicenses,
      generating,
      progress,
      generateBulkLicenses,
      applyTemplate,
      exportToCSV,
      exportToJSON,
      copyToClipboard
    }
  }
}
</script>
