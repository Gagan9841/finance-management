<script setup lang="ts">
import type { Statistics } from '@/types/dashboard'

defineProps<{
  stats: Statistics[]
}>()
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <Card v-for="stat in stats" :key="stat.title" class="min-w-0 py-2">
      <CardContent class="p-4">
        <div class="flex items-center justify-between gap-3">
          <div class="flex-shrink-0 p-2 rounded-full bg-muted/50">
            <Iconify :icon="stat.icon" class="w-5 h-5" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-medium text-muted-foreground truncate">
              {{ stat.title }}
            </p>
            <p class="text-xl font-bold mt-1 truncate">
              {{ stat.value }}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
