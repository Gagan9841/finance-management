<script setup lang="ts">
import type { Statistics } from '@/types/dashboard'

defineProps<{
  stats: Statistics[]
}>()
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    <template v-for="(stat, index) in stats" :key="index">
      <Card
        class="min-w-0 py-6 px-4"
        :class="index === 0 ? 'bg-secondary text-white rounded-xl' : 'rounded-b-xl bg-muted'"
      >
        <CardContent class="flex px-10 items-center justify-between gap-x-6">
          <div class="flex-shrink-0 rounded-full bg-muted-foreground/10 p-2">
            <Iconify
              :icon="stat.icon"
              :class="index === 0 ? 'text-yellow-300' : ''"
              class="w-6 h-6"
            />
          </div>
          <div class="flex-1 gap-3 min-w-0">
            <p class="text-sm font-medium text-muted-foreground truncate">
              {{ stat.title }}
            </p>
            <p class="text-xl font-bold mt-1 truncate">
              {{ stat.value }}
            </p>
          </div>
        </CardContent>
      </Card>
    </template>
  </div>
</template>
