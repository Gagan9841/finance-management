import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  const isLoading = ref(false)
  const loadingCount = ref(0)

  const isGlobalLoading = computed(() => isLoading.value && loadingCount.value > 0)

  const startLoading = () => {
    loadingCount.value++
    isLoading.value = true
  }

  const stopLoading = () => {
    loadingCount.value = Math.max(0, loadingCount.value - 1)
    if (loadingCount.value === 0) {
      isLoading.value = false
    }
  }

  const resetLoading = () => {
    isLoading.value = false
    loadingCount.value = 0
  }

  return {
    isLoading,
    loadingCount,
    isGlobalLoading,
    startLoading,
    stopLoading,
    resetLoading,
  }
})
