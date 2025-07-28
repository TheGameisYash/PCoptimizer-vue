<template>
  <ModernLayout>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">
        Manage admin users and access permissions
      </p>
    </div>

    <!-- Add User Section -->
    <div class="card p-6 mb-8">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New User</h3>
      
      <form @submit.prevent="addUser" class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          v-model="newUser.username"
          type="text"
          placeholder="Username"
          class="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          v-model="newUser.email"
          type="email"
          placeholder="Email"
          class="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <select
          v-model="newUser.role"
          class="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="admin">Admin</option>
          <option value="operator">Operator</option>
          <option value="viewer">Viewer</option>
        </select>
        <button :disabled="adding" class="btn-primary">
          {{ adding ? 'Adding...' : 'Add User' }}
        </button>
      </form>

      <!-- Success Message -->
      <div v-if="tempPassword" class="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <div>
            <p class="text-green-800 dark:text-green-200 font-medium">User created successfully!</p>
            <p class="text-green-700 dark:text-green-300 text-sm mt-1">
              Temporary password: <span class="font-mono bg-green-100 dark:bg-green-800 px-2 py-1 rounded">{{ tempPassword }}</span>
            </p>
            <p class="text-green-600 dark:text-green-400 text-xs mt-1">User will be required to change password on first login.</p>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-red-600 dark:text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-red-800 dark:text-red-200">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="card overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Users</h3>
          <div class="flex space-x-2">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search users..."
              class="rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button @click="loadUsers" :disabled="loading" class="btn-secondary text-sm">
              {{ loading ? 'Loading...' : 'Refresh' }}
            </button>
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
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Login</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/40">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {{ user.username.charAt(0).toUpperCase() }}
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ user.username }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span :class="getRoleBadgeClass(user.role)" class="px-2 py-1 text-xs font-semibold rounded-full">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span :class="user.active ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'" class="px-2 py-1 text-xs font-semibold rounded-full">
                  {{ user.active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">
                {{ user.lastLogin ? formatDate(user.lastLogin) : 'Never' }}
              </td>
              <td class="px-6 py-4 text-sm space-x-2">
                <button @click="toggleUserStatus(user)" :disabled="loading" class="text-blue-600 hover:text-blue-900">
                  {{ user.active ? 'Deactivate' : 'Activate' }}
                </button>
                <button @click="showResetPasswordModal(user)" class="text-green-600 hover:text-green-900">
                  Reset Password
                </button>
                <button @click="deleteUser(user)" :disabled="loading" class="text-red-600 hover:text-red-900">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Reset Password Modal -->
    <div v-if="showPasswordModal" class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Reset Password for {{ selectedUser?.username }}
          </h3>
          
          <form @submit.prevent="resetPassword" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Password
              </label>
              <input
                v-model="newPassword"
                type="password"
                required
                minlength="6"
                class="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password (min 6 characters)"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                v-model="confirmPassword"
                type="password"
                required
                class="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm new password"
              />
            </div>

            <div v-if="passwordError" class="text-red-600 text-sm">
              {{ passwordError }}
            </div>
            
            <div class="flex space-x-4 pt-4">
              <button type="submit" :disabled="resettingPassword" class="btn-primary flex-1">
                {{ resettingPassword ? 'Resetting...' : 'Reset Password' }}
              </button>
              <button type="button" @click="closePasswordModal" class="btn-secondary flex-1">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </ModernLayout>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import ModernLayout from '../components/ModernLayout.vue'

export default {
  components: { ModernLayout },
  setup() {
    const users = ref([])
    const newUser = ref({
      username: '',
      email: '',
      role: 'operator'
    })
    const searchQuery = ref('')
    const adding = ref(false)
    const loading = ref(false)
    const error = ref('')
    const tempPassword = ref('')

    // Password reset modal
    const showPasswordModal = ref(false)
    const selectedUser = ref(null)
    const newPassword = ref('')
    const confirmPassword = ref('')
    const passwordError = ref('')
    const resettingPassword = ref(false)

    const filteredUsers = computed(() => {
      if (!searchQuery.value) return users.value
      return users.value.filter(user => 
        user.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    })

    const loadUsers = async () => {
      loading.value = true
      try {
        const response = await fetch('/api/users', { credentials: 'include' })
        const data = await response.json()
        
        if (response.ok) {
          users.value = data
        } else {
          error.value = data.error || 'Failed to load users'
        }
      } catch (err) {
        error.value = 'Network error. Please try again.'
      } finally {
        loading.value = false
      }
    }

    const addUser = async () => {
      adding.value = true
      error.value = ''
      tempPassword.value = ''
      
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(newUser.value)
        })
        
        const data = await response.json()
        
        if (response.ok) {
          users.value.unshift(data.user)
          tempPassword.value = data.tempPassword
          newUser.value = { username: '', email: '', role: 'operator' }
          
          // Clear temp password after 30 seconds
          setTimeout(() => {
            tempPassword.value = ''
          }, 30000)
        } else {
          error.value = data.error || 'Failed to create user'
        }
      } catch (err) {
        error.value = 'Network error. Please try again.'
      } finally {
        adding.value = false
      }
    }

    const toggleUserStatus = async (user) => {
      if (loading.value) return
      loading.value = true
      
      try {
        const response = await fetch(`/api/users/${user.id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ active: !user.active })
        })
        
        if (response.ok) {
          user.active = !user.active
        } else {
          const data = await response.json()
          error.value = data.error || 'Failed to update user status'
        }
      } catch (err) {
        error.value = 'Network error. Please try again.'
      } finally {
        loading.value = false
      }
    }

    const showResetPasswordModal = (user) => {
      selectedUser.value = user
      showPasswordModal.value = true
      newPassword.value = ''
      confirmPassword.value = ''
      passwordError.value = ''
    }

    const closePasswordModal = () => {
      showPasswordModal.value = false
      selectedUser.value = null
      newPassword.value = ''
      confirmPassword.value = ''
      passwordError.value = ''
    }

    const resetPassword = async () => {
      passwordError.value = ''
      
      if (newPassword.value !== confirmPassword.value) {
        passwordError.value = 'Passwords do not match'
        return
      }
      
      if (newPassword.value.length < 6) {
        passwordError.value = 'Password must be at least 6 characters long'
        return
      }
      
      resettingPassword.value = true
      
      try {
        const response = await fetch(`/api/users/${selectedUser.value.id}/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ newPassword: newPassword.value })
        })
        
        const data = await response.json()
        
        if (response.ok) {
          closePasswordModal()
          alert(`Password has been reset successfully for ${selectedUser.value.username}`)
        } else {
          passwordError.value = data.error || 'Failed to reset password'
        }
      } catch (err) {
        passwordError.value = 'Network error. Please try again.'
      } finally {
        resettingPassword.value = false
      }
    }

    const deleteUser = async (user) => {
      if (!confirm(`Are you sure you want to delete user ${user.username}? This action cannot be undone.`)) return
      
      loading.value = true
      
      try {
        const response = await fetch(`/api/users/${user.id}`, {
          method: 'DELETE',
          credentials: 'include'
        })
        
        if (response.ok) {
          users.value = users.value.filter(u => u.id !== user.id)
        } else {
          const data = await response.json()
          error.value = data.error || 'Failed to delete user'
        }
      } catch (err) {
        error.value = 'Network error. Please try again.'
      } finally {
        loading.value = false
      }
    }

    const getRoleBadgeClass = (role) => {
      switch (role) {
        case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        case 'operator': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
        case 'viewer': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      }
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString() + ' ' + 
             new Date(dateString).toLocaleTimeString()
    }

    onMounted(() => {
      loadUsers()
    })

    return {
      users,
      newUser,
      searchQuery,
      adding,
      loading,
      error,
      tempPassword,
      filteredUsers,
      showPasswordModal,
      selectedUser,
      newPassword,
      confirmPassword,
      passwordError,
      resettingPassword,
      loadUsers,
      addUser,
      toggleUserStatus,
      showResetPasswordModal,
      closePasswordModal,
      resetPassword,
      deleteUser,
      getRoleBadgeClass,
      formatDate
    }
  }
}
</script>
