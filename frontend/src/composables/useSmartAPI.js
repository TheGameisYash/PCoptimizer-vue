import { ref, onMounted, onUnmounted } from 'vue'
import { useCache } from './useCache'

export function useSmartAPI() {
  const { get: getCached, set: setCached, invalidate } = useCache()
  const loading = ref(false)
  const error = ref(null)
  
  // Debounce function to prevent rapid API calls
  const debounce = (func, delay) => {
    let timeoutId
    return (...args) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func.apply(null, args), delay)
    }
  }

  // Smart fetch that uses cache first
  const smartFetch = async (url, options = {}, cacheKey = url, forceRefresh = false) => {
    // Check cache first unless force refresh
    if (!forceRefresh) {
      const cached = getCached(cacheKey)
      if (cached) {
        console.log(`📋 Cache hit for ${cacheKey}`)
        return cached
      }
    }

    // Only make API call if not in cache
    loading.value = true
    error.value = null
    
    try {
      console.log(`🌐 API call for ${cacheKey}`)
      const response = await fetch(url, {
        credentials: 'include',
        ...options
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Cache the result
      setCached(cacheKey, data)
      
      return data
    } catch (err) {
      error.value = err.message
      console.error(`❌ API error for ${cacheKey}:`, err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Debounced version for user interactions
  const debouncedFetch = debounce(smartFetch, 300)

  return {
    loading,
    error,
    smartFetch,
    debouncedFetch,
    invalidateCache: invalidate
  }
}
