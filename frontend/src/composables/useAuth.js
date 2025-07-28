import { ref, computed } from 'vue'

const user = ref(null)
const role = ref(null)
const isAuthenticated = ref(false)

export function useAuth() {
  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/check', { credentials: 'include' })
      const data = await response.json()
      
      if (data.authenticated) {
        user.value = data.user
        role.value = data.role
        isAuthenticated.value = true
      } else {
        user.value = null
        role.value = null
        isAuthenticated.value = false
      }
      
      return data.authenticated
    } catch (error) {
      console.error('Auth check failed:', error)
      user.value = null
      role.value = null
      isAuthenticated.value = false
      return false
    }
  }

  const login = async (username, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      })
      
      const data = await response.json()
      
      if (data.success) {
        user.value = username
        role.value = data.role
        isAuthenticated.value = true
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      user.value = null
      role.value = null
      isAuthenticated.value = false
    }
  }

  // Permission checking functions
  const hasPermission = (requiredRole) => {
    if (!role.value) return false
    
    const roleHierarchy = {
      'admin': ['admin', 'operator', 'viewer'],
      'operator': ['operator', 'viewer'],
      'viewer': ['viewer']
    }
    
    return roleHierarchy[role.value]?.includes(requiredRole) || false
  }

  const isAdmin = computed(() => role.value === 'admin')
  const isOperator = computed(() => hasPermission('operator'))
  const isViewer = computed(() => hasPermission('viewer'))
  const canManageUsers = computed(() => isAdmin.value)
  const canManageLicenses = computed(() => hasPermission('operator'))
  const canDeleteLicenses = computed(() => isAdmin.value)
  const canManageSettings = computed(() => isAdmin.value)
  const canUnbanHwids = computed(() => isAdmin.value)

  return {
    user: computed(() => user.value),
    role: computed(() => role.value),
    isAuthenticated: computed(() => isAuthenticated.value),
    checkAuth,
    login,
    logout,
    hasPermission,
    isAdmin,
    isOperator,
    isViewer,
    canManageUsers,
    canManageLicenses,
    canDeleteLicenses,
    canManageSettings,
    canUnbanHwids
  }
}
