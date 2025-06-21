<script setup lang="ts">
import { getDashboardData } from '@/api/dashboard/dashboard'
import { useResponse } from '@/composables/useResponse'
import type { AxiosError } from 'axios'
import type { ApiResponse } from '@/types/response'
import { onMounted, ref } from 'vue'

const { handleError } = useResponse<unknown>()

const dashboardData = ref<unknown>(null)
const loadDashboardData = async () => {
  await getDashboardData()
    .then((res) => {
      dashboardData.value = res.data
    })
    .catch((err: AxiosError<ApiResponse<unknown>>) => {
      handleError(err)
    })
}

onMounted(async () => {
  await loadDashboardData()
})
</script>

<template>
  <main>
    <div class="flex flex-col gap-4">
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <p>{{ dashboardData }}</p>
    </div>
  </main>
</template>
