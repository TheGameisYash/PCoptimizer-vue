import { ref, reactive } from 'vue'

const cache = reactive({})
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export function useCache() {
  const get = (key) => {
    const item = cache[key]
    if (!item) return null
    
    // Check if cache is expired
    if (Date.now() - item.timestamp > CACHE_DURATION) {
      delete cache[key]
      return null
    }
    
    return item.data
  }

  const set = (key, data, customDuration = CACHE_DURATION) => {
    cache[key] = {
      data,
      timestamp: Date.now(),
      duration: customDuration
    }
  }

  const invalidate = (key) => {
    delete cache[key]
  }

  const clear = () => {
    Object.keys(cache).forEach(key => delete cache[key])
  }

  return { get, set, invalidate, clear }
}
