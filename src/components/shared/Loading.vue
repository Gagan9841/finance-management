<template>
  <div>
    <div v-if="isLoading" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLoadingStore } from '@/stores/loadingStore'

const { isLoading } = useLoadingStore()
</script>
